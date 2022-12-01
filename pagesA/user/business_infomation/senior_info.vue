<template>
	<view class="warp">
		<view class="table">
			<view class="tab_th_row" style="background:rgba(2, 135, 255, 0.1)">
				<view class="tab_th">姓名</view>
				<view class="tab_th">职务</view>
			</view>
			<view class="tab_th_row" v-for="(item,index) in seniorList" :key="index">
				<view class="tab_td">{{item.name}}</view>
				<view class="tab_td">{{item.job_title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		data() {
			return{
				seniorList:[]
			}
		},
		onLoad() {
			this.seniorList = uni.getStorageSync('businessInfo').enterprise.employees
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.warp{
		width:690rpx;
		margin:24rpx auto;
		.table{
			border-top:1rpx solid #f5f5f5;
			border-left:1rpx solid #f5f5f5;
			.tab_th_row{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.tab_th{
					width:345rpx;
					padding:10rpx 0;
					border-bottom:1rpx solid #f5f5f5;
					border-right:1rpx solid #f5f5f5;
					font-size:32rpx;
					color:#666;
					text-align: center;
				}
				.tab_td{
					width:345rpx;
					padding:10rpx 0;
					border-bottom:1rpx solid #f5f5f5;
					border-right:1rpx solid #f5f5f5;
					font-size:32rpx;
					color:#333;
					text-align: center;
				}
			}
		}
	}
</style>
