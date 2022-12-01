<template>
	<view style="padding-bottom:50rpx">
		<view class="topwarp" v-if="info.customer">
			<view class="title">关联客户</view>
			<view class="customer" @click="toCustomerDetail">客户名称：<span>{{info.customer.name}}</span></view>
		</view>
		<view class="topwarp">
			<view class="title">关联工单</view>
			<view class="customer" @click="toWorkorderDetail">工单：<span>{{info.workorder_type}}-{{info.workorder_number}}</span></view>
		</view>
		
		<view class="infowarp">
			<view class="title" style="padding:30rpx 0 10rpx 70rpx">收款明细：</view>
			<view class="zy-content">
				<view class="info_right">
					<view class="infosec" style="margin:15rpx 0;" v-if="info.is_financial_audit == 0">收款情况：<span style="color:#008EFF">未到账</span></view>
					<view class="infosec" style="margin:15rpx 0;" v-else>收款情况：<span style="color:#008EFF">已到账</span></view>
					<view class="infosec" style="margin:15rpx 0;">收款金额：{{info.money?info.money:''}}</view>
					<view class="infosec" style="margin:15rpx 0;"><image :src="BASE_IMG_URL + '/index/clock.png'" ></image>{{info.pay_time}}</view>
				</view>
			</view>
		</view>
		
		<view class="infowarp">
			<view class="title">凭证：</view>
			<view class="imglist">
				<image :src="item" v-for="(item,index) in info.pay_files" :key="index" @click="toPriveImg(info.pay_files,index)" class="costimg" ></image>
			</view>
		</view>
		
		<view style="height:calc(100rpx + env(safe-area-inset-bottom))"></view>
		<view class="bot_warp">
			<view class="bot_btn" v-if="info.is_financial == 1" @click="$noMultipleClicks(toConfirmReceipt)">确认收款</view>
		</view>
	</view>
</template>

<script>
	import { netWorkOrderDetail, netPaymentApproval, netTerminationCost, netToconfirm } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,   //防止重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				info:{},
				showImg:false,
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getDetail()
		},
		methods:{
			getDetail() {
				netWorkOrderDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			toPriveImg(arr,index) {
				uni.previewImage({
					current:index,
					urls:arr,
					success:(res)=>{
						this.showImg = true
					}
				})
			},
			//客户 详情
			toCustomerDetail() {
				this.showImg = false
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.info.customer.id
				})
			},
			//工单详情
			toWorkorderDetail() {
				let params = {
					relation_id: this.info.id
				}
				this.jumpWorkorderDetail(params)
			},
			//去确认是否 收款
			toConfirmReceipt() {
				netToconfirm({workorder_id:this.info.id}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getDetail()
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topwarp{
		display: flex; 
		align-items: center; 
		justify-content: flex-start; 
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		.customer{
			font-size:24rpx;
			color:#333333;
			padding:0 50rpx;
			span{
				color:$uni-text-color;
			}
		}
	}
	.title{
		font-size:26rpx;
		color:#666666;
		padding:30rpx 0 30rpx 70rpx;
		position: relative;
		&::before{
			position: absolute;
			left:30rpx;
			top:34rpx;
			content:'';
			width: 10rpx;
			height: 25rpx;
			background: $uni-btn-bg-color;
			border-radius: 5rpx;
		}
	}
	.infowarp{
		display: flex;
		flex-direction: column;
		width: 750rpx;
		background: #FFFFFF;
		border: 1px solid #FFFFFF;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		
		.zy-content{
			padding-left:70rpx;
			.info_left{
				margin-left:24rpx;
				.staffimg{
					width:85rpx;
					height:85rpx;
					border-radius: 50%;
					margin-bottom:15rpx;
				}
				.staff_name{
					font-size:28rpx;
					color:#999999;
					text-align: center;
				}
				.callwarp{
					display: flex;
					justify-content: center;
					align-items: center;
					font-size:28rpx;
					color:$uni-text-color;
					margin-top:15rpx;
					.btnimg{
						width:42rpx;
						height:40rpx;
						margin-right:10rpx;
					}
				}
			}
			.info_right{
				.infosec{
					font-size:26rpx;
					color:#999999;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					image{
						width: 30rpx;
						height: 30rpx;
					}
				}
			}
		}
		
	}
	.bot_warp{
		width:750rpx;
		height:calc(100rpx + env(safe-area-inset-bottom));
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		left:0;
		bottom:0;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		padding:0 24rpx;
		background:#fff;
		z-index: 99;
		.bot_btn{
			width:220rpx;
			height:70rpx;
			border-radius: 10rpx;
			background:$uni-text-color;
			font-size:26rpx;
			text-align: center;
			line-height: 70rpx;
			color:#fff;
		}
	}
	.operation_record {
		background:#fff;
		padding: 20rpx 30rpx;
		.record_item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			padding-bottom:20rpx;
			border-bottom:1rpx solid #EAEAEA;
			margin-bottom:20rpx;
			&:last-child{
				border-bottom:none;
			}
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}
			.record_info {
				flex: 1;
				margin-left: 25rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				.info_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom:10rpx;
				}
				.shenhetext{
					font-size:26rpx;
					color:#666;
					line-height: 34rpx;
				}
			}
			.record_line {
				position: absolute;
				top: -102rpx;
				left: -26rpx;
				height: 105rpx;
				border-left: 4rpx dotted #dedede;
			}
		}
	}
	.costbox{
		padding:0 50rpx;
		.costinfo{
			display: flex;
			justify-content: space-between;
			.costleft{	
				.costfir{
					font-size:28rpx;
					color:#999999;
					margin-bottom:15rpx;
					span{
						color:#F2533E;
					}
				}
			}
			.costright{
				height:132rpx;
				.itemstatusimg{
					width:173rpx;
					height:132rpx;
				}
				.costfir{
					font-size:28rpx;
					color:#999999;
					margin-bottom:15rpx;
					span{
						color:#F2533E;
					}
				}
			}
		}
		
	}
	
	.imglist{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap:wrap;
		padding:24rpx;
		.costimg{
			width:140rpx;
			height:140rpx;
			border-radius: 20rpx;
			margin-right:56rpx;
			margin-bottom:15rpx;
			flex-shrink: 0;
			&:nth-child(3n){
				margin-right:0;
			}
		}
	}
</style>
