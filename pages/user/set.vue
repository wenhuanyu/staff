<template>
	<view>
		<view class="fllow_form" @click="toEdit">
			<view class="tit">修改信息</view>
			<image :src="BASE_IMG_URL+'/index/back.png'" class="proliright" ></image>
		</view>
		<!-- #ifdef MP-WEIXIN || H5 -->
		<view class="fllow_form" @click="toBindAccount">
			<view class="tit">第三方账号绑定</view>
			<image :src="BASE_IMG_URL+'/index/back.png'" class="proliright" ></image>
		</view>
		<!-- #endif -->
		<view class="fllow_form" @click="toBindmail">
			<view class="tit">绑定邮箱</view>
			<image :src="BASE_IMG_URL+'/index/back.png'" class="proliright" ></image>
		</view>
		<view class="fllow_form" @click="toEditPass">
			<view class="tit">修改密码</view>
			<image :src="BASE_IMG_URL+'/index/back.png'" class="proliright" ></image>
		</view>
		<view class="fllow_form" @click="toOut">
			<view class="tit">退出登录</view>
			<image :src="BASE_IMG_URL+'/index/back.png'" class="proliright" ></image>
		</view>
	</view>
</template>

<script>
	import { netOutLogin } from '@/api/api.js'
	import { netGetUserInfo } from '@/api/user.js'
	import { mapState } from 'vuex'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				userInfo:{},
			}
		},
		onLoad() {
		},
		methods: {
			//第三方账号绑定
			toBindAccount() {
				uni.navigateTo({
					url:'/pages/user/bindaccount'
				})
			},
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
			//绑定邮箱
			toBindmail() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/bindMailbox'
				})
			},
			//退出登录
			toOut() {
				uni.showModal({
					title:'提示',
					content:'请确认是否退出?',
					complete:(res)=>{
						if(res.confirm){
							netOutLogin().then(()=>{
								uni.removeStorageSync('token')
								uni.reLaunch({
									url:'/pages/index/index'
								})
							})
						}
					}
				})
			},
			// 修改密码
			toEditPass() {
				uni.navigateTo({
					url:'/pagesA/user/editPassword'
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 0 24rpx;
		.tit{
			font-size:26rpx;
			color:#666;
		}
		.proliright{
			width:16rpx;
			height:29rpx;
		}
	}
</style>
