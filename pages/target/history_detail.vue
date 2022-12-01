<template>
	<view>
	<view class="target_att">
		<view>目标年份：<text>{{info.year}}</text></view>
		<view>目标类型：
			<text v-if="info.status == 1">销售金额</text>
			<text v-if="info.status == 2">回款金额</text>
			<text v-if="info.status == 3">获客目标</text>
			<text v-if="info.status == 4">拜访目标</text>
		</view>
	</view>
	<view class="de_warp">
		<view class="de_li">
			<view class="de_label">年度目标</view>
			<view class="de_mondy">{{info.yeartarget}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">1月</view>
			<view class="de_mondy">{{info.january}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">2月</view>
			<view class="de_mondy">{{info.february}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">3月</view>
			<view class="de_mondy">{{info.march}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">4月</view>
			<view class="de_mondy">{{info.april}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">5月</view>
			<view class="de_mondy">{{info.may}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">6月</view>
			<view class="de_mondy">{{info.june}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">7月</view>
			<view class="de_mondy">{{info.july}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">8月</view>
			<view class="de_mondy">{{info.august}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">9月</view>
			<view class="de_mondy">{{info.september}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">10月</view>
			<view class="de_mondy">{{info.october}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">11月</view>
			<view class="de_mondy">{{info.november}}</view>
		</view>
		<view class="de_li">
			<view class="de_label">12月</view>
			<view class="de_mondy">{{info.december}}</view>
		</view>
		<!-- 审批流程 -->
		<approval-status :process="payment_approval"></approval-status>
	</view>
	<view style="height:100rpx"></view>
	
		<view class="botbox" v-if="payment_approval.is_check == 1">
			<view class="botbtn" @click="toPass">通过</view>
			<view class="botbtn firbg" @click="toRefuse">拒绝</view>
		</view>
	</view>
</template>

<script>
	import { netGetRecordDetail, netApprovalDetail } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	export default {
		data(){
			return{
				id:'',
				info:{},
				payment_approval:{},   //审批流程
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		onLoad(options){
			this.id = options.id
		},
		onShow(){
			this.getDetail()
			//获取  审批 流程
			this.getApprovalList()
		},
		methods:{
			getDetail() {
				netGetRecordDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			getApprovalList() {
				let params = {
					type: 'achievement',
					relation_id: this.id
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//通过
			toPass() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.id+'&type=achievement&status=1'
				})
			},
			//拒绝
			toRefuse() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.id+'&type=achievement&status=2'
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.de_warp{
		width:702rpx;
		background:#fff;
		border-radius: 10rpx;
		margin:20rpx auto;
		padding:0rpx 30rpx;
		box-sizing: border-box;
		.de_li{
			display: flex;;
			justify-content: space-between;
			align-items: center;
			padding:30rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			font-size:26rpx;
			color:#333;
			.de_label{
				flex-shrink: 0;
			}
			.remind_li{
				display: flex;
				justify-content: flex-end;
				flex-wrap: wrap;
				.re_li{
					.re_img{
						width:80rpx;
						height:80rpx;
						border-radius: 50%;
						margin-bottom:15rpx;
					}
					.re_name{
						font-size:24rpx;
						color:#333;
						text-align: center;
					}
				}
			}
		}
	}
	.basic_main {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		height: 90rpx;
		line-height: 90rpx;
	}
	.operation_record {
		background:#fff;
		padding: 20rpx 30rpx;
		.record_item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			padding-bottom:20rpx;
			border-bottom:1rpx solid #EAEAEA;
			margin-bottom:20rpx;
			&:last-child{
				border-bottom:none;
			}
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}
			.record_info {
				flex: 1;
				margin-left: 25rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				.info_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom:10rpx;
				}
				.shenhetext{
					font-size:26rpx;
					color:#666;
					line-height: 34rpx;
				}
			}
			.record_line {
				position: absolute;
				top: -102rpx;
				left: -26rpx;
				height: 105rpx;
				border-left: 4rpx dotted #dedede;
			}
		}
	}
	// 目标时间，目标类型模块
	.target_att {
		display: flex;
		padding-left: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		view {
			color: #999;
			margin-right:20rpx;
			text {
				color: #666;
				margin-right: 10rpx;
			}
		}
	}
	.botbox{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:100rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		.botbtn{
			width:300rpx;
			height:70rpx;
			color:#fff;
			text-align: center;
			line-height: 70rpx;
			font-size:26rpx;
			border-radius: 35rpx;
			background:$uni-text-color;
		}
		.firbg{
			background:#ff7800;
		}
	}
</style>
