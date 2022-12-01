<template>
	<view>
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联客户<span>*</span></view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="customerinfo ? 'valueActive' : '' ">
					{{customerinfo ? customerinfo.name : '选择关联客户'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_form" >
			<view class="key">指派员工<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
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
		<view class="fllow_form">
			<view class="key">机器型号<span>*</span></view>
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
		<view class="fllow_area" >
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
		<upload-img :flag="false" v-if="!isRequired" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="button" @click="$noMultipleClicks(toAddVisit)">确定</view>
		<view class="botsec"></view>
		
		
		<select-work-product ref="workProductOne" :customerinfo="customerinfo" @selectList="selectParts"></select-work-product>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	import { netAddVisitplant, netWorkOrderDetail } from '@/api/api.js'
	import selectWorkProduct from '@/components/selectWorkProduct/index'
	import { commonFun } from '@/common/navigate.js'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	
	
	export default{
		mixins:[commonFun],
		components:{
			selectTimePicker,
			selectWorkProduct
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
				partsList:[],
				is_over:1,
				desc:'',
				matters:'',
				nowTimeDate:'',
				appointment_time:'',
				imgList:[],
				workorderid:'',  //电话售后工单 未解决  需要创建上门维修工单   工单id
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
			staffObj: state => state.customer.staffObj
		}),
		onLoad(options) {
			this.$store.commit('CUSTOMEROBJ',null)
			if(options.id) {
				this.workorderid = options.id
				//获取工单详情  的产品信息
				this.getDetail()
			}
			//当前时间
			let arr = getNewDateArry()
			this.nowTimeDate = `${arr[0]}-${arr[1]}-${arr[2]}`
		},
		onHide() {
			this.$refs.workProductOne.closePopup()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			//工单详情
			getDetail(){
				netWorkOrderDetail({id:this.workorderid}).then(res=>{
					this.partsList = res.data.product_part
					this.$store.commit('CUSTOMEROBJ',res.data.customer)
				})
			},
			//紧要程度
			changeCritical(e) {
				this.criticalIndex = e.detail.value
			},
			//机器
			toAddPart() {
				if(this.customerinfo){
					this.$refs.workProductOne.init(this.customerinfo.id,3)
				}else{
					uni.showToast({
						title:'请先选择客户',
						icon:'none'
					})
				}
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
			toAddVisit() {
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
				let proarr = []
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
					proarr.push(ele.id)
				})
				
				//附件
				let imgarr = []
				this.imgList.forEach(ele=>{
					imgarr.push(ele.id)
				})
				let params = {
					relation_id:this.customerinfo.id,   //关联客户
					level:this.critical_list[this.criticalIndex].id,   //紧要程度
					staff_id:this.staffObj ? this.staffObj.id : '',
					is_over:this.is_over,
					desc:this.desc,
					matters:this.matters,
					appointment_time: this.appointment_time,
					product_part:arr,
					file_ids:imgarr.join(','),
					title:'返厂维修',
					event_type:['售后服务','返厂维修'],
					customer_product_id:proarr.join(','),
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
		
	.fllow_area {
		background: #fff;
		padding:30rpx 40rpx;
		border-bottom:1rpx solid #EDEDED;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
			}
			.list_text{
				font-size:26rpx;
				color:#007AFF;
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
