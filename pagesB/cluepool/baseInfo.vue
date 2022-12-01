<template>
	<view class="info_detail">
		<view class="info_item">
			<form-item v-if="list" :listForm="list" :isEdit="false" ></form-item>
		</view>
	</view>
</template>

<script>
	import { netSetForm } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	export default {
		props:{
			info:{
				type:Object,
				default:{}
			}
		},
		components:{
			formItem
		},
		data() {
			return {
				list:null
			}
		},
		created() {
			this.getForm()
		},
		methods: {
			getForm() {
				let params = {type:'leads'}
				netSetForm(params).then(res=>{
					res = res.data.data
					this.list = this.handleFormDefaultValue(res,this.info)
				})
			},
		}
	}
</script>

<style lang="scss">
.info_detail {
	margin-bottom: 100rpx;
	.basic_head {
		display: flex;
		padding: 30rpx 24rpx 30rpx;
		:last-child {
			font-weight: 700;
			margin-left: 8rpx;
		}
	}
	.basic_main {
		display: flex;
		justify-content: space-between;
		padding: 0 32rpx;
		background-color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-bottom: 1rpx solid #EAEAEA;
		:first-child {
			color: #999;
		}
	}
}

</style>
