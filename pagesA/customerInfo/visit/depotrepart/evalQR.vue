<template>
	<view class="evaldbox">
		<view class="title">评价二维码</view>
		<view class="tip">向用户出示评价码,用户扫码即可评价</view>
		<view class="imgbox">
			<image :src="ermUrl" class="erimg"></image>
		</view>
		
		<view class="button" @click="back">返回</view>
	</view>
</template>

<script>
	import { netGenerEwm } from '@/api/template.js'
	import { BASE_URL  } from '@/api/http.js'
	
	export default{
		data() {
			return{
				id:'',
				ermUrl:''
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			let url = encodeURIComponent(BASE_URL+'/h5/#/pages/evaluate/to_evaluate?id='+this.id)
			this.ermUrl = BASE_URL+netGenerEwm+'?text='+url
		},
		methods:{
			back() {
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evaldbox{
		padding:40rpx 30rpx;
		.title{
			font-size:36rpx;
			color:#000;
			font-weight: bold;
			text-align: center;
		}
		.tip{
			font-size:26rpx;
			text-align: center;
			margin-top:15rpx;
		}
		.imgbox{
			width:400rpx;
			height:400rpx;
			margin: 24rpx auto;
			.erimg{
				width:400rpx;
				height:400rpx;
			}
		}
	}
	
</style>
