<template>
	<view class="warp">
		<uni-collapse v-model="activeNames" @change="changeActive" ref="collapse">
			<uni-collapse-item :title="item.change_date" :name="index" v-for="(item,index) in changeinfo" :key="index">
				<view class="box">
					<view class="content">
						<view class="contit">变更范围：</view>
						<view class="conbox">{{item.change_item}}</view>
					</view>
					<view class="content">
						<view class="contit">变更前：</view>
						<view class="conbox">{{item.before_content}}</view>
					</view>
					<view class="content">
						<view class="contit">变更后：</view>
						<view class="conbox">{{item.after_content}}</view>
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
				changeinfo: [],
				activeNames: [],
			}
		},
		onShow() {
			this.changeinfo = uni.getStorageSync('businessInfo').enterprise.changerecords
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
