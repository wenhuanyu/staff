<template>
	<view>
		<view class="infowarp">
			<view class="title">详情</view>
			<view class="apply_info">
				<view class="apply_people" v-if="info.create_staff">
					<image :src="info.create_staff.img" class="peoimg"></image>
					<view class="peoname">{{info.create_staff.name}}</view>
				</view>
				<view class="apply_right">
					<view class="apply_text">申请编号：{{info.odd_numbers}}</view>
					<view class="apply_text">申请时间：{{info.createtime}}</view>
					<view class="apply_text">备注：{{info.desc}}</view>
				</view>
			</view>
		</view>
		<view class="infowarp">
			<view class="title">备件列表</view>
			<view class="conbox">
				<view class="table">
					<view class="table_header">
						<view class="table_td">名称</view>
						<view class="table_td">数量</view>
						<view class="table_td">单价</view>
						<view class="table_td">规格</view>
						<view class="table_td">金额</view>
					</view>
					<view class="table_body" v-for="(item,index) in info.parts" :key="index">
						<view class="table_th">{{item.name}}</view>
						<view class="table_th">{{item.number}}</view>
						<view class="table_th">{{item.price}}</view>
						<view class="table_th">{{item.unit}}</view>
						<view class="table_th">{{item.price * item.number}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="infowarp">
			<view class="title">审核流程</view>
			<!-- 审批流程 -->
			<approval-status :process="payment_approval"></approval-status>
		</view>
		<view class="button_warp" v-if="info.is_examine == 1">
			<view class="btn jujue"  @click="toExamine(2)">审核拒绝</view>
			<view class="btn tongyi" @click="toExamine(1)">审核通过</view>
		</view>
		<view style="height:calc(50rpx + env(safe-area-inset-bottom));"></view>
	</view>
</template>

<script>
	import { netApplyPartDetail, netApprovalDetail, netAllCirculateData } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		mixins:[commonFun],
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				id:'',
				type:1,   //1我发起的 2我审批的
				info:{},
				approvalList:[],
				remindPeople:[],
				examineType:'',
				payment_approval:{},  //审批流程
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getInfo()
			this.getApproval()
			this.getDefaultRemind()
		},
		onHide() {
		},
		methods:{
			getApproval() {
				let params = {
					type: 'parts',
					relation_id: this.id
				}	
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//通过 拒绝
			toExamine(status){
				uni.navigateTo({
					url:'/pages/template/examine?status='+status+'&type=parts&id='+this.info.id
				})
			},
			sureSub() {
				let arr = []
				this.remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					relation_type:'parts_stock_reload',
					relation_id:this.id,
					staff_id:arr.join(',')
				}
				netAllCirculateData(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.closePop()
					},2000)
				})
			},
			
			getInfo() {
				netApplyPartDetail({id:this.id}).then(res=>{
					this.info = res.data
					
				})
			},
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.infowarp{
		width: 750rpx;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		.title{
			font-size:26rpx;
			color:#666666;
			padding:30rpx 0 30rpx 70rpx;
			position: relative;
			&::before{
				position: absolute;
				left:30rpx;
				top:34rpx;
				content:'';
				width: 10rpx;
				height: 25rpx;
				background: $uni-text-color;
				border-radius: 5rpx;
			}
		}
	}
	.chuanyuebox{
		width:750rpx;
		padding:30rpx 0;
		.cy_btn{
			width:400rpx;
			height:80rpx;
			border-radius: 40rpx;
			font-size:30rpx;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			background:$uni-text-color;
			font-weight: bold;
			margin:35rpx auto;
		}
	}
	.app_exam{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:calc(100rpx + env(safe-area-inset-bottom));
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		background:#fff;
		z-index: 99;
		.exam_btn{
			width:200rpx;
			height:70rpx;
			border-radius: 40rpx;
			font-size:31rpx;
			text-align: center;
			background:$uni-text-color;
			color:#fff;
			line-height: 70rpx;
		}
	}
	.apply_info{
		padding:30rpx 45rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.apply_people{
			text-align: center;
			margin-right:24rpx;
			flex-shrink: 0;
			.peoimg{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				margin-bottom:15rpx;
			}
			.peoname{
				font-size:24rpx;
				color:#666666;
			}
		}
		.apply_right{
			.apply_text{
				font-size:28rpx;
				color:#333333;
				margin-bottom:15rpx;
			}
		}
	}
	.apply_title{
		padding:24rpx 30rpx;
		font-size:32rpx;
		color:$uni-text-color;
		border-top:1rpx solid #f5f5f5;
	}
	.conbox{
		padding:24rpx 40rpx;
		.table{
			border:1rpx solid #f5f5f5;
			.table_header{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.table_td{
					width:150rpx;
					height:100rpx;
					line-height: 100rpx;
					text-align: center;
					font-size:26rpx;
					color:$uni-text-color;
					border-right:1rpx solid #f5f5f5;
					border-bottom:1rpx solid #f5f5f5;
					&:last-child{
						border-right:0;
					}
				}
			}
			.table_body{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.table_th{
					width:150rpx;
					height:100rpx;
					line-height: 100rpx;
					text-align: center;
					font-size:26rpx;
					color:#333333;
					border-right:1rpx solid #f5f5f5;
					border-bottom:1rpx solid #f5f5f5;
					&:last-child{
						border-right:0;
					}
				}
			}
		}
	}
</style>
