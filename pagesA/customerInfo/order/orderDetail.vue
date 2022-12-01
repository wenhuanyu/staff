<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title">合同编号<text>*</text></view>
			<view class="form_right">
				<input type="text" v-model="num" disabled placeholder="请输入订单编号" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">客户名称<text>*</text></view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="selectCustomerObj ? 'valueActive' : '' ">{{selectCustomerObj ? selectCustomerObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">客户签约人<text>*</text></view>
			<picker @change="changeContact" :range="contactList" :value="contactIndex" :range-key="'name'">
				<view class="form_right">
					<view :class="contactList[contactIndex] ? 'valueActive' : '' ">
						{{contactList[contactIndex] ? contactList[contactIndex].name : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title">购买产品<text>*</text></view>
			<view class="add_in" @click="addPart">
				<view class="iconfont icon-jiahaocu"></view>
				添加产品
			</view>
		</view>
		<view class="pro_warp" v-if="productList.length != 0">
			<view class="li_warp" v-for="(item,index) in productList" :key="index">
				<van-swipe-cell :right-width="45">
					<view class="cell_con">
						<view class="contitle">{{item.name}}</view>
						<view class="context">编号：{{item.num}}</view>
						<view class="context">规格：{{item.unit}}</view>
						<view class="conbot">
							<view class="conmoney">￥{{item.price}}</view>
							<view class="conright">
								<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
							</view>
						</view>
					</view>
					<view slot="right" class="right_del_btn" @click="delProduct(index)">删除</view>
				</van-swipe-cell>
			</view>
			<view class="total_money">
				合计：<span>￥{{totalMoney}}</span>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">优惠金额<text>*</text></view>
			<view class="form_right">
				<input type="text" v-model="discountMoney" @change="changeDiscountmoney" placeholder="优惠金额" class="rightinput" :class="discountMoney ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">订单金额<text>*</text></view>
			<view class="form_right">
				<input type="text" v-model="money" placeholder="订单金额" class="rightinput" :class="money ? 'valueActive' : '' ">
			</view>
		</view>
		<form-item v-if="listForm" :listForm="listForm" @changeData="changeOtherData"></form-item>
		
		<!-- 审核信息 -->
		<examine-people :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(createOrder)">提交</view>
		<view class="botsec"></view>
		<!-- 添加产品 -->
		<popup-list ref="productChild" @selectList="selectList"></popup-list>
		<!-- 选择客户 -->
		<customer-popup ref="refChild" @getCustomerinfo="getCustomerinfo"></customer-popup>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem'
	import popupList from '@/components/selectProduct/index'
	import customerPopup from '@/components/selectCustomer/index'
	import { netSetForm, netPrevCustomer, netLianxiren, netAutoOrderNumber, netCreateContract} from '@/api/api.js'
	
	export default{
		components:{
			formItem,
			popupList,
			customerPopup
		},
		data(){
			return{
				noClick:true,    //防止  重复点击
				remindPeople:[],
				examineType:'contract',
				imgList:[],
				listForm:null,
				customer_id:'',   //客户id
				selectCustomerObj:{},  //默认的客户信息
				contactList:[],  //客户签约人
				contactIndex:null,
				contacts_id:'',
				productList:[],
				totalMoney:0,   //总金额
				discountMoney:0,  //优惠金额
				money:0,   //优惠之后的  金额
				num:'',   //订单编号
			}
		},
		onLoad(options) {
			this.customer_id = options.customerid
			this.listForm = null
			this.getForm()
			
			//自动生成订单编号
			this.getOrdersn()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
		},
		methods:{
			getOrdersn() {
				netAutoOrderNumber().then(res=>{
					this.num = res.data.number
				})
			},
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
					res = res.data.data
					res.forEach(ele=>{
						ele.value = ''
					})
					this.listForm = res
					//获取默认的客户
					this.getDefaultCustomer()
				})
			},
			getDefaultCustomer () {
				netPrevCustomer({id:this.customer_id}).then(res=>{
					this.customerlist = res.data.data
					this.selectCustomerObj = res.data.data[0]
					this.getLianxiren()
				})
			},
			//修改 客户信息
			getCustomerinfo(obj) {
				this.selectCustomerObj = obj
				this.customer_id = obj.id
				this.getLianxiren()
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
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
						return
					}
					this.contactList = res.data
				})
			},
			//客户签约人
			changeContact(e) {
				this.contactIndex = e.detail.value
				this.contacts_id = this.contactList[e.detail.value].id
			},
			//选择客户
			toSelectCustomer(){
				this.$refs.refChild.init()
			},
			//添加产品
			addPart() {
				this.$refs.productChild.init()
			},
			//选择产品
			selectList(arr) {
				this.productList = this.deWeight(this.productList.concat(arr))
				this.handleTotalMoney()
			},
			deWeight(arr) {
			    for (var i = 0; i < arr.length - 1; i++) {
			        for (var j = i + 1; j < arr.length; j++) {
			            if (arr[i].name == arr[j].name) {
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
					money += ele.number*Number(ele.price)
				})
				this.totalMoney = money
				if(this.discountMoney > 0){
					this.money = Number(this.totalMoney) - this.discountMoney
				}else{
					this.money = this.totalMoney
				}
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
			//修改优惠金额
			changeDiscountmoney(e) {
				console.log(this.discountMoney)
				if(this.productList.length != 0){
					this.money = Number(this.totalMoney) - this.discountMoney
				}
			},
			//提交
			createOrder() {
				let {
					customer_id,
					remindPeople,
					imgList,
					listForm,
					selectCustomerObj,  //默认的客户信息
					contactList,  //客户签约人
					contactIndex,
					contacts_id,
					productList,
					totalMoney,   //总金额
					discountMoney,  //优惠金额
					money,   //优惠之后的  金额
					num,   //订单编号
				} = this
				if(!customer_id){
					uni.showToast({
						title:'客户名称不能为空',
						icon:'none'
					})
					return
				}
				if(!contacts_id){
					uni.showToast({
						title:'客户签约人不能为空',
						icon:'none'
					})
					return
				}
				if(productList.length == 0) {
					uni.showToast({
						title:'请选择购买产品',
						icon:'none'
					})
					return
				}
				let product = []
				productList.forEach(ele=>{
					product.push({
						price:ele.price,
						number:ele.number,
						product_id:ele.id
					})
				})
				
				if(remindPeople.length == 0) {
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
				
				let arrlist = []
				let params = this.checkCommonForm(this.listForm)
				if(!params){
					return
				}
				params = Object.assign({},params,{customer_id,contacts_id,flow_staff_ids,product})
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
	.inp_warp {
		padding: 30rpx 24rpx;
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
			color:#14C2C1;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#14c2c1;
				margin-right:5rpx;
			}
		}
	}
	.pro_warp{
		padding:30rpx 24rpx;
		background:#fff;
		margin-bottom:24rpx;
		.li_warp{
			padding-bottom:24rpx;
			margin-bottom:24rpx;
			border-bottom:1rpx solid #EDEDED;
			.cell_con{
				padding:0 40rpx;
				.contitle{
					font-size:28rpx;
					color:#333;
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
					.conmoney{
						font-size:26rpx;
						color:#333;
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
	.fllow_area {
		background-color: #fff;
		padding: 0 30rpx 30rpx;
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
			border-radius: 50rpx;
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
	.affiliation {
		background-color: #fff;
		margin-bottom: 20rpx;
		margin-top:24rpx;
		padding-bottom: 40rpx;
		.aff_head {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 30rpx;
			font-size:26rpx;
			text {
				color: #f00;
				margin-left: 10rpx;
			}
		}
		.aff_con {
			display: flex;
			text-align: center;
			flex-wrap: wrap;
		
			.aff_item {
				width: 100rpx;
				margin-right: 15rpx;
				margin-bottom:15rpx;
				image {
					margin-bottom: 15rpx;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}
		
			.affbox {
				position: relative;
		
				.delremind {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					position: absolute;
					right: -16rpx;
					top: -16rpx;
					background: rgba(0, 0, 0, 0.5);
					z-index: 2;
				}
			}
		
			.aff_last {
				image {
					margin-bottom: 15rpx;
					width: 80rpx;
					height: 50rpx;
				}
			}
		}
	}
</style>
