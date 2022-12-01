<template>
	<view class="">
		<view class="querylist">
			<view class="queryfir">
				<picker mode="date" fields="year" @change="changeYear">
					<view class="form_right">
						<view>{{dataYear ? dataYear+'年' : '点击选择'}}</view>
						<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg" mode="scaleToFill"></image>
					</view>
				</picker>
			</view>
			<view class="queryfir">
				<picker :range="typeList" :value="typeIndex" @change="changeDataType" :range-key="'name'">
					<view class="form_right">
						<view>{{typeList[typeIndex] ? typeList[typeIndex].name : '点击选择'}}</view>
						<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg" mode="scaleToFill"></image>
					</view>
				</picker>
			</view>
			<view class="queryfir">
				<view class="form_right" @click="toSelectStaff">
					<view>{{staffObj.id ? staffObj.name : '点击选择'}}</view>
					<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg" mode="scaleToFill"></image>
				</view>
			</view>
		</view>

		<!-- 业绩总合 -->
		<view class="sectionbox">
			<view class="setAchieve" v-if="typeIndex == 0" @click="toTarget(3)">设置个人目标</view>
			<view class="setAchieve" v-if="typeIndex == 1" @click="toTarget(2)">设置团队目标</view>
			
			<view class="sec_type">
				<picker :range="arr" :value="arrIndex" @change="changeArr" :range-key="'name'">
					<view class="form_right">
						<view style="font-size:28rpx;">{{arr[arrIndex] ? arr[arrIndex].name : '点击选择'}}</view>
						<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg" mode="scaleToFill"></image>
					</view>
				</picker>
			</view>
			<view class="sec_top">
				<view class="sec_left">
					<view class="left_t">目标(元)</view>
					<view class="left_m">{{yeartarget.achievement?yeartarget.achievement:0}}</view>
				</view>
				<view class="sec_left">
					<view class="left_t">完成(元)</view>
					<view class="left_m">{{yeartarget.money?yeartarget.money:0}}</view>
				</view>
			</view>
			<view class="sec_bot">
				<view class="pro_box">
					<view class="pro_in" :style="{width:(yeartarget.ratio>100?100:yeartarget.ratio)+'%'}"></view>
				</view>
				<view class="bot_w">
					<view class="bot_w_l">完成<span>{{yeartarget.ratio}}%</span></view>
					<view class="bot_w_l">剩余目标<span>{{yeartarget.achievement-yeartarget.money>=0?yeartarget.achievement-yeartarget.money:0}}元</span></view>
				</view>
			</view>
		</view>
		<!-- 业绩图表 -->
		<!-- :canvas2d="true" -->
		<view class="chartbox">
			<view class="chart_top">
				<qiun-data-charts 
					type="column" 
					canvasId="jnt"	
					
					:ontouch="true" 
					:opts="opts" 
					:chartData="chartData" />
			</view>
			<view class="tabbox">
				<view class="table_li">
					<view class="table_td">时间</view>
					<view class="table_td">目标(元)</view>
					<view class="table_td">已完成(元)</view>
					<view class="table_td">完成度</view>
				</view>
				<view class="table_li" v-for="(item,index) in list" :key="index">
					<view class="table_td">{{item.month}}</view>
					<view class="table_td">{{item.achievement?item.achievement:0}}</view>
					<view class="table_td">{{item.money?item.money:0}}</view>
					<view class="table_td">{{item.ratio}}%</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import {netAchievementStatistics} from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'

	export default {
		mixins:[commonFun],
		data() {
			return {
				BASE_IMG_URL: BASE_IMG_URL,
				dataYear: '',
				typeList:[
					{id:3,name:'个人业绩'},
					{id:2,name:'团队业绩'}
				],
				typeIndex: 0,
				yeartarget:{},
				list:[],
				arr:[
					{id:1,name:'合同'},
					{id:2,name:'回款'},
				],
				arrIndex:0,
				chartData:{},
				opts: {
					color: ["#f5f5f5", "#008EFF"],
					padding: [15, 15, 0, 5],
					dataLabel: false,
					legend: {},
					enableScroll: true,
					xAxis: {
						type: 'grid',
						disableGrid: true,
						gridType: 'dash',
						itemCount: 4, //x轴单屏显示数据的数量，默认为5个
						scrollShow: true, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#DEE7F7', //默认为 #A6A6A6
					},
					yAxis: {
						data: [{
							min: 0
						}]
					},
					extra: {
						column: {
							type: "meter",
							width: 12,
							activeBgColor: "#f5f5f5",
							activeBgOpacity: 1,
							meterBorder: 0,
							meterFillColor: "#dfdfdf",
							barBorderRadius: [
								50,
								50,
								50,
								50
							]
						}
					}
				},
				roleType:1,
				
			}
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		watch:{
			staffObj(newval,oldval){
				if(newval){
					this.getData()
				}
			}
		},
		onLoad() {
			this.roleType = uni.getStorageSync('roleType')
			
			let time = new Date()
			this.dataYear = time.getFullYear()
			let userInfo = uni.getStorageSync('userinfo')
			this.$store.commit('STAFFOBJ',{
				id:userInfo.id,
				name:userInfo.name
			})
		},
		methods: {
			getData() {
				let params = {
					staff_id:this.staffObj.id,
					year:this.dataYear,
					status:this.arr[this.arrIndex].id,
					type:this.typeList[this.typeIndex].id
				}
				netAchievementStatistics(params).then(res=>{
					res = res.data
					let a = {
						categories: res.echartdata.month,
						series: [{
								name: "目标值",
								data: res.echartdata.achievement
							},
							{
								name: "完成量",
								data: res.echartdata.money
							}
						]
					}
					this.chartData = a
					this.yeartarget = res.yeartarget
					this.list = res.data
				})
			},
			changeDataType(e) {
				this.typeIndex = e.detail.value
				this.getData()
			},
			changeYear(e) {
				this.dataYear = e.detail.value
				this.getData()
			},
			changeArr(e) {
				this.arrIndex = e.detail.value
				this.getData()
			},
			//修改业绩目标  3员工 2团队
			toTarget(type) {
				uni.navigateTo({
					url: '/pages/target/myTarget?type='+type,
				})
			},
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.querylist {
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;

		.queryfir {
			margin-right: 15rpx;
			background: #fff;
			border-radius: 8rpx;
		}

		.querysec {
			background: #fff;
			border-radius: 8rpx;
		}

		// 数据看板
		.form_right {
			width: 180rpx;
			height: 80rpx;
			font-size: 28rpx;
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
	.sectionbox {
		padding: 40rpx 30rpx 40rpx;
		background: #fff;
		margin-top: 24rpx;
		position: relative;
		.setAchieve{
			position: absolute;
			right:30rpx;
			top:30rpx;
			font-size:28rpx;
			color:$uni-text-color;
		}
		.sec_type{
			display: flex;
			justify-content: center;
			margin-bottom:35rpx;
			.form_right{
				width: 180rpx;
				height: 80rpx;
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
		.sec_top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.sec_left {
				width: 49%;
				flex-shrink: 0;
				border-right: 1rpx solid #f5f5f5;
				text-align: center;

				&:last-child {
					border-right: 0;
				}

				.left_t {
					font-size: 26rpx;
					color: #666;
					margin-bottom: 8rpx;
				}

				.left_m {
					font-size: 30rpx;
					color: #333;
				}
			}
		}

		.sec_bot {
			margin-top: 45rpx;

			.pro_box {
				width: 690rpx;
				height: 24rpx;
				border-radius: 12rpx;
				background: #f5f5f5;
				position: relative;

				.pro_in {
					width: 300rpx;
					position: absolute;
					left: 0;
					top: 0;
					height: 24rpx;
					border-radius: 12rpx;
					background: $uni-text-color;
				}
			}

			.bot_w {
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.bot_w_l {
					font-size: 28rpx;
					color: #666;

					span {
						color: $uni-text-color;
						margin-left: 8rpx;
					}
				}
			}
		}
	}
	.chartbox{
		margin-top:24rpx;
		background:#fff;
		padding:40rpx 30rpx;
		.chart_top{
			width:690rpx;
			margin:0 auto 30rpx;
		}
		.tabbox{
			border-top:1rpx solid #dfdfdf;
			border-left:1rpx solid #dfdfdf;
			width:690rpx;
			.table_li{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				&:first-child{
					background:rgba(3,170,150,0.5);
				}
				.table_td{
					border-bottom:1rpx solid #dfdfdf;
					border-right:1rpx solid #dfdfdf;
					width:221rpx;
					text-align: center;
					padding:20rpx 0;
					color:#333;
					&:first-child{
						width:120rpx;
					}
					&:last-child{
						width:130rpx;
					}
				}
			}
		}
	}
</style>
