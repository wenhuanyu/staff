<template>
	<view>
		<view class="scr_warp">
			<view class="scr_box" @click="toScreen">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="scr_img" ></image>
			</view>
		</view>
		
		<!-- 工单数分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">工单数分析</view>
			<scroll-view scroll-x class="firbox">
				<view >
					<view class="charts-box">
					  <qiun-data-charts
					    type="column"
						:canvas2d="true"
						canvasId="qwer"
						:ontouch="true"
					    :chartData="chartDataOne"
						:opts="firChart"
						:reshow="showCharts"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 工单金额分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">工单金额分析</view>
			<scroll-view scroll-x class="firbox">
				<view >
					<view class="charts-box">
					  <qiun-data-charts
					    type="column"
						:canvas2d="true"
						canvasId="qwez"
					    :chartData="chartDataTwo"
						:opts="twoChart"
						:reshow="showCharts"
						:ontouch="true"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
		</view>
		
		<screen-pop ref="screenChild" :type="3" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { netWorkOrderAna, netWorkOrderMoneyAna } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screenPop.vue'
	
	export default{
		components:{
			screenPop
		},
		props:{
			showCharts:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return{
				show:false,
				BASE_IMG_URL:BASE_IMG_URL,
				queryObj:{
					times:'thisweek'
				},
				chartDataOne: {},
				firChart:{
					color:['#FFB463','#63A3FF'],
					extra:{
						line:{type:'curve'},
						column:{
							linearType: "custom",
							linearOpacity: 0.7
						}
					},
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
				chartDataTwo: {},
				twoChart:{
					color:['#FB7A79','#BABEF9'],
					extra:{
						line:{type:'curve'},
						column:{
							linearType: "custom",
							linearOpacity: 0.7
						}
					},
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
		methods:{
			toScreen() {
				this.$refs.screenChild.open()
			},
			sureQuery(params) {
				this.queryObj = params
				this.init()
			},
			init() {
				//工单数分析
				this.getWorkN()
				//工单 金额分析
				this.getWorkMoney()
			},
			getWorkN() {
				netWorkOrderAna(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.date,
						series: [{
							name: "新增工单数",
							data: res.data.count
						},{
							name: "完成工单数",
							data: res.data.satisfied
						}]
					}
					this.chartDataOne = obj
				})
			},
			getWorkMoney() {
				netWorkOrderMoneyAna(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.date,
						series: [{
							name: "工单金额",
							data: res.data.money
						},{
							name: "完成工单数",
							data: res.data.count
						}]
					}
					this.chartDataTwo = obj
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scr_warp{
		display: flex;
		justify-content: flex-end;
		padding:24rpx;
		.scr_box{
			padding:10rpx 30rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			.scr_img{
				width:35rpx;
				height:27rpx;
			}
		}
	}
	.fir_data_box{
		width:690rpx;
		margin:0 auto 30rpx;
		background:#fff;
		.data_box_title{
			width:100%;
			height:80rpx;
			background:$uni-bg-opacity;
			font-size:30rpx;
			color:$uni-text-color;
			text-align: center;
			line-height: 80rpx;
		}
		.firbox{
			margin-top:24rpx;
			width:100%;
			height:380rpx;
			.charts-box{
				width:100%;
				height:380rpx;
			}
		}
	}
	
</style>
