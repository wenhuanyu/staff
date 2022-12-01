<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
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
				<input type="text" :class="title ? 'valueActive' : '' "  v-model="title" placeholder="填写工单标题" />
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
		<view class="fllow_form">
			<view class="key">详细地址<span>*</span></view>
			<view class="form_right" >
				<input type="text" :class="address_detail ? 'valueActive' : '' "  v-model="address_detail" placeholder="请填写详细地址 " />
			</view>
		</view>
		<view v-if="workorder_type == '上门维修'">
			<view class="fllow_form">
				<view class="key">问题类型<span>*</span></view>
				<view class="form_right" @click="toSelectProblem">
					<view>{{problemParent.name ? problemParent.name : '请选择问题类型'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</view>
			<view class="que_list" v-if="problemList.length != 0">
				<view class="que_li" v-for="(item,index) in problemList" :key="index">
					<view class="iconfont icon-jian" @click="delProblem(index)"></view>
					<view class="que_titq">{{item.name}}</view>
				</view>
			</view>
		</view>
		
		<view class="inp_warp">
			<view class="inp_title key">配件<span>*</span></view>
			<view class="add_in" @click="addParts">
				<view class="iconfont icon-jiahaocu"></view>
				添加配件
			</view>
		</view>
		<view class="prolist" v-if="partsList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in partsList" :key="index">
					<view class="iconfont icon-jian" @click="delParts(index)"></view>
					<view class="protext" style="text-align: center;width:160rpx">{{item.name}}</view>
					<view>
						<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="fllow_area">
			<view class="area_head">情况说明</view>
			<textarea v-model="desc" class="textself" placeholder="情况说明" placeholder-style="color:#999" />
		</view>
		
		<view class="fllow_form">
			<view class="key">预约时间<span>*</span></view>
			<select-time-picker
				fields="minute" 
				:start="nowTimeDate"
				placeholder="预约时间" 
				:defaultValue="appointment_time"
				@change="changeTime"
			></select-time-picker>
		</view>
		
		<view class="fllow_form">
			<view class="key">紧急程度<span>*</span></view>
			<picker @change="changePriori"  :range="priarr" :value="priIndex">
				<view class="form_right">
					<view :class="priarr[priIndex] ? 'valueActive' : '' ">{{priarr[priIndex] ? priarr[priIndex] : '预约时间'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<!-- 上传图片 -->
		<upload-img :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="fllow_form">
			<view class="key">指派员工<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(submitWorkOrder)">提交</view>
		<view class="botsec"></view>
		
		<select-work-parts
			ref="partsChild" 
			@selectList="selectParts"
		></select-work-parts>
		
	</view>
</template>

<script>
	import { netWorkOrderNumber, netLianxiren, netCustomerAddress, netAddWorkOrder, 
	netCustomerContractInfo, netPrevCustomer, netWorkOrderDetail } from '@/api/api.js'
	import { dateTimePicker, getMonthDay, getNewDateArry } from '@/utils/dateTimePicker.js'
	import { mapState } from 'vuex'
	import { BASE_URL, SIGN_NO, BASE_IMG_URL } from '@/api/http.js'
	import selectWorkParts from '@/components/selectWorkParts/index'
	import {commonFun} from '@/common/navigate.js'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	
	export default{
		mixins:[commonFun],
		components:{
			selectWorkParts,
			selectTimePicker
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				workorder_number:'',  //工单编号 自动生成
				title:'',  //工单标题
				customer_id:'',  //客户id
				contacts_id:'',   //客户联系人
				contactsList:[],
				contactsIndex:null,
				address:'',  //省市区 （从客户地址接口获取）
				address_detail:'',   //详细地址
				lng:'',
				lat:'',
				contractList:[],  //合同列表
				contractIndex:null,
				partsList:[],
				
				customer_product_id:'',  //客户产品id 1,2,3,4
				desc:'',   //情况说明
				files:'',   //附件列表
				owner_staff_id:'',  //指派员工
				imgList:[],
				nowTimeDate:'',
				appointment_time:'',   //预约时间
				priority:'',   //紧急情况
				priarr:['一般','紧急','非常紧急'],
				priIndex:0,
				workorder_type:'配件安装',
				relation_id:'',   //关联id
			}
		},
		onLoad(options) {
			//当前时间
			let arr = getNewDateArry()
			this.nowTimeDate = `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}`
			this.relation_id = options.relationid
			this.$store.commit('CUSTOMEROBJ',null)
			if(options.customerid){
				this.customer_id = options.customerid
				//获取默认的客户
				this.getDefaultCustomer()
			}
			//获取工单编号
			this.getNumber()
			//获取相关得配件
			this.getWorkDetail()
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
			staffObj: state => state.customer.staffObj,
			problemParent: state => state.customer.problemParent,
			problemList: state => state.customer.problemList
		}),
		watch:{
			customerObj(newobj,oldobj){
				if(newobj){
					//获取 客户联系人
					this.getCustomerLink()
					//获取 客户 地址
					this.getCustomerInfo()
					//获取 客户 相关  合同
					//this.getCustomerContract()
				}
			}
		},
		onUnload() {
			this.$store.commit('CUSTOMEROBJ',null)
			this.$store.commit('STAFFOBJ',null)
		},
		onShow() {
			this.showProduct = false
		},
		methods:{
			//获取客户 配件
			getWorkDetail() {
				netWorkOrderDetail({id:this.relation_id}).then(res=>{
					this.partsList = res.data.parts
				})
			},
			//获取默认的客户
			getDefaultCustomer () {
				netPrevCustomer({id:this.customer_id}).then(res=>{
					this.$store.commit('CUSTOMEROBJ',res.data.data[0])
				})
			},
			//下次联系时间
			changeTime(dt) {
				this.appointment_time = dt.f3
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
			//选择 问题类型
			toSelectProblem() {
				uni.navigateTo({
					url: '/pages/index/orderSettlement/problem_type'
				})
			},
			//删除  问题类型
			delProblem(index) {
				this.problemList.splice(index,1)
				this.$store.commit('SETPROBLEMLIST',this.problemList)
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
			//添加 配件
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
			delParts(index) {
				this.partsList.splice(index,1)
			},
			//修改 配件 数量
			changeNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e
				this.$set(this.partsList,index,obj)
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
					workorder_type
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
				this.partsList.forEach((ele)=>{
					proarr.push({
						id:ele.id,
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
				if(workorder_type == '上门维修' && this.problemList.length == 0){
					uni.showToast({
						title:'请选择问题类型',
						icon:'none'
					})
					return
				}
				let typeid = []
				this.problemList.forEach(ele=>{
					typeid.push(ele.id)
				})
				let params = {
					title,workorder_number,address,address_detail,lng,lat,desc,
					customer_id:customerObj.id,
					contacts_id: contactsList[contactsIndex].id,
					owner_staff_id: staffObj.id,
					file_ids: arr.join(','),
					parts: proarr,
					workorder_type,
					priority: priarr[priIndex],
					appointment_time,
					aftermarket_type_ids: typeid.join(','),
					relation_workorder_id:this.relation_id
				}
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
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
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
					margin-bottom:15rpx;
				}
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx 40rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
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
