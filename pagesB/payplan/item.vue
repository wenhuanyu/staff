<template>
	<view class="">
		<view class="pay_li" v-for="(item,index) in list" :key="index">
			<view class="recostatus" v-if="item.status == 0"><span>未回款</span></view>
			<view class="recostatus" v-if="item.status == 1"><span>已回款</span></view>
			<view class="pay_num">回款期数：{{item.num}}</view>
			<view class="infobox">
				<view class="infoleft">
					<view class="litext">关联合同：{{item.contract.name}}</view>
					<view class="litext">计划回款方式：{{item.return_type}}</view>
					<view class="litext">计划回款金额：{{item.money}}</view>
					<view class="litext">计划回款日期：{{item.return_date}}</view>
				</view>
				<view class="staffinfo">
					<image :src="item.create_staff.img" class="staffimg"></image>
					<view class="staffname">{{item.create_staff.name}}</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			}
		},
		data() {
			return{
				
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.pay_li{
		width:750rpx;
		background:#fff;
		padding:30rpx;
		margin:0 auto 24rpx;
		position: relative;
		.recostatus{
			background:$uni-bg-opacity;
			border-radius: 5rpx;
			font-size: 26rpx;
			color: $uni-text-color;
			padding: 5rpx 12rpx;
			position: absolute;
			right:24rpx;
			top:24rpx;
		}
		.pay_num{
			padding-bottom:14rpx;
			border-bottom:1rpx solid #f5f5f5;
			font-size:28rpx;
			color:#000;
			margin-bottom:14rpx;
		}
		.infobox{
			display: flex;
			justify-content: space-between;
			align-items: cneter;
			.infoleft{
				.litext{
					font-size:24rpx;
					color:#666;
					margin-bottom:10rpx;
				}
			}
			.staffinfo{
				display: flex;
				flex-direction: column;
				align-items: center;
				.staffimg{
					width:80rpx;
					height:80rpx;
					border-radius: 50%;
				}
				.staffname{
					font-size:24rpx;
					color:#666;
					margin-top:10rpx;
				}
			}
		}
		
	}
</style>