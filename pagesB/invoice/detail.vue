<template>
	<view class="">
		<view class="topwarp">
			<view class="title">关联客户：</view>
			<view class="customer" v-if="info.customer" @click="toCustomerDetail">{{info.customer.name}}</view>
		</view>
		<view class="topwarp">
			<view class="title">关联合同：</view>
			<view class="customer" v-if="info.contract" @click="toContractDetail">{{info.contract.name}}</view>
		</view>
		<view class="newboxwarp">
			<view class="title">基础信息</view>
			<view class="zy-content">
				<view class="info_right">
					<view class="infosec">审核状态：
						<view class="status" v-if="info.check_status == 1">审核中</view>
						<view class="status" v-if="info.check_status == 2">审核通过</view>
						<view class="status" v-if="info.check_status == 3">审核未通过</view>
					</view>
					<view class="infosec">发票编号：{{info.number?info.number:''}}</view>
					<view class="infosec">开票金额：{{info.money?info.money:''}}</view>
					<view class="infosec">开票时间：{{info.time?info.time:''}}</view>
					<view class="infosec">开票类型：{{typeList[info.type]}}</view>
					<view class="infosec">备注：{{info.remark?info.remark:''}}</view>
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
		<view class="newboxwarp">
			<view class="title">发票信息</view>
			<view class="zy-content">
				<view class="info_right">
					<view class="infosec">抬头类型：<span v-if="info.head_type == 0">单位</span><span v-if="info.head_type == 1">个人</span></view>
					<view class="infosec">发票抬头：{{info.invoice_header?info.invoice_header:''}}</view>
					<view class="infosec">纳税人识别号：{{info.taxpayer_number?info.taxpayer_number:''}}</view>
					<view class="infosec">开户行：{{info.bank_deposit?info.bank_deposit:''}}</view>
					<view class="infosec">开户账户：{{info.bank_account?info.bank_account:''}}</view>
					<view class="infosec">开票地址：{{info.invoice_address?info.invoice_address:''}}</view>
					<view class="infosec">电话：{{info.invoice_mobile?info.invoice_mobile:''}}</view>
				</view>
			</view>
		</view>
		<view class="newboxwarp">
			<view class="title">邮寄信息</view>
			<view class="zy-content">
				<view class="info_right">
					<view class="infosec">联系人：{{info.contacts?info.contacts:''}}</view>
					<view class="infosec">联系方式：{{info.phone?info.phone:''}}</view>
					<view class="infosec">收货地址：{{info.address?info.address:''}}</view>
					<view class="infosec">详细地址：{{info.address_detail?info.address_detail:''}}</view>
				</view>
			</view>
		</view>
		<!-- 审批 -->
		<view class="newboxwarp" v-if="info.is_examine == 1">
			<view class="title">操作：</view>
			<view class="button_warp">
				<view class="btn jujue" @click="toExamine(2)">审核拒绝</view>
				<view class="btn tongyi" @click="toExamine(1)">审核通过</view>
			</view>
		</view>
		<view class="newboxwarp">
			<view class="title">实际开票信息</view>
			<view class="zy-content">
				<view class="info_right">
					<view class="infosec">发票号码：{{info.invoice_number?info.invoice_number:''}}</view>
					<view class="infosec">实际开票日期：{{info.invoice_time?info.invoice_time:''}}</view>
					<view class="infosec">物流单号:{{info.logistics?info.logistics:''}}</view>
				</view>
			</view>
			<view class="costlist">
				<view class="costname">附件：</view>
				<view class="imglist">
					<image :src="info.image"  @click="toPriveImg(info.image)" class="costimg" ></image>
				</view>
			</view>
		</view>
		<view class="newboxwarp">
			<view class="title">审批流程</view>
			<!-- 审批流程 -->
			<approval-status :process="payment_approval"></approval-status>
		</view>
		
		<view class="" style="height:150rpx"></view>
		
		<!-- 底部导航栏 -->
		<view class="bottom_nav" v-if="!info.invoice_time">
			<view class="bottom_item" @click="toEdit" v-if="info.check_status == 3">
				<image :src="BASE_IMG_URL+'/clus_edit.png'" class="botimg"></image>
				<view>修改</view>
			</view>
			<view class="bottom_item" @click="toBiaoji">
				<image :src="BASE_IMG_URL+'/clus_edit.png'" class="botimg"></image>
				<view>标记已开票</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netApprovalDetail, netDetailInvoice } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				payment_approval:{},   //审批流程
				id:'',
				info:{},
				typeList:['增值税专用发票','增值税普通发票','国税通用机打发票','地税通用机打发票','收据'],
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getApprovalList()
		},
		onShow() {
			//详情
			this.getDetail()
		},
		methods:{
			getApprovalList() {
				let params = {
					type: 'invoice',
					relation_id: this.id
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			getDetail() {
				netDetailInvoice({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			toEdit() {
				uni.navigateTo({
					url:'/pagesB/invoice/editInvoice?id='+this.id
				})
			},
			toBiaoji() {
				uni.navigateTo({
					url:'/pagesB/invoice/editBiaoji?id='+this.id
				})
			},
			toPriveImg() {
				let url = this.info.image
				uni.previewImage({
					urls:[url]
				})
			},
			//查看附件
			toLookFile(item) {
				this.openFile({file:item.url,filename:item.name,type:'file'})
			},
			toCustomerDetail() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.info.customer.id
				})
			},
			toContractDetail() {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractDetail?id='+this.info.contract.id
				})
			},
			toExamine(status) {
				uni.navigateTo({
					url:'/pages/template/examine?status='+status+'&id='+this.info.id+'&type=invoice'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.topwarp{
		display: flex; 
		align-items: center; 
		justify-content: flex-start; 
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
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
				background: $uni-btn-bg-color;
				border-radius: 5rpx;
			}
		}
		.customer{
			color:$uni-btn-bg-color;
		}
	}
	.newboxwarp{
		margin-bottom:24rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		padding-bottom:24rpx;
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
	}
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
				margin-top:10rpx;
				image{
					width: 30rpx;
					height: 30rpx;
				}
				.status{
					font-size:24rpx;
					color:$uni-text-color;
				}
			}
		}
	}
	.bottom_nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 0;
		background-color: #fff;
		text-align: center;
		color: #999;
		z-index: 2;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		.bottom_item{
			font-size:24rpx;
			.botimg{
				width:40rpx;
				height:40rpx;
			}
		}
	}
	.costlist{
		padding-left:60rpx;
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
</style>