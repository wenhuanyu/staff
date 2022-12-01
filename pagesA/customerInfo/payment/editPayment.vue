<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title">客户名称<text>*</text></view>
			<view class="form_right">
				<input type="text" disabled v-model="customerName" :class="customerName?'valueActive':''" placeholder="请输入客户名称" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">客户订单<text>*</text></view>
			<picker @change="changeOrder" :range="orderList" :range-key="'num'" :value="orderIndex">
				<view class="form_right">
					<view :class="orderList[orderIndex] ? 'valueActive' : '' ">
						{{orderList[orderIndex] ? orderList[orderIndex].num : '选择客户订单'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<form-item v-if="listForm" :listForm="listForm" @changeData="changeOtherData"></form-item>
		
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 审核信息 -->
		<examine-people v-if="approvalPro.status == 0" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(addPayment)">提交</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem'
	import { commonFun } from '@/common/navigate.js'
	import { netPaymentDetail, netContractList, netSetForm, netEditPaymentInfo, netApprovalProcess } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		components:{
			formItem
		},
		data(){
			return{
				noClick:true,    //防止  重复点击
				customer_id:'',  //客户id
				customerName:'',  //客户名称
				remindPeople:[],
				examineType:'receivables',
				orderList:[],   //客户订单
				orderIndex:null,
				orderid:'',
				listForm:null,
				number:'',   //回款编号
				
				id:'',   //回款id
				info:null,
				approvalPro:{},   //审批流程
			}
		},
		onLoad(options) {
			this.id = options.paymentid
			this.getInfo()
			//审批流程
			this.getProcess()
		},
		onShow() {
			if(this.approvalPro.status == 0){
				//获取  默认需要提醒的人
				this.getDefaultRemind()
			}
		},
		//监听  页面 卸载
		onUnload() {
			uni.removeStorageSync('remindlist')
		},
		methods:{
			//审批流程
			getProcess() {
				netApprovalProcess({type:'receivables'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						//获取  默认需要提醒的人
						this.getDefaultRemind()
					}
				})
			},
			getInfo() {
				netPaymentDetail({id:this.id}).then(res=>{
					this.info = res.data
					this.customer_id = res.data.customer.id
					this.customerName = res.data.customer.name
					this.orderid = res.data.contract.id
					this.number = res.data.number
					
					this.getForm()
					//获取 订单 列表
					this.getOrder()
				})
			},
			getForm() {
				netSetForm({type:'examine'}).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
				})
			},
			
			//处理 默认 客户订单 回款
			handleDefaultOrder() {
				let arr = this.orderList
				arr.forEach((ele,index)=>{
					if(ele.id == this.orderid){
						this.orderIndex = index
					}
				})
			},
			changeOtherData(name,value,obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			//获取订单列表
			getOrder() {
				netContractList({customer_id:this.customer_id}).then(res=>{
					this.orderList = res.data
					if(this.orderid){
						this.handleDefaultOrder()
					}
				})
			},
			changeOrder(e) {
				this.orderIndex = e.detail.value
			},
			//时间
			changeDate(e) {
				this.return_time = e.detail.value
			},
			//更多
			moreClick() {
				uni.navigateTo({
					url: '/pages/selectMember/selectMember'
				})
			},
			//提交
			addPayment() {
				if(!this.orderIndex && this.orderIndex != 0){
					uni.showToast({
						title:'请选择客户订单',
						icon:'none'
					})
					return
				}
				let arr = []
				let { remindPeople } = this
				remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				let flow_staff_ids = arr.join(',')
				let params = this.checkCommonForm(this.listForm)
				if(!params){
					return
				}
				params = Object.assign({},params,{
					contract_id:this.orderList[this.orderIndex].id,
					flow_staff_ids:this.approvalPro.status == 0 ? flow_staff_ids : '',
					customer_id:this.customer_id,
					number:this.number,
					id:this.id,
				})
				netEditPaymentInfo(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding: 30rpx 24rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #333;
			text{
				color:#F00;
			}
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
			.right_btn{
				font-size:24rpx;
				color:#007AFF;
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
			border: 1rpx solid #EDEDED;
	
			.delimg {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				position: absolute;
				right: -16rpx;
				top: -16rpx;
				background: rgba(0, 0, 0, 0.5);
				z-index: 2;
			}
	
			.selfimg {
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
	.affiliation {
		background-color: #fff;
		margin-bottom: 20rpx;
		margin-top:24rpx;
		padding-bottom: 40rpx;
		.aff_head {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 30rpx;
			font-size:26rpx;
			text {
				color: #f00;
				margin-left: 10rpx;
			}
		}
		.aff_con {
			display: flex;
			text-align: center;
			flex-wrap: wrap;
		
			.aff_item {
				width: 100rpx;
				margin-right: 15rpx;
				margin-bottom:15rpx;
				image {
					margin-bottom: 15rpx;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}
		
			.affbox {
				position: relative;
		
				.delremind {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					position: absolute;
					right: -16rpx;
					top: -16rpx;
					background: rgba(0, 0, 0, 0.5);
					z-index: 2;
				}
			}
		
			.aff_last {
				image {
					margin-bottom: 15rpx;
					width: 80rpx;
					height: 50rpx;
				}
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx 24rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
			text {
				color: #f00;
			}
		}
		textarea {
			width: 670rpx;
			background: #fff;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 0 auto;
		}
	}
</style>
