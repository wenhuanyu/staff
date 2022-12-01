<template>
	<view class="">
		<view class="quolist" v-for="(item,index) in quotaList" :key="index" @click="toQuoteDetail(item)">
			<view class="quo_staff_info">
				<image :src="item.owner_staff.img ? item.owner_staff.img : '/static/index/header.png'" class="staffimg"></image>
				<view class="staffname">{{item.owner_staff.name}}</view>
			</view>
			<view class="quo_info_right">
				<view class="q_in_ri_fir">
					<view class="q_name">甲方：{{item.customer.name}}</view>
					<view class="q_status" v-if="item.check_status == 0">进行中</view>
					<view class="q_status" v-if="item.check_status == 1">进行中</view>
					<view class="q_status" v-if="item.check_status == 2">已通过</view>
					<view class="q_status" v-if="item.check_status == 3">已拒绝</view>
					<view class="q_status" v-if="item.check_status == 9">已作废</view>
				</view>
				<view class="quo_text">报价单金额：￥{{item.quote_amount}}</view>
				<view class="quo_text">报价日期：{{item.quote_date}}</view>
				<view class="quo_text">编号：{{item.number}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netQuotationList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				quotaList:[],
				customerid:'',
				page:1,
				totalPage:1,
			}
		},
		onLoad(options) {
			this.customerid = options.id
			this.getQuotaList()
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++ 
				this.getQuotaList()
			}
		},
		methods:{
			//报价单  列表
			getQuotaList() {
				let params = {
					page:this.page,
					customer_id:this.customerid,
					limit:15
				}
				netQuotationList(params).then(res=>{
					this.quotaList = this.quotaList.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//报价  详情
			toQuoteDetail(item) {
				uni.navigateTo({
					url:'/pagesC/quotation/detail?id='+item.id,
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.quolist{
		background:#fff;
		border-radius: 20rpx;
		padding:24rpx;
		width:690rpx;
		margin:24rpx auto 0;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		display: flex;
		justify-content: flex-start;
		.quo_staff_info{
			margin-right:24rpx;
			text-align: center;
			.staffimg{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				margin-bottom:10rpx;
			}
			.staffname{
				font-size:26rpx;
				color:#999999;
			}
		}
		.quo_info_right{
			flex:1;
			.q_in_ri_fir{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.q_name{
					font-size:26rpx;
					color:#999999;
				}
				.q_status{
					font-size:24rpx;
					color:#FE9440;
					padding:3rpx 8rpx;
					border:1rpx solid #FE9440;
				}
			}
			.quo_text{
				font-size:26rpx;
				color:#999999;
				margin-top:15rpx;
			}
		}
	}
</style>
