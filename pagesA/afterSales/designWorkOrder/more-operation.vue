<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" @click="toEditWork" v-if="workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1">
					<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg"></image>
					<view class="litext">修改工单</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.is_leader == 1  || workorderInfo.is_operation == 1" @click="toAssist">
					<image :src="BASE_IMG_URL+'/index/sheji_xiezuo.png'" class="opeimg"></image>
					<view class="litext">邀请协作</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.is_leader == 1 || workorderInfo.is_operation == 1" @click="toComplete">
					<image :src="BASE_IMG_URL+'/index/sheji_success.png'" class="opeimg"></image>
					<view class="litext">设计成功</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.is_leader == 1 || workorderInfo.is_operation == 1" @click="toTaskfailed">
					<image :src="BASE_IMG_URL+'/index/sheji_fail.png'" class="opeimg"></image>
					<view class="litext">设计失败</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.is_revoke == 1" @click="toRevoke">
					<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg"></image>
					<view class="litext">终止工单</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	export default{
		props:{
			workorderInfo:{
				type:Object,
				default:{}
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		methods:{
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			//修改工单
			toEditWork() {
				uni.navigateTo({
					url:'/pagesA/afterSales/designWorkOrder/editDesign?id='+this.workorderInfo.id,
					success:()=>{
						this.close()
					}
				})
			},
			//其他部门协助
			toAssist() {
				uni.navigateTo({
					url:'/pagesA/afterSales/designWorkOrder/assist?id='+this.workorderInfo.id,
					success:()=>{
						this.close()
					}
				})
			},
			//完成工单
			toComplete() {
				uni.navigateTo({
					url:'/pagesA/afterSales/designWorkOrder/complete?id='+this.workorderInfo.id,
					success:()=>{
						this.close()
					}
				})
			},
			//任务失败
			toTaskfailed() {
				uni.navigateTo({
					url:'/pagesA/afterSales/designWorkOrder/fail?id='+this.workorderInfo.id,
					success:()=>{
						this.close()
					}
				})
			},
			//终止工单
			toRevoke() {
				uni.navigateTo({
					url:'/pagesA/afterSales/revokeWork?id='+this.workorderInfo.id,
					success:()=>{
						this.close()
					}
				})
			},
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
