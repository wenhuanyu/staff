<template>
	<view>
		<view class="lxr_con_list" :class="styleType == 'list' ? '' : 'lxr_index_item'" v-for="(item,index) in list" :key="index" @tap.stop="toContractDetail(item)">
			<view class="contract_top">
				<view class="cont_left">
					<view class="cont_num">合同单号：{{item.num}}</view>
				</view>
				<view class="con_status" style="display: flex;align-items: center;">
					{{item.owner_staff.name}}
					<image :src="item.owner_staff.img" class="staffimg"></image>
				</view>
			</view>
			<view class="cont_info">
				<view class="cont_info_left">
					<view class="cont_info_text">关联客户：{{item.customer.name}}</view>
					<view>
						<view class="cont_info_text">合同金额：￥{{item.money}}</view>
						<view class="cont_info_text">签订时间：{{item.order_date}}</view>
						<view class="cont_info_text">已回款：￥{{item.receivables.repayment_money}}</view>
						<view class="cont_info_text">待回款：￥{{item.receivables.be_money}}</view>
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
				<view class="cont_info_money">
					<view class="con_status" v-if="item.check_status == 0">
						<!-- 待审核 -->
						<image :src="BASE_IMG_URL + '/index/check.png'" ></image>
					</view>
					<view class="con_status" v-if="item.check_status == 1">
						<!-- 审核中 -->
						<image :src="BASE_IMG_URL + '/index/check.png'" ></image>
					</view>
					<view class="con_status" style="color:#00B954;" v-if="item.check_status == 2">
						<!-- 审核通过 -->
						<image :src="BASE_IMG_URL + '/index/passed.png'" ></image>
					</view>
					<view class="con_status" style="color:#F2533E;" v-if="item.check_status == 3">
						<!-- 审核未通过 -->
						<image :src="BASE_IMG_URL + '/index/refused.png'" ></image>
					</view>
					<view class="con_status" style="color:#7B03C7;" v-if="item.check_status == 4">
						<!-- 已撤回 -->
						<image :src="BASE_IMG_URL + '/index/recalled.png'"></image>
					</view>
					<view class="con_status" style="color:#FFA500;" v-if="item.check_status == 9">
						<!-- 已终止 -->
						<image :src="BASE_IMG_URL + '/index/stoped.png'"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			},
			styleType:{
				type:String,
				default:'list'
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			//合同详情
			toContractDetail(item) {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractDetail?id='+item.id+'&checkstatus='+item.is_check_success
				})
			},
			toCustomerDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+item.customer.id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.lxr_con_list {
		width:690rpx;
		background:#fff;
		margin:0 auto 20rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		.contract_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:10rpx 24rpx;
			border-bottom:1rpx solid #EDEDED;
			.cont_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.labelimg{
					width:40rpx;
					height:40rpx;
					margin-right:20rpx;
				}
				.cont_num{
					font-size:28rpx;
					color:#666666;
				}
			}
			.con_status{
				font-size:22rpx;
				color:#999;
				padding:0 15rpx;
				image{
					width: 56rpx;
					height: 56rpx;
				}
			}
		}
		.staffimg{
			width:40rpx;
			height:40rpx;
			border-radius: 50%;
			margin-left:15rpx;
		}
		.cont_info{
			padding:24rpx 24rpx 24rpx 45rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cont_info_left{
				.cont_info_text{
					font-size:28rpx;
					color:#999999;
					margin-bottom:15rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
				}
				.pro_li_left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.protext {
						font-size:28rpx;
						color:#999999;
					}
					.probox {
						width: 166rpx;
						height: 24rpx;
						border-radius: 12rpx;
						background: #EDEDED;
						margin: 0 15rpx;
						.proin {
							width: 20%;
							height: 24rpx;
							border-radius: 12rpx;
							background: $uni-text-color;
						}
					}
					.pronum {
						font-size: 28rpx;
						color: #999999;
					}
				}
			}
			.cont_info_money{
				
				.con_status{
					
					image{
						width: 122rpx;
						height: 96rpx;
					}
				}
			}
		}
	}
	.lxr_index_item{
		width:100%;
		background:#F6F6F6;
	}
</style>
