<template>
	<view>
		<view class="scr_warp">
			<view class="scr_box" @click="toScreen">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="scr_img"></image>
			</view>
		</view>
		<!-- 客户数分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">客户数分析</view>
			<scroll-view scroll-x class="firbox">
				<view>
					<view class="charts-box">
						<qiun-data-charts type="line" canvasId="asdb" :canvas2d="true" :ontouch="true"
							:chartData="chartDataOne" :opts="oneChart" background="none" />
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 老客跟进分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">老客跟进分析</view>
			<scroll-view scroll-x class="firbox">
				<view>
					<view class="charts-box">
						<qiun-data-charts 
							type="line" 
							canvasId="asdq" 
							:canvas2d="true" 
							:ontouch="true" 
							:opts="twoChart"
							:chartData="chartDataTwo" 
							background="none" 
						/>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 客户转化率分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">客户转化率分析</view>
			<scroll-view scroll-x class="firbox">
				<view>
					<view class="charts-box" style="width:100%;">
						<qiun-data-charts type="ring" canvasId="asdw" :canvas2d="true" :chartData="chartDataThr"
							:opts="thrChart" background="none" />
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 客户售后满意度分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">客户售后满意度分析</view>
			<scroll-view scroll-x class="firbox">
				<view>
					<view class="charts-box" style="width:100%;">
						<qiun-data-charts type="ring" canvasId="asde" :canvas2d="true" :chartData="chartDataFor"
							:opts="forChart" background="none" />
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 客户成交周期分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">客户成交周期分析</view>
			<scroll-view scroll-x class="firbox">
				<view>
					<view class="charts-box">
						<qiun-data-charts type="line" canvasId="asdr" :canvas2d="true" :ontouch="true"
							:chartData="chartDataFive" :opts="fiveChart" background="none" />
					</view>
				</view>
			</scroll-view>
		</view>

		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import {
		BASE_IMG_URL
	} from '@/api/http.js'
	import screenPop from './screenPop.vue'
	import {
		netCustomerNumberAnalysis,
		netLKfollowAnalysis,
		netCZAnalysis,
		netSHMYDAnalysis,
		netCJZQAnalysis
	} from '@/api/api.js'

	export default {
		components: {
			screenPop
		},
		props: {
			showCharts: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				BASE_IMG_URL: BASE_IMG_URL,
				queryObj: {
					times: 'thisweek'
				},
				chartDataOne: {},
				oneChart: {
					color: ['#32D2C9', '#F8A20F'],
					enableScroll: true,
					xAxis: {
						type: 'grid',
						gridType: 'dash',
						itemCount: 3, //x轴单屏显示数据的数量，默认为5个
						scrollShow: true, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#DEE7F7', //默认为 #A6A6A6
					}
				},
				chartDataTwo: {},
				twoChart: {
					extra: {
						line: {
							type: 'curve'
						}
					},
					color: ['#B81BCF', '#1B67CF'],
					enableScroll: true,
					xAxis: {
						type: 'grid',
						gridType: 'dash',
						itemCount: 3, //x轴单屏显示数据的数量，默认为5个
						scrollShow: true, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#DEE7F7', //默认为 #A6A6A6
					}
				},
				chartDataThr: {},
				thrChart: {},
				chartDataFor: {},
				forChart: {},
				chartDataFive: {},
				fiveChart: {
					color: ['#FEAB67', '#AB90DF'],
					enableScroll: true,
					xAxis: {
						type: 'grid',
						gridType: 'dash',
						itemCount: 3, //x轴单屏显示数据的数量，默认为5个
						scrollShow: true, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#DEE7F7', //默认为 #A6A6A6
					}
				}
			}
		},
		onLoad() {

		},
		methods: {
			//筛选
			toScreen() {
				this.$refs.screenChild.open()
			},
			sureQuery(params) {
				this.queryObj = params
				this.init()
			},
			init() {
				//客户数分析
				this.getCNumber()
				//老客户 跟进分析
				this.getLKfollow()
				//客户转化率 分析
				this.getCZ()
				//客户 售后满意度  分析
				this.getSHmyd()
				//客户 成交 周期  分析
				this.getCJzq()
			},
			getCNumber() {
				netCustomerNumberAnalysis(this.queryObj).then(res => {
					res = res.data
					if (res.date) {
						let obj = {
							categories: res.date,
							series: [{
								name: "新增客户数量",
								data: res.add_count
							}, {
								name: "成交客户数量",
								data: res.trade_count
							}]
						}
						this.chartDataOne = obj
					}
				})
			},
			getLKfollow() {
				netLKfollowAnalysis(this.queryObj).then(res => {
					res = res.data
					let obj = {
						categories: res.date,
						series: [{
							name: "老客跟进次数",
							data: res.trade_count
						}, {
							name: "员工跟进客户数",
							data: res.count
						}]
					}
					this.chartDataTwo = obj
				})
			},
			getCZ() {
				netCZAnalysis(this.queryObj).then(res => {
					res = res.data
					this.thrChart = {
						color: ['#1B69D0', '#F58F5D'],
						dataLabel: false,
						title: {
							name: '转化率',
							fontSize: 12,
							color: '#0287FF'
						},
						subtitle: {
							name: res.rate + '%',
							fontSize: 16,
							color: '#0287FF'
						},
						extra: {
							ring: {
								ringWidth: 15
							}
						}
					}
					let obj = {
						series: [{
							data: [{
									value: res.addCount,
									name: '新增客户数'
								},
								{
									value: res.tradeCount,
									name: '转化客户数'
								}
							]
						}, ]
					}
					this.chartDataThr = obj
				})
			},
			getSHmyd() {
				netSHMYDAnalysis(this.queryObj).then(res => {
					res = res.data
					this.forChart = {
						color: ['#C5E997', '#46A6F9'],
						dataLabel: false,
						title: {
							name: '转化率',
							fontSize: 12,
							color: '#0287FF'
						},
						subtitle: {
							name: res.rate + '%',
							fontSize: 16,
							color: '#0287FF'
						},
						extra: {
							ring: {
								ringWidth: 15
							}
						}
					}
					this.chartDataFor = {
						series: [{
							data: [{
									value: res.satisfiedCount,
									name: '满意单数量'
								},
								{
									value: res.addCount,
									name: '客户售后总单'
								}
							]
						}, ]
					}
				})
			},
			getCJzq() {
				netCJZQAnalysis(this.queryObj).then(res => {
					res = res.data
					this.chartDataFive = {
						categories: res.date,
						series: [{
							name: "客户成交量",
							data: res.count
						}, {
							name: "客户成交周期",
							data: res.number
						}]
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scr_warp {
		display: flex;
		justify-content: flex-end;
		padding: 24rpx;

		.scr_box {
			padding: 10rpx 30rpx;
			background: #fff;
			border-radius: 5rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0, 0, 0, 0.1);

			.scr_img {
				width: 35rpx;
				height: 27rpx;
			}
		}
	}

	.fir_data_box {
		width: 690rpx;
		margin: 0 auto 30rpx;
		background: #fff;

		.data_box_title {
			width: 100%;
			height: 80rpx;
			background: $uni-bg-opacity;
			font-size: 30rpx;
			color: $uni-text-color;
			text-align: center;
			line-height: 80rpx;
		}

		.firbox {
			margin-top: 24rpx;
			width: 100%;
			height: 380rpx;

			.charts-box {
				width: 100%;
				height: 380rpx;
			}
		}
	}
</style>
