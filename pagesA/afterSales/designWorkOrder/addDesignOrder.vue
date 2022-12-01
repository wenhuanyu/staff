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
				<input type="text" placeholder-style="font-size:24rpx;color:#999;" :class="title ? 'valueActive' : '' "  v-model="title" placeholder="填写工单标题" />
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
					<view class="proli_bot">
						<view class="fllow_form">
							<view class="key">交期时间</view>
							<picker @change="(e)=>{changeProductTime(e,index)}"  mode="date">
								<view class="form_right">
									<view :class="item.end_date ? 'valueActive' : '' ">{{item.end_date ? item.end_date : '交期时间'}}</view>
									<view class="iconfont icon-you"></view>
								</view>
							</picker>
						</view>
						<view class="fllow_area">
							<view class="area_head">备注</view>
							<textarea v-model="item.desc" style="height:150rpx" class="textself" placeholder="备注" placeholder-style="color:#999" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="key">交期变更<span>*</span></view>
			<view class="form_right">
				<radio-group class="radiowarp" >
					<view class="" style="margin-right:24rpx" @click="changeRadio(0)">
						<radio value="0" color="#008EFF" :checked="is_replace == 0" />不允许
					</view>
					<view class="" @click="changeRadio(1)">
						<radio value="1" color="#008EFF" :checked="is_replace == 1" />允许
					</view>
				</radio-group>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">不得迟于<span>*</span></view>
			<picker @change="changeTime"  mode="date">
				<view class="form_right">
					<view :class="appointment_time ? 'valueActive' : '' ">{{appointment_time ? appointment_time : '不得迟于'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_area" v-if="!isRequired">
			<view class="area_head">特殊要求</view>
			<textarea v-model="desc" class="textself" placeholder="特殊要求" placeholder-style="color:#999" />
		</view>
		
		<upload-img v-if="!isRequired" :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="button" @click="$noMultipleClicks(submitWorkOrder)">确定</view>
		<view class="botsec"></view>
		
		<select-work-product
			:customerinfo="customerObj" 
			ref="workProduct" 
			@selectList="selectProduct"
		></select-work-product>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { netLianxiren, netAddWorkOrder, netWorkOrderNumber, netAddVisitplant } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import selectWorkProduct from '@/components/selectProduct/index'
	
	
	export default{
		mixins:[commonFun],
		components:{
			selectWorkProduct
		},
		data() {
			return{
				noClick:true,    //防止  重复点击
				workorder_number:'',
				title:'',
				contactsList:[],
				contactsIndex:null,
				productList:[],
				is_replace:'0',   //交期变更  0不允许  1允许
				appointment_time:'',
				desc:'',
				type:1,//1工单  2任务任务
				imgList:[],   //相关附件
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj
		}),
		watch:{
			customerObj(newobj,oldobj){
				if(newobj){
					//获取 客户联系人
					this.getCustomerLink()
				}
			}
		},
		onLoad(options) {
			this.$store.commit('CUSTOMEROBJ',null)
			this.type = options.type
			this.getNumber()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			getNumber() {
				netWorkOrderNumber().then(res=>{
					this.workorder_number = res.data.number
				})
			},
			//交期变更
			changeRadio(type) {
				this.is_replace = type
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
			changeTime(e) {
				this.appointment_time = e.detail.value
			},
			//选择 产品
			seProduct() {
				this.$refs.workProduct.init()
			},
			selectProduct(arr) {
				let newArr = []
				arr.forEach(ele=>{
					newArr.push({
						id:ele.id,
						name:ele.name,
						img:ele.img,
						number:ele.number,
						time:'',
						desc:''
					})
				})
				let data = this.productList.concat(newArr)
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
			changeProductTime(e,index) {
				let time = e.detail.value
				let obj = this.productList[index]
				obj.end_date = time
				this.$set(this.productList,index,obj)
			},
			submitWorkOrder() {
				if(!this.title){
					uni.showToast({
						title:'请填写工单标题',
						icon:'none'
					})
					return
				}
				if(!this.customerObj){
					uni.showToast({
						title:'请选择客户',
						icon:'none'
					})
					return
				}
				//产品
				let proarr = []
				let p = []
				this.productList.forEach((ele)=>{
					p.push(ele.id)
					proarr.push({
						product_id:ele.id,
						number: ele.number,
						end_date:ele.end_date,
						desc:ele.desc
					})
				})
				if(proarr.length == 0) {
					uni.showToast({
						title:'请选择产品',
						icon:'none'
					})
					return
				}
				
				let img = []
				this.imgList.forEach(ele=>{
					img.push(ele.id)
				})
				
				let params = {
					workorder_number:this.workorder_number,
					title:this.title,
					file_ids:img.join(','),
					workorder_type:'设计工单',
					customer_product_id: p.join(','),
					product:proarr,
					appointment_time:this.appointment_time,
					contacts_id: this.contactsList[this.contactsIndex].id,
					desc:this.desc,
					is_replace:this.is_replace
				}
				if(this.type == 1) {
					params.customer_id = this.customerObj.id
					netAddWorkOrder(params).then(res=>{
						uni.showToast({
						    title: res.msg,
							icon:'none',
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					})
				}else if(this.type == 2) {
					params.relation_id = this.customerObj.id
					params.event_type = ['设计工单']
					netAddVisitplant(params).then(res=>{
						uni.showToast({
						    title: res.msg,
							icon:'none',
						})
						setTimeout(()=>{
							uni.redirectTo({
								url:'/pagesA/customerInfo/visit/visitList'
							})
						},2000)
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
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
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #333;
			text{
				color:#F00;
			}
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
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
		
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
			.location{
				width:300rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
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
	.fllow_area {
		background-color: #fff;
		padding: 0 30rpx 30rpx;
		margin-bottom: 30rpx;
		border-bottom:1rpx solid #EDEDED;
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
</style>
