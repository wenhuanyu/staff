<template>
	<view class="timebox">
		<view class="title">选择星期</view>
		<view class="week_warp">
			<view class="week_li" :class="{'week_li_no':item.isSet,'week_li_ac':item.select}"
				v-for="(item,index) in arr" :key="index" @click="selectWeek(index)">
				{{item.name}}
			</view>
		</view>
		<!-- 设置打卡时段 -->
		<view class="t_warp">
			<view class="t_tit">设置打卡时段</view>
			<view class="t_add" @click="toAddClock">添加时段</view>
		</view>
		<view class="box_list">
			<view class="box_li" v-for="(item,index) in timeArr" :key="index">
				<view class="b_top">
					<view class="b_p">上下班时段 <text v-if="timeArr.length > 1">{{index+1}}</text> </view>
					<image :src="BASE_IMG_URL+'/delete1.png'" v-if="timeArr.length > 1" @click="delClock(index)"
						class="deleimg" mode=""></image>
				</view>
				<view class="b_bot">
					<view class="b_time">
						<view class="b_label">上班</view>
						<picker @change="(e)=>{changeGoto(e,index)}" mode="time" :value="item.start_time">
							<view class="b_v_box">
								<view class="b_value"> <text v-if="item.start_next == 1">次日</text> {{item.start_time}}
								</view>
								<view class="iconfont icon-arrows_right"></view>
							</view>
						</picker>
					</view>
					<view class="b_time">
						<view class="b_label">下班</view>
						<picker @change="(e)=>{changeGoOff(e,index)}" mode="time" :value="item.end_time">
							<view class="b_v_box">
								<view class="b_value"> <text v-if="item.end_next == 1">次日</text> {{item.end_time}}
								</view>
								<view class="iconfont icon-arrows_right"></view>
							</view>
						</picker>
					</view>
				</view>
			</view>
		</view>

		<view class="box_list">
			<view class="box_li">
				<view class="b_bot">
					<view class="b_time">
						<view class="b_label">打卡时段设置</view>
						<view class="b_v_box" @click="toSetPeriod">
							<view class="b_value">{{timeArr[0].ustart_time}}至{{timeArr[timeArr.length-1].dend_time}}
							</view>
							<view class="iconfont icon-arrows_right"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tip">可设置每次上下班是否需要打卡、允许打卡的时间范围</view>
		<view class="botwarp" v-if="number">
			<view class="b_bot remove" @click="$noMultipleClicks(sureDel)">删除</view>
			<view class="b_bot" @click="$noMultipleClicks(toSave)">确认修改</view>
		</view>
		<view v-else class="button" @click="$noMultipleClicks(toSave)">
			确定
		</view>

	</view>
</template>

<script>
	import {
		BASE_IMG_URL
	} from '@/api/http.js'
	import {
		netAddTimeSlot,
		netisSetTimeslot,
		netTimeSlotDetail,
		netEditTimeSlot,
		netDelTimeSlot
	} from '@/api/api.js'

	export default {
		data() {
			return {
				noClick: true, //防止  重复点击
				BASE_IMG_URL: BASE_IMG_URL,
				arr: [{
						name: '一',
						isSet: false,
						select: true,
						en: 'monday'
					},
					{
						name: '二',
						isSet: false,
						select: true,
						en: 'tuesday'
					},
					{
						name: '三',
						isSet: false,
						select: true,
						en: 'wednesday'
					},
					{
						name: '四',
						isSet: false,
						select: true,
						en: 'thursday'
					},
					{
						name: '五',
						isSet: false,
						select: true,
						en: 'friday'
					},
					{
						name: '六',
						isSet: false,
						select: false,
						en: 'saturday'
					},
					{
						name: '日',
						isSet: false,
						select: false,
						en: 'weekday'
					}
				],
				//next 0 非次日 1：次日     status 0:开启  1：关闭
				timeArr: [{
					start_time: '09:00',
					ustart_time: '07:59',
					uend_time: '08:59',
					start_next: 0,
					start_status: 0,
					end_time: '17:00',
					dstart_time: '17:01',
					dend_time: '17:59',
					end_next: 0,
					end_status: 0
				}],
				isProblem: false,
				problemTit: '',
				number: null
			}
		},
		onLoad(options) {
			if (options.number) {
				this.number = options.number

			}
			uni.removeStorageSync('timeArr')
			//判断已经设置了的星期
			this.getData()
		},
		onShow() {
			if (uni.getStorageSync('timeArr')) {
				this.timeArr = uni.getStorageSync('timeArr')
			}
		},
		methods: {
			//获取详情
			getDetail() {
				netTimeSlotDetail({
					number: this.number
				}).then(res => {
					res = res.data
					this.timeArr = res.time
					let arr = this.arr
					arr.forEach(ele => {
						if (res[ele.en] == 1 && ele.isSet) {
							ele.isSet = false
							ele.select = true
						}
					})
					this.arr = arr
				})
			},
			getData() {
				netisSetTimeslot().then(res => {
					res = res.data
					let arr = this.arr

					for (let key in res) {
						arr.forEach((ele, index) => {
							if (ele.en == key) {
								ele.isSet = res[key] == 1 ? true : false
							}
							ele.select = false
						})
					}
					this.arr = arr
					if (this.number) {
						//获取详情
						this.getDetail()
					}
				})
			},
			selectWeek(index) {
				let obj = this.arr[index]
				if (!obj.isSet) {
					obj.select = !obj.select
					this.$set(this.arr, index, obj)
				}
			},
			//添加时间段
			toAddClock() {
				let obj = this.timeArr[this.timeArr.length - 1]
				let start = Number(obj.end_time.substring(0, 2))
				let s = null
				let e = null
				let sNext = 0
				let eNext = 0
				let us,un,ds,dn;
				if (start == 23) {
					s = '00'
					e = '01'
					sNext = 1
					eNext = 1
					us = '22:59'
					un = '01:59'
					ds = '01:01'
					dn = '01:59'
				} else if (s < 23 && obj.end_next == 0) {
					s = this.handleTime(start + 1)
					e = this.handleTime(start + 2)
					
					us = this.handleTime(start - 1)+':59'
					un = this.handleTime(start)+':59'
					ds = this.handleTime(start + 2)+':01'
					dn = this.handleTime(start + 2)+':59'
					
				} else if (s < 23 && obj.end_next == 1) {
					s = this.handleTime(start + 1)
					e = this.handleTime(start + 2)
					sNext = 1
					eNext = 1
					us = this.handleTime(start - 1)+':59'
					un = this.handleTime(start)+':59'
					ds = this.handleTime(start + 2)+':01'
					dn = this.handleTime(start + 2)+':59'
				}
				let newObj = {
					start_time: s + ':00',
					start_next: sNext,
					ustart_time: us,
					uend_time: un,
					end_time: e + ':00',
					dstart_time: ds,
					dend_time: dn,
					end_next: eNext,
					start_status: 0,
					end_status: 0,
				}
				this.timeArr.push(newObj)
			},
			//删除时间段
			delClock(index) {
				this.timeArr.splice(index, 1)
			},
			//上班时间选择
			changeGoto(e, index) {
				let time = e.detail.value
				let obj = this.timeArr[index]
				obj.start_time = time
				if (obj.end_next != 1) {
					let a = obj.start_time.split(":")
					let b = obj.end_time.split(":")
					let date = new Date();
					if (date.setHours(a[0], a[1]) > date.setHours(b[0], b[1])) {
						uni.showToast({
							title: '上班时间应该早于下班时间',
							icon: 'none'
						})
						this.isProblem = true
						this.problemTit = '上班时间应该早于下班时间'
					} else {
						this.isProblem = false
						this.problemTit = ''
					}
					if (index != 0) {
						let preObj = this.timeArr[index - 1]
						if (time < preObj.end_time) {
							obj.start_next = 1
							obj.end_next = 1
						}
					}
				} else if(obj.end_next == 1){
					if (index > 0) {
						let preObj = this.timeArr[index - 1]
						let a = obj.start_time.split(":")
						let b = preObj.end_time.split(":")
						let date_1 = new Date();
						if (date_1.setHours(a[0], a[1]) < date_1.setHours(b[0], b[1])) {
							uni.showToast({
								title: '上班时间应该大于上一段的下班时间',
								icon: 'none'
							})
							this.isProblem = true
							this.problemTit = '上班时间应该大于上一段的下班时间'
						} else{
							obj.start_next = 0
							this.isProblem = true
							this.problemTit = ''
						}
					}
				}
				this.$set(this.timeArr, index, obj)
			},
			//下班时间选择
			changeGoOff(e, index) {
				let time = e.detail.value
				let obj = this.timeArr[index]
				obj.end_time = time
				let a = obj.start_time.split(":")
				let b = obj.end_time.split(":")
				let date = new Date();
				//判断是否次日
				if(obj.start_next == 0 && obj.end_next == 0 && date.setHours(a[0], a[1]) > date.setHours(b[0], b[1])){
					obj.end_next = 1
				}
				//判断上班时间 和  下班时间
				if((obj.start_next == 1 && obj.end_next == 1) || (obj.start_next == 0 && obj.end_next == 0)){
					if (date.setHours(a[0], a[1]) > date.setHours(b[0], b[1])) {
						uni.showToast({
							title: '上班时间应该早于下班时间',
							icon: 'none'
						})
						this.isProblem = true
						this.problemTit = '上班时间应该早于下班时间'
					} else {
						this.isProblem = false
						this.problemTit = ''
					}
				}
				//判断所有时间段是否在24小时之内
				if (obj.end_next == 1 && this.timeArr[0].start_next == 0) {
					let sTime = this.timeArr[0].start_time
					let nTime = time
					if(!this.handleSameday(sTime,nTime)){
						uni.showModal({
							title:'提示',
							content:'最早上班时间与最晚下班时间跨度不能超过24小时',
							showCancel:false,
							complete:(res)=>{
								if(res.confirm){
									this.isProblem = true
									this.problemTit = '最早上班时间与最晚下班时间跨度不能超过24小时'
								}
							}
						})
					}
				}
				this.$set(this.timeArr, index, obj)
			},
			//计算当天 和  次日 两个时间段的  时间差是否在24小时之内
			handleSameday(startTime, endTime) {
				if (!(startTime && endTime)) return "";
				let start1 = startTime.split(":");
				let startAll = parseInt(start1[0] * 60) + parseInt(start1[1]);
				let end1 = endTime.split(":");
				let endAll = parseInt(end1[0] * 60) + parseInt(end1[1]);
				let total = 24*60
				let sum = total - startAll + endAll
				if(sum > total){
					return false
				}else{
					return true
				}
			},
			//打卡时间段设置
			toSetPeriod() {
				uni.setStorageSync('timeArr', this.timeArr)
				uni.navigateTo({
					url: '/pagesB/punchclock/clockrules/clockPeriod'
				})
			},
			toSave() {
				let params = {}
				let num = 0
				this.arr.forEach(ele => {
					if (ele.isSet) {
						num++
						params[ele.en] = 0
					} else {
						params[ele.en] = ele.select ? 1 : 0
					}
				})
				if (num >= 7) {
					uni.showToast({
						title: '周一至周日已全部设置',
						icon: 'none'
					})
					return
				}
				let number = 0
				this.arr.forEach(item => {
					if (item.select) {
						number++
					}
				})
				if (number <= 0) {
					uni.showToast({
						title: '请选择需要设置的星期',
						icon: 'none'
					})
					return
				}
				params.time = this.timeArr
				console.log(params)
				if (this.number) {
					params.number = this.number
					netEditTimeSlot(params).then(res => {
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
				} else {
					netAddTimeSlot(params).then(res => {
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
			},
			//删除
			sureDel() {
				uni.showModal({
					title: '提示',
					content: '请确认是否删除?',
					complete: (data) => {
						if (data.confirm) {
							netDelTimeSlot({
								number: this.number
							}).then(res => {
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
				})
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
	.timebox {
		padding: 24rpx 30rpx;

		.title {
			font-size: 30rpx;
			color: #333;
			margin-bottom: 15rpx;
		}

		.week_warp {
			width: 690rpx;
			border-radius: 10rpx;
			height: 80rpx;
			background: #fff;
			padding: 0 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.week_li {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				font-size: 24rpx;
				color: #333;
				text-align: center;
				line-height: 58rpx;
				border: 1rpx solid #f5f5f5;
			}

			.week_li_no {
				background: #f5f5f5;
				color: #666;
			}

			.week_li_ac {
				background: $uni-text-color;
				color: #fff;
			}
		}
	}

	.t_warp {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 30rpx 0 14rpx;

		.t_tit {
			font-size: 30rpx;
			color: #333;
		}

		.t_add {
			font-size: 24rpx;
			color: $uni-text-color;
		}
	}

	.box_list {
		.box_li {
			width: 690rpx;
			border-radius: 10rpx;
			background: #fff;
			margin-bottom: 15rpx;

			.b_top {
				padding: 24rpx;
				border-bottom: 1rpx solid #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.b_p {
					font-size: 24rpx;
					color: #999;
				}

				.deleimg {
					width: 30rpx;
					height: 30rpx;
				}

				switch {
					transform: scale(0.7);
				}
			}

			.b_bot {
				padding: 0 24rpx;

				.b_time {
					padding: 24rpx 0;
					border-bottom: 1rpx solid #f5f5f5;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.b_label {
						font-size: 28rpx;
						color: #333;
						flex-shrink: 0;
					}

					.b_v_box {
						width: 300rpx;
						display: flex;
						justify-content: flex-end;
						align-items: center;

						.b_value {
							font-size: 24rpx;
							color: #666;
							display: flex;
							justify-content: flex-end;
							align-items: center;
						}
					}
				}
			}
		}
	}

	.tip {
		font-size: 22rpx;
		color: #999;
	}

	.botwarp {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 100rpx;

		.b_bot {
			width: 300rpx;
			height: 80rpx;
			border-radius: 40rpx;
			font-size: 24rpx;
			text-align: center;
			line-height: 80rpx;
			background: $uni-text-color;
			color: #fff;
		}

		.remove {
			background: #ff7800;
		}
	}
</style>
