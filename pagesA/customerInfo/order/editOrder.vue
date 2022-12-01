<template>
	<view>
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户名称<span>*</span></view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="customerinfo ? 'valueActive' : '' ">{{customerinfo ? customerinfo.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title key">关联商机</view>
			<view class="form_right" @click="changeBusiness">
				<view :class="businessObj.id ? 'valueActive' : '' ">{{businessObj.id ? businessObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户签约人<span>*</span></view>
			<picker @change="changeContact" :range="contactList" :value="contactIndex" :range-key="'name'">
				<view class="form_right">
					<view :class="contactList[contactIndex] ? 'valueActive' : '' ">
						{{contactList[contactIndex] ? contactList[contactIndex].name : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">公司签约人<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<form-item 
			v-if="listForm"
			:listForm="listForm"
			:isNotRequired="isRequired"
			@changeData="changeOtherData"
		></form-item>
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title key">购买产品</view>
			<view class="add_in" @click="addPart">
				<view class="iconfont icon-jiahaocu"></view>
				添加产品
			</view>
		</view>
		<view class="pro_warp" v-if="productList.length != 0 && !isRequired">
			<view class="li_warp" v-for="(item,index) in productList" :key="index">
				<view class="cell_con">
					<view class="cell_con_top">
						<view class="contitle">{{item.name}}</view>
						<image :src="BASE_IMG_URL+'/index/delete.png'" @click="delProduct(index)" class="deleimg"></image>
					</view>
					<view class="conbot">
						<view class="conleft">
							<view class="context">编码：{{item.num}}</view>
							<view class="context">单位：{{item.unit}}</view>
							<view class="conmoney">
								零售价：￥ <input type="digit" class="priceinput" @blur="(e)=>{changeProductPrice(e,index)}" v-model="item.price" placeholder="请输入零售价">
							</view>
							<view class="conmoney">
								批发价：￥ <input type="digit" class="priceinput" v-model="item.wholesale" placeholder="请输入批发价">
							</view>
						</view>
						<view class="conright">
							<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title key">回款计划</view>
			<view class="add_in" @click="addCollection" v-if="collecList.length < 10">
				<view class="iconfont icon-jiahaocu"></view>
				添加回款计划
			</view>
		</view>
		<view class="coll_warp" v-if="!isRequired">
			<view class="coll_header">
				<view class="coll_li" style="width:160rpx"></view>
				<view class="coll_li">金额</view>
				<view class="coll_li">时间</view>
			</view>
			<view class="coll_header" v-for="(item,index) in collecList" :key="index">
				<view class="coll_li" style="width:160rpx">
					<view class="iconfont icon-jian" @click="delCost(index)"></view>
					{{numArr[index]}}期
				</view>
				<view class="coll_li">
					<input type="text" adjust-position v-model="item.money" class="coll_input" placeholder="请输入金额">
				</view>
				<view class="coll_li">
					<picker @change="(e)=>{changeColltime(e,index)}" mode="date">
						<view class="uni-input">{{item.time ? item.time : '回款时间'}}</view>
					</picker>
				</view>
			</view>
		</view>
		<!-- 分配业绩 -->
		<view class="inp_warp" v-if="customerTeam.length != 1 && customerTeam.length != 0 && methodArr.length != 0 && !isRequired">
			<view>业绩分配方式</view>
			<picker @change="changeMethod" :value="methodIndex" :range="methodArr" :range-key="'name'">
				<view class="form_right">
					<view :class="methodArr[methodIndex] ? 'valueActive' : '' ">
						{{methodArr[methodIndex] ? methodArr[methodIndex].name : '点击选择'}}</view>
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</picker>
		</view>
		<view class="ach_list" v-if="distributionArr.length != 0 && !isRequired">
			<image :src="BASE_IMG_URL+'/delete1.png'" @click="delDistribution" class="deleimg" mode=""></image>
			<view class="ach_li" v-for="(item,index) in distributionArr" :key="index">
				<view class="ach_rate">
					业绩占比<span>({{item.name}}%)</span>
				</view>
				<view class="ach_staff" v-if="!item.staff.id">
					<image :src="BASE_IMG_URL+'/addfile.png'"  @click="selectTeam(index)" class="uploadimg"></image>
					<view class="ach_t">选择成员</view>
				</view>
				<view class="ach_staff" v-else>
					<view class="delStaff" @click="delDisStaff(index)">×</view>
					<image :src="item.staff.img?item.staff.img:BASE_IMG_URL+'/headImg.png'" style="border-radius: 50%;" class="uploadimg"></image>
					<view class="ach_t">{{item.staff.name}}</view>
				</view>
			</view>
		</view>
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 审核信息 -->
		<examine-people v-if="approvalPro.status == 0" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(createOrder)">提交</view>
		<view class="botsec"></view>
		<!-- 添加产品 -->
		<popup-list ref="productChild" @selectList="selectList"></popup-list>
		<!-- 选择团队成员 -->
		<select-team-members ref="teamChild" @sureTeam="sureTeam"></select-team-members>
		<!-- 选择商机 -->
		<select-business ref="businessChild" @sureBusiness="sureBusiness"></select-business>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem'
	import popupList from '@/components/selectProduct/index'
	import selectTeamMembers from '@/components/selectTeammembers.vue'
	import selectBusiness from '@/components/selectBusiness.vue'
	import { netSetForm, netPrevCustomer, netLianxiren, netCreateContract,
	netAutoOrderNumber, netEditContract,  netQuotationDetail, netTeamList, netDistributionType, netApprovalProcess, netContractDetail } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	import { checkStartEnd } from '@/utils/util.js'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	
	export default{
		mixins:[commonFun],
		components:{
			formItem,
			popupList,
			selectTeamMembers,
			selectBusiness
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				//审核人
				remindPeople:[],
				examineType:'contract',
				listForm:null,   //表单
				customer_id:'',   //客户id
				contactList:[],  //客户签约人
				contactIndex:0,
				//选择产品
				productList:[],
				type:1,  //1创建合同   2转为合同     3编辑合同
				quoteid:'',  //报价单id   报价转合同时
				collecList:[],   //回款期数
				numArr:['一','二','三','四','五','六','七','八','九','十'],
				plan_numer:'',  //回款总期数
				//支付方式
				payment:'',   
				payTypelist:['全款发货','五五','三六一','三七','其他'],
				payTypeIndex:0,
				approvalPro:{},   //审批流程
				//客户团队
				customerTeam:[],
				//业绩分配 配置
				methodArr:['五五','三六一','三七'],
				methodIndex:null,
				distributionArr:[],
				distributionIndex:null,
				id:'',  //合同id
				businessObj:{},  //商机
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
			staffObj: state => state.customer.staffObj,   //关联员工
		}),
		watch:{
			customerinfo(info){
				if(info) {
					this.customer_id = info.id
					//获取联系人
					this.getLianxiren()
					//获取客户的团队
					this.getTeamNum()
				}
			},
		},
		onUnload() {
			this.$store.commit('CUSTOMEROBJ',null)
		},
		onLoad(options) {
			this.type = options.type
			this.id = options.contractid
			if(this.type == 1) {
				uni.setNavigationBarTitle({
					title:'编辑合同'
				})
			}else if(this.type == 2){
				this.quoteid = options.quoteid
				uni.setNavigationBarTitle({
					title:'复制合同'
				})
			}
			this.listForm = []
			this.init()
			//获取审批流程
			this.getProcess()
			//获取 分配方式
			this.getdisType()
		},
		onShow() {
			if(this.approvalPro.status == 0){
				//获取  默认需要提醒的人
				this.getDefaultRemind()
			}
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			//选择关联的商机
			changeBusiness() {
				if(this.customer_id){
					this.$refs.businessChild.init(this.customer_id)
				}else{
					uni.showToast({
						title:'请先选择客户',
						icon:'none'
					})
				}
			},
			sureBusiness(obj) {
				this.businessObj = obj
			},
			//审批流程
			getProcess() {
				netApprovalProcess({type:'contract'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						//获取  默认需要提醒的人
						this.getDefaultRemind()
					}
				})
			},
			init() {
				if(this.type == 1){
					Promise.all([this.getForm(),this.getDetail()]).then((res) => {});
				}else if(this.type == 2) {
					Promise.all([this.getForm(),this.getOrdersn(),this.getDetail()]).then((res) => {});
				}
			},
			//获取合同详情
			getDetail() {
				netContractDetail({id:this.id}).then(res=>{
					res = res.data
					this.$store.commit('CUSTOMEROBJ',res.customer)
					//获取客户签约人
					//处理默认联系人
					this.handleLink(res.contacts)
					//公司签约人
					this.$store.commit('STAFFOBJ',res.order_staff)
					//商机
					this.businessObj = res.business?res.business:{}
					//处理产品
					let arr = res.product
					arr.forEach(ele=>{
						this.productList.push({
							id:ele.product_id,
							number:ele.number,
							name:ele.name,
							price:ele.price,
							unit:ele.unit,
							wholesale:ele.wholesale,
							img:ele.img,
							num:ele.num
						})
					})
					this.collecList = res.plan?res.plan:[]
					//处理表单
					let formarr = this.listForm
					formarr.forEach(ele=>{
						ele.value = res[ele.id]
					})
					this.listForm = formarr
				})
			},
			//获取客户团队
			getTeamNum(){
				let params = {id:this.customer_id}
				netTeamList(params).then(res=>{
					this.customerTeam = res.data
				})
			},
			//获取业绩分配方式
			getdisType() {
				netDistributionType().then(res=>{
					this.methodArr = res.data
				})
			},
			//业绩分配方式
			changeMethod(e) {
				this.methodIndex = e.detail.value
				let arr = this.methodArr[this.methodIndex].ratio
				this.distributionArr = []
				arr.forEach(ele=>{
					this.distributionArr.push({
						name:ele.ratio,
						staff:{}
					})
				})
			},
			//删除业绩分配方式
			delDistribution() {
				this.distributionArr = []
				this.methodIndex = null
			},
			//删除已经选择好的 团队成员
			delDisStaff(index) {
				let obj = this.distributionArr[index]
				obj.staff = {}
				this.$set(this.distributionArr,index,obj)
			},
			//选择团队成员
			selectTeam(index) {
				if(!this.customer_id){
					uni.showToast({
						title:'请先选择客户',
						icon:'none'
					})
					return
				}
				this.distributionIndex = index
				this.$refs.teamChild.init(this.customer_id)
			},
			sureTeam(obj) {
				console.log(obj,'选择')
				let a = this.distributionArr[this.distributionIndex]
				a.staff = obj
				this.$set(this.distributionArr,this.distributionIndex,a)
				console.log(this.distributionArr,'数据')
			},
			//获取 默认的 订单编号
			getOrdersn() {
				netAutoOrderNumber().then(res=>{
					this.num = res.data.number
					let formArr = this.listForm
					formArr.forEach((ele,index)=>{
						if(ele.id == 'num'){
							ele.value = this.num
							this.$set(this.listForm,index,ele)
						}
					})
				})
			},
			//获取 报价单 详情\
			getQuoteDetail() {
				netQuotationDetail({id:this.quoteid}).then(res=>{
					res = res.data
					//处理 产品信息
					this.handleProduct(res.product)
					//计算价格
					this.handleTotalMoney()
					//处理默认联系人
					this.handleLink(res.contacts)
				})
			},
			handleLink(obj){
				let arr = this.contactList
				arr.forEach((ele,index)=>{
					if(ele.id == obj.id){
						this.contactIndex = index
					}
				})
			},
			handleProduct(data) {
				let arr = []
				data.forEach(ele=>{
					arr.push({
						id: ele.product_id,
						name: ele.name,
						num: ele.num,
						number: ele.number,
						price: ele.price,
						wholesale: ele.wholesale,
						quote_id: ele.quote_id,
						unit: ele.unit,
					})
				})
				this.productList = arr
				
			},
			//表单 value  修改
			changeOtherData(name,value,obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			//获取 表单
			getForm() {
				netSetForm({type:'contract'}).then(res=>{
					if(res.data){
						res = res.data.data
						res.forEach(ele=>{
							ele.value = ''
						})
						this.listForm = res
						if(this.customer_id){
							//获取默认的客户
							this.getDefaultCustomer()
						}
					}
				})
			},
			//默认客户
			getDefaultCustomer () {
				netPrevCustomer({id:this.customer_id}).then(res=>{
					this.$store.commit('CUSTOMEROBJ',res.data.data[0])
				})
			},
			//获取客户 签约 人
			getLianxiren() {
				let params = {
					customer_id: this.customer_id
				}
				netLianxiren(params).then(res=>{
					if(res.data.length == 0) {
						uni.showToast({
							title:'请先添加联系人',
							icon:'none'
						})
						return
					}
					this.contactList = res.data
				})
			},
			handlePlan(index) {
				let str = this.payTypelist[index]
				if(str == '全款发货'){
					this.collecList = [{money: this.money ,time:''}]
				}else if(str == '五五'){
					let money = (this.money/2).toFixed(2)
					this.collecList = [
						{money: money ,time:''},
						{money: money ,time:''}
					]
				}else if(str == '三六一'){
					let oneMoney = (this.money * 0.3).toFixed(2)
					let twoMoney = (this.money * 0.6).toFixed(2)
					let thrMoney = (this.money - (Number(oneMoney) + Number(twoMoney))).toFixed(2)
					this.collecList = [
						{money: oneMoney ,time:''},
						{money: twoMoney ,time:''},
						{money: thrMoney ,time:''}
					]
				}else if(str == '三七') {
					let oneMoney = (this.money * 0.3).toFixed(2)
					let twoMoney = (this.money - Number(oneMoney)).toFixed(2)
					this.collecList = [
						{money: oneMoney ,time:''},
						{money: twoMoney ,time:''}
					]
				}
			},
			//客户签约人
			changeContact(e) {
				this.contactIndex = e.detail.value
			},
			//更多
			moreClick() {
				uni.navigateTo({
					url: '/pages/selectMember/selectMember'
				})
			},
			
			//添加产品
			addPart() {
				this.$refs.productChild.init()
			},
			//选择产品
			selectList(arr) {
				arr.forEach(ele=>{
					ele.type = '标准'
				})
				this.productList = this.deWeight(arr.concat(this.productList))
				this.handleTotalMoney()
			},
			deWeight(arr) {
			    for (var i = 0; i < arr.length - 1; i++) {
			        for (var j = i + 1; j < arr.length; j++) {
			            if (arr[i].id == arr[j].id) {
			                arr.splice(j, 1);
			                j--;
			            }
			        }
			    }
			    return arr;
			},
			handleTotalMoney() {
				let arr = this.productList
				let money = 0
				arr.forEach(ele=>{
					money += Number(ele.number*Number(ele.price))
				})
				//表单里 合同金额赋值
				let formArr = this.listForm
				formArr.forEach((ele,index)=>{
					if(ele.id == 'money'){
						ele.value = money
						this.$set(this.listForm,index,ele)
					}
				})
			},
			//修改产品价格
			changeProductPrice(e,index) {
				let money = e.detail.value
				let obj = this.productList[index]
				obj.price = money
				this.$set(this.productList,index,obj)
				this.handleTotalMoney()
			},
			changeNumber(e,index){
				let obj = this.productList[index]
				obj.number = e
				this.$set(this.productList,index,obj)
				this.handleTotalMoney()
			},
			delProduct(index) {
				this.productList.splice(index,1)
				this.handleTotalMoney()
			},
			//回款基数
			addCollection() {
				this.collecList.push({money:'',time:''})
			},
			changeColltime(e,index) {
				let obj = this.collecList[index]
				obj.time = e.detail.value
				this.$set(this.collecList,index,obj)
			},
			delCost(index) {
				this.collecList.splice(index,1)
			},
			//提交
			createOrder() {
				let {
					customer_id,
					remindPeople,
					listForm,
					selectCustomerObj,  //默认的客户信息
					contactList,  //客户签约人
					contactIndex,
					productList,
				} = this
				if(!customer_id){
					uni.showToast({
						title:'请选择客户',
						icon:'none'
					})
					return
				}
				if(!contactList[contactIndex]){
					uni.showToast({
						title:'请选择客户签约人',
						icon:'none'
					})
					return
				}
				if(!this.staffObj){
					uni.showToast({
						title:'请选择公司签约人',
						icon:'none'
					})
					return
				}
				let product = []
				productList.forEach(ele=>{
					product.push({
						price:ele.price,
						wholesale:ele.wholesale,
						number:ele.number,
						product_id:ele.id,
					})
				})
				if(remindPeople.length == 0 && this.approvalPro.status == 0) {
					uni.showToast({
						title:'请选择审核人',
						icon:'none'
					})
					return
				}
				let arr = []
				remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				let flow_staff_ids = arr.join(',')
				
				let params = this.checkCommonForm(this.listForm)
				if(!params){
					return
				}
				//回款计划
				let planlist = this.collecList
				let flag = false
				planlist.forEach(ele=>{
					if(ele.money == '' || ele.time == ''){
						flag = true
					}
				})
				if(planlist.length >= 0 && flag){
					uni.showToast({
						title:'请完善回款金额/时间',
						icon:'none'
					})
					return
				}
				//判断 回款金额是否大于  订单金额
				// let collection_money = 0
				// planlist.forEach(ele=>{
				// 	collection_money += Number(ele.money)
				// })
				// collection_money = collection_money.toFixed(2)
				// money = Number(money).toFixed(2)
				// console.log(collection_money,money,'金额')
				// if(collection_money > money){
				// 	uni.showToast({
				// 		title:'回款金额不能大于订单金额',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				//业绩比例
				let ratios = []
				let ach_flag = false
				this.distributionArr.forEach(item=>{
					if(item.staff && item.staff.id){
						ratios.push({
							ratio:item.name,
							staff_id:item.staff.id
						})
					}else{
						ach_flag = true
					}
				})
				if(ach_flag){
					uni.showToast({
						title:'请选择业绩分配的成员',
						icon:'none'
					})
					return
				}
				
				planlist.forEach((ele,index) => {
					ele.name = this.numArr[index]+'期'
				})
				params = Object.assign({},params,{
					order_staff_id:this.staffObj.id,
					customer_id,
					contacts_id:contactList[contactIndex].id,
					flow_staff_ids:this.approvalPro.status == 0 ? flow_staff_ids : '',
					product,
					quote_id:this.type == 2 ? this.quoteid : '',
					plan:planlist,
					plan_numer:planlist.length,
					payment:this.payTypelist[this.payTypeIndex],
					ratios,
				})
				if(this.type == 1) {
					//编辑合同
					params.id = this.id
					this.editContract(params)
				}else if(this.type == 2) {
					//复制合同
					this.copyContract(params)
				}
			},
			editContract(params) {
				netEditContract(params).then(res=>{
					uni.showToast({
					    title: res.msg,
						icon:'none',
					    duration: 2000
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			},
			copyContract(params) {
				netCreateContract(params).then(res=>{
					uni.showToast({
					    title: res.msg,
						icon:'none',
					    duration: 2000
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
	// 业绩分配
	.ach_list{
		background:#fff;
		padding:30rpx;
		border-bottom:1rpx solid #f5f5f5;
		position: relative;
		.deleimg{
			position: absolute;
			right:30rpx;
			top:30rpx;
			width:44rpx;
			height:44rpx;
		}
		.ach_li{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-bottom:24rpx;
			margin-bottom:24rpx;
			border-bottom:1rpx solid #f5f5f5;
			&:last-child{
				border-bottom:0;
				margin-bottom:0;
			}
			.ach_rate{
				font-size:24rpx;
				color:#666;
				margin-right:30rpx;
				span{
					color:$uni-text-color;
				}
			}
			.ach_staff{
				display: flex;
				flex-direction: column;
				text-align: center;
				position: relative;
				.delStaff{
					position: absolute;
					right:-10rpx;
					top:-10rpx;
					width:35rpx;
					height:35rpx;
					border:1rpx solid #999;
					font-size:24rpx;
					color:#666;
					text-align: center;
					line-height: 32rpx;
					border-radius: 50%;
					background:rgba(0,0,0,0.3);
				}
				.uploadimg{
					width:80rpx;
					height:80rpx;
				}
				.staffinfo{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:24rpx;
					color:#666;
					.staffimg{
						width:80rpx;
						height:80rpx;
						border-radius: 50%;
						margin-right:24rpx;
					}
				}
				.ach_t{
					font-size:24rpx;
					color:#666;
					margin-top:10rpx;
				}
			}
		}
	}
	.radiowarp{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		radio{
			transform: scale(0.7);
		}
	}
	.test_top{
		width:100%;
		height:60rpx;
		background:$uni-bg-opacity;
		.tip{
			font-size:26rpx;
			color:$uni-text-color;
			padding-left:60rpx;
			line-height: 60rpx;
			position: relative;
			&::before{
				content:'';
				width:20rpx;
				height:35rpx;
				border-radius: 10rpx;
				background:$uni-text-color;
				position: absolute;
				left:30rpx;
				top:15rpx;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #f5f5f5;
		.area_head {
			font-size: 26rpx;
			color: #666;
			margin-bottom:15rpx;
		}
		.area_text{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			font-size:24rpx;
			color:#333;
			input{
				width:140rpx;
				height:60rpx;
				font-size:24rpx;
				color:#333;
				text-align: center;
				background:rgba(202, 202, 202, 0.2);
			}
			>view{
				flex-shrink: 0;
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
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color:#666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			.rightinput{
				font-size:24rpx;
				width:100%;
				text-align: right;
			}
			.right_btn{
				font-size:24rpx;
				color:$uni-text-color;
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
	.pro_warp{
		padding:30rpx 24rpx 0;
		background:#fff;
		.li_warp{
			padding-bottom:24rpx;
			margin-bottom:24rpx;
			border-bottom:1rpx solid #EDEDED;
			&:last-child{
				margin-bottom:0;
			}
			.cell_con{
				padding:0 40rpx;
				.cell_con_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.contitle{
						font-size:28rpx;
						color:#333;
					}
					.deleimg{
						width:44rpx;
						height:44rpx;
					}
				}
				.context{
					font-size:26rpx;
					color:#666;
					margin-top:10rpx;
				}
				.conbot{
					margin-top:10rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.conleft{
						.conmoney{
							font-size:26rpx;
							color:#333;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							margin-bottom:15rpx;
							.priceinput{
								width:180rpx;
								height:60rpx;
								background:rgba(202, 202, 202, 0.2);
								text-align: center;
							}
						}
					}
				}
			}
			.right_del_btn{
				width:90rpx;
				height:240rpx;
				background:#F00;
				color:#fff;
				text-align: center;
				line-height: 224rpx;
			}
		}
		.total_money{
			text-align: right;
			font-size:26rpx;
			span{
				font-size:26rpx;
				color:#F00;
			}
		}
	}
	.coll_warp{
		padding:24rpx 45rpx;
		.coll_header{
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom:1rpx solid #EDEDED;
			padding:24rpx 0;
			.coll_li{
				width:200rpx;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
				.icon-jian{
					font-size:35rpx;
					color:#ff7800;
					margin-right:15rpx;
				}
				.coll_input{
					width:200rpx;
					text-align: center;
					font-size:24rpx;
					color:#333;
				}
				.uni-input{
					width:200rpx;
					font-size:24rpx;
					color:#333;
				}
			}
		}
	}
</style>
