<template>
	<view>
		<uni-popup ref="showRight" type="bottom" background-color="#fff">
			<view class="boxwarp">
				<view class="tabwarp">
					<view class="tabli" :class="{'tabli_active':readindex == 1}" @click="changeRead(1)">
						<view>已读{{readNum}}</view>
						<view class="tab_bot"></view>
					</view>
					<view class="tabli" :class="{'tabli_active':readindex == 2}" @click="changeRead(2)">
						<view>未读{{noReadNum}}</view>
						<view class="tab_bot"></view>
					</view>
				</view>
				<scroll-view scroll-y class="scrollbox" v-if="readindex == 1">
					<view class="list_warp">
						<view class="list_item" v-for="(item,index) in readList" :key="index">
							<image :src="item.staff.img" class="headerimg" mode=""></image>
							<view class="staffname">{{item.staff.name}}</view>
						</view>
						<u-loadmore v-if="readList.length == 0" status="nomore"></u-loadmore>
					</view>
				</scroll-view>
				<scroll-view scroll-y class="scrollbox" v-if="readindex == 2">
					<view class="list_warp">
						<view class="list_item" v-for="(item,index) in noReadlist" :key="index">
							<image :src="item.img" class="headerimg" mode=""></image>
							<view class="staffname">{{item.name}}</view>
						</view>
						<u-loadmore v-if="noReadlist.length == 0" status="nomore"></u-loadmore>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	
	export default {
		props:{
			readList:{
				type:Array,
				default:[]
			},
			noReadlist:{
				type:Array,
				default:[]
			},
			readNum:{
				type:Number,
				default:0
			},
			noReadNum:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				showRead:false,
				readindex:1
			}
		},
		methods: {
			open() {
				this.$refs.showRight.open()
			},
			closeRead() {
				this.$refs.showRight.close()
			},
			changeRead(type) {
				this.readindex = type
			},
		}
	}
</script>

<style lang="scss" scoped>
	.boxwarp{
		width:750rpx;
		.tabwarp{
			width:100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding:30rpx 0;
			.tabli{
				font-size:26rpx;
				color:#333;
				text-align: center;
				.tab_bot{
					margin-top:10rpx;
					width:80rpx;
					height:8rpx;
					background:#fff;
					border-radius: 4rpx;
					transition: all .3 ease;
				}
			}
			.tabli_active{
				.tab_bot{
					background:$uni-text-color;
				}
			}
		}
	}
.scrollbox{
	width:750rpx;
	height:900rpx;
	.list_warp{
		width:100%;
		height:100%;
		.list_item{
			width:630rpx;
			margin:24rpx auto 0;
			border-radius: 10rpx;
			padding:30rpx;
			background:#fff;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-top:24rpx;
			.headerimg{
				width:60rpx;
				height:60rpx;
				border-radius: 50%;
				margin-right:24rpx;
				.staffname{
					font-size:24rpx;
					color:#000;
				}
			}
		}
	}
}

</style>
