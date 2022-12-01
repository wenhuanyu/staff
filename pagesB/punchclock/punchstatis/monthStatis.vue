<template>
	<view class="">
		<swiper class="swiper" :current="current">
			<swiper-item>
				<view class="swiperbox">
					<view class="s_month" @click="changeMonth(item)" v-for="(item,index) in arr1" :key="index" :class="{'s_month_a':item == month}">{{item}}月</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiperbox">
					<view class="s_month" @click="changeMonth(item)" v-for="(item,index) in arr2" :key="index" :class="{'s_month_a':item == month}">{{item}}月</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="secbox">
			<view class="title">上下班统计·次</view>
			<view class="charts_box">
				<view class="ch_li">正常<text>{{info.normal}}</text>天 </view>
				<view class="ch_li ch_li_a">异常<text>{{info.error}}</text>天 </view>
			</view>
			<view class="statis_li">
				<view class="sta_num" @click="toLook('late')">
					<view class="num">{{info.late}}</view>
					<view class="minute" v-if="info.late_time">{{info.late_time}}分钟</view>
					<view class="status">迟到</view>
				</view>
				<view class="sta_num" @click="toLook('leave')">
					<view class="num">{{info.leave}}</view>
					<view class="minute" v-if="info.leave_time">{{info.leave_time}}分钟</view>
					<view class="status">早退</view>
				</view>
				<view class="sta_num" @click="toLook('work')">
					<view class="num">{{info.work}}</view>
					<view class="minute" v-if="info.work_time">{{info.work_time}}分钟</view>
					<view class="status">旷工</view>
				</view>
			</view>
			<view class="statis_li">
				<view class="sta_num" @click="toLook('card')">
					<view class="num">{{info.card}}</view>
					<view class="status">缺卡</view>
				</view>
				<view class="sta_num">
					<view class="num">{{info.error}}</view>
					<view class="status">地点异常</view>
				</view>
				<view class="sta_num">
					<view class="num">{{info.other}}</view>
					<view class="status">外勤</view>
				</view>
			</view>
		</view>
		<!-- 加班统计 -->
		<view class="secbox">
			<view class="title">加班统计·分钟</view>
			<view class="statis_li">
				<view class="sta_num">
					<view class="num">{{info.overtime}}</view>
					<view class="status">工作日加班</view>
				</view>
				<!-- <view class="sta_num">
					<view class="num">5</view>
					<view class="status">休息日加班</view>
				</view>
				<view class="sta_num">
					<view class="num">5</view>
					<view class="status">节假日加班</view>
				</view> -->
			</view>
		</view>
		<!-- 假勤统计 -->
		<view class="secbox" v-if="false">
			<view class="title">假勤统计</view>
			<view class="statis_li">
				<view class="sta_num">
					<view class="num">5 <text>次</text> </view>
					<view class="status">打卡补卡</view>
				</view>
				<view class="sta_num">
					<view class="num">5 <text>次</text></view>
					<view class="status">外勤</view>
				</view>
				<view class="sta_num">
					<view class="num">5 <text>小时</text></view>
					<view class="status">外出</view>
				</view>
			</view>
			<view class="statis_li">
				<view class="sta_num">
					<view class="num">5 <text>天</text></view>
					<view class="status">出差</view>
				</view>
				<view class="sta_num">
					<view class="num">5 <text>天</text></view>
					<view class="status">年假</view>
				</view>
				<view class="sta_num">
					<view class="num">5 <text>小时</text></view>
					<view class="status">事假</view>
				</view>
			</view>
			<view class="statis_li">
				<view class="sta_num">
					<view class="num">5 <text>小时</text></view>
					<view class="status">病假</view>
				</view>
				<view class="sta_num">
					<view class="num">5 <text>小时</text></view>
					<view class="status">调休假</view>
				</view>
				<view class="sta_num">
					<view class="num"> <text>天</text></view>
					<view class="status">婚假</view>
				</view>
			</view>
			<view class="statis_li">
				<view class="sta_num">
					<view class="num">5 <text>天</text></view>
					<view class="status">产假</view>
				</view>
				<view class="sta_num">
					<view class="num">5 <text>天</text></view>
					<view class="status">陪产假</view>
				</view>
				<view class="sta_num">
					<view class="num">5 <text>天</text></view>
					<view class="status">其他</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netClockMonthStatis } from '@/api/api.js'
	
	export default{
		data() {
			return{
				arr1:['1','2','3','4','5','6'],
				arr2:['7','8','9','10','11','12'],
				current:0,
				month:1,
				year:'2022',
				info:{},
				chartData:{
					series:[
						{
							data:[
								{name:'正常',value:50},
								{name:'异常',value:150}
							]
						}
					]
				},
				opts:{
					title: {
						name: "打卡",
						fontSize: 10,
						color: "#666666"
					},
					subtitle: {
					    name: "",
					    fontSize: 10,
					    color: "#7cb5ec"
					},
					extra:{
						ring:{
							ringWidth:10,
						}
					}
				}
			}
		},
		onLoad(options) {
			this.year = options.year
			//获取当前月
			let time = new Date()
			this.month = time.getMonth()+1
			if(this.month > 6){
				this.current = 1
			}else{
				this.current = 0
			}
			//获取月统计
			this.getData()
		},
		methods:{
			getData() {
				let params = {
					month:this.year+'-'+this.month
				}
				netClockMonthStatis(params).then(res=>{
					this.info = res.data
					let obj = {
						series:[
							{
								data:[
									{name:'正常',value:res.data.normal},
									{name:'异常',value:res.data.error}
								]
							}
						]
					}
					this.chartData = obj
				})
			},
			changeMonth(month){
				this.month = month
				this.getData()
			},
			//查看明细
			toLook(type) {
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/dayStatis?month='+this.month+'&type='+type+'&year='+this.year
				})
			}
		}
	}
</script>

<style>
	page{
		background:#f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.swiper{
		width:100%;
		height:70rpx;
		background:#fff;
		margin-bottom:24rpx;
		.swiperbox{
			width:100%;
			height:70rpx;
			padding:0 15rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.s_month{
				font-size:24rpx;
				color:#333;
				width:60rpx;
				height:60rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 60rpx;
				background:#fff;
			}
			.s_month_a{
				width:60rpx;
				height:60rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 60rpx;
				background:$uni-text-color;
				color:#fff;
			}
		}
	}
	.secbox{
		width:690rpx;
		border-radius: 10rpx;
		background:#fff;
		margin:0 auto 24rpx;
		padding:30rpx;
		.title{
			font-size:30rpx;
			color:#333;
			margin-bottom:35rpx;
		}
		.charts_box{
			display: flex;
			flex-direction: column;
			margin-bottom:35rpx;
			align-items: center;
			.ch_li{
				width:150rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				font-size:24rpx;
				color:#666;
				margin-bottom:15rpx;
				&:last-child{
					margin-bottom:0;
				}
				&::before{
					content:'';
					position: absolute;
					left:0;
					top:15rpx;
					width:10rpx;
					height:10rpx;
					border-radius: 50%;
					background-color: $uni-text-color;
				}
				text{
					font-size:30rpx;
					color:$uni-text-color;
					margin:0 10rpx;
				}
			}
			.ch_li_a{
				&::before{
					background-color: #ff7800;
				}
				text{
					font-size:30rpx;
					color:#ff7800;
				}
			}
		}
		.statis_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:34rpx;
			.sta_num{
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				width:200rpx;
				.num{
					font-size:32rpx;
					color:#000;
					text{
						font-size:24rpx;
					}
				}
				.minute{
					font-size:24rpx;
					color:#ff7800;
				}
				.status{
					font-size:26rpx;
					color:#666;
				}
			}
		}
	}
</style>