<template>
	<view>
		<view class="wk_li"  v-for="(item,index) in list" :key="index" @click="toDetail(item)">
			<view class="wk_top">
				<view class="wk_top_left">
					<view class="wk_tit">{{item.title}}</view>
				</view>
			</view>
			<view class="wk_info">
				<view class="wk_info_lef">
					<view class="wk_lef_text">类型：{{item.customer.name}}</view>
					<view class="wk_lef_text">发起人：测试</view>
					<view class="wk_lef_text">发起时间：{{item.address+item.address_detail}}</view>
					<view class="wk_lef_text">备注：测试</view>
				</view>
				<view class="wk_info_right">
					<image :src="BASE_IMG_URL+'/index/examine-3.png'" class="examineimg" ></image>
				</view>
			</view>
			<view class="wk_bot">
				<view class="wk_bot_left">
					<view class="bot_btn leftbtn">拒绝</view>
				</view>
				<view class="wk_bot_left">
					<view class="bot_btn rightbtn" >同意</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			list:{
				type:Array,
				default:[{}]
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.wk_li{
		width:690rpx;
		background:#fff;
		box-shadow: 1rpx 3rpx 8rpx 2rpx #c6c4c4;
		border-radius: 10rpx;
		padding:30rpx 30rpx 0 30rpx;
		margin:0 auto 24rpx;
		.wk_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom:20rpx;
			border-bottom:1rpx solid #EDEDED;
			.wk_top_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.wk_tit{
					font-size:30rpx;
					color:#333333;
				}
				.wk_status{
					font-size:22rpx;
					color:#FF9B26;
					background:rgba(255, 155, 38, 0.1);
					padding:0 10rpx;
					margin-left:15rpx;
				}
			}
			.wk_top_right{
				font-size:24rpx;
				color:#FF9B26;
				padding:5rpx 15rpx;
				border:1rpx solid #FF9B26;
			}
		}
		.wk_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:20rpx;
			margin-top:20rpx;
			.wk_info_lef{
				flex:1;
				margin-right:24rpx;
				.wk_lef_text{
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
				}
			}
			.wk_info_right{
				flex-shrink: 0;
				.examineimg{
					width:121rpx;
					height:93rpx;
				}
			}
		}
		.wk_bot{
			border-top:1rpx solid #EDEDED;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.wk_bot_left{
				width:50%;
				display: flex;
				justify-content: center;
				align-items: center;
				padding:24rpx 0;
				.bot_btn{
					width:284rpx;
					height:68rpx;
					border-radius: 34rpx;
					font-size:32rpx;
					text-align: center;
					line-height: 68rpx;
				}
				.leftbtn{
					border:1rpx solid #4E80F5;
					color:#4E80F5;
					line-height: 66rpx;
				}
				.rightbtn{
					background:#4E80F5;
					color:#fff;
				}
			}
		}
	}
</style>
