<template>
	<view>
		<view class="profile_item" >
			<view class="itemleft">
				<image :src="BASE_IMG_URL+'/index/wechat.png'" class="leftimg"  mode="scaleToFill"></image>
				<view class="lxs_font">微信</view>
			</view>
			<view class="itemright" @click="toBindWechat" v-if="is_bind_wechat == 0">
				<view class="righttext">请绑定</view>
				<view class="iconfont icon-arrows_right"></view>
			</view>
			<view class="itemright" v-else @click="toUnbound">
				<view class="righttext">已绑定/解绑</view>
				<view class="iconfont icon-arrows_right"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netSendCode, nerIsbindWechat, netUnboundWecgat } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				code:'',
				is_bind_wechat:0,
			}
		},
		onLoad() {
			// #ifdef H5
			console.log(window.location.href,window.location.host,'-----')
			let str = window.location.href
			if(str.indexOf('code') != -1) {
				let fir = Number(str.indexOf('=')) + 1
				let last = str.indexOf('&')
				let code = str.slice(fir,last)
				console.log(code,'=====')
				if(code) {
					this.code = code
					let params = {
						type:'web',
						code:code
					}
					this.send(params)
				}
			}
			// #endif
			//判断是否已经绑定  微信
			this.getIs()
		},
		onShow() {
			
		},
		methods:{
			getIs() {
				nerIsbindWechat().then(res=>{
					console.log(res)
					this.is_bind_wechat = res.data.is_bind_wechat
				})
			},
			toBindWechat() {
				// #ifdef H5
				this.wxOfficialAccountLogin()
				// #endif
				// #ifdef MP-WEIXIN
				this.getInfo()
				// #endif
			},
			wxOfficialAccountLogin() {
				let appid = uni.getStorageSync('appid')
				if(appid){
					let oUrl = window.location.href;
					oUrl = encodeURIComponent(oUrl)
					window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid +
						`&redirect_uri=${oUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
				}else{
					uni.showToast({
						title:'请在后台设置appid',
						icon:'none'
					})
				}
			},
			send(params) {
				netSendCode(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getIs()
					},2000)
				})
			},
			getInfo() {
				wx.login({
					success: resT => {
						console.log(resT,'-----')
						let params = {
							type:'applet',
							code:resT.code
						}
						this.send(params)
					}
				})
			},
			//解绑
			toUnbound() {
				netUnboundWecgat().then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getIs()
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.profile_item {
		display: flex;
		background:#fff;
		color:#666;
		padding: 0 30rpx;
		justify-content: space-between;
		border-bottom:1rpx solid #f5f5f5;
		height: 110rpx;
		line-height: 110rpx;
		font-size: 28rpx;
		.itemleft{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.leftimg{
				height:46rpx;
				width:46rpx;
				margin-right:25rpx;
			}
		}
		.itemright{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.righttext{
				font-size:26rpx;
				color:$uni-text-color;
				margin-right:10rpx;
				background:none;
				text-align: right;
				padding-left:0;
				padding-right:0;
				&::after{
					border:none;
				}
			}
		}
	}
</style>
