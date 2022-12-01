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
				<input type="text" placeholder-style="color:#999;font-size:24rpx" :class="title ? 'valueActive' : '' "  v-model="title" placeholder="填写工单标题" />
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
			<view class="form_right" @click="toSelectContact">
				<view :class="contactObj ? 'valueActive' : '' ">{{contactObj ? contactObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
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
			<view class="inp_title key">产品<span>*</span></view>
			<view class="add_in" @click="seProduct">
				<view class="iconfont icon-jiahaocu"></view>
				添加产品
			</view>
		</view>
		<view class="prolist" v-if="productList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in productList" :key="index">
					<view class="proli_top">
						<view class="iconfont icon-jian" @click="delProduct(index)"></view>
						<view class="protext" style="text-align: center;width:240rpx">{{item.name}}</view>
						<view class="protext">
							<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fllow_area" v-if="!isRequired">
			<view class="area_head">情况说明</view>
			<textarea v-model="desc" :class="desc ? 'valueActive' : '' " class="textself" placeholder="情况说明" placeholder-style="color:#999" />
		</view>
		<view class="fllow_form" v-if="type != '产品发货' && !isRequired">
			<view>预约时间</view>
			<picker @change="changeTime"  mode="date">
				<view class="form_right">
					<view :class="appointment_time ? 'valueActive' : '' ">{{appointment_time ? appointment_time : '预约时间'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_form">
			<view class="key">紧急程度<span>*</span></view>
			<picker @change="changePriori"  :range="priarr" :value="priIndex">
				<view class="form_right">
					<view :class="priarr[priIndex] ? 'valueActive' : '' ">{{priarr[priIndex] ? priarr[priIndex] : '紧急程度'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<!-- 上传图片 -->
		<upload-img  v-if="!isRequired" :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="fllow_form">
			<view class="key">指派员工<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="button" @click="$noMultipleClicks(submitWorkOrder)">提交</view>
		<view class="botsec"></view>
		<!-- 选择产品 -->
		<select-work-product 
			ref="workProduct" 
			@selectList="selectProduct"
			:isChangeNumber="type == '产品发货'"
		></select-work-product>
		
		<!-- 选择客户的联系人 -->
		<select-contact
			ref="contactChild"
			@sureContact="sureContact"
		></select-contact>
	
	</view>
</template>

<script>
	import { netWorkOrderNumber, netLianxiren, netCustomerAddress, netAddWorkOrder, 
	netCustomerContractInfo, netWorkOrderDetail, netEditWorkorder } from '@/api/api.js'
	import { mapState } from 'vuex'
	import { BASE_URL, SIGN_NO, BASE_IMG_URL } from '@/api/http.js'
	import selectWorkProduct from '@/components/selectProduct/index'
	import {commonFun} from '@/common/navigate.js'
	import selectContact from '@/components/select_contact.vue'
	
	export default{
		mixins:[commonFun],
		components:{
			selectWorkProduct,
			selectContact
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				workorder_number:'',  //工单编号 自动生成
				title:'',  //工单标题
				customer_id:'',  //客户id
				contacts_id:'',   //客户联系人
				contactObj:null,
				contactsList:[],
				contactsIndex:null,
				address:'',  //省市区 （从客户地址接口获取）
				address_detail:'',   //详细地址
				
				delivery_address:'',   //配送地址,
				delivery_address_detail:'',   //配送的详细地址
				consignee:'',    //收货人姓名
				consignee_mobile:'',    //收货人联系电话
				
				lng:'',
				lat:'',
				contractList:[],  //合同列表
				contractIndex:null,
				productList:[],
				
				customer_product_id:'',  //客户产品id 1,2,3,4
				
				desc:'',   //情况说明
				files:'',   //附件列表
				owner_staff_id:'',  //指派员工
				imgList:[],
				appointment_time:'',   //预约时间
				priority:'',   //紧急情况
				priarr:['一般','紧急','非常紧急'],
				priIndex:0,
				is_install:1,  //1是  0否    是否需要安装
				type:'',   //工单类型
				workorderid:'',
				isRequired:false,  //是否只展示必填字段
			}
		},
		onLoad(options) {
			this.$store.commit('CUSTOMEROBJ',null)
			this.type = options.type
			if(options.id) {
				this.workorderid = options.id
				//获取客户详情
				this.getWorkDetail()
			}else{
				//获取工单编号
				this.getNumber()
			}
			if(this.type == '产品发货'){
				uni.setNavigationBarTitle({
					title:'产品配送'
				})
			}else if(this.type == '生产工单'){
				uni.setNavigationBarTitle({
					title:'生产工单'
				})
			}else if(this.type == '设计工单'){
				uni.setNavigationBarTitle({
					title:'设计工单'
				})
			}
			
		},
		onShow() {
			
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
			staffObj: state => state.customer.staffObj
		}),
		watch:{
			customerObj(newobj,oldobj){
				if(newobj){
					//获取 客户联系人
					this.getCustomerLink()
					//获取 客户 地址
					this.getCustomerInfo()
					//获取 客户 相关  合同
					this.getCustomerContract()
				}
			}
		},
		onUnload() {
			this.$store.commit('CUSTOMEROBJ',null)
			this.$store.commit('STAFFOBJ',null)
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			toSelectContact() {
				if(!this.customerObj){
					uni.showToast({
						title:'请选择客户',
						icon:'none'
					})
					return
				}
				
				this.$refs.contactChild.init(this.customerObj.id)
			},
			sureContact(obj) {
				this.contactObj = obj
			},
			///////////////////////////////////////////////////////////////////////////////
			//工单详情
			getWorkDetail() {
				netWorkOrderDetail({id:this.workorderid}).then(res=>{
					res = res.data
					this.title = res.title
					this.workorder_number = res.workorder_number
					
					this.$store.commit('CUSTOMEROBJ',res.customer)
					this.$store.commit('STAFFOBJ',res.owner_staff)
					this.address = res.address
					this.address_detail = res.address_detail
					this.lat = res.lat
					this.lng = res.lng
					//处理产品信息
					this.productList = res.product
					this.desc = res.desc
					this.appointment_time = res.appointment_time
					//处理紧急程度
					this.handleJinji(res.priority)
					//处理附件
					this.imgList = res.file?res.file:[]
				})
			},
			//处理紧急任务
			handleJinji(name) {
				this.priarr.forEach((ele,index)=>{
					if(ele == name) {
						this.priIndex = index
					}
				})
			},
			getNumber() {
				netWorkOrderNumber().then(res=>{
					this.workorder_number = res.data.number
				})
			},
			//去选择客户
			toSelectCustomer() {
				uni.navigateTo({
					url:'/pages/template/relation_customer'
				})
			},
			//获取 客户 联系人
			getCustomerLink() {
				netLianxiren({customer_id:this.customerObj.id}).then(res=>{
					this.contactsList = res.data
					this.contactsIndex = 0
					
					this.contactObj = res.data[0]
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
			},
			//获取 客户 合同 列表
			getCustomerContract() {
				netCustomerContractInfo({customer_id:this.customerObj.id,limit:1000,page:1}).then(res=>{
					this.contractList = res.data
					this.contractIndex = 0
				})
			},
			//选择客户 合同
			changeContract(e) {
				this.contractIndex = e.detail.value
			},
			//选择 产品
			seProduct() {
				this.$refs.workProduct.init()
			},
			selectProduct(arr) {
				let data = arr.concat(this.productList)
				this.productList = this.deWeight(data)
			},
			delProduct(index) {
				this.productList.splice(index,1)
			},
			changeNumber(e,index) {
				let obj = this.productList[index]
				obj.number = e
				this.$set(this.productList,index,obj)
			},
			//预约时间
			changeTime(e) {
				this.appointment_time = e.detail.value
			},
			//紧急程度
			changePriori(e) {
				this.priIndex = e.detail.value
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//是否需要安装
			changeRadio(e) {
				this.is_install = e.detail.value
			},
			//去选择 指派员工
			toSelectStaff() {
				uni.navigateTo({
					url:'/pages/template/relation_staff'
				})
			},
			//提交
			submitWorkOrder() {
				let {
					workorder_number,  //工单编号 自动生成
					title,  //工单标题
					customer_id,  //客户id
					customerObj,
					contacts_id,   //客户联系人
					contactsList,
					contactsIndex,
					address,  //省市区 （从客户地址接口获取）
					address_detail,   //详细地址
					lng,
					lat,
					desc,   //情况说明
					imgList,
					staffObj,
					appointment_time,   //预约时间
					priority,
					priarr,
					priIndex,
					productList
				} = this
				if(!title){
					uni.showToast({
						title:'请填写工单标题',
						icon:'none'
					})
					return
				}
				if(!customerObj){
					uni.showToast({
						title:'请选择客户',
						icon:'none'
					})
					return
				}
				if(!this.contactObj){
					uni.showToast({
						title:'请选择客户联系人',
						icon:'none'
					})
					return
				}
				if(!address_detail){
					uni.showToast({
						title:'请填写详细地址',
						icon:'none'
					})
					return
				}
				if(!staffObj){
					uni.showToast({
						title:'请指派员工',
						icon:'none'
					})
					return
				}
				//图片
				let arr = []
				imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				//产品
				let proarr = []
				let p = []
				productList.forEach((ele)=>{
					p.push(ele.id)
					proarr.push({
						product_id:ele.id,
						number: ele.number
					})
				})
				if(proarr.length == 0) {
					uni.showToast({
						title:'请选择产品',
						icon:'none'
					})
					return
				}
				
				let params = {
					title,
					workorder_number,
					address,
					address_detail,
					lng,
					lat,
					desc,
					delivery_address:address,
					delivery_address_detail:address_detail,
					consignee:this.contactObj.name,
					consignee_mobile:this.contactObj.mobile,
					
					customer_id:customerObj.id,
					contacts_id: this.contactObj.id,
					owner_staff_id: staffObj.id,
					file_ids: arr.join(','),
					customer_product_id: p.join(','),
					product:proarr,
					workorder_type:this.type,
					appointment_time,
					priority: priarr[priIndex],
					is_install:this.is_install,
					desc:this.desc
				}
				if(this.workorderid) {
					params.id = this.workorderid
					netEditWorkorder(params).then(res=>{
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
				}else{
					netAddWorkOrder(params).then(res=>{
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
	}
</script>

<style lang="scss" scoped>
	.pbt_img {
		padding: 24rpx 34rpx;
		background: #fff;
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
			color:$uni-color-primary;
			.icon-jiahaocu{
				font-size:28rpx;
				color:$uni-color-primary;
				margin-right:5rpx;
			}
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		.nameinput{
			width:500rpx;
		}
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			text-align: right;
			.location{
				width:300rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
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
		.theme {
			color: #5ca9fe;
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
		.form_input {
			input {
				width:300rpx;
				text-align: right;
				height: 100rpx;
				line-height: 100rpx;
				text-align: right;
				margin-right: 10rpx;
			}
		}
	}
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #f5f5f5;
				&:last-child{
					border-bottom:0;
				}
				.proli_top{
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
						margin-bottom:15rpx;
					}
				}
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:0 30rpx 30rpx;
		margin-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			color:#666;
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
		border-bottom: 1rpx solid #EAEAEA;
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
