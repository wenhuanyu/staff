<template>
	<view>
		<view class="scr_warp">
			<view class="scr_box" @click="toScreenPop">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="scr_img" ></image>
			</view>
		</view>
		
		<!-- 销售汇总分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">销售汇总分析</view>
			<scroll-view scroll-x class="firbox">
				<view >
					<view class="charts-box">
					  <qiun-data-charts
					    type="column"
						:canvas2d="true"
						canvasId="sdjkfh"
					    :chartData="chartDataOne"
						:opts="firChart"
						:ontouch="true"
						:reshow="showCharts"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 产品销售分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">产品销售分析</view>
			<scroll-view scroll-x class="firbox" style="height:580rpx">
				<view class="tablebox">
					<view class="tab_con">
						<view class="table_th">产品名称</view>
						<view class="table_th">订单数</view>
						<view class="table_th">产品数量</view>
						<view class="table_th">金额</view>
					</view>
					<view class="tab_con" v-for="(item,index) in forData" :key="index">
						<view class="table_th">{{item.name}}</view>
						<view class="table_th">{{item.count}}</view>
						<view class="table_th">{{item.number}}</view>
						<view class="table_th">{{item.money}}</view>
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
	import { netSalesSummary, netSaleProductAna } from '@/api/api.js'
	
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
				show:false,
				queryObj:{
					times:'thisweek'
				},
				chartDataOne: {},
				firChart:{
					extra:{line:{type:'curve'}},
					color:['#189EFF','#8179E9'],
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
				//销售汇总分析
				this.getContract()
				//产品销售 分析
				this.getSPana()
			},
			getContract() {
				netSalesSummary(this.queryObj).then(res=>{
					let obj = {
						categories: res.data.date,
						series: [{
							name: "销售订单数",
							data: res.data.count
						},{
							name: "销售金额",
							data: res.data.contract_money
						}]
					}
					this.chartDataOne = obj
				})
			},
			getSPana() {
				netSaleProductAna(this.queryObj).then(res=>{
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
				display: flex;
				justify-content: flex-start;
				.tab_con{
					.table_th{
						padding:10rpx;
						width:200rpx;
						height:120rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size:22rpx;
						color:#666666;
						word-wrap: break-word;
						word-break: break-all;
						border-bottom:1rpx solid #f5f5f5;
					}
				}
			}
		}
	}
</style>
