<template>
	<view class="info_detail">
		<view class="info_item">
			<view class="fllow_form">
				<view style="color:#666">创建人</view>
				<view class="form_right"> 
					<view class="valueActive">{{info.create_staff ? info.create_staff.name : ''}}</view>
				</view>
			</view>
			<view class="fllow_form" v-if="info.tranfer_staff">
				<view style="padding-left: 20rpx;">转派人</view>
				<view class="form_right"> 
					<view class="valueActive">{{info.tranfer_staff ? info.tranfer_staff.name : ''}}</view>
				</view>
			</view>
			<form-item :isEdit="false" v-if="list" :listForm="list"></form-item>
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
					console.log(this.handleFormDefaultValue(res,this.info),'fuzhi')
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
.fllow_form {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;
	border-bottom: 1rpx solid #EAEAEA;
	padding: 30rpx 20rpx;
	color: #999;
	font-size: 24rpx;
	.nameinput {
		width: 450rpx;
		margin-left: 20rpx;
	}
	.form_right {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		color: #999;
		text-align: right;
		.location {
			width: 450rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
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
			width: 300rpx;
			text-align: right;
			height: 100rpx;
			line-height: 100rpx;
			text-align: right;
			margin-right: 10rpx;
		}
	}
}
</style>
