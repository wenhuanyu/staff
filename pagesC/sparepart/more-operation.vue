<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" @click="toInLibrary(2)">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg" ></image>
					<view class="litext">出库</view>
				</view>
				<view class="ope_li" @click="toInLibrary(1)">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg" ></image>
					<view class="litext">入库</view>
				</view>
				<!-- <view class="ope_li" @click="toDiscuss">
					<image :src="BASE_IMG_URL+'/index/sheji_xiezuo.png'" class="opeimg" ></image>
					<view class="litext">讨论</view>
				</view>
				<view class="ope_li" @click="toChuanyue">
					<image :src="BASE_IMG_URL+'/index/zhuangpai.png'" class="opeimg" ></image>
					<view class="litext">传阅</view>
				</view> -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			showPopMore:{
				type:Boolean,
				default:false
			},
			info:{
				type:Object,
				default:{}
			},
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
			//入库
			toInLibrary(type) {
				uni.navigateTo({
					url: '/pagesC/sparepart/inLibrary?type=' + type+'&id='+this.info.id,
					success:()=>{
						this.close()
					}
				})
			},
			//讨论
			toDiscuss() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/discuss?id='+this.info.id+'&type=parts',
					success:()=>{
						this.close()
					}
				})
			},
			//传阅
			toChuanyue() {
				this.close()
				this.$emit('toChuanyue')
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
