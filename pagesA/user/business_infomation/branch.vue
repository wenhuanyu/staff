<template>
	<view>
		<view class="branch_li" v-for="(item,index) in branchList" :key="index">{{item.name}}</view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				branchList:[]
			}
		},
		onLoad() {
			this.branchList = uni.getStorageSync('businessInfo').enterprise.branches
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.branch_li{
		padding:24rpx;
		text-align: center;
		font-size:28rpx;
		color:#666;
		border-bottom:1rpx solid #f5f5f5;
	}
</style> 
