<template>
	<view>
		<view class="scr_warp">
			<view class="scr_box" @click="toScreenPop">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="scr_img" ></image>
			</view>
		</view>
		
		<!-- 合同金额分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">合同金额分析</view>
			<scroll-view scroll-x class="firbox">
				<view >
					<view class="charts-box">
					  <qiun-data-charts
					    type="column"
						:canvas2d="false"
						:ontouch="true"
						canvasId="ghnfgdj"
					    :chartData="chartDataOne"
						:opts="firChart"
						:reshow="showCharts"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 回款金额分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">回款金额分析</view>
			<scroll-view scroll-x class="firbox">
				<view >
					<view class="charts-box">
					  <qiun-data-charts
					    type="column"
						:canvas2d="false"
						canvasId="mhfu"
					    :chartData="chartDataTwo"
						:opts="twoChart"
						:ontouch="true"
						:reshow="showCharts"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
		</view>
		
		<screen-pop  ref="screenChild" :type="4" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { netYejiContract, netYejiPayment } from '@/api/api.js'
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
				BASE_IMG_URL:BASE_IMG_URL,
				queryObj:{
					times:''
				},
				chartDataOne: {},
				firChart:{
					color:['#FFB463','#63A3FF'],
					extra:{
						line:{type:'curve'},
						column:{
							linearType: "custom",
							linearOpacity: 0.7,
							customColor:['#FFB463','#63A3FF'],
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
							linearOpacity: 0.7,
							customColor:['#FB7A79','#BABEF9'],
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
			toScreenPop() {
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
				netYejiContract(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.month,
						series: [{
							name: "实收合同金额",
							data: res.data.money
						},{
							name: "目标合同金额",
							data: res.data.achievement
						}]
					}
					this.chartDataOne = obj
				})
			},	
			getWorkMoney() {
				netYejiPayment(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.month,
						series: [{
							name: "实收回款金额",
							data: res.data.money
						},{
							name: "目标合同金额",
							data: res.data.achievement
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
