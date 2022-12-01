<template>
	<view class="profile">
		<view class="topwarp">
			<view class="user_info">
				<view class="user_top">
					<image :src="userInfo.img" class="userheader" ></image>
					<view class="u_top_right">
						<view class="ri_top">
							<view class="r_left">
								<view class="username">{{userInfo.name}}</view>
							</view>
							<image :src="BASE_IMG_URL+'/index/edit-address.png'" @click="toEdit" class="editim" ></image>
						</view>
						<view class="user_company">公司</view>
						<view class="user_address">地址</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pro_list">
			<view class="pro_li" @click="toStafflist" v-if="userPermission.staff_list.is_show == 1">
				<view class="pro_li_left">
					<image :src="BASE_IMG_URL+'/user/tab1.png'" class="proliimg" ></image>
					员工列表
				</view>
				<image :src="BASE_IMG_URL+'/user/back.png'" class="proliright" ></image>
			</view>
			<view class="pro_li" @click="toStaffExamine" v-if="userPermission.staff_check.is_show == 1">
				<view class="pro_li_left">
					<image :src="BASE_IMG_URL+'/user/tab2.png'" class="proliimg" ></image>
					员工审核
				</view>
				<image :src="BASE_IMG_URL+'/user/back.png'" class="proliright" ></image>
			</view>
			<view class="pro_li" @click="toEmailbox" v-if="userInfo.email_code && userPermission.email.is_show == 1">
				<view class="pro_li_left">
					<image :src="BASE_IMG_URL+'/user/tab6.png'" class="proliimg" ></image>
					我的邮箱
				</view>
				<image :src="BASE_IMG_URL+'/user/back.png'" class="proliright" ></image>
			</view>
			<view class="pro_li" @click="toBindmail" v-if="!userInfo.email_code && userPermission.email.is_show == 1">
				<view class="pro_li_left">
					<image :src="BASE_IMG_URL+'/user/tab6.png'" class="proliimg" ></image>
					绑定邮箱
				</view>
				<image :src="BASE_IMG_URL+'/user/back.png'" class="proliright" ></image>
			</view>
			
		</view>
		
		<tab-bar></tab-bar>
	</view>
</template>
	
<script>
	import tabBar from '@/components/tabbar/tabbar'
	import { netGetUserInfo } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	import { mapState } from 'vuex'
	
	export default {
		components:{
			tabBar
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				userInfo:{},
				userPermission:{}
			}
		},
		onShow() {
			this.userPermission = uni.getStorageSync('permission').menu
			this.getUserinfo()
		},
		methods: {
			getUserinfo() {
				netGetUserInfo().then(res=>{
					this.userInfo = res.data
				})
			},
			toEdit() {
				uni.navigateTo({
					url:'/pagesA/user/setPersonData'
				})
			},
			//员工列表
			toStafflist() {
				uni.navigateTo({
					url:'/pagesA/user/stafflist/index'
				})
			},
			//员工审核
			toStaffExamine() {
				uni.navigateTo({
					url:'/pagesA/user/staff_examine/index'
				})
			},
			//工商信息
			toBusiness() {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/index'
				})
			},
			//绑定邮箱
			toBindmail() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/bindMailbox'
				})
			},
			//我的邮箱
			toEmailbox() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/index?action=2'
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.topwarp{
		width:750rpx;
		// background-image: url('BASE_IMG_URL+/user/bg.png');
		background-repeat: no-repeat;
		background-size:750rpx 300rpx;
		padding-top:24rpx;
		padding-bottom:24rpx;
		.user_info{
			width:690rpx;
			background:#fff;
			border-radius: 40rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.05);
			padding:30rpx;
			margin:0 auto;
			.user_top{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.userheader{
					width:126rpx;
					height:126rpx;
					border-radius: 50%;
					flex-shrink: 0;
					margin-right:24rpx;
				}
				.u_top_right{
					flex:1;
					.ri_top{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.r_left{
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.username{
								font-size:34rpx;
								color:#333333;
								margin-right:24rpx;
							}
							.userstatus{
								display: flex;
								justify-content: center;
								align-items: center;
								width:133rpx;
								height:29rpx;
								background:rgba(2, 135, 255, 0.2);
								border-radius: 15rpx;
								.s_text{
									font-size:20rpx;
									color:#0287FF;
									padding-left:15rpx;
									position: relative;
									&::before{
										content:'';
										width:10rpx;
										height:10rpx;
										border-radius: 50%;
										background:#0287FF;
										position: absolute;
										left:0;
										top:10rpx;
									}
								}
								.leftimg{
									width:11rpx;
									height:20rpx;
									margin-left:20rpx;
								}
							}
							
						}
						.editim{
							width:37rpx;
							height:37rpx;
						}
					}
					.user_company{
						font-size:24rpx;
						color:#666666;
						margin-bottom:10rpx;
					}
					.user_address{
						font-size:24rpx;
						color:#666666;
					}
				}
			}
			.user_num_warp{
				padding:20rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				.num_box{
					width:160rpx;
					text-align: center;
					margin-right:50rpx;
					margin-bottom:30rpx;
					&:nth-child(3n){
						margin-right:0;
					}
					.self_num{
						font-size:38rpx;
						color:#0287FF;
						margin-bottom:8rpx;
					}
					.num_text{
						font-size:26rpx;
						color:#666666;
					}
				}
			}
		}
	}
	.pro_list{
		margin-top:50rpx;
		.pro_li{
			padding:30rpx 30rpx 30rpx 70rpx;
			background:#fff;
			border-bottom:1rpx solid #EDEDED;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.pro_li_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size:34rpx;
				color:#333333;
				.proliimg{
					width:43rpx;
					height:43rpx;
					margin-right:26rpx;
				}
			}
			.proliright{
				width:19rpx;
				height:32rpx;
			}
		}
	}
</style>
