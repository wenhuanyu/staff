<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">关联类型<span>*</span></view>
			<view class="form_right color_bg" v-if="relation_type == 'order'" @click="toOrder">查看关联订单</view>
			<view class="form_right color_bg" v-if="relation_type == 'quote'" @click="toQuote">查看关联报价单</view>
			<view class="form_right color_bg" v-if="relation_type == 'workorder'" @click="toWorkDetail">查看关联工单</view>
			<view class="form_right color_bg" v-if="relation_type == 'event'" @click="toEvent">查看关联任务</view>
			<view class="form_right color_bg" v-if="relation_type == 'contract'" @click="toContract">查看关联合同</view>
			<view class="form_right color_bg" v-if="relation_type == 'proofing'" @click="toProof">查看关联打样</view>
			<view class="form_right color_bg" v-if="relation_type == 'customer'" @click="toCustomerDetail">查看关联客户</view>
			<view class="form_right color_bg" v-if="relation_type == 'consume'" @click="toConsume">查看关联费用</view>
			<view class="form_right color_bg" v-if="relation_type == 'approval'" @click="toApproval">查看关联审批</view>
			<view class="form_right color_bg" v-if="relation_type == 'parts_stock_reload'" @click="toKucunApprove">查看关联库存审批</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">发起人<span>*</span></view>
			<view class="form_right">
				{{info.staff && info.staff.name}}
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">讨论主题<span>*</span></view>
			<view class="form_right">
				{{info.title}}
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head key">讨论内容:<span>*</span></view>
			</view>
			<view class="textcontent">
				{{info.content}}
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">附件</view>
		</view>
		<view class="imglist">
			<view class="imgbox" v-for="(item,index) in info.file_ids" :key="index">
				<image :src="item.url" class="selfimg" @click="toPriveImg(info.file_ids,index)" ></image>
			</view>
		</view>
		<view class="commbox">
			<view class="com_warp">
				<view class="tip_list">评论列表（{{commentList.length}})</view>
			</view>
			<scroll-view class="scroll_box" scroll-y>
				<view class="commlist">
					<view class="commli" v-for="(item,index) in commentList" :key="index">
						<view class="huifu" @click="toComment(item)">回复</view>
						<view class="com_content">评论时间：{{item.createtime}}</view>
						<view class="com_content">评论人：{{item.staff.name}}</view>
						<view class="com_content">评论内容：{{item.content}}</view>
					</view>
					<view class="noData" v-if="commentList.length == 0">暂无更多</view>
				</view>
			</scroll-view>
		</view>
		<!-- 评论按钮 -->
		<view class="" style="height:120rpx"></view>
		<view class="de_bottom">
			<view class="de_li" @click="toComment" >
				<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="editimg" ></image>
				<view class="de_text">评论</view>
			</view>
			<view class="de_li" @click="editDiscuss" v-if="info.is_edit == 1">
				<image :src="BASE_IMG_URL+'/index/edit-kehu.png'" class="editimg" ></image>
				<view class="de_text">编辑</view>
			</view>
		</view>
		<common-pop :show="showCommon" @commonSuccess="commonSuccess" @close="close" ref="commentChild"></common-pop>
	</view>
</template>

<script>
	import { netDiscussDetail, netCommentList, netWorkOrderDetail } from '@/api/api.js'
	import commonPop from './common_pop.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		components:{
			commonPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',   //讨论id
				info:{},
				showCommon:false,
				commentList:[],
				relation_type:'',
				relation_id:'',
				isShowImg:false,
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			if(!this.isShowImg) {
				//获取详情
				this.getDetail()
				//获取 评论列表
				this.getCommen()
			}
		},
		methods:{
			getDetail() {
				netDiscussDetail({id:this.id}).then(res=>{
					this.info = res.data
					this.relation_type = res.data.relation_type
					this.relation_id = res.data.relation_id
				})
			},
			getCommen() {
				let params = {
					record_id:this.id,
					relation_type:'discuss'
				}
				netCommentList(params).then(res=>{
					this.commentList = res.data
				})
			},
			//发起评论 回复
			toComment(item={}) {
				let obj = {
					id:this.id,
					type:'discuss',
					commenid:item.id ? item.id : ''
				}
				this.showCommon = true
				this.$refs.commentChild.init(obj)
			},
			//评论成功
			commonSuccess() {
				this.showCommon = false
				this.getCommen()
			},
			close() {
				this.showCommon = false
			},
			toPriveImg(arr,index) {
				this.isShowImg = true
				let data = []
				arr.forEach(ele=>{
					data.push(ele.url)
				})
				uni.previewImage({
					current:index,
					urls:data
				})
			},
			//编辑
			editDiscuss() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/editDiscuss?id='+this.id
				})
			},
			//订单详情
			toOrder() {
				uni.navigateTo({
					url:'/pagesB/order/detail?id='+this.relation_id
				})
			},
			//查看关联报价单
			toQuote() {
				uni.navigateTo({
					url:'/pagesC/quotation/detail?id='+this.relation_id
				})
			},
			//关联工单
			toWorkDetail() {
				this.jumpWorkorderDetail({relation_id:this.relation_id})
				// netWorkOrderDetail({id:this.relation_id}).then(res=>{
				// 	res = res.data
				// 	if(res.workorder_type == '返厂维修'){
				// 		uni.navigateTo({
				// 			url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+this.relation_id
				// 		})
				// 	}else if(res.workorder_type == '品质异常单'){
						
				// 	}else{
				// 		uni.navigateTo({
				// 			url:'/pagesA/afterSales/workorderDetail?workorderid='+this.relation_id
				// 		})
				// 	}
				// })
			},
			//关联 任务
			toEvent() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/visitDetail?id='+this.relation_id
				})
			},
			//关联合同
			toContract() {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractDetail?id='+this.relation_id
				})
			},
			//关联客户
			toCustomerDetail() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.relation_id
				})
			},
			//关联费用
			toConsume() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/detail?id='+this.relation_id
				})
			},
			//关联审批
			toApproval() {
				uni.navigateTo({
					url:'/pagesA/user/work_approval/approvalDetail?id='+this.relation_id
				})
			},
			//关联 库存审批
			toKucunApprove() {
				uni.navigateTo({
					url:'/pagesC/sparepart/myapplyDetail?id='+this.relation_id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.de_bottom{
		width:750rpx;
		height:calc(100rpx + env(safe-area-inset-bottom));
		background:#fff;
		position: fixed;
		left:0;
		bottom:0;
		padding:0 50rpx env(safe-area-inset-bottom);
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		z-index: 9;
		.de_li{
			text-align: center;
			.editimg{
				width:38rpx;
				height:38rpx;
			}
			.de_text{
				font-size:20rpx;
				color:#999;
				text-align: center;
			}
		}
	}
	.commbox{
		width:100%;
		height:100vh;
		.com_warp{
			width:100%;
			padding:24rpx 35rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.tip_list{
				font-size:26rpx;
				color:#666;
			}
			.tip{
				color:$uni-text-color;
				font-weight: bold;
				font-size:30rpx;
			}
		}
		.scroll_box{
			width:100%;
			height:100vh;
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
						color:$uni-text-color;
						position: absolute;
						right:24rpx;
						top:24rpx;
					}
					.com_content{
						font-size:24rpx;
						margin-bottom:15rpx;
						word-break: break-all;
						white-space: pre-wrap;
						&:last-child{
							margin-bottom:0;
						}
					}
				}
			}
		}
	}
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EDEDED;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.imgbox {
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			&:nth-child(4n){
				margin-right:0;
			}
			.selfimg {
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
			}
			.list_text{
				font-size:26rpx;
				color:#007AFF;
			}
		}
		.textcontent{
			width: 640rpx;
			font-size:26rpx;
			margin:24rpx auto;
		}
	}
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
		}
	}
</style>
