<template>
	<view class="">
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="clock_con">
				<view class="close" @click="toClose">关闭</view>
				<view class="top_warp">
					<image :src="BASE_IMG_URL+'/3.png'" class="companyimg" mode=""></image>
					<view class="tip">你已在打卡范围内</view>
					<!-- <view class="company">青东时代</view> -->
				</view>
				<view class="clock_box" @click="toUpdate">
					<view class="time">{{hour}} <span>:</span> {{branch}}</view>
					<view class="status">更新打卡</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netPunchClock } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	let M;
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				hour:'00',
				branch:'00',
				params:{}
			}
		},
		methods:{
			init(obj) {
				this.params = obj
				this.$refs.popup.open()
				//获取当前时间
				this.getTime()
			},
			getTime() {
				M = setInterval(()=>{
					let date = new Date()
					let h = date.getHours()
					let b = date.getMinutes()
					this.hour = this.handleTime(h)
					this.branch = this.handleTime(b)
				},1000)
			},
			toUpdate() {
				netPunchClock(this.params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.toClose()
						this.$emit('update')
					},2000)
				})
			},
			toClose() {
				clearInterval(M)
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.clock_con{
		margin:24rpx auto;
		width:690rpx;
		height:calc(90vh - 48rpx);
		background:#fff;
		border-radius: 10rpx;
		position: relative;
		.close{
			position: absolute;
			right:20rpx;
			top:20rpx;
			font-size:28rpx;
			color:$uni-text-color;
		}
		.top_warp{
			display: flex;
			flex-direction: column;
			text-align: center;
			align-items: center;
			padding-top:140rpx;
			.companyimg{
				width:35rpx;
				height:35rpx;
			}
			.tip{
				font-size:30rpx;
				color:$uni-text-color;
				margin:15rpx 0;
			}
			.company{
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
		.clock_box{
			width:260rpx;
			height:260rpx;
			border-radius: 50%;
			border:15rpx solid $uni-text-color;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			align-items: center;
			margin:120rpx auto;
			.time{
				font-size:42rpx;
				text-align: center;
				margin-bottom:14rpx;
				span{
					animation:twinkle 1s infinite;
				}
			}
			.status{
				font-size:26rpx;
				text-align: center;
			}
		}
	}
	@keyframes twinkle{
		   0% {
			   opacity: 1;
		   }
		   50% {
			   opacity: 0.5;
		   }
		   100% {
			   opacity: 0;
		   }
	}
</style>