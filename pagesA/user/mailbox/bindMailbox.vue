<template>
	<view class="mailwarp">
		<view class="mailfir">
			<image :src="BASE_IMG_URL+'/index/mail1.png'" class="firimg"></image>
			<input type="text" v-model="email" placeholder="请输入邮箱账号" class="firinput">
			<view class="firp">（只支持163邮箱绑定）</view>
		</view>
		<view class="mailfir">
			<image :src="BASE_IMG_URL+'/index/mail2.png'" class="secimg"></image>
			<input type="text" v-model="passcode" placeholder="请输入smtp授权码" style="width:550rpx" class="firinput">
		</view>
		
		<view class="button" @click="toBind">确认</view>
	</view>
</template>

<script>
	import { netBindMail, netGetUserInfo } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				email:'',
				passcode:''
			}
		},
		onLoad() {
			this.getInfo()
		},
		methods:{
			getInfo() {
				netGetUserInfo().then(res=>{
					res = res.data
					this.email = res.email
					this.passcode = res.email_code
				})
			},
			toBind() {
				let params = {
					email:this.email,
					passcode: this.passcode
				}
				netBindMail(params).then(res=>{
					if(res.code == 1) {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mailwarp{
		width:690rpx;
		height:calc(100vh - 48rpx);
		margin:24rpx auto;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		padding:80rpx 30rpx;
		border-radius: 20rpx;
		.tip{
			font-size:28rpx;
			text-align: center;
		}
		.mailfir{
			width:611rpx;
			height:80rpx;
			border-radius: 20rpx;
			border:1rpx solid #0287FF;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 15rpx;
			margin:0 auto 30rpx;
			.firimg{
				width:48rpx;
				height:48rpx;
			}
			.firinput{
				width:260rpx;
				font-size:30rpx;
				color:#999999;
				margin:0 15rpx;
			}
			.firp{
				font-size:22rpx;
				color:#F13E27;
			}
			.secimg{
				width:44rpx;
				height:43rpx;
			}
		}
	}
</style>
