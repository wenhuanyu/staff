<template>
	<view class="news">
		<view class="news_item" @click="toLookList('contract')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/richeng.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>合同审批</view>
				<view v-if="info.contract">{{info.contract.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.contract && info.contract.count">{{info.contract.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList('receivables')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/huikuan.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>回款审批</view>
				<view v-if="info.receivables">{{info.receivables.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.receivables && info.receivables.count">{{info.receivables.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList('consume')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/gonggao1.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>费用审批</view>
				<view v-if="info.consume">{{info.consume.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.consume && info.consume.count">{{info.consume.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList('quote')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/index/baojia_sp.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>报价单审批</view>
				<view v-if="info.quote">{{info.quote.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.quote && info.quote.count">{{info.quote.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList('parts')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/index/part_sp.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>备件出入库审批</view>
				<view v-if="info.parts">{{info.parts.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.parts && info.parts.count">{{info.parts.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList('achievement')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/gongzuo1.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>业绩目标审批</view>
				<view v-if="info.achievement">{{info.achievement.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.achievement && info.achievement.count">{{info.achievement.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList('invoice')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/index/invoice_ap.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>发票审批</view>
				<view v-if="info.invoice">{{info.invoice.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.invoice && info.invoice.count">{{info.invoice.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList('approval')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/daiban.png'"></image>
			</view>
			<view class="item_con">
				<view>办公审批</view>
				<view v-if="info.approval">{{info.approval.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.approval && info.approval.count">{{info.approval.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- #ifndef H5 -->
		<view class="news_item" @click="toLookList('card')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/buka_approval.png'"></image>
			</view>
			<view class="item_con">
				<view>补卡审批</view>
				<view v-if="info.card">{{info.card.msg}}</view>
			</view>	
			<view class="item_messnum">
				<view class="message_num" v-if="info.card && info.card.count">{{info.card.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList('leave')">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/qingjia_approval.png'"></image>
			</view>
			<view class="item_con">
				<view>请假审批</view>
				<view v-if="info.leave">{{info.leave.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.leave && info.leave.count">{{info.leave.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netPendApprovel } from '@/api/api.js'
	
	export default {
		components:{
		},
		data() {
			return {
				info:{},
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				netPendApprovel().then(res=>{
					this.info = res.data
				})
			},
			//待处理 任务
			toLookList(type) {
				uni.navigateTo({
					url:'/pagesB/news/approvelManage/list?type='+type
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.news {
		.news_item {
			background-color: #fff;
			display: flex;
			border: 1rpx solid #EAEAEA;
			padding:20rpx;
			align-items: center;
			.item_img {
				width: 100rpx;
				image {
					width: 80rpx;
					height: 80rpx;
				}
			}

			.item_con {
				flex: 1;

				:first-child {
					padding: 15rpx 0;
					font-size: 28rpx;
				}

				:last-child {
					padding-bottom: 20rpx;
					color: #999;
					font-size: 24rpx;
				}
			}

			.item_messnum {
				display: flex;
				.message_num {
					height: 40rpx;
					line-height: 40rpx;
					padding: 0 18rpx;
					border-radius: 20rpx;
					background-color: #f95e5a;
					color: #fff;
				}

				.icon-arrows_right {
					margin-top: -1rpx;
					font-size: 38rpx;
				}

			}
		}
	}
</style>
