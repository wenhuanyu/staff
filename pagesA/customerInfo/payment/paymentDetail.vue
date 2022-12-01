<template>
	<view class="group_company">
		<view class="contractinfo" v-if="info.is_examine == 1">
			<view class="title" style="padding-left:30rpx;">操作</view>
			<view class="button_warp">
				<view class="btn jujue" @click="toRefuse">审核拒绝</view>
				<view class="btn tongyi" @click="toPass">审核通过</view>
			</view>
		</view>
		<view class="contractinfo">
			<view class="title" style="padding-left:30rpx;">回款信息</view>
			<view class="contractBox">
				<form-item v-if="listForm" :listForm="listForm" :isEdit="false"></form-item>
			</view>
		</view>
		<view class="tabinfo" @click="toKehuInfo">
			<view class="tableft">
				<view class="title">关联客户：</view>
				<view class="name">{{info.customer && info.customer.name}}</view>
			</view>
		</view>
		<!-- 标签栏 -->
		<view class="group_tab"> 
			<view class="info_detail">
				<view class="info_item">
					<view class="title">回款详情</view>
					<view class="basic_main" @click="toContractDetail">
						<view>合同编号：</view>
						<view>{{info.contract && info.contract.num}}</view>
					</view>
					<view class="basic_main">
						<view>回款编号：</view>
						<view>{{info.number}}</view>
					</view>
					<view class="basic_main">
						<view>审核状态：</view>
						<view v-if="info.check_status == 0">待审核</view>
						<view v-if="info.check_status == 1">审核中</view>
						<view v-if="info.check_status == 2">审核通过</view>
						<view v-if="info.check_status == 3">审核未通过</view>
						<view v-if="info.check_status == 4">审核已撤回</view>
					</view>
					<view class="basic_main">
						<view>客户名称：</view>
						<view>{{info.customer && info.customer.name}}</view>
					</view>
					<view class="basic_main">
						<view>创建人：</view>
						<view>{{info.create_staff && info.create_staff.name}}</view>
					</view>
					<view class="basic_main">
						<view>创建时间：</view>
						<view>{{info.createtime}}</view>
					</view>
					<view class="basic_main">
						<view>更新时间：</view>
						<view>{{info.updatetime}}</view>
					</view>
				</view>
			</view>
			<!-- 审批流程 -->
			<view class="approveFlow">
				<view class="title" style="margin-bottom:24rpx;">审批流程</view>
				<approval-status :process="payment_approval"></approval-status>
			</view>
			
		</view>
		
		
		<view class="" style="height:100rpx"></view>
		
		<view class="newbot"  @click="toMoreOperation" v-if="info.is_operation == 1">
			<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="moreimg" ></image>
			更多
		</view>
		<more-operation
			ref="operationChild"
			:info="info"
			@toAddapproverP="toAddapprover"
			@editPaymentP="editPayment"
			@cancelExamineP="cancelExamine"
		></more-operation>
		
	</view>
</template>

<script>
	import { netPaymentDetail, netSetForm, netApprovalDetail, netPaymentCancel } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import moreOperation from './more-operation.vue'
	
	
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				id:'',   //回款 id
				info:{},
				payment_approval:{},   //审批流程
				listForm:null,
			}
		},
		components:{
			formItem,
			moreOperation
		},
		onLoad(options) {
			this.id = options.paymentid
		},
		onShow() {
			this.listForm = null
			this.getInfo()
			//获取  审批 流程
			this.getApprovalList()
		},
		onHide() {
			
		},
		methods: {
			getApprovalList() {
				let params = {
					type: 'receivables',
					relation_id: this.id
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//更多操作
			toMoreOperation() {
				this.$refs.operationChild.open()
			},
			//添加审批人
			toAddapprover() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/approver?id='+this.id+'&type=receivables'
				})
			},
			getForm() {
				netSetForm({type:'examine'}).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
				})
			},
			getInfo() {
				netPaymentDetail({id:this.id}).then(res=>{
					this.info = res.data
					this.getForm()
				})
			},
			//通过
			toPass() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.id+'&type=receivables&status=1'
				})
			},
			//拒绝
			toRefuse() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.id+'&type=receivables&status=2'
				})
			},
			//撤回 审批
			cancelExamine() {
				uni.showModal({
					title:'提示',
					content:'请确认是否撤回审核?',
					success:(res)=>{
						if(res.confirm){
							netPaymentCancel({id:this.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									this.getInfo()
								},2000)
							})
						}
					}
				})
			},
			//编辑 回款
			editPayment() {
				console.log('编辑')
				uni.navigateTo({
					url:'/pagesA/customerInfo/payment/editPayment?paymentid='+this.id
				})
			},
			//客户详情
			toKehuInfo() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.info.customer.id
				})
			},
			//合同  详情
			toContractDetail() {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractDetail?id='+this.info.contract.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.title{
		margin-left: 32rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
		&::before{
			content:'';
			position:absolute;
			left:30rpx;
			// top:26rpx;
			width:10rpx;
			height:25rpx;
			border-radius: 5rpx;
			background: $uni-btn-bg-color;
		}
	}
	
	.bot_warp{
		width:750rpx;
		height:100rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		left:0;
		bottom:0;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		padding:0 24rpx;
		background:#fff;
		z-index: 99;
		.bot_btn{
			width:210rpx;
			height:70rpx;
			border-radius: 40rpx;
			background:#007AFF;
			font-size:26rpx;
			text-align: center;
			line-height: 70rpx;
			color:#fff;
		}
	}
	.contractinfo{
		background:#fff;
		padding:20rpx 0rpx;
		margin-bottom: 20rpx;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		.contractBox{
			.constatus{
				font-size:26rpx;
				padding:2rpx 15rpx;
				color:#0287FF;
				.statusImg{
					width: 111rpx;
					height: 87rpx;
				}
			}
			.nameli{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom:24rpx;
				.zhangimg{
					width:40rpx;
					height:40rpx;
					margin-right:15rpx;
				}
				.name{
					font-size:32rpx;
					color:#333333;
				}
			}
		}
		.li_text{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.protext{
				font-size:24rpx;
				color:#666666;
				margin-right:24rpx;
			}
			.pro_out{
				width:150rpx;
				height:15rpx;
				border-radius: 8rpx;
				background:#DDDDDD;
				.pro_in{
					width:20%;
					height:15rpx;
					border-radius: 8rpx;
					background:$uni-btn-bg-color;
				}
			}
			.money{
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
	}
	.tabinfo{
		padding:24rpx 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#fff;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		.tableft{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.headerimg{
				width:45rpx;
				height:45rpx;
				border-radius: 50%;
			}
			.name{
				font-size:26rpx;
				color:$uni-text-color;
				margin-left:24rpx;
			}
		}
		.rightimg{
			width:32rpx;
			height:32rpx;
		}
	}
	.btnlist{
		padding:20rpx 24rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top:1rpx solid #DDDDDD;
		background:#fff;
		.btn{
			width:300rpx;
			height:60rpx;
			border-radius: 8rpx;
			font-size:24rpx;
			color:#fff;
			text-align: center;
			line-height: 60rpx;
		}
		.pass{
			background:#007AFF;
		}
		.refuse{
			background:#F43F3B;
		}
	}
	.group_tab {
		margin: 0 0 120rpx;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
	}
	.info_detail {
		margin-bottom: 20rpx;
		padding: 25rpx 30rpx;
		background: #fff;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		.basic_head {
			display: flex;
			padding: 30rpx 24rpx 30rpx;
			:last-child {
				font-weight: 700;
				margin-left: 8rpx;
			}
		}
		.basic_main {
			display: flex;
			padding:24rpx 45rpx 0 50rpx;
			font-size:26rpx;
			color: #999;
		}
	}
	.approveFlow{
		padding: 25rpx 30rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
	}
</style>
