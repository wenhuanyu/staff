<template>
	<view class="news">
		<view class="news_item" @click="remind">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/tixing1.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>提醒通知</view>
				<view>{{info.leads && info.leads.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.leads && info.leads.count != 0">{{info && info.leads.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="affiche">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/gonggao1.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>系统公告</view>
				<view>{{info.notice && info.notice.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.notice && info.notice.count != 0">{{info && info.notice.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="workTrend">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/gongzuo1.png'" mode="scaleToFill"></image>
			</view>
			<view class="item_con">
				<view>工作动态</view>
				<view>随时随地了解团队工作动态</view>
			</view>
			<view class="item_messnum">
				<view class="iconfont icon-you" style="margin-left: 48rpx;"></view>
			</view>
		</view>
		<view class="news_item" @click="schedule">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/daiban.png'"></image>
			</view>
			<view class="item_con">
				<view>待办事项</view>
				<view>{{info.agent && info.agent.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.agent && info.agent.count != 0">{{info.agent.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toLookList">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/chaoshi.png'"></image>
			</view>
			<view class="item_con">
				<view>超时任务</view>
				<view>{{info.task && info.task.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.task && info.task.count != 0">{{info.task.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="news_item" @click="toApproveManage">
			<view class="item_img">
				<image :src="BASE_IMG_URL+'/shenpi333.png'"></image>
			</view>
			<view class="item_con">
				<view>审批管理</view>
				<view>{{info.examine && info.examine.msg}}</view>
			</view>
			<view class="item_messnum">
				<view class="message_num" v-if="info.examine && info.examine.count != 0">{{info.examine.count}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		
		<tab-bar v-if="tipNumber || tipNumber==0" :tipNumber="tipNumber"></tab-bar>
	</view>
</template>

<script>
	import { netMesList } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import tabBar from '@/components/tabbar/tabbar'
	
	export default {
		components:{
			tabBar
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				info:{},
				tipNumber:null,
			}
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				netMesList().then(res=>{
					this.info = res.data
					this.tipNumber = res.data.total
				})
			},
			//提醒通知
			remind(){
				uni.navigateTo({
					url: '/pagesB/news/theReminder',
				})
			},
			//公告
			affiche(){
				uni.navigateTo({
					url: '/pagesB/news/notice',
				})
			},
			//工作动态
			workTrend(){
				uni.navigateTo({
					url: '/pagesB/news/workNews',
				})
			},
			//待办事项
			schedule(){
				uni.navigateTo({
					url: '/pagesB/news/needDeal',
				})
			},
			//超时任务
			toLookList() {
				uni.navigateTo({
					url:'/pages/news/timeoutTask'
				})
			},
			//审批管理
			toApproveManage() {
				uni.navigateTo({
					url:'/pagesB/news/approvelManage/index'
				})
			},
			///////////////////////////////////////////////////////
			toToduPage() {
				uni.navigateTo({
					url:'/pages/news/toduList'
				})
			},
			timeOutTask() {
				uni.navigateTo({
					url:'/pages/news/timeoutTask'
				})
			},
			toWorkDyna() {
				uni.navigateTo({
					url:'/pages/news/work_dynamics'
				})
			},
			toJourner() {
				uni.navigateTo({
					url:'/pages/news/journer'
				})
			}
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
			}
		}
	}
</style>
