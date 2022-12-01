<template>
	<view>
		<view class="scr_warp">
			<view class="scr_box" @click="toScreenPop">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="scr_img"></image>
			</view>
		</view>
		
		<!-- 合同数分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">合同数分析</view>
			<scroll-view scroll-x class="firbox">
				<view >
					<view class="charts-box">
					  <qiun-data-charts
					    type="column"
					    :chartData="chartDataOne"
						:opts="firChart"
						:ontouch="true"
						:canvas2d="false"
						canvasId="fgsd"
						:reshow="showCharts"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
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
					   canvasId="rtghgfbx"
					    :chartData="chartDataTwo"
						:opts="twoChart"
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
					   canvasId="lkhdg"
					    :chartData="chartDataThr"
						:opts="thrChart"
						:reshow="showCharts"
						:ontouch="true"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 合同汇总表 -->
		<view class="fir_data_box">
			<view class="data_box_title">合同汇总表</view>
			<scroll-view scroll-y class="firbox">
				<view class="tablebox">
					<view class="tab_header">
						<view class="table_th">日期</view>
						<view class="table_th">签约合同数</view>
						<view class="table_th">签约金额</view>
						<view class="table_th">回款金额</view>
					</view>
					<view class="tab_con" v-for="(item,index) in forData" :key="index">
						<view class="table_tb">{{item.date}}</view>
						<view class="table_tb">{{item.count}}</view>
						<view class="table_tb">{{item.contract_money}}</view>
						<view class="table_tb">{{item.receivables_money}}</view>
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
	import { netContractNumAna, netContractMoneyAna, netContractPayment, netContractTotal } from '@/api/api.js'
	
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
				chartDataOne: {},
				firChart:{
					color:['#228FFE'],
					extra:{
						column:{
							linearType: "custom",
							customColor:['#228FFE','#52C5FF'],
							linearOpacity: 0.5
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
				twoChart:{
					color:['#EF964B'],
					extra:{
						column:{
							linearType: "custom",
							customColor:['#EF964B','#FFBC84'],
							linearOpacity: 0.5
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
				chartDataTwo:{},
				chartDataThr:{},
				thrChart:{
					color:['#B866FE'],
					extra:{
						column:{
							linearType: "custom",
							customColor:['#B865FE','#D7A8FF'],
							linearOpacity: 0.5
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
				forData:[],
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
				//合同 数分析
				this.getContract()
				//合同金额分析
				this.getCtMoney()
				//回款 金额 分析
				this.getPayAna()
				//合同 汇总 表
				this.getCtHui()
			},
			getContract() {
				netContractNumAna(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.date,
						series: [{
							name: "合同签订数量",
							data: res.data.count
						}]
					}
					this.chartDataOne = obj
				})
			},
			getCtMoney() {
				netContractMoneyAna(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.date,
						series: [{
							name: "合同签订金额",
							data: res.data.count
						}]
					}
					this.chartDataTwo = obj
				})
			},
			getPayAna() {
				netContractPayment(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.date,
						series: [{
							name: "合同回款金额",
							data: res.data.money
						}]
					}
					this.chartDataThr = obj
				})
			},
			getCtHui() {
				netContractTotal(this.queryObj).then(res=>{
					this.forData = res.data
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
			.tablebox{
				width:100%;
				padding:0 10rpx;
				.tab_header{
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding:10rpx 0;
					.table_th{
						width:168rpx;
						text-align: center;
						color:#333333;
						font-size:26rpx;
						word-wrap: break-word;
						word-break: break-all;
					}
				}
				.tab_con{
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding:10rpx 0;
					.table_tb{
						width:168rpx;
						text-align: center;
						font-size:22rpx;
						color:#666666;
						word-wrap: break-word;
						word-break: break-all;
					}
				}
			}
		}
	}
</style>
