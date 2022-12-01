<template>
	<view class="warp">
		<view class="table">
			<view class="tab_th_row" style="background:rgba(2, 135, 255, 0.1)">
				<view class="tab_th">发起人</view>
				<view class="tab_th">股东类型</view>
				<view class="tab_th">认缴出资额</view>
				<view class="tab_th">实缴出资日期</view>
			</view>
			<view class="tab_th_row" v-for="(item,index) in shareinfo" :key="index">
				<view class="tab_td">{{item.name}}</view>
				<view class="tab_td">{{item.stock_type}}</view>
				<view class="tab_td">{{item.real_capi_items[0].real_capi}}</view>
				<view class="tab_td">{{item.real_capi_items[0].real_capi_date}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		data() {
			return{
				shareinfo:[]
			}
		},
		onShow() {
			this.shareinfo = uni.getStorageSync('businessInfo').enterprise.partners
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.warp{
		width:700rpx;
		margin:24rpx auto;
		.table{
			border-top:1rpx solid #f5f5f5;
			border-left:1rpx solid #f5f5f5;
			.tab_th_row{
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom:1rpx solid #f5f5f5;
				.tab_th{
					width:175rpx;
					padding:10rpx 0;
					border-right:1rpx solid #f5f5f5;
					font-size:26rpx;
					color:#666;
					text-align: center;
				}
				.tab_td{
					width:175rpx;
					padding:10rpx 0;
					border-right:1rpx solid #f5f5f5;
					font-size:26rpx;
					color:#333;
					text-align: center;
				}
			}
		}
	}
</style>
