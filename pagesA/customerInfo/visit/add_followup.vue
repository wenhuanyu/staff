<template>
	<view>
		<view style="background:#fff;">
			<view class="inp_warp">
				<view class="inp_title key">拜访客户:</view>
				<view class="form_right">
					<view :class="customer_name ? 'valueActive' : '' " >
						{{customer_name ? customer_name : '点击选择'}}</view>
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title key">跟进类型:<span>*</span></view>
				<view class="form_right">
					<picker @change="changeType" :range="typeList" :value="typeIndex">
						<view class="form_right">
							<view :class="typeList[typeIndex] ? 'valueActive' : '' ">
								{{typeList[typeIndex] ? typeList[typeIndex] : '选择计划类型'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title key">客户状态:<span>*</span></view>
				<view class="form_right">
					<picker @change="changeStatus" :range="statusArr" :value="statusIndex">
						<view class="form_right">
							<view :class="statusArr[statusIndex] ? 'valueActive' : '' ">
								{{statusArr[statusIndex] ? statusArr[statusIndex] : '选择客户状态'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title key">下次跟进时间</view>
				<picker  @change="changeTime" mode="multiSelector" :range="dateTimeArray" :value="dateTime">
					<view class="form_right">
						<view :class="next_time ? 'valueActive' : '' ">{{next_time ? next_time : '点击选择'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</picker>
			</view>
			<view class="fllow_area">
				<view class="area_head key">跟进内容:<span>*</span></view>
				<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="跟进内容"
					placeholder-style="color:#999" />
			</view>
			<!-- 附件 -->
			<upload-img :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
			<!-- 审核信息 -->
			<examine-people title="提醒人" :list="remindPeople" @delItem="delItem"></examine-people>
		</view>
		<view style="height:100rpx"></view>
		<view class="savebox">
			<view class="button" @click="$noMultipleClicks(toAdd)">保存</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netAddFollowRecords, netCustomerDetail, netSelect } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { dateTimePicker, getMonthDay } from '@/utils/dateTimePicker.js'
	export default {
		mixins:[commonFun],
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				noClick: true, //防止  重复点击
				longitude: null,
				latitude: null,
				markers: [],
				address: '',
				imgList: [],
				remindPeople: [], //提醒谁看
				examineType:'record',
				location: '', //地址 
				lng: '',
				lat: '',
				files: '',
				content: '',
				typeList:['微信','邮件','电话'],
				typeIndex:0,
				customerid:'',   //客户id
				customer_name:'',
				relation_type:1,   //1 客户  
				//时间
				dateTime: null,
				dateTimeArray: null,
				dateArr: null,
				next_time:'',
				statusArr:[],   //客户状态
				statusIndex:null,  
			}
		},
		onLoad(options) {
			this.customerid = options.customerid
			// this.relation_type = options.type
			//获取位置
			// this.getAddressinfo()
			//获取 客户信息
			this.getDetail()
			this.initTime()
			//获取跟进类型
			this.getOption()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
		},
		onUnload() {
			uni.removeStorageSync('remindlist')
		},
		methods: {
			changeStatus(e) {
				this.statusIndex = e.detail.value
			},
			//获取跟进类型
			getOption() {
				netSelect().then(res=>{
					this.typeList = res.data.other['跟进类型']
					this.statusArr = res.data.customer['客户状态']
				})
			},
			initTime() {
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let obj = dateTimePicker()
				// 精确到分的处理，将数组的秒去掉
				let lastArray = obj.dateTimeArray.pop();
				let lastTime = obj.dateTime.pop();
				let lastDate = obj.dateArray.pop()
			
				this.dateTimeArray = obj.dateTimeArray
				this.dateTime = obj.dateTime
				this.dateArr = obj.dateArray
			},
			handleTime(arr) {
				let year = this.dateArr[0][arr[0]]
				let month = this.dateArr[1][arr[1]]
				let day = this.dateArr[2][arr[2]]
				let hour = this.dateArr[3][arr[3]]
				let minu = this.dateArr[4][arr[4]]
				let str = year + '-' + month + '-' + day +' '+hour+':'+minu
				return str
			},
			//跟进时间
			changeTime(e) {
				let arr = e.detail.value
				let str = this.handleTime(arr)
				this.next_time = str
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			getDetail() {
				netCustomerDetail({id:this.customerid}).then(res=>{
					this.customer_name = res.data.name
				})
			},
			changeType(e) {
				this.typeIndex = e.detail.value
			},
			//保存
			toAdd() {
				if (!this.content) {
					uni.showToast({
						title: '请填写跟进内容',
						icon: 'none'
					})
					return
				}
				let files = ''
				let arr = []
				this.imgList.forEach(item => {
					arr.push(item.id)
				})
				files = arr.join(',')
				
				let remindsid = '' //提醒谁看
				let remarr = []
				this.remindPeople.forEach(ele => {
					remarr.push(ele.id)
				})
				remindsid = remarr.join(',')
				let params = {
					relation_type:this.relation_type,
					relation_id:this.customerid,
					files:files,
					content:this.content,
					reminds_id:remindsid,
					customer_id:this.customerid,
					follow_type:this.typeList[this.typeIndex],
					next_time:this.next_time,
					follow:this.statusArr[this.statusIndex]?this.statusArr[this.statusIndex]:''
				}
				netAddFollowRecords(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})
			}
		}
	}
</script>
<style>
	radio{
		transform: scale(0.6);
	}
</style>

<style lang="scss" scoped>
	.valueActive {
		color: #333;
	}
	.mapbox {
		width: 100%;
		height: 400rpx;

		#mapself {
			width: 100%;
			height: 400rpx;
		}
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
				width: 30rpx;
				height: 30rpx;
				margin-right: 15rpx;
			}

			.text {
				font-size: 26rpx;
				color: #333;
			}
		}

		.locaright {
			font-size: 26rpx;
			color: #007AFF;
		}
	}

	.inp_warp {
		padding: 30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #CCC;
		.inp_title {
			font-size: 26rpx;
			color: #666;
		}

		.form_right {
			display: flex;
			color: #999;

			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.radiobox{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}

	.fllow_area {
		background: #fff;
		padding: 20rpx 30rpx;
		.area_head {
			margin:15rpx 0 35rpx;
			color:#666;
		}
		textarea {
			width: 670rpx;
			background: #f5f5f5;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 0 auto;
			box-sizing: border-box;
		}
	}

	.savebox {
		width: 750rpx;
		height: 120rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1rpx solid #CCC;
		z-index: 2;
	}

	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		.imgbox {
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EAEAEA;
			&:nth-child(3n){
				margin-right:0;
			}
			.delimg {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				position: absolute;
				right: -16rpx;
				top: -16rpx;
				background: rgba(0, 0, 0, 0.5);
				z-index: 2;
			}

			.selfimg {
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
</style>
