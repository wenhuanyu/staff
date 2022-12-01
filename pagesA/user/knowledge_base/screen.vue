<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
						<uni-collapse-item title="主分类" v-if="type == 1" name="a">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == parentIndex ?'liactive':''" 
									@click="changeParent(index)" 
									v-for="(item,index) in parentList" 
									:key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="子分类" name="b">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == typeIndex ?'liactive':''" 
									@click="changeType(index)" 
									v-for="(item,index) in typeList" 
									:key="index">{{item.name}}</view>
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
	import { netKnowledgeList } from '@/api/api.js'
	
	export default {
		props:{
			type:{
				type:Number/String,
				default:1
			}
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				activeNames:[],
				parentList:[],
				parentIndex:null,
				typeList:[],
				typeIndex:null
			}
		},
		created() {
		},
		methods: {
			open() {
				this.$refs.showRight.open()
				this.getParentList()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			getParentList() {
				netKnowledgeList({pid:this.pid}).then(res=>{
					this.parentList = res.data
					this.getChild()
				})
			},
			getChild() {
				if(this.parentList[this.parentIndex]){
					netKnowledgeList({pid:this.parentList[this.parentIndex].id}).then(res=>{
						this.typeList = res.data
					})
				}
			},
			changeParent(index) {
				this.parentIndex = index
				this.getChild()
			},
			changeType(index) {
				this.typeIndex = index
			},
			reset() {
				this.parentIndex = null
				this.typeIndex = null
			},
			sure() {
				let params = {
						type_ids: this.typeList[this.typeIndex] ? this.typeList[this.typeIndex].id : '',
					}
				this.$refs.showRight.close()
				this.$emit('sureQuery',params)
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.title{
		font-size:28rpx;
		color:#999;
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
				padding:25rpx 0;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.li{
					display: flex;
					align-items: center;
					justify-content: center;
					min-width:172rpx;
					max-width:500rpx;
					min-height: 54rpx;
					padding:0 5rpx;
					background: #ededed;
					border: 1rpx solid #ededed;
					border-radius: 10rpx;
					font-size:28rpx;
					color:#999;
					margin-right:20rpx;
					margin-bottom:20rpx;
					position: relative;
					&:nth-child(3n){
						margin-right:0;
					}
					.clearStaff{
						position: absolute;
						right:-20rpx;
						top:-20rpx;
						font-size:28rpx;
						width:40rpx;
						height:40rpx;
						background:rgba(0,0,0,0.5);
						border-radius: 50%;
						text-align: center;
						line-height: 38rpx;
						color:#fff;
					}
				}
				.liactive{
					color:#666;
					background:#fff;
					border: 1px solid $uni-text-color;
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
				width:600rpx;
				margin:0 auto;
				padding:24rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				.timebox{
					
					width: 172rpx;
					height: 54rpx;
					border-radius: 10rpx;
					text-align: center;
					line-height: 50rpx;
					font-size:27rpx;
					color:#666;
					border:1rpx solid $uni-text-color;
				}
				.xian{
					width:85rpx;
					height:7rpx;
					background:#ededed;
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
		justify-content: space-evenly;
		align-items: center;
		height:120rpx;
		padding-bottom:30rpx;
		.screenbtn{
			width: 229rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1px solid #999999;
			border-radius: 10rpx;
			text-align: center;
			line-height: 60rpx;
			font-size:26rpx;
			color:#999;
		}
		.surebtn{
			border: 1px solid $uni-text-color;
			background:#fff;
			color:$uni-text-color;
		}
	}
</style>
