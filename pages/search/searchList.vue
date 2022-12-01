<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg"></image>
				<input type="text" placeholder="请输入关键词搜索" v-model="keyword" @input="onSearch" class="lself" placeholder-style="color:#999">
			</view>
		</view>
		
		<!-- 客户 -->
		<view v-if="type == 1 || type == 0">
			<view class="tablabel">
				<image :src="BASE_IMG_URL+'/index/lxr_gonghai.png'"></image>
				<view class="item_content">
					<view>公海客户</view>
					<view class="number">共{{waterList.length}}个客户</view>
				</view>
			</view>
			<water-item :list="waterList"></water-item>
		</view>
		<!-- 我的客户 -->
		 <view v-if="type == 2 || type == 0">
			<view class="tablabel">
				<image :src="BASE_IMG_URL+'/index/icon2_a.png'"></image>
				<view class="item_content">
					<view>我的客户</view>
					<view class="number">共{{customerList.length}}个客户</view>
				</view>
			</view>
			
			<customer-item :list="customerList"></customer-item>
		</view>
		<!-- 工单 -->
		<view v-if="type == 3 || type == 0">
			<view class="tablabel">
				<image :src="BASE_IMG_URL+'/index/lxr_gongdan.png'"></image>
				<view class="item_content">
					<view>工单</view>
					<view class="number">共{{salesList.length}}个工单</view>
				</view>
			</view>
			<sales-item :list="salesList"></sales-item>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import waterItem from '@/pages/index/waterCustomer/item.vue'
	import customerItem from '@/pages/index/myCustomer/item.vue'
	import salesItem from '@/pages/index/afterSales/list.vue'
	import { netKehuList, netSeasKehuList, netWorkOrderList } from '@/api/api.js'
	
	export default{
		components:{
			waterItem,
			customerItem,
			salesItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				type:0,   //0全部   1公海客户   2我的客户  3工单
				keyword:'',
				waterList:[],  //公海客户
				customerList:[],  //我的客户
				salesList:[],   //工单列表
				
				description:'',
				taskActions: [
					{name:'普通任务',color:'#3478f7'},
					{name:'跟进任务',color:'#3478f7'}
				],
			}
		},
		onLoad(options) {
			this.type = options.type
			this.keyword = options.word
			if(this.keyword){
				this.getList()
			}
		},
		methods:{
			onInputCancel() {
				uni.navigateBack({
					delta:1
				})
			},
			onSearch(e) {
				this.keyword = e.detail.value
				let searlist = uni.getStorageSync('searchword')
				if(searlist){
					if(searlist.indexOf(this.keyword) != -1) {
						let index = searlist.indexOf(this.keyword)
						searlist.splice(index,1)
					}
					if(searlist.length >= 10) {
						searlist.shift()
						searlist.push(this.keyword)
					}else{
						searlist.push(this.keyword)
					}
				}else{
					searlist = []
					searlist.push(this.keyword)
				}
				uni.setStorageSync('searchword',searlist)
				this.getList()
			},
			getList() {
				let params = {
					name: this.keyword
				}
				if(this.type == 1 || this.type == 0) {
					this.getGonghai(params)
				}
				if(this.type == 2 || this.type == 0) {
					this.getCustomer(params)
				}
				if(this.type == 3 || this.type == 0) {
					this.getSaleList(params)
				}
			},
			getGonghai(params) {
				params = {is_seas: 1,...params}
				netSeasKehuList(params).then(res=>{
					this.waterList = res.data.data
				})
			},
			getCustomer(params) {
				netKehuList(params).then(res=>{
					this.customerList = res.data.data
				})
			},
			getSaleList(params) {
				netWorkOrderList(params).then(res=>{
					this.salesList = res.data.data
				})
			},
			// 跟进
			followClick(id,type) {
				uni.navigateTo({
					url:'/pagesA/crm/customerManagement/newFllow/newFllow?id='+id+'&type='+type
				})
			},
			// 联系人
			linkmanClick(id) {
				uni.navigateTo({
					url:'/pagesA/crm/linkman/newLinkman/newLinkman?id='+id
				})
			},
			//客户 更多
			toKehuMore(id) {
				uni.navigateTo({
					url: '/pages/index/groupCompany/groupCompany?id='+id
				})
			},
			// 线索  更多
			moreClick(item) {
				uni.navigateTo({
					url:'/pagesA/crm/cluesManagement/cluesMore/cluesMore?id='+item.id
				})
			},
			// 联系人 更多
			toMore(id) {
				uni.navigateTo({
					url: "/pages/index/groupCompany/contact/contactDetail?id=" + id
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.searbox{
		padding:10rpx 0 20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background:$uni-btn-bg-color;
		.censear{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 24rpx;
			border-radius: 34rpx;
			background:#FFFFFF;
			width:584rpx;
			height:68rpx;
			.searimg{
				width:48rpx;
				height:48rpx;
			}
			.lself{
				font-size:26rpx;
				color:#999;
				width:500rpx;
			}
		}
	}
	.tablabel{
		padding:20rpx 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background:#fff;
		image {
			width: 50rpx;
			height: 50rpx;
			background-color: #fff;
		}
		.item_content{
			font-size:28rpx;
			color:#333;
			margin-left:15rpx;
			.number{
				font-size:24rpx;
				color:#999;
				margin-top:10rpx;
			}
		}
	}
	.clineInfo {
		margin: 0 30rpx;
		background-color: #fff;
		padding: 30rpx 24rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
		.info_head {
			display: flex;
			justify-content: space-between;
			:first-child {
				font-size: 28rpx;
				font-weight: 700;
				color: #999;
			}
			:last-child {
				&::before {
					position: relative;
					display: block;
					content: '';
					width: 10rpx;
					height: 10rpx;
					top: 24rpx;
					left: -22rpx;
					background-color: #52c1f5;
					border-radius: 5rpx;
				}
			}
		}
		.info_head_con{
			display: flex;
			justify-content: space-between;
			margin-bottom:20rpx;
			.head_name{
				.head_name {
					font-size: 28rpx;
					font-weight: 700;
					color: #999;
				}
			}
			.head_import {
				color: #f95e5a;
				border: 1rpx solid #f95e5a;
				padding: 4rpx 10rpx;
				border-radius: 10rpx;
			}
		}
		.info_main_con {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			color: #666;
			padding: 0 30rpx 20rpx;
			border-bottom:1rpx solid #CCC;
			margin-bottom:15rpx;
			.left_star {
				display: flex;
				width: 50%;
				line-height: 60rpx;
			}
		}
		.info_main {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.left_star {
				display: flex;
				padding-bottom: 20rpx;
			}
			.main_left {
				.left_followUp {
					display: flex;
					padding: 20rpx 0;
				}
	
				.left_star {
					display: flex;
					padding-bottom: 20rpx;
				}
			}
	
			.main_right {
				text-align: center;
				padding: 20rpx 20rpx 0 0;
	
				image {
					width: 44rpx;
					height: 44rpx;
					margin-bottom: 5rpx;
				}
			}
		}
	
		.info_footer {
			display: flex;
			justify-content: space-between;
			padding-top: 10rpx;
			height: 28rpx;
	
			.footer_content {
				// width: 25%;
				line-height: 28rpx;
				display: flex;
				justify-content: center;
	
				.icon-iconmore-copy,
				.icon-follow {
					font-size: 22rpx;
				}
	
				.icon-follow,
				.icon-task,
				.icon-tel {
					margin-right: 5rpx;
				}
	
				.icon-iconmore-copy {
					margin-left: 5rpx;
					margin-top: 2rpx;
				}
			}
		}
	}
</style>
