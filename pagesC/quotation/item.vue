<template>
	<view>
		<view class="quo_item" :class="styleType == 'list' ? '' : 'quo_item_index'" v-for="(item,index) in list" :key="index" @tap.stop="toDetail(item)">
			<view class="quo_top">
				<view class="quo_num">报价单号：{{item.number}}</view>
				<view class="qun_right">
					<view class="staffname">{{item.owner_staff.name}}</view>
					<image :src="item.owner_staff.img ? item.owner_staff.img : '/static/index/header.png'" class="staffimg" ></image>
				</view>
			</view>
			<view class="quo_info">
				<view class="quo_info_left">
					<view class="quo_name"  @tap.stop="toCustomerDetail(item.customer)">
						甲方：
						<view>{{item.customer.name}}</view>
					</view>
					<view class="quo_money">报价单金额：<span>￥{{item.quote_amount}}</span></view>
					<view class="quo_money">报价日期：{{item.quote_date?item.quote_date:''}}</view>
				</view>
				<view class="quo_info_right">
					<view class="quo_status" v-if="item.check_status == 0 ||item.check_status == 1">
						<!-- 待审核 -->
						<image :src="BASE_IMG_URL + '/index/check.png'" ></image>
					</view>
					<view class="quo_status" v-if="item.check_status == 2">
						<!-- 已通过 -->
						<image :src="BASE_IMG_URL + '/index/passed.png'" ></image>
					</view>
					<view class="quo_status" v-if="item.check_status == 3">
						<!-- 已拒绝 -->
						<image :src="BASE_IMG_URL + '/index/refused.png'" ></image>
					</view>
					<view class="quo_status" v-if="item.check_status == 9">
						<!-- 已作废 -->
						<image :src="BASE_IMG_URL + '/index/useless.png'" ></image>
					</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			},
			type:{
				type:Number,
				default:1
			},
			styleType:{
				type:String,
				default:'list'
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		created() {
		},
		methods:{
			//客户详情
			toCustomerDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+item.id
				})
			},
			//详情
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesC/quotation/detail?id='+item.id+'&type='+this.type
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.quo_item{
		width:690rpx;
		background:#fff;
		border-radius: 10rpx;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		margin:24rpx auto 0;
		padding:0 30rpx;
		.quo_top{
			padding:15rpx 0;
			border-bottom:1rpx solid #EDEDED;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.quo_num{
				font-size:26rpx;
				color:#666;
			}
			.qun_right{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.staffimg{
					width:54rpx;
					height:54rpx;
					border-radius: 50%;
					margin-left:15rpx;
				}
				.staffname{
					text-align: center;
					font-size:28rpx;
					color:#999999;
				}
			}
		}
		.quo_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0;
			.quo_info_left{
				flex:1;
				margin-right:24rpx;
				.quo_name{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					color:$uni-text-color;
					font-size:26rpx;
					margin-bottom:15rpx;
				}
				.quo_money{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
					span{
						font-size:26rpx;
					}
				}
			}
			.quo_info_right{
				text-align: center;
				
				.quo_status{
					
					image{
						width: 122rpx;
						height: 96rpx;
					}
				}
			}
		}
	}
	.quo_item_index{
		width:100%;
		background:#F6F6F6;
	}
</style>
