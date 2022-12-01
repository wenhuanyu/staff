<template>
	<view class="wrap">
		<view class="allReports">
			<view class="dailyReport report" @tap="toCreateWork(1)">
				<view class="reportLeft">
					<view class="head" style="background-color: #AF99FE;">
						日
					</view>
					<text>日报</text>
				</view>
				<view class="reportRight">
					<image :src="BASE_IMG_URL+'/addReport.png'" mode=""></image>
				</view>
			</view>
			<view class="weeklyReport report" @tap="toCreateWork(2)">
				<view class="reportLeft">
					<view class="head" style="background-color: #FBB545;">
						周
					</view>
					<text>周报</text>
				</view>
				<view class="reportRight">
					<image :src="BASE_IMG_URL+'/addReport.png'" mode=""></image>
				</view>
			</view>
			<view class="monthlyReport report" @tap="toCreateWork(3)">
				<view class="reportLeft">
					<view class="head" style="background-color: #4AD49D;">
						月
					</view>
					<text>月报</text>
				</view>
				<view class="reportRight">
					<image :src="BASE_IMG_URL+'/addReport.png'" mode=""></image>
				</view>
			</view>
			<view class="quarterlyReport report" @tap="toCreateWork(4)">
				<view class="reportLeft">
					<view class="head" style="background-color: #FF6E7F;">
						季
					</view>
					<text>季报</text>
				</view>
				<view class="reportRight">
					<image :src="BASE_IMG_URL+'/addReport.png'" mode=""></image>
				</view>
			</view>
			<view class="yearlyReport report" @tap="toCreateWork(5)">
				<view class="reportLeft">
					<view class="head" style="background-color: #54B1F7;">
						年
					</view>
					<text>年报</text>
				</view>
				<view class="reportRight">
					<image :src="BASE_IMG_URL+'/addReport.png'" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default {
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		methods:{
			toCreateWork(type){
				uni.navigateTo({
					url:'/pagesB/workreport/createWork?type='+type
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
<style lang="scss" scoped>
	.wrap{
		background-color: #fff;
		.allReports{
			display: flex;
			flex-direction: column;
			background-color: #F1F3FE;
			.report{
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 750rpx;
				height: 140rpx;
				background-color: #fff;
				.reportLeft{
					display: flex;
					align-items: center;
					margin-left: 30rpx;
					.head{
						width: 80rpx;
						height: 80rpx;
						color: #fff;
						text-align: center;
						line-height: 75rpx;
						font-weight: bold;
						font-size: 36rpx;
						border-radius: 50%;
						background-color: lightgreen;
					}
					text{
						margin: 0 30rpx;
						font-size: 28rpx;
					}
				}
				.reportRight{
					margin-right: 30rpx;
					width: 50rpx;
					height: 50rpx;
					image{
						display: block;
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
		}
	}
</style>
