<template>
	<view class="">
		<scroll-view scroll-y="true" class="scrollbox">
			<view class="lxr_con_list" v-for="(item,index) in contract_list" :key="index"
				@click="toContractDetail(item.id)">
				<view class="name">{{item.name?item.name:'--'}}</view>
				<view class="info_box">
					<view class="info_left">
						<view class="info">关联客户：{{item.customer?item.customer.name:'--'}}</view>
						<view class="info">合同编号：{{item.num}}</view>
						<view class="info">已回款：&yen;{{item.receivables.repayment_money}}</view>
						<view class="info">待回款：&yen;{{item.receivables.be_money}}</view>
						<view class="info">签约时间：{{item.order_date}}</view>
						<view class="con_status" v-if="item.check_status == 0">
							<span>待审核</span>
						</view>
						<view class="con_status" v-if="item.check_status == 1">
							<span>审核中</span>
						</view>
						<view class="con_status pass" v-if="item.check_status == 2">
							<span>审核通过</span>
						</view>
						<view class="con_status nopass" v-if="item.check_status == 3">
							<span>审核未通过</span>
						</view>
						<view class="con_status nopass" v-if="item.check_status == 4">
							<span>已撤回</span>
						</view>
					</view>
					<view class="pro_li_right">&yen;{{item.money}}</view>
				</view>
			</view>
			<view class="noData" v-if="contract_list.length == 0">暂无更多</view>
		</scroll-view>
	</view>
</template>

<script>
	import { netRelationContract } from '@/api/api.js'
	export default{
		props:{
			info:{
				type:Object,
				default:{}
			}
		},
		data() {
			return{
				contract_list:[]
			}
		},
		created() {
			this.getList()
		},
		methods:{
			getList(){
				netRelationContract({id:this.info.id}).then(res=>{
					this.contract_list = res.data.data
					console.log(this.contract_list,'====')
				})
			},
			//合同详情
			toContractDetail(id) {
				uni.navigateTo({
					url: '/pages/index/contractManagements/contractDetail?id=' + id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scrollbox{
		height:900rpx;
	}
	.lxr_con_list {
		width:690rpx;
		margin:24rpx auto 0;
		padding: 20rpx 0;
		background: #fff;
		box-sizing: border-box;
		border-radius: 20rpx;
		&:last-child {
			border-bottom: none;
		}
		.name {
			font-size: 34rpx;
			color: #333333;
			font-weight: 500;
			border-bottom: 1rpx solid #ededed;
			padding:0 24rpx 24rpx;
		}
		.info_box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx;
			.info {
				font-size: 32rpx;
				color: #999999;
				margin: 10rpx 0;
			}
			.pro_li_right {
				color: $uni-text-color;
				font-size: 33rpx;
				font-weight: 500;
			}
		}
		.con_status {
			width: 130rpx;
			height: 36rpx;
			text-align: center;
			line-height: 36rpx;
			background: $uni-bg-opacity;
			margin-top: 30rpx;
			span {
				font-size: 26rpx;
				color: $uni-text-color;
			}
		}
		.nopass {
			color: #ec7f51;
		}
		.pass {
			color: #22A7F6;
		}
	}
</style>