<template>
	<view>
		<view class="opewrap">
			<view class="operation" @click="toEdit">修改</view>
			<view class="operation" @click="toAdd">添加</view>
		</view>
		<view class="cirtit">负责人</view>
		<view class="peobox">
			<view class="peoinfo" v-for="(item,index) in list" :key="index" v-if="item.roles == 1">
				<image :src="item.img" class="peoimg" ></image>
				<view class="peoright">
					<view class="pr_left">
						<view class="name">{{item.name}}</view>
						<view class="pr_post">{{item.post}} - {{item.name}}</view>
						<view class="pr_text">团队角色 负责人</view>
						<view class="pr_text">权限 负责人</view>
					</view>
					<image :src="BASE_IMG_URL+'/index/phone-call.png'" @click="toCall(item)" class="pr_phone" >
				</view>
			</view>
		</view>
		<view class="cirtit">团队成员</view>
		<view class="peobox">
			<view class="peoinfo" v-for="(item,index) in list" :key="index" v-if="item.roles == 2">
				<image :src="item.img" class="peoimg" ></image>
				<view class="peoright">
					<view class="pr_left">
						<view class="name">{{item.name}}</view>
						<view class="pr_post">{{item.post}} - {{item.name}}</view>
						<view class="pr_text">团队角色 普通员工</view>
						<view class="pr_text" v-if="item.is_edit == 0">权限 只读</view>
						<view class="pr_text" v-if="item.is_edit == 1">权限 读写</view>
					</view>
					<image :src="BASE_IMG_URL+'/index/phone-call.png'" @click="toCall(item)" class="pr_phone" >
				</view>
			</view>
		</view>
		
		<view style="height:30rpx;"></view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netFollowPerson, netQuoteFollowList, netEventFollowList, 
	netProoFollowList, netContractFollowList, netTeamList, netOrderFollowList,
	 netConsumeFollowList, netApprovalFollowList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				type:'',
				list:[]
			}
		},
		onLoad(options) {
			this.id = options.id
			this.type = options.type
		},
		onShow() {
			if(this.type == 'workorder'){
				//获取工单 联合跟进人
				this.getWorkorderFollow()
			}else if(this.type == 'quote'){
				//报价
				this.getQuote()
			}else if(this.type == 'event'){
				//任务
				this.getEvent()
			}else if(this.type == 'proofing'){
				//打样
				this.getProof()
			}else if(this.type == 'customer'){
				//客户
				this.getCustomer()
			}else if(this.type == 'contract'){
				//合同
				this.getContract()
			}else if(this.type == 'order'){
				//订单
				this.getOrder()
			}else if(this.type == 'consume'){
				//费用
				this.getConsume()
			}else if(this.type == 'approval'){
				//审批
				this.getApproval()
			}
		},
		methods:{
			getWorkorderFollow() {
				netFollowPerson({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			getQuote() {
				netQuoteFollowList({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			getEvent() {
				netEventFollowList({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			getProof() {
				netProoFollowList({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			getCustomer() {
				netTeamList({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			getContract() {
				netContractFollowList({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			getOrder() {
				netOrderFollowList({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			getConsume() {
				netConsumeFollowList({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			getApproval() {
				netApprovalFollowList({id:this.id}).then(res=>{
					this.list = res.data
				})
			},
			
			toCall(item) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: item.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber:item.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(item.mobile, true);
				// #endif
			},
			toEdit() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/edit?id='+this.id+'&type='+this.type
				})
			},
			toAdd() {
				uni.removeStorageSync('remindlist')
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/add?id='+this.id+'&type='+this.type
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.opewrap{
		padding:35rpx 35rpx 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.operation{
			font-size:28rpx;
			color:$uni-text-color;
			font-weight: bold;
			margin-left:30rpx;
		}
	}
	.cirtit{
		padding:24rpx 30rpx;
		font-size:28rpx;
		border-bottom:1rpx solid #f5f5f5;
	}
	.peobox{
		.peoinfo{
			padding:24rpx 30rpx;
			display: flex;
			justify-content: flex-start;
			border-bottom:1rpx solid #f5f5f5;
			&:last-child{
				border-bottom:0;
			}
			.peoimg{
				width:100rpx;
				height:100rpx;
				border-radius: 50%;
				flex-shrink: 0;
				margin-right:24rpx;
			}
			.peoright{
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex:1;
				.pr_left{
					.name{
						font-size:28rpx;
						color:#333;
						margin-bottom:15rpx;
					}
					.pr_post{
						font-size:26rpx;
						color:#666;
					}
					.pr_text{
						font-size:26rpx;
						color:#999;
					}
				}
				.pr_phone{
					width:42rpx;
					height:40rpx;
				}
			}
		}
	}
</style>
