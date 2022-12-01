<template>
	<view class="">
		<view class="top">
			<image :src="info.create_staff?info.create_staff.img:BASE_IMG_URL+'/headImg.png'" class="staffimg"></image>
			<view class="text">{{info.create_staff?info.create_staff.name:''}}的补卡</view>
			<view class="statu" v-if="info.check_status == 0">审核中</view>
			<view class="statu" v-if="info.check_status == 1">审核中</view>
			<view class="statu" v-if="info.check_status == 2">审核通过</view>
			<view class="statu" v-if="info.check_status == 3">审核未通过</view>
			<view class="statu" v-if="info.check_status == 4">已撤回</view>
		</view>
		<view class="btnlist" v-if="payment_approval.is_check == 1">
			<view class="btn pass" @click="toPass">通过</view>
			<view class="btn refuse" @click="toRefuse">拒绝</view>
		</view>
		<view class="section">
			<view class="sec_li"> <text>提交时间</text> {{info.createtime}}</view>
			<view class="sec_li"> <text>补卡类型</text> {{info.type == 0 ? '缺卡补卡':info.type == 1 ? '早退补卡': '迟到补卡'}}</view>
			<view class="sec_li"> <text>补卡时间</text> {{info.time}}</view>
			<view class="sec_li"> <text>补卡事由</text> {{info.remark}}</view>
			<view class="sec_li_file"> 
				<text>附件</text> 
				<view class="imgbox">
					<image v-for="(item,index) in info.file_ids" :key="index" :src="item.file_path" @click="toPrevieImg(info.file_ids,index)" class="selfimg"></image>
				</view>
			</view>
		</view>
		
		<!-- 审批流程 -->
		<approval-status :process="payment_approval"></approval-status>
		
	</view>
</template>

<script>
	import { netCardDetail, netApprovalDetail } from '@/api/api.js'
	import approvalStatus from '@/components/examinePeople/approvalStatus.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			approvalStatus
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				info:{},
				payment_approval:{},  //审批流程
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getDetail()
			//审批流程
			this.getApprovalList()
		},
		methods:{
			getDetail() {
				netCardDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			getApprovalList() {
				let params = {
					type: 'card',
					relation_id: this.id
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//查看 图片
			toPrevieImg(arr,index) {
				console.log(arr,'=====')
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					urls: data,
					current:index
				})
			},
			//通过
			toPass() {
				uni.navigateTo({ //status   1成功   2失败
					url: '/pages/examine/examine?id=' + this.id + '&type=card&status=1'
				})
			},
			//拒绝
			toRefuse() {
				uni.navigateTo({ //status   1成功   2失败
					url: '/pages/examine/examine?id=' + this.id + '&type=card&status=2'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding:24rpx 30rpx;
		background:#fff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.staffimg{
			width:60rpx;
			height:60rpx;
			border-radius: 50%;
		}
		.text{
			font-size:24rpx;
			color:#333;
			margin:0 15rpx;
		}
		.statu{
			width:120rpx;
			border:1rpx solid $uni-text-color;
			border-radius: 10rpx;
			font-size:24rpx;
			color:$uni-text-color;
			text-align: center;
			padding:5rpx 0;
		}
	}
	.section{
		background:#fff;
		margin:24rpx 0;
		padding:40rpx 30rpx 30rpx 50rpx;
		.sec_li{
			display: flex;
			justify-content: flex-start;
			font-size:30rpx;
			color:#333;
			margin-bottom:20rpx;
			text{
				color:#999;
				margin-right:15rpx;
			}
		}
		.sec_li_file{
			display: flex;
			justify-content: flex-start;
			font-size:30rpx;
			color:#333;
			text{
				color:#999;
				margin-right:15rpx;
			}
			.imgbox{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				.selfimg{
					width:120rpx;
					height:120rpx;
					border-radius: 10rpx;
					margin:0 15rpx 15rpx 0;
				}
			}
		}
	}
	.btnlist {
		padding: 20rpx 24rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top: 1rpx solid #DDDDDD;
		background: #fff;
	
		.btn {
			width: 300rpx;
			height: 60rpx;
			border-radius: 8rpx;
			font-size: 24rpx;
			color: #fff;
			text-align: center;
			line-height: 60rpx;
		}
	
		.pass {
			background: $uni-text-color;
		}
	
		.refuse {
			background: #F43F3B;
		}
	}
</style>