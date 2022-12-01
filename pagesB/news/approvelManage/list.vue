<template>
	<view class="">
		<view class="tab_list">
			<view class="tabli" :class="status == 0 ? 'tabliactive' : ''" @click="changeFirTab(0)">待我审批的</view>
			<view class="tabli" :class="status == 1 ? 'tabliactive' : ''" @click="changeFirTab(1)">我已审批的</view>
			<!-- <view class="tabli" :class="status == 2 ? 'tabliactive' : ''" @click="changeFirTab(2)">已撤销的</view> -->
		</view>
		
		<view class="the_reminder">
			<view class="reminder_item" v-for="(item,index) in list" :key="index" @click="jumpDetail(item)">
				<view class="rem_top">
					<view class="top_left">
						<view class="name">{{item.relation_name?item.relation_name:''}}</view>
						<view class="time">{{item.createtime}}</view>
					</view>
					<view class="top_right" v-if="item.status == 0">待审核</view>
					<view class="top_right" v-if="item.status == 1">审核通过</view>
					<view class="top_right" v-if="item.status == 2">审核拒绝</view>
					<view class="top_right" v-if="item.status == 3">撤销</view>
				</view>
				<view class="item_con">
					<view class="item_left">
						<view class="iconfont icon-task"></view>
						<view>{{item.content_info}}</view>
					</view>
				</view>
			</view>
			<view style="height: 200rpx;"></view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
	</view>
</template>

<script>
	import { netApprovelNotice } from '@/api/api.js'
	
	export default {
		data() {
			return {
				page:1,
				limit:10,
				totalPage:1,
				list:[],
				type:'',   //consume 费用 contract 合同 receivables 回款 achievement 业绩目标 approval 审批
				status:0,   //0待审批   1已审批
			}
		},
		onLoad(options) {
			this.type = options.type
		},
		onShow() {
			this.init()
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods: {
			changeFirTab(type) {
				this.status = type
				this.init()
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					page: this.page,
					limit: this.limit,
					type: this.type,
					status: this.status
				}
				netApprovelNotice(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//跳转详情页
			jumpDetail(item) {
				if(item.relation_type == 'examine'){
					//审批
					if(item.examine.relation_type == 'consume'){
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
							url: '/pagesA/customerInfo/payment/paymentDetail?paymentid='+id
						})
					}else if(item.examine.relation_type == 'achievement'){
						//目标金额
						let id = item.examine.relation_id
						uni.navigateTo({
							url: '/pages/target/history_detail?id='+id
						})
					}else if(item.examine.relation_type == 'approval'){
						//办公
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesA/user/work_approval/approvalDetail?id='+id
						})
					}else if(item.examine.relation_type == 'leave'){
						//请假
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesB/punchclock/leave/detail?id='+id
						})
					}else if(item.examine.relation_type == 'card'){
						//补卡
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesB/punchclock/card/detail?id='+id
						})
					}else if(item.examine.relation_type == 'quote'){
						//报价单
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesC/quotation/detail?id='+id
						})
					}else if(item.examine.relation_type == 'parts'){
						//备件
						let id = item.examine.relation_id
						uni.navigateTo({
							url:'/pagesC/sparepart/myapplyDetail?id='+id
						})
					}
						
				}else if(item.relation_type == 'consume'){
					//费用
					let id = item.relation_id
					uni.navigateTo({
						url: '/pagesA/customerInfo/cost/detail?id='+id
					})
				}else if(item.relation_type == 'contract'){
					//合同
					let id = item.relation_id
					uni.navigateTo({
						url: '/pages/index/contractManagements/contractDetail?id=' + id
					})
				}else if(item.relation_type == 'plan') {
					//回款 计划
					let id = item.relation_id
					uni.navigateTo({
						url: '/pagesB/contract/contractDetail?id=' + id
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
				}else if(item.relation_type == 'customer') {
					//客户
					let id = item.relation_id
					uni.navigateTo({
						url: '/pagesA/customerInfo/myCustomer/customerDetail?customerid='+id
					})
				}else if(item.relation_type == 'sign') {
					//签到
					let id = item.relation_id
					uni.navigateTo({
						url: '/pagesB/signin/signin'
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
						url:'/pagesB/news/noticeDetail?id='+id
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
						url:'/pagesB/punchclock/leave/detail?id='+id
					})
				}else if(item.relation_type == 'card'){
					//补卡
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesB/punchclock/card/detail?id='+id
					})
				}else if(item.relation_type == 'quote'){
					//报价单
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesC/quotation/detail?id='+id
					})
				}else if(item.relation_type == 'parts'){
					//备件
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesC/sparepart/myapplyDetail?id='+id
					})
				}else if(item.relation_type == 'invoice'){
					//发票
					let id = item.relation_id
					uni.navigateTo({
						url:'/pagesB/invoice/detail?id='+id
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
	.tab_list{
		width:750rpx;
		height:80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background:#fff;
		.tabli{
			font-size:24rpx;
			color:#333;
			line-height: 75rpx;
			text-align: center;
			border-bottom:4rpx solid #fff;
		}
		.tabliactive{
			border-bottom:4rpx solid $uni-text-color;
		}
	}
	.the_reminder {
		padding: 40rpx 20rpx 100rpx;
		.reminder_item {
			background-color: #fff;
			border-radius: 10rpx;
			padding:30rpx;
			margin-bottom: 20rpx;
			.rem_top{
				display: flex;
				justify-content: space-between;
				margin-bottom:15rpx;
				.top_left{
					.name{
						font-size:30rpx;
						color:#333;
						margin-bottom:15rpx;
					}
					.time{
						font-size:24rpx;
						color:#999;
					}
				}
				.top_right{
					font-size:24rpx;
					width:100rpx;
					height:45rpx;
					text-align: center;
					line-height: 45rpx;
					border-radius: 10rpx;
					background:$uni-bg-opacity;
					color:$uni-text-color;
				}
			}
			.item_con {
				display: flex;
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
		}
	}
	.lxs_time{
		padding-left: 5px;
		padding-top: 1px;
	}
</style>
