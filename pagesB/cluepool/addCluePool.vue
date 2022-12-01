<template>
	<view class="create_customer">
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<!-- 基础信息 -->
		<form-item v-if="listForm" :listForm="listForm" :isNotRequired="isRequired" @changeData="changeData" ></form-item>
		<view class="button" @click="$noMultipleClicks(subSave)">
			保存
		</view>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem.vue'
	import { netAddCluesPool, netSetForm } from '@/api/api.js'
	import { checkPhone } from '@/utils/util.js'
	export default {
		components:{
			formItem
		},
		data() {
			return {
				noClick:true,  //防止重复点击
				is_event:false,   //是否创建下次跟进任务
				source_list:[],   //线索 来源列表
				sourceIndex:null,
				industry_list:[],   //行业列表
				industryIndex:null,
				remindList:['准时提醒','5分钟前','15分钟前','30分钟前','一个小时前','两个小时前','一天前','两天前','一周前'],   //提醒
				remindIndex:null,
				listForm:null,  //表单
				checked: false,
				isRequired:false,  //是否只展示必填字段
			}
		},
		onLoad(options) {
			//获取 表单设置
			this.getForm()
		},
		onShow() {
			
		},
		methods: {
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			getForm(){
				let params = {type:'leads'}
				netSetForm(params).then(res=>{
					let arr = res.data.data
					arr.forEach(ele=>{
						ele.value = ele.value?ele.value:''
					})
					this.listForm = arr
				})
			},
			changeData(name,value,obj){
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			//完成
			subSave() {
				let leads = this.checkCommonForm(this.listForm)
				if(!leads){
					return
				}
				let params = {}
				params.leads = leads
				netAddCluesPool(params).then(res=>{
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
.valueActive{
	color:#333;
}
.create_customer {
	font-size: 28rpx;
	.info_head {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		color: #999;
		padding-left: 55rpx;
	}
	.mar_top {
		margin-top: 30rpx;
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 0 24rpx;
		font-size: 32rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 35rpx 5rpx 0 0;
			}
		}
		.theme {
			color: #5ca9fe;
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
		.form_input {
			input {
				text-align: right;
				margin-right: 10rpx;
			}
		}
	}
}
</style>
