<template>
	<view>
		<view class="cost_item" v-for="(item,index) in cost_list" :key="index" @tap.stop="toCostDetail(item)">
			<view class="cost_li">
				<view class="cost_text">申请日期：{{item.submit_date}}</view>
				<view class="cost_status" v-if="item.check_status == 0">待审核</view>
				<view class="cost_status" v-if="item.check_status == 1">审核中</view>
				<view class="cost_status" v-if="item.check_status == 2">审核通过</view>
				<view class="cost_status" v-if="item.check_status == 3" style="color:red">审核未通过</view>
				<view class="cost_status" v-if="item.check_status == 4" style="color:red">撤销</view>
			</view>
			<view class="cost_li">
				<view class="cost_li_left">
					<view class="cost_text">消费金额：￥{{item.money}}</view>
				</view>
				<view class="cost_money">&yen; {{item.money}}</view>
			</view>
			<view class="cost_li_con">
				备注：{{item.remark}}
			</view>
		</view>
	</view>
</template>

<script>
	import { netCostList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				cost_list:[],
				page:1,
				totalPage:1,
				customerid:''
			}
		},
		onLoad(options) {
			this.customerid = options.id
			this.getCostlist()
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++ 
				this.getCostlist()
			}
		},
		methods:{
			//费用 列表
			getCostlist() {
				let params = {
					customer_id:this.customerid,
					page:this.page
				}
				netCostList(params).then(res=>{
					this.cost_list = this.cost_list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//费用详情
			toCostDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/detail?id='+item.id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cost_item{
		padding:24rpx 30rpx;
		width:690rpx;
		margin:24rpx auto 0;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		.cost_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cost_text{
				font-size:26rpx;
				color:#999999;
				margin-bottom:15rpx;
			}
			.cost_status{
				font-size: 24rpx;
				color: $uni-text-color;
				padding:5rpx 8rpx;
			}
			.cost_money{
				font-size:34rpx;
				color:#F2533E;
			}
		}
		.cost_li_con{
			font-size:26rpx;
			color:#999999;
			margin-bottom:15rpx;
		}
		.cost_li_img{
			.cost_img_tit{
				font-size:26rpx;
				color:#999999;
				margin-bottom:15rpx;
			}
			.cost_img_list{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				.cost_img_box{
					width:100rpx;
					height:100rpx;
					border-radius: 20rpx;
					margin-right:45rpx;
					.costimg{
						width:100rpx;
						height:100rpx;
						border-radius: 20rpx;
					}
				}
			}
		}
	}
</style>
