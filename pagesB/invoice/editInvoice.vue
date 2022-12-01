<template>
	<view class="">
		<!-- <view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view> -->
		<view class="fenlei_title">基础信息</view>
		<view class="inp_warp">
			<view class="inp_title key">发票编号</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="number ? 'valueActive' : '' " placeholder="发票编号" v-model="number">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联客户<span>*</span></view>
			<view class="form_right" @click="relationCustomer">
				<view :class="customerObj ? 'valueActive' : '' ">{{customerObj ? customerObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联合同<span>*</span></view>
			<view class="form_right" @click="relationContract">
				<view :class="contractObj ? 'valueActive' : '' ">{{contractObj ? contractObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开票金额<span>*</span></view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="money ? 'valueActive' : '' " placeholder="开票金额" v-model="money">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开票时间<span>*</span></view>
			<view class="form_right">
				<select-time-picker
					placeholder="选择开票时间"
					:defaultValue="time"
					fields="minute"
					@change="changeStartTime"
				></select-time-picker>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开票类型<span>*</span></view>
			<picker @change="changeType" :range="typeList" :value="typeIndex">
				<view class="form_right">
					<view :class="typeList[typeIndex] ? 'valueActive' : '' ">
						{{typeList[typeIndex] ? typeList[typeIndex] : '选择开票类型'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_area">
			<view class="key area_head">备注</view>
			<view class="form_right">
				<textarea 
					:class="remark ? 'valueActive' : '' " 
					style="height:150rpx;"
					placeholder="填写备注"  
					v-model="remark" 
				/>
			</view>
		</view>
		<!-- 发票信息 -->
		<view class="fenlei_title">发票信息</view>
		<view class="inp_warp">
			<view class="inp_title key">抬头类型</view>
			<picker @change="changeHeader" :range="headerType" :value="headerIndex">
				<view class="form_right">
					<view :class="headerType[headerIndex] ? 'valueActive' : '' ">
						{{headerType[headerIndex] ? headerType[headerIndex] : '选择抬头类型'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">发票抬头</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="invoice_header ? 'valueActive' : '' " placeholder="发票抬头" v-model="invoice_header">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">纳税人识别号</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="taxpayer_number ? 'valueActive' : '' " placeholder="纳税人识别号" v-model="taxpayer_number">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开户行</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="bank_deposit ? 'valueActive' : '' " placeholder="开户行" v-model="bank_deposit">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开户账户</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="bank_account ? 'valueActive' : '' " placeholder="开户账户" v-model="bank_account">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开票地址</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="invoice_address ? 'valueActive' : '' " placeholder="开票地址" v-model="invoice_address">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">电话</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="invoice_mobile ? 'valueActive' : '' " placeholder="电话" v-model="invoice_mobile">
			</view>
		</view>
		<!-- 邮寄信息 -->
		<view class="fenlei_title">邮寄信息</view>
		<view class="inp_warp">
			<view class="inp_title key">联系人</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="contacts ? 'valueActive' : '' " placeholder="联系人" v-model="contacts">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">联系方式</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="phone ? 'valueActive' : '' " placeholder="联系方式" v-model="phone">
			</view>
		</view>
		<view class="inp_warp">
			<view class="key inp_title">收货地址</view>
			<view class="form_right" @click="detailAddClick">
				<view class="location" :class="address ? 'valueActive' : '' ">{{address ? address : '收货地址'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="key area_head">详细地址</view>
			<view class="form_right">
				<textarea 
					:class="address_detail ? 'valueActive' : '' " 
					style="height:150rpx;"
					placeholder="填写详细地址"  
					v-model="address_detail" 
				/>
			</view>
		</view>
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 审核信息 -->
		<examine-people v-if="approvalPro.status == 0" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(toAdd)">
			保存
		</view>
		
		<!-- 客户 -->
		<select-customer ref="customerChild" @getCustomerinfo="getCustomerinfo"></select-customer>
		<select-contract ref="contractChild" @contractInfo="contractInfo"></select-contract>
	</view>
</template>

<script>
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	import { netApprovalProcess, netEditInvoice, netDetailInvoice} from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import selectContract from '@/components/selectContract.vue'
	import selectCustomer from '@/components/selectCustomer.vue'
	
	
	export default{
		mixins:[commonFun],
		components:{
			selectTimePicker,
			selectContract,
			selectCustomer
		},
		data() {
			return{
				noClick:true,    //防止  重复点击
				id:'',
				number:'',
				customerObj:null,
				contractObj:null,
				money:'',
				time:'',
				typeList:['增值税专用发票','增值税普通发票','国税通用机打发票','地税通用机打发票','收据'],
				typeIndex:null,
				approvalPro:{},   //审批流程
				headerType:['单位','个人'],
				headerIndex:null,
				remark:'',
				invoice_header:'',
				head_type:'',
				taxpayer_number:'',   //纳税人识别号
				bank_deposit:'',
				bank_account:'',
				invoice_address:'',
				invoice_mobile:'',
				contacts:'',
				phone:'',
				address:'',
				address_detail:''
			}
		},
		onLoad(options) {
			this.id = options.id
			//详情
			this.getDetail()
			//审批流程
			this.getProcess()
		},
		onShow() {
			if(this.approvalPro.status == 0){
				//获取  默认需要提醒的人
				this.getDefaultRemind()
			}
		},
		methods:{
			//审批流程
			getProcess() {
				netApprovalProcess({type:'invoice'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						//获取  默认需要提醒的人
						this.getDefaultRemind()
					}
				})
			},
			getDetail() {
				netDetailInvoice({id:this.id}).then(res=>{
					res = res.data
					this.number = res.number
					this.money = res.money
					this.customerObj = res.customer
					this.contractObj = res.contract
					this.time = res.time
					this.typeIndex = res.type
					
					this.remark = res.remark
					this.invoice_header = res.invoice_header
					this.head_type = res.head_type
					this.taxpayer_number = res.taxpayer_number   //纳税人识别号
					this.bank_deposit = res.bank_deposit
					this.bank_account = res.bank_account
					this.invoice_address = res.invoice_address
					this.invoice_mobile = res.invoice_mobile
					this.contacts = res.contacts
					this.phone = res.phone
					this.address = res.address
					this.address_detail = res.address_detail
				})
			},
			relationContract() {
				let id = this.customerObj?this.customerObj.id:''
				this.$refs.contractChild.init(id)
			},
			contractInfo(obj) {
				this.contractObj = obj
			},
			relationCustomer() {
				this.$refs.customerChild.init()
			},
			getCustomerinfo(obj) {
				this.customerObj = obj
			},
			changeStartTime(e){
				console.log(e)
				this.time = e.f3
			},
			changeType(e) {
				this.typeIndex = e.detail.value
			},
			toAdd() {
				if(!this.customerObj){
					uni.showToast({
						title:'请选择关联客户',
						icon:'none'
					})
					return
				}
				if(!this.contractObj){
					uni.showToast({
						title:'请选择关联合同',
						icon:'none'
					})
					return
				}
				if(!this.money){
					uni.showToast({
						title:'请填写金额',
						icon:'none'
					})
					return
				}
				if(!this.time){
					uni.showToast({
						title:'请选择开票时间',
						icon:'none'
					})
					return
				}
				if(!this.typeList[this.typeIndex]){
					uni.showToast({
						title:'请选择开票类型',
						icon:'none'
					})
					return
				}
				
				let params = {
					number:this.number,
					money:this.money,
					customer_id:this.customerObj.id,
					contract_id:this.contractObj.id,
					time:this.time,
					type:this.typeIndex,
					id:this.id,
					remark:this.remark,
					invoice_header:this.invoice_header,
					head_type:this.headerIndex,
					taxpayer_number:this.taxpayer_number,   //纳税人识别号
					bank_deposit:this.bank_deposit,
					bank_account:this.bank_account,
					invoice_address:this.invoice_address,
					invoice_mobile:this.invoice_mobile,
					contacts:this.contacts,
					phone:this.phone,
					address:this.address,
					address_detail:this.address_detail
				}
				netEditInvoice(params).then(res=>{
					uni.showToast({
						title:res.msg,
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
	.fenlei_title{
		font-size:30rpx;
		color:#999;
		padding:24rpx;
		background:#f5f5f5;
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
	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #f5f5f5;
		margin-bottom: 30rpx;
		.area_head {
			margin-bottom:24rpx;
			font-size:26rpx;
			color:#666;
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 10rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
</style>