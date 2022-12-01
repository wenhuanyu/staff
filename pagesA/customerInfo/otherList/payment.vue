<template>
	<view>
		<view class="collection_item" v-for="(item,index) in payment_list" :key="index" @click="istoPaymentDetail(item)">
			<view class="collection_li">
				<view class="collec_text">关联客户： {{item.customer.name}}</view>
			</view>
			<view class="collection_li">
				<view class="collec_text">关联合同： {{item.contract.num}}</view>
			</view>
			<view class="collection_li">
				<view class="collec_text">{{item.number}}</view>
				<view class="recostatus" v-if="item.check_status == 0">待审核</view>
				<view class="recostatus" v-if="item.check_status == 1">审核中</view>
				<view class="recostatus" v-if="item.check_status == 2">审核通过</view>
				<view class="recostatus" v-if="item.check_status == 3">审核未通过</view>
				<view class="recostatus" v-if="item.check_status == 4">已撤回</view>
			</view>
			<view class="collection_li">
				<view class="collec_text" >回款日期： {{item.return_time}}</view>
				<view class="collection_money" >+{{item.money}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netPaymentList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				payment_list:[],
				page:1,
				totalPage:1,
				customerid:''
			}
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++ 
				this.getPaymentList()
			}
		},
		onLoad(options) {
			this.customerid = options.id
			this.getPaymentList()
		},
		methods:{
			//回款记录  列表
			getPaymentList() {
				let params = {
					customer_id: this.customerid,
					page:this.page,
				}
				netPaymentList(params).then(res => {
					this.payment_list = this.payment_list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//回款 详情
			istoPaymentDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/payment/paymentDetail?paymentid='+item.id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.collection_item{
		padding:24rpx 30rpx;
		width:690rpx;
		margin:24rpx auto 0;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		.collection_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:15rpx;
			&:last-child{
				margin-bottom:0;
			}
			.collec_text{
				font-size:26rxp;
				color:#999999;
			}
			.recostatus{
				font-size: 24rpx;
				color: $uni-text-color;
				padding:5rpx 8rpx;
			}
			.collection_money{
				font-size:34rpx;
				color:#F2533E;
			}
		}
	}
</style>
