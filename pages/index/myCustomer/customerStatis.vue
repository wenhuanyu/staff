<template>
	<view class="">
		<!-- 筛选 -->
		<view class="searchbox">
			<view class="searchtext" @click="toQuery">筛选<view class="iconfont icon-shaixuan"></view></view>
		</view>
		
		<view class="section">
			<view class="statisbox">
				<view class="box_li">
					<view class="num">{{statisInfo.customer?statisInfo.customer:0}}</view>
					<view class="tit">新增客户数</view>
				</view>
				<view class="box_li">
					<view class="num">{{statisInfo.record?statisInfo.record:0}}</view>
					<view class="tit">跟进客户数</view>
				</view>
			</view>
			<view class="statisbox">
				<view class="box_li">
					<view class="num">{{statisInfo.customer_complate?statisInfo.customer_complate:0}}</view>
					<view class="tit">成交客户数</view>
				</view>
				<view class="box_li">
					<view class="num">{{statisInfo.customer_nocomplate?statisInfo.customer_nocomplate:0}}</view>
					<view class="tit">客户未成交数</view>
				</view>
			</view>
			<view class="statisbox">
				<view class="box_li">
					<view class="num">{{statisInfo.seaout?statisInfo.seaout:0}}</view>
					<view class="tit">公海池领取客户数</view>
				</view>
				<view class="box_li">
					<view class="num">{{statisInfo.seain?statisInfo.seain:0}}</view>
					<view class="tit">进入公海客户数</view>
				</view>
			</view>
		</view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { netNewCustomerStatis } from '@/api/api.js'
	import screenPop from '@/pages/index/contractManagements/statisScreen.vue'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
				queryObj:{
					times:'thismonth',
					type:0
				},
				statisInfo:{}
			}
		},
		onLoad() {
			this.getData()
		},
		methods:{
			getData() {
				netNewCustomerStatis(this.queryObj).then(res=>{
					this.statisInfo = res.data
				})
			},
			toQuery() {
				this.$refs.screenChild.open()
			},
			sureQuery(obj){
				this.queryObj = obj
				this.getData()
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.searchbox{
		display: flex;
		justify-content: flex-end;
		margin:24rpx;
		.searchtext{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:$uni-text-color;
			padding:8rpx 28rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			.icon-shaixuan{
				color:$uni-text-color;
			}
		}
	}
	.section{
		background:#fff;
		padding:0 24rpx;
		.statisbox{
			border-bottom:1rpx solid #f5f5f5;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0;
			.box_li{
				width:50%;
				height:80rpx;
				text-align: center;
				position: relative;
				.num{
					font-size:28rpx;
					color:#333;
				}
				.tit{
					font-size:26rpx;
					color:#666;
				}
				&::after{
					content:'';
					width:1rpx;
					height:80rpx;
					background:#f5f5f5;
					position: absolute;
					right:0;
					top:0;
				}
				&:last-child{
					&::after{
						display: none;
					}
				}
			}
		}
	}
</style>