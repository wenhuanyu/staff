<template>
	<view class="">
		<view class="boxwarp">
			<view class="apptitle">审批流程</view>
			<view class="approbox">
				<view class="appli" v-for="(item,index) in list" :key="index">
					<view class="xian"></view>
					<view class="title" v-if="item.status == 1">指定员工(任意一人)</view>
					<view class="title" v-if="item.status == 2">指定员工(会签)</view>
					<view class="title" v-if="item.status == 3">直属上级</view>
					<view class="stafflist">
						<view class="staffli" v-for="(staffitem,staffindex) in item.stafflist" :key="staffindex">
							<image :src="staffitem.img" class="staffimg" mode=""></image>
							<view class="staffname">{{staffitem.name}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
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
	.boxwarp{
		background:#fff;
		width:100%;
		padding-bottom:50rpx;
		.apptitle{
			padding:24rpx;
			font-size: 32rpx;
			color: #999;
		}
		.approbox{
			padding:0 24rpx;
			.appli{
				padding-left:24rpx;
				position: relative;
				&::after{
					content:'';
					width:14rpx;
					height:14rpx;
					border-radius: 50%;
					background:#5cbdb2;
					position: absolute;
					left:0;
					top:10rpx;
				}
				&:last-child{
					.xian{
						display: none;
					}
				}
				.xian{
					width:2rpx;
					height:calc(100% - 8rpx);
					background:#5cbdb2;
					position: absolute;
					top:20rpx;
					left:5rpx;
				}
				.title{
					font-size:28rpx;
					color:#666;
				}
				.stafflist{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;
					margin-top:24rpx;
					.staffli{
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-right:24rpx;
						margin-bottom:24rpx;
						.staffimg{
							width:60rpx;
							height:60rpx;
							border-radius: 50%;
							margin-bottom:10rpx;
						}
						.staffname{
							font-size:26rpx;
							color:#999;
						}
					}
				}
			}
		}
	}
</style>