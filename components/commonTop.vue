<template>
	<view class="">
		<!-- #ifdef MP-WEIXIN -->
		<view class="lxr_top_warp" :style="{height:topHeight+'px',paddingTop:paddingHeight+'px'}">
			<view class="lxr_top_title" :style="{top:paddingHeight+'px',height:btnHeight+'px',lineHeight:btnHeight+'px'}">{{title}}</view>
			<view class="lxr_top_box" :style="{height:btnHeight+'px'}">
				<image :src="BASE_IMG_URL+'/index/top_back.png'" @click="toBack" class="lxr_topback" mode=""></image>
				<image :src="BASE_IMG_URL+'/index/top_static.png'" @click="toStaticPage" class="lxr_topstatic" mode=""></image>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY || APP-PLUS || H5 -->
		<view class="statusHeight"></view>
		<view class="lxr_top_warp_app">
			<view class="lxr_top_title">{{title}}</view>
			<view class="lxr_top_box">
				<image :src="BASE_IMG_URL+'/index/top_back.png'" @click="toBack" class="lxr_topback" mode=""></image>
				<image :src="BASE_IMG_URL+'/index/top_static.png'" @click="toStaticPage" class="lxr_topstatic" mode=""></image>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			title:{
				type:String,
				default:'合同'
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				topHeight:0,   //状态栏 + 小程序右上角按钮
				paddingHeight:0,  //顶部状态栏高度
				btnHeight:0,   //小程序右上角按钮的高度
			}
		},
		created() {
			// #ifdef MP-WEIXIN
			uni.getSystemInfo({
				success: (res) => {
					let rect = wx.getMenuButtonBoundingClientRect();
					this.topHeight = rect.bottom + 5
					this.btnHeight = rect.height
					this.paddingHeight = rect.top
				}
			})
			// #endif
		},
		methods:{
			toBack() {
				uni.navigateBack({
					delta:1
				})
			},
			toStaticPage() {
				this.$emit('toStaticPage')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lxr_top_warp{
		position: relative;
		background:$uni-text-color;
		width:100%;
		padding-left:24rpx;
		padding-right:24rpx;
		.lxr_top_title{
			font-size:30rpx;
			color:#fff;
			position: absolute;
			left:50%;
			transform: translateX(-50%);
		}
		.lxr_top_box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.lxr_topback{
				width:30rpx;
				height:40rpx;
			}
			.lxr_topstatic{
				width:45rpx;
				height:45rpx;
				margin-left:35rpx;
			}
		}
	}
	.statusHeight{
		width:100%;
		height:var(--status-bar-height);
		background:$uni-text-color;
	}
	.lxr_top_warp_app{
		background:$uni-text-color;
		padding-left:24rpx;
		padding-right:24rpx;
		width:100%;
		height:80rpx;
		.lxr_top_title{
			font-size:30rpx;
			color:#fff;
			position: absolute;
			left:50%;
			transform: translateX(-50%);
			height:80rpx;
			line-height: 80rpx;
		}
		.lxr_top_box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height:80rpx;
			.lxr_topback{
				width:30rpx;
				height:40rpx;
			}
			.lxr_topstatic{
				width:45rpx;
				height:45rpx;
				margin-left:35rpx;
			}
		}
	}
</style>