<template>
	<view>
		<view class="warp" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
			<view class="warp_title">关联合同：{{item.contract.num}}</view>
			<view class="warp_title">关联客户：{{item.customer.name}}</view>
			<view class="warp_title"><image :src="BASE_IMG_URL + '/index/clock.png'"></image>{{item.createtime}}</view>
		</view>
		<view v-if="list.length == 0" class="noData">暂无更多</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		methods:{
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesB/order/detail?id='+item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp{
		width: 690rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
		margin-bottom:24rpx;
		.warp_title{
			margin-left: 44rpx;
			font-size:26rpx;
			color:#999;
			margin-bottom: 21rpx;
			&:first-child{
				padding: 21rpx 0;
				margin-bottom:19rpx;
				font-size: 26rpx;
				color: #666;
				border-bottom: 1rpx solid #ededed;
			}
			&:last-child{
				display: flex;
				align-items: center;
				padding-bottom:33rpx;
				margin-bottom: 0;
			}
			image{
				margin-right: 15rpx;
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
</style>
