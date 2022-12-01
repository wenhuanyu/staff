<template>
	<view>
		<view class="scr_warp">
			<view class="scr_box" @click="toScreenPop">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="scr_img" ></image>
			</view>
		</view>
		
		<!-- 销售漏斗分析 -->
		<view class="fir_data_box">
			<view class="data_box_title">销售漏斗分析</view>
			<scroll-view scroll-x class="firbox" v-show="isShow">
				<view v-show="isShow">
					<view class="charts-box">
					  <qiun-data-charts
					    type="funnel"
						:canvas2d="true"
						canvasId="sdgbsd"
						:opts="firChart"
						:reshow="showCharts"
					    :chartData="chartData"
					    background="none"
					  />
					</view>
				</view>
			</scroll-view>
			<view class="noData" v-if="!isShow">
				暂无数据
			</view>
		</view>
		
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screenPop.vue'
	import { netXSAnalysis } from '@/api/api.js'
	
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
					times:'thisweek'
				},
				chartData:{},
				firChart:{
					color:['#8179E9','#DCB5E8','#FA7495','#FF9F7F','#FEDD5A','#9AE4B9','#31BFE6'],
					legend:{
						position:'right'
					}
				},
				isShow:false,  //true显示  false不显示
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
				netXSAnalysis(this.queryObj).then(res=>{
					let data = res.data
					data.forEach(ele=>{
						if(ele.value != 0){
							this.isShow = true
						}
					})
					if(this.isShow){
						let obj = {
							series: [
								{
									data:data
								}
							]
						}
						console.log(obj,'====123456')
						this.chartData = JSON.parse(JSON.stringify(obj))
					}
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
