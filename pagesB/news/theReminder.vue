<template>
	<view class="the_reminder">
		<view class="reminder_item" v-for="(item,index) in list" :key="index" @click="jumpDetail(item)">
			<view class="item_con">
				<view class="item_left">
					<view>{{item.content}}</view>
				</view>
				<view class="circle_dot" v-if="item.status == 0"></view>
			</view>
			<view class="item_time">
				<view class="lxs_time">{{item.send_time}}</view>
				<view v-if="item.relation_type == 'examine'">
					<view class="leixing" v-if="item.examine.relation_type == 'discuss'">讨论</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'assist_event'">协助任务</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'proofing'">打样</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'consume'">费用</view>
					<view class="leixing" v-else-if=" item.examine.relation_type == 'record'">跟进</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'contract'">合同</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'receivables'">回款</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'plan'">回款计划</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'event'">任务</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'customer'">客户</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'seas'">公海</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'article'">文章</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'workorder'">工单</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'parts'">备件</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'approval'">审批</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'work_report'">工作报告</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'customer_nodeal'">未成交提醒</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'achievement'">业绩目标</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'quote'">报价单</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'workorder_receivables'">回款</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'parts_stock_reload'">备件</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'sign'">工作动态</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'daily'">工作报告</view>
					<view class="leixing" v-else-if="item.examine.relation_type == 'invoice'">发票</view>
				</view>
				
				<view class="leixing" v-else-if="item.relation_type == 'discuss'">讨论</view>
				<view class="leixing" v-else-if="item.relation_type == 'assist_event'">协助任务</view>
				<view class="leixing" v-else-if="item.relation_type == 'proofing'">打样</view>
				<view class="leixing" v-else-if="item.relation_type == 'consume'">费用</view>
				<view class="leixing" v-else-if="item.relation_type == 'record'">跟进</view>
				<view class="leixing" v-else-if="item.relation_type == 'contract'">合同</view>
				<view class="leixing" v-else-if="item.relation_type == 'receivables'">回款</view>
				<view class="leixing" v-else-if="item.relation_type == 'plan'">回款计划</view>
				<view class="leixing" v-else-if="item.relation_type == 'event'">任务</view>
				<view class="leixing" v-else-if="item.relation_type == 'customer'">客户</view>
				<view class="leixing" v-else-if="item.relation_type == 'seas'">公海</view>
				<view class="leixing" v-else-if="item.relation_type == 'article'">文章</view>
				<view class="leixing" v-else-if="item.relation_type == 'workorder'">工单</view>
				<view class="leixing" v-else-if="item.relation_type == 'parts'">备件</view>
				<view class="leixing" v-else-if="item.relation_type == 'approval'">审批</view>
				<view class="leixing" v-else-if="item.relation_type == 'work_report'">工作报告</view>
				<view class="leixing" v-else-if="item.relation_type == 'customer_nodeal'">未成交提醒</view>
				<view class="leixing" v-else-if="item.relation_type == 'achievement'">业绩目标</view>
				<view class="leixing" v-else-if="item.relation_type == 'quote'">报价单</view>
				<view class="leixing" v-else-if="item.relation_type == 'workorder_receivables'">回款</view>
				<view class="leixing" v-else-if="item.relation_type == 'parts_stock_reload'">备件</view>
				<view class="leixing" v-else-if="item.relation_type == 'sign'">工作动态</view>
				<view class="leixing" v-else-if="item.relation_type == 'daily'">工作报告</view>
				<view class="leixing" v-else-if="item.relation_type == 'invoice'">发票</view>
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { netMessageList, netWorkOrderDetail, netAssitsDetail } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default {
		mixins:[commonFun],
		data() {
			return {
				page:1,
				limit:10,
				totalPage:1,
				list:[]
			}
		},
		onShow() {
			this.page = 1
			this.list = []
			this.getList()
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods: {
			getList() {
				let params = {
					page: this.page,
					limit: this.limit
				}
				netMessageList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//跳转详情页
			jumpDetail(item) {
				if(item.relation_type == 'examine'){
					//审批
					if(item.examine.relation_type == 'parts') {
						//备件
						let id = item.examine.relation_id
						uni.navigateTo({
							url: '/pagesC/sparepart/myapplyDetail?id='+id+'&type=2'
						})
					}else if(item.examine.relation_type == 'consume'){
						//费用
						let id = item.examine.relation_id
						uni.navigateTo({
							url: '/pagesA/customerInfo/cost/detail?id='+id
						})
					}else if(item.examine.relation_type == 'contract'){
						//合同
						let id = item.examine.relation_id
						uni.navigateTo({
							url: '/pages/index/contractManagements/contractDetail?id=' + id
						})
					}else if(item.examine.relation_type == 'receivables'){
						//回款
						let id = item.examine.relation_id
						uni.navigateTo({
							url: '/pagesA/customerInfo/payment/paymentDetail?id='+id
						})
					}else if(item.examine.relation_type == 'achievement'){
						//目标金额
						let id = item.examine.relation_id
						uni.navigateTo({
							url: '/pages/target/history_detail?id='+id
						})
					}else if(item.examine.relation_type == 'quote') {
						//报价单
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesC/quotation/detail?id='+id
						})
					}else if(item.examine.relation_type == 'workorder') {
						//获取工单 详情 判断是要跳转 返厂维修详情  还是 山门维修详情
						let id = item.examine.relation_id
						netWorkOrderDetail({id}).then(res=>{
							if(res.data.workorder_type == '上门维修' || res.data.workorder_type == '上门安装' || res.data.workorder_type == '生产工单' || res.data.workorder_type == '配件安装'){
								//  售后服务 上门维修 
								uni.navigateTo({
									url:'/pagesA/afterSales/workorderDetail?workorderid='+id
								})
							}else if(res.data.workorder_type == '返厂维修'){
								//  售后服务 返厂维修  优惠金额 审批
								uni.navigateTo({
									url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+id
								})
							}else if(res.data.workorder_type == '品质异常单'){
								uni.navigateTo({
									url:'/pagesA/afterSales/workorder/quality_order_detail?workorderid='+id
								})
							}else if(res.data.workorder_type == '产品发货' || res.data.workorder_type == '配件配送'){
								uni.navigateTo({
									url:'/pagesA/afterSales/workorder/distribution_word?workorderid='+id
								})
							}else if(res.data.workorder_type == '设计工单'){
								uni.navigateTo({
									url:'/pagesA/afterSales/designWorkOrder/designDetail?id='+id
								})
							}else if(res.data.workorder_type == '电话售后'){
								uni.navigateTo({
									url:'/pagesA/afterSales/phoneAftersale/detail?id='+id
								})
							}
						})
					}else if(item.examine.relation_type == 'approval'){
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesA/user/work_approval/approvalDetail?id='+id
						})
					}else if(item.examine.relation_type == 'leave'){
						//请假
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesA/punchclock/leave/detail?id='+id
						})
					}else if(item.examine.relation_type == 'card'){
						//补卡
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesA/punchclock/card/detail?id='+id
						})
					}else if(item.examine.relation_type == 'work_report'){
						//工作报告
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesC/journal/journal_detail?id='+id
						})
					}else if(item.examine.relation_type == 'invoice'){
						//发票
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesB/invoice/detail?id='+id
						})
					}
				}else if(item.relation_type == 'consume'){
					//费用
					let id = item.relation_id
					uni.navigateTo({
						url: '/pagesA/customerInfo/cost/detail?id='+id
					})
				}else if(item.relation_type == 'record'){
					//跟进记录
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesB/cluesManagement/followUpDetail/followUpDetail?id='+id,
					})
				}else if(item.relation_type == 'contract'){
					//合同
					let id = item.relation_id
					uni.navigateTo({
						url: '/pages/index/contractManagements/contractDetail?id=' + id
					})
				}else if(item.relation_type == 'receivables') {
					//回款
					let id = item.relation_id
					uni.navigateTo({
						url: '/pagesA/customerInfo/payment/paymentDetail?paymentid='+id
					})
				}else if(item.relation_type == 'event') {
					//任务
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesA/customerInfo/visit/visitDetail?id='+id
					})
				}else if(item.relation_type == 'customer' || item.relation_type == 'seas') {
					//客户
					let id = item.relation_id
					uni.navigateTo({
						url: '/pagesA/customerInfo/myCustomer/customerDetail?customerid='+id
					})
				}else if(item.relation_type == 'sign') {
					//签到
					let id = item.relation_id
					uni.navigateTo({
						url: '/pagesA/customerInfo/myCustomer/record_detail?id='+id
					})
				}else if(item.relation_type == 'achievement'){
					//目标金额
					let id = item.relation_id
					uni.navigateTo({
						url: '/pages/target/history_detail?id='+id
					})
				}else if(item.relation_type == 'daily'){
					//工作报告详情
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesB/workreport/workDetail?id='+id
					})
				}else if(item.relation_type == 'notice'){
					//公告
					let id = item.relation_id
					uni.navigateTo({
						url:'/pages/news/noticeDetail?id='+id
					})
				}else if(item.relation_type == 'approval'){
					//办公
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesA/user/work_approval/approvalDetail?id='+id
					})
				}else if(item.relation_type == 'leave'){
					//请假
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesA/punchclock/leave/detail?id='+id
					})
				}else if(item.relation_type == 'card'){
					//补卡
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesA/punchclock/card/detail?id='+id
					})
				}else  if(item.relation_type == 'workorder_receivables'){
					//财务 确认收款
					uni.navigateTo({
						url:'/pagesB/collection/workorder_cost_confirm?id='+item.relation_id
					})
				}else if(item.relation_type == 'discuss'){
					//传阅
					uni.navigateTo({
						url:'/pagesA/afterSales/moreOperation/discussDetail?id='+item.relation_id
					})
				}else if(item.relation_type == 'assist_event'){
					//协助任务详情
					netAssitsDetail({id:item.relation_id}).then(res=>{
						res = res.data
						if(res.relation_type == 'workorder'){
							netWorkOrderDetail({id:res.relation_id}).then(workdata=>{
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
						}
					})
				}else if(item.relation_type == 'article') {
					//文章 详情
					uni.navigateTo({
						url:'/pagesA/user/knowledge_base/detail?id='+item.relation_id
					})
				}else if(item.relation_type == 'workorder'){
					//工单详情
					//获取工单 详情 判断是要跳转 返厂维修详情  还是 山门维修详情
					this.jumpWorkorderDetail(item)
				}else if(item.relation_type == 'parts'){
					//备件详情
					uni.navigateTo({
						url: '/pagesC/sparepart/myapplyDetail?id='+item.relation_id
					})
				}else if(item.relation_type == 'parts_stock_reload'){
					//备件
					uni.navigateTo({
						url:'/pagesC/sparepart/myapplyDetail?id='+item.relation_id
					})
				}else if(item.relation_type == 'work_report'){
					//工作报告
					uni.navigateTo({
						url:'/pagesC/journal/journal_detail?id='+item.relation_id
					})
				}else if(item.relation_type == 'invoice'){
					//发票
					uni.navigateTo({
						url:'/pagesB/invoice/detail?id='+item.relation_id
					})
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.the_reminder {
		padding: 40rpx 20rpx 100rpx;

		.reminder_item {
			background-color: #fff;
			border-radius: 10rpx;
			padding: 0 30rpx;
			margin-bottom: 20rpx;

			.item_con {
				display: flex;
				padding: 20rpx 0;
				justify-content: space-between;
				.item_left{
					display: flex;
					justify-content: flex-start;
				}
				.icon-task {
					padding-right: 20rpx;
				}

				.circle_dot {
					width: 12rpx;
					height: 12rpx;
					background-color: #fb6260;
					margin: 11rpx 0 0 80rpx;
					border-radius: 10rpx;
				}

			}

			.item_time {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 20rpx;
				color: #999;
				:last-child {
					margin-top: 5rpx;
				}
				.leixing{
					padding:5rpx 15rpx;
					background:$uni-text-color;
					color:#fff;
					font-size:26rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
	.lxs_time{
		padding-left: 5px;
		padding-top: 1px;
	}
</style>
