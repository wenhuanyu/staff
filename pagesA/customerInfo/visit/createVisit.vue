<template>
	<view>
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="fir_warp">
			<input type="text" v-model="title" placeholder="填写计划标题" class="firinput">
			<view class="fir_text" @click="toTitleTemp">选择模板</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联客户<span>*</span></view>
			<view class="form_right" @click="toSeleCustomer">
				<view :class="customerinfo ? 'valueActive' : '' ">
					{{customerinfo ? customerinfo.name : '选择关联客户'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">计划类型<span>*</span></view>
			<picker @change="changeType" :range="typeList" :value="typeIndex">
				<view class="form_right">
					<view :class="typeList[typeIndex] ? 'valueActive' : '' ">
						{{typeList[typeIndex] ? typeList[typeIndex] : '选择计划类型'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">服务方式<span>*</span></view>
			<picker @change="changeMode" :range="modeList" :value="modeIndex">
				<view class="form_right">
					<view :class="modeList[modeIndex] ? 'valueActive' : '' ">
						{{modeList[modeIndex] ? modeList[modeIndex] : '选择服务方式'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp" v-if="isShowPurposevisit">
			<view class="inp_title key">服务目的<span>*</span></view>	
			<picker @change="changeObject" :range="objectList" :value="objectIndex">
				<view class="form_right">
					<view :class="objectList[objectIndex] ? 'valueActive' : '' ">
						{{objectList[objectIndex] ? objectList[objectIndex] : '选择服务目的'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view v-if="modeList[modeIndex] == '打样'">
			
		</view>
		<view v-else>
			<view class="inp_warp">
				<view class="inp_title key">紧要程度<span>*</span></view>
				<picker @change="changeCritical" :range="critical_list" :value="criticalIndex" :range-key="'name'">
					<view class="form_right">
						<view :class="critical_list[criticalIndex] ? 'valueActive' : '' ">
							{{critical_list[criticalIndex] ? critical_list[criticalIndex].name : '选择紧要程度'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</picker>
			</view>
			<view class="fllow_form" v-if="!isRequired && (objectList[objectIndex] == '上门安装' || objectList[objectIndex] == '上门维修' || modeList[modeIndex] == '返厂维修')">
				<view class="key">指派员工<span v-if="objectList[objectIndex] == '上门安装' || objectList[objectIndex] == '上门维修' || modeList[modeIndex] == '返厂维修'">*</span></view>
				<view class="form_right" @click="toSelectStaff">
					<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</view>
			<view class="inp_warp" v-if="modeList[modeIndex] != '返厂维修'">
				<view class="inp_title key">开始时间 <span>*</span> </view>
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
			<view class="inp_warp" v-if="objectList[objectIndex] != '上门安装' && modeList[modeIndex] != '返厂维修' && !isRequired">
				<view class="inp_title key">预计结束时间</view>
				<view class="form_right">
					<select-time-picker
						:disabled="false" 
						placeholder="选择结束时间" 
						:start="limit_time"
						:defaultValue="end_time"
						fields="minute"
						@change="changeNewEndTime"
						v-if="limit_time"
					></select-time-picker>
					<view v-else @click="toDone">选择结束时间</view>
					<view class="iconfont icon-you"></view>
				</view>
			</view>
			<view class="inp_warp" v-if="objectList[objectIndex] == '上门安装' && !isRequired">
				<view class="inp_title key">预计结束时间</view>
				<picker @change="changeEndTime" mode="date">
					<view class="form_right">
						<view :class="end_time ? 'valueActive' : '' ">
							{{end_time ? end_time : '选择预计结束时间'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</picker>
			</view>
			<!-- 售后服务 上门维修 -->
			<view v-if="!modeShow">
				<view class="inp_warp" v-if="!isRequired">
					<view class="inp_title" style="color:#666666">提醒</view>
					<picker @change="changeRemind" :range="remindList" :value="remindIndex">
						<view class="form_right">
							<view :class="remindList[remindIndex] ? 'valueActive' : '' ">
								{{remindList[remindIndex] ? remindList[remindIndex] : '选择提醒时间'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
				<view class="fllow_area" v-if="!isRequired">
					<view class="fllo_list">
						<view class="area_head">计划备注:</view>
						<view class="list_text" @click="toRemarksTemp">选择模板</view>
					</view>
					<textarea v-model="remark" maxlength="-1" :class="remark ? 'valueActive' : '' " placeholder="请填写备注"
						placeholder-style="color:#999" />
				</view>
			</view>
			<view v-if="objectList[objectIndex] == '上门安装' || objectList[objectIndex] == '上门维修'">
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
								<view class="iconfont icon-jian" @click="delProduct(index)"></view>
								<view class="protext">{{item.product.name}}</view>
								<view class="protext" >{{item.product.price}}</view>
							</view>
							<view class="part_li" v-if="objectList[objectIndex] == '上门维修'">
								<view class="partbox" v-for="(ele,eleindex) in item.parts" :key="eleindex" @click="toSelectProductPart(index,eleindex)"><radio value="r1" color="#ff7800" :checked="ele.is_select" />{{ele.name}}</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="objectList[objectIndex] == '上门维修'">
					<view class="inp_warp">
						<view class="inp_title key">需携带配件<span>*</span></view>
						<view class="add_in" @click="addParts">
							<view class="iconfont icon-jiahaocu"></view>
							选择配件
						</view>
					</view>
					<view class="prolist" v-if="carryPartsList.length != 0">
						<view class="probox">
							<view class="product_li" 
								style="padding:24rpx 0;border-bottom:1rpx solid #f5f5f5;" 
								v-for="(item,index) in carryPartsList" 
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
				</view>
				<view class="fllow_form" v-if="objectList[objectIndex] != '上门安装'">
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
			</view>
			<!-- 返厂维修 -->
			<view v-if="modeList[modeIndex] == '返厂维修'">
				<view class="fllow_form">
					<view class="key">机器型号<span>*</span></view>
					<view class="form_right" style="color:#008EFF" @click="toAddPart">
						<view class="iconfont icon-jiahaocu" style="color:#008EFF"></view>
						选择机器
					</view>
				</view>
				<view class="prolist" v-if="partsList.length != 0">
					<view class="probox">
						<view class="proli" v-for="(item,index) in partsList" :key="index">
							<view class="product_li">
								<view class="iconfont icon-jian" @click="delParts(index)"></view>
								<view class="protext">{{item.product.name}}</view>
								<view class="protext">{{item.number?item.number:''}}</view>
								<view class="protext" >{{item.product.price}}</view>
							</view>
							<view class="part_li">
								<view class="partbox" v-for="(ele,eleindex) in item.parts" :key="eleindex" @click="toSelectPart(index,eleindex)"><radio value="r1" color="#ff7800" :checked="ele.is_select" />{{ele.name}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="fllow_form">
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
				<view class="fllow_area">
					<view class="fllo_list">
						<view class="area_head key">问题描述:<span>*</span></view>
					</view>
					<textarea v-model="desc" maxlength="-1" :class="desc ? 'valueActive' : '' " placeholder="请填写问题描述"
						placeholder-style="color:#999" />
				</view>
				<view class="fllow_area">
					<view class="fllo_list">
						<view class="area_head key">注意事项:<span>*</span></view>
					</view>
					<textarea v-model="matters" maxlength="-1" :class="matters ? 'valueActive' : '' " placeholder="请填写注意事项"
						placeholder-style="color:#999" />
				</view>
				<view class="inp_warp">
					<view class="inp_title key">要求维修完成日期<span>*</span></view>
					<select-time-picker
						fields="day" 
						:start="nowTimeDate"
						placeholder="要求维修完成日期" 
						:defaultValue="appointment_time"
						@change="changeSaleTime"
					></select-time-picker>
				</view>
				<!-- 上传附件 -->
				<upload-img :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
			</view>
		</view>
		<view class="button" @click="$noMultipleClicks(toAddVisit)">提交</view>
		<view class="botsec"></view>
		
		<select-work-product ref="workProductOne" :customerinfo="customerinfo" @selectList="selectParts"></select-work-product>
		<!-- 上门安装 上门维修 选择产品 -->
		<select-work-product ref="workProductTwo" :customerinfo="customerinfo" @selectList="selectProduct"></select-work-product>
		<!-- 需要使用的设备名称 -->
		<uni-popup ref="partPopup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popuptitle">设备名称</view>
			<view class="equi_box">
				<scroll-view scroll-y class="scrollbox">
					<view class="equi_list">
						<view class="equi_li" v-for="(item,index) in equipList" :key="index" @click="checkEqui(index)">
							<radio value="1" color="#008EFF" :checked="item.select" />{{item.name}}
						</view>
					</view>
				</scroll-view>
				<view class="bot_warp">
					<view class="bot_btn remove" @click="closeDevice">取消</view>
					<view class="bot_btn" @click="handleEquip">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 上门维修 需要携带的配件 -->
		<select-work-parts
			ref="partsChild" 
			@selectList="selectProductParts"
		></select-work-parts>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { netAddVisitplant, netPrevCustomer, 
	netLoginerInfo, netProoPlan, netLianxiren, netCustomerAddress } from '@/api/api.js'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	import { BASE_IMG_URL, BASE_URL, SIGN_NO } from '@/api/http.js'
	import { checkStartEnd } from '@/utils/util.js'
	import { commonFun } from '@/common/navigate.js'
	import selectProduct from '@/components/selectProduct/index.vue'
	import selectWorkProduct from '@/components/selectWorkProduct/index'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	import selectWorkParts from '@/components/selectWorkParts/index'
	 
	export default {
		mixins:[commonFun],
		components:{
			selectProduct,
			selectWorkProduct,
			selectTimePicker,
			selectWorkParts
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,   //防止重复点击
				remindList:['准时提醒','5分钟前','15分钟前','30分钟前','一个小时前','两个小时前','一天前','两天前','一周前'],
				remindIndex:1,
				modeList:['上门'],   //拜访方式
				modeIndex:null,
				
				modeShow:false,
				isShowPurposevisit:true,
				critical_list:[    //紧要程度
					{ id:0, name:'普通'},
					{ id:1, name:'重要'},
					{ id:2, name:'紧急'},
					{ id:4, name:'重要且紧急'},
				],
				criticalIndex:0,
				typeList:['客户服务','售后服务'],     //计划类型
				typeIndex:null,
				objectList:['认识','报价','签合同','收款'],    //拜访目的
				objectIndex:null,
				
				start_time:'',  //开始时间
				end_time:'',  //结束时间
				limit_time:'',   //限制时间参数
				title:'',
				remark:'',
				level:'',  //紧要程度
				remindtype:'',  //提醒时间
				relation_id:'',   //关联客户
				type:'',   //计划类型
				
				customerid:'',
				isShowStaff:false,
				//打样申请
				//打样原因
				prooreason:['产品研发','客户需求','设计变更','其他'],
				prooreasonIndex:0,
				//样品提供
				prooprovision:['客供','外部采购','其他'],
				prooprovisionIndex:0,
				//样品来源
				isShowSource:false,
				provisio_desc:'',
				//样品处理
				prooprocess:['返还客户','存档保留','报废'],
				prooprocessIndex:0,
				
				application_department:'',   //申请部门
				application_name:'',   //申请人
				application_date:'',   //申请时间
				sample_name:'',   //样品名称
				sample_number:'',   //样品数量
				sample_material:'',  //样品材质
				sample_provision:'',   //样品提供
				completion_date:'',   //要求完成时间
				proofing_reason:'',   //打样原因
				device_config:'',   //设备配置
				sample_preservation:'',   //样品保存  样品处理
				accuracy:'',   //精度要求
				appearance:'',   //外观要求
				speed:'',    //速度要求
				others:'',   //其他要求
				//售后服务  返厂维修
				partsList:[],
				is_over:1,   //1过保  2未过保
				imgList:[],
				desc:'',   //问题描述
				matters:'',  //注意事项
				appointment_time:'',   //要求完成时间
				customer_product_id:'',   //机器型号
				image:'',   //附件
				//////////////////////////////////////////////
				//客户信息   售后服务 上门安装  上门维修
				lat:'',
				lng:'',
				address:'',
				address_detail:'',
				contactsList:[],
				contactsIndex:0,
				productList:[],
				carryPartsList:[],    //上门维修 需要携带的 配件
				//需使用 设备
				device_name:'', //设备名称
				equipList:[
					{id:1,name:'热熔胶机',select:false,device_config:''},
					{id:2,name:'冷胶机',select:false,device_config:''},
					{id:3,name:'双面胶铁头',select:false,device_config:''},
					{id:4,name:'双面胶',select:false,device_config:''}
				],
				selectDeviList:[],  //选中的设备
				nowTimeDate:'',
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
			templateTitle: state => state.template.visit_plan_title,   //标题
			templateRemark: state => state.template.visit_plan_remarks,   //备注
			staffObj: state => state.customer.staffObj
		}),
		watch:{
			templateTitle(newv,oldv){
				this.title = newv
				//处理选中的模板
				this.handleType(newv)
			},
			customerinfo(newobj,oldobj){
				if(newobj){
					//获取 客户联系人
					this.getCustomerLink()
					//获取 客户 地址
					this.getCustomerInfo()
				}
			},
		},
		onLoad(options) {
			this.$store.commit('CUSTOMEROBJ',null)
			this.$store.commit('STAFFOBJ',null)
			if(options.customerid) {
				this.customerid = options.customerid
				//获取 默认的  关联客户
				this.getDefaultCustomer()
			}
			//当前时间
			let arr = getNewDateArry()
			this.nowTimeDate = `${arr[0]}-${arr[1]}-${arr[2]}`
			this.start_time = `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}`
			this.limit_time = `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}`
			//默认申请时间
			this.application_date = `${arr[0]}-${arr[1]}-${arr[2]}`
			//获取 登录者 信息
			this.getUserinfo()
		},
		onShow() {
			if(this.templateRemark) {
				this.remark += this.templateRemark
			}
		},
		onUnload() {
			this.$store.commit('VISIT_PLAN_REMARKS','')
			this.$store.commit('VISIT_PLAN_TITLE','')
			this.$store.commit('CUSTOMEROBJ','')
		},
		onHide() {
			this.$refs.workProductOne.closePopup()
			this.$refs.workProductTwo.closePopup()
			this.$refs.partsChild.closePopup()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			handleType(type) {
				console.log(type,'标题',this.start_time)
				if(type == '客户服务_上门_认识'){
					
					this.typeList = ['客户服务','售后服务']     //计划类型
					this.typeIndex = 0
					
					this.modeList = ['上门']  //拜访方式
					this.modeIndex = 0
					
					this.objectList = ['认识','报价','签合同','收款']    //拜访目的
					this.objectIndex = 0
				}else if(type == '客户服务_上门_报价'){
					this.typeList = ['客户服务','售后服务']     //计划类型
					this.typeIndex = 0
					
					this.modeList = ['上门']  //拜访方式
					this.modeIndex = 0
					
					this.objectList = ['认识','报价','签合同','收款']    //拜访目的
					this.objectIndex = 1
				}else if(type == '客户服务_上门_签合同'){
					this.typeList = ['客户服务','售后服务']     //计划类型
					this.typeIndex = 0
					
					this.modeList = ['上门']  //拜访方式
					this.modeIndex = 0
					
					this.objectList = ['认识','报价','签合同','收款']    //拜访目的
					this.objectIndex = 2
				}else if(type == '客户服务_上门_收款'){
					this.typeList = ['客户服务','售后服务']     //计划类型
					this.typeIndex = 0
					
					this.modeList = ['上门']  //拜访方式
					this.modeIndex = 0
					
					this.objectList = ['认识','报价','签合同','收款']    //拜访目的
					this.objectIndex = 3
				}else if(type == '售后服务_上门_上门安装'){
					this.typeList = ['客户服务','售后服务']     //计划类型
					this.typeIndex = 1
					
					this.modeList = ['上门','电话','返厂维修']  //拜访方式
					this.modeIndex = 0
					
					this.objectList = ['上门安装','上门维修']
					this.objectIndex = 0
					
					this.productList = []
					this.partsList = []
				}else if(type == '售后服务_上门_上门维修'){
					
					this.typeList = ['客户服务','售后服务']     //计划类型
					this.typeIndex = 1
					
					this.modeList = ['上门','电话','返厂维修']  //拜访方式
					this.modeIndex = 0
					
					this.objectList = ['上门安装','上门维修']
					this.objectIndex = 1
					
					this.productList = []
					this.partsList = []
				}else if(type == '售后服务_电话'){
					this.typeList = ['客户服务','售后服务']     //计划类型
					this.typeIndex = 1
					
					this.modeList = ['上门','电话','返厂维修']  //拜访方式
					this.modeIndex = 1
					
					this.isShowPurposevisit = false
					this.objectIndex = null
				}else if(type == '售后服务_返厂维修'){
					this.typeList = ['客户服务','售后服务']     //计划类型
					this.typeIndex = 1
					
					this.modeList = ['上门','电话','返厂维修']  //拜访方式
					this.modeIndex = 2
					
					this.isShowPurposevisit = false
					this.objectIndex = null
				}
				this.handleMode()
			},
			///////////////////////////////////////////////////////////
			//上门维修 需要携带的配件
			//去选择配件
			addParts() {
				this.$refs.partsChild.init()
			},
			selectProductParts(arr) {
				arr.forEach(ele=>{
					ele.number = 1
				})
				let data = this.carryPartsList.concat(arr)
				this.carryPartsList = this.deWeight(data)
			},
			//删除 配件
			delProductParts(index) {
				this.carryPartsList.splice(index,1)
			},
			//修改 配件 数量
			changeNumber(e,index) {
				let obj = this.carryPartsList[index]
				obj.number = e
				this.$set(this.carryPartsList,index,obj)
			},
			/////////////////////////////////////////////////////////
			//机器
			toAddPart() {
				this.$store.commit('VISIT_PLAN_REMARKS','')
				if(!this.customerinfo){
					uni.showToast({
						title:'请先选择客户',
						icon:'none'
					})
					return
				}
				this.$refs.workProductOne.init(this.customerinfo.id,3)
			},
			delParts(index) {
				this.partsList.splice(index,1)
			},
			changePartNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e.detail
				this.$set(this.partsList,index,obj)
			},
			selectParts(arr) {
				let data = this.partsList.concat(arr)
				data.forEach(ele=>{
					ele.number = 1
					ele.parts.forEach(item=>{
						item.is_select = false
					})
				})
				this.partsList = this.deWeight(data)
			},
			//选择配件
			toSelectPart(index,partindex) {
				let obj = this.partsList[index]
				obj.parts[partindex].is_select = !obj.parts[partindex].is_select
				this.$set(this.partsList,index,obj)
			},
			//是否过保
			changeOver(e) {
				this.is_over = e.detail.value
			},
			changeSaleTime(e) {
				let Y = e.YYYY
				let M = e.M
				let D = e.D
				this.appointment_time = `${Y}-${M}-${D}`
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			////////////////////////////////////////////////////////
			//获取 登录者 信息
			getUserinfo() {
				netLoginerInfo().then(res=>{
					res = res.data.userinfo
					this.application_name = res.name
					this.application_department = res.post
				})
			},
			toSelectAchieve() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/achieve_goal'
				})
			},
			//选择拜访目的
			changeObject(e) {
				this.objectIndex = e.detail.value
				if(this.objectList[this.objectIndex] == '上门安装' || this.objectList[this.objectIndex] == '上门维修'){
					this.productList = []
				}
			},
			//去选择 指派员工
			toSelectStaff() {
				this.$store.commit('VISIT_PLAN_REMARKS','')
				uni.navigateTo({
					url:'/pages/template/relation_staff'
				})
			},
			//获取默认的客户
			getDefaultCustomer () {
				netPrevCustomer({id:this.customerid}).then(res=>{
					this.$store.commit('CUSTOMEROBJ',res.data.data[0])
				})
			},
			//去选择 标题模版
			toTitleTemp(){
				this.$store.commit('VISIT_PLAN_REMARKS','')
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/visit_title_template'
				})
			},
			//去选择  备注 模版
			toRemarksTemp() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/needTemplate?type=任务备注'
				})
				// uni.navigateTo({
				// 	url:'/pages/template/visitRemark'
				// })
			},
			////////////////////////////////////////////////////////////////////////////////////////////
			//去选择  关联 客户
			toSeleCustomer() {
				this.$store.commit('VISIT_PLAN_REMARKS','')
				uni.navigateTo({
					url:'/pages/template/relation_customer'
				})
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
			//获取 客户 地址
			getCustomerInfo() {
				netCustomerAddress({customer_id:this.customerinfo.id}).then(res=>{
					this.address = res.data.address
					this.address_detail = res.data.address_detail
					this.lat = res.data.lat
					this.lng = res.data.lng
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
			//选择 产品
			seProduct() {
				if(this.customerinfo){
					this.$store.commit('VISIT_PLAN_REMARKS','')
					if(this.objectList[this.objectIndex] == '上门安装'){
						this.$refs.workProductTwo.init(this.customerinfo.id,2)
					}else{
						this.$refs.workProductTwo.init(this.customerinfo.id,3)
					}
					
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
			toSelectProductPart(index,partindex) {
				let obj = this.productList[index]
				obj.parts[partindex].is_select = !obj.parts[partindex].is_select
				this.$set(this.productList,index,obj)
			},
			////////////////////////////////////////////////////////////////////////////////////////////////////
			//计划类型
			changeType(e) {
				this.typeIndex = e.detail.value
				//选择计划类型后如果计划标题没有内容，则将计划类型回填到标题内
				this.title = this.typeList[this.typeIndex]
				
				this.objectIndex = null
				this.modeIndex = null
				this.handleJihua()
			},
			//根据计划类型  处理数据
			handleJihua() {
				if(this.typeIndex == 0){
					this.isShowStaff = true
					this.modeList = ['上门']
				}else{
					this.isShowStaff = false
					this.modeList = ['上门','电话','返厂维修']
				}
			},
			//拜访方式
			changeMode(e) {
				this.modeIndex = e.detail.value
				if(this.modeIndex == 0) {
					this.isShowPurposevisit = true
				}else{
					this.isShowPurposevisit = false
				}
				
				if(this.modeList[this.modeIndex] == '返厂维修'){
					this.modeShow = true
				}else{
					this.modeShow = false
				}
				
				if( (this.typeList[this.typeIndex] == '售后服务') && (this.modeList[this.modeIndex] == '上门')){
					this.isShowPurposevisit = true
					this.objectList = ['上门安装','上门维修']
				}else if((this.typeList[this.typeIndex] == '客户服务') && (this.modeList[this.modeIndex] == '上门')){
					this.isShowPurposevisit = true
					this.objectList = ['认识','报价','签合同','收款']
				} 
			},
			handleMode() {
				if(this.modeList[this.modeIndex] == '返厂维修'){
					this.modeShow = true
				}else{
					this.modeShow = false
				}
				if(this.modeList[this.modeIndex] == '上门'){
					this.isShowPurposevisit = true
					
				}
			},
			//提醒时间
			changeRemind(e) {
				this.remindIndex = e.detail.value
			},
			//紧要程度
			changeCritical(e) {
				this.criticalIndex = e.detail.value
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
			changeEndTime(e) {
				this.end_time = e.detail.value
			},
			toDone() {
				uni.showToast({
					title:'请先选择开始时间',
					icon:'none'
				})
			},
			//打样////////////////////////////////////////////////////
			//申请时间
			changeData (e) {
				this.application_date = e.detail.value
			},
			//打样原因
			changeProoreason(e) {
				this.prooreasonIndex = e.detail.value
			},
			//样品提供
			changeProvision(e) {
				this.prooprovisionIndex = e.detail.value
				if(this.prooprovision[this.prooprovisionIndex] == '其他'){
					this.isShowSource = true
				}else{
					this.isShowSource = false
				}
			},
			//要求完成 时间
			changeContime(e) {
				console.log(e)
				let Y = e.YYYY
				let M = e.M
				let D = e.D
				this.completion_date = `${Y}-${M}-${D}`
			},
			//完工 样品  处理
			changeProcess(e) {
				this.prooprocessIndex = e.detail.value
			},
			//需使用设备名称
			changeEquip(e) {
				this.eqindex = e.detail.value
			},
			checkEqui(index) {
				let obj = this.equipList[index]
				obj.select = !obj.select
				this.$set(this.equipList,index,obj)
			},
			closeDevice() {
				this.$refs.partPopup.close()
			},
			//处理 选中的  设备
			handleEquip() {
				this.$refs.partPopup.close()
				let selectArr = []
				this.equipList.forEach(ele=>{
					if(ele.select){
						selectArr.push(ele)
					}
				})
				this.selectDeviList = this.deWeight(this.selectDeviList.concat(selectArr))
			},
			//删除 已选中
			delAchieve(index) {
				this.selectDeviList.splice(index,1)
			},
			toSeleDevice() {
				let selectArr = this.selectDeviList
				let arr = [
					{id:1,name:'热熔胶机',select:false,device_config:''},
					{id:2,name:'冷胶机',select:false,device_config:''},
					{id:3,name:'双面胶铁头',select:false,device_config:''},
					{id:4,name:'双面胶',select:false,device_config:''}
				]
				selectArr.forEach(ele=>{
					arr.forEach(res=>{
						if(ele.id == res.id){
							res.select = true
						}
					})
				})
				this.equipList = arr
				this.selectDeviList = selectArr
				this.$refs.partPopup.open()
			},
			///////////////////////////////////////////////////////////////////////////////////////////////
			//售后服务  上门 维修
			//出厂时间
			changeOthertime(e) {
				this.other_time = e.detail.value
			},
			//要求完成 日期
			changeCompletetime(e) {
				this.other_complete = e.detail.value
			},
			///////////////////////////////////////////////////////////////////////////////////////////////
			toAddVisit() {
				if(this.modeList[this.modeIndex] == '返厂维修'){
					this.submitRepair()
				}else if(this.objectList[this.objectIndex] == '上门安装' || this.objectList[this.objectIndex] == '上门维修') {
					this.submitShangmen()
				}else{
					this.submitTask()
				}
			},
			//售后服务  上门安装 上门维修
			submitShangmen() {
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
				let aa = []
				this.productList.forEach((ele)=>{
					proarr.push(ele.id)
					let p = []
					ele.parts.forEach(item=>{
						if(item.is_select){
							p.push(item.id)
						}
					})
					aa.push({
						customer_product_id:ele.id,
						parts_id:p.join(',')
					})
				})
				if(proarr.length == 0) {
					uni.showToast({
						title:'请选择产品',
						icon:'none'
					})
					return
				}
				//上门维修 需要携带的 配件
				
				//附件
				let imgarr = []
				this.imgList.forEach(ele=>{
					imgarr.push(ele.id)
				})
				let fir = this.typeList[this.typeIndex] ? this.typeList[this.typeIndex] : ''
				let sec = this.modeList[this.modeIndex] ? this.modeList[this.modeIndex] : ''
				let thr = this.objectList[this.objectIndex] ? this.objectList[this.objectIndex] : ''
				let event_type = [fir,sec,thr]
				
				let params = {
					title:this.title,
					event_type,
					relation_id:this.customerinfo.id,   //关联客户
					level:this.critical_list[this.criticalIndex].id,   //紧要程度
					staff_id:this.staffObj ? this.staffObj.id : '',
					start_time:this.start_time,
					end_time:this.end_time,
					remindtype:this.remindIndex,
					contacts_id: this.contactsList[this.contactsIndex].id,
					address:this.address,
					address_detail:this.address_detail,
					lng:this.lng,
					lat:this.lat,
					customer_product_id: proarr.join(','),
					file_ids:imgarr.join(','),
					appointment_time:this.end_time,
					remark:this.remark,
					product_part:aa,
				}
				if(this.objectList[this.objectIndex] == '上门维修'){
					params.is_over = this.is_over
					params.parts = this.carryPartsList
				}
				netAddVisitplant(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.$store.commit('CUSTOMEROBJ',null)
						this.$store.commit('STAFFOBJ',null)
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			},
			//售后服务  返厂维修
			submitRepair() {
				if(!this.title){
					uni.showToast({
						title:'请填写标题',
						icon:'none'
					})
					return
				}
				if(!this.typeList[this.typeIndex]){
					uni.showToast({
						title:'请选择计划类型',
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
				if(this.partsList.length == 0) {
					uni.showToast({
						title:'请选择机器型号',
						icon:'none'
					})
					return
				}
				if(!this.desc){
					uni.showToast({
						title:'请填写问题描述',
						icon:'none'
					})
					return
				}
				if(!this.matters){
					uni.showToast({
						title:'请填写注意事项',
						icon:'none'
					})
					return
				}
				if(!this.appointment_time) {
					uni.showToast({
						title:'请选择要求维修完成日期',
						icon:'none'
					})
					return
				}
				//机器型号
				let arr = []
				this.partsList.forEach(ele=>{
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
				//附件
				let imgarr = []
				this.imgList.forEach(ele=>{
					imgarr.push(ele.id)
				})
				
				let fir = this.typeList[this.typeIndex] ? this.typeList[this.typeIndex] : ''
				let sec = this.modeList[this.modeIndex] ? this.modeList[this.modeIndex] : ''
				let thr = this.objectList[this.objectIndex] ? this.objectList[this.objectIndex] : ''
				let event_type = [fir,sec,thr]
				
				let params = {
					title:this.title,
					event_type,
					relation_id:this.customerinfo.id,   //关联客户
					level:this.critical_list[this.criticalIndex].id,   //紧要程度
					staff_id:this.staffObj ? this.staffObj.id : '',
					is_over:this.is_over,
					desc:this.desc,
					matters:this.matters,
					appointment_time: this.appointment_time,
					product_part:arr,
					file_ids:imgarr.join(',')
				}
				netAddVisitplant(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.$store.commit('CUSTOMEROBJ',null)
						this.$store.commit('STAFFOBJ',null)
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			},
			submitTask() {
				let {
					remindList,
					remindIndex,
					critical_list,
					criticalIndex,
					typeList,
					typeIndex,
					title,
					start_time,
					end_time,
					remark,
					staffObj,
					customerinfo,
				} = this
				if(!title){
					uni.showToast({
						title:'请填写标题',
						icon:'none'
					})
					return
				}
				if(!typeList[typeIndex]){
					uni.showToast({
						title:'请选择计划类型',
						icon:'none'
					})
					return
				}
				if((this.modeList[this.modeIndex] != '微信') && !start_time){
					uni.showToast({
						title:'请选择开始时间',
						icon:'none'
					})
					return
				}
				
				if(!customerinfo){
					uni.showToast({
						title:'请选择关联客户',
						icon:'none'
					})
					return
				}
				// if(!checkStartEnd(start_time,end_time)){
				// 	uni.showToast({
				// 		title:'预计结束时间必须大于等于开始时间',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				// if(typeIndex == 1 && !staffObj){
				// 	uni.showToast({
				// 		title:'请选择指派人',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				let fir = typeList[typeIndex] ? typeList[typeIndex] : ''
				let sec = this.modeList[this.modeIndex] ? this.modeList[this.modeIndex] : ''
				let thr = this.objectList[this.objectIndex] ? this.objectList[this.objectIndex] : ''
				let event_type = [fir,sec,thr]
				
				let params = {
					title,
					relation_id:customerinfo.id,
					start_time,
					end_time,
					remark,
					level:critical_list[criticalIndex].id,
					remindtype:remindIndex,
					type:1,
					staff_id:staffObj ? staffObj.id : '',
					event_type,
				}
				netAddVisitplant(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.$store.commit('CUSTOMEROBJ',null)
						this.$store.commit('STAFFOBJ',null)
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
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
				width:110rpx;
			}
			.deviinput{
				background:rgba(202, 202, 202, 0.2);
				width:410rpx;
				height:80rpx;
				border-radius: 10rpx;
				padding:10rpx;
				box-sizing: border-box;
				margin-left:24rpx;
			}
		}
	}
	.equi_box{
		width:750rpx;
		background:#fff;
		.scrollbox{
			width:750rpx;
			height:700rpx;
		}
		.equi_list{
			padding:40rpx;
			.equi_li{
				padding:24rpx 35rpx;
				background:#fff;
				border-radius: 10rpx;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.2);
				font-size:24rpx;
				color:#333;
				margin-bottom:24rpx;
				radio{
					transform: scale(0.7);
					margin-right:30rpx;
				}
			}
		}
		.bot_warp{
			width:750rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			height:100rpx;
			padding-bottom:20rpx;
			border-top:1rpx solid #EDEDED;
			.bot_btn{
				width:220rpx;
				height:60rpx;
				border-radius: 10rpx;
				font-size:24rpx;
				color:#fff;
				text-align: center;
				line-height: 60rpx;
				background:$uni-text-color;
			}
			.remove{
				background:#fff;
				border:1rpx solid $uni-text-color;
				color:$uni-text-color;
				line-height: 58rpx;
			}
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
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding: 30rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			// padding:0 24rpx;
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
	.test_top{
		width:100%;
		height:60rpx;
		background:rgba(0, 142, 255, 0.2);
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
				background:$uni-btn-bg-color;
				position: absolute;
				left:30rpx;
				top:15rpx;
			}
		}
	}
	
	.fir_warp{
		padding:30rpx;
		background:#fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom:1rpx solid #EDEDED;
		.firinput{
			width:450rpx;
			font-size:26rpx;
			color:#333;
		}
		.fir_text{
			font-size:26rpx;
			color:$uni-text-color;
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
</style>
