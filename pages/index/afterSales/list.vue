<template>
	<view>
		<view class="wk_li" :class="styleType == 'list' ? '' : 'index_wk_li'" v-for="(item,index) in list" :key="index" @tap.stop="toDetail(item)">
			<view class="wk_top">
				<view class="wk_top_left">
					<view class="wk_tit" >{{item.title}}</view>
				</view>
				<view >
					<view v-if="type == 1">
						<view class="wk_top_right" v-if="item.status == 0">待分配</view>
						<view class="wk_top_right" v-if="item.status == 1">待处理</view>
						<view class="wk_top_right" v-if="item.status == 2">处理中</view>
						<view class="wk_top_right" v-if="item.status == 3">已完成</view>
						<view class="wk_top_right" v-if="item.status == 9">已终止</view>
					</view>
					<view v-if="type == 2">
						<view class="wk_top_right" v-if="item.status == 3 && item.is_visit == 1">已回访</view>
						<view class="wk_top_right" v-if="item.status == 3 && item.is_visit != 1">未回访</view>
					</view>
				</view>
			</view>
			<view class="wk_info">
				<view class="wk_info_lef">
					<view class="wk_lef_text">工单类型：{{item.workorder_type}}</view>
					<view class="wk_lef_text" >工单单号：{{item.workorder_number}}</view>
					<view class="wk_lef_text" >关联客户：{{item.customer?item.customer.name:'无'}}</view>
					<view class="wk_lef_text">创建日期：{{item.createtime}}</view>
				</view>
				<view class="wk_info_right">
					<image :src="item.owner_staff.img" class="riimg"></image>
					<view class="riname">{{item.owner_staff.name}}</view>
				</view>
			</view>
			<view class="wk_bot" v-if="item.workorder_type != '品质异常单' && item.workorder_type != '返厂维修'" @tap.stop.prevent>
				<view class="wk_bot_left" @tap.stop="toCall(item)">
					<image :src="BASE_IMG_URL+'/index/phone-call.png'" class="phoneimg"></image>呼叫
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
			type:{     //1工单列表   2回访列表
				type:Number,
				default:1
			},
			styleType:{    //区分首页  or  列表页  样式
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
			//呼叫
			toCall(item) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: item.contacts.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: item.contacts.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(item.contacts.mobile, true);
				// #endif
			},
			toDetail(item) {
				if(item.workorder_type == '产品发货' || item.workorder_type == '配件配送'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorder/distribution_word?workorderid='+item.id
					})
					return
				}
				if(item.workorder_type == '品质异常单'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorder/quality_order_detail?workorderid='+item.id
					})
					return
				}
				if(item.workorder_type == '返厂维修'){
					uni.navigateTo({
						url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+item.id
					})
					return
				}
				if(item.workorder_type == '设计工单'){
					uni.navigateTo({
						url:'/pagesA/afterSales/designWorkOrder/designDetail?id='+item.id
					})
					return
				}
				if(item.workorder_type == '电话售后'){
					uni.navigateTo({
						url:'/pagesA/afterSales/phoneAftersale/detail?id='+item.id
					})
					return
				}
				uni.navigateTo({
					url:'/pagesA/afterSales/workorderDetail?workorderid='+item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wk_li{
		background: #FFFFFF;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
		width:690rpx;
		padding:30rpx 30rpx 0 30rpx;
		margin:0 auto 24rpx;
		.wk_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom:20rpx;
			border-bottom:1rpx solid #EDEDED;
			.wk_top_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.wk_tit{
					font-size:26rpx;
					color:#666;
				}
				.wk_status{
					font-size:22rpx;
					color:#FF9B26;
					background:rgba(255, 155, 38, 0.1);
					padding:0 10rpx;
					margin-left:15rpx;
				}
			}
			.wk_top_right{
				font-size:24rpx;
				padding:5rpx 15rpx;
				border-radius: 10rpx;
			}
		}
		.wk_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top:20rpx;
			padding-bottom:20rpx;
			.wk_info_lef{
				flex:1;
				margin-right:24rpx;
				.wk_lef_text{
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
				}
			}
			.wk_info_right{
				text-align: center;
				.riimg{
					width:70rpx;
					height:70rpx;
					border-radius: 50%;
					margin-bottom:10rpx;
				}
				.riname{
					font-size:26rpx;
					color:#666666;
				}
				.wk_status{
					font-size:22rpx;
					color:#FF9B26;
					background:rgba(255, 155, 38, 0.1);
					padding:0 10rpx;
					margin-left:15rpx;
				}
			}
		}
		.wk_bot{
			border-top:1rpx solid #EDEDED;
			display: flex;
			justify-content: center;
			align-items: center;
			.wk_bot_left{
				width:50%;
				display: flex;
				justify-content: center;
				align-items: center;
				padding:24rpx 0;
				color: $uni-text-color;
				font-size: 24rpx;
				.addressimg{
					width:40rpx;
					height:48rpx;
					margin-right:10rpx;
				}
				.phoneimg{
					width:31rpx;
					height:31rpx;
					margin-right:10rpx;
				}
			}
		}
	}
	.index_wk_li{
		width:100%;
		background:#F6F6F6;
	}
</style>
