<template>
	<view>
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="fllow_form">
			<view class="key">工单编号<span>*</span></view>
			<view class="form_right">
				<view :class="workorder_number ? 'valueActive' : '' ">{{workorder_number ?workorder_number : ''}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">工单标题<span>*</span></view>
			<view class="form_right">
				<input type="text" style="width:350rpx" placeholder-style="color:#999;font-size:24rpx;" :class="title ? 'valueActive' : '' "  v-model="title" placeholder="填写工单标题" />
				<view class="color_bg toselect" @click="toSelectTitle">选择标题</view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">客户<span>*</span></view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="customerObj ? 'valueActive' : '' ">{{customerObj ? customerObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">客户联系人<span>*</span></view>
			<picker @change="changeContacts"  :value="contactsIndex" :range="contactsList" :range-key="'name'">
				<view class="form_right">
					<view :class="contactsList[contactsIndex] ? 'valueActive' : '' ">{{contactsList[contactsIndex] ? contactsList[contactsIndex].name : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_form">
			<view class="key">客户地址<span>*</span></view>
			<view class="form_right" @click="chooseAddress">
				<view :class="address ? 'valueActive' : '' ">{{address ? address : '请选择地址'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head key">详细地址<span>*</span></view>
			<textarea 
				v-model="address_detail" 
				:class="address_detail ? 'valueActive' : '' " 
				class="textself" 
				style="height:150rpx;"
				placeholder="填写详细地址" 
				placeholder-style="color:#999"
			/>
		</view>
		
		<view class="inp_warp">
			<view class="inp_title key">维修产品<span>*</span></view>
			<view class="add_in" @click="seProduct">
				<view class="iconfont icon-jiahaocu"></view>
				选择产品
			</view>
		</view>
		<view class="prolist" v-if="productList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in productList" :key="index">
					<view class="product_li">
						<view class="iconfont icon-jian" @click="delParts(index)"></view>
						<view class="protext">{{item.product.name}}</view>
						<view class="protext" >{{item.product.price}}</view>
					</view>
					<view class="part_li">
						<view class="partbox" v-for="(ele,eleindex) in item.parts" :key="eleindex" @click="toSelectPart(index,eleindex)">
							<radio value="r1" color="#008EFF" :checked="ele.is_select" />{{ele.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title key">需携带配件</view>
			<view class="add_in" @click="addParts">
				<view class="iconfont icon-jiahaocu"></view>
				选择配件
			</view>
		</view>
		<view class="prolist" v-if="partsList.length != 0 && !isRequired">
			<view class="probox">
				<view class="product_li" 
					style="padding:24rpx 0;border-bottom:1rpx solid #f5f5f5;" 
					v-for="(item,index) in partsList" 
					:key="index"
				>
					<view class="iconfont icon-jian" @click="delProductParts(index)"></view>
					<view class="protext" style="text-align: center;width:160rpx">{{item.name}}</view>
					<view>
						<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
					</view>
				</view>
			</view>
		</view>
		
		<view class="fllow_area" v-if="!isRequired">
			<view class="area_head">情况说明</view>
			<textarea v-model="desc" class="textself" placeholder="情况说明" placeholder-style="color:#999" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key" >开始时间<span>*</span></view>
			<view class="form_right">
				<select-time-picker
					:disabled="false" 
					placeholder="选择开始时间" 
					:defaultValue="start_time"
					fields="minute"
					@change="changeNewStartTime"
					v-if="start_time"
				></select-time-picker>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title key" >预计结束时间</view>
			<view class="form_right">
				<select-time-picker
					:disabled="false" 
					placeholder="选择结束时间" 
					:start="limit_time"
					:defaultValue="end_time"
					fields="minute"
					v-if="limit_time"
					@change="changeNewEndTime"
				></select-time-picker>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">紧急程度<span>*</span></view>
			<picker @change="changeCritical" :range="critical_list" :value="criticalIndex" :range-key="'name'">
				<view class="form_right">
					<view :class="critical_list[criticalIndex] ? 'valueActive' : '' ">
						{{critical_list[criticalIndex] ? critical_list[criticalIndex].name : '选择紧要程度'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title">提醒</view>
			<picker @change="changeRemind" :range="remindList" :value="remindIndex">
				<view class="form_right">
					<view :class="remindList[remindIndex] ? 'valueActive' : '' ">
						{{remindList[remindIndex] ? remindList[remindIndex] : '选择提醒时间'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_form">
			<view class="key">指派员工<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_form" v-if="!isRequired">
			<view class="key">过保类型</view>
			<view class="form_right">
				<radio-group class="radiowarp" @change="changeOver">
					<view class="">
						<radio value="1" color="#008EFF" :checked="is_over == 1" />过保
					</view>
					<view class="">
						<radio value="2" color="#008EFF" :checked="is_over == 2" />未过保
					</view>
				</radio-group>
			</view>
		</view>
		<view class="fllow_area" v-if="!isRequired">
			<view class="fllo_list">
				<view class="area_head">计划备注:</view>
				<view class="list_text" @click="toRemarksTemp">选择模板</view>
			</view>
			<textarea v-model="remarks" maxlength="-1" :class="remarks ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<upload-img :imgList="imgList" v-if="!isRequired" :flag="false" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="button" @click="$noMultipleClicks(toAddVisit)">确定</view>
		<view class="botsec"></view>
		
		<!-- 选择产品 -->
		<select-work-product 
			:customerinfo="customerObj"  
			ref="workProduct" 
			@selectList="selectProduct"
		></select-work-product>
		
		<!-- 选择配件 -->
		<select-work-parts
			ref="partsChild" 
			@selectList="selectParts"
		></select-work-parts>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	import { netWorkOrderNumber, netLianxiren, netCustomerAddress, 
	netAddWorkOrder, netCustomerContractInfo, netPrevCustomer, netAddVisitplant, netWorkOrderDetail } from '@/api/api.js'
	import selectWorkProduct from '@/components/selectWorkProduct/index'
	import { commonFun } from '@/common/navigate.js'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	import selectWorkParts from '@/components/selectWorkParts/index'
	
	export default{
		mixins:[commonFun],
		components:{
			selectTimePicker,
			selectWorkProduct,
			selectWorkParts
		},
		data() {
			return{
				noClick:true,   //防止重复点击
				critical_list:[    //紧要程度
					{ id:0, name:'普通'},
					{ id:1, name:'重要'},
					{ id:2, name:'紧急'},
					{ id:4, name:'重要且紧急'},
				],
				criticalIndex:0,
				workorder_number:'',  //工单编号 自动生成
				title:'',  //工单标题
				contactsList:[],
				contactsIndex:null,
				address:'',  //省市区 （从客户地址接口获取）
				address_detail:'',   //详细地址
				lng:'',
				lat:'',
				productList:[],
				desc:'',
				start_time:'',
				end_time:'',
				limit_time:'',
				priarr:['一般','紧急','非常紧急'],
				priIndex:0,
				imgList:[],
				is_over:1,
				remindList:['准时提醒','5分钟前','15分钟前','30分钟前','一个小时前','两个小时前','一天前','两天前','一周前'],
				remindIndex:1,
				remarks:'',
				workorderid:'',  //电话售后工单 未解决  需要创建上门维修工单   工单id
				//上门维修 需要携带的配件
				partsList:[],
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
			staffObj: state => state.customer.staffObj,
			problemParent: state => state.customer.problemParent,
			problemList: state => state.customer.problemList,
			templateRemark: state => state.template.visit_plan_remarks,   //备注
			workorderTitle: state => state.template.workorder_title,    //工单标题
		}),
		watch:{
			customerObj(newobj,oldobj){
				if(newobj){
					//获取 客户联系人
					this.getCustomerLink()
					//获取 客户 地址
					this.getCustomerInfo()
				}
			},
			workorderTitle(val) {
				this.title += val
			}
		},
		onLoad(options) {
			this.$store.commit('CUSTOMEROBJ',null)
			if(options.id) {
				this.workorderid = options.id
				//获取工单详情  的产品信息
				this.getDetail()
			}
			//当前时间
			let arr = getNewDateArry()
			this.limit_time = `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}`
			this.start_time = `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}`
			
			this.getNumber()
		},
		onShow() {
			if(this.templateRemark) {
				this.remarks += this.templateRemark
			}
		},
		onHide() {
			this.$refs.workProduct.closePopup()
			this.$refs.partsChild.closePopup()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			////////////////////////////////////////////////////////////////////////
			//去选择配件
			addParts() {
				this.$refs.partsChild.init()
			},
			selectParts(arr) {
				arr.forEach(ele=>{
					ele.number = 1
				})
				let data = this.partsList.concat(arr)
				this.partsList = this.deWeight(data)
			},
			//删除 配件
			delProductParts(index) {
				this.partsList.splice(index,1)
			},
			//修改 配件 数量
			changeNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e
				this.$set(this.partsList,index,obj)
			},
			/////////////////////////////////////////////////////////////////////////
			//去选择 工单标题
			toSelectTitle() {
				uni.navigateTo({
					url:'/pagesA/afterSales/install_workorder/title_template'
				})
			},
			//工单详情
			getDetail(){
				netWorkOrderDetail({id:this.workorderid}).then(res=>{
					this.productList = res.data.product_part
					this.$store.commit('CUSTOMEROBJ',res.data.customer)
				})
			},
			//去选择  备注 模版
			toRemarksTemp() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/needTemplate?type=任务备注'
				})
			},
			getNumber() {
				netWorkOrderNumber().then(res=>{
					this.workorder_number = res.data.number
				})
			},
			//选择 问题类型
			toSelectProblem() {
				this.$store.commit('VISIT_PLAN_REMARKS','')
				uni.navigateTo({
					url: '/pages/index/orderSettlement/problem_type'
				})
			},
			//删除  问题类型
			delProblem(index) {
				this.problemList.splice(index,1)
				console.log(this.problemList,'------')
				this.$store.commit('SETPROBLEMLIST',this.problemList)
			},
			//获取 客户 联系人
			getCustomerLink() {
				netLianxiren({customer_id:this.customerObj.id}).then(res=>{
					this.contactsList = res.data
					this.contactsIndex = 0
				})
			},
			//选择客户 联系人
			changeContacts(e) {
				this.contactsIndex = e.detail.value
			},
			//获取 客户 地址
			getCustomerInfo() {
				netCustomerAddress({customer_id:this.customerObj.id}).then(res=>{
					this.address = res.data.address
					this.address_detail = res.data.address_detail
					this.lat = res.data.lat
					this.lng = res.data.lng
				})
			},
			//去选择客户 地址
			chooseAddress() {
				if(this.address){
					uni.chooseLocation({
						success: res => {
						    console.log(res,'地址选择成功')
							 
							this.lat = res.latitude
							this.lng = res.longitude
							this.address = res.address
							this.address_detail = res.name
						},
						fail: err => {
							if(err.errMsg == 'chooseLocation:fail auth deny'){
								uni.showToast({
									title:'请允许使用位置信息',
									icon:'none'
								})
							}
						}
					})
				}else{
					uni.chooseLocation({
						success: res => {
						    console.log(res,'地址选择成功')
							 
							this.lat = res.latitude
							this.lng = res.longitude
							this.address = res.address
							this.address_detail = res.name
						},
						fail: err => {
							if(err.errMsg == 'chooseLocation:fail auth deny'){
								uni.showToast({
									title:'请允许使用位置信息',
									icon:'none'
								})
							}
						}
					})
				}
				
			},
			//选择 产品
			seProduct() {
				if(this.customerObj){
					this.$refs.workProduct.init(this.customerObj.id,3)
				}else{
					uni.showToast({
						title:'请先选择客户',
						icon:'none'
					})
				}
			},
			selectProduct(arr) {
				let data = arr.concat(this.productList)
				this.productList = this.deWeight(data)
			},
			delProduct(index) {
				this.productList.splice(index,1)
			},
			//选择配件
			toSelectPart(index,partindex) {
				let obj = this.productList[index]
				obj.parts[partindex].is_select = !obj.parts[partindex].is_select
				this.$set(this.productList,index,obj)
			},
			delParts(index) {
				this.productList.splice(index,1)
			},
			//新组建   开始时间
			changeNewStartTime(dt) {
				this.start_time = dt.f3
				this.limit_time = ''
				this.end_time = ''
				setTimeout(()=>{
					let Y = dt.YYYY
					let M = dt.M
					let D = dt.D
					let h = Number(dt.h) + 1
					if(h > 24){
						h = 1
						D = D + 1
					}
					this.limit_time = `${Y}-${M}-${D} ${h}:${dt.m}`
				},200)
			},
			changeNewEndTime(e) {
				this.end_time = e.f3
			},
			//紧要程度
			changeCritical(e) {
				this.criticalIndex = e.detail.value
			},
			//提醒时间
			changeRemind(e) {
				this.remindIndex = e.detail.value
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//是否过保
			changeOver(e) {
				this.is_over = e.detail.value
			},
			toAddVisit() {
				if(!this.title){
					uni.showToast({
						title:'请填写标题',
						icon:'none'
					})
					return
				}
				if(!this.customerObj){
					uni.showToast({
						title:'请选择关联客户',
						icon:'none'
					})
					return
				}
				if(!this.staffObj){
					uni.showToast({
						title:'请选择指派人',
						icon:'none'
					})
					return
				}
				//产品
				if(this.productList.length == 0) {
					uni.showToast({
						title:'请选择产品',
						icon:'none'
					})
					return
				}
				let arr = []
				let proar = []
				this.productList.forEach(ele=>{
					let p = []
					ele.parts.forEach(item=>{
						if(item.is_select){
							p.push(item.id)
						}
					})
					arr.push({
						customer_product_id:ele.id,
						parts_id:p.join(',')
					})
					proar.push(ele.id)
				})
				
				//附件
				let imgarr = []
				this.imgList.forEach(ele=>{
					imgarr.push(ele.id)
				})
				
				let params = {
					title:this.title,
					event_type:['售后服务','上门','上门维修'],
					relation_id:this.customerObj.id,   //关联客户
					level:this.critical_list[this.criticalIndex].id,   //紧要程度
					staff_id:this.staffObj ? this.staffObj.id : '',
					start_time:this.start_time,
					remindtype:this.remindIndex,
					contacts_id: this.contactsList[this.contactsIndex].id,
					address:this.address,
					address_detail:this.address_detail,
					lng:this.lng,
					lat:this.lat,
					file_ids:imgarr.join(','),
					appointment_time:this.end_time,
					is_over:this.is_over,
					customer_product_id:proar.join(','),
					product_part:arr,
					remarks:this.remarks,
					parts:this.partsList
				}
				netAddVisitplant(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.$store.commit('CUSTOMEROBJ',null)
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
	.fllo_list{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
			color:#666;
		}
		.list_text{
			font-size:26rpx;
			color:$uni-text-color;
		}
	}
	.radiowarp{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		radio{
			transform: scale(0.7);
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
	.que_list{
		border-bottom: 1rpx solid #EDEDED;
		padding:0 45rpx 0 50rpx;
		.que_li{
			background-color: #fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:24rpx 0;
			border-bottom: 1rpx solid #EDEDED;
			&:last-child{
				border-bottom:0;
			}
			.icon-jian{
				font-size:40rpx;
				color:#ff7800;
				margin-right:30rpx;
			}
			.que_title{
				font-size:24rpx;
				color:#333;
			}
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding:30rpx;
		.nameinput{
			width:500rpx;
		}
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
			.toselect{
				margin-left:15rpx;
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
				border-bottom:1rpx solid #EDEDED;
				&:last-child{
					border-bottom:0;
				}
				.part_li{
					padding:0 24rpx;
					display: flex;
					justify-content: flex-start;
					margin-top:24rpx;
					flex-wrap: wrap;
					.partbox{
						flex-shrink: 0;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						font-size:24rpx;
						color:#333;
						margin-right:24rpx;
						radio{
							transform: scale(0.7);
						}
					}
				}
			}
		}
	}
	.product_li{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.icon-jian{
			font-size:42rpx;
			color:#ff7800;
		}
		.protext{
			font-size:24rpx;
			color:#333;
			width:200rpx;
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
	}
	.fllow_area {
		background: #fff;
		padding:30rpx 40rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
			color:#666;
		}
		textarea {
			width: 660rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size:26rpx;
			background:rgba(202, 202, 202, 0.2);
		}
	}
	
</style>
