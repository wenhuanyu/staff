<template>
	<view>
		<view class="spart_item" :class="styleType == 'list' ? '' : 'index_wk_li'" @tap.stop="toDetail(item)" v-for="(item,index) in list" :key="index">
			<view class="spart_name">{{item.name}}</view>
			<view class="spart_info">
				<view class="spart_left">
					<view class="sp_text">型号：{{item.num}}</view>
					<view class="sp_text">单价：￥<span>{{item.price}}</span></view>
					<view class="sp_text">规格：{{item.unit}}</view>
					<view class="sp_text">库存：{{item.stock}}</view>
				</view>
			</view>
			<view class="spart_bot" @tap.stop.prevent>
				<view class="bot_btn btnfir" @tap.stop="toInLibrary(2,item)">
					<image :src="BASE_IMG_URL + '/index/outStock.png'"></image>
					<text>出库</text>
				</view>
				<view class="bot_btn btnsec" @tap.stop="toInLibrary(1,item)">
					<image :src="BASE_IMG_URL + '/index/inStock.png'" ></image>
					<text>入库</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			},
			active:{
				type:Number,
				default:0
			},
			styleType:{
				type:String,
				default:"list"
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
			//入库
			toInLibrary(type,item) {
				uni.navigateTo({
					url: '/pagesC/sparepart/inLibrary?type=' + type+'&id='+item.id
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pagesC/sparepart/sparepartDetail?id='+item.id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.spart_item{
		width:690rpx;
		border-radius: 20rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		margin:24rpx auto 0;
		.spart_name{
			padding: 24rpx 0 12rpx 0;
			margin-left: 37rpx;
			border-bottom: 1rpx solid #EDEDED;
			font-size: 28rpx;
			color:#333333;
		}
		.spart_info{
			margin: 0 auto;
			padding: 11rpx 37rpx;
			.spart_left{
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				.sp_text{
					padding: 11rpx 0;
					text-align: left;
					width: 50%;
					font-size:26rpx;
					color:#999;
					span{
						font-size:26rpx;
					}
				}
			}
			.spart_right{
				flex-shrink: 0;
				.spart_num{
					width:120rpx;
					height:120rpx;
					border-radius: 10rpx;
					font-size:30rpx;
					color:#0287FF;
					text-align: center;
					line-height: 120rpx;
				}
				.spart_num_bc{
					background:rgba(2, 135, 255, 0.1);
				}
				.spart_num_ac{
					background:rgba(242, 83, 64, 0.1);
					color:#F25340;
				}
				.spartp{
					font-size:26rpx;
					color:#999999;
					text-align: center;
				}
			}
		}
		.spart_bot{
			margin-left: 37rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top:1rpx solid #ededed;
			.bot_btn{
				display: flex;
				justify-content: center;
				align-items: center;
				width:284rpx;
				height:68rpx;
				border-radius: 34rpx;
				font-size:32rpx;
				text-align: center;
				image{
					margin-right: 15rpx;
					width: 33rpx;
					height: 34rpx;
				}
			}
			.btnfir{
				color:$uni-text-color;
				line-height: 66rpx;
			}
			.btnsec{
				color:$uni-text-color;
				line-height: 68rpx;
			}
		}
	}
	.index_wk_li{
		width: 100%;
		background: #F6F6F6;
	}
</style>
