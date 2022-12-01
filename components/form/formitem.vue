<template>
<view class="">
	<view v-for="(objInfo,index) in listForm" :key="index">
		<view class="fllow_form" v-if="objInfo.component == 'input' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_input">
				<input type="text" class="inputtext" :class="objInfo.value ? 'valueActive' : '' " @input="(e)=>{changeInput(objInfo,e)}" placeholder-class="inputPla" :disabled="!isEdit" :value="objInfo.value" :placeholder="!isEdit ? '' : objInfo.config.placeholder" />
			</view>
		</view>
		<view class="fllow_form" v-else-if="objInfo.component == 'input-number' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_input">
				<input type="number" @input="(e)=>{changeInput(objInfo,e)}" class="inputtext" :class="objInfo.value ? 'valueActive' : '' " placeholder-class="inputPla" :disabled="!isEdit" :value="objInfo.value" :placeholder="!isEdit ? '' : objInfo.config.placeholder" />
			</view>
		</view>
		<view class="fllow_form" v-else-if="objInfo.component == 'input-money' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_input">
				<input type="digit" @input="(e)=>{changeInput(objInfo,e)}" class="inputtext" :class="objInfo.value ? 'valueActive' : '' " placeholder-class="inputPla" :disabled="!isEdit" :value="objInfo.value" :placeholder="!isEdit ? '' : objInfo.config.placeholder" />
			</view>
		</view>
		<view class="fllow_form" v-else-if="objInfo.component == 'input-mobile' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_input">
				<input type="number" @input="(e)=>{changeInput(objInfo,e)}" class="inputtext" :class="objInfo.value ? 'valueActive' : '' " placeholder-class="inputPla" :disabled="!isEdit" :value="objInfo.value" :placeholder="!isEdit ? '' : objInfo.config.placeholder" />
			</view>
		</view>
		<view class="fllow_form" v-else-if="objInfo.component == 'input-email' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_input">
				<input type="text" @input="(e)=>{changeInput(objInfo,e)}" class="inputtext" :class="objInfo.value ? 'valueActive' : '' " placeholder-class="inputPla" :disabled="!isEdit" :value="objInfo.value" :placeholder="!isEdit ? '' : objInfo.config.placeholder" />
			</view>
		</view>
		<!-- 开关 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'switch' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right">
				<switch :checked="objInfo.value" style="transform: scale(0.7);" color="#008EFF" :disabled="!isEdit" @change="(e)=>{changeSwitch(objInfo,e)}" />
			</view>
		</view>
		<!-- 下拉选择 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'select' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right" @click="changeSelect(objInfo)">
				<view :class="objInfo.value ? 'valueActive' : '' " style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value : objInfo.config.placeholder}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 标签 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'label' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right" @click="changeLabel(objInfo)">
				<view 
					:class="objInfo.value ? 'valueActive' : '' " 
					style="font-size:24rpx"
					v-if="!isEdit"
				>
					<span 
						class="label_style" 
						v-for="(laItem,laIndex) in objInfo.value_arr" 
						:key="laIndex" 
						:style="{color:laItem.color,border:'1rpx solid ' + laItem.color}"
					>{{laItem.label}}</span>
				</view>
				<view class="" v-else-if="objInfo.value">
					<span 
						class="label_style" 
						v-for="(laItem,laIndex) in objInfo.value_arr" 
						:key="laIndex" 
						:style="{color:laItem.color,border:'1rpx solid ' + laItem.color}"
					>{{laItem.label}}</span>
				</view>
				<view class="" v-else>
					{{objInfo.config.placeholder}}
				</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 评分 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'Rate' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right">
				<view>
					<uni-rate :size="18" @change="(e)=>{changeRate(objInfo,e)}" :readonly="!isEdit" :value="objInfo.value" />
				</view>
			</view>
		</view>
		<!-- 时间选择 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'TimePicker' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<picker @change="(e)=>{changeTime(objInfo,e)}" @columnchange="(e)=>{changeColumn(objInfo,e)}" mode="multiSelector" :disabled="!isEdit" :range="dateTimeArray" :value="dateTime">
				<view class="form_right" >
					<view :class="objInfo.value ? 'valueActive' : '' ">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value : objInfo.config.placeholder}}</view>
				</view>
			</picker>
		</view>
		<!-- 文本框 -->
		<view class="fllow_area" v-else-if="objInfo.component == 'textarea' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="area_head key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<textarea 
				@input="(e)=>{changeTextarea(objInfo,e)}" 
				maxlength="-1" 
				:auto-height="autoHeight" 
				:style="{height:height+'rpx'}" 
				:class="objInfo.value ? 'valueActive' : '' " 
				:value="objInfo.value ? objInfo.value : ''" 
				:disabled="!isEdit" 
				:placeholder="!isEdit ? '' : objInfo.config.placeholder" 
				placeholder-style="color:#999;font-size:24rpx;" 
			/>
		</view>
		<!-- 单选 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'radio' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right">
				<radio-group @change="(e)=>{changeRadio(objInfo,e)}" :disabled="!isEdit" class="labellist">
					<label class="" class="labelbox" v-for="(item,index) in objInfo.config.content" :key="index">
						<view>
							<radio color="#008EFF" :disabled="!isEdit" :value="item.value" :checked="item.value == objInfo.value"/>
						</view>
						<view>{{item.value}}</view>
					</label>
				</radio-group>
			</view>
		</view>
		
		<!-- 多选 -->
		<view class="fllow_area" v-else-if="objInfo.component == 'checkbox' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="area_head key" >{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<checkbox-group @change="(e)=>{changeCheckbox(objInfo,e)}" style="display: flex;justify-content: flex-start;flex-wrap: wrap;" >
				<label class="" style="margin-right:15rpx;margin-bottom:25rpx;display: block;" v-for="(item,index) in objInfo.config.content" :key="index">
					<checkbox class="checkbox" color="#ff7800" :value="item.value" :checked="item.select" :disabled="!isEdit"/>
					<span>{{item.value}}</span>
				</label>
			</checkbox-group>
		</view>
		<!-- 省市区联动 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'Cascader' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="" v-if="isEdit">
				<!-- #ifdef H5 || APP-PLUS -->
				<view class="form_right" @click="changeAddressData(objInfo)">
					<view :class="objInfo.value ? 'valueActive' : '' " style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value : objInfo.config.placeholder}}</view>
					<view class="iconfont icon-you"></view>
				</view>
				<lotus-address @choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<picker @change="(e)=>{changeAddress(objInfo,e)}" :disabled="!isEdit" mode="region">
					<view class="form_right">
						<view :class="objInfo.value ? 'valueActive' : '' ">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value : objInfo.config.placeholder}}</view>
					</view>
				</picker>
				<!-- #endif -->
			</view>
			<view v-else class="form_right">
				<view :class="objInfo.value ? 'valueActive' : '' ">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value : objInfo.config.placeholder}}</view>
			</view>
		</view>
		<!-- 打开地图定位 -->
		<view class="" v-else-if="objInfo.component == 'map' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="fllow_form">
				<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
				<view class="form_right" @click="openMap(objInfo)">{{objInfo.config.placeholder}}
					<view class="iconfont icon-you"></view>
				</view>
			</view>
			<view class="fllow_area" style="padding-top:24rpx;">
				<view class="form_right">
					<textarea :class="objInfo.value ? 'valueActive' : '' " style="height:150rpx;" placeholder="填写详细地址"
						v-model="objInfo.value" />
				</view>
			</view>
		</view>
		<!-- 地址定位 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'location' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right">
				<view :class="objInfo.value ? 'valueActive' : '' " class="location" style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value : objInfo.config.placeholder}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 时间选择 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'DatePicker' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<picker mode="date" @change="(e)=>{changeDate(objInfo,e)}" :disabled="!isEdit">
				<view class="form_right">
					<view :class="objInfo.value ? 'valueActive' : '' ">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value : objInfo.config.placeholder}}</view>
				</view>
			</picker>
		</view>
		<!-- 关联员工 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'staff' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right" @click="relationStaff(objInfo)">
				<view :class="objInfo.value ? 'valueActive' : '' " style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value.name : objInfo.config.placeholder}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 关联客户 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'customer' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right" @click="relationCustomer(objInfo)">
				<view :class="objInfo.value ? 'valueActive' : '' " style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value.name : objInfo.config.placeholder}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 关联联系人 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'contact' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right" @click="relationContact(objInfo)">
				<view :class="objInfo.value ? 'valueActive' : '' " style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value.name : objInfo.config.placeholder}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 关联合同 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'contract' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right" @click="relationContract(objInfo)">
				<view :class="objInfo.value ? 'valueActive' : '' " style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value.name : objInfo.config.placeholder}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 关联商机 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'business' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right" @click="relationBusiness(objInfo)">
				<view :class="objInfo.value ? 'valueActive' : '' " style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value.name : objInfo.config.placeholder}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 关联部门 -->
		<view class="fllow_form" v-else-if="objInfo.component == 'department' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
			<view class="form_right" @click="relationDepartment(objInfo)">
				<view :class="objInfo.value ? 'valueActive' : '' " style="font-size:24rpx">{{!isEdit && !objInfo.value ? '' : objInfo.value ? objInfo.value.name : objInfo.config.placeholder}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 编辑器 -->
		<view class="" v-else-if="objInfo.component == 'editor' && (objInfo.config.required ==true || !isNotRequired)">
			<view class="fllow_form" v-if="objInfo.component == 'editor' && (objInfo.config.required ==true || !isNotRequired)">
				<view class="key">{{objInfo.config.label}}<span v-if="objInfo.config.required">*</span></view>
				<view class="form_right" v-if="isEdit" @click="openEditor(objInfo)">
					<view class="">去编辑</view>
					<view class="iconfont icon-you"></view>
				</view>
			</view>
			<view class="fllow_form_edit">
				<view class="editcontent" v-html="objInfo.value"></view>
			</view>
			<!-- 编辑器 -->
			<robin-editor v-if="showEditor" class="editor" @cancel="hideEditor" @save="saveEditor" v-model="objInfo.value_t"
				:imageUploader="uploadEditImg" :muiltImage="true"></robin-editor>
		</view>
		
		<!-- 上传图片 -->
		<upload-image
			v-else-if="objInfo.component == 'uploadImage' && (objInfo.config.required || !isNotRequired) && !objInfo.config.addShow"
			:flag="objInfo.config.required" 
			:imgList="objInfo.value?objInfo.value:[]" 
			@uploadImg="(e)=>{uploadImg(objInfo,e)}" 
			@delImg="(e)=>{delImg(objInfo,e)}"
			:title="objInfo.config.label"
			:single="objInfo.config.maxnum"
			:isEdit="isEdit"
		></upload-image>
		<!-- 上传文件 -->
		<upload-file
			v-else-if="objInfo.component == 'uploadFile' && (objInfo.config.required || !isNotRequired) && !objInfo.config.addShow"
			:title="objInfo.config.label"
			:flag="objInfo.config.required"
			:fileList="objInfo.value?objInfo.value:[]"
			@uploadFile="(e)=>{uploadFile(objInfo,e)}"
			@delFile="(e)=>{delFile(objInfo,e)}"
			:isEdit="isEdit"
		>
		</upload-file>
	</view>
	<tki-tree ref="tkitree"
		:range="treeList" 
		:rangeKey="rangeKey"
		:idKey="idKey"
		:selectParent="selectParent"
		:multiple="multiple"
		confirmColor="#008EFF"
		@confirm="selectTree"
	/>
	<!-- 员工 -->
	<select-staff ref="staffChild" @sureStaff="sureStaff"></select-staff>
	<!-- 客户 -->
	<select-customer ref="customerChild" @getCustomerinfo="getCustomerinfo"></select-customer>
	<!-- 联系人 -->
	<select-contact ref="contactChild" @sureContact="sureContact"></select-contact>
	<!-- 合同 -->
	<select-contract ref="contractChild" @contractInfo="contractInfo"></select-contract>
	<!-- 商机 -->
	<select-business ref="businessChild" @sureBusiness="sureBusiness"></select-business>
	
</view>
</template>

<script>
	import { dateTimePicker, getMonthDay } from '@/utils/dateTimePicker.js'
	import { netLngTransAddress, netDepartmentTree } from '@/api/api.js'
	import { uploadUrl } from '@/api/api.js'
	import lotusAddress from '@/components/lotusAddress/lotusAddress.vue'
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	import uploadImage from "@/components/uploadImg/index.vue"
	import uploadFile from '@/components/uploadFile/index.vue'
	import selectStaff from '@/components/selectStaff.vue'
	import selectCustomer from '@/components/selectCustomer.vue'
	import selectBusiness from '@/components/selectBusiness.vue'
	import selectContract from '@/components/selectContract.vue'
	import selectContact from '@/components/select_contact.vue'
	
	export default {
		components:{
			lotusAddress,
			tkiTree,
			uploadImage,
			uploadFile,
			selectStaff,
			selectCustomer,
			selectBusiness,
			selectContract,
			selectContact
		},
		props:{
			listForm:{
				type:Array,
				default:[]
			},
			isEdit:{
				type:Boolean,
				default:true
			},
			height:{
				type:Number,
				default:300
			},
			autoHeight:{
				type:Boolean,
				default:false
			},
			isNotRequired:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return{
				dateTimeArray:[],
				dateArr:[],
				dateTime:[],
				address:'',
				treeList:[],
				rangeKey:'label',
				idKey:'nodeKey',
				selectParent:false,
				multiple:false,   //是否可以多选
				showEditor:false,  //编辑器
				currentObj:{},   //当前obj
				lotusAddressData:{
					visible:false,
					provinceName:'',
					cityName:'',
					townName:'',
				}
			}
		},
		created() {
			let arr = this.listForm
			arr.forEach(ele=>{
				if(ele.component == 'TimePicker'){
					this.initTime(ele)
				}else if(ele.component == 'location' && this.isEdit){
					this.getAddressinfo(ele)
				}
			})
		},
		onShow(){
			
		},
		methods:{
			//部门
			getDepartList() {
				netDepartmentTree().then(res=>{
					this.treeList = res.data
				})
			},
			relationDepartment(obj) {
				this.currentObj = obj
				this.rangeKey = 'name'
				this.idKey = 'id'
				this.selectParent = true
				this.multiple = false
				this.getDepartList()
				if(this.isEdit){
					this.$refs.tkitree._show()
				}
			},
			//输入框
			changeInput(obj,e) {
				this.currentObj = obj
				let name = this.currentObj.id
				let value = e.detail.value
				this.$emit('changeData',name,value,this.currentObj)
			},
			//开关
			changeSwitch(obj,e) {
				this.currentObj = obj
				let value = e.detail.value
				let name = this.currentObj.id
				this.$emit('changeData',name,value,this.currentObj)
			},
			//下拉选择
			changeSelect(obj) {
				this.currentObj = obj
				this.rangeKey = 'label'
				this.idKey = 'nodeKey'
				this.selectParent = false
				this.treeList = obj.config.content
				if(this.isEdit){
					this.$refs.tkitree._show()
				}
			},
			//标签
			changeLabel(obj) {
				this.currentObj = obj
				this.rangeKey = 'label'
				this.idKey = 'value'
				this.selectParent = false
				this.multiple = true
				this.treeList = obj.config.content
				if(this.isEdit){
					this.$refs.tkitree._show()
				}
			},
			selectTree(obj) {
				console.log(obj,'选中')
				let name = this.currentObj.id
				if(this.currentObj.component == 'select'){
					let selectName = obj[0].label
					this.$emit('changeData',name,selectName,this.currentObj)
				}else if(this.currentObj.component == 'department'){
					let value = {id:obj[0].id,name:obj[0].name}
					this.$emit('changeData',name,value,this.currentObj)
				}else if(this.currentObj.component == 'label'){
					let value = obj
					this.$emit('changeData',name,value,this.currentObj)
				}
			},
			//评分
			changeRate(obj,e) {
				this.currentObj = obj
				let value = e.value
				let name = this.currentObj.id
				this.$emit('changeData',name,value,this.currentObj)
			},
			//文本框
			changeTextarea(obj,e) {
				this.currentObj = obj
				let name = this.currentObj.id
				let value = e.detail.value
				this.$emit('changeData',name,value,this.currentObj)
			},
			//单选
			changeRadio(obj,e) {
				this.currentObj = obj
				let value = e.detail.value
				let name = this.currentObj.id
				this.$emit('changeData',name,value,this.currentObj)
			},
			//多选
			changeCheckbox(obj,e) {
				this.currentObj = obj
				let name = this.currentObj.id
				let value = e.detail.value
				this.$emit('changeData', name, value.join(','), this.currentObj)
			},
			changeAddress(obj,e) {
				this.currentObj = obj
				let firstr = e.detail.value[0]
				if(firstr.indexOf('市') != -1) {
					let index = firstr.indexOf('市')
					firstr = firstr.substring(0,index)
				}
				let str = firstr+'/'+e.detail.value[1]+'/'+e.detail.value[2]
				let name = this.currentObj.id
				this.$emit('changeData',name,str,this.currentObj)
			},
			//选择省市区
			choseValue(e) {
				this.lotusAddressData = Object.assign({},this.lotusAddressData,e)
				if(e.province){
					let value = e.province+'/'+e.city+'/'+e.town
					let name = this.currentObj.id
					this.$emit('changeData',name,value,this.currentObj)
				}
			},
			changeAddressData(obj) {
				this.currentObj = obj
				this.lotusAddressData = {
					visible:true,
					provinceName:'',
					cityName:'',
					townName:'',
				}
			},
			changeDate(obj,e) {
				this.currentObj = obj
				this.date = e.detail.value
				let name = this.currentObj.id
				this.$emit('changeData',name,this.date,this.currentObj)
			},
			withData(param) {
			  return param < 10 ? '0' + param : '' + param;
			},
			initTime(ele) {
				let date = new Date()
				console.log(date,'----123')
				let endYear = date.getFullYear()
				let mont = this.withData(date.getMonth() + 1)
				let day = this.withData(date.getDate())
				let hour = this.withData(date.getHours())
				let minu = this.withData(date.getMinutes())
				let seco = this.withData(date.getSeconds())
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let obj = dateTimePicker();
				// 精确到分的处理，将数组的秒去掉
				let lastArray = obj.dateTimeArray.pop();
				let lastTime = obj.dateTime.pop();
				let lastDate = obj.dateArray.pop()
				this.dateTimeArray=obj.dateTimeArray
				this.dateArr = obj.dateArray
				this.dateTime = obj.dateTime
				
				let strr = this.handleTime(this.dateTime)
				let name = ele.id
				this.$emit('changeData',name,strr,ele)
			},
			changeColumn(obj,e) {
				this.currentObj = obj
				let index = e.detail.column
				let value = e.detail.value
				if(index == 1){
					let month = this.dateArr[index][value]
					let date = new Date();
					let endYear = date.getFullYear();
					let obj = dateTimePicker();
					// 精确到分的处理，将数组的秒去掉
					let lastArray = obj.dateTimeArray.pop();
					let lastTime = obj.dateTime.pop();
					let lastDate = obj.dateArray.pop()
					this.dateTimeArray=obj.dateTimeArray
					this.dateArr = obj.dateArray
					this.dateTime=obj.dateTime
				}
			},
			//下次联系时间
			changeTime(obj,e) {
				this.currentObj = obj
				let arr = e.detail.value
				if(arr.includes(-1)){
					uni.showToast({
						title:'请选择正确的时间',
						icon:'none'
					})
					return
				}
				let str = this.handleTime(arr)
				let name = this.currentObj.id
				this.$emit('changeData',name,str,this.currentObj)
			},
			handleTime(arr) {
				let year = this.dateArr[0][arr[0]]
				let month = this.dateArr[1][arr[1]]
				let day = this.dateArr[2][arr[2]]
				let hour = this.dateArr[3][arr[3]]
				let minu = this.dateArr[4][arr[4]]
				let str = year+'-'+month+'-'+day+' '+ hour+':'+minu
				return str
			},
			//图片
			uploadImg(obj,data){
				this.currentObj = obj
				let name = this.currentObj.id
				let arr = this.currentObj.value?this.currentObj.value:[]
				arr.push(data)
				this.$emit('changeData', name, arr, this.currentObj)
			},
			delImg(obj,index) {
				this.currentObj = obj
				let name = this.currentObj.id
				let arr = this.currentObj.value
				arr.splice(index,1)
				this.$emit('changeData', name, arr, this.currentObj)
			},
			//文件
			uploadFile(obj,data) {
				this.currentObj = obj
				let name = this.currentObj.id
				let arr = this.currentObj.value?this.currentObj.value:[]
				arr.push(data)
				this.$emit('changeData', name, arr, this.currentObj)
			},
			delFile(obj,index) {
				this.currentObj = obj
				let name = this.currentObj.id
				let arr = this.currentObj.value
				arr.splice(index,1)
				this.$emit('changeData', name, arr, this.currentObj)
			},
			//打开地图选择定位
			openMap(obj) {
				this.currentObj = obj
				if(!this.isEdit){
					return
				}
				// #ifndef MP-ALIPAY
				uni.chooseLocation({
					success: res => {
						let arr = [res.address,res.name,res.latitude,res.longitude]
						let name = this.currentObj.id
						this.$emit('changeData', name, arr, this.currentObj)
					},
					fail: err => {
						if (err.errMsg == 'chooseLocation:fail auth deny') {
							uni.showToast({
								title: '请允许使用位置信息',
								icon: 'none'
							})
						}
					}
				})
				// #endif
			},
			//默认的地址定位
			getAddressinfo(ele) {
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					altitude: true,
					success: (res) => {
						//地址逆解析
						let params = {
							lat: res.latitude,
							lng: res.longitude
						}
						netLngTransAddress(params).then(data=>{
							data = data.data.result
							let arr = [data.address,res.latitude,res.longitude]
							let name = ele.id
							this.$emit('changeData', name, arr, ele)
						})
					},
					fail: (err) => {
						console.log(err, '错误')
					}
				})
			},
			//关联员工
			relationStaff(obj) {
				this.currentObj = obj
				if(this.isEdit){
					this.$refs.staffChild.init()
				}
			},
			sureStaff(obj) {
				let value = obj
				let name = this.currentObj.id
				this.$emit('changeData', name, value, this.currentObj)
			},
			//关联客户
			relationCustomer(obj) {
				this.currentObj = obj
				if(this.isEdit){
					this.$refs.customerChild.init()
				}
			},
			getCustomerinfo(obj) {
				let value = obj
				let name = this.currentObj.id
				this.$emit('changeData', name, value, this.currentObj)
			},
			//关联联系人
			relationContact(obj) {
				this.currentObj = obj
				if(this.isEdit){
					this.$refs.contactChild.init()
				}
			},
			sureContact(obj) {
				let value = obj
				let name = this.currentObj.id
				this.$emit('changeData', name, value, this.currentObj)
			},
			//关联 商机
			relationBusiness(obj) {
				this.currentObj = obj
				if(this.isEdit){
					this.$refs.businessChild.init()
				}
			},
			sureBusiness(obj) {
				let value = obj
				let name = this.currentObj.id
				this.$emit('changeData', name, value, this.currentObj)
			},
			//关联 合同
			relationContract(obj) {
				this.currentObj = obj
				if(this.isEdit){
					this.$refs.contractChild.init()
				}
			},
			contractInfo(obj) {
				let value = obj
				let name = this.currentObj.id
				this.$emit('changeData', name, value, this.currentObj)
			},
			//富文本编辑器
			openEditor(obj) {
				this.currentObj = obj
			    this.showEditor = true
			},
			hideEditor() {
			    this.showEditor = false
			},
			uploadEditImg(img, callback) {
			    //上传图片逻辑,将图片链接传给回调函数
				uni.uploadFile({
					url: uploadUrl,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token')
					},
					filePath: img,
					success: (res) => {
						let data = JSON.parse(res.data)
						if (data.code == 1) {
							callback(data.data.url)
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			saveEditor(res) {
				let value = res.html
				value = value.replaceAll('<img','<img style="max-width:100%;height:auto"')
				let name = this.currentObj.id
				setTimeout(()=>{})
				this.$emit('changeData', name, value, this.currentObj)
				this.hideEditor()
			},
		}
	}
</script>

<style lang="scss">
	.checkbox{
		.uni-checkbox-wrapper{
			.uni-checkbox-input{
				width:20rpx;
				height:20rpx;
				border-radius: 50%;
				overflow: hidden;
			}
		} 
	} 
	.valueActive{
		color:#333;
	}
	.labellist{
		width:100%;
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		.labelbox{
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
	}
	radio{
		transform: scale(0.6);
	}
	.sales_item{
		display: flex;
		justify-content: flex-start;
		padding-bottom:15rpx;
		flex-wrap: wrap;
		.checkbox{
			display: flex;
			justify-content: flex-start;
			margin-right:20rpx;
			margin-bottom:20rpx;
			transform:scale(0.8);
		}
	}
	.van-checkbox__icon{
		width:20rpx;
		height:20rpx;
	}
</style>
<style lang="scss" scoped>
	.fllow_form_edit{
		width:750rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		.key{
			font-size:24rpx;
			color:#333;
		}
		.editcontent{
			width:100%;
			overflow: hidden;
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		:first-child{
			flex-shrink: 0;
		}
		.form_right {
			width:450rpx;
			display: flex;
			justify-content: flex-end;
			color: #999;
			text-align: right;
			.location{
				width:450rpx;
			}
			image {
				flex-shrink: 0;
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.label_style{
				margin:0 8rpx;
				border-radius: 8rpx;
				padding:5rpx;
			}
		}
		.theme {
			color: #5ca9fe;
		}
		.form_input {
			.inputPla{
				font-size:24rpx;
				color:#999;
			}
			.inputtext{
				font-size:24rpx;
				width:450rpx;
				text-align: right;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding: 0 30rpx 30rpx;
		border-bottom:1rpx solid #f5f5f5;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			text {
				color: #f00;
			}
		}
		textarea {
			width: 80%;
			height: 300rpx;
			padding: 30rpx;
			background: #f8f8f8;
			margin: 0 auto;
			border-radius: 20rpx;
			font-size:24rpx;
		}
	}
</style>
