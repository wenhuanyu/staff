<template>
	<view class="">
		<view class="out_warp" v-if="isClock">
			<view class="mapbox" v-if="!toAddcontent">
				<map 
					style="width:750rpx;height:400rpx;"
					name="" 
					id="mapself" 
					:latitude="lat" 
					:longitude="lng" 
					:markers="markers"
					></map>
			</view>
			<view class="locainfo">
				<view class="localeft">
					<image :src="BASE_IMG_URL+'/ydw.png'" class="dingwei" mode="scaleToFill"></image>
					<view class="text">{{address}}</view>
				</view>
			</view>
			<view class="remarkbox" v-if="obj.remarks || obj.imgList.length != 0" @click="addContent">
				<view class="remark_text">{{obj.remarks}}</view>
				<view class="imgbox">
					<image :src="obj.imgList[0].file_path" class="selfimg" mode=""></image>
					<view class="imgnum">{{obj.imgList.length}}</view>
				</view>
			</view>
			<view class="addcontent" v-else @click="addContent">添加备注……</view>
			<view class="clock_box" @click="toClock">
				<view class="time">{{hour}} <span>:</span> {{branch}}</view>
				<view class="status">外出打卡</view>
			</view>
			<!-- 添加备注 -->
			<add-remark ref="remarkChild" @addSuccess="addSuccess" @closeContent="closeContent"></add-remark>
		</view>
		<view class="" v-else>
			<view class="clock_con">
				<view class="top_warp">
					<image :src="BASE_IMG_URL+'/success.png'" class="companyimg" mode=""></image>
					<view class="company">外出打卡成功</view>
				</view>
				<view class="clock_info">
					<view class="li">
						<view class="label">时间</view>
						<view class="time">{{clockTime}}</view>
					</view>
					<view class="li">
						<view class="label">位置</view>
						<view class="time">{{info.address}}</view>
					</view>
					<view class="remarkbox" style="width:460rpx;border:none;padding:0" v-if="obj.remarks || obj.imgList.length != 0">
						<view class="remark_text" style="width:300rpx">备注</view>
						<view class="imgbox">
							<image :src="obj.imgList[0].file_path" class="selfimg" mode=""></image>
							<view class="imgnum">{{obj.imgList.length}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import addRemark from './addRemark.vue'
	import { netOutClock, netLngTransAddress } from '@/api/api.js'
	
	var QQMapWX;
	var qqmapsdk;
	let B;
	export default{
		components:{
			addRemark
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
				markers: [],
				address:'',
				hour:'00',
				branch:'00',
				isClock:true,
				//备注
				obj:{
					remarks:'',
					imgList:[]
				},
				//打卡成功信息
				info:{},
				clockTime:'',  //打卡时间
				mapKey:'',
				toAddcontent:false
			}
		},
		onLoad() {
			
		},
		created() {
			//根据经纬度  或其地址
			this.getAddress()
			//获取当前时间
			this.getTime()
		},
		onUnload() {
			clearInterval(B)
		},
		methods:{
			clear() {
				clearInterval(B)
				// #ifdef MP-WEIXIN
				// wx.offLocationChange()
				// wx.stopLocationUpdate()
				// #endif
			},
			getAddress() {
				this.markers = [{
					id: 1,
					latitude: this.lat,
					longitude: this.lng,
					iconPath: BASE_IMG_URL+'/weizhi.png',
					width: 30,
					height: 30
				}]
				let params = {
					lat: this.lat,
					lng: this.lng
				}
				netLngTransAddress(params).then(res=>{
					this.address = res.data.result.address
				})
			},
			getTime() {
				B = setInterval(()=>{
					let date = new Date()
					let h = date.getHours()
					let b = date.getMinutes()
					this.hour = this.handleTime(h)
					this.branch = this.handleTime(b)
				},1000)
			},
			//添加备注
			addContent() {
				this.$refs.remarkChild.init(this.obj)
				this.toAddcontent = true
			},
			addSuccess(obj) {
				this.obj = obj
				this.toAddcontent = false
			},
			closeContent() {
				this.toAddcontent = false
			},
			//打卡
			toClock() {
				let arr = []
				let b = this.obj.imgList
				b.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					type:1,
					address:this.address,
					type_name:2,
					lng:this.lng,
					lat:this.lat,
					remarks:this.obj.remarks,
					file_ids:arr.join(',')
				}
				netOutClock(params).then(res=>{
					this.isClock = false
					this.info = res.data
					let time = res.data.time
					this.clockTime = time.substring(time.length-8,time.length)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.clock_con{
		margin:24rpx auto;
		width:690rpx;
		height:calc(100vh - 210rpx);
		background:#fff;
		border-radius: 10rpx;
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
			.company{
				font-size:26rpx;
				color:$uni-text-color;
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
	}
	.out_warp{
		width:750rpx;
		height:calc(100vh - 210rpx);
		background:#fff;
	}
	.mapbox {
		width: 750rpx;
		height: 400rpx;
		overflow: hidden;
	}
	.locainfo {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-bottom:1rpx solid #f5f5f5;
		.localeft {
			display: flex;
			justify-content: flex-start;
			align-items: center;
	
			.dingwei {
				width: 44rpx;
				height: 44rpx;
				margin-right: 15rpx;
			}
	
			.text {
				font-size: 26rpx;
				color: #333;
			}
		}
	}
	.addcontent{
		font-size:24rpx;
		text-align: center;
		color:$uni-text-color;
		width:750rpx;
		background:#fff;
		padding:24rpx 0;
		border-bottom:1rpx solid #f5f5f5;
	}
	.remarkbox{
		width:690rpx;
		margin:24rpx auto;
		border:1rpx solid #f5f5f5;
		padding:15rpx;
		display: flex;
		justify-content:space-between;
		align-items: center;
		.remark_text{
			width:500rpx;
			font-size:24rpx;
			line-height: 34rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.imgbox{
			width:100rpx;
			height:100rpx;
			position: relative;
			.selfimg{
				width:100rpx;
				height:100rpx;
			}
			.imgnum{
				position: absolute;
				right:0;
				bottom:0;
				width:30rpx;
				height:30rpx;
				background:rgba(0,0,0,0.5);
				font-size:24rpx;
				text-align: center;
				line-height: 30rpx;
				color:#fff;
			}
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
		margin:80rpx auto;
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