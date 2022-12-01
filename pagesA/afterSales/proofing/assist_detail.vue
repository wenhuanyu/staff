<template>
	<view>
		<view class="detail_warp">
			<view class="warpli">协助人：
				<image :src="info.staff.img" class="staffimg" ></image> {{info?info.staff.name:''}}
			</view>
			<view class="warpli">
				任务标题： {{info?info.title:''}}
			</view>
			<view class="warpli_text">
				任务内容：
				<view class="textbox">{{info?info.remark:''}}</view>
			</view>
			<view class="warpli" @click="toWorkDetail">
				关联工单：
				<view class="key" v-if="relationtype == 'proofing'">{{workInfo?workInfo.event_info.title:''}}</view>
				<view class="key" v-else>{{workInfo?workInfo.title:''}}</view>
			</view>
		</view>
		<view class="tablist_new">
			<view class="tabtn" @click="changeVantab(0)" :class="{'tabtn_active':active == 0}">操作记录</view>
			<view class="tabtn" @click="changeVantab(1)" :class="{'tabtn_active':active == 1}">评论列表</view>
		</view>
		<!-- 操作记录 -->
		<scroll-view scroll-y class="scrollbox" v-if="active == 0">
			<view class="fllow_area" v-if="operationList.length != 0">
				<view class="fll_list">
					<view class="fll_li" v-for="(item,index) in operationList" :key="index">
		 			<view class="fll_top">
							<view class="top_left">
								<image :src="item.staff.img" class="staffimg" ></image>
								<view class="fll_name">{{item.staff.name}}</view>
							</view>
							<view class="fll_status">{{item.relation_process}}</view>
						</view>
						<view class="fll_img">
							<view class="img_title">附件：</view>
							<view class="img_list">
								<image :src="imgitem" @click="toPriveImg(item.file_ids,imgindex)"
									v-for="(imgitem,imgindex) in item.file_ids" :key="imgindex" class="selfimg"
									></image>
							</view>
						</view>
						<view class="fll_con">
							<span>备注</span>:{{item.content}}
						</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="operationList.length == 0">暂无更多</view>
		</scroll-view>
		<!-- 评论列表 -->
		<view v-if="active == 1">
			<view class="evalbox">
				<view class="toeval" @click="toCommon">
					<image :src="BASE_IMG_URL+'/customer/add_record.png'" class="addimg" ></image>评论
				</view>
			</view>
			<scroll-view scroll-y style="width:750rpx;height:calc(100vh - 150rpx)">
				<view class="commlist">
					<view class="commli" v-for="(item,index) in commentList" :key="index">
						<view class="com_content">评论时间：{{item.createtime}}</view>
						<view class="com_content">评论人：{{item.staff.name}}</view>
						<view class="com_content">评论内容：{{item.content}}</view>
					</view>
					<view class="noData" v-if="commentList.length == 0">暂无更多</view>
				</view>
			</scroll-view>
		</view>
		<view class="bot_warp">
			<view class="botbtn" @click="toComplate(1)" v-if="info.status == 0">开始任务</view>
			<view class="botbtn" @click="toComplate(2)" style="margin-right:24rpx" v-if="info.status == 1">完成任务</view>
			<view class="botbtn" @click="toComplate(3)" v-if="info.status == 1">任务失败</view>
		</view>
		
		<common-pop 
			@commonSuccess="commonSuccess" 
			ref="commentChild"
		></common-pop>
	</view>
</template>

<script>
	import {
		netAssitsDetail,
		netEditAssitsStatus,
		netPlanDynamicList,
		netProofingDetail,
		netWorkOrderDetail,
		netCommentList
	} from '@/api/api.js'
	import {
		BASE_IMG_URL,
		BASE_URL,
		SIGN_NO
	} from '@/api/http.js'
	import commonPop from './common_pop.vue'

	export default {
		components:{
			commonPop
		},
		data() {
			return {
				noClick: true, //防止  重复点击
				BASE_IMG_URL: BASE_IMG_URL,
				active: '',
				info: null, //status  0未开时   1进行中   2已结束   3已取消
				id: '',
				operationList: [],
				isShowImg: false,
				workorderid: '', //工单id
				workInfo: null,
				relationtype: '', //工单类型
				workorderTitle: '', //工单标题
				//讨论
				commentList:[]
			}
		},
		onLoad(options) {
			this.id = options.id
			// this.workorderid = options.workid
			
			if (options.relationid) {
				this.relationid = options.relationid
			}
			// this.relationtype = options.relationtype
		},
		onShow() {
			if (!this.isShowImg) {
				this.getDetail()
				//任务进度
				this.getProcess()
				//获取 关联工单
				this.getRelation()
			}
		},
		methods: {
			//关联工单
			getRelation() {
				if (this.relationtype == 'proofing') {
					this.getProDet()
				} else if (this.relationtype == 'workorder') {
					this.getWorkDet()
				}
			},
			//打样详情
			getProDet() {
				netProofingDetail({
					id: this.workorderid,
					event_id: this.relationid
				}).then(res => {
					this.workInfo = res.data
				})
			},
			//工单详情
			getWorkDet() {
				netWorkOrderDetail({
					id: this.workorderid
				}).then(res => {
					this.workInfo = res.data
				})
			},
			//查看附件
			toPriveImg(arr, index) {
				this.isShowImg = true
				uni.previewImage({
					current: index,
					urls: arr
				})
			},
			getDetail() {
				netAssitsDetail({
					id: this.id
				}).then(res => {
					this.info = res.data
					
					this.workorderid = res.data.relation_id
					this.relationtype = res.data.relation_type
					//关联工单
					this.getRelation()
				})
			},
			getProcess() {
				netPlanDynamicList({
					event_id: this.id
				}).then(res => {
					this.operationList = res.data.data
				})
			},
			toComplate(status) {
				uni.navigateTo({
					url:'/pagesA/afterSales/proofing/assist_result?id='+this.id+'&status='+status
				})
			},
			//工单详情
			toWorkDetail() {
				if (this.relationtype == 'workorder') {
					uni.navigateTo({
						url: '/pagesA/customerInfo/visit/depotrepart/detail?id=' + this.workorderid
					})
				}
			},
			changeVantab(e) {
				console.log(e)
				this.active = e
				if(this.active == 0){
					//操作列表
					this.getProcess()
				}else{
					//评论列表
					this.getCommonList()
				}
			},
			getCommonList() {
				let params = {
					record_id:this.id,
					relation_type:'assist_event'
				}
				netCommentList(params).then(res=>{
					this.commentList = res.data
				})
			},
			//评论成功
			commonSuccess() {
				this.getCommonList()
			},
			//去评论
			toCommon() {
				let obj = {
					id:this.id,
					type:'assist_event',
					commenid:''
				}
				this.$refs.commentChild.init(obj)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.commlist{
		margin-top:24rpx;
		.commli{
			width:690rpx;
			padding:30rpx;
			margin:0 auto 24rpx;
			box-shadow: 1rpx 3rpx 8rpx 2rpx #c6c4c4;
			border-radius: 10rpx;
			position: relative;
			.huifu{
				width:55rpx;
				font-size:26rpx;
				color:#007AFF;
				position: absolute;
				right:24rpx;
				top:24rpx;
			}
			.com_content{
				font-size:24rpx;
				margin-bottom:15rpx;
				&:last-child{
					margin-bottom:0;
				}
			}
		}
	}
	.evalbox{
		padding:24rpx 35rpx;
		border-top:1rpx solid #EDEDED;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size:26rpx;
		color:#0287FF;
		box-shadow: 1rpx 3rpx 8rpx 2rpx #c6c4c4;
		.toeval{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.addimg{
				width:38rpx;
				height:37rpx;
				margin-right:15rpx;
			}
		}
	}
	.scrollbox {
		width: 750rpx;
		height: calc(100vh - 100rpx);
	}

	.detail_warp {
		border-bottom:10rpx solid #EDEDED;
		.warpli {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding: 15rpx 35rpx;
			font-size: 26rpx;
			color: #333;

			.staffimg {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				margin-right: 15rpx;
			}
		}

		.warpli_text {
			padding: 15rpx 35rpx;
			font-size: 26rpx;
			color: #333;

			.textbox {
				padding: 24rpx;
				font-size: 24rpx;
			}
		}
	}

	.operationli {
		border-bottom: 1rpx solid #EDEDED;
	}
	.bot_warp{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:100rpx;
		background:#fff;
		border-top:1rpx solid #EDEDED;
		display: flex;
		justify-content: center;
		align-items: center;
		background:#fff;
		z-index:9;
		.botbtn{
			width:180rpx;
			height:80rpx;
			border-radius: 10rpx;
			background:#007AFF;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
		}
	}

	.fll_list {
		.fll_li {
			width: 640rpx;
			box-sizing: border-box;
			padding: 24rpx;
			margin: 0 auto 24rpx;
			border-radius: 20rpx;
			padding-bottom: 24rpx;
			border-bottom: 1rpx solid #EDEDED;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0, 0, 0, 0.1);

			.fll_top {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.top_left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;

					.staffimg {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}

					.fll_name {
						font-size: 26rpx;
					}
				}

				.fll_status {
					font-size: 26rpx;
					color: #FF6034;
					margin-bottom: 15rpx;
				}
			}

			.fll_img {
				margin-top: 10rpx;

				.img_title {
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 15rpx;
				}

				.img_list {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;

					.selfimg {
						width: 160rpx;
						height: 160rpx;
						margin-right: 15rpx;
					}
				}
			}

			.fll_con {
				font-size: 24rpx;
				color: #333;
				margin-top: 15rpx;
				line-height: 32rpx;

				span {
					font-size: 26rpx;
					color: #000;
				}
			}
		}
	}
</style>
