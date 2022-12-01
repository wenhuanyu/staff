<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
						<uni-collapse-item title="任务类型" name="1">
							<view class="listwarp">
								<view 
									class="li" 
									:class="item.field == typeName ?'liactive':''" 
									@click="changeFollow(item)" 
									v-for="(item,index) in visitType" 
									:key="index"
								>{{item.field}}</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</scroll-view>
			<view class="screenbot">
				<view class="screenbtn" @click="reset">重置</view>
				<view class="screenbtn surebtn" @click="sure">确认</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import { netTemplateList } from '@/api/template.js'
	
	export default {
		props: {
			showScreen: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				activeNames:['1'],
				visitType:[],
				typeName:''
			}
		},
		created() {
			//类型
			this.getType()
		},
		methods: {
			open() {
				this.$refs.showRight.open()
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
			getType() {
				netTemplateList({type:'任务内容'}).then(res=>{
					this.visitType = res.data.template
				})
			},
			changeFollow(item) {
				this.typeName = item.field
				this.init()
			},
			reset() {
				this.typeName = ''
				this.sure()
			},
			sure() {
				let params = {
					event_type:this.typeName
				}
				this.$refs.showRight.close()
				this.$emit('sureQuery',params)
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
	.scrollbox{
		width:660rpx;
		height:calc(100vh - 210rpx);
		background:#fff;
		.scr_warp{
			width:660rpx;
			background:#fff;
			.listwarp{
				width:600rpx;
				margin:0 auto;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.li{
					// width:190rpx;
					padding:0 15rpx;
					height:60rpx;
					border-radius: 10rpx;
					font-size:30rpx;
					color:#999;
					background: #ededed;
					border: 1rpx solid #ededed;
					text-align: center;
					line-height: 58rpx;
					margin-right:20rpx;
					margin-bottom:20rpx;
				}
				.liactive{
					color:#666;
					background:#fff;
					border: 1px solid $uni-btn-bg-color;
				}
			}
			.address_warp{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:24rpx;
				border-top:1rpx solid #999999;
				border-bottom:1rpx solid #999999;
				.address_li{
					color:#0287FF;
				}
			}
			.time_warp{
				display: flex;
				justify-content: center;
				align-items: center;
				.timebox{
					width:216rpx;
					height:60rpx;
					border-radius: 30rpx;
					text-align: center;
					line-height: 58rpx;
					font-size:30rpx;
					color:#0287FF;
					border:1rpx solid #0287FF;
					.content{
						text-align: center;
					}
				}
				.xian{
					width:85rpx;
					height:7rpx;
					background:#999999;
					margin:0 20rpx;
				}
				.timeactive{
					background:#0287FF;
					color:#fff;
				}
			}
		}
	}
	.screenbot{
		display: flex;
		justify-content: space-around;
		align-items: center;
		height:120rpx;
		padding-bottom:30rpx;
		.screenbtn{
			width:229rpx;
			height:60rpx;
			border-radius: 10rpx;
			text-align: center;
			line-height: 58rpx;
			font-size:26rpx;
			color:#999;
			border:1rpx solid #999;
		}
		.surebtn{
			background:#fff;
			color:$uni-text-color;
			border:1rpx solid $uni-btn-bg-color;
		}
	}
</style>
