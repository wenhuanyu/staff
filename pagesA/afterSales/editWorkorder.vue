<template>
	<view>
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key">工单类型<span>*</span></view>
			<view class="form_right">
				<view class="valueActive">{{event_type}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联客户<span>*</span></view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="customerinfo ? 'valueActive' : '' ">
					{{customerinfo ? customerinfo.name : '选择关联客户'}}</view>
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
		<view class="fllow_form">
			<view class="key">详细地址<span>*</span></view>
			<view class="form_right" >
				<input type="text" :class="address_detail ? 'valueActive' : '' "  v-model="address_detail" placeholder="请填写详细地址 " />
			</view>
		</view>
		<view v-if="info.getevent">
			<view class="inp_warp">
				<view class="inp_title key">开始时间<span>*</span></view>
				<view class="form_right">
					<select-time-picker
						placeholder="选择开始时间" 
						:defaultValue="start_time"
						fields="minute"
						@change="changeNewStartTime"
					></select-time-picker>
					<view class="iconfont icon-you"></view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title key">预计结束时间<span>*</span></view>
				<view class="form_right">
					<select-time-picker
						placeholder="选择结束时间" 
						:start="limit_time"
						:defaultValue="end_time"
						fields="day"
						@change="changeNewEndTime"
						v-if="limit_time"
					></select-time-picker>
					<view v-else @click="toDone">选择结束时间</view>
					<view class="iconfont icon-you"></view>
				</view>
			</view>
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
		<view class="inp_warp" v-if="info.getevent">
			<view class="inp_title key">紧要程度<span>*</span></view>
			<picker @change="changeCritical" :range="critical_list" :value="criticalIndex" :range-key="'name'">
				<view class="form_right">
					<view :class="critical_list[criticalIndex] ? 'valueActive' : '' ">
						{{critical_list[criticalIndex] ? critical_list[criticalIndex].name : '选择紧要程度'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_form" v-else>
			<view class="key">紧急程度<span>*</span></view>
			<picker @change="changePriori"  :range="priarr" :value="priIndex">
				<view class="form_right">
					<view :class="priarr[priIndex] ? 'valueActive' : '' ">{{priarr[priIndex] ? priarr[priIndex] : '预约时间'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_form" >
			<view class="key">指派员工<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">产品<span>*</span></view>
			<view class="add_in" @click="seProduct">
				<view class="iconfont icon-jiahaocu"></view>
				添加产品
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
						<view class="partbox" v-for="(ele,eleindex) in item.parts" :key="eleindex" @click="toSelectPart(index,eleindex)"><radio value="r1" color="#ff7800" :checked="ele.is_select" />{{ele.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fllow_form" v-if="workorder_type == '上门维修'">
			<view class="key">过保类型<span>*</span></view>
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
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
		<view class="botsec"></view>
		<!-- 上门安装 上门维修 选择产品 -->
		<select-work-product ref="workProductTwo" :customerinfo="customerinfo" @selectList="selectProduct"></select-work-product>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	import { netWorkOrderDetail, netLianxiren, netCustomerAddress, netEditWorkorder } from '@/api/api.js'
	import selectWorkProduct from '@/components/selectWorkProduct/index'
	
	export default{
		mixins:[commonFun],
		components:{
			selectTimePicker,
			selectWorkProduct
		},
		data() {
			return{
				noClick:true,   //防止重复点击
				info:{},
				id:'',
				workorder_type:'',  //上门安装    上门维修
				event_type:'',
				title:'',
				start_time:'',
				end_time:'',
				limit_time:'',
				remindList:['准时提醒','5分钟前','15分钟前','30分钟前','一个小时前','两个小时前','一天前','两天前','一周前'],
				remindIndex:1,
				critical_list:[    //紧要程度
					{ id:0, name:'普通'},
					{ id:1, name:'重要'},
					{ id:2, name:'紧急'},
					{ id:4, name:'重要且紧急'},
				],
				criticalIndex:0,
				priarr:['一般','紧急','非常紧急'],
				priIndex:0,
				lat:'',
				lng:'',
				address:'',
				address_detail:'',
				contactsList:[],
				contactsIndex:0,
				productList:[],
				is_over:1,
				remarks:'',
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
			templateTitle: state => state.template.visit_plan_title,   //标题
			staffObj: state => state.customer.staffObj,
			templateRemark: state => state.template.visit_plan_remarks,   //备注
		}),
		watch:{
			templateTitle(newv,oldv){
				this.title = newv
			},
			customerinfo(newobj,oldobj){
				if(newobj){
					//获取 客户联系人
					this.getCustomerLink()
					//获取 客户 地址
					this.getCustomerInfo()
				}
			}
		},
		onShow() {
			if(this.templateRemark != '') {
				this.remarks += this.templateRemark
			}
		},
		onLoad(options) {
			this.id = options.id
			//获取工单详情
			this.getDetail()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			getDetail(){
				netWorkOrderDetail({id:this.id}).then(res=>{
					res = res.data
					this.info = res
					if(res.getevent){
						this.title = res.getevent.title
						this.event_type = res.getevent.event_type
						this.remindIndex = res.getevent.remindtype
						//处理紧要程度
						this.handleJinyao(res.getevent.level)
					}else{
						this.title = res.title
						this.event_type = res.workorder_type
						//处理紧急程度
						let str = res.priority
						this.priarr.forEach((ele,index)=>{
							if(str == ele){
								this.priIndex = index
							}
						})
					}
					
					this.$store.commit('CUSTOMEROBJ',res.customer)
					this.start_time = res.start_time
					this.limit_time = res.start_time
					this.end_time = res.appointment_time
					if(res.workorder_type == '上门安装'){
						this.productList = res.customer_product
					}else{
						this.productList = res.product_part
					}
					this.is_over = res.is_over
					this.workorder_type = res.workorder_type
					
					this.address = res.address
					this.address_detail = res.address_detail
					this.lat = res.lat
					this.lng = res.lng
					this.remarks = res.remarks?res.remarks:''
				})
			},
			handleJinyao(id) {
				this.critical_list.forEach((ele,index)=>{
					if(ele.id == id){
						this.criticalIndex = index
					}
				})
			},
			handleAnzhuangJinyao(str) {
				this.critical_list.forEach((ele,index)=>{
					if(ele.id == id){
						this.criticalIndex = index
					}
				})
			},
			//获取 客户 地址
			getCustomerInfo() {
				netCustomerAddress({customer_id:this.customerinfo.id}).then(res=>{
					this.address = res.data.address
					this.address_detail = res.data.address_detail
					this.lat = res.data.lat
					this.lng = res.data.lng
				})
			},
			//去选择 标题模版
			toTitleTemp(){
				this.$store.commit('VISIT_PLAN_REMARKS','')
				uni.navigateTo({
					url:'/pages/template/visitTitle'
				})
			},
			//新组建   开始时间
			changeNewStartTime(dt) {
				console.log(dt)
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
				this.end_time = e.f1
			},
			//提醒时间
			changeRemind(e) {
				this.remindIndex = e.detail.value
			},
			//紧要程度
			changeCritical(e) {
				this.criticalIndex = e.detail.value
			},
			//紧急程度
			changePriori(e) {
				this.priIndex = e.detail.value
			},
			//获取 客户 联系人
			getCustomerLink() {
				netLianxiren({customer_id:this.customerinfo.id}).then(res=>{
					this.contactsList = res.data
					this.contactsIndex = 0
				})
			},
			//选择客户 联系人
			changeContacts(e) {
				this.contactsIndex = e.detail.value
			},
			//选择 产品
			seProduct() {
				if(this.customerinfo){
					this.$store.commit('VISIT_PLAN_REMARKS','')
					this.$store.commit('VISIT_PLAN_TITLE','')
					
					this.$refs.workProductTwo.init(this.customerinfo.id,3)
					
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
			//是否过保
			changeOver(e) {
				this.is_over = e.detail.value
			},
			//去选择  备注 模版
			toRemarksTemp() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/needTemplate?type=任务备注'
				})
			},
			//去选择客户 地址
			chooseAddress() {
				uni.chooseLocation({
					success: res => {
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
			},
			sureSub() {
				if(!this.title){
					uni.showToast({
						title:'请填写标题',
						icon:'none'
					})
					return
				}
				if(!this.customerinfo){
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
				let proarr = []
				let arr = []
				if(this.workorder_type == '上门维修'){
					this.productList.forEach((ele)=>{
						proarr.push(ele.id)
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
					})
				}else{
					this.productList.forEach((ele)=>{
						proarr.push(ele.id)
					})
				}
				
				if(proarr.length == 0) {
					uni.showToast({
						title:'请选择产品',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					title:this.title,
					relation_id:this.customerinfo.id,   //关联客户
					level:this.critical_list[this.criticalIndex].id,   //紧要程度
					owner_staff_id:this.staffObj ? this.staffObj.id : '',
					start_time:this.start_time,
					end_time:this.end_time,
					remindtype:this.remindIndex,
					contacts_id: this.contactsList[this.contactsIndex].id,
					address:this.address,
					address_detail:this.address_detail,
					lng:this.lng,
					lat:this.lat,
					customer_product_id: proarr.join(','),
					product_part:arr,
					appointment_time:this.end_time,
					remarks:this.remarks
				}
				if(this.workorder_type == '上门维修'){
					params.is_over = this.is_over
				}
				netEditWorkorder(params).then(res=>{
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
	.fir_text{
		font-size:26rpx;
		color:#007AFF;
		margin-left:15rpx;
	}
	.radiowarp{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		radio{
			transform: scale(0.7);
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
				color:#666;
			}
			.list_text{
				font-size:26rpx;
				color:$uni-text-color;
			}
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
</style>
