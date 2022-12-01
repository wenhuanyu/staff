<template>
	<view class="" style="background:#f5f5f5;">
		<zzx-calendar 
			ref="calendarChild" 
			@selected-change="datechange" 
			@lookMonth="lookMonth" 
			:defaultDate="date"></zzx-calendar>
		<!-- 打卡上下班 -->
		<view class="lx_warp">
			<view class="top">
				<view class="top_left">
					<view class="tit">上下班打卡</view>
					<!-- <view class="tip">打卡规则:青东时代</view> -->
				</view>
				<view class="iconfont icon-arrows_right"></view>
			</view>
			<view class="time_warp" v-for="(item,index) in normalList" :key="index" >
				<view class="time_li">
					<view class="s_time">{{item.start_time}}</view>
					<view class="time_right" v-if="item.clock_in">
						<view class="ri_top">上班·{{item.late_time > 0 ? '异常' : '正常'}}</view>
						<view class="ri_text">
							{{item.late_time > 0 ? '迟到打卡' : '正常'}}
							({{item.clock_in.substring(item.clock_in.length-8,item.clock_in.length-2)}}) 
							·
							<view style="color:red" v-if="item.clock_in_status == 5">已补卡</view>
							<view style="color:red" v-if="item.clock_in_status == 6">已请假</view>
							<view class="ri_text" v-if="item.clock_in_status != 6 && item.clock_in_status != 5">
								<text style="color:red" v-if="item.late_time > 0" @click="toSubmitColck(item,1)">处理异常</text>
								·
								<text style="color:red" v-if="item.late_time > 0" @click="toLeave">假勤申请</text>
							</view>
						</view>
					</view>
					<view class="" v-else>
						<view class="time_right" v-if="item.mis_sCard">
							<view class="ri_text">
								缺卡 ·
								<text class="" style="color:red" v-if="item.clock_in_status == 5">已补卡</text>
								<text style="color:red" v-if="item.clock_in_status == 6">已请假</text>
								<view class="ri_text" v-if="item.clock_in_status != 6 && item.clock_in_status != 5">
									<text style="color:red" @click="toSubmitColck(item,1)">处理异常</text>
									· <text style="color:red" @click="toLeave">假勤申请</text>
								</view>
							</view>
						</view>
						<view class="time_right" v-else>
							上班
						</view>
					</view>
					
				</view>
				<view class="time_li">
					<view class="s_time">{{item.end_time}}</view>
					<view class="time_right" v-if="item.clock_out">
						<view class="ri_top">下班·{{item.leaver_time > 0 ? '异常' : '正常'}}</view>
						<view class="ri_text">
							{{item.leaver_time > 0 ? '早退打卡' : '正常'}}
							({{item.clock_out.substring(item.clock_out.length-8,item.clock_out.length-2)}})
							 ·
							<text class="" style="color:red" v-if="item.clock_out_status == 5">已补卡</text>
							<text style="color:red" v-if="item.clock_out_status == 6">已请假</text>
							<view class="ri_text" v-if="item.clock_out_status != 6 && item.clock_out_status != 5">
								<text style="color:red" v-if="item.leaver_time > 0" @click="toSubmitColck(item,2)">处理异常</text>
								·
								<text style="color:red" v-if="item.leaver_time > 0" @click="toLeave">假勤申请</text>
							</view>
						</view>
					</view>
					<view class="" v-else>
						<view class="time_right" v-if="item.mis_eCard">
							<view class="ri_text">
								缺卡 ·
								 <text class="" style="color:red" v-if="item.clock_out_status == 5">已补卡</text>
								 <text style="color:red" v-if="item.clock_out_status == 6">已请假</text>
								 <view class="ri_text" v-if="item.clock_out_status != 6 && item.clock_out_status != 5">
								 	<text style="color:red" @click="toSubmitColck(item,2)">处理异常</text>
								 	· <text style="color:red" @click="toLeave">假勤申请</text>
								 </view>
							</view>
						</view>
						<view class="time_right" v-else>
							下班
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 外勤打卡 -->
		<view class="out_warp">
			<view class="title">外出记录</view>
			<view class="out_info" v-for="(item,index) in fieldpersonList" :key="index" @click="toOutDetail(item)">
				<view class="out_time">{{item.time.substring(item.time.length-8,item.time.length-2)}}</view>
				<view class="out_right">
					{{item.address}}
				</view>
			</view>
		</view>
		<view class="" style="width:750rpx;height:130rpx;"></view>
	</view>
</template>

<script>
	import zzxCalendar from "@/components/zzx-calendar/zzx-calendar.vue"
	import { netClockStatis } from '@/api/api.js'
	import { getNowData } from '@/utils/weekTime.js'
	
	export default{
		components: {
			zzxCalendar
		},
		data() {
			return{
				typeIndex:0,
				date:'',  //时间
				normalList:[],  //正常打卡统计
				fieldpersonList:[],  //外勤打卡统计
			}
		},
		
		onLoad(options) {
			if(options.time){
				this.date = options.time
				this.$refs.calendarChild.init(this.date)
				//获取打卡记录
				this.getRecord()
			}else{
				this.getNowTime()
			}
		},
		methods:{
			getNowTime() {
				this.date = getNowData()
				this.$refs.calendarChild.init(this.date)
				//获取打卡记录
				this.getRecord()
			},
			getRecord() {
				netClockStatis({date:this.date}).then(res=>{
					res = res.data
					//处理正常打卡的数据
					this.handleData(res.statisc)
					this.fieldpersonList = res.other
				})
			},
			handleData(data) {
				let now = Date.now()    //当前时间戳
				data.forEach(ele=>{
					//上班打卡结束时间
					let a = this.date+' '+ele.uend_time
					let aTime = new Date(a).getTime()
					if(!ele.clock_in && aTime < now){
						ele.mis_sCard = true
					}else{
						ele.mis_sCard = false
					}
					//下班打卡结束时间
					let b = this.date+' '+ele.dend_time
					let bTime = new Date(b).getTime()
					if(!ele.clock_out && bTime < now){
						ele.mis_eCard = true
					}else{
						ele.mis_eCard = false
					}
				})
				this.normalList = data
			},
			datechange(obj) {
				this.date = obj.fullDate
				this.getRecord()
			},
			changeFirTab(type){
				this.typeIndex = type
			},
			//查看月统计
			lookMonth(){
				let year = this.date.substring(0,4)
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/monthStatis?year='+year
				})
			},
			// 提交补卡申请
			toSubmitColck(item,status) {
				console.log(item,'=====')
				let type;   //0:补卡 1：早退 2：迟到
				if(status == 1){
					//上班
					if(item.clock_in && item.late_time > 0){
						//迟到
						type = 2
					}else if(item.mis_sCard){
						type = 0
					}
				}else if(status == 2) {
					//下班
					if(item.clock_out && item.leaver_time > 0){
						//早退
						type = 1
					}else if(item.mis_eCard){
						type = 0
					}
				}
				let time = type == 1 ? item.clock_out : type == 2 ? item.clock_in : ''
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/supplementaryCard?id='+item.id+'&type='+type+'&time='+time
				})
			},
			//假勤申请
			toLeave() {
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/leave'
				})
			},
			//外勤详情
			toOutDetail(item) {
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/clockOutDetail?id='+item.id
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
	
	.tab_list{
		width:750rpx;
		height:80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background:#fff;
		.tabli{
			font-size:24rpx;
			color:#333;
			line-height: 75rpx;
			text-align: center;
			border-bottom:4rpx solid #fff;
		}
		.tabliactive{
			border-bottom:4rpx solid $uni-text-color;
		}
	}
	.lx_warp{
		width:690rpx;
		border-radius: 10rpx;
		background:#fff;
		margin:35rpx auto;
		.top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx;
			padding-bottom:24rpx;
			border-bottom:1rpx solid #f5f5f5;
			.top_left{
				.tit{
					font-size:30rpx;
					color:#333;
					margin-bottom:10rpx;
				}
				.tip{
					font-size:24rpx;
				}
			}
		}
		.time_warp{
			padding:0 24rpx;
			border-bottom:1rpx solid #f5f5f5;
			.time_li{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				&:last-child{
					.time_right{
						border-bottom:0;
					}
				}
				.s_time{
					font-size:32rpx;
					color:#333;
					flex-shrink: 0;
				}
				.time_right{
					flex:1;
					margin-left:15rpx;
					padding:24rpx 0;
					border-bottom:1rpx solid #f5f5f5;
					.ri_top{
						font-size:28rpx;
						color:#333;
						margin-bottom:8rpx;
					}
					.ri_text{
						font-size:24rpx;
						color:#666;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						text{
							color:$uni-text-color;
							margin-left:10rpx;
						}
					}
				}
			}
		}
		.work_time{
			padding:24rpx;
			font-size:24rpx;
			color:#333;
		}
	}
	.out_warp{
		width:690rpx;
		border-radius: 10rpx;
		background:#fff;
		padding:24rpx;
		margin:35rpx auto;
		.title{
			font-size:30rpx;
			color:#333;
			margin-bottom:24rpx;
			padding-bottom:24rpx;
			border-bottom:1rpx solid #f5f5f5;
		}
		.out_info{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			&:last-child{
				border-bottom:0;
			}
			.out_time{
				font-size:28rpx;
				margin-right:15rpx;
				flex-shrink: 0;
			}
			.out_right{
				font-size:26rpx;
				color:#666;
				flex:1;
			}
		}
	}
</style>