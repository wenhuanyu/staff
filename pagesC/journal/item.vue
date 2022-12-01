<template>
	<view>
		<view class="item" v-for="(item,index) in list" :key="index" @click.stop="toDetail(item)">
			<view class="item_top">
				<image :src="item.staff.img" class="staffimg"></image>
				<view class="top_right">
					<view class="top_name">
						<view class="post">{{item.staff.name}}</view>
						<view class="type">{{item.type}}报</view>
					</view>
				</view>
			</view>
			<view class="item_bot">
				<view class="bot_title">昨日工作内容：</view>
				<view class="bot_list" >
					<view class="bot_li" v-if="item.follow_up" >跟进记录: <span @click.stop="toFollow(item)">{{item.follow_up.count}}</span></view>
					<view class="bot_li" v-if="item.contract" >合同: <span @click.stop="toContact(item)">{{item.contract.count}}</span></view>
					<view class="bot_li" v-if="item.quote" >报价单: <span @click.stop="toQuote(item)">{{item.quote.count}}</span></view>
					<view class="bot_li" v-if="item.receivables">回款: <span  @click.stop="toReceivables(item)">{{item.receivables.count}}</span></view>
					<view class="bot_li" v-if="item.visit" >拜访: <span @click.stop="toVisit(item)">{{item.visit.count}}</span></view>
					<view class="bot_li" v-if="item.customer" >获客: <span @click.stop="toCustomer(item)">{{item.customer.count}}</span></view>
					<view class="bot_li" v-if="item.workorder" >新建工单: <span @click.stop="toWorkorder(item,1)">{{item.workorder.count}}</span></view>
					<view class="bot_li" v-if="item.complete_workorder" >完成工单: <span @click.stop="toWorkorder(item,2)">{{item.complete_workorder.count}}</span></view>
					<view class="bot_li" v-if="item.good_workorder" >好评工单: <span @click.stop="toWorkorder(item,3)">{{item.good_workorder.count}}</span></view>
					<view class="bot_li" v-if="item.not_event" >未完成任务: <span @click.stop="toEvent(item,1)">{{item.not_event.count}}</span></view>
					<view class="bot_li" v-if="item.complete_event" >完成任务: <span @click.stop="toEvent(item,2)">{{item.complete_event.count}}</span></view>
				</view>
				<view class="bot_title">今日工作内容：</view>
				<view class="bot_text">{{item.tomorrow_report}}</view>
			</view>
			<view class="bot_comm">
				<image :src="BASE_IMG_URL + '/index/clock.png'" ></image>
				<view class="top_time">{{item.createtime}}</view>
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
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesC/journal/journal_detail?id='+item.id
				})
			},
			//合同
			toContact(item) {
				uni.navigateTo({
					url:'/pagesB/collection/queryList/contract?time='+item.report_date+'&idlist='+item.contract.id_list
				})
			},
			//报价单
			toQuote(item) {
				uni.navigateTo({
					url:'/pagesB/collection/queryList/quote?time='+item.report_date+'&idlist='+item.quote.id_list
				})
			},
			//回款
			toReceivables(item) {
				uni.navigateTo({
					url:'/pagesB/collection/queryList/receivables?time='+item.report_date+'&idlist='+item.receivables.id_list
				})
			},
			//拜访
			toVisit(item) {
				uni.navigateTo({
					url:'/pagesB/collection/queryList/visit?time='+item.report_date+'&idlist='+item.visit.id_list
				})
			},
			//客户
			toCustomer(item) {
				uni.navigateTo({
					url:'/pagesB/collection/queryList/customer?time='+item.report_date+'&idlist='+item.customer.id_list
				})
			},
			//工单
			toWorkorder(item,type) {
				//type 1新建     2完成    3好评工单
				if(type == 1) {
					//新建工单
					uni.navigateTo({
						url:'/pagesB/collection/queryList/workorder?time='+item.report_date+'&idlist='+item.workorder.id_list+'&type='+type
					})
				}else if(type == 2) {
					//完成 工单
					uni.navigateTo({
						url:'/pagesB/collection/queryList/workorder?time='+item.report_date+'&idlist='+item.complete_workorder.id_list+'&type='+type
					})
				}else{
					// 好评 工单
					uni.navigateTo({
						url:'/pagesB/collection/queryList/workorder?time='+item.report_date+'&idlist='+item.good_workorder.id_list+'&type='+type
					})
				}
			},
			//任务
			toEvent(item,type) {
				//type 1未完成    2完成
				if(type == 1) {
					//未完成
					uni.navigateTo({
						url:'/pagesB/collection/queryList/event?time='+item.report_date+'&idlist='+item.not_event.id_list+'&type='+type
					})
				}else{
					//完成
					uni.navigateTo({
						url:'/pagesB/collection/queryList/event?time='+item.report_date+'&idlist='+item.complete_event.id_list+'&type='+type
					})
				}
			},
			//跟进
			toFollow(item) {
				uni.navigateTo({
					url:'/pagesB/collection/queryList/followup?time='+item.report_date+'&idlist='+item.follow_up.id_list
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item{
		width:690rpx;
		margin:24rpx auto 0;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		padding:15rpx 60rpx;
		border-radius: 10rpx;
		.item_top{
			padding-bottom: 15rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom:1rpx solid #f5f5f5;
			.staffimg{
				width:70rpx;
				height:70rpx;
				border-radius: 50%;
				margin-right:24rpx;
				flex-shrink: 0;
			}
			.top_right{
				flex:1;
				.top_name{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.post{
						font-size:26rpx;
						color:#666;
						margin-right:15rpx;
					}
					.type{
						margin-left: auto;
						font-size:26rpx;
						color:$uni-text-color;
						padding:5rpx 20rpx;
						border-radius: 5rpx;
					}
				}
				.top_staff{
					font-size:26rpx;
					color:#999999;
				}
			}
		}
		.item_bot{
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			.bot_title{
				font-size:26rpx;
				color:#999;
				margin-bottom:15rpx;
			}
			.bot_list{
				.bot_li{
					margin-bottom:15rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					span{
						display: block;
						width:100rpx;
						color:$uni-text-color;
						margin-left:15rpx;
					}
				}
			}
			.bot_text{
				font-size:26rpx;
				color:#999999;
				padding-left:15rpx;
				margin-bottom:15rpx;
			}
		}
		.bot_comm{
			padding: 15rpx 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.commimg{
				width:38rpx;
				height:38rpx;
			}
			image{
				margin-right: 15rpx;
				width: 30rpx;
				height: 30rpx;
			}
			.top_time{
				font-size:26rpx;
				color:#999999;
			}
		}
	}
</style>
