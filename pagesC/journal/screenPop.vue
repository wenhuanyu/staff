<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
						<uni-collapse-item title="类型" name="1">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == typeIndex ?'liactive':''" 
									@click="changeType(index)" 
									v-for="(item,index) in typeList" 
									:key="index">{{item}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="员工" name="2">
								<view class="listwarp">
									<view class="li" :class="staffObj ?'liactive':''" @click="toSelectStaff" >
										{{staffObj ? staffObj.name : '选择员工'}}
										<view class="clearStaff" v-if="staffObj" @click.stop="clearStaff">×</view>
									</view>
								</view>
						</uni-collapse-item>
						<uni-collapse-item title="时间" name="3">
							<view class="time_warp">
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
	import { netSelect } from '@/api/api.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	
	export default {
		mixins:[commonFun],
		props: {
			showScreen: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				activeNames:[],
				typeList:['日','周','月','季','年'],
				typeIndex:null,
				
				//新增客户时间
				start_time:'',
				end_time:'',
			}
		},
		created() {
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		methods: {
			open() {
				this.$refs.showRight.open()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			changeType(index) {
				this.typeIndex = index
			},
			changeStartTime(e) {
				this.start_time = e.detail.value
			},
			changeEndTime(e) {
				this.end_time = e.detail.value
			},
			reset() {
				this.start_time = ''
				this.end_time = ''
				this.typeIndex = null
				this.$store.commit('STAFFOBJ',null)
			},
			sure() {
				let params = {
					type: this.typeList[this.typeIndex] ? this.typeList[this.typeIndex] : '',
					times: this.start_time && this.end_time ? this.start_time+','+this.end_time : '',
					staff_id: this.staffObj ? this.staffObj.id : ''
				}
				this.$refs.showRight.close()
				this.$emit('sureQuery',params)
			},
			onChange(e) {
				this.init()
				this.activeNames = e
			},
			clearStaff() {
				this.$store.commit('STAFFOBJ',null)
			}
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
				padding:25rpx 0;
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
			.time_warp{
				width:600rpx;
				margin:0 auto;
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
					color:$uni-text-color;
					border:1rpx solid $uni-text-color;
				}
				.xian{
					width:85rpx;
					height:7rpx;
					background:#999999;
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
			border: 1px solid $uni-text-color;
			background:#fff;
			color:$uni-text-color;
		}
	}
</style>
