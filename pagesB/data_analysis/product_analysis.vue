<template>
	<view>
		<view class="scr_warp">
			<view class="scr_box" @click="toCcreenPop">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="scr_img" ></image>
			</view>
		</view>
		
		<!-- 产品销售分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">产品销售分析</view>
			<scroll-view scroll-x class="firbox">
				<view >
					<view class="charts-box">
					  <qiun-data-charts
					    type="area"
						:canvas2d="true"
						:ontouch="true"
						canvasId="qwep"
					    :chartData="chartDataOne"
						:opts="firChart"
						:reshow="showCharts"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 部件问题分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">部件问题分析</view>
			<scroll-view scroll-x class="firbox">
				<view >
					<view class="charts-box">
					  <qiun-data-charts
					    type="line"
						:canvas2d="true"
						canvasId="qwekj"
						:ontouch="true"
					    :chartData="chartDataTwo"
						:opts="twoChart"
						:reshow="showCharts"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
		</view>
		
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screenPop.vue'
	import { netCPxsAnalysis, netBJAnalysis } from '@/api/api.js'
	
	export default{
		components:{
			screenPop
		},
		props:{
			showCharts:{
				type:Boolean
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				queryObj:{
					times:'thisweek'
				},
				chartDataOne:{},
				firChart:{
					color:['#00A1E4'],
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
				twoChart:{
					color:['#FEAB67', '#AB90DF'],
					enableScroll: true,
					xAxis: {
						type:'grid',
						gridType:'dash',
						itemCount:1,//x轴单屏显示数据的数量，默认为5个
						scrollShow:true,//新增是否显示滚动条，默认false
						scrollAlign:'left',//滚动条初始位置
						scrollBackgroundColor:'#F7F7FF',//默认为 #EFEBEF
						scrollColor:'#DEE7F7',//默认为 #A6A6A6
					}
				},
				chartDataTwo:{}
			}
		},
		methods:{
			toCcreenPop() {
				this.$refs.screenChild.open()
			},
			sureQuery(params) {
				this.queryObj = params
				this.init()
			},
			init() {
				//产品 销售 分析
				this.getCPsale()
				//产品  部件 分析
				this.getBJ()
			},
			getCPsale() {
				netCPxsAnalysis(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.date,
						series: [{
							name: "老客跟进次数",
							data: res.data.count
						}]
					}
					this.chartDataOne = obj
				})
			},
			getBJ() {
				netBJAnalysis(this.queryObj).then(res=>{
					let obj
					if(res.data){
						obj = {
							categories: res.data.name,
							series: [{
								name: "部件问题量",
								data: res.data.count
							},{
								name: "部件问题比率",
								data: res.data.ratio
							}]
						}
					}else{
						obj = {
							categories: [],
							series: [{
								name: "部件问题量",
								data: []
							},{
								name: "部件问题比率",
								data: []
							}]
						}
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
