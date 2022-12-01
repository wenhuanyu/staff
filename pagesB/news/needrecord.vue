<template>
	<view>
		<view class="tab_list">
			<!-- <view class="tabli" :class="staff_type == 0 ? 'tabliactive' : ''" @click="changeFirTab(0)">全部</view> -->
			<view class="tabli" :class="staff_type == 1 ? 'tabliactive' : ''" @click="changeFirTab(1)">我负责的</view>
			<view class="tabli" :class="staff_type == 2 ? 'tabliactive' : ''" @click="changeFirTab(2)">下属负责的</view>
		</view>
		<view class="querylist">
			<view class="queryfir">
				<picker  @change="changeRead" :range="readList" :value="readIndex" :range-key="'name'">
					<view class="form_right">
						<view>{{readList[readIndex] ? readList[readIndex].name : '请选择'}}</view>
						<image :src="BASE_IMG_URL+'/newxia.png'" class="bottomimg"  mode="scaleToFill"></image>
					</view>
				</picker>
			</view>
		</view>
		<view class="fllow_item" v-for="(item,index) in lists" :key="index">
			<view class="unread" v-if="item.is_read != 1"></view>
			<view class="item_content" @click.stop="clientClick(item,index)">
				<view class="con_img">
					<image :src="item.staff.img ? item.staff.img :BASE_IMG_URL+ '/headImg.png'" class="headerimg"  mode="scaleToFill"></image>
					<view class="main_first">
						<view class="main_title">
							<view class="first_left">
								<view>{{item.staff.name}}</view>
								<view class="fontColor">{{item.staff.post?item.staff.post:''}}</view>
							</view>
							<view class="main_type daofang" v-if="item.follow_type == '到访'">{{item.follow_type}}</view>
							<view class="main_type genjin" v-if="item.follow_type == '跟进'">{{item.follow_type}}</view>
							<view class="main_type other" v-if="item.follow_type != '跟进' && item.follow_type != '到访'">{{item.follow_type}}</view>
						</view>
						<view class="fontColor main_time">{{item.follow_time}}</view>
					</view>
				</view>
				<view class="con_main" >
					<view class="main_second">
						<view>{{item.content}}</view>
					</view>
					<view class="main_img" v-if="item.file.length != 0" @tap.stop.prevent>
						<image 
							:src="ele.file_path" 
							v-for="(ele,fileindex) in item.file" 
							:key="fileindex" 
							v-if="ele.types == 'image'" 
							class="imgbox" 
							 mode="scaleToFill"
							@click.stop="toPrevieImg(ele.file_path)"
						></image>
					</view>
					<view class="main_third fontColor" v-if="item.next_time != null">
						<view class="third_left" >
							<view class="lxs_time">下次跟进时间：{{item.next_time}}</view>
						</view>
						<view class="third_right">
							<view class="iconfont icon-you"></view>
						</view>
					</view>
					<view class="customer" @tap.stop="toMore(item.customer.id,1)">{{typename}}：<span style="color:#008EFF">{{item.customer && item.customer.name ? item.customer.name : '--'}}</span></view>
				</view>
				<!-- <view class="folbtn" @click.stop.prevent>
					<view class="btnbox" @click="toContinue(item)">
						<image :src="BASE_IMG_URL+'tj.png'"></image>
						跟进
					</view>
				</view> -->
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="noData" v-if="lists.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { daibanKehuFollow } from '@/api/api.js'
	export default {
		data() {
			return {
				page:1,
				limit:10,
				totalPage:1,
				readIndex:0,
				BASE_IMG_URL:BASE_IMG_URL,
				lists:[],
				readList:[
					{id:4,name:'今天'},
					{id:1,name:'7天'},
					{id:2,name:'14天'},
					{id:3,name:'30天'},
					{id:0,name:'全部'},
				],
				type:0,
				typename:'客户',
				staff_type:1,   //0:全部 1：我负责的 2：下属负责的
			}
		},
		onLoad(params) {
			this.type = params.type
			if(params.type == 6){
				this.typename='合同';
			}else if(params.type == 7){
				this.typename='线索';
			}else if(params.type == 8){
				this.typename='联系人';
			}else if(params.type == 9){
				this.typename='商机';
			}else{
				this.typename='客户';
			}
		},
		onShow() {
			this.init()
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods: {
			changeFirTab(type) {
				this.staff_type = type
				this.init()
			},
			toMore(id,type){
				let infotype = this.type;
				if(infotype == 6){
					//合同
					uni.navigateTo({
						url: '/pages/index/contractManagements/contractDetail?id=' + id,
					})
				}else if(infotype == 7){
					//线索
					uni.navigateTo({
						url:'/pagesB/cluesManagement/cluesMore/cluesMore?id='+id
					})
					
				}else if(infotype == 8){
					//联系人
					uni.navigateTo({
						url: '/pagesA/customerInfo/contact/contactDetail?id=' + id
					})
					
				}else if(infotype == 9){
					//商机
					uni.navigateTo({
						url: '/pagesB/business/detail?id='+id
					})
				}else{
					//客户
					uni.navigateTo({
						url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+ id
					})
				}
			},
			changeRead(e) {
				this.readIndex = e.detail.value
				this.init()
			},
			init() {
				this.page = 1
				this.lists = []
				this.getList()
			},
			getList() {
				let params = {
					page: this.page,
					limit: this.limit,
					time: this.readList[this.readIndex].id,
					type:this.type,
					staff_type:this.staff_type
				}
				daibanKehuFollow(params).then(res=>{
					this.lists = this.lists.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//查看 图片
			toPrevieImg(file) {
				uni.previewImage({
					urls: [file]
				})
			},
			// 跳转到详情页面
			clientClick(item,index) {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/followUpDetail/followUpDetail?id='+item.id,
					success:()=>{
						let arr = this.lists
						arr[index].is_read = 1
						this.lists = arr
					}
				})
			},
			//处理跟进
			toContinue(item) {
				uni.navigateTo({
					url:'/pagesA/crm/followRecord/handle?id='+item.id+'&relation_id='+item.relation_id+'&relation_type='+item.relation_type
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss">
	.tab_list{
		width:750rpx;
		height:80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background:#fff;
		.tabli{
			font-size:24rpx;
			color:#333;
			line-height: 75rpx;
			text-align: center;
			border-bottom:4rpx solid #fff;
		}
		.tabliactive{
			border-bottom:4rpx solid $uni-text-color;
		}
	}
	.folbtn{
		border-top: 1rpx solid #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top:24rpx;
		margin-top:24rpx;
		.btnbox{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:#333;
			image{
				width: 48rpx;
				height: 48rpx;
				margin-right: 15rpx;
			}
		}
	}
	.querylist{
		margin:40rpx 0 30rpx;
		padding:0 30rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.queryfir{
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			background:#fff;
			border-radius: 8rpx;
		}
		.form_right{
			width:180rpx;
			height:50rpx;
			font-size:22rpx;
			color:#666;
			text-align: center;
			line-height: 48rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.bottomimg{
				width:20rpx;
				height:33rpx;
				margin-left:15rpx;
			}
		}
	}
	.fllow_item {
		position: relative;
		.unread{
			width:10rpx;
			height:10rpx;
			border-radius: 50%;
			position: absolute;
			right:5rpx;
			top:5rpx;
			background:#F43F3B;
		}
		.item_data {
			margin: 30rpx 0;
	
			&::before {
				content: '';
				display: inline-block;
				margin: 0 15rpx 0 24rpx;
				width: 20rpx;
				height: 20rpx;
				border-radius: 10rpx;
				border: 2rpx solid $uni-text-color;
			}
		}
	
		.item_content {
			display: block;
			background-color: #fff;
			padding: 24rpx 24rpx; 
			border-radius: 10rpx;
			margin-bottom: 30rpx;
	
			.con_img {
				display: flex;
				.main_first {
					margin-bottom: 25rpx;
					padding-left: 25rpx;
					flex: 1;
					.main_time{
						line-height: 25px;
					}
					.main_title{
						display: flex;
						width: 100%;
						justify-content: space-between;
						.first_left {
							display: flex;
						
							:first-child {
								font-size: 32rpx;
								margin-right: 10rpx;
								margin-top: -3rpx;
							}
						
							:last-child {
								margin-top: 2rpx;
							}
						}
						.main_type{
							padding:5rpx 20rpx;
							border-radius: 10rpx;
							color:#fff;
						}
						.daofang{
							background:$uni-text-color;
						}
						.genjin{
							background:#ff7800;
						}
						.other{
							background:#1CBBB4;
						}
					}
					
				}
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}
	
			.con_main {
				flex: 1;
				.main_second{
					padding-bottom:20rpx;
				}
				
				.main_img{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;
					margin-top: 20rpx;
					.imgbox{
						padding: 10rpx;
						border-radius: 5rpx;
						border:1rpx solid #CCCCCC;
						width:160rpx;
						height:160rpx;
						margin-right:14rpx;
						margin-bottom:14rpx;
					}
				}
				.main_third {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 20rpx 0 10rpx;
	
					.third_left {
						display: flex;
						align-items: center;
						.icon-clock{
							font-size:32rpx;
						}
						.lxs_time{
							margin-left: 5px;
							font-size:26rpx;
						}
					}
					.third_right {
						display: flex;
						.right_num {
							display: flex;
							:last-child {
								margin-right: 20rpx;
							}
						}
	
						.icon-arrows_right {
							margin-top: -4rpx;
						}
					}
				}
	
				.main_fourth {
					padding-bottom: 10rpx;
				}
			}
		}
	}
	.fontColor {
		color: #999;
	}
	.customer{
		margin-top:15rpx;
	}
</style>
