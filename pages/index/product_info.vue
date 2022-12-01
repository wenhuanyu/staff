<template>
	<view>
		<view class="ptoduct_title">产品信息</view>
		<view class="infobox">
			<view class="info_item">
				<view class="item_tit">产品名称</view>
				<view class="item_num">{{info.product.name ? info.product.name : ''}}</view>
			</view>
			<view class="info_item">
				<view class="item_tit">设备编号</view>
				<view class="item_num">{{info.number ? info.number : ''}}</view>
			</view>
			<view class="info_item" style="border-bottom:0">
				<view class="item_tit">产品规格</view>
				<view class="item_num">{{info.product.unit ? info.product.unit : ''}}</view>
			</view>
			<view class="info_item" style="border-bottom:0">
				<view class="item_tit">产品编码</view>
				<view class="item_num">{{info.product.num ? info.product.num : ''}}</view>
			</view>
		</view>
		<view v-if="info.customer_product">
			<view class="ptoduct_title">客户信息</view>
			<view class="stepbox" style="padding:24rpx 50rpx">
				<view class="cusinfo" @click="toCustomerDetail">
					<image :src="BASE_IMG_URL+'/user/mail1.png'" class="headerimg"></image>
					{{info.customer_product.customer.name}}
				</view>
			</view>
		</view>
		<view class="ptoduct_title">工单信息</view>
		<view class="stepbox">
			<time-axis :dataArray="logic"></time-axis>
		</view>
	</view>
</template>

<script>
	import { netProductInfo } from '@/api/api.js'
	import timeAxis from '@/components/time_axis/time_axis.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			timeAxis
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				code:'',
				info:{},
				logic:[]
			}
		},
		onLoad(options) {
			this.code = options.code
			this.getInfo()
		},
		methods:{
			getInfo() {
				netProductInfo({code:this.code}).then(res=>{
					this.info = res.data.info
					this.logic = res.data.logic
				})
			},
			toCustomerDetail() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.info.customer_product.customer.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ptoduct_title{
		padding:24rpx 75rpx;
		font-size:32rpx;
		color:$uni-text-color;
		position: relative;
		&::before{
			content:'';
			position: absolute;
			left:30rpx;
			top:33rpx;
			width:20rpx;
			height:30rpx;
			border-radius: 5rpx;
			background:$uni-text-color;
		}
	}
	.infobox{
		width:690rpx;
		margin:0 auto;
		border-radius: 10rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		padding:24rpx 0;
		.info_item{
			width:50%;
			border-bottom:1rpx solid #f5f5f5;
			border-right:1rpx solid #f5f5f5;
			padding:30rpx;
			height:170rpx;
			.item_tit{
				font-size:30rpx;
				color:#333333;
				margin-bottom:15rpx;
			}
			.item_num{
				font-size:26rpx;
				color:#666666;
			}
		}
	}
	.stepbox{
		width:690rpx;
		border-radius: 10rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		margin:0 auto;
		padding:50rpx;
		.cusinfo{
			font-size:30rpx;
			color:$uni-text-color;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.headerimg{
				width:48rpx;
				height:48rpx;
				margin-right:30rpx;
			}
		}
	}
</style>
