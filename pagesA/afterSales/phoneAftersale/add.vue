<template>
	<view>
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key">工单编号<span>*</span></view>
			<view class="form_right">
				<view :class="workorder_number ? 'valueActive' : '' ">{{workorder_number ?workorder_number : ''}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">工单标题<span>*</span></view>
			<view class="form_right">
				<input type="text" placeholder-style="color:#999;font-size:24rpx;" :class="title ? 'valueActive' : '' "  v-model="title" placeholder="填写工单标题" />
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
		<view class="inp_warp">
			<view class="inp_title key">客户联系人<span>*</span></view>
			<picker @change="changeContacts"  :value="contactsIndex" :range="contactsList" :range-key="'name'">
				<view class="form_right">
					<view :class="contactsList[contactsIndex] ? 'valueActive' : '' ">{{contactsList[contactsIndex] ? contactsList[contactsIndex].name : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp" >
			<view class="inp_title key">指派员工<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">预约时间<span>*</span></view>
			<select-time-picker
				fields="day" 
				:start="nowTimeDate"
				placeholder="预约时间" 
				:defaultValue="appointment_time"
				@change="changeTime"
			></select-time-picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">过保类型<span>*</span></view>
			<view class="form_right">
				<view class="radiowarp">
					<view class="" @click="changeOver(1)">
						<radio value="1" color="#008EFF" :checked="is_over == 1" />过保
					</view>
					<view class="" @click="changeOver(2)">
						<radio value="2" color="#008EFF" :checked="is_over == 2" />未过保
					</view>
				</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">机器型号<span>*</span></view>
			<view class="form_right" @click="toAddPart">
				<view class="iconfont icon-jiahaocu"></view>
				选择机器
			</view>
		</view>
		<view class="prolist" v-if="partsList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in partsList" :key="index">
					<view class="product_li">
						<view class="iconfont icon-jian" @click="delParts(index)"></view>
						<view class="protext">{{item.product.name}}</view>
						<view class="protext" >{{item.product.price}}</view>
					</view>
					<view class="part_li">
						<view class="partbox" v-for="(ele,eleindex) in item.parts" :key="eleindex" @click="toSelectPart(index,eleindex)"><radio value="r1" color="#008EFF" :checked="ele.is_select" />{{ele.name}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fllow_area" v-if="!isRequired">
			<view class="area_head">备注:</view>
			<textarea v-model="remarks" maxlength="-1" :class="remarks ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		<view class="button" @click="$noMultipleClicks(toAddVisit)">确定</view>
		<view class="botsec"></view>
		
		<select-work-product 
			ref="workProductOne" 
			:customerinfo="customerinfo" 
			@selectList="selectParts"
		></select-work-product>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import { netAddWorkOrder, netLianxiren, netWorkOrderNumber } from '@/api/api.js'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
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
				contactsList:[],
				contactsIndex:0,
				remarks:'',
				nowTimeDate:'',
				appointment_time:'',
				is_over:1,
				partsList:[],
				workorder_number:'',
				title:'',
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
			staffObj: state => state.customer.staffObj
		}),
		watch:{
			customerinfo(newobj,oldobj){
				if(newobj){
					//获取 客户联系人
					this.getCustomerLink()
				}
			}
		},
		onLoad() {
			//当前时间
			let arr = getNewDateArry()
			this.nowTimeDate = `${arr[0]}-${arr[1]}-${arr[2]}`
			this.$store.commit('CUSTOMEROBJ',null)
			
			//获取工单编号
			this.getNumber()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			getNumber() {
				netWorkOrderNumber().then(res=>{
					this.workorder_number = res.data.number
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
			changeTime(e) {
				this.appointment_time = e.f3
			},
			//机器
			toAddPart() {
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
			changeOver(type) {
				this.is_over = type
			},
			toAddVisit(){
				if(!this.title) {
					uni.showToast({
						title:'请填写工单标题',
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
				if(!this.staffObj) {
					uni.showToast({
						title:'请选择指派人',
						icon:'none'
					})
					return
				}
				if(!this.appointment_time){
					uni.showToast({
						title:'请选择预约时间',
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
				
				let params = {
					workorder_number:this.workorder_number,
					customer_id:this.customerinfo.id,
					contacts_id: this.contactsList[this.contactsIndex].id,
					owner_staff_id:this.staffObj.id,
					appointment_time:this.appointment_time,
					is_over:this.is_over,
					product_part:arr,
					remarks:this.remarks,
					workorder_type:'电话售后',
					title:this.title,
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
	.fllow_area {
		background: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
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
