<template>
	<view>
		<!-- 添加成员 -->
		<examine-people title="添加成员" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="staffli">
			<view class="statext">权限</view>
			<picker @change="changePre" :range="preArr" :value="preIndex">
				<view class="liright">
					{{preArr[preIndex]?preArr[preIndex]:'请选择'}}
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import { netAddFollowPerson, netAddQuoteFollow, netAddEventFollow, netAddProofingFollow, 
	netTeamEdit,  netAddContractFollow, netAddOrderFollow, netAddConsumeFollow, netAddApprovalFollow,
	netAddTeamAll
	 } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,    //防止  重复点击
				remindPeople:[],
				examineType:'',
				id:'',
				type:'',
				preArr:['只读','读写'],
				preIndex:0
			}
		},
		onLoad(options) {
			this.id = options.id
			this.type = options.type
		},
		onShow() {
			this.getDefaultRemind()
		},
		methods:{
			changePre(e) {
				this.preIndex = e.detail.value
			},
			sureSub() {
				if(this.remindPeople.length == 0) {
					uni.showToast({
						title:'请选择成员',
						icon:'none'
					})
					return
				}
				let arr = []
				this.remindPeople.forEach(ele=>{
					arr.push({
						id:ele.id,
						is_edit: this.preIndex
					})
				})
				let params = {
					id:this.id,
					staff:arr
				}
				if(this.type == 'workorder'){
					//工单
					this.addFollow(params)
				}else if(this.type == 'quote'){
					//报价
					this.addQuoteFollow(params)
				}else if(this.type == 'event'){
					//任务
					this.addEventFollow(params)
				}else if(this.type == 'proofing'){
					//打样
					this.addProoFollow(params)
				}else if(this.type == 'customer'){
					//客户
					this.addCustomerFollow(params)
				}else if(this.type == 'contract'){
					//合同
					this.addContractFollow(params)
				}else if(this.type == 'order'){
					//订单
					this.addOrderFollow(params)
				}else if(this.type == 'consume') {
					//费用
					this.addConsume(params)
				}else if(this.type == 'approval') {
					//审批
					this.addApproval(params)
				}else if(this.type == 'customerAll') {
					//批量添加 团队成员
					this.addTeamAll(arr)
				}
			},
			handleResult(res) {
				uni.showToast({
					title:res.msg,
					icon:'none'
				})
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					})
				},2000)
			},
			//添加工单 跟进人
			addFollow(params) {
				netAddFollowPerson(params).then(res=>{
					this.handleResult(res)
				})
			},
			//添加报价单  跟进人
			addQuoteFollow(params) {
				netAddQuoteFollow(params).then(res=>{
					uni.setStorageSync('quoteAddFollow',true)
					this.handleResult(res)
				})
			},
			//添加任务跟进人
			addEventFollow(params) {
				netAddEventFollow(params).then(res=>{
					this.handleResult(res)
				})
			},
			//添加打样跟进人
			addProoFollow(params) {
				netAddProofingFollow(params).then(res=>{
					this.handleResult(res)
				})
			},
			//添加客户跟进人
			addCustomerFollow(params) {
				netTeamEdit(params).then(res=>{
					this.handleResult(res)
				})
			},
			//添加合同 跟进人
			addContractFollow(params) {
				netAddContractFollow(params).then(res=>{
					this.handleResult(res)
				})
			},
			//添加订单 跟进人
			addOrderFollow(params) {
				netAddOrderFollow(params).then(res=>{
					this.handleResult(res)
				})
			},
			//添加费用  跟进人
			addConsume(params) {
				netAddConsumeFollow(params).then(res=>{
					this.handleResult(res)
				})
			},
			//添加审批  跟进人
			addApproval(params) {
				netAddApprovalFollow(params).then(res=>{
					this.handleResult(res)
				})
			},
			//批量添加团队成员
			addTeamAll(arr) {
				let params = {
					ids:this.id,
					staff_id:arr.join(','),
					is_edit:this.preIndex
				}
				netAddTeamAll(params).then(res=>{
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
	.staffli{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:24rpx 35rpx;
		border-top:1rpx solid #f5f5f5;
		border-bottom:1rpx solid #f5f5f5;
		.statext{
			font-size:26rpx;
			color:#666;
		}
		.liright{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#666;
			.icon-you{
				font-size:28rpx;
			}
		}
	}
</style>
