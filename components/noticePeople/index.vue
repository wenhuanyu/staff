<template>
	<view class="exam_warp">
		<view class="exam_tit">
			<view class="name">{{title}}</view>
		</view>
		<view class="exam_list">
			<view class="exam_box">
				<image :src="notic.staff.img" class="examimg" ></image>
				<view class="exam_text">{{notic.staff.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			title:{
				type:String,
				default:'通知人'
			},
			notic:{
				type: Object,
				default:{}
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.exam_warp{
		padding:24rpx 60rpx;
		border-bottom:1rpx solid #EDEDED;
		border-top:1rpx solid #EDEDED;
		.exam_tit{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.name{
				font-size:30rpx;
				color:#0287FF;
			}
			.exam_num{
				font-size:28rpx;
				color:#FFA205;
			}
		}
		.exam_list{
			margin-top:25rpx;
			display: flex;
			justify-content: flex-start;
			.exam_box{
				margin-right:50rpx;
				position: relative;
				.closeimg{
					position: absolute;
					right:-10rpx;
					top:-10rpx;
					width:30rpx;
					height:30rpx;
					border-radius: 50%;
					background:rgba(0,0,0,0.3);
				}
				.examimg{
					width:60rpx;
					height:60rpx;
					border-radius: 50%;
				}
				.exam_text{
					font-size:24rpx;
					color:#999999;
				}
			}
			.exam_add{
				width:60rpx;
				height:60rpx;
				border:1rpx dashed #FE9440;
				border-radius: 50%;
				font-size:50rpx;
				font-weight: bold;
				color:#FFA205;
				text-align: center;
				line-height: 50rpx;
			}
		}
	}
</style>
