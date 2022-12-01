<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户名称<span>*</span></view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="customerObj?'valueActive':''">{{customerObj?customerObj.name:'请选择客户'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户合同<span>*</span></view>
			<picker @change="changeOrder" :range="orderList" :range-key="'num'" :value="orderIndex">
				<view class="form_right">
					<view :class="orderList[orderIndex] ? 'valueActive' : '' ">
						{{orderList[orderIndex] ? orderList[orderIndex].num : '选择合同'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">回款期数</view>
			<picker @change="changePlan" :range="planArr" :range-key="'num'" :value="planIndex">
				<view class="form_right">
					<view :class="planArr[planIndex] ? 'valueActive' : '' ">
						{{planArr[planIndex] ? planArr[planIndex].num : '选择期数'}}</view>
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
	import { commonFun } from '@/common/navigate'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netContractList, netSetForm, netPlanNopage, netAddPayment, netPaymentNumber, netCustomerDetail, netApprovalProcess } from '@/api/api.js'
	import { mapState } from 'vuex'
	
	export default{
		mixins:[commonFun],
		components:{
			formItem
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				customer_id:'',  //客户id
				customerName:'',  //客户名称
				remindPeople:[],
				examineType:'receivables',
				orderList:[],   //客户订单
				orderIndex:null,
				orderid:'',
				listForm:null,
				approvalPro:{},   //审批流程
				planArr:[],  //回款期数
				planIndex:null
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
		}),
		watch:{
			customerObj() {
				//获取 订单 列表
				this.getOrder()
			}
		},
		onLoad(options) {
			if(options.customerid){
				this.customer_id = options.customerid
				//获取客户详情
				this.getKehuDetail()
			}
			this.getForm()
			if(options.id){
				this.orderid = options.id
			}
			//获取审批流程
			this.getProcess()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
		},
		//监听  页面 卸载
		onUnload() {
			uni.removeStorageSync('remindlist')
			this.$store.commit('CUSTOMEROBJ',null)
		},
		methods:{
			getKehuDetail() {
				netCustomerDetail({id:this.customer_id}).then(res=>{
					res = res.data
					this.$store.commit('CUSTOMEROBJ',{id:res.id,name:res.name})
				})
			},
			//审批流程
			getProcess() {
				netApprovalProcess({type:'receivables'}).then(res=>{
					this.approvalPro = res.data
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
			getNumber() {
				netPaymentNumber().then(res=>{
					let arr = this.listForm
					arr.forEach((ele,index)=>{
						if(ele.id == 'number'){
							ele.value = res.data.number
						}
					})
					this.listForm = arr
				})
			},
			getForm() {
				netSetForm({type:'examine'}).then(res=>{
					res = res.data.data
					res.forEach(ele=>{
						ele.value = ''
					})
					this.listForm = res
					this.getNumber()
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
				netContractList({customer_id:this.customerObj.id}).then(res=>{
					let arr = res.data
					let orderarr = []
					arr.forEach(ele=>{
						if(ele.check_status == 2){
							orderarr.push(ele)
						}
					})
					this.orderList = orderarr
					if(this.orderid){
						//处理 默认 客户订单 回款
						this.handleDefaultOrder()
					}
				})
			},
			changeOrder(e) {
				this.orderIndex = e.detail.value
				//获取回款计划
				this.getPlan()
			},
			getPlan() {
				netPlanNopage({contract_id:this.orderList[this.orderIndex].id}).then(res=>{
					this.planArr = res.data
				})
			},
			changePlan(e) {
				this.planIndex = e.detail.value
				//填充默认的回款日期、金额、方式
				this.handle()
			},
			handle() {
				let obj = this.planArr[this.planIndex]?this.planArr[this.planIndex]:null
				if(obj){
					let arr = this.listForm
					arr.forEach((ele,index)=>{
						if(ele.id == 'return_time'){
							ele.value = obj.return_date
							this.$set(this.listForm,index,ele)
						}
						if(ele.id == 'money'){
							ele.value = obj.money
							this.$set(this.listForm,index,ele)
						}
						if(ele.id == 'return_type'){
							ele.value = obj.return_type
							this.$set(this.listForm,index,ele)
						}
					})
				}
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
				if(!this.orderList[this.orderIndex]){
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
					customer_id:this.customerObj.id,
					plan_id:this.planArr[this.planIndex]?this.planArr[this.planIndex].id:''
				})
				netAddPayment(params).then(res=>{
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
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #666;
		}
	
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			font-size:24rpx;
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
			border: 1rpx solid #EAEAEA;
	
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
	
</style>
