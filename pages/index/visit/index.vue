<template>
	<view>
		<view class="item_right" :class="type == 'list' ? 'listItem' : 'indexItem'" v-for="(item,index) in list" :key="index" >
			<view v-if="item.relation_type == 'event_bak'" @click="toDetail(item)">
				<view class="right_top">
					<view class="t_time" v-if="item.relation_type == 'event'">{{item.start_time}}</view>
					<view class="t_time" v-if="item.relation_type == 'workorder'">{{item.createtime}}</view>
					<view class="t_status" v-if="item.status == '已结束'">{{item.status}}</view>
					<view class="t_status" v-if="item.status == '任务失败'">{{item.status}}</view>
					<view class="t_status" v-if="item.status == '进行中'" style="color:#FE9440;border:1rpx solid #FE9440;">{{item.status}}</view>
					<view class="t_status" v-if="item.status == '未开始'" style="color:#008EFF;border:1rpx solid #008EFF;">{{item.status}}</view>
					<view class="t_status" v-if="item.status == '已取消'" style="color:#999;border:1rpx solid #999;">{{item.status}}</view>
				</view>
				<view class="r_info">
					<view class="r_info_con">
						<view class="con_tit">
							{{item.title}}
							<view class="con_tit_s" v-if="item.level == '普通'" >{{item.level}}</view>
							<view class="con_tit_s" v-if="item.level == '重要'" >{{item.level}}</view>
							<view class="con_tit_s" v-if="item.level == '紧急'">{{item.level}}</view>
							<view class="con_tit_s" v-if="item.level == '重要且紧急'">{{item.level}}</view>
						</view>
						<view class="con_sec">
							<view class="label" v-if="item.type == 1">任务</view>
							<view class="label" v-if="item.type == 2">任务</view>
							<view class="label" v-if="item.type == 3">拜访</view>
							{{item.customer.name}}
						</view>
						<view class="con_thr" v-if="item.use_time">
							用时：{{item.use_time ? item.use_time : 0}}
						</view>
					</view>
					<view class="r_info_sale">
						<image :src="item.staff.img ? item.staff.img : '/static/index/header.png'" class="saleimg" ></image>
						<view class="sale_name">{{item.staff.name}}</view>
					</view>
				</view>
				<view class="processbox" v-if="item.type == 3">
					<uni-steps :options="steps" active-color="#008EFF" :active="(item.process -1)" />
				</view>
			</view>
			<view v-else>
				<view class="warp" @click.stop="toProoDetail(item)">
					<view class="title_warp">
						<view class="top_left">
							<view class="title" v-if="item.type != 4">{{item.title}}</view>
							<view class="title" v-if="item.type == 4">{{item.remark}}</view>
						</view>
						<view class="top_status" v-if="item.status == '已结束'">{{item.status}}</view>
						<view class="top_status" v-if="item.status == '任务失败'">{{item.status}}</view>
						<view class="top_status" v-if="item.status == '进行中'">{{item.status}}</view>
						<view class="top_status" v-if="item.status == '未开始'">{{item.status}}</view>
						<view class="top_status" v-if="item.status == '已取消'">{{item.status}}</view>
					</view>
					<view class="info_wapr">
						<view class="info">
							<view class="text" v-if="item.type != 4">关联客户：{{item.customer?item.customer.name:''}}</view>
							<view class="type" v-if="item.type != 4">任务类型：{{item.event_type}}</view>
							<view class="text" v-if="item.type == 4">协助人：{{item.staff.name}}</view>
							<view class="text" v-if="item.proofin">申请日期：{{item.proofing.application_date}}</view>
							<view class="text" v-if="item.proofin">要求完成日期：{{item.proofing.completion_date}}</view>
							<view class="text" v-if="item.createtime">
								创建日期：
								{{item.createtime}}
							</view>
						</view>
						<view class="staff_info" v-if="item.type != 4">
							<image :src="item.staff.img" class="staffimg" ></image>
							<view class="staff_name" style="margin-bottom:8rpx">{{item.staff.name}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netWorkOrderDetail } from '@/api/api.js'
	
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			},
			type:{
				type:String,
				default:'list'
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				steps:[
					{text:'出发'},
					{text:'到达'},
					{text:'拜访结束'}
				],
				stapsActive:0
			}
		},
		methods:{
			//客户详情
			toCustomerDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+item.id
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/visitDetail?id='+item.id
				})
			},
			//打样详情
			toProoDetail(item) {
				if(item.type == 4) {
					if(item.relation_type == 'workorder'){
						netWorkOrderDetail({id:item.relation_id}).then(workdata=>{
							workdata = workdata.data
							if(workdata.workorder_type == '设计工单'){
								uni.navigateTo({
									url:'/pagesA/afterSales/designWorkOrder/designDetail?id='+workdata.id+'&tabid=3'
								})
							}else if(workdata.workorder_type == '返厂维修'){
								uni.navigateTo({
									url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+workdata.id+'&tabid=6'
								})
							}
						})
					}else{
						//协助任务
						uni.navigateTo({
							url:'/pagesA/afterSales/proofing/assist_detail?id='+item.id+'&workid='+item.relation_id+'&relationtype='+item.relation_type
						})
					}
					return
				}
				if(item.relation_type == 'event'){
					uni.navigateTo({
						url:'/pagesA/customerInfo/visit/visitDetail?id='+item.id
					})
				}else{
					if(item.event_type == '售后服务_上门_上门安装' || item.event_type == '售后服务_上门_上门维修' ){
						uni.navigateTo({
							url:'/pagesA/afterSales/workorderDetail?workorderid='+item.relation_id+'&type=8'
						})
						return
					}
					if(item.event_type == '售后服务_返厂维修'){
						uni.navigateTo({
							url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+item.relation_id
						})
						return
					}
					if(item.event_type == '设计工单'){
						uni.navigateTo({
							url:'/pagesA/afterSales/designWorkOrder/designDetail?id='+item.relation_id
						})
						return
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.con_tit_s{
		color:#F2533E;
		background:rgba(242, 83, 62, 0.1);
		padding:0 20rpx;
		margin-left:5rpx;
		border-radius: 10rpx;
		font-size:22rpx;
		flex-shrink: 0;
	}
	.warp{
		.title_warp{
			padding-bottom:24rpx;
			border-bottom:1rpx solid #EDEDED;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.top_left{
				display: flex;
				justify-content: flex-start;
				.title{
					width:400rpx;
					font-size:30rpx;
					color:#333333;
					margin-right:15rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
			.top_status{
				flex-shrink: 0;
				font-size: 26rpx;
				font-family: PingFang SC;
				color: #333333;
			}
		}
		.info_wapr{
			padding-top: 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.info{
				.customer{
					font-size:24rpx;
					color:$uni-text-color;
					margin-top:15rpx;
				}
				.text{    
					display: flex;
					align-items: center;
					font-size:24rpx;
					color:#999999;
					margin-top:15rpx;
					image{
						margin-right: 10rpx;
						display: inline-block;
						width: 30rpx;
						height: 30rpx;
					}
				}
				.type{
					margin-top:15rpx;
					font-size:24rpx;
					color:#999;
				}
			}
			.staff_info{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.staffimg{
					width:70rpx;
					height:70rpx;
					border-radius: 50%;
					margin-top: 15rpx;
				}
				.staff_name{
					font-size:28rpx;
					color:#999999;
					text-align: center;
				}
				.con_tit_s{
					width: 90rpx;
					height: 34rpx;
					background: #F5F5F5;
					border: 1rpx solid #EDEDED;
					color: #999;
					font-size: 22rpx;
					border-radius: 5rpx;
				}
			}
		}
	}
	.listItem{
		padding:24rpx 40rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.2);
		margin-bottom:24rpx;
		border-radius: 20rpx;
	}
	
	.item_right{
		width: 690rpx;
		height: 261rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
		.right_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:10rpx;
			.t_time{
				font-size:26rpx;
				color:#0287FF;
			}
			.t_status{
				font-size:24rpx;
				color:#0287FF;
				border:1rpx solid #0287FF;
				padding:3rpx 20rpx;
				border-radius: 8rpx;
			}
		}
		.r_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom:24rpx;
			.r_info_con{
				flex:1;
				margin-right:15rpx;
				.con_tit{
					font-size:30rpx;
					color:#333333;
					margin-bottom:25rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.con_tit_s{
						color:#F2533E;
						background:rgba(242, 83, 62, 0.1);
						padding:0 20rpx;
						margin-left:5rpx;
						border-radius: 10rpx;
						font-size:22rpx;
						flex-shrink: 0;
					}
				}
				.con_sec{
					display: flex;
					justify-content: flex-start;
					color:#666666;
					font-size:26rpx;
					.label{
						font-size:26rpx;
						color:#fff;
						padding:0rpx 15rpx;
						background:#0287FF;
						border-radius: 5rpx;
						margin-right:10rpx;
					}
				}
				.con_thr{
					font-size:26rpx;
					color:#666666;
					margin-top:20rpx;
				}
			}
			.r_info_sale{
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.saleimg{
					width:80rpx;
					height:80rpx;
					border-radius: 50%;
					margin-bottom:10rpx;
				}
				.sale_name{
					font-size:26rpx;
					color:#666666;
				}
			}
		}
		.processbox{
			width:90%;
			margin:0 auto;
		}
	}
	.indexItem{
		width:100%;
		padding:24rpx 30rpx;
		margin-bottom:24rpx;
		background:#F6F6F6;
		box-shadow: 0;
		&:last-child{
			border-bottom:0;
		}
	}
</style>
