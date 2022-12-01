<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popuptitle">批量操作</view>
			<view class="ope_warp">
				<view class="ope_li">
					<image :src="BASE_IMG_URL+'/index/batch3.png'" @click="changeTab(0)" style="width:48rpx;height:48rpx;" class="opeimg"></image>
					<view class="litext">移入公海</view>
				</view>
				<view class="ope_li">
					<image :src="BASE_IMG_URL+'/index/batch2.png'" @click="changeTab(1)" style="width:48rpx;height:48rpx;" class="opeimg"></image>
					<view class="litext">更换负责人</view>
				</view>
				<view class="ope_li">
					<image :src="BASE_IMG_URL+'/index/ht-fuzhi.png'" @click="changeTab(3)" class="opeimg"></image>
					<view class="litext">添加团队成员</view>
				</view>
				<view class="ope_li">
					<image :src="BASE_IMG_URL+'/index/batch1.png'" @click="changeTab(4)" style="width:48rpx;height:48rpx;" class="opeimg"></image>
					<view class="litext">移除团队成员</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			showPop:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		created() {
		},
		methods:{
			open() {
				this.$refs.popup.open()
			},
			changeTab(index) {
				//0 转移  1更换负责人  2作废  3添加团队成员  4移除团队成员
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/batchList?type='+index,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ope_warp{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding:30rpx 0;
		.warpbox{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
		.ope_li{
			width:33.33%;
			margin-bottom:24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.opeimg{
				width:38rpx;
				height:38rpx;
				margin-bottom:10rpx;
			}
			.litext{
				font-size:26rpx;
				color:#999999;
				text-align: center;
			}
		}
	}
</style>
