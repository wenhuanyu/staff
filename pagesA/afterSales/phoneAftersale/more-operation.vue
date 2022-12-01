<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<!-- 操作人 -->
				<view class="ope_li" v-if="workorderInfo.process == 4 && (workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1 || workorderInfo.is_operation == 1)" @click="toDown">
					<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg"></image>
					<view class="litext">下载配件报价单</view>
				</view>
				<!-- 老大 -->
				<!-- 助力 -->
				<view class="ope_li" v-if="workorderInfo.process >= 0 && workorderInfo.status == 2 && workorderInfo.is_revoke == 1" @click="toChexiaoWork">
					<image :src="BASE_IMG_URL+'/index/chexiao.png'" class="opeimg"></image>
					<view class="litext">撤销工单</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.process == 0 && workorderInfo.status == 1 && workorderInfo.is_revoke == 1" @click="toEditWork">
					<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg"></image>
					<view class="litext">修改工单</view>
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
			//下载
			toDown() {
				this.close()
				this.$emit('toDownP')
			},
			//撤销工单
			toChexiaoWork() {
				uni.navigateTo({
					url:'/pagesA/afterSales/chexiaoWork?id='+this.workorderInfo.id,
					success:()=>{
						this.close()
					}
				})
			},
			//修改工单
			toEditWork() {
				uni.navigateTo({
					url:'/pagesA/afterSales/phoneAftersale/edit?id='+this.workorderInfo.id,
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
