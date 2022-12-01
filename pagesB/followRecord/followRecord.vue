<template>
	<view>
		<view class="tab_list">
			<view class="tabli" :class="type == 0 ? 'tabliactive' : ''" @click="changeFirTab(0)">全部</view>
			<view class="tabli" :class="type == 1 ? 'tabliactive' : ''" @click="changeFirTab(1)">我创建的</view>
			<view class="tabli" :class="type == 2 ? 'tabliactive' : ''" @click="changeFirTab(2)">下属创建的</view>
		</view>
		<!-- 筛选 -->
		<view class="searchbox">
			<view class="searchtext" @click="toQuery">筛选<view class="iconfont icon-shaixuan"></view></view>
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
					<view class="main_third fontColor" v-if="item.next_time != null">
						<view class="third_left" >
							<view class="lxs_time">下次跟进时间：{{item.next_time}}</view>
						</view>
						<view class="third_right">
							<view class="iconfont icon-you"></view>
						</view>
					</view>
					<view class="customer" v-if="item.relation_type == 1" @tap.stop="toMore(item.relation_id,1)">关联客户：<span style="color:#008EFF">{{item.relation_name ? item.relation_name : '--'}}</span></view>
					<view class="customer" v-if="item.relation_type == 2" @tap.stop="toContactDetail(item.relation_id)">关联联系人：<span style="color:#008EFF">{{item.relation_name ? item.relation_name : '--'}}</span></view>
					<view class="customer" v-if="item.relation_type == 3" @tap.stop="toContractDetail(item.relation_id)">关联合同：<span style="color:#008EFF">{{item.relation_name ? item.relation_name : '--'}}</span></view>
					<view class="customer" v-if="item.relation_type == 4" @tap.stop="toClues(item.relation_id)">关联线索：<span style="color:#008EFF">{{item.relation_name ? item.relation_name : '--'}}</span></view>
					<view class="customer" v-if="item.relation_type == 5" @tap.stop="toBusiness(item.relation_id)">关联商机：<span style="color:#008EFF">{{item.relation_name ? item.relation_name : '--'}}</span></view>
				</view>
				
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="noData" v-if="lists.length == 0">暂无更多</view>
		<!-- 创建用户图标 -->
		<view class="icon_creat" @click="toCreateFollow">
			<image :src="BASE_IMG_URL+'/1.png'" mode="scaleToFill"></image>
		</view>
		
		<screen-pop ref="popChild" @sureParams="sureParams"></screen-pop>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netKehuFollow } from '@/api/api.js'
	import screenPop from './screen.vue'
	export default {
		components:{
			screenPop
		},
		data() {
			return {
				page:1,
				limit:10,
				totalPage:1,
				BASE_IMG_URL:BASE_IMG_URL,
				lists:[],
				type:0,   //0全部   1我创建的   2下属创建的
				queryParams:{},
				timeArr:[],
				defaultObj:{times:''}
			}
		},
		onShow() {
			this.init()
		},
		onLoad(options) {
			if(options.times){
				this.defaultObj = {
					times: options.times,
				}
				this.type = options.type
			}
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods: {
			toQuery() {
				this.$refs.popChild.open(this.defaultObj)
			},
			sureParams(params) {
				this.queryParams = params
				this.defaultObj = {
					times: params.times
				}
				this.init()
			},
			changeFirTab(type) {
				this.type = type
				this.init()
			},
			init() {
				this.lists = []
				this.page = 1
				setTimeout(()=>{
					this.getList()
				},200)
			},
			
			getList() {
				let params = {
					page: this.page,
					limit: this.limit,
					type: this.type,
					times: this.defaultObj.times,
					...this.queryParams
				}
				netKehuFollow(params).then(res=>{
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
			//新增跟进
			toCreateFollow() {
				uni.navigateTo({
					url:'/pagesB/followRecord/addfollow'
				})
			},
			//客户详情
			toMore(id,type){
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+ id+'&type='+type,
				})
			},
			//联系人详情
			toContactDetail(id) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contact/contactDetail?id='+id
				})
			},
			//合同详情
			toContractDetail(id) {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractDetail?id='+id
				})
			},
			//线索详情
			toClues(id) {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/cluesMore/cluesMore?id='+id
				})
			},
			// 商机详情
			toBusiness(id) {
				uni.navigateTo({
					url:'/pagesB/business/detail?id='+id
				})
			},
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss">
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 130rpx;
		right: 100rpx;
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
	}
	.searchbox{
		display: flex;
		justify-content: flex-end;
		margin:24rpx;
		.searchtext{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:$uni-text-color;
			padding:8rpx 28rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			.icon-shaixuan{
				color:$uni-text-color;
			}
		}
	}
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
	.querylist{
		margin:24rpx 0;
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
					margin: 0rpx 0 10rpx;
	
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
