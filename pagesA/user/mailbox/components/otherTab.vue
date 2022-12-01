<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="popbox">
				<view class="title">其他功能</view>
				<scroll-view scroll-y class="scrollbox">
					<view class="scr_warp">
						<uni-collapse v-model="activeNames" @change="onChange" ref="collapse">
							<uni-collapse-item title="其他功能" name="1">
								<view class="listwarp">
									<view class="list_item" @click="toEmailList(1)">
										<image :src="BASE_IMG_URL+'/index/user_3.png'" class="sendimg" ></image>
										已发送
									</view>
									<view class="list_item" @click="toEmailList(2)">
										<image :src="BASE_IMG_URL+'/index/user_3.png'" class="sendimg" ></image>
										收件箱
									</view>
								</view>
							</uni-collapse-item>
						</uni-collapse>
					</view>
				</scroll-view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default {
		props: {
			showScreen: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				drWidth: uni.upx2px(660),
				BASE_IMG_URL:BASE_IMG_URL,
				activeNames:['1']
			}
		},
		created() {
		},
		methods: {
			open() {
				this.$refs['showRight'].open()
				this.init()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			toEmailList(action) {
				//action  1已发送   2收件箱
				uni.navigateTo({
					url:'/pagesA/user/mailbox/index?action='+action,
					success:()=>{
						this.$refs['showRight'].close()
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		font-size:30rpx;
		color:#333333;
		padding:25rpx 34rpx;
	}
	.popbox{
		width:660rpx;
		height:100vh;
		background:#fff;
	}
	.scrollbox{
		width:660rpx;
		height:calc(100vh - 210rpx);
		background:#fff;
		.scr_warp{
			.listwarp{
				padding:0 30rpx;
				.list_item{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:26rpx;
					color:$uni-text-color;
					border-bottom:1rpx solid #f5f5f5;
					padding:24rpx 0;
					.sendimg{
						width:44rpx;
						height:35rpx;
						margin-right:30rpx;
					}
				}
			}
		}
	}
	
</style>
