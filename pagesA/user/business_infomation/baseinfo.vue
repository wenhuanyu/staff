<template>
	<view>
		<view class="form_list">
			<view class="form_label">公司名称</view>
			<view class="from_text">{{baseinfo.name?baseinfo.name:''}}</view>
		</view>
		<view class="form_list">
			<view class="form_label">公司地址</view>
			<view class="from_text">{{baseinfo.address?baseinfo.address:''}}</view>
		</view>
		<view class="form_list">
			<view class="form_label">公司法人</view>
			<view class="from_text">{{baseinfo.oper_name?baseinfo.oper_name:''}}</view>
		</view>
		<view class="form_list">
			<view class="form_label">注册资金</view>
			<view class="from_text">{{baseinfo.regist_capi?baseinfo.regist_capi:''}}</view>
		</view>
		<view class="form_list">
			<view class="form_label">注册时间</view>
			<view class="from_text">{{baseinfo.start_date?baseinfo.start_date:''}}</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		data(){
			return{
				baseinfo:{}
			}
		},
		onLoad() {
			this.baseinfo = uni.getStorageSync('businessInfo')?uni.getStorageSync('businessInfo').enterprise.basic:{}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.form_list{
		padding:24rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.form_label{
			font-size:32rpx;
			color:#999;
		}
		.form_text{
			font-size:30rpx;
			color:#333;
		}
	}
</style>
