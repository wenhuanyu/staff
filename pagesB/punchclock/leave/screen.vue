<template>
	<uni-popup ref="popup" type="top" background-color="#fff">
		<scroll-view scroll-y class="scrollbox" style="height:600rpx;background:#fff;" >
			<!--筛选模块  -->
			<view class="screen_content"  @tap.stop.prevent>
				<view class="fir_li">
					<view class="li_label">请假类型</view>
					<picker @change="changeType" :value="arrIndex" :range="arr">
						<view class="li_box" >
							<view class="form_right" style="text-align: center;">
								<view :class="arr[arrIndex] ? 'valueActive' : ''">
									{{arr[arrIndex] ? arr[arrIndex] : '点击选择'}}
								</view>
								<view class="iconfont icon-arrows_right"></view>
							</view>
						</view>
					</picker>
				</view>
				<view class="fir_li">
					<view class="li_label">时间筛选</view>
					<view class="li_box" style="display: flex;">
						<picker @change="changeStartTime" mode="date"  :end="end_time"
							style="width:50%;border-right:1rpx solid #CCCCCC">
							<view class="form_right">
								<view style="flex:1;text-align: center;"
									:class="start_time ? 'valueactive' : '' ">
									{{start_time ? start_time : '开始时间'}}</view>
							</view>
						</picker>
						<picker @change="changeEndTime" mode="date" :start="start_time" style="width:50%">
							<view class="form_right">
								<view style="flex:1;text-align: center;"
									:class="end_time ? 'valueactive' : '' ">{{end_time ? end_time : '结束时间'}}
								</view>
							</view>
						</picker>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="button_bottom">
			<view @tap.stop="reset">重置</view>
			<view @tap.stop="sureQuery">确定</view>
		</view>
	</uni-popup>
</template>

<script>
	export default{
		data() {
			return{
				arr:['年假', '事假', '病假', '调休假', '婚假', '产假', '陪产假', '其他'],
				arrIndex:null,
				times:'',
				start_time:'',
				end_time:''
			}
		},
		methods:{
			init() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			changeType(e) {
				this.arrIndex = e.detail.value
			},
			changeStartTime(e) {
				this.start_time = e.detail.value
				if(!this.end_time){
					this.end_time = e.detail.value
				}
			},
			changeEndTime(e) {
				this.end_time = e.detail.value
				if(!this.start_time){
					this.start_time = e.detail.value
				}
			},
			reset() {
				this.arrIndex = null
				this.start_time = ''
				this.end_time = ''
			},
			sureQuery() {
				let params = {
					times:(this.start_time && this.end_time) ? (this.start_time + ',' + this.end_time) : '',
					type:this.arr[this.arrIndex]?this.arr[this.arrIndex]:'',
				}
				this.close()
				this.$emit('sureParams',params)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.screen_content {
		width:702rpx;
		z-index: 2;
		border-top:1rpx solid #CCCCCC;
		background-color: #fff;
		padding:24rpx;
		.fir_li{
			margin-bottom:20rpx;
			.li_label{
				font-size:28rpx;
				color:#333333;
				margin-bottom:15rpx;
			}
			.li_box{
				border-radius: 15rpx;
				border:1rpx solid #CCCCCC;
				height:60rpx;
				padding:0 35rpx;
				line-height: 60rpx;
			}
			.form_right {
				display: flex;
				justify-content: space-between;
				color:#999;
				image {
					width: 40rpx;
					height: 40rpx;
					margin: 28rpx 5rpx 0 0;
				}
				.rightinput{
					height:60rpx;
					line-height: 60rpx;
					width:100%;
				}
			}
		}
	}
	.button_bottom {
		display: flex;
		width: 100%;
		height: 90rpx;
		background-color: #fff;
		line-height: 90rpx;
		text-align: center;
		font-size: 32rpx;
		:first-child {
			flex: 1;
			color: $uni-text-color;
			border-top:1rpx solid #CCCCCC;
		}
		:last-child {
			flex: 1;
			background-color: $uni-text-color;
			color: #fff;
		}
	}
</style>