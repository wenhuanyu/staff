<template>
	<view class="warp">
		<view class="sche_con_item" v-if="type == 1 || type == 2" v-for="(item,index) in list" :key="index">
			<view class="item_left">
				<view class="start-time">
					<image :src="BASE_IMG_URL+'start_time.png'" class="timeimg" mode="scaleToFill"></image>
					:{{item.start_time}}
				</view>
				<view class="content-time">
					<view class="title">{{item.title}}</view>
					<view>备注：{{item.remark}}</view>
					<view>关联业务：</view>
					<view class="yewu" v-if="item.relation_type == 3" @click="toContractDetail(item.relation_id)">
						<image :src="BASE_IMG_URL+'file.png'" class="fileimg" mode="scaleToFill"></image>
						合同
					</view>
					<view class="yewu" v-if="item.relation_type == 1" @click="toMore(item.relation_id)">
						<image :src="BASE_IMG_URL+'file.png'" class="fileimg" mode="scaleToFill"></image>
						客户
					</view>
					<view class="yewu" v-if="item.relation_type == 2" @click="jumpDetail(item.relation_id)">
						<image :src="BASE_IMG_URL+'file.png'" class="fileimg" mode="scaleToFill"></image>
						联系人
					</view>
					<view class="yewu" v-if="item.relation_type == 4" @click="moreClick(item.relation_id)">
						<image :src="BASE_IMG_URL+'file.png'" class="fileimg" mode="scaleToFill"></image>
						线索
					</view>
				</view>
				<view class="end-time">
					<image :src="BASE_IMG_URL+'end_time.png'" class="timeimg" mode="scaleToFill"></image>
					:{{item.end_time}}
				</view>
			</view>
			<view @click="toEditstatuss(item)">
				<view class="item_right" v-if="item.status == 0">
					<image :src="BASE_IMG_URL+'time.png'" mode="scaleToFill"></image>
					<view>未开始</view>
				</view>
				<view class="item_right" v-if="item.status == 1">
					<image :src="BASE_IMG_URL+'time_ing.png'" mode="scaleToFill"></image>
					<view>进行中</view>
				</view>
				<view class="item_right" v-if="item.status == 2">
					<image :src="BASE_IMG_URL+'time_end.png'" mode="scaleToFill"></image>
					<view>已结束</view>
				</view>
				<view class="item_right" v-if="item.status == 3">
					<image :src="BASE_IMG_URL+'time_over.png'" mode="scaleToFill"></image>
					<view>已取消</view>
				</view>
			</view>
		</view>
		<view class="sche_con_item" v-if="type == 3" v-for="(item,index) in list" :key="index"
			@click="toContractDetail(item.id)">
			<view class="lxr_con_list">
				<view class="name">{{item.name}}</view>
				<view class="info">已回款 {{item.receivables.repayment_money}} 待回款 {{item.receivables.be_money}}</view>
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
					<view class="pro_li_right">￥{{item.receivables.be_money}}</view>
				</view>
				<view class="con_status" v-if="item.check_status == 0">
					待审核
				</view>
				<view class="con_status" v-if="item.check_status == 1">
					审核中
				</view>
				<view class="con_status" v-if="item.check_status == 2">
					审核通过
				</view>
				<view class="con_status warnstatus" v-if="item.check_status == 3">
					审核未通过
				</view>
				<view class="con_status warnstatus" v-if="item.check_status == 4">
					已撤回
				</view>
			</view>
		</view>
		<view class="sche_con_item" v-if="type == 4" v-for="(item,index) in list" :key="index"
			@click="toPaymentDetail(item)">
			<view class="cust_item_con">
				<view class="con_info">
					<view>{{item.number}}</view>
					<view>回款日期: {{item.return_time}}</view>
					<view class="recostatus" v-if="item.check_status == 0">待审核</view>
					<view class="recostatus" v-if="item.check_status == 1">审核中</view>
					<view class="recostatus" v-if="item.check_status == 2">审核通过</view>
					<view class="recostatus warnstatus" v-if="item.check_status == 3">审核未通过</view>
					<view class="recostatus warnstatus" v-if="item.check_status == 4">已撤回</view>
				</view>
				<view class="con_money">
					&yen; {{item.money}}
				</view>
			</view>
		</view>
		<view class="sche_con_item" v-if="type == 5" v-for="(item,index) in list" :key="index">
			<view class="cust_item_con">
				<view class="con_info">
					<view>{{item.num}}</view>
					<view>待回款日期: {{item.return_date}}</view>
					<view>回款方式: {{item.return_type}}</view>
				</view>
				<view class="con_money">
					&yen; {{item.money}}
				</view>
			</view>
		</view>
		<view class="clineInfo" v-if="type == 9" v-for="(item,index) in list" :key="index" @click.stop="toDetail(item)">
			<view class="info_head">
				<view>{{item.name}}</view>
			</view>
			<view class="info_main">
				<view >
					<view class="main_left">
						<view class="left_top" v-if="item.customer" style="margin-top: 20rpx;color: #666;font-size: 30rpx;">
							{{item.customer ? item.customer.name : '--'}}
						</view>
						<view class="left_followUp" style="margin-top: 20rpx;color: #666;font-size: 30rpx;">
							<view>下次跟进时间：</view>
							<view>{{item.next_time ? item.next_time : '--'}}</view>
						</view>
						<view class="left_foot">
							<view class="l_box">
								<span v-if="item.type == 0">初期沟通</span>
								<span v-if="item.type == 1">立项跟踪</span>
								<span v-if="item.type == 2">方案/报价</span>
								<span v-if="item.type == 3">谈判审核</span>
								<span v-if="item.type == 4">赢单</span>
								<span v-if="item.type == 5">输单</span>
								<span v-if="item.type == 6">无效</span>
							</view>
						</view>
					</view>
				</view>
				<view class="main_right" v-if="item.owner_staff">
					<image :src="item.owner_staff ? item.owner_staff.img : BASE_IMG_URL+'/headImg.png'"  mode="scaleToFill">
					</image>
					<view>{{item.owner_staff?item.owner_staff.name:''}}</view>
				</view>
			</view>
			<view class="info_footer" @click.stop.prevent>
				<view class="footer_content" @click="toAddfollow(item)">
					<image :src="BASE_IMG_URL+'tj.png'"  mode="scaleToFill"></image>
					<view>跟进</view>
				</view>
				<view class="footer_content" @click="toTrans(item)">
					<image :src="BASE_IMG_URL+'rq.png'"  mode="scaleToFill"></image>
					<view>转移</view>
				</view>
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>

		<!-- 任务修改状态 -->
		<pop-status :schesTitle="schesTitle" :schestatus="schestatus" v-if="statusPop" @closeStatus="closeStatus"
			@changeStatus="changeStatus" @changeSuccess="changeStatusSuccess"></pop-status>
	</view>
</template>

<script>
	import {
		netGetFollowList,
		netGetScheList,
		netGetContractList,
		netGetPaymentRemindList,
		netGetPaymentList,
		netEditScheculeStatus
	} from '@/api/api.js'
	import popStatus from './popStatus.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default {
		data() {
			return {
				list: [],
				type: '', //1待跟进任务  2待处理任务   3待审核合同   4待审核回款  5待回款提醒  9待跟进商机
				statusPop: false, //修改 任务  状态 弹窗
				scheid: '', //任务id
				schestatus: '', //任务 状态
				schesTitle: '', //任务 标题
				BASE_IMG_URL: BASE_IMG_URL,
			}
		},
		components: {
			popStatus
		},
		onLoad(options) {
			this.type = options.type
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				if (this.type == 1) {
					uni.setNavigationBarTitle({
						title: '待跟进任务'
					})
					netGetFollowList().then(res => {
						this.list = res.data
					})
				} else if (this.type == 2) {
					uni.setNavigationBarTitle({
						title: '待处理任务'
					})
					netGetScheList().then(res => {
						this.list = res.data
						netGetFollowList().then(res => {
							this.list = this.list.concat(res.data)
						})
					})
				} else if (this.type == 3) {
					uni.setNavigationBarTitle({
						title: '待审核合同'
					})
					netGetContractList().then(res => {
						this.list = res.data
					})
				} else if (this.type == 4) {
					uni.setNavigationBarTitle({
						title: '待审核回款'
					})
					netGetPaymentList().then(res => {
						this.list = res.data
					})
				} else if (this.type == 5) {
					uni.setNavigationBarTitle({
						title: '待回款提醒'
					})
					netGetPaymentRemindList().then(res => {
						this.list = res.data
					})
				}
			},
			//合同详情
			toContractDetail(id) {
				uni.navigateTo({
					url: '/pagesB/contract/contractDetail?id=' + id
				})
			},
			//回款  详情
			toPaymentDetail(item) {
				uni.navigateTo({
					url: '/pagesB/contract/paymentDetail?id=' + item.id
				})
			},
			//修改任务状态
			toEditstatuss(item) {
				this.scheid = item.id
				this.schestatus = item.status
				this.schesTitle = item.title
				this.statusPop = true
				uni.hideTabBar({
					animation: true
				})
			},
			//关闭  修改任务 状态
			closeStatus() {
				this.statusPop = false
				this.schestatus = ''
				this.scheid = ''
				uni.showTabBar({
					animation: true
				})
			},
			changeStatus(status) {
				this.schestatus = status
			},
			//任务 状态  修改成功
			changeStatusSuccess() {
				let params = {
					id: this.scheid,
					status: this.schestatus
				}
				netEditScheculeStatus(params).then(res => {
					this.statusPop = false
					this.schestatus = ''
					this.scheid = ''
					uni.showToast({
						title: '任务状态修改成功',
						icon: 'none'
					})
					setTimeout(() => {
						this.getList()
					}, 2000)
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.start-time {
		color: $uni-text-color;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 30rpx;

		.timeimg {
			width: 50rpx;
			height: 41rpx;
		}
	}

	.end-time {
		color: $uni-text-color;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 30rpx;

		.timeimg {
			width: 50rpx;
			height: 41rpx;
			margin-right: 10rpx;
		}
	}

	.warp {
		padding: 20rpx;
	}

	.warnstatus {
		color: #ec7f51;
	}

	.sche_con_item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fcfcfc;
		padding: 20rpx;
		margin-bottom: 24rpx;

		.item_left {
			flex: 1;
			color: #999;

			view {
				margin-bottom: 10rpx;
			}

			.title {
				color: #333;
			}

			.yewu {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				background: #f5f7fa;
				padding: 10rpx;

				.fileimg {
					width: 20rpx;
					height: 20rpx;
					margin-right: 15rpx;
				}
			}

			:last-child {
				margin-bottom: 0;
			}
		}

		.item_right {
			display: flex;
			align-items: center;
			color: #999;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
		}
	}

	.noList {
		font-size: 24rpx;
		text-align: center;
		padding: 80rpx 0;
		color: #666;
	}

	.lxr_con_list {
		width: 750rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #C0C0C0;

		&:last-child {
			border-bottom: none;
		}

		.name {
			font-size: 28rpx;
			color: #333333;
			margin-top: 15rpx;
		}

		.info {
			font-size: 24rpx;
			color: #999999;
			margin: 10rpx 0;
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
						background: #ff7800;
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

		.con_status {
			font-size: 24rpx;
			color: $uni-text-color;
			margin-top: 10rpx;
		}

	}

	.cust_item_con {
		padding: 15rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		.con_info {
			padding: 10rpx 0;

			:first-child {
				color: #060606;
				font-weight: 700;
				line-height: 50rpx;
				font-size: 28rpx;
			}

			:last-child {
				line-height: 50rpx;
			}
		}

		.con_money {
			color: #ec7f51;
			font-size: 28rpx;
			line-height: 150rpx;
			font-weight: 700;
		}
	}
	.clineInfo {
		background-color: #fff;
		padding: 30rpx 45rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: 2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);
	
		.info_head {
			display: flex;
			justify-content: space-between;
	
			:first-child {
				font-size: 34rpx;
				font-weight: 700;
				color: #333;
			}
		}
	
		.info_main {
			display: flex;
			justify-content: space-between;
	
			.main_left {
				.left_followUp {
					display: flex;
					padding-bottom: 30rpx;
					font-size: 30rpx;
					color: #666;
				}
	
				.left_star {
					font-size: 30rpx;
					color: #666;
					display: flex;
					padding-bottom: 30rpx;
				}
	
				.left_foot {
					padding-bottom: 20rpx;
	
					.l_box {
						margin-right: 35rpx;
						float: left;
	
						span {
							background: $uni-bg-opacity;
							padding: 5rpx 12rpx;
							font-size: 26rpx;
							color: $uni-text-color;
							border-radius: 5rpx;
						}
					}
				}
			}
	
			.main_right {
				text-align: center;
				padding: 20rpx 15rpx 0 0;
	
				image {
					border-radius: 50%;
					width: 129rpx;
					height: 129rpx;
					margin-bottom: 5rpx;
				}
			}
		}
	
		.info_footer {
			display: flex;
			justify-content: space-around;
			padding-top: 30rpx;
			height: 80rpx;
			border-top: 1px solid #ededed;
			margin-top: 20rpx;
	
			.footer_content {
				// width: 25%;
				line-height: 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width: 48rpx;
					height: 48rpx;
					margin-right: 15rpx;
				}
			}
		}
	}
</style>
