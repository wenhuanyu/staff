<template>
	<view class="">
		<view class="manage_con">
			<view class="clineInfo" v-for="(item,index) in list" :key="index" @click.stop="toDetail(item)">
				<view class="info_head">
					<view>{{item.name}}</view>
				</view>
				<view class="info_main">
					<view >
						<view class="main_left">
							<view class="left_top" v-if="item.customer" style="margin-top: 20rpx;color: #666;font-size: 30rpx;">
								{{item.customer ? item.customer.name : '--'}}
							</view>
							<view class="left_followUp" style="margin-top: 20rpx;color: #666;font-size: 30rpx;">
								<view>下次跟进时间：</view>
								<view>{{item.next_time ? item.next_time : '--'}}</view>
							</view>
							<view class="left_foot">
								<view class="l_box">
									<span v-if="item.type == 0">初期沟通</span>
									<span v-if="item.type == 1">立项跟踪</span>
									<span v-if="item.type == 2">方案/报价</span>
									<span v-if="item.type == 3">谈判审核</span>
									<span v-if="item.type == 4">赢单</span>
									<span v-if="item.type == 5">输单</span>
									<span v-if="item.type == 6">无效</span>
								</view>
							</view>
						</view>
					</view>
					<view class="main_right" v-if="item.owner_staff">
						<image :src="item.owner_staff ? item.owner_staff.img : BASE_IMG_URL+'/headImg.png'"  mode="scaleToFill">
						</image>
						<view>{{item.owner_staff?item.owner_staff.name:''}}</view>
					</view>
				</view>
				<view class="info_footer" @click.stop.prevent>
					<view class="footer_content" @click="toAddfollow(item)">
						<image :src="BASE_IMG_URL+'tj.png'"  mode="scaleToFill"></image>
						<view>跟进</view>
					</view>
					<view class="footer_content" @click="toTrans(item)">
						<image :src="BASE_IMG_URL+'rq.png'"  mode="scaleToFill"></image>
						<view>转移</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
		
		<view class="icon_creat" @click="addBusiness">
			<image :src="BASE_IMG_URL+'/1.png'" mode="scaleToFill"></image>
		</view>
		
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netBusinessList } from '@/api/api.js'
	
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
				id:'',  //客户id
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getList()
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++
				this.getList()
			}
		},
		methods:{
			getList() {
				let params = {
					page:this.page,
					customer_id:this.id
				}
				netBusinessList(params).then(res=>{
					this.list = res.data.data
					this.totalPage = res.data.last_page
				})
			},
			//添加跟进
			toAddfollow(item) {
				uni.navigateTo({
					url: '/pagesA/crm/customerManagement/newFllow/newFllow?id='+item.id+'&type=5'
				})
			},
			//转移商机
			toTrans(item) {
				uni.navigateTo({
					url:'/pagesA/business/trans?id='+item.id
				})
			},
			addBusiness(){
				uni.navigateTo({
					url:'/pagesA/business/addBusiness?id='+this.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.clineInfo {
		background-color: #fff;
		padding: 30rpx 45rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: 2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);
	
		.info_head {
			display: flex;
			justify-content: space-between;
	
			:first-child {
				font-size: 34rpx;
				font-weight: 700;
				color: #333;
			}
		}
	
		.info_main {
			display: flex;
			justify-content: space-between;
	
			.main_left {
				.left_followUp {
					display: flex;
					padding-bottom: 30rpx;
					font-size: 30rpx;
					color: #666;
				}
	
				.left_star {
					font-size: 30rpx;
					color: #666;
					display: flex;
					padding-bottom: 30rpx;
				}
	
				.left_foot {
					padding-bottom: 20rpx;
	
					.l_box {
						margin-right: 35rpx;
						float: left;
	
						span {
							background: $uni-bg-opacity;
							padding: 5rpx 12rpx;
							font-size: 26rpx;
							color: $uni-text-color;
							border-radius: 5rpx;
						}
					}
				}
			}
	
			.main_right {
				text-align: center;
				padding: 20rpx 15rpx 0 0;
	
				image {
					border-radius: 50%;
					width: 129rpx;
					height: 129rpx;
					margin-bottom: 5rpx;
				}
			}
		}
	
		.info_footer {
			display: flex;
			justify-content: space-around;
			padding-top: 30rpx;
			height: 80rpx;
			border-top: 1px solid #ededed;
			margin-top: 20rpx;
	
			.footer_content {
				// width: 25%;
				line-height: 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width: 48rpx;
					height: 48rpx;
					margin-right: 15rpx;
				}
			}
		}
	}
</style>