<template>
	<view style="padding-bottom:50rpx">
		<view class="topwarp" v-if="info.customer">
			<view class="title">关联客户：</view>
			<view class="customer" @click="toCustomerDetail">{{info.customer.name}}</view>
		</view>
		<view class="topwarp" v-if="info.relation_type == 'workorder'">
			<view class="title">关联工单：</view>
			<view class="customer" @click="toWorkorderDetail"><span>{{info.relation_data.title}}-{{info.relation_data.workorder_number}}</span></view>
		</view>
		
		<view class="infowarp">
			<view class="title" >审批发起：</view>
			<view class="zy-content">
				<view class="info_right">
					<view class="infosec" style="margin:15rpx 0;" v-if="info.is_cashier == 1">打款情况：<span>已打款</span></view>
					<view class="infosec" style="margin:15rpx 0;" v-else>打款情况：<span >未打款</span></view>
					<view class="infosec" style="margin:15rpx 0;">报销单号：{{info.number?info.number:''}}</view>
					<view class="infosec">备注：{{info.remark?info.remark:''}}</view>
					<view class="infosec" style="margin:15rpx 0;"><image :src="BASE_IMG_URL + '/index/clock.png'"></image>{{info.createtime}}</view>
				</view>
				<view class="info_left" v-if="info.staff">
					<image v-if="info.staff.img" :src="info.staff.img" class="staffimg" ></image>
					<view class="staff_name">{{info.staff.name}}</view>
					<view class="callwarp" @click="toCall">
						<image :src="BASE_IMG_URL+'/index/phone-call.png'" class="btnimg" ></image>呼叫
					</view>
				</view>
			</view>
		</view>
		<!-- 审批 -->
		<view class="infowarp" v-if="info.check_status != 9">
			<view class="title" >操作：</view>
			<view class="button_warp" >
				<view class="btn jujue" v-if="info.is_examine == 1" @click="toExamine(2)">审核拒绝</view>
				<view class="btn tongyi" v-if="info.is_examine == 1" @click="toExamine(1)">审核通过</view>
			</view>
		</view>
		<!-- 更多操作 -->
		<more-pop 
			relation_type="consume" 
			:relation_id="id" 
			v-if="false" 
			:staffList="info.show_staff_data?info.show_staff_data:[]"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		<!-- 消费详情 -->
		<view class="newboxwarp">
			<view class="title">消费详情</view>
			<view class="costbox">
				<view class="costinfo">
					<view class="costleft">
						<view class="costfir" >消费金额：<span>￥{{info.money}}</span></view>
						<view class="costfir" >消费日期：{{info.submit_date}}</view>
					</view>
					<view class="costright">
						<image :src="BASE_IMG_URL+'/index/check.png'" v-if="info.check_status == 1" class="itemstatusimg"></image>
						<image :src="BASE_IMG_URL+'/index/passed.png'" v-if="info.check_status == 2" class="itemstatusimg"></image>
						<image :src="BASE_IMG_URL+'/index/refused.png'" v-if="info.check_status == 3" class="itemstatusimg"></image>
						<image :src="BASE_IMG_URL+'/index/stoped.png'" v-if="info.check_status == 9" class="itemstatusimg"></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="newboxwarp">
			<view class="title">费用明细</view>
			<view class="costbox" v-for="(costitem,index) in info.consume_detail" :key="index">
				<view class="costinfo" style="justify-content: flex-start;">
					<view class="costleft" style="margin-right:24rpx">
						<view class="costfir">费用类型：{{costitem.consume_type}}</view>
						<view class="costfir">消费金额：<span>￥{{costitem.consume_money}}</span></view>
						<view class="costfir">消费日期：{{costitem.consume_date}}</view>
					</view>
					<view class="costright" v-if="costitem.consume_type == '交通费'">
						<view class="costfir">交通工具：{{costitem.car_type}}</view>
						<view class="costfir">公里数：{{costitem.mileage}}</view>
						<view class="costfir">车牌号：{{costitem.car_number}}</view>
					</view>
				</view>
				<view class="costlist">
					<view class="costname">
						用途备注：{{costitem.remark}}
					</view>
				</view>
				<view class="costlist">
					<view class="costname" style="margin-bottom:15rpx;">消费附件：</view>
					<view class="doc_item" v-for="(item,index) in costitem.fileList" :key="index">
						<image :src="BASE_IMG_URL+'/index/file-clip.png'" class="remarkimg" ></image>
						<view class="doc_name" @click="toLookFile(item)">{{item.name}}</view>
						<view></view>
					</view>
				</view>
				<view class="costlist">
					<view class="costname">消费凭证：</view>
					<view class="imglist">
						<image :src="item.url" v-for="(item,imgindex) in costitem.imgList" :key="imgindex" @click="toPriveImg(costitem.imgList,imgindex)" class="costimg" ></image>
					</view>
				</view>
				<view class="shawbox"></view>
			</view>
		</view>
		<view class="newboxwarp">
			<view class="title">审批流程</view>
			<!-- 审批流程 -->
			<approval-status :process="payment_approval"></approval-status>
		</view>
		
		
		
		<view style="height:calc(100rpx + env(safe-area-inset-bottom))"></view>
		<view class="newbot" v-if="info.check_status != 9" @click="moreOperation">
			<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="moreimg" ></image>
			更多
		</view>
		<more-operation 
			ref="operationChild"
			:info="info"
			@zhongzhiSuccess="zhongzhiSuccess"
		></more-operation>
		
		<view class="bot_warp" v-if="false">
			<view class="bot_btn" v-if="info.is_edit == 1 && info.is_operation == 1" @click="toEdit">修改费用</view>
			<view class="bot_btn" v-if="info.check_status != 2 && info.check_status != 3 && info.is_operation == 1" @click="toTermination">终止费用</view>
		</view>
	</view>
</template>

<script>
	import { netCostDetail, netTerminationCost, netApprovalDetail } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import moreOperation from './more-operation.vue'
	
	export default{
		components:{
			moreOperation
		},
		mixins:[commonFun],
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				info:{},
				showImg:false,
				remindPeople:[],
				examineType:'',
				type:'',
				payment_approval:{},   //审批流程
			}
		},
		onLoad(options) {
			this.id = options.id
			if(options.type) {
				this.type = options.type
			}
		},
		onShow() {
			this.getDefaultRemind()
			if(!this.showImg) {
				this.getDetail()
				this.getApprovalList()
			}
		},
		methods:{
			getApprovalList() {
				let params = {
					type: 'consume',
					relation_id: this.id
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//更多操作
			moreOperation() {
				this.$refs.operationChild.open()
			},
			//查看附件
			toLookFile(item) {
				this.openCommonFile({file_path:item.url,name:item.name})
			},
			//拨打电话
			toCall() {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: this.info.staff.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber:this.info.staff.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(this.info.staff.mobile, true);
				// #endif
			},
			getDetail() {
				netCostDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			toPriveImg(arr,index) {
				console.log(arr,'=====')
				let data = []
				arr.forEach(ele=>{
					data.push(ele.url)
				})
				uni.previewImage({
					current:index,
					urls:data,
					success:(res)=>{
						this.showImg = true
					}
				})
			},
			toExamine(status) {
				this.showImg = false
				uni.navigateTo({
					url:'/pages/template/examine?status='+status+'&id='+this.info.id+'&type=consume'
				})
			},
			//客户 详情
			toCustomerDetail() {
				this.showImg = false
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.info.customer.id
				})
			},
			//传阅
			toCirculate() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.id+'&type=consume'
				})
			},
			//工单详情
			toWorkorderDetail() {
				if(this.info.relation_type == 'workorder'){
					this.jumpWorkorderDetail(this.info)
				}
			},
			//终止成功
			zhongzhiSuccess() {
				this.getDetail()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.newbot{
		.bot_btn{
			width:480rpx;
			height:70rpx;
			border-radius: 35rpx;
			font-size:26rpx;
			text-align: center;
			line-height: 70rpx;
			background:$uni-btn-bg-color;
		}
		.bot_warn{
			background:none;
			color:$uni-text-color;
			border:1rpx solid $uni-text-color;
			line-height: 68rpx;
		}
	}
	.topwarp{
		display: flex; 
		align-items: center; 
		justify-content: flex-start; 
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
	}
	.newboxwarp{
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
	}
	.doc_item{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding:15rpx;
		background:#F6F6F6;
		margin-bottom:15rpx;
		.remarkimg{
			width:25rpx;
			height:30rpx;
			margin-right:15rpx;
		}
		.doc_name{
			width:575rpx;
			font-size:24rpx;
			color:#333;
		}
	}
	.bot_warp{
		width:750rpx;
		height:calc(100rpx + env(safe-area-inset-bottom));
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		left:0;
		bottom:0;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		padding:0 24rpx;
		background:#fff;
		z-index: 99;
		.bot_btn{
			width:210rpx;
			height:70rpx;
			border-radius: 40rpx;
			background:#007AFF;
			font-size:26rpx;
			text-align: center;
			line-height: 70rpx;
			color:#fff;
		}
	}
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
			background: $uni-btn-bg-color;
			border-radius: 5rpx;
		}
	}
	.infowarp{
		display: flex;
		flex-direction: column;
		width: 750rpx;
		background: #FFFFFF;
		border: 1px solid #FFFFFF;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		
		.zy-content{
			display: flex;
			justify-content: space-between;
			padding-left:60rpx;
			padding-right:50rpx;
			.info_left{
				margin-left:24rpx;
				flex-shrink: 0;
				.staffimg{
					width:85rpx;
					height:85rpx;
					border-radius: 50%;
					margin-bottom:15rpx;
				}
				.staff_name{
					font-size:28rpx;
					color:#999999;
					text-align: center;
				}
				.callwarp{
					display: flex;
					justify-content: center;
					align-items: center;
					font-size:28rpx;
					color:$uni-text-color;
					margin-top:15rpx;
					.btnimg{
						width:42rpx;
						height:40rpx;
						margin-right:10rpx;
					}
				}
			}
			.info_right{
				
				.infofir{
					font-size:30rpx;
					color:#666666;
				}
				.infosec{
					font-size:26rpx;
					color:#999999;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					image{
						width: 30rpx;
						height: 30rpx;
					}
				}
			}
		}
		
	}
	.costbox{
		padding:0 60rpx 30rpx;
		.shawbox{
			width:100%;
			height:10rpx;
			background:#EDEDED;
		}
		&:last-child{
			.shawbox{
				display: none;
			}
		}
		.costinfo{
			display: flex;
			justify-content: space-between;
			.costleft{	
				.costfir{
					font-size:28rpx;
					color:#999999;
					margin-bottom:15rpx;
					span{
						color:#F2533E;
					}
				}
			}
			.costright{
				height:132rpx;
				.itemstatusimg{
					width:173rpx;
					height:132rpx;
				}
				.costfir{
					font-size:28rpx;
					color:#999999;
					margin-bottom:15rpx;
					span{
						color:#F2533E;
					}
				}
			}
		}
		.costlist{
			margin-top:15rpx;
			.costname{
				font-size:28rpx;
				color:#999999;
			}
			.imglist{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap:wrap;
				padding:24rpx;
				.costimg{
					width:140rpx;
					height:140rpx;
					border-radius: 10rpx;
					margin-right:56rpx;
					margin-bottom:15rpx;
					flex-shrink: 0;
					&:nth-child(3n){
						margin-right:0;
					}
				}
			}
		}
	}
	.customer{
		font-size:26rpx;
		color:$uni-text-color;
		
	}
</style>
