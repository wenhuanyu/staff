<template>
	<view class="create_customer">
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<form-item v-if="listForm" :listForm="listForm" :isNotRequired="isRequired" @changeData="changeData"></form-item>
		<view class="button" @click="$noMultipleClicks(subSave)">
			保存
		</view>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem.vue'
	import { netSetForm, netSelect, netCluesDetail, netEditClues } from '@/api/api.js'
	import { checkPhone } from '@/utils/util.js'
	import { dateTimePicker, getMonthDay } from '@/utils/dateTimePicker.js'
	export default {
		components:{
			formItem
		},
		data() {
			return {
				noClick:true,    //防止  重复点击
				id:'',
				info:{},
				listForm:null,
				isRequired:false,  //是否只展示必填字段
			}
		},
		onLoad(options) {
			this.id = options.id
			//获取 线索 信息
			this.getinfo()
		},
		onShow() {
			
		},
		methods: {
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			getForm() {
				let params = {type:'leads'}
				netSetForm(params).then(res=>{
					let list = res.data.data
					this.listForm = this.handleFormDefaultValue(list,this.info)
				})
			},
			// 获取 线索 信息
			getinfo() {
				netCluesDetail({id:this.id}).then(res=>{
					res = res.data
					this.info = res
					this.getForm()
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
				let params = this.checkCommonForm(this.listForm)
				if(!params){
					return
				}
				params.id = this.id
				netEditClues(params).then(res=>{
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
.create_customer {
	font-size: 28rpx;
	.info_head {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #999;
		padding-left: 24rpx;
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
		input {
			height: 100rpx;
			line-height: 100rpx;
		}
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
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
				height: 100rpx;
				line-height: 100rpx;
				text-align: right;
				margin-right: 10rpx;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			text {
				color: #f00;
			}
		}
		textarea {
			width: 100%;
			height: 300rpx;
			background: #f8f8f8;
		}
	}
}
</style>
