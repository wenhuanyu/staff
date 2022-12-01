<template>
	<view class="">
		<!-- 上下班打卡 -->
		<view class="clock_con" v-if="info.is_card != 2 && !isClock">
			<!-- <image :src="BASE_IMG_URL+'guize.png'" class="set_guize" @click="toSetClock"></image> -->
			<view class="top_warp">
				<image :src="BASE_IMG_URL+'/clock_dingwei.png'" style="width:54rpx;height:72rpx" class="companyimg" mode=""></image>
				<view class="tip">{{info.msg}}</view>
				<!-- <view class="company">青东时代</view> -->
			</view>
			<view class="clock_box" @click="toClock">
				<view class="time">{{hour}} <span>:</span> {{branch}}</view>
				<view class="status">{{info.intime?info.intime.type:''}}</view>
			</view>
			<view class="text">{{info.intime?info.intime.text:''}}</view>
		</view>
		<!-- 已打卡 -->
		<view class="clock_con" v-if="info.is_card == 2">
			<!-- <image :src="BASE_IMG_URL+'guize.png'" class="set_guize" @click="toSetClock"></image> -->
			<view class="top_warp" v-if="info.attendance.type_name == 0">
				<image :src="BASE_IMG_URL+'/success.png'" v-if="info.attendance && info.attendance.late == 0" class="companyimg" mode=""></image>
				<image :src="BASE_IMG_URL+'/waring.png'" v-if="info.attendance && info.attendance.late == 1" class="companyimg" mode=""></image>
				<view class="tip"> 
				 <text v-if="info.attendance.late == 0">正常</text>
				 <text v-if="info.attendance.late == 1" style="color:red;">迟到</text>
				 ·打卡</view>
				<view class="company">上班打卡已完成</view>
			</view>
			<view class="top_warp" v-if="info.attendance.type_name == 1">
				<image :src="BASE_IMG_URL+'/success.png'" v-if="info.attendance.leaver == 0" class="companyimg" mode=""></image>
				<image :src="BASE_IMG_URL+'/waring.png'" v-if="info.attendance.leaver == 1" class="companyimg" mode=""></image>
				<view class="tip">
					<text v-if="info.attendance.leaver == 0">正常</text>
					<text v-if="info.attendance.leaver == 1" style="color:red;">早退</text>
					·打卡</view>
				<view class="company">下班打卡已完成</view>
			</view>
			<view class="clock_info">
				<view class="li">
					<view class="label">时间</view>
					<view class="time">{{clockTime}}</view>
				</view>
				<view class="li">
					<view class="label">位置</view>
					<view class="time">公司范围内</view>
				</view>
			</view>
			<view class="result">
				<view class="re_fir" @click="toSubmitColck" v-if="info.attendance.type_name == 0 && info.attendance.late == 1">提交补卡申请</view>
				<view class="re_fir" @click="toUpdate" v-if="info.attendance.type_name == 1">更新下班卡</view>
			</view>
		</view>
		<!-- 打卡之后显示打卡是否迟到  或者早退 -->
		<view class="clock_con" v-if="isClock">
			<!-- <image :src="BASE_IMG_URL+'guize.png'" class="set_guize" @click="toSetClock"></image> -->
			<view class="top_warp" v-if="clockInfo.type_name == 0">
				<image :src="BASE_IMG_URL+'/success.png'" v-if="clockInfo.late == 0" class="companyimg" ></image>
				<image :src="BASE_IMG_URL+'/waring.png'" v-if="clockInfo.late == 1" class="companyimg" ></image>
				<view class="tip"> 
				 <text v-if="clockInfo.late == 0">正常</text>
				 <text v-if="clockInfo.late == 1" style="color:red;">迟到</text>
				 ·打卡</view>
				<view class="company">上班打卡已完成</view>
			</view>
			<view class="top_warp" v-if="clockInfo.type_name == 1">
				<image :src="BASE_IMG_URL+'/success.png'" v-if="clockInfo.leaver == 0" class="companyimg" ></image>
				<image :src="BASE_IMG_URL+'/waring.png'" v-if="clockInfo.leaver == 1" class="companyimg" ></image>
				<view class="tip">
					<text v-if="clockInfo.leaver == 0">正常</text>
					<text v-if="clockInfo.leaver == 1" style="color:red;">早退</text>
					·打卡</view>
				<view class="company">下班打卡已完成</view>
			</view>
			<view class="clock_info">
				<view class="li">
					<view class="label">时间</view>
					<view class="time">{{clockTime}}</view>
				</view>
				<view class="li">
					<view class="label">位置</view>
					<view class="time">公司范围内</view>
				</view>
			</view>
			<view class="result" v-if="clockInfo.type_name == 0 && clockInfo.late == 1">
				<view class="re_fir" @click="toSubmitColck" >提交补卡申请</view>·
				<view class="re_fir" @click="toLeave">假勤申请</view>
			</view>
			<view class="result"  v-if="clockInfo.type_name == 1">
				<view class="re_fir" @click="toUpdate">更新下班卡</view>
			</view>
		</view>
		
		<!-- 更新打卡 -->
		<update-clock ref="clockChild" @update="checkIsPunch"></update-clock>
	</view>
</template>

<script>
	import updateClock from './updateClock.vue'
	import { netIsPunch, netPunchClock } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	let T;
	
	export default{
		components:{
			updateClock
		},
		props:{
			lat:{
				type:String/Number,
				default:''
			},
			lng:{
				type:String/Number,
				default:''
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				info:{},
				hour:'00',
				branch:'00',
				address:'',
				clockTime:'',   //打卡时间
				isClock:false,
				clockInfo:{},   //打卡之后的信息
			}
		},
		onLoad() {
			
		},
		created() {
			//获取当前时间
			this.getTime()
			//判断是否可以打卡
			this.checkIsPunch()
		},
		onUnload() {
			clearInterval(T)
		},
		methods:{
			clear() {
				clearInterval(T)
				// #ifdef MP-WEIXIN
				// wx.offLocationChange()
				// wx.stopLocationUpdate()
				// #endif
			},
			_locationChangeFn(res) {
				this.lng = res.longitude
				this.lat = res.latitude
				this.checkIsPunch()
			},
			
			//判断是否可以打卡
			checkIsPunch() {
				let params = {
					lng:this.lng,
					lat:this.lat
				}
				netIsPunch(params).then(res=>{
					this.info = res.data
					if(res.data.is_card==2){
						let time = res.data.attendance.time
						this.clockTime = time.substring(time.length-8,time.length)
					}
				})
			},
			getTime() {
				T = setInterval(()=>{
					let date = new Date()
					let h = date.getHours()
					let b = date.getMinutes()
					this.hour = this.handleTime(h)
					this.branch = this.handleTime(b)
				},1000)
			},
			//打卡
			toClock() {
				if(this.info.is_card != 1) {
					return
				}
				let params = {
					id:this.info.intime.id,
					type:0,
					type_name:this.info.intime.type_name,
					lng:this.lng,
					lat:this.lat,
				}
				netPunchClock(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					this.clockInfo = res.data
					let time = res.data.time
					this.clockTime = time.substring(time.length-8,time.length)
					setTimeout(()=>{
						this.isClock = true
					},2000)
				})
			},
			// 提交补卡申请
			toSubmitColck() {
				let type;   //0:补卡 1：早退 2：迟到
				if(this.clockInfo.type_name == 0 && this.clockInfo.late == 1){
					type = 2
				}else if(this.clockInfo.type_name == 1 && this.clockInfo.leaver == 1){
					type = 1
				}
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/supplementaryCard?id='+this.clockInfo.statisc_id+'&type='+type+'&time='+this.clockInfo.time
				})
			},
			//假勤申请
			toLeave() {
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/leave'
				})
			},
			//更新打卡
			toUpdate() {
				let params = {
					id:this.info.attendance.statisc_id,
					type:0,
					type_name:this.info.attendance.type_name,
					lng:this.lng,
					lat:this.lat,
				}
				this.$refs.clockChild.init(params)
			},
			//去设置打卡规则
			toSetClock() {
				uni.navigateTo({
					url:'/pagesB/punchclock/clockrules/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.clock_con{
		margin:0 auto;
		width:690rpx;
		height:calc(100vh - 210rpx);
		background:#fff;
		border-radius: 10rpx;
		position: relative;
		.set_guize{
			position: absolute;
			right:30rpx;
			top:30rpx;
			width:45rpx;
			height:45rpx;
		}
		.top_warp{
			display: flex;
			flex-direction: column;
			text-align: center;
			align-items: center;
			padding-top:140rpx;
			.companyimg{
				width:150rpx;
				height:150rpx;
				margin-bottom:50rpx;
			}
			.tip{
				font-size:30rpx;
				color:$uni-text-color;
				margin:15rpx 0;
				display: flex;
				justify-content: center;
				text-align: center;
			}
			.company{
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
		.clock_box{
			width:260rpx;
			height:260rpx;
			border-radius: 50%;
			border:15rpx solid $uni-text-color;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			align-items: center;
			margin:120rpx auto 200rpx;
			.time{
				font-size:42rpx;
				text-align: center;
				margin-bottom:14rpx;
				span{
					animation:twinkle 1s infinite;
				}
			}
			.status{
				font-size:26rpx;
				text-align: center;
			}
		}
		.text{
			text-align: center;
		}
		.clock_info{
			width:460rpx;
			margin:80rpx auto 20rpx;
			border-top:1rpx solid #f5f5f5;
			border-bottom:1rpx solid #f5f5f5;
			.li{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin:24rpx 0;
				.label{
					font-size:24rpx;
					color:#666;
				}
				.time{
					font-size:24rpx;
					color:#333;
				}
			}
		}
		.result{
			width:460rpx;
			margin:0 auto;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.re_fir{
				font-size:26rpx;
				color:$uni-text-color;
				margin-right:15rpx;
				&:last-child{
					margin-left:15rpx;
				}
			}
		}
	}
	@keyframes twinkle{
	   0% {
		   opacity: 1;
	   }
	   50% {
		   opacity: 0.5;
	   }
	   100% {
		   opacity: 0;
	   }
   }
</style>