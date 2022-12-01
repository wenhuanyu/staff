<template>
	<view class="">
		<!-- 筛选 -->
		<view class="searchbox">
			<view class="searchtext" @click="toQuery">筛选<view class="iconfont icon-shaixuan"></view></view>
		</view>
		
		<view class="section">
			<view class="statisbox">
				<view class="box_li">
					<view class="num">{{statisInfo.contract_money?statisInfo.contract_money:0}}</view>
					<view class="tit">合同总金额</view>
				</view>
				<view class="box_li">
					<view class="num">{{statisInfo.receivables_money?statisInfo.receivables_money:0}}</view>
					<view class="tit">回款总金额</view>
				</view>
			</view>
			<view class="statisbox">
				<view class="box_li">
					<view class="num">{{statisInfo.contract_num?statisInfo.contract_num:0}}</view>
					<view class="tit">签约合同数</view>
				</view>
				<view class="box_li">
					<view class="num">{{statisInfo.receivables_nomoney?statisInfo.receivables_nomoney:0}}</view>
					<view class="tit">未回款总金额</view>
				</view>
			</view>
			<view class="statisbox">
				<view class="box_li">
					<view class="num">{{statisInfo.contract_over?statisInfo.contract_over:0}}</view>
					<view class="tit">已到期合同</view>
				</view>
				<view class="box_li">
					<view class="num">{{statisInfo.contract_now?statisInfo.contract_now:0}}</view>
					<view class="tit">即将到期合同</view>
				</view>
			</view>
		</view>
		
		<view class="echartbox">
			<view class="echarttitle">趋势分析</view>
			<view class="charts-box">
				<qiun-data-charts 
					type="line" 
					canvasId="asdq" 
					:canvas2d="true" 
					:ontouch="true" 
					:opts="oneChart"
					:chartData="chartDataOne" 
					background="none" 
				/>
			</view>
		</view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { netNewContractStatis } from '@/api/api.js'
	import screenPop from './statisScreen.vue'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
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
				queryObj:{
					times:'thismonth',
					type:0
				},
				statisInfo:{}
			}
		},
		onLoad() {
			this.getData()
		},
		methods:{
			getData() {
				netNewContractStatis(this.queryObj).then(res=>{
					this.statisInfo = res.data
					//处理图表数据
					this.handleData(res.data.contract)
				})
			},
			handleData(arr) {
				let a = []   //时间
				let b = []   //合同
				let c = []   //回款
				arr.forEach(ele=>{
					a.push(ele.month)
					b.push(ele.contract)
					c.push(ele.receivables)
				})
				let obj = {
					categories: a,
					series: [{
						name: "合同总金额",
						data: b
					}, {
						name: "回款总金额",
						data: c
					}]
				}
				this.chartDataOne = obj
			},
			toQuery() {
				this.$refs.screenChild.open()
			},
			sureQuery(obj){
				this.queryObj = obj
				this.getData()
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.searchbox{
		display: flex;
		justify-content: flex-end;
		margin:24rpx;
		.searchtext{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:$uni-text-color;
			padding:8rpx 28rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			.icon-shaixuan{
				color:$uni-text-color;
			}
		}
	}
	.section{
		background:#fff;
		padding:0 24rpx;
		.statisbox{
			border-bottom:1rpx solid #f5f5f5;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0;
			.box_li{
				width:50%;
				height:80rpx;
				text-align: center;
				position: relative;
				.num{
					font-size:28rpx;
					color:#333;
				}
				.tit{
					font-size:26rpx;
					color:#666;
				}
				&::after{
					content:'';
					width:1rpx;
					height:80rpx;
					background:#f5f5f5;
					position: absolute;
					right:0;
					top:0;
				}
				&:last-child{
					&::after{
						display: none;
					}
				}
			}
		}
	}
	.echartbox{
		width:100%;
		padding:24rpx;
		background:#fff;
		margin-top:24rpx;
		.echarttitle{
			font-size:28rpx;
			color:#333;
			margin-bottom:15rpx;
		}
		.charts-box{
			width: 100%;
			height: 380rpx;
		}
	}
</style>