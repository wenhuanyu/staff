<template>
	<view class="warp">
		<uni-collapse v-model="activeNames"  @change="changeActive" ref="collapse">
			<uni-collapse-item :title="item.in_date" :name="index" v-for="(item,index) in abnormalList" :key="index">
				<view class="box">
					<view class="content">
						<view class="contit">列入日期：</view>
						<view class="conbox">{{item.in_date}}</view>
					</view>
					<view class="content">
						<view class="contit">经营异常列入原因：</view>
						<view class="conbox">{{item.in_reason}}</view>
					</view>
					<view class="content">
						<view class="contit">移出原因：</view>
						<view class="conbox">{{item.out_reason}}</view>
					</view>
					<view class="content">
						<view class="contit">移出时间：</view>
						<view class="conbox">{{item.out_date}}</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				abnormalList: [],
				activeNames: [],
			}
		},
		onShow() {
			this.abnormalList = uni.getStorageSync('businessInfo').risk.abnormal
		},
		methods: {
			changeActive(e) {
				this.activeNames = e
				this.init()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.warp{
		.box{
			padding:24rpx 30rpx;
			.content{
				display: flex;
				justify-content: flex-start;
				margin-bottom:15rpx;
				.contit{
					font-size:30rpx;
					color:#000;
					flex-shrink: 0;
				}
				.conbox{
					font-size:28rpx;
					color:#666;
					line-height: 34rpx;
				}
			}
		}
	}
</style>
