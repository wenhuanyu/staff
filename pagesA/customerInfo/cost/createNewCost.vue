<template>
	<view class="warp">
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="key">报销类型<span>*</span></view>
			<view class="form_right">
				<radio-group class="radiowarp" @change="changeRadio" >
					<view class="">
						<radio value="1" color="#008EFF" :disabled="isEdit" :checked="isRelation == 1" />关联客户
					</view>
					<view class="">
						<radio value="2" color="#008EFF" :disabled="isEdit" :checked="isRelation == 2" />其他
					</view>
				</radio-group>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">报销单号<span>*</span></view>
			<view class="form_right">
				<input type="text" disabled v-model="number" placeholder="请输入报销单号" placeholder-style="color:#999;font-size:24rpx" class="rightinput" :class="number ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp" v-if="isRelation == 1">
			<view class="inp_title key">关联客户<span>*</span></view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="customerinfo ? 'valueActive' : '' ">{{customerinfo ? customerinfo.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">申请日期<span>*</span></view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view :class="submit_date ? 'valueActive' : '' ">
						{{submit_date ? submit_date : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">费用报销-明细<span>*</span></view>
			<view class="add_in" @click="addCost">
				<view class="iconfont icon-jiahaocu"></view>
				添加费用
			</view>
		</view>
		<view class="inp_warp">
			<view class="cost_warp">
				<view class="cost_li" v-for="(item,index) in allList" :key="index">
					<view class="li_left">
						<view class="iconfont icon-jian" @tap.stop="delCost(index)"></view>
					</view>
					<view class="cost_info" @tap.stop="toEditfree(index)">
						<view class="info_title">
							<view class="name">{{item.consume_type}}</view>
							<view class="time">{{item.consume_date}}</view>
						</view>
						<view class="li_warp">
							<view class="li_warp_left">
								<span>金额:</span>{{item.consume_money}}
							</view>
						</view>
					</view>
				</view>
				<view class="total_warp">
					<view class="total_left">
						<view class="total_h">合计</view>
						<view class="total_p">金额：<span>￥{{totalMoney}}</span></view>
					</view>
					<view v-if="costlist.length > 2">
						<view class="total_right" @click="allList = costlist" v-if="allList.length == 2">查看更多</view>
						<view class="total_right" @click="deceList" v-else>收起</view>
					</view>
				</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">报销金额<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="money" placeholder="请输入报销金额" class="rightinput" :class="money ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head key">备注:</view>
			<textarea v-model="remark" :class="remark ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 审核信息 -->
		<examine-people v-if="approvalPro.status == 0"  :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(toSave)">提交</view>
		<view class="botsec"></view>
		
	</view>
</template>

<script>
	import { BASE_IMG_URL, SIGN_NO, BASE_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import { netAddCost, netPrevCustomer, netCostDetail, netEditCost, netBaoxiaoNum, uploadUrl, netApprovalProcess } from '@/api/api.js'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,    //防止  重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				typeList:['合同','工单'],   //消费方式 列表
				typeIndex:'',
				submit_date:'',   //申请日期
				number:'',   //报销单号
				remindPeople:[],
				examineType:'consume',
				totalMoney:0,
				allList:[],
				remark:'',
				money:'',
				customerid:'',   //客户id
				relationid:'',   //关联id
				event_type:'',   //关联类型
				titles:'',   //费用主题
				isSelectCustomer:true,  //是否可以选择客户
				id:'',   //费用id
				isEdit:false,   //是否修改费用
				isRelation:1,   //1关联客户   2其他
				zancunCustomer:null,   //如果有默认客户的时候  暂时存储客户信息
				approvalPro:{},   //审批流程
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
			title: state => state.template.cost_title,    //费用  主题
			costlist: state => state.customer.costlist
		}),
		watch:{
			costlist(list) {
				if(list.length >2 ) {
					this.allList = list.slice(0,2)
				}else{
					this.allList = list
				}
				this.handleMoney()
			},
			customerinfo(val) {
				this.zancunCustomer = val
			}
		},
		onLoad(options) {
			if(options.id){
				this.id = options.id
				this.getDetail()
				this.isEdit = true
				uni.setNavigationBarTitle({
					title:'修改费用'
				})
			}else{
				this.isEdit = false
				let arr = getNewDateArry()
				this.submit_date = `${arr[0]}-${arr[1]}-${arr[2]}`
				//报销单号
				this.getBnum()
			}
			if(options.event_type) {
				this.event_type = options.event_type
			}
			// if(options.type) {
			// 	this.typeIndex = options.type
			// }
			if(options.customerid){
				this.relationid = options.relationid
				this.customerid = options.customerid
				this.getDefaultKehulist()
				this.isSelectCustomer = false
				this.isRelation = 1
			}else{
				this.isSelectCustomer = true
				this.isRelation = 2
			}
			
			this.$store.commit('SETCOSTlIST',[])     //费用信息
			//获取审批流程
			this.getProcess()
			
		},
		onShow() {
			if(this.approvalPro.status == 0){
				this.getDefaultRemind()
			}
		},	
		onUnload() {
			this.$store.commit('SETCOSTlIST',[])
		},
		methods:{
			//审批流程
			getProcess() {
				netApprovalProcess({type:'consume'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						this.getDefaultRemind()
					}
				})
			},
			getBnum() {
				netBaoxiaoNum().then(res=>{
					this.number = res.data.number
				})
			},
			//报销类型
			changeRadio(e) {
				this.isRelation = e.detail.value
			},
			//获取费用详情
			getDetail() {
				netCostDetail({id:this.id}).then(res=>{
					res = res.data
					this.submit_date = res.submit_date
					this.number = res.number
					// this.allList = res.consume_detail
					this.$store.commit('SETCOSTlIST',res.consume_detail)
					//计算费用
					// this.handleMoney()
					this.money = res.money
					this.remark = res.remark
				})
			},
			//默认客户
			getDefaultKehulist() {
				netPrevCustomer({id:this.customerid}).then(res => {
					this.$store.commit('CUSTOMEROBJ',res.data.data[0])
					//默认客户
					this.zancunCustomer = res.data.data[0]
				})
			},
			deceList() {
				this.allList = this.costlist.slice(0,2)
			},
			//选择 费用主题
			toSelectTitle() {
				uni.navigateTo({
					url:'/pages/template/visitTitle?type=费用主题'
				})
			},
			//修改  申请日期
			changeTime(e) {
				this.submit_date = e.detail.value
			},
			//计算  费用
			handleMoney() {
				let arr = this.costlist
				console.log(arr,'------')
				let money = 0
				let num = 0
				arr.forEach(ele=>{
					money += Number(ele.consume_money)
					num += Number(ele.number)
				})
				this.totalMoney = money
				this.money = money
			},
			//删除 费用类型
			delCost(index) {
				this.costlist.splice(index,1)
				this.$store.commit('SETCOSTlIST',this.costlist)
				this.handleMoney()
			},
			//报销类型
			changeType(e) {
				this.typeIndex = e.detail.value
			},
			//选择客户
			toSelectCustomer(){
				uni.navigateTo({
					url:'/pages/template/relation_customer'
				})
			},
			toSave() {
				console.log(12346)
				if(this.isRelation == 1 && !this.customerinfo){
					uni.showToast({
						title:'请选择客户',
						icon:'none'
					})
					return
				}
				if(!this.submit_date){
					uni.showToast({
						title:'请选择申请日期',
						icon:'none'
					})
					return
				}
				if(this.costlist.length == 0) {
					uni.showToast({
						title:'请添加费用报销明细',
						icon:'none'
					})
					return
				}
				if(this.remindPeople.length == 0 && this.approvalPro.status == 0) {
					uni.showToast({
						title:'请选择审批人',
						icon:'none'
					})
					return
				}
				//流程审批人
				let remarr = []
				this.remindPeople.forEach(ele=>{
					remarr.push(ele.id)
				})
				
				let flow_staff_ids = remarr.join(',')
				let params = {
					relation_id: this.relationid,
					relation_type:this.event_type,
					submit_date: this.submit_date,
					money: this.money,
					remark: this.remark,
					detail: this.costlist,
					flow_staff_ids:this.approvalPro.status == 0 ? flow_staff_ids : '',
					number:this.number
				}
				if(this.isRelation == 1) {
					params.customer_id = this.customerinfo ? this.customerinfo.id : ''
				}else{
					params.customer_id = ''
				}
				if(this.id) {
					//编辑费用
					params.id = this.id
					netEditCost(params).then(res=>{
						uni.setStorageSync('editCostFlag',true)
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
				}else{
					//添加费用
					netAddCost(params).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						//添加成功之后的  费用id、
						
						let ids = uni.getStorageSync('costid') ? uni.getStorageSync('costid') : []
						if(ids.length != 0) {
							ids.push(res.data.id)
						}else{
							ids = [ res.data.id ]
						}
						uni.setStorageSync('costid',ids)
						uni.setStorageSync('editCostFlag',true)
						this.$store.commit('SETCOSTlIST',[])
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					})
				}
				
			},
			//添加费用
			addCost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/expDetail'
				})
			},
			//编辑费用
			toEditfree(index) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/expDetail?index='+index
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
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			.icon-jiahaocu{
				font-size:28rpx;
				color:$uni-text-color;
				margin-right:5rpx;
			}
		}
	}
	.cost_warp{
		flex:1;
		.cost_li{
			padding:24rpx 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom:1rpx solid #EDEDED;
			.li_left{
				margin-right:24rpx;
				flex-shrink: 0;
				flex-shrink: 0;
				.icon-jian{
					font-size:35rpx;
					color:#ff7800;
				}
			}
			.cost_info{
				flex:1;
				.info_title{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name{
						font-size:26rpx;
						color:#333;
					}
					.time{
						font-size:24rpx;
						color:#666;
					}
				}
				.li_warp{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top:15rpx;
					.li_warp_left{
						font-size:26rpx;
						color:#333;
						margin-right:24rpx;
						span{
							font-size:24rpx;
							color:#666;
						}
					}
				}
			}
		}
		.total_warp{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top:24rpx;
			.total_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.total_h{
					font-size:28rpx;
					color:#000000;
				}
				.total_p{
					margin-left:20rpx;
					font-size:26rpx;
					color:#666;
					span{
						font-size:28rpx;
						color:#333;
					}
				}
			}
			.total_right{
				font-size:26rpx;
				color:#0287FF;
				width:120rpx;
				height:40rpx;
				border-radius: 20rpx;
				text-align: center;
				line-height: 38rpx;
				border:1rpx solid #0287FF;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		margin-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			text {
				color: #f00;
			}
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 20rpx;
			padding:24rpx;
			box-sizing: border-box;
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
			&:nth-child(4n){
				margin-right:0;
			}
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
