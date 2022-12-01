<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
						<uni-collapse-item title="时间" name="key2" open>
							<view>
								<view class="listwarp">
									<view 
										class="li" 
										:class="index == timeIndex ?'liactive':''" 
										@click="changeTime(index)" 
										v-for="(item,index) in timeList" 
										:key="index">{{item.name}}</view>
								</view>
								<view class="time_warp" v-if="timeList[timeIndex].value == 'zidingyi'">
									<picker @change="changeStartTime" mode="date">
										<view class="timebox">
											{{start_time ? start_time : '开始时间'}}
										</view>
									</picker>
									<view class="xian"></view>
									<picker @change="changeEndTime" mode="date">
										<view class="timebox">
											{{end_time ? end_time : '结束时间'}}
										</view>
									</picker>
								</view>
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
				activeNames:['key2'],
				timeList:[
					{value:'today',name:'今天'},
					{value:'yesterday',name:'昨天'},
					{value:'thisweek',name:'本周'},
					{value:'lastweek',name:'上周'},
					{value:'thismonth',name:'本月'},
					{value:'lastmonth',name:'上月'},
					{value:'thisquarter',name:'本季'},
					{value:'lastquarter',name:'上季'},
					{value:'thisyear',name:'今年'},
					{value:'lastyear',name:'去年'},
					{value:'zidingyi',name:'自定义'}
				],
				timeIndex:4,
				start_time:'',
				end_time:''
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
			changeTime(index) {
				if(this.timeList[this.timeIndex].value != 'zidingyi'){
					this.start_time = ''
					this.end_time = ''
				}
				this.timeIndex = index
				this.init()
			},
			reset() {
				this.timeIndex = 3
			},
			changeStartTime(e) {
				this.start_time = e.detail.value
			},
			changeEndTime(e) {
				this.end_time = e.detail.value
			},
			sure() {
				let times = ''
				let name = ''
				if(this.timeList[this.timeIndex] && (this.timeList[this.timeIndex].value != 'zidingyi')){
					times = this.timeList[this.timeIndex].value
					name = this.timeList[this.timeIndex].name
				}else{
					times = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
					name = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
				}
				let params = {
					times,
					name
				}
				this.$refs['showRight'].close()
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
					display: flex;
					align-items: center;
					justify-content: center;
					width: 172rpx;
					height: 54rpx;
					background: #ededed;
					border: 1rpx solid #ededed;
					border-radius: 10rpx;
					font-size:28rpx;
					color:#999;
					margin-right:40rpx;
					margin-bottom:20rpx;
					&:nth-child(3n){
						margin-right:0;
					}
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
					color:$uni-text-color;
				}
			}
			.time_warp{
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
					background:$uni-text-color;
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
			border: 1px solid $uni-btn-bg-color;
			background:#fff;
			color:$uni-text-color;
		}
	}
</style>
