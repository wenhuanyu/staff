<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">工号<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="num" disabled placeholder="工号" class="rightinput" :class="num ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">姓名<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="name" disabled placeholder="姓名" class="rightinput" :class="name ? 'valueActive' : '' ">
			</view>
		</view>
		<form-item v-if="listForm" :listForm="listForm" @changeData="changeOtherData"></form-item>
		<examine-people :list="examinePeople" @delItem="delExamine"></examine-people>
		<view class="button"  @click="$noMultipleClicks(toSubmit)">确认</view>
	</view>
</template>

<script>
	import { netWorkExamineForm,netCreateWorkExamine} from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		components:{
			formItem
		},
		data() {
			return{
				noClick:true,    //防止  重复点击
				formid:'',
				num:'',   //工号
				name:'',   //姓名
				listForm:null,
				examinePeople:[],   //审核人
			}
		},
		onLoad(options) {
			this.formid = options.id
			this.getForm()
			this.num = uni.getStorageSync('userinfo').num
			this.name = uni.getStorageSync('userinfo').name
			uni.setNavigationBarTitle({
				title:options.name
			})
		},
		onShow() {
			this.getExamine()
		},
		methods:{
			//获取审核人
			getExamine() {
				let arr = this.deWeight([...this.examinePeople,...uni.getStorageSync('remindlist')])
				this.examinePeople = arr
			},
			delExamine(index) {
				this.examinePeople.splice(index,1)
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
			getForm() {
				netWorkExamineForm({id:this.formid}).then(res=>{
					let form = res.data.data
					form.forEach(ele=>{
						ele.value = ''
					})
					this.listForm = form
					this.examinePeople = res.data.staff
				})
			},
			toSubmit() {
	
				if(!this.name) {
					uni.showToast({
						title:'请填写姓名',
						icon:'none'
					})
					return
				}
				let arrlist = []
				let data = this.checkCommonForm(this.listForm)
				if(!data){
					return
				}
				if(this.examinePeople.length == 0){
					uni.showToast({
						title:'请选择审批人',
						icon:'none'
					})
					return
				}
				//流程审批人
				let remarr = []
				this.examinePeople.forEach(ele=>{
					remarr.push(ele.id)
				})
				let flow_staff_ids = remarr.join(',')
				data.num = this.num
				data.name = this.name
				let params = {
					formapproval_id:this.formid,
					relation_type:'approval',
					flow_staff_ids,
					data,
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
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
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
				font-size:24rpx;
			}
		}
	}
</style>
