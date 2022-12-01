<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp" v-if="type != '电话售后'">
			<view class="inp_title key">开始时间<span>*</span></view>
			<view class="form_right">
				<view :class="start_time ? 'valueActive' : '' ">
					{{start_time ? start_time : '开始时间'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">完成工作时间<span>*</span></view>
			<view class="form_right">
				<view :class="end_time ? 'valueActive' : '' ">
					{{end_time ? end_time : '完成工作时间 '}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view v-if="type != '电话售后'">
			<view class="inp_warp">
				<view class="inp_title key">服务费用<span>*</span></view>
				<view class="form_right">
					<view class="valueActive">共计{{serviceMoney}}元</view>
				</view>
			</view>
			<view class="prolist" v-if="pay_service.length != 0">
				<view class="probox">
					<view class="proli" v-for="(item,index) in pay_service" :key="index">
						<view class="protext" style="width:160rpx">{{item.name}}</view>
						<view class="protext">
							<input type="digit" style="background:#f5f5f5;height:60rpx;line-height: 60rpx;border-radius: 10rpx;" v-model="item.money" @blur="(e)=>{changeMoney(e,index)}" placeholder="请输入服务费用" class="priceinput"> 元
						</view>
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="inp_warp" style="margin-top:24rpx;">
			<view class="key inp_title">配件费用<span>*</span></view>
			<view class="form_right">
				<view class="valueActive">共计{{partsMoney}}元</view>
			</view>
		</view>
		<view class="prolist" v-if="surplus_parts.length != 0">
			<view class="probox">
				<view class="proli">
					<view class="protext">配件名称</view>
					<view class="protext">数量</view>
					<view class="protext">金额</view>
					<view class="protext" style="width:220rpx">是否收费</view>
				</view>
				<view class="proli" v-for="(item,index) in surplus_parts" :key="index">
					<view class="protext">{{item.name}}</view>
					<view class="protext">×{{item.number}}</view>
					<view class="protext" >{{item.price}}元</view>
					<view class="rediowarp">
						<view class="redioli" @click="chargePart(index,1)">
							<radio value="1" color="#008EFF" :checked="item.is_charge == 1" />是
						</view>
						<view class="redioli" @click="chargePart(index,0)">
							<radio value="0" color="#008EFF" :checked="item.is_charge == 0" />否
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">总费用<span>*</span></view>
			<view class="form_right">
				<input type="digit" disabled v-model="total_money" class="form_input" placeholder="请输入总费用">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">收款账号<span>*</span></view>
			<picker @change="changeAccount" :range="accountList" :value="accountIndex" :range-key="'account'">
				<view class="form_right">
					<view :class="accountList[accountIndex] ? 'valueActive' : '' ">
						{{accountList[accountIndex] ? accountList[accountIndex].account : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<upload-img 
			title="收款账号(图)" 
			:flag="false" 
			:imgList="imgList" 
			@uploadImg="uploadImg" 
			@delImg="delImg"
			:single="true"
		></upload-img>
		
		<view class="fllow_form">
			<view class="key">含税方式<span>*</span></view>
			<view class="form_right_radio">
				<view class="ra_li" @click="changeHanshui(1)">
					<radio value="1" :checked="isHan == 1" color="#008EFF" /> 含 <input type="digit" v-model="hanshui"> %专用增值税发票
				</view>
				<view class="ra_li" @click="changeHanshui(2)">
					<radio value="2" :checked="isHan == 2" color="#008EFF" /> 不含税
				</view>
			</view>
		</view>
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 审核信息 -->
		<examine-people v-if="approvalPro.status == 0"  :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="toInput">确认</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import { netWorkOrderDetail, netRepairInputFee, netAccountList, netApprovalProcess } from '@/api/api.js'
	import { netTemplateList } from '@/api/template.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				id:'',   //工单id
				start_time:'',
				end_time:'',
				pay_service:[],    //服务费用
				serviceMoney:0,
				surplus_parts:[],   //配件费用
				partsMoney:0,    //配件费用
				discount_money:0,   //优惠金额
				total_money:0,   //总费用
				money:0,   //当前费用
				flow_staff_id:'',   //审批人
				
				remindPeople:[],
				examineType:'workorder',
				hanshui:'13',
				isHan:1,   //1含税   2不含税
				//账号
				accountList:[],
				accountIndex:null,
				//收款账号 图
				imgList:[],
				type:'',  //录入费用 类型
				approvalPro:{},   //审批流程
			}
		},
		onLoad(options) {
			this.id = options.id
			// this.type = options.type
			//获取 工单详情
			this.getDetail()
			
			//收款账号
			this.getAcc()
			//审批流程
			this.getProcess()
		},
		onShow() {
			if(this.approvalPro.status == 0){
				this.getDefaultRemind()
			}
		},
		methods:{
			//审批流程
			getProcess() {
				netApprovalProcess({type:'workorder'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						this.getDefaultRemind()
					}
				})
			},
			//收款帐号
			getAcc() {
				netAccountList().then(res=>{
					this.accountList = res.data
				})
			},
			//收款账号
			changeAccount(e) {
				this.accountIndex = e.detail.value
			},
			uploadImg(obj) {
				this.imgList.push(obj)
			},
			delImg(index) {
				this.imgList.splice(index,1)
			},
			////////////////////////////////////////////////////////////////////
			getServe() {
				let type ;
				if(this.type == '返厂维修'){
					type = '返厂服务费用'
				}else if(this.type == '电话售后'){
					
				}else {
					type = '服务费用'
				}
				netTemplateList({type}).then(res=>{
					let arr = res.data.template
					arr.forEach(ele=>{
						ele.name = ele.field
						ele.money = 0
					})
					this.pay_service = arr
				})
			},
			changeMoney(e,index) {
				let obj = this.pay_service[index]
				obj.money = e.detail.value
				this.$set(this.pay_service,index,obj)
				this.handleService()
			},
			handleService() {
				let arr = this.pay_service
				let money = 0
				arr.forEach(ele=>{
					money += Number(ele.money)
				})
				this.serviceMoney = money
				
				this.handleTotalMoney()
			},
			getDetail() {
				netWorkOrderDetail({id:this.id}).then(res=>{
					this.start_time = res.data.start_time
					this.end_time = res.data.end_time
					this.type = res.data.workorder_type
					
					this.surplus_parts = res.data.use_parts
					// if(res.data.workorder_type == '上门维修' || res.data.workorder_type == '配件安装' || res.data.workorder_type == '电话售后'){
						
					// }else{
					// 	this.surplus_parts = res.data.surplus_parts
					// }
					// 处理配件  是否收费
					this.surplus_parts.forEach(ele=>{
						ele.is_charge = 1
					})
					//计算 配件费用   
					this.handlePart()
					//获取 服务费用
					this.getServe()
				})
			},
			handlePart() {
				let arr = this.surplus_parts
				let money = 0
				arr.forEach(ele=>{
					if(ele.is_charge == 1) {
						money += ele.price * ele.number
					}
				})
				this.surplus_parts = arr
				this.partsMoney = money
				
				this.handleTotalMoney()
			},
			handleTotalMoney() {
				if(Number(this.discount_money) > (Number(this.serviceMoney) + Number(this.partsMoney))){
					uni.showToast({
						title:'优惠金额不能大于总金额',
						icon:'none'
					})
					this.discount_money = 0
					return
				}
				//总费用
				this.total_money = Number(this.serviceMoney) + Number(this.partsMoney)
				//当前费用
				this.money = this.total_money - Number(this.discount_money)
			},
			//选择配件  是否收费
			chargePart(index,num) {
				let obj = this.surplus_parts[index]
				obj.is_charge = num
				this.$set(this.surplus_parts,index,obj)
				//计算配件费用
				this.handlePart()
			},
			//选择是否含税
			changeHanshui(type) {
				this.isHan = type
			},
			toInput() {
				if(this.remindPeople.length == 0 && this.approvalPro.status == 0) {
					uni.showToast({
						title:'请选择审批人',
						icon:'none'
					})
					return
				}
				let arr = []
				this.remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				//配件 
				let partarr = []
				this.surplus_parts.forEach(ele=>{
					partarr.push({
						is_charge:ele.is_charge,
						number:ele.number,
						id:ele.id
					})
				})
				if(this.isHan == 1 && !this.hanshui) {
					uni.showToast({
						title:'请填写含税方式',
						icon:'none'
					})
					return
				}
				
				if(this.accountIndex == null && this.imgList.length == 0) {
					uni.showToast({
						title:'请选择收款帐号/上传收款图',
						icon:'none'
					})
					return
				}
				
				//收款图片
				let parr = []
				this.imgList.forEach(ele=>{
					parr.push(ele.id)
				})
				
				let tax = ''
				if(this.isHan == 1) {
					tax = `含${this.hanshui}%专用增值税发票`
				}else{
					tax = '不含税'
				}
				let params = {
					id:this.id,
					total_money:this.total_money,
					money:this.money,
					flow_staff_ids:this.approvalPro.status == 0 ? arr.join(',') : '',
					use_parts:partarr,
					tax,
					collection_img:parr.join(','),
					collection_account:this.accountList[this.accountIndex]?this.accountList[this.accountIndex].account:'',
					collection_deposit:this.accountList[this.accountIndex]?this.accountList[this.accountIndex].deposit:'',
					collection_name:this.accountList[this.accountIndex]?this.accountList[this.accountIndex].name:'',
				}
				if(this.type != '电话售后'){
					params.pay_service = this.pay_service
				}
				netRepairInputFee(params).then(res=>{
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
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#FFA205;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#FFA205;
				margin-right:5rpx;
			}
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding:30rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
		.form_right_radio{
			.ra_li{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size:26rpx;
				radio{
					transform: scale(0.7);
				}
				input{
					width:100rpx;
					height:60rpx;
					background:#f5f5f5;
					border-radius: 5rpx;
					text-align: center;
				}
			}
		}
	}
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #EDEDED;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom:0;
				}
				.icon-jian{
					font-size:42rpx;
					color:#ff7800;
				}
				.protext{
					font-size:24rpx;
					color:#333;
					width:150rpx;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					.priceinput{
						width:180rpx;
						font-size:24rpx;
						color:#333;
					}
				}
				.rediowarp{
					display: flex;
					justify-content: center;
					align-items: center;
					width:220rpx;
					.redioli{
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right:24rpx;
						font-size:24rpx;
						color:#333;
						&:last-child{
							margin-right:0;
						}
						radio{
							transform: scale(0.7);
						}
					}
				}
			}
		}
	}
</style>
