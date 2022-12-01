<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" v-if="info.is_operation == 1" @click="toAddPayPlay(info.id)">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg"></image>
					<view class="litext">添加回款计划</view>
				</view>
				<view class="ope_li" v-if="info.is_operation == 1 && info.check_status == 2 && info.is_examine != 1" @click="toAddPayment(info.id)">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg"></image>
					<view class="litext">回款</view>
				</view>
				<view class="ope_li" @click="removeExamine(info.id)" v-if="info.is_operation == 1 && (info.check_status == 0 || info.check_status == 1) && info.is_operation == 1">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg"></image>
					<view class="litext">撤回审批</view>
				</view>
				<view class="ope_li" v-if="info.is_operation == 1 && (info.check_status == 4 || info.check_status == 3) && info.is_examine != 1" @click="toEditcontract(1)">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg"></image>
					<view class="litext">编辑合同</view>
				</view>
				<view class="ope_li" @click="toLookContract">
					<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
					<view class="litext">下载合同</view>
				</view>
				<view class="ope_li" v-if="info.is_operation == 1 && info.check_status == 1" @click="toAddapprover">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg"></image>
					<view class="litext">加签</view>
				</view>
				<view class="ope_li" @click="toRevokeContract" v-if="info.is_operation == 1">
					<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg"></image>
					<view class="litext">终止合同</view>
				</view>
				<view class="ope_li" @click="toEditcontract(2)">
					<image :src="BASE_IMG_URL+'/index/ht-fuzhi.png'" class="opeimg"></image>
					<view class="litext">复制合同</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="ope_li" @click="toAddFile">
					<image :src="BASE_IMG_URL+'/index/ht-fujian.png'" class="opeimg" ></image>
					<view class="litext">上传附件</view>
				</view>
				<!-- #endif -->
				<view class="ope_li" @click="toSendEmail">
					<image :src="BASE_IMG_URL+'/index/ht-youjian.png'" class="opeimg"></image>
					<view class="litext">发送邮件</view>
				</view>
				<view class="ope_li" @click="toWriteLog" v-if="!info.invoice_date">
					<image :src="BASE_IMG_URL+'/index/ht-youjian.png'" class="opeimg"></image>
					<view class="litext">填写发票物流</view>
				</view>
				<view class="ope_li" @click="toWriteReceipt" v-if="!info.receipt_date">
					<image :src="BASE_IMG_URL+'/index/ht-youjian.png'" class="opeimg"></image>
					<view class="litext">填写发票回执单</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate.js'
	import { netCancelExamine, netTerminationContract, netContractAddFile } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		props:{
			info:{
				type:Object,
				default:{}
			},
			payment_approval:{
				type:Object,
				default:{}
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		methods:{
			open() {
				this.$refs.popup.open()
			},
			//添加  回款
			toAddPayment(id) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/payment/createPayment?id='+id+'&customerid='+this.info.customer.id+'&name='+this.info.customer.name,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//添加回款计划
			toAddPayPlay() {
				uni.navigateTo({
					url:'/pagesB/payplan/addPaymentPlan?id='+this.info.id+'&kehuid='+this.info.customer.id,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//撤回审批
			removeExamine() {
				this.$refs.popup.close()
				this.$emit('removeExamineP')
			},
			//审核之前  编辑合同
			toEditcontract(type) {
				//type 1编辑合同   2复制合同
				let arr = []
				// this.payment_approval.forEach(ele=>{
				// 	arr.push({
				// 		isDel:true,
				// 		isSelect:true,
				// 		...ele.check_staff
				// 	})
				// })
				uni.setStorageSync('EditContract',true)
				uni.setStorageSync('contractRemindlist', arr)
				uni.navigateTo({
					url:'/pagesA/customerInfo/order/editOrder?contractid='+this.info.id+'&type='+type,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//下载合同
			toLookContract() {
				this.$refs.popup.close()
				this.$emit('toLookContract')
			},
			//添加审批人
			toAddapprover() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/approver?id='+this.info.id+'&type=contract',
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//终止合同
			toRevokeContract() {
				this.$refs.popup.close()
				this.$emit('toRevokeContractP')
			},
			//上传附件
			toAddFile() {
				let fileUrl = this.toUploadFile((res)=>{
					let params = {
						contract_id:this.info.id,
						files:res.id
					}
					netContractAddFile(params).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							this.$refs.popup.close()
							this.$emit('uploadFile')
						},2000)
					})
				})
			},
			//发送邮件
			toSendEmail() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/send_mail',
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//填写发票  物流信息
			toWriteLog() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contract/invoice_logistics?id='+this.info.id,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//填写回执单
			toWriteReceipt() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contract/wirte_receipt?id='+this.info.id,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ope_warp{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding:30rpx 0;
		.ope_li{
			width:33.33%;
			margin-bottom:24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.opeimg{
				width:38rpx;
				height:38rpx;
				margin-bottom:10rpx;
			}
			.litext{
				font-size:26rpx;
				color:#999999;
				text-align: center;
			}
		}
	}
</style>
