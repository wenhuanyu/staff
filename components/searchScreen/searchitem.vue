<template>
	<view class="">
		<view class="" v-for="(objInfo,objIndex) in searchForm" :key="objIndex">
			<!-- 输入框 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-if="objInfo.form_type == 'input'">
					<view class="search">
						<input type="text" @input="(e)=>{changeInput(objInfo,e)}" class="searchInput" v-model="objInfo.value" placeholder-style="color:#999;font-size:24rpx;" :placeholder="objInfo.input_tips" />
					</view>
			</uni-collapse-item>
			<!-- 金额输入框 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'input-money'">
					<view class="search">
						<input type="digit" @input="(e)=>{changeInput(objInfo,e)}" class="searchInput" v-model="objInfo.value" placeholder-style="color:#999;font-size:24rpx;" :placeholder="objInfo.input_tips" />
					</view>
			</uni-collapse-item>
			<!-- 手机号输入框 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'input-mobile'">
					<view class="search">
						<input type="number" @input="(e)=>{changeInput(objInfo,e)}" class="searchInput" v-model="objInfo.value" placeholder-style="color:#999;font-size:24rpx;" :placeholder="objInfo.input_tips" />
					</view>
			</uni-collapse-item>
			<!-- 邮箱输入框 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'input-email'">
					<view class="search">
						<input type="text" @input="(e)=>{changeInput(objInfo,e)}" class="searchInput" v-model="objInfo.value" placeholder-style="color:#999;font-size:24rpx;" :placeholder="objInfo.input_tips" />
					</view>
			</uni-collapse-item>
			<!-- 开关 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'switch'">
					<view class="listwarp">
						<switch :checked="objInfo.value" style="transform: scale(0.7);" color="#008EFF" @change="(e)=>{changeSwitch(objInfo,e)}" />
					</view>
			</uni-collapse-item>
			<!-- 关联员工 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'staff'">
					<view class="listwarp">
						<view class="li" :class="objInfo.value ?'liactive':''" @click.stop="relationStaff(objInfo)" >
							{{objInfo.value ? objInfo.value.name : objInfo.input_tips}}
							<view class="clearStaff" v-if="objInfo.value" @click.stop="clearStaff">×</view>
						</view>
					</view>
			</uni-collapse-item>
			<!-- 关联客户 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'customer'">
					<view class="listwarp">
						<view class="li" :class="objInfo.value ?'liactive':''" @click.stop="relationCustomer(objInfo)" >
							{{objInfo.value ? objInfo.value.name : objInfo.input_tips}}
							<view class="clearStaff" v-if="objInfo.value" @click.stop="clearStaff">×</view>
						</view>
					</view>
			</uni-collapse-item>
			<!-- 关联联系人 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'contact'">
					<view class="listwarp">
						<view class="li" :class="objInfo.value ?'liactive':''" @click.stop="relationContact(objInfo)" >
							{{objInfo.value ? objInfo.value.name : objInfo.input_tips}}
							<view class="clearStaff" v-if="objInfo.value" @click.stop="clearStaff">×</view>
						</view>
					</view>
			</uni-collapse-item>
			<!-- 关联合同 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'contract'">
					<view class="listwarp">
						<view class="li" :class="objInfo.value ?'liactive':''" @click.stop="relationContract(objInfo)" >
							{{objInfo.value ? objInfo.value.name : objInfo.input_tips}}
							<view class="clearStaff" v-if="objInfo.value" @click.stop="clearStaff">×</view>
						</view>
					</view>
			</uni-collapse-item>
			<!-- 关联商机 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'business'">
					<view class="listwarp">
						<view class="li" :class="objInfo.value ?'liactive':''" @click.stop="relationBusiness(objInfo)" >
							{{objInfo.value ? objInfo.value.name : objInfo.input_tips}}
							<view class="clearStaff" v-if="objInfo.value" @click.stop="clearStaff">×</view>
						</view>
					</view>
			</uni-collapse-item>
			<!-- 关联部门 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'department'">
					<view class="listwarp">
						<view class="li" :class="objInfo.value ?'liactive':''" @click.stop="relationDepartment(objInfo)" >
							{{objInfo.value ? objInfo.value.name : objInfo.input_tips}}
							<view class="clearStaff" v-if="objInfo.value" @click.stop="clearStaff">×</view>
						</view>
					</view>
			</uni-collapse-item>
			<!-- 时间选择 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'DatePicker' || objInfo.form_type == 'TimePicker'">
				<view class="listwarp">
					<view 
						class="li" 
						:class="item.value == objInfo.value ?'liactive':''" 
						@click="changeTime(objInfo,index)" 
						v-for="(item,index) in timeList" :key="index">{{item.name}}</view>
				</view>
				<view class="time_warp" v-if="objInfo.value && objInfo.value == 'zidingyi'">
					<picker @change="(e)=>{changeStartTime(objInfo,e)}" mode="date">
						<view class="timebox">
							{{start_time ? start_time : '开始时间'}}
						</view>
					</picker>
					<view class="xian"></view>
					<picker @change="(e)=>{changeEndTime(objInfo,e)}" mode="date">
						<view class="timebox">
							{{end_time ? end_time : '结束时间'}}
						</view>
					</picker>
				</view>
			</uni-collapse-item>
			<!-- 文本输入框 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'textarea'">
					<view class="search">
						<textarea :value="objInfo.value ? objInfo.value : ''" :placeholder="objInfo.input_tips" @input="(e)=>{changeTextarea(objInfo,e)}" />
					</view>
			</uni-collapse-item>
			<!-- 数字输入框 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'input-number'">
					<view class="search">
						<input type="digit" class="searchInput" v-model="objInfo.value" @input="(e)=>{changeInputNumber(objInfo,e)}" placeholder-style="color:#999;font-size:24rpx;" :placeholder="objInfo.input_tips" />
					</view>
			</uni-collapse-item>
			<!-- 单选框 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'radio'">
					<view class="li_box_radio">
						<view class="ra_box" v-for="(item,index) in objInfo.content" :key="index" @click="changeRadio(objInfo,item)">
							<radio :value="item" color="#008EFF" :checked="item == objInfo.value" />{{item}}
						</view>
					</view>
			</uni-collapse-item>
			<!-- 多选框 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'checkbox'">
					<view class="li_box_radio">
						<checkbox-group @change="(e)=>{changeCheckbox(objInfo,e)}" style="display: flex;justify-content: flex-start;flex-wrap: wrap;" :value="objInfo.value">
							<label class="" style="margin-right:15rpx;margin-bottom:25rpx;display: block;" v-for="(item,index) in objInfo.content" :key="index">
								<checkbox class="checkbox" color="#ff7800" :value="item" :checked="objInfo.value.indexOf(item) != -1"/>
								<span>{{item}}</span>
							</label>
						</checkbox-group>
					</view>
			</uni-collapse-item>
			<!-- 评分 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'Rate'">
					<view class="listwarp">
						<uni-rate :size="18" @change="(e)=>{changeRate(objInfo,e)}" v-model="objInfo.value" />
					</view>
			</uni-collapse-item>
			<!-- 区域 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'Cascader'">
				<!-- #ifdef MP-WEIXIN -->
				<picker @change="(e)=>{changeAddress(objInfo,e)}" mode="region">
					<view class="address_warp">
						<view class="address_li">{{objInfo.value ? objInfo.value : objInfo.input_tips}}</view>
					</view>
				</picker>
				<!-- #endif -->
				<!-- #ifdef H5 || APP-PLUS -->
				<view class="address_warp" @click="changeAddressData(objInfo)">
					<view class="address_li">{{objInfo.value ? objInfo.value : objInfo.input_tips}}</view>
				</view>
				<lotus-address @choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
				<!-- #endif -->
			</uni-collapse-item>
			<!-- 选择 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'select'">
				<view class="listwarp">
					<view class="li" :class="item.label == objInfo.value ?'liactive':''" @click="changeFollow(objInfo,item)"
						v-for="(item,index) in objInfo.content" :key="index">{{item.label}}</view>
				</view>
			</uni-collapse-item>
			<!-- 标签 -->
			<uni-collapse-item :title="objInfo.name" :name="objInfo.field" v-else-if="objInfo.form_type == 'label'">
				<view class="label_warp" @click="toSelectLabel(objInfo)">
					<view class="label_box" v-if="objInfo.value">
						<span
							class="label_style" 
							v-for="(laItem,laIndex) in objInfo.value_arr" 
							:key="laIndex" 
							:style="{color:laItem.color,border:'1rpx solid ' + laItem.color}"
						>{{laItem.label}}</span>
					</view>
					<view class="no_label" v-else>
						{{objInfo.input_tips}}
					</view>
				</view>
			</uni-collapse-item>
		</view>
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
		<!-- 部门 -->
		<tki-tree ref="tkitree"
			:range="treeList" 
			:rangeKey="rangeKey"
			:idKey="idKey"
			:selectParent="selectParent"
			:multiple="multiple"
			confirmColor="#008EFF"
			@confirm="selectTree"
		/>
	</view>
</template>

<script>
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	import selectStaff from '@/components/selectStaff.vue'
	import selectCustomer from '@/components/selectCustomer.vue'
	import selectBusiness from '@/components/selectBusiness.vue'
	import selectContract from '@/components/selectContract.vue'
	import selectContact from '@/components/select_contact.vue'
	import lotusAddress from '@/components/lotusAddress/lotusAddress.vue'
	
	export default{
		components:{
			tkiTree,selectStaff,selectCustomer,selectBusiness,selectContract,selectContact, lotusAddress
		},
		props:{
			searchForm: {
				type:Array,
				default:[]
			}
		},
		data() {
			return{
				timeList:[
					{value:'today',name:'今天'},
					{value:'yesterday',name:'昨天'},
					{value:'tomorrow',name:'明天'},
					{value:'thisweek',name:'本周'},
					{value:'lastweek',name:'上周'},
					{value:'nextweek',name:'下周'},
					{value:'thismonth',name:'本月'},
					{value:'lastmonth',name:'上月'},
					{value:'nextmonth',name:'下月'},
					{value:'thisquarter',name:'本季'},
					{value:'lastquarter',name:'上季'},
					{value:'nextquarter',name:'下季'},
					{value:'thisyear',name:'今年'},
					{value:'lastyear',name:'去年'},
					{value:'nextyear',name:'下一年'},
					{value:'zidingyi',name:'自定义'}
				],
				timeIndex:null,
				start_time:'',
				end_time:'',
				treeList:[],
				rangeKey:'label',
				idKey:'nodeKey',
				selectParent:false,
				multiple:false,
				lotusAddressData:{
					visible:false,
					provinceName:'',
					cityName:'',
					townName:'',
				},
				currentObj:{},   //当前编辑的obj
			}
		},
		created() {
		},
		methods:{
			changeStartTime(obj,e) {
				this.currentObj = obj
				this.start_time = e.detail.value
				this.$emit('changeSearchData',this.objInfo.field,'start_time',e.detail.value)
			},
			changeEndTime(obj,e) {
				this.currentObj = obj
				this.end_time = e.detail.value
				this.$emit('changeSearchData',this.objInfo.field,'end_time',e.detail.value)
			},
			changeTime(obj,index) {
				this.currentObj = obj
				this.timeIndex = index
				let value = this.timeList[this.timeIndex].value
				this.$emit('changeSearchData',this.currentObj.field,'value',value)
				this.$emit('chageResize')
			},
			//输入框
			changeInput(obj,e) {
				this.currentObj = obj
				let value = e.detail.value
				this.$emit('changeSearchData',this.currentObj.field,'value',value)
			},
			//文本框
			changeTextarea(obj,e) {
				this.currentObj = obj
				let value = e.detail.value
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//数字输入框
			changeInputNumber(obj,e) {
				this.currentObj = obj
				let value = e.detail.value
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//单选框
			changeRadio(obj,item) {
				this.currentObj = obj
				this.$emit('changeSearchData', this.currentObj.field, 'value',item)
			},
			//多选框
			changeCheckbox(obj,e) {
				this.currentObj = obj
				let arr = e.detail.value
				this.$emit('changeSearchData', this.currentObj.field, 'value',arr.join(','))
			},
			//评分
			changeRate(obj,e) {
				this.currentObj = obj
				this.$emit('changeSearchData', this.currentObj.field, 'value', e.value)
			},
			//地区
			changeAddress(obj,e) {
				this.currentObj = obj
				let arr = e.detail.value
				this.$emit('changeSearchData', this.currentObj.field, 'value',arr.join(','))
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
			//选择省市区
			choseValue(e) {
				this.lotusAddressData = Object.assign({},this.lotusAddressData,e)
				if(e.province){
					let value = e.province+'/'+e.city+'/'+e.town
					this.$emit('changeSearchData', this.currentObj.field, 'value',value)
				}
			},
			//下拉选择
			changeFollow(obj,item) {
				this.currentObj = obj
				let value = item.label
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//开关
			changeSwitch(obj,e) {
				this.currentObj = obj
				let value = e.detail.value
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//关联员工
			relationStaff(obj) {
				this.currentObj = obj
				this.$refs.staffChild.init()
			},
			sureStaff(obj) {
				let value = obj
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//关联客户
			relationCustomer(obj) {
				this.currentObj = obj
				this.$refs.customerChild.init()
			},
			getCustomerinfo(obj) {
				let value = obj
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//关联联系人
			relationContact(obj) {
				this.currentObj = obj
				this.$refs.contactChild.init()
			},
			sureContact(obj) {
				let value = obj
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//关联 商机
			relationBusiness(obj) {
				this.currentObj = obj
				this.$refs.businessChild.init()
			},
			sureBusiness(obj) {
				let value = obj
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//关联 合同
			relationContract(obj) {
				this.currentObj = obj
				this.$refs.contractChild.init()
			},
			contractInfo(obj) {
				let value = obj
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//部门
			getDepartList() {
				netDepartmentTree().then(res=>{
					this.treeList = res.data
					this.rangeKey = 'name'
					this.idKey = 'id'
					this.selectParent = true
					this.multiple = false
				})
			},
			relationDepartment(obj) {
				this.currentObj = obj
				this.getDepartList()
				this.$refs.tkitree._show()
			},
			selectTree(obj) {
				let value
				if(this.currentObj.form_type == 'label'){
					value = obj
					this.$emit('chageResize')
				}else if(this.currentObj.form_type == 'department'){
					value = {id:obj[0].id,name:obj[0].name}
				}
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			clearStaff() {
				let value = ''
				this.$emit('changeSearchData', this.currentObj.field, 'value',value)
			},
			//标签
			toSelectLabel(obj){
				this.currentObj = obj
				this.rangeKey = 'label'
				this.idKey = 'value'
				this.treeList = obj.content
				this.selectParent = false
				this.multiple = true
				this.$refs.tkitree._show()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.label_warp{
		width:400rpx;
		border-radius: 10rpx;
		border:1rpx solid $uni-btn-bg-color;
		font-size:24rpx;
		color:#999;
		margin:25rpx 0 25rpx 40rpx;
		min-height:50rpx;
		.no_label{
			line-height: 50rpx;
		}
		.label_box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.label_style{
				margin:0 8rpx;
				border-radius: 8rpx;
				padding:5rpx;
			}
		}
	}
	.search{
		display: flex;
		align-items: center;
		width:400rpx;
		height:60rpx;
		margin:25rpx 0 25rpx 40rpx;
		border-radius: 10rpx;
		border:1rpx solid $uni-btn-bg-color;
		padding:0 24rpx;
		.searchInput{
			width:350rpx;
			font-size:24rpx;
			color:#666;
		}
	}
	.listwarp{
		width:600rpx;
		margin:0 auto;
		padding:25rpx 0;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		.li{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 172rpx;
			height: 54rpx;
			background: #ededed;
			border: 1rpx solid #ededed;
			border-radius: 10rpx;
			font-size:27rpx;
			color:#999;
			margin-right:40rpx;
			margin-bottom:20rpx;
			position: relative;
			&:nth-child(3n){
				margin-right:0;
			}
			.clearStaff{
				position: absolute;
				right:-20rpx;
				top:-20rpx;
				font-size:28rpx;
				width:40rpx;
				height:40rpx;
				background:rgba(0,0,0,0.5);
				border-radius: 50%;
				text-align: center;
				line-height: 38rpx;
				color:#fff;
			}
		}
		.liactive{
			color:#666;
			border: 1rpx solid $uni-btn-bg-color;
			background:#fff;
		}
	}
	.time_warp{
		margin:0 auto;
		width:600rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.timebox{
			width: 172rpx;
			height: 54rpx;
			border-radius: 10rpx;
			text-align: center;
			line-height: 50rpx;
			font-size:27rpx;
			color:#666;
			border:1rpx solid $uni-btn-bg-color;
		}
		.xian{
			width:85rpx;
			height:7rpx;
			background:#ededed;
			margin:0 20rpx;
		}
		.timeactive{
			background:#0287FF;
			color:#fff;
		}
	}
	.li_box_radio{
		margin:24rpx 0;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		.ra_box{
			display: flex;
			justify-content: center;
			margin-right:15rpx;
			radio{
				transform: scale(0.7);
			}
		}
	}
	.address_warp {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx;
		border-bottom: 1rpx solid #ededed;
		.address_li {
			color: #999;
		}
	}
</style>