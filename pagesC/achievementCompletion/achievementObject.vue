<template>
	<view class="achievement_object">
		<view class="querylist">
			<view class="queryfir">
				<picker :range="typeList" :value="typeIndex" @change="changeDataType">
					<view class="form_right">
						<view>{{typeList[typeIndex] ? typeList[typeIndex] : '点击选择'}}</view>
						<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg" mode="scaleToFill"></image>
					</view>
				</picker>
			</view>
			<view class="querysec">
				<picker mode="date" fields="year" @change="changeYeay">
					<view class="form_right">
						<view>{{dataYear ? dataYear+'年' : '点击选择'}}</view>
						<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg" mode="scaleToFill"></image>
					</view>
				</picker>
			</view>
		</view>

		<view class="achievement_head">
			<view class="charts-box">
			  <qiun-data-charts
			    type="column"
			    :chartData="chartData"
				canvasId="asdb"
				:canvas2d="false"
				:opts="twoChart"
				:ontouch="true"
			  />
			</view>
		</view>
		<view class="achievement_footer">
			<view class="footer_table">
				<view class="table_time">
					<view class="item_title">时间</view>
					<view class="time_item" v-for="(item,index) in list" :key="index">
						<view>{{item.month}}</view>
					</view>
				</view>
				<scroll-view scroll-x="true" class="scroll">
					<view class="con_title">
						<view class="title_head">目标金额</view>
						<view class="title_head">成交金额</view>
						<view class="title_head">成交订单</view>
						<view class="title_head">完成率</view>
						<view class="title_head">平均客单价</view>
					</view>

					<view class="con_content">
						<view class="content_item" v-for="(item,index) in list" :key="index">
							<view class="con_data">&yen; {{item.achievement}}</view>
							<view class="con_data">&yen; {{item.money}}</view>
							<view class="con_data">{{item.count}}</view>
							<view class="con_data">{{item.ratio}}%</view>
							<view class="con_data">&yen; {{item.unit_price}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netTargetData } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	export default {
		data() {
			return {
				BASE_IMG_URL: BASE_IMG_URL,
				list: [],
				dataYear: '',
				typeList: ['本人及下属', '仅本人', '仅下属', '公司'],
				typeIndex: 0,
				chartData: {},
				twoChart:{
					color:['#B81BCF', '#1B67CF'],
					enableScroll: true,
					xAxis: {
						type:'grid',
						gridType:'dash',
						itemCount:3,//x轴单屏显示数据的数量，默认为5个
						scrollShow:true,//新增是否显示滚动条，默认false
						scrollAlign:'left',//滚动条初始位置
						scrollBackgroundColor:'#F7F7FF',//默认为 #EFEBEF
						scrollColor:'#DEE7F7',//默认为 #A6A6A6
					}
				},
			}
		},
		onShow() {
			this.roleType = uni.getStorageSync('roleType')

			if (this.roleType == 2) {
				this.typeList = ['本人及下属', '仅本人', '仅下属', '公司']
			} else {
				this.typeList = ['本人及下属', '仅本人', '仅下属']
			}

			let date = new Date()
			let year = date.getFullYear()
			this.dataYear = year
			this.getData()
		},
		methods: {
			getData() {
				netTargetData({
					year: this.dataYear,
					type: this.typeIndex
				}).then(res => {
					this.list = res.data
					//处理 柱状图 数据
					this.handleData(res.data)
				})
			},
			//处理 柱状图 数据
			handleData(data) {
				data.reverse()
				let y = []
				let x1 = []
				let x2 = []
				data.forEach((ele, index) => {
					y.push(ele.month) //月份
					x1.push(ele.achievement) //成交金额
					x2.push(ele.money) //目标金额
				})
				this.chartData = {
					categories: y,
					series: [
						{"name": "目标值","data": x1},
						{"name": "完成量","data": x2}
					],
				}
			},
			changeYeay(e) {
				this.dataYear = e.detail.value
				this.getData()
			},
			changeDataType(e) {
				this.typeIndex = e.detail.value
				this.getData()
			}
		},
		onReady() {
			
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style scoped lang="scss">
	/* 请根据需求修改图表容器尺寸，如果父容器没有高度图表则会显示异常 */
	.charts-box {
		width: 100%;
		height: 400px;
		background:#fff;
	}

	.querylist {
		margin: 40rpx 0 30rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.queryfir {
			margin-right: 15rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);
			background: #fff;
			border-radius: 8rpx;
		}

		.querysec {
			box-shadow: 2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);
			background: #fff;
			border-radius: 8rpx;
		}

		// 数据看板
		.form_right {
			width: 180rpx;
			height: 70rpx;
			font-size: 22rpx;
			color: #666;
			text-align: center;
			line-height: 48rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.bottomimg {
				width: 20rpx;
				height: 33rpx;
				margin-left: 15rpx;
			}
		}
	}

	.achievement_object {
		.achievement_body {
			margin: 30rpx;
			.achievement_title {
				border-radius: 10rpx;
				padding: 20rpx 0 40rpx;
				background-color: #fff;
				display: flex;
				text-align: center;

				.title_item {
					width: 33.33%;

					:first-child {
						padding: 20rpx;
						color: #ccc;
					}
				}
			}
		}

		.achievement_footer {
			margin: 0 30rpx;
			overflow: hidden;

			.footer_table {
				display: flex;

				.table_time {
					width: 200rpx;
					white-space: nowrap;

					.item_title {
						padding-left: 20rpx;
						font-weight: 700;
						height: 90rpx;
						line-height: 90rpx;
						border: 1rpx solid #f2f2f2;
						border-right: 0;
					}

					.time_item {
						padding-left: 20rpx;
						height: 90rpx;
						line-height: 90rpx;
						background-color: #fff;
						border-bottom: 1rpx solid #EAEAEA;
					}
				}

				.scroll {
					white-space: nowrap;
					width: 600rpx;
					overflow: hidden;

					.con_title {
						.title_heade {
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
						}

						.title_head {
							display: inline-block;
							width: 200rpx;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							border-top: 1rpx solid #f2f2f2;
							border-bottom: 1rpx solid #f2f2f2;
						}

						:last-child {
							border-right: 1rpx solid #f2f2f2;
						}
					}

					.con_content {
						.content_item {
							.con_data {
								display: inline-block;
								width: 200rpx;
								height: 90rpx;
								line-height: 90rpx;
								text-align: center;
								background-color: #fff;
								border-bottom: 1rpx solid #EAEAEA;
							}
						}
					}
				}
			}
		}
	}
</style>
