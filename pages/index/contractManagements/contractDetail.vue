<template>
	<view class="group_company" style="background-color: #f6f6f6;">
		<view class="contractinfo">
			<view class="constatus">
				<view class="con_status" v-if="info && info.check_status == 0">
					待审核
				</view>
				<view class="con_status" v-if="info && info.check_status == 1">
					审核中
				</view>
				<view class="con_status" v-if="info && info.check_status == 2">
					审核通过
				</view>
				<view class="con_status warnstatus" v-if="info && info.check_status == 3">
					审核未通过
				</view>
				<view class="con_status warnstatus" v-if="info && info.check_status == 4">
					已撤回
				</view>
				<view class="con_status warnstatus" v-if="info && info.check_status == 9">
					终止合同
				</view>
			</view>
			<view class="conbox">
				<view class="title">
					合同详情
				</view>
				<view class="conbox_top">
					<view class="conbox_left">
						<view class="content" style="color: #666;" >
							合同单号：{{info && info.num}}
						</view>
						<view class="content" style="color: #666;" >
							合同金额：￥{{info && info.money}}
						</view>
						<view class="content">
							已回款：￥{{info && info.receivables ? info.receivables.repayment_money : ''}}    
						</view>
						<view class="content" v-if="info.examine">
							待回款：￥{{info && info.examine ? info.examine.money : ''}}
						</view>
						<view class="content" v-else>
							待回款：￥{{info && info.receivables ? info.receivables.be_money : ''}}
						</view>
						<view class="li_text" >
							<view class="protext" style="color: #999;">
								回款进度：({{info && info.receivables ? info.receivables.ratio : ''}}%)
							</view>
							<view class="pro_out" v-if="info.receivables">
								<view class="pro_in" :style="{width:(info && info.receivables.ratio >= 100 ? 100 : info.receivables.ratio) +'%'}"></view>
							</view>
						</view>
						<view class="content">
							签约时间：{{info && info.order_date ? info.order_date : ''}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 团队信息 -->
		<more-pop 
			relation_type="contract" 
			v-if="false" 
			:relation_id="id" 
			:staffList="info.show_staff_data"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
			style="margin-bottom: 20rpx;"
		></more-pop>
		<view class="contractinfo">
			<view class="conbox">
				<view class="title">
					操作
				</view>
				<view class="button" style="margin:24rpx auto;" v-if="info.is_start != 1 && info.check_status == 2"  @click="toShencheng">客户已确认，去发货</view>
				<view class="button_warp" style="margin-top:30rpx;" v-if="info.is_examine == 1">
					<view class="btn jujue" @click="toRefuse">审核拒绝</view>
					<view class="btn tongyi" @click="toPass">审核通过</view>
				</view>
			</view>
		</view>
		<view class="tabinfo" @click="toKehuInfo" >
			<view class="tableft">
				<view class="title" style="margin-left: 40rpx;">
					关联客户：
				</view>
				<view class="name">{{info.customer && info.customer.name}}</view>
			</view>
		</view>
		<view class="tabinfo" @click="toBusinessDetail" v-if="info.business">
			<view class="tableft">
				<view class="title" style="margin-left: 40rpx;">
					关联商机：
				</view>
				<view class="name">{{info.business && info.business.name}}</view>
			</view>
		</view>
		<view class="tabwarp">
			<scroll-view scroll-x="true" style="width:750rpx;">
				<view class="tablist_new_list">
					<view class="tabtn" @click="changeTab(0)" :class="{'tabtn_active':active == 0}">跟进动态</view>
					<view class="tabtn" @click="changeTab(1)" :class="{'tabtn_active':active == 1}">基本信息</view>
					<view class="tabtn" @click="changeTab(2)" :class="{'tabtn_active':active == 2}">相关附件</view>
				</view>
			</scroll-view>
			<!-- 跟进动态 -->
			<scroll-view scroll-y="true" class="scrollbox" v-show="active == 0">
				<follow-info v-if="info.id" :info="info" :type="3"></follow-info>
			</scroll-view>
			<!-- 基本信息 -->
			<scroll-view scroll-y="true" class="scrollbox" v-show="active == 1">
				<base-info :info="info" v-if="info.id" :paymentlist="planList" :plan_list="plan_list" :paymentApproval="payment_approval"></base-info>
			</scroll-view>
			<!-- 相关附件 -->
			<scroll-view scroll-y="true" class="scrollbox" v-show="active == 2">
				<!-- 相关附件 -->
				<view class="fileWarp">
					<view class="title" style="margin-left: 40rpx;">相关附件：</view>
					<view class="doc_item" v-for="(item,index) in fileList" :key="index">
						<image :src="BASE_IMG_URL+'/index/file-clip.png'" class="remarkimg"></image>
						<view class="doc_name" @click="toLookFile(item)">{{item.name}}</view>
						<image :src="BASE_IMG_URL+'/index/delete.png'" @click="delFile(item.id)" class="deleimg"></image>
					</view>
				</view>
			</scroll-view>
		</view>
		<view style="height:150rpx;"></view>
		<!-- 底部导航栏 -->
		<view class="bottom_nav" v-if="info && info.check_status != 9">
			<view class="bottom_item" @click="newFollowClick">
				<image :src="BASE_IMG_URL+'/index/add.png'" class="botimg" mode=""></image>
				<view>写新跟进</view>
			</view>
			<view class="bottom_item" @click="showMoreOpeta">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="botimg" mode=""></image>
				<view>更多</view>
			</view>
		</view>
		<more-operation 
			ref="operationChild"
			:info="info" 
			:payment_approval="payment_approval"
			@toLookContract="toLookContract"
			@revokeContract="revokeContract"
			@uploadFile="uploadFile"
			@removeExamineP="removeExamine"
			@toRevokeContractP="toRevokeContract"
		></more-operation>
		
		<!-- 下载报价单 -->
		<uni-popup ref="downPopup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="acbox">
				<view class="acli" @click="onSelect('word')">word</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import baseInfo from './baseInfo.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netContractDetail, netCancelExamine, netApprovalDetail, netTerminationContract, 
	netPaymentList, netTakeContactStatus, netContractpassDetail, netPreviewContract,
	 netContractAddFile, netContractFileList, netContractDelFile, netContractStart, netPlanNopage } from '@/api/api.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import moreOperation from './moreOperation.vue'
	import followInfo from './follow_info.vue'
	
	export default {
		mixins:[commonFun],
		components: {
			baseInfo,
			moreOperation,
			followInfo
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',   //合同id
				info:{},
				is_check_success:0,   //是否审核通过  0否   1是
				planList:[],
				showMore:false,
				remindPeople:[],
				examineType:'',
				payment_approval:{},   //审批流程
				//相关附件
				fileList:[],
				//回款计划
				plan_list:[],
				active:0
			}
		},
		onLoad(options) {
			this.id = options.id
			this.is_check_success = options.checkstatus
			uni.removeStorageSync('EditContract')
			uni.removeStorageSync('contractRemindlist')
		},
		onShow() {
			this.info = {}
			this.getDefaultRemind()
			//合同详情
			this.getInfo()
			//获取回款计划
			this.getpayPlan()
			//获取回款记录
			this.getPlan()
			//审批流程
			this.getApprovalList()
			//相关附件列表
			this.getFileList()
		},
		onHide() {
		},
		onUnload() {
			uni.removeStorageSync('EditContract')
			uni.removeStorageSync('contractRemindlist')
		},
		
		methods: {
			changeTab(e) {
				this.active = e
			},
			//更多操作
			moreOperation() {
				this.$refs.morePopup.open()
			},
			//终止合同
			toRevokeContract() {
				uni.showModal({
					title:'提示',
					content:'请确认时候终止合同，终止之后合同将作废',
					success:(res)=>{
						if(res.confirm){
							netTerminationContract({contract_id:this.info.id}).then(res=>{
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
			//撤回  审批
			removeExamine() {
				uni.showModal({
					title:'提示',
					content:'请确认是否撤回?',
					success:(res)=>{
						if(res.confirm){
							netCancelExamine({id:this.info.id}).then(res=>{
								uni.showToast({
									title: res.msg,
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
			//更多操作
			showMoreOpeta() {
				this.$refs.operationChild.open()
			},
			//终止合同成功
			revokeContract() {
			},
			//上传附件成功
			uploadFile() {
				this.getFileList()
			},
			//获取附件列表
			getFileList() {
				netContractFileList({contract_id:this.id}).then(res=>{
					this.fileList = res.data
				})
			},
			//删除附件
			delFile(id) {
				uni.showModal({
					title:'提示',
					content:'请确认是否删除附件?',
					success:(conres)=>{
						if(conres.confirm){
							netContractDelFile({id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									//获取附件列表
									this.getFileList()
								},2000)
							})
						}
					}
				})
			},
			//查看附件
			toLookFile(item) {
				this.openFile({file:item.file_path,filename:item.name,type:item.types})
			},
			//上传附件
			toAddFile() {
				let fileUrl = this.toUploadFile((res)=>{
					let params = {
						contract_id:this.id,
						files:res.id
					}
					netContractAddFile(params).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							this.$refs.morePopup.close()
							//获取附件列表
							this.getFileList()
						},2000)
					})
				})
			},
			
			toLookContract() {
				this.$refs.downPopup.open()
			},
			onSelect(type) {
				let params = {
					id:this.id,
					type
				}
				netPreviewContract(params).then(res=>{
					this.openFile({file:res.data.file,filename:res.data.filename,type:'file'})
				})
			},
			
			getApprovalList() {
				let params = {
					type: 'contract',
					relation_id: this.id
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//回款记录
			getPlan() {
				netPaymentList({contract_id:this.id,limit:100}).then(res=>{
					this.planList = res.data.data
				})
			},
			//回款计划
			getpayPlan() {
				netPlanNopage({
					contract_id: this.id,
				}).then(res => {
					this.plan_list = res.data
				})
			},
			//获取合同 详情信息
			getInfo() {
				netContractDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			//合同审核通过  之后的详情
			getPassInfo() {
				netContractpassDetail({id:this.id}).then(res=>{
					res = res.data
					if(res.examine){
						let examine = res.examine.product
						let arr = res.customer_product
						examine.forEach(item=>{
							arr.forEach(ele=>{
								if(item.id == ele.id){
									ele.is_delete = true
								}else{
									ele.is_delete = false
								}
							})
						})
						res.customer_product = arr
					}
					this.info = res
				})
			},
			//客户信息
			toKehuInfo() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.info.customer.id
				})
			},
			//审核通过之后 修改合同
			toEditPassContract(id) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/order/editExamineOrder?contractid='+id
				})
			},
			//通过
			toPass() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.id+'&type=contract&status=1'
				})
			},
			//拒绝
			toRefuse() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.id+'&type=contract&status=2'
				})
			},
			//生效合同 
			takeContract() {
				uni.showModal({
					title:'提示',
					content:'请确认合同是否生效?',
					success:(res)=>{
						if(res.confirm){
							let params = {
								contract_id: this.info.id
							}
							netTakeContactStatus(params).then(res=>{
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
			//传阅
			toCirculate() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.id+'&type=contract'
				})
			},
			//客户确认  发货
			toShencheng() {
				netContractStart({contract_id:this.id}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateTo({
							url:'/pagesA/afterSales/index'
						})
					},2000)
				})
			},
			//写  新跟进
			newFollowClick() {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/newFllow?id='+this.id+'&type=3'
				})
			},
			//商机详情
			toBusinessDetail() {
				uni.navigateTo({
					url:'/pagesB/business/detail?id='+this.info.business.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scrollbox{
		width:100%;
		height:calc(100vh - 100rpx);
		background:#f5f5f5;
	}
	.tabwarp{
		border-top:1rpx solid #f5f5f5;
		border-bottom:1rpx solid #f5f5f5;
	}
	//tab栏
	.tablist_new_list{
		padding:24rpx 10rpx;
		width:750rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		background:#fff;
		.tabtn{
			flex-shrink: 0;
			width:170rpx;
			text-align: center;
			font-size:26rpx;
			color:#999;
			padding-bottom:20rpx;
			position: relative;
			&::after{
				content:'';
				position: absolute;
				left:50%;
				transform: translateX(-50%);
				bottom:0;
				width:80rpx;
				height:10rpx;
				background:#fff;
				border-radius: 10rpx;
			}
		}
		.tabtn_active{
			width:170rpx;
			text-align: center;
			font-size:26rpx;
			color:#333;
			padding-bottom:20rpx;
			position: relative;
			&::after{
				content:'';
				position: absolute;
				left:50%;
				transform: translateX(-50%);
				bottom:0;
				width:80rpx;
				height:10rpx;
				background:$uni-btn-bg-color;
				border-radius: 10rpx;
				opacity: 0.5;
			}
		}
	}
	.title{
		margin-left: -10rpx;
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
			background: $uni-text-color;
		}
	}
	// 跟多操作
	.more_opera{
		padding:70rpx 40rpx;
		width:750rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.morebtn{
			text-align: center;
			color:#666;
			margin-right:60rpx;
			.botimg{
				width:40rpx;
				height:40rpx;
			}
		}
	}
	//附件列表
	.fileWarp{
		position: relative;
		margin-top: 20rpx;
		padding: 24rpx;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		background-color: #fff;
		.file_title{
			font-size:30rpx;
			color:#333;
			font-weight: bold;
			border-bottom:1rpx solid #f5f5f5;
		}
		.doc_item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:10rpx 35rpx;
			margin: 24rpx 0 24rpx 80rpx;
			width: 500rpx;
			border-radius: 10rpx;
			background-color: #F6F6F6;
			border-bottom:1rpx solid #f5f5f5;
			.remarkimg{
				width:25rpx;
				height:30rpx;
				margin-right:15rpx;
			}
			.deleimg{
				width:44rpx;
				height:44rpx;
			}
			.doc_name{
				width: 370rpx;
				white-space:nowrop;
				overflow:hidden;
				text-overflow:ellipsis;
				font-size:26rpx;
				color: $uni-text-color;
			}
		}
	}
	
	.warnstatus{
		color:#ec7f51;
	}
	.contractinfo{
		position: relative;
		padding:20rpx 24rpx;
		margin-bottom: 20rpx;
		width: 750rpx;
		background: #FFFFFF;
		border: 1px solid #FFFFFF;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		background:#fff;
		.constatus{
			position:absolute;
			right:24rpx;
			top:24rpx;
			border-radius: 5px;
			font-size:24rpx;
			padding:2rpx 15rpx;
			color:$uni-text-color;
			background:$uni-bg-opacity;
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
		.conbox{
			padding:0 45rpx;
			.conbox_top{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.conbox_left{
					margin-left: 30rpx;
					.content{
						font-size:26rpx;
						color:#999;
						margin:15rpx 0;
					}
				}
				.conbox_right{
					font-size:34rpx;
					color:#F2533E;
				}
				.conmoneyth{
					font-size:24rpx;
					text-decoration: line-through;
				}
			}
			.content{
				font-size:26rpx;
				color:#999;
				margin:15rpx 0;
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
					background:$uni-text-color;
				}
			}
			.money{
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
	}
	.tabinfo{
		position: relative;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:20rpx;
		width: 750rpx;
		height: 100rpx;
		background: #FFFFFF;
		border: 1px solid #FFFFFF;
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
			}
		}
		.rightimg{
			width:32rpx;
			height:32rpx;
		}
	}
	.team_warp{
		padding:24rpx 35rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.team_left{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.teamtit{
				font-size:26rpx;
				color:#666;
				margin-right:24rpx;
			}
			.teambox{
				width:430rpx;
				height:60rpx;
				.staffheader{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.staffimg{
						width:60rpx;
						height:60rpx;
						border-radius: 50%;
						margin-right:20rpx;
						flex-shrink: 0;
					}
				}
			}
		}
		.team_right{
			font-size:28rpx;
			color:#007AFF;
			font-weight: bold;
			flex-shrink: 0;
		}
	}
	
	.btnlist{
		padding:20rpx 24rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom:1rpx solid #F5F5F5;
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
			background:#0287FF;
		}
		.refuse{
			background:#F2533E;
		}
	}
	.baseinfo{
		margin-top: 20rpx;
		.infotitle{
			font-size:32rpx;
			color:#0287FF;
			font-weight: bold;
			padding-left:30rpx;
			position: relative;
			&::before{
				content:'';
				width:15rpx;
				height:30rpx;
				background:#0287FF;
				border-radius: 10rpx;
				position: absolute;
				left:0;
				top:6rpx;
			}
		}
	}
	.bottom_nav {
		position: fixed;
		display: flex;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 0;
		background-color: #fff;
		text-align: center;
		color: #999;
		display: flex;
		justify-content: space-around;
		align-items: center;
		z-index: 2;
		border-top:1rpx solid #f5f5f5;
		.bottom_item {
			.botimg{
				width:40rpx;
				height:40rpx;
				margin-bottom:5rpx;
			}
		}
	}

	.pull_con {
		padding: 40rpx 0 10rpx;
		display: flex;
		flex-wrap: wrap;
		text-align: center;
		color: #999;

		.pull_item {
			width: 25%;

			:first-child {
				padding-bottom: 10rpx;
			}

			:last-child {
				padding-bottom: 50rpx;
			}
		}
	}
	.botimg{
		width:40rpx;
		height:40rpx;
	}
</style>
