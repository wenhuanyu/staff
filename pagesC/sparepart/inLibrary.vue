<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">备件类型<span>*</span></view>
			<picker @change="changeType" disabled :range="typeList" :value="typeIndex" :range-key="'name'">
				<view class="form_right">
					<view class="righttext" :class="typeList[typeIndex] ? 'valueActive' : '' ">
						{{typeList[typeIndex] ? typeList[typeIndex].name : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">入库/出库日期<span>*</span></view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view class="righttext" :class="storage_time ? 'valueActive' : '' ">
						{{storage_time ? storage_time : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">申请编号<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="odd_numbers" placeholder="系统自动生成" class="rightinput">
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="desc" :class="desc ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<view class="in_warp">
			<view class="in_title key">已选备件<span>*</span></view>
			<view class="add_in" @click="addPart">
				<view class="iconfont icon-jiahaocu"></view>
				添加备件
			</view>
		</view>
		
		<view class="list_warp" v-if="partsList.length != 0">
			<view class="li_warp" v-for="(item,index) in partsList" :key="index">
				<view class="li_left">
					<view class="iconfont icon-jian" @click="delParts(index)"></view>
				</view>
				<view class="li_right">
					<view class="contitle">{{item.name}}</view>
					<view class="context">编号：{{item.num}}</view>
					<view class="context">规格：{{item.unit}}</view>
					<view class="conbot" @click.sotp.prevent>
						<view class="conmoney">￥{{item.price}}</view>
						<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
					</view>
				</view>
			</view>
		</view>
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 审核信息 -->
		<examine-people v-if="approvalPro.status == 0" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view style="height:110rpx;"></view>
		<view class="inlibrary_bot">
			<view class="bot_left">
				合计：<span>￥{{totalMoney}}</span>
			</view>
			<view class="bot_right" @click="$noMultipleClicks(submit)">提交</view>
		</view>
		
		<popup-list ref="partChild" @selectList="selectParts"></popup-list>
	</view>
</template>

<script>
	import popupList from '@/components/partpopup/index'
	import { netPartsNumber, netPartsoutOrin, netPartDetail, netApprovalProcess } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	
	export default{
		mixins:[commonFun],
		components:{
			popupList
		},
		data(){
			return{
				noClick: true, //防止  重复点击
				storage_time:'',
				typeList:[
					{id:1,name:'入库'},
					{id:2,name:'出库'}
				],
				typeIndex:null,
				desc:'',
				odd_numbers:'',  //单号
				partsList:[],
				totalMoney:0,
				remindPeople:[],
				examineType:'parts',
				//已选择的入库 产品
				id:'',
				approvalPro:{},   //审批流程
			}
		},
		onLoad(options) {
			this.type = options.type
			if(options.id){
				this.id = options.id
				//获取 已经选择的 备件详情
				this.getPartDetail()
			}
			if(this.type == 1) {
				this.typeIndex = 0
			}else{
				this.typeIndex = 1
			}
			this.getNumber()
			//出 入库时间
			//当前时间
			let arr = getNewDateArry()
			this.storage_time = `${arr[0]}-${arr[1]}-${arr[2]}`
			//获取审批流程
			this.getProcess()
		},
		onShow() {
			if(this.approvalPro.status == 0){
				//获取  默认需要提醒的人
				this.getDefaultRemind()
			}
		},
		//监听  页面 卸载
		onUnload() {
			uni.removeStorageSync('remindlist')
		},
		methods:{
			//审批流程
			getProcess() {
				netApprovalProcess({type:'parts'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						//获取  默认需要提醒的人
						this.getDefaultRemind()
					}
				})
			},
			//获取已经选择的备件
			getPartDetail() {
				netPartDetail({id:this.id}).then(res=>{
					res = res.data
					let obj = {
						id:res.id,
						name:res.name,
						price:res.price,
						number:1,
						num:res.num,
						unit:res.unit
					}
					this.partsList.push(obj)
					this.handleMoney()
				})
			},
			getNumber() {
				netPartsNumber().then(res=>{
					this.odd_numbers = res.data.number
				})
			},
			//备件类型
			changeType(e) {
				this.typeIndex = e.detail.value
			},
			changeTime(e) {
				this.storage_time = e.detail.value
			},
			//添加备件
			addPart() {
				this.$refs.partChild.init()
			},
			selectParts(arr) {
				let data = arr.concat(this.partsList)
				this.partsList = this.deWeight(data,true)
				
				this.handleMoney()
			},
			changeNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e
				this.$set(this.partsList,index,obj)
				this.handleMoney()
			},
			handleMoney() {
				let arr = this.partsList
				let money = 0
				arr.forEach(ele=>{
					money += ele.number * Number(ele.price)
				})
				this.totalMoney = money
			},
			delParts(index) {
				this.partsList.splice(index,1)
				this.handleMoney()
			},
			submit() {
				let {
					partsList,
					storage_time,
					typeList,
					typeIndex,
					desc,
					odd_numbers,
					remindPeople
				} = this
				if(!typeList[typeIndex]){
					uni.showToast({
						title:'请选择备件类型',
						icon:'none'
					})
					return
				}
				if(!storage_time){
					uni.showToast({
						title:'请选择入库/出库日期',
						icon:'none'
					})
					return
				}
				if(partsList.length == 0) {
					uni.showToast({
						title:'请选择备件',
						icon:'none'
					})
					return
				}
				if(remindPeople.length == 0 && this.approvalPro.status == 0) {
					uni.showToast({
						title:'请选择审核人',
						icon:'none'
					})
					return
				}
				//流程审批人
				let remarr = []
				remindPeople.forEach(ele=>{
					remarr.push(ele.id)
				})
				let flow_staff_id = remarr.join(',')
				
				let params = {
					odd_numbers,desc,storage_time,
					type: typeList[typeIndex].id,
					parts: partsList,
					flow_staff_ids:this.approvalPro.status == 0 ? flow_staff_id : '',
				}
				netPartsoutOrin(params).then(res=>{
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
		.icon-you {
			font-size:40rpx;
		}
		.righttext{
			font-size:26rpx;
		}
		.rightinput{
			width:100%;
			text-align: right;
			color: #333;
		}
	}	
}
.fllow_area {
	background-color: #fff;
	padding:30rpx;
	border-bottom:1rpx solid #f5f5f5;
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
.in_warp{
	padding:30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.in_title{
		font-size:30rpx;
		color:#666;
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
.list_warp{
	background:#fff;
	padding:30rpx 50rpx;
	.li_warp{
		padding-bottom:24rpx;
		margin-bottom:24rpx;
		border-bottom:1rpx solid #f5f5f5;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.li_left{
			margin-right:24rpx;
			flex-shrink: 0;
			.icon-jian{
				font-size:35rpx;
				color:#ff7800;
			}
		}
		.li_right{
			flex:1;
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
			height:224rpx;
			background:#F00;
			color:#fff;
			text-align: center;
			line-height: 224rpx;
		}
	}
}
.inlibrary_bot{
	position: fixed;
	left:0;
	bottom:0;
	width:100%;
	height:100rpx;
	background:#fff;
	border-top:1rpx solid #f5f5f5;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding:0 24rpx;
	z-index:9;
	.bot_left{
		font-size:28rpx;
		color:#333;
		span{
			color:#ff7800;
		}
	}
	.bot_right{
		width:240rpx;
		height:80rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 80rpx;
		background:$uni-text-color;
		color:#fff;
		font-size:26rpx;
	}
}
.conright{
	display: flex;
	justify-content: flex-end;
	align-items: center;
	.conAdd, .reduce{
		width:40rpx;
		height:40rpx;
		border-radius: 8rpx;
		background:#f5f5f5;
		font-size:34rpx;
		text-align: center;
		line-height: 40rpx;
	}
	.numberinput{
		width:60rpx;
		height:40rpx;
		border-radius: 8rpx;
		background:#f5f5f5;
		font-size:34rpx;
		text-align: center;
		line-height: 40rpx;
		margin:0 10rpx;
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
