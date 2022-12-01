<template>
	<view>
		<view class="lxr_con_list" v-for="(item,index) in contract_list" :key="index" @click="toContractDetail(item.id)">
			<view class="lxr_li">
				<view class="lxr_li_text">{{item.num}}</view>
				<view class="con_status" v-if="item.check_status == 0">
					待审核
				</view>
				<view class="con_status" v-if="item.check_status == 1">
					审核中
				</view>
				<view class="con_status" v-if="item.check_status == 2">
					审核通过
				</view>
				<view class="con_status" style="color:#ec7f51" v-if="item.check_status == 3">
					审核未通过
				</view>
				<view class="con_status" style="color:#ec7f51" v-if="item.check_status == 4">
					已撤回
				</view>
				<view class="con_status" style="color:#ec7f51" v-if="item.check_status == 9">
					合同终止
				</view>
			</view>
			<view class="lxr_li">
				<view class="lxr_li_left">
					<view class="lxr_text">已回款：￥{{item.receivables.repayment_money}}</view>
					<view class="lxr_text">待回款：￥{{item.receivables.be_money}}</view>
				</view>
				<view class="lxr_li_right">￥{{item.money}}</view>
			</view>
			<view class="proce_li">
				<view class="pro_li_left">
					<view class="protext">回款进度</view>
					<view class="probox">
						<view class="proin"
							:style="{width:(item.receivables.ratio >= 100 ? 100 : item.receivables.ratio) +'%'}">
						</view>
					</view>
					<view class="pronum">{{item.receivables.ratio}}%</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { netContractList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				contract_list:[],
				customerid:'',
			}
		},
		onLoad(options) {
			this.customerid = options.id
			this.getContractsList()
		},
		methods:{
			//合同列表
			getContractsList() {
				let params = {
					customer_id: this.customerid
				}
				netContractList(params).then(res => {
					this.contract_list = res.data
				})
			},
			//合同 详情
			toContractDetail(id) {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractDetail?id='+id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.lxr_con_list {
		padding: 20rpx 30rpx;
		background:#fff;
		width:690rpx;
		margin:24rpx auto 0;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		.lxr_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:15rpx;
			&:last-child{
				margin-bottom:15rpx;
			}
			.lxr_li_text{
				font-size:26rpx;
				color:#999999;
			}
			.con_status {
				font-size: 24rpx;
				color: #00B954;
				padding:5rpx 8rpx;
				background:rgba(0, 185, 84, 0.2);
			}
			.lxr_li_left{
				.lxr_text{
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
					&:last-child{
						margin-bottom:0;
					}
				}
			}
			.lxr_li_right{
				font-size:34rpx;
				color:#F2533E;
			}
		}
	
		.proce_li {
			display: flex;
			justify-content: space-between;
			align-items: center;
	
			.pro_li_left {
				display: flex;
				justify-content: flex-start;
				align-items: center;
	
				.protext {
					font-size: 24rpx;
					color: #999999;
				}
	
				.probox {
					width: 120rpx;
					height: 15rpx;
					border-radius: 8rpx;
					background: #C0C0C0;
					margin: 0 15rpx;
	
					.proin {
						width: 20%;
						height: 15rpx;
						border-radius: 8rpx;
						background: $uni-btn-bg-color;
					}
				}
	
				.pronum {
					font-size: 24rpx;
					color: #999999;
				}
			}
	
			.pro_li_right {
				color: #ec7f51;
				font-size: 28rpx;
				font-weight: 500;
			}
		}
	
		
	}
</style>
