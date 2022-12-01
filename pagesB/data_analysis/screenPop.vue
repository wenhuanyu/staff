<template>
	<uni-drawer ref="showRight" mode="right" :width="drWidth">
		<view class="title">筛选</view>
		<scroll-view scroll-y class="scrollbox">
			<view class="scr_warp">
				<uni-collapse v-model="activeNames" @change="onChange" ref="collapse">
					<uni-collapse-item title="时间" name="1" v-if="type != 4">
						<view class="listwarp">
							<view class="li" :class="item.value == timeIndex ?'liactive':''"
								@click="changeTime(item.value)" v-for="(item,index) in timeList" :key="index">
								{{item.name}}</view>
						</view>
						<view class="time_warp" v-if="timeList[timeIndex] && timeList[timeIndex].value == 'zidingyi'">
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
					<uni-collapse-item title="时间" name="2" v-if="type == 4">
						<view class="time_warp">
							<picker @change="changeYear" mode="date" fields="year">
								<view class="timebox">
									{{year ? year : '开始时间'}}
								</view>
							</picker>
						</view>
					</uni-collapse-item>
					<uni-collapse-item title="部门" name="2">
						<view class="listwarp">
							<view class="li" :class="item.id == departId ?'liactive':''" @click="changeDepart(item.id)"
								v-for="(item,index) in departList" :key="index">{{item.name}}</view>
						</view>
					</uni-collapse-item>
					<uni-collapse-item title="所属员工" name="3" v-if="type != 2">
						<view class="listwarp">
							<view class="li" :class="staffObj ?'liactive':''" @click.stop="toSelectStaff">
								{{staffObj ? staffObj.name : '选择员工'}}
								<view class="clearStaff" v-if="staffObj" @click.stop="clearStaff">×</view>
							</view>
						</view>
					</uni-collapse-item>
					<uni-collapse-item title="类型" name="4" v-if="type == 3">
						<view class="listwarp">
							<view class="li" :class="item == typeValue ?'liactive':''" @click="changeType(item)"
								v-for="(item,index) in typeList" :key="index">{{item}}</view>
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
</template>

<script>
	import {
		commonFun
	} from '@/common/navigate.js'
	import {
		mapState
	} from 'vuex'
	import {
		netDepartment
	} from '@/api/user.js'

	export default {
		mixins: [commonFun],
		props: {
			type: {
				type: Number / String,
				default: 1
			}
		},
		data() {
			return {
				drWidth: uni.upx2px(660),
				activeNames: [],
				timeList: [{
						value: 'today',
						name: '今天'
					},
					{
						value: 'yesterday',
						name: '昨天'
					},
					{
						value: 'tomorrow',
						name: '明天'
					},
					{
						value: 'thisweek',
						name: '本周'
					},
					{
						value: 'lastweek',
						name: '上周'
					},
					{
						value: 'nextweek',
						name: '下周'
					},
					{
						value: 'thismonth',
						name: '本月'
					},
					{
						value: 'lastmonth',
						name: '上月'
					},
					{
						value: 'nextmonth',
						name: '下月'
					},
					{
						value: 'thisquarter',
						name: '本季'
					},
					{
						value: 'lastquarter',
						name: '上季'
					},
					{
						value: 'nextquarter',
						name: '下季'
					},
					{
						value: 'thisyear',
						name: '今年'
					},
					{
						value: 'lastyear',
						name: '去年'
					},
					{
						value: 'nextyear',
						name: '下一年'
					},
					{
						value: 'zidingyi',
						name: '自定义'
					}
				],
				timeIndex: 'thisweek',
				departList: [],
				departId: null,
				typeList: ['产品发货', '产品安装', '上门维修', '定期检修', '产品设计', '生产设备'],
				typeValue: '',
				year: ''
			}
		},
		computed: mapState({
			staffObj: state => state.customer.staffObj
		}),
		created() {
		},
		methods: {
			open() {
				this.$refs.showRight.open()
				this.init()
				this.getDepart()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			getDepart() {
				netDepartment().then(res => {
					this.departList = res.data
				})
			},
			changeTime(value) {
				this.init()
				this.timeIndex = value
			},
			changeDepart(id) {
				console.log(id)
				this.departId = id
			},
			changeStartTime(e) {
				this.start_time = e.detail.value
			},
			changeEndTime(e) {
				this.end_time = e.detail.value
			},
			changeType(value) {
				this.typeValue = value
			},
			changeYear(e) {
				this.year = e.detail.value
			},
			reset() {
				this.departId = ''
				this.timeIndex = 'thisweek'
				this.$store.commit('STAFFOBJ', null)
			},
			sure() {
				let times = ''
				if (this.timeIndex && this.timeIndex != 'zidingyi') {
					times = this.timeIndex
				} else {
					times = (this.start_time && this.end_time) ? this.start_time + ',' + this.end_time : ''
				}
				if (!times) {
					uni.showToast({
						title: '请选择时间',
						icon: 'none'
					})
					return
				}
				let params = {
					times: this.type == 4 ? this.year : times,
					department_id: this.departId,
					staff_id: this.type == 1 && this.staffObj ? this.staffObj.id : '',
					workorder_type: this.type == 3 && this.typeValue ? this.typeValue : ''
				}
				this.close()
				this.$emit('sureQuery', params)
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			close() {
				this.$refs.showRight.close()
			},
			clearStaff() {
				this.$store.commit('STAFFOBJ', null)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		font-size: 30rpx;
		color: #333333;
		padding: 25rpx 34rpx;
	}

	.scrollbox {
		width: 660rpx;
		height: calc(100vh - 210rpx);
		background: #fff;

		.scr_warp {
			width: 660rpx;
			background: #fff;

			.listwarp {
				width: 600rpx;
				margin: 0 auto;
				padding: 24rpx 0;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;

				.li {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 172rpx;
					height: 54rpx;
					background: #ededed;
					border: 1rpx solid #ededed;
					border-radius: 10rpx;
					font-size: 28rpx;
					color: #999;
					margin-right: 40rpx;
					margin-bottom: 20rpx;
					position: relative;

					&:nth-child(3n) {
						margin-right: 0;
					}

					.clearStaff {
						position: absolute;
						right: -20rpx;
						top: -20rpx;
						font-size: 28rpx;
						width: 40rpx;
						height: 40rpx;
						background: rgba(0, 0, 0, 0.5);
						border-radius: 50%;
						text-align: center;
						line-height: 38rpx;
						color: #fff;
					}
				}

				.liactive {
					color: #666;
					background: #fff;
					border: 1px solid $uni-text-color;
				}
			}

			.address_warp {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx;
				border-top: 1rpx solid #999999;
				border-bottom: 1rpx solid #999999;

				.address_li {
					color: $uni-text-color;
				}
			}

			.time_warp {
				width: 600rpx;
				margin: 0 auto;
				padding: 24rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;

				.timebox {
					width: 216rpx;
					height: 60rpx;
					border-radius: 10rpx;
					text-align: center;
					line-height: 58rpx;
					font-size: 30rpx;
					color: $uni-text-color;
					border: 1rpx solid $uni-text-color;
				}

				.xian {
					width: 85rpx;
					height: 7rpx;
					background: #999999;
					margin: 0 20rpx;
				}

				.timeactive {
					background: $uni-text-color;
					color: #fff;
				}
			}
		}
	}

	.screenbot {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		height: 120rpx;
		padding-bottom: 30rpx;

		.screenbtn {
			width: 229rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1px solid #999999;
			border-radius: 10rpx;
			text-align: center;
			line-height: 60rpx;
			font-size: 26rpx;
			color: #999;
		}

		.surebtn {
			border: 1px solid $uni-text-color;
			background: #fff;
			color: $uni-text-color;
		}
	}
</style>
