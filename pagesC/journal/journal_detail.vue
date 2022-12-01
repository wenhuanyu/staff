<template>
	<view>
		<view class="item">
			<view class="item_top" v-if="info.staff">
				<image :src="info.staff.img" class="staffimg" ></image>
				<view class="top_right">
					<view class="top_name">
						<view class="post">{{info.staff.name}}</view>
					</view>
				</view>
				<view class="type">{{info.type}}报</view>
			</view>
			<view class="item_bot">
				<view class="item_content">
					<view class="bot_title">昨日工作内容：</view>
					<view class="bot_list" @click.stop.prevent>
						<view class="bot_li" v-if="info.follow_up" @click="toFollow(info)">跟进记录: <span>{{info.follow_up.count}}</span></view>
						<view class="bot_li" v-if="info.contract" @click="toContact(info)">合同: <span>{{info.contract.count}}</span></view>
						<view class="bot_li" v-if="info.quote" @click="toQuote(info)">报价单: <span>{{info.quote.count}}</span></view>
						<view class="bot_li" v-if="info.receivables" @click="toReceivables(info)">回款: <span>{{info.receivables.count}}</span></view>
						<view class="bot_li" v-if="info.visit" @click="toVisit(info)">拜访: <span>{{info.visit.count}}</span></view>
						<view class="bot_li" v-if="info.customer" @click="toCustomer(info)">获客: <span>{{info.customer.count}}</span></view>
						<view class="bot_li" v-if="info.workorder" @click="toWorkorder(info,1)">新建工单: <span>{{info.workorder.count}}</span></view>
						<view class="bot_li" v-if="info.complete_workorder" @click="toWorkorder(info,2)">完成工单: <span>{{info.complete_workorder.count}}</span></view>
						<view class="bot_li" v-if="info.good_workorder" @click="toWorkorder(info,3)">好评工单: <span>{{info.good_workorder.count}}</span></view>
						<view class="bot_li" v-if="info.not_event" @click="toEvent(info,1)">未完成任务: <span>{{info.not_event.count}}</span></view>
						<view class="bot_li" v-if="info.complete_event" @click="toEvent(info,2)">完成任务: <span>{{info.complete_event.count}}</span></view>
					</view>
					<!-- <view class="bot_title">今日工作内容：</view>
					<view class="bot_text">{{info.tomorrow_report}}</view> -->
				</view>
				<view class="date">
					<image :src="BASE_IMG_URL + '/index/clock.png'" class="clock_img" ></image>
					<view class="top_time">{{info.createtime}}</view>
				</view>
			</view>
		</view>
		<view class="comm_box">
			<view class="comm_title">
				全部评论（{{commList.length}}）
			</view>
			<view class="bomm_con">
				<view class="bomm_con_li" v-for="(item,index) in commList" :key="index">
					<image :src="item.staff.img" class="staffimg" ></image>
					<view class="con_li_right">
						<view class="ri_top">
							<view class="name">{{item.staff.name}}：</view>
							<view class="ri_bot">{{item.content}}</view>
						</view>
						<view class="time">{{item.createtime}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view style="height:100rpx"></view>
		<view class="bottombox">
			<input type="text" v-model="content" placeholder="请在此输入评论...." class="botinput">
			<view class="bottom_right" @click="toSend">
				<image :src="BASE_IMG_URL+'/index/fasong.png'" class="sendimg" ></image>
				发表
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netJournalDetail, netCommentList, netPublishComment } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				info:{},
				id:'',
				commList:[],
				content:''
			}
		},
		onLoad(options) {
			this.id = options.id
			//详情
			this.getDetail()
			//评论列表
			this.getCommList()
		},
		methods:{
			getDetail() {
				netJournalDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			getCommList() {
				let params = {
					relation_type: 'workreport',
					record_id: this.id
				}
				netCommentList(params).then(res=>{
					this.commList = res.data
				})
			},
			toSend() {
				let params = {
					content: this.content,
					record_id: this.id,
					relation_type: 'workreport'
				}
				netPublishComment(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					this.content = ''
					setTimeout(()=>{
						this.getCommList()
					},2000)
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
	.bot_list{
		.bot_li{
			margin-bottom:15rpx;
			span{
				color:$uni-text-color;
				margin-left:15rpx;
			}
		}
	}
	.item{
		width: 750rpx;
		.item_top{
			padding: 22rpx 30rpx;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			background-color: #fff;
			border-bottom:1rpx solid #f5f5f5;
			box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
			.staffimg{
				width:54rpx;
				height:54rpx;
				border-radius: 50%;
				margin-right:24rpx;
				flex-shrink: 0;
			}
			.top_right{
				display: flex;
				align-items: center;
				.top_name{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.post{
						font-size:26rpx;
						color:#666;
						margin-right:15rpx;
					}
				}
				.top_time{
					font-size:26rpx;
					color:#999999;
					margin:15rpx 0;
				}
				.top_staff{
					font-size:26rpx;
					color:#999999;
				}
			}
			.type{
				margin-left: auto;
				padding:5rpx 20rpx;
				font-size:26rpx;
				color:$uni-text-color;
				text-align: right;
				border-radius: 5rpx;
			}
		}
		.item_bot{
			margin-bottom: 20rpx;
			padding: 10rpx 60rpx 30rpx 60rpx;
			background-color: #fff;
			box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
			.item_content{
				.bot_title{
					margin-top: 20rpx;
					font-size:28rpx;
					color:#333333;
					margin-bottom:15rpx;
				}
				.bot_text{
					font-size:24rpx;
					color:#999999;
					padding-left:15rpx;
					margin-bottom:15rpx;
				}
			}
			.date{
				display: flex;
				justify-content: flex-start;
				.clock_img{
					width: 30rpx;
					height: 30rpx;
					margin-right:15rpx;
				}
			}
		}
		.bot_comm{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.commimg{
				width:38rpx;
				height:38rpx;
			}
		}
	}
	.comm_box{
		margin-bottom: 20rpx;
		background-color: #fff;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		.comm_title{
			padding:24rpx 30rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size:26rpx;
			color:#666;
			border-bottom:1rpx solid #f5f5f5;
			.commentimg{
				width:44rpx;
				height:44rpx;
				margin-right:24rpx;
			}
		}
		.bomm_con{
			padding:30rpx;
			.bomm_con_li{
				display: flex;
				justify-content: flex-start;
				margin-bottom:24rpx;
				.staffimg{
					width:55rpx;
					height:55rpx;
					border-radius: 50%;
					margin-right:24rpx;
				}
				.con_li_right{
					padding: 10rpx 0 24rpx 0;
					flex:1;
					border-bottom:1rpx solid #f5f5f5;
					.ri_top{
						display: flex;
						align-items: flex-start;
						margin-bottom:15rpx;
						.name{
							white-space: nowrap;
							font-size:28rpx;
							color:#333333;
							margin-right:15rpx;
						}
					}
					.time{
						text-align: right;
						font-size:26rpx;
						color:#999999;
					}
					.ri_bot{
						font-size:28rpx;
						color:#666666;
					}
				}
			}
		}
	}
	.bottombox{
		width:750rpx;
		height:100rpx;
		position: fixed;
		left:0;
		bottom:0;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		padding:0 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		.botinput{
			width:430rpx;
			height:66rpx;
			border-radius: 30rpx;
			background-color: #f6f6f6;
			border:1rpx solid #f6f6f6;
			padding:0 15rpx;
			box-sizing: border-box;
			font-size:28rpx;
			color:#666;
			line-height: 66rpx;
		}
		.bottom_right{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			.sendimg{
				width:40rpx;
				height:40rpx;
				margin-right:15rpx;
			}
		}
	}
</style>
