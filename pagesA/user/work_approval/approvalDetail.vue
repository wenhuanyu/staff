<template>
	<view>
		<!-- 更多操作 -->
		<more-pop 
			v-if="false" 
			relation_type="approval" 
			:relation_id="id" 
			:staffList="info.show_staff_data"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		<view class="button_warp" v-if="info.is_examine == 1">
			<view class="btn jujue" @click="toExamine(2)">审核拒绝</view>
			<view class="btn tongyi" @click="toExamine(1)">审核通过</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">审批状态</view>
			<view class="form_right">
				<view class="valueActive" v-if="info.check_status == 1">待审核</view>
				<view class="valueActive" v-if="info.check_status == 2">审核通过</view>
				<view class="valueActive" v-if="info.check_status == 3">审核拒绝</view>
				<view class="valueActive" v-if="info.check_status == 4">撤销审核</view>
				<view class="valueActive" v-if="info.check_status == 5">终止审核</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<!-- 加班申请表 -->
		<form-item v-if="listForm" :listForm="listForm" :isEdit="edit"  @changeData="changeOtherData"></form-item>
		<examine-people :list="remindPeople" @delItem="delItem" v-if="edit"></examine-people>
		
		<view class="info_item" v-if="!edit">
			<view class="title">审批流程</view>
			<!-- 审批流程 -->
			<approval-status :process="payment_approval"></approval-status>
		</view>
		<view class="button" v-if="edit" @click="toSubEdit">提交</view>
		<view class="appbottom"></view>
		<view class="newbot" v-if="!edit && info.check_status != 9 && info.check_status != 2 && info.is_operation == 1" @click="moreManage">
			<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="moreimg" ></image>
			更多
		</view>
		<more-operation
			ref="operationChild"
			:info="info"
			@toAEdit="toEdit"
			@zhongzhiSuccess="zhongzhiSuccess"
		></more-operation>
		
		<view class="app_exam" v-if="false">
			<view class="exam_btn revoke" @click="toCancel" v-if="info.check_status == 1">撤销审批</view>
			<view class="exam_btn rightbtn" v-if="info.check_status == 3 || info.check_status == 4" @click="toEdit">修改审批</view>
			<view class="exam_btn rightbtn" v-if="info.check_status != 2 && info.check_status != 3" @click="toTrimation">终止审批</view>
		</view>
		
		
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem.vue'
	import { commonFun } from '@/common/navigate.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netWorkExamineDetail, netWorkExamineForm,netTerminationApprove, netCancelWorkExamine, 
	netEditWorkExamine, netApprovalDetail } from '@/api/api.js'
	import moreOperation from './more-operation.vue'
	
	export default{
		mixins:[commonFun],
		components:{
			formItem,
			moreOperation
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				listForm:null,
				id:'',
				status:1,  //1待审核  2审核通过  3审核拒绝
				type:1,   //1我发起的  2我审核的
				info:{},
				teamInfo:{},
				remindPeople:[],
				examineType:'',
				edit:false,
				payment_approval:{},
				//加班申请表
				num:'',
				name:'',
				department_name:'',   //部门
				post:'',   //职位
			}
		},
		onLoad(options) {
			this.id = options.id
			
		},
		onShow() {
			this.getDetail()
			this.getDefaultRemind()
			//审批流程
			this.getApprovalList()
		},
		onHide() {
		},
		//监听  页面 卸载
		onUnload() {
			uni.removeStorageSync('remindlist')
		},
		methods:{
			moreManage() {
				this.$refs.operationChild.open()
			},
			//终止成功
			zhongzhiSuccess() {
				
				this.getDetail()
			},
			//审批流程
			getApprovalList() {
				let params = {
					type: 'approval',
					relation_id: this.id
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//传阅
			toCirculate() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.id+'&type=approval'
				})
			},
			toExamine(status) {
				//status  1同意   2拒绝
				uni.navigateTo({
					url:'/pages/template/examine?status='+status+'&id='+this.id+'&type=approval'
				})
			},
			getDetail() {
				netWorkExamineDetail({id:this.id}).then(res=>{
					this.info = res.data
					if(res.data.formapproval_id == 1) {
						//加班申请表
						this.num = res.data.content.num
						this.name = res.data.content.name
					}else if(res.data.formapproval_id == 113 || res.data.formapproval_id == 120) {
						this.num = res.data.content.num
						this.name = res.data.content.name
						this.department_name = res.data.content.department_name
						this.post = res.data.content.post
					}else if(res.data.formapproval_id == 119) {
						this.name = res.data.content.name
						this.department_name = res.data.content.department_name
						this.post = res.data.content.post
					}
					this.getForm()
				})
			},
			getTeam() {
				netWorkExamineDetail({id:this.id}).then(res=>{
					this.teamInfo = res.data
				})
			},
			getForm() {
				netWorkExamineForm({id:this.info.formapproval_id}).then(res=>{
					let data = res.data.data
					let staff = res.data.staff
					data.forEach(ele=>{
						if(ele.component == 'checkbox'){
							ele.config.content.forEach(item=>{
								if(this.info.content[ele.id].indexOf(item.value) != -1){
									item.checked = true
								}
							})
						}
						ele.value = this.info.content[ele.id]
					})
					this.listForm = data
					console.log(this.listForm,'----')
					this.remindPeople = staff
				})
			},
			
			changeOtherData(name,value,obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			toEdit() {
				this.showPop = false
				uni.setNavigationBarTitle({
					title:'修改审批'
				})
				this.examineType = 'approval'
				this.edit = true
			},
			toSubEdit() {
				let arrlist = []
				let data = this.checkCommonForm(this.listForm)
				if(!data){
					return
				}
				if(this.info.formapproval_id == 1) {
					data.num = this.num
					data.name = this.name
				}else if(this.info.formapproval_id == 113){
					data.num = this.num
					data.name = this.name
					data.department_name = this.department_name
					data.post = this.post
				}
				if(this.remindPeople.length == 0){
					uni.showToast({
						title:'请选择审批人',
						icon:'none'
					})
					return
				}
				//流程审批人
				let remarr = []
				this.remindPeople.forEach(ele=>{
					remarr.push(ele.id)
				})
				let flow_staff_ids = remarr.join(',')
				let params = {
					formapproval_id:this.info.formapproval_id,
					relation_type:'approval',
					data,
					flow_staff_ids,
					id: this.id
				}
				netEditWorkExamine(params).then(res=>{
					uni.showToast({
						title: res.msg,
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
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
	.info_item{
		padding: 20rpx 30rpx;
		.title{
			color:#666;
			margin-bottom:24rpx;
		}
	}
	.team_warp{
		padding:24rpx 35rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.team_left{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.teamtit{
				font-size:26rpx;
				color:#666;
				margin-right:24rpx;
			}
			.teambox{
				width:430rpx;
				height:60rpx;
				.staffheader{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.staffimg{
						width:60rpx;
						height:60rpx;
						border-radius: 50%;
						margin-right:20rpx;
						flex-shrink: 0;
					}
				}
			}
		}
		.team_right{
			font-size:28rpx;
			color:#007AFF;
			font-weight: bold;
			flex-shrink: 0;
		}
	}
	.appbottom{
		height:calc(50rpx + env(safe-area-inset-bottom));
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
		border-top:1rpx solid #EDEDED;
		background:#fff;
		z-index: 99;
		.exam_btn{
			width:200rpx;
			height:70rpx;
			border-radius: 40rpx;
			font-size:31rpx;
			text-align: center;
		}
		.revoke{
			border:1rpx solid #0287FF;
			color:#0287FF;
			line-height: 68rpx;
		}
		.rightbtn{
			color:#fff;
			background:#0287FF;
			line-height: 70rpx;
		}
	}
</style>
