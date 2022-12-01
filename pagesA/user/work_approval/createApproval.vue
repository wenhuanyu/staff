<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<form-item v-if="listForm" :listForm="listForm" @changeData="changeOtherData"></form-item>
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 选择审批人 -->
		<examine-people v-if="approvalPro.status == 0" :list="remindPeople" @delItem="delItem"></examine-people>
		<view class="button" @click="$noMultipleClicks(toSubmit)">提交</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import { netWorkExamineForm,netCreateWorkExamine, netApprovalProcess } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		components:{
			formItem
		},
		data() {
			return {
				noClick:true,    //防止  重复点击
				formid:'',
				name:'',
				listForm:null,
				remindPeople:[],
				examineType:'approval',
				approvalPro:{},   //审批流程
			}
		},
		onLoad(options) {
			this.formid = options.id
			this.name = options.name
			this.getForm()
			uni.setNavigationBarTitle({
				title:this.name
			})
			//获取审批流程
			this.getProcess()
		},
		onShow() {
			// this.getDefaultRemind()
			if(this.approvalPro.status == 0){
				this.remindPeople = this.deWeight([...uni.getStorageSync('remindlist')])
			}
		},
		//监听  页面 卸载
		onUnload() {
			uni.removeStorageSync('remindlist')
		},
		methods:{
			//审批流程
			getProcess() {
				netApprovalProcess({type:'approval_'+this.formid}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						this.remindPeople = this.deWeight([...uni.getStorageSync('remindlist')])
					}
				})
			},
			delItem(index) {
				this.remindPeople.splice(index, 1)
				uni.setStorageSync('remindlist', this.remindPeople)
			},
			getForm() {
				netWorkExamineForm({id:this.formid}).then(res=>{
					let form = res.data.data
					form.forEach(ele=>{
						ele.value = ''
					})
					this.listForm = form
					uni.setStorageSync('remindlist', res.data.staff)
					this.remindPeople = res.data.staff
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
			
			toSubmit() {
				let arrlist = []
				let data = this.checkCommonForm(this.listForm)
				if(!data){
					return
				}
				if(this.remindPeople.length == 0 && this.approvalPro.status == 0){
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
					formapproval_id:this.formid,
					relation_type:'approval',
					data,
					flow_staff_ids:this.approvalPro.status == 0 ? flow_staff_ids:''
				}
				netCreateWorkExamine(params).then(res=>{
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
	
</style>
