<template>
	<view>
		<view class="box-top"  v-for="(item,index) in dataArray" :key="index">
			<view class="left-box-top">{{item.start_time ? item.start_time : ''}}</view> <!-- 左边 -->
			
			<view class="line active" :class="{active:item.active,none:index==(dataArray.length-1)}"><!-- 中线 -->
				<view class="dot active" :class="{active:item.active}"></view> <!-- 圆点 -->
			</view>
			
			<view class="right-box-top"> <!-- 右边 -->
				<view class="title">{{item.workorder_type?item.workorder_type:''}}</view>
				<view class="content">{{item.results?item.results:''}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataArray:{
				type:Array
			}
		},
		data() {
			return {
			}
		},
		mounted(){
		},
		methods: {
		}
	}
</script>

<style scoped="scoped" lang="scss">
.box-top{
	width: 100%;
	min-height: 120rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	.left-box-top{
		width: 180rpx;
		text-align: center;
		color: #999;
		font-size: 26rpx;
	}
	.line{
		width: 4rpx;	
		background-color: rgba(228,231,237,1);
		margin: 0 20rpx 0 20rpx;
		.dot{
			width: 20rpx;
			height: 20rpx;
			background-color: rgba(228,231,237,1);
			border-radius: 50%;
			position: relative;
			left: -10rpx;
		}
	}
	.right-box-top{
		flex: 1;
		padding: 0 0 20rpx 0;
		.title{
			font-size:32rpx;
			color:#000;
		}
		.content{
			margin-top:15rpx;
			font-size:28rpx;
			color:#999;
		}
	}
}
//激活元素
.active{
	background-color: rgba(44,143,233,1) !important;
}
// 隐藏元素
.none{
	background-color: rgba(0,0,0,0) !important;
}
</style>
 
