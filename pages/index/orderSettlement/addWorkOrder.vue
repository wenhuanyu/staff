<template>
	<view>
		<view class="title">工单</view>
		<view class="tabwarp">
			<view class="tabli" @click="toAddDesign">
				<image :src="BASE_IMG_URL+'/index/mubansheji.png'" class="tabimg" ></image>
				<view class="tabtext">设计工单</view>
			</view>
			<view class="tabli" @click="toPdelivery('生产工单')">
				<image :src="BASE_IMG_URL+'/index/shengchan.png'" class="tabimg" ></image>
				<view class="tabtext">生产工单</view>
			</view>
			<view class="tabli" @click="toPdelivery('产品发货')">
				<image :src="BASE_IMG_URL+'/index/peisong.png'" class="tabimg" ></image>
				<view class="tabtext">产品配送</view>
			</view>
			<view class="tabli" @click="toPinstall('上门安装')">
				<image :src="BASE_IMG_URL+'/index/anzhuang.png'" class="tabimg"></image>
				<view class="tabtext">产品安装</view>
			</view>
			<view class="tabli" @click="toDoorRepair">
				<image :src="BASE_IMG_URL+'/index/weixiu.png'" class="tabimg" ></image>
				<view class="tabtext">上门维修</view>
			</view>
			<view class="tabli" @click="toAddRepot">
				<image :src="BASE_IMG_URL+'/index/fanchang.png'" class="tabimg" ></image>
				<view class="tabtext">返厂维修</view>
			</view>
			<view class="tabli" @click="toQuality">
				<image :src="BASE_IMG_URL+'/index/yichangfenxi.png'" class="tabimg" ></image>
				<view class="tabtext">品质异常单</view>
			</view>
			<view class="tabli" @click="toAddPhone">
				<image :src="BASE_IMG_URL+'/index/dianhua.png'" class="tabimg" ></image>
				<view class="tabtext">电话服务</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			//产品配送  设计工单  生产工单
			toPdelivery(type) {
				uni.navigateTo({
					url:'/pages/index/orderSettlement/template/product_delivery?type='+type
				})
			},
			//产品安装
			toPinstall(type) {
				uni.navigateTo({
					url:'/pages/index/orderSettlement/template/product_install?type='+type
				})
			},
			//品质异常单
			toQuality() {
				uni.navigateTo({
					url:'/pages/index/orderSettlement/template/quality_order'
				})
			},
			//返厂维修
			toAddRepot() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/workorder/repotRepair'
				})
			},
			//上门维修
			toDoorRepair() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/workorder/ondoorRepair'
				})
			},
			//设计工单
			toAddDesign() {
				uni.navigateTo({
					url:'/pagesA/afterSales/designWorkOrder/addDesignOrder?type=1'
				})
			},
			//电话服务
			toAddPhone() {
				uni.navigateTo({
					url:'/pagesA/afterSales/phoneAftersale/add'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		padding: 40rpx 0 0 30rpx;
		margin-left: 24rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
		&::before{
			content:'';
			position:absolute;
			left:30rpx;
			// top:26rpx;
			width:10rpx;
			height:25rpx;
			border-radius: 5rpx;
			background: $uni-btn-bg-color;
		}
	}
	.tabwarp{
		padding:30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.tabli{
			width: 33%;
			text-align: center;
			// padding:24rpx;
			// margin-right:26rpx;
			margin: 50rpx 0 26rpx 0;
			// box-shadow: 1rpx 1rpx 15rpx 2rpx rgba(0,0,0,0.1);
			&:nth-child(4n){
				margin-right:0;
			}
			.tabimg{
				width:50rpx;
				height:50rpx;
				margin-bottom: 15rpx;
			}
			.tabtext{
				font-size:26rpx;
				color:#333;
			}
		}
	}
</style>
