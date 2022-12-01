<template>
	<view class="period_warp">
		<view class="" v-for="(item,index) in timeArr" :key="index">
			<view class="title">上下班时段{{index+1}}</view>
			<view class="box_list">
				<view class="box_li">
					<view class="b_time">
						<view class="b_label">上班</view>
						<picker @change="(e)=>{changeGoto(e,index)}" mode="time" :value="item.start_time" >
							<view class="b_v_box">
								<view class="b_value"> <text v-if="item.start_next == 1">次日</text> {{item.start_time}}</view>
								<view class="iconfont icon-arrows_right"></view>
							</view>
						</picker>
					</view>
					<view class="b_time">
						<view class="b_label">需要打卡</view>
						<view class="b_v_box">
							<switch color="#008EFF" :checked="item.start_status == 0" @change="(e)=>{changeStart(e,index)}" />
						</view>
					</view>
					<view class="b_time">
						<view class="b_label">可打卡时间</view>
						<view class="b_v_box">
							<picker @change="(e)=>{changeGotoStart(e,index)}" mode="time" :value="item.ustart_time" :start="index <= 0 ? '' : timeArr[index-1].end_time" :end="item.end_time">
								<view class="minbox"> <text v-if="item.start_next == 1">次日</text> {{item.ustart_time}}</view>
							</picker>
							至
							<picker @change="(e)=>{changeGotoEnd(e,index)}" mode="time" :value="item.uend_time" :start="item.ustart_time" :end="item.start_next == 1 ?'':item.end_time">
								<view class="minbox"> <text v-if="item.start_next == 1">次日</text> {{item.uend_time}}</view>
							</picker>
						</view>
					</view>
				</view>
				<view class="box_li">
					<view class="b_time">
						<view class="b_label">下班</view>
						<picker @change="(e)=>{changeGoOff(e,index)}" mode="time" :value="item.end_time">
							<view class="b_v_box">
								<view class="b_value"><text v-if="item.end_next == 1">次日</text> {{item.end_time}}</view>
								<view class="iconfont icon-arrows_right"></view>
							</view>
						</picker>
					</view>
					<view class="b_time">
						<view class="b_label">需要打卡</view>
						<view class="b_v_box">
							<switch color="#008EFF" :checked="item.end_status == 0" @change="(e)=>{changeEnd(e,index)}" />
						</view>
					</view>
					<view class="b_time">
						<view class="b_label">可打卡时间</view>
						<view class="b_v_box">
							<picker @change="(e)=>{changeGoOffStart(e,index)}" mode="time" :value="item.dstart_time" :start="item.end_next == 1 ? '' : item.end_time">
								<view class="minbox"> <text v-if="item.end_next == 1">次日</text> {{item.dstart_time}}</view>
							</picker>
							至
							<picker @change="(e)=>{changeGoOffEnd(e,index)}" mode="time" :value="item.dend_time">
								<view class="minbox"> <text v-if="item.end_next == 1">次日</text> {{item.dend_time}}</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(toSave)">
			确定
		</view>
	</view>
</template>

<script>
	
	export default{
		data() {
			return{
				noClick: true, //防止  重复点击
				timeArr:[]
			}
		},
		onLoad() {
			this.timeArr = uni.getStorageSync('timeArr')
			console.log(this.timeArr,'====')
		},
		methods:{
			//选择上班时间
			changeGoto(e,index) {
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
			//选择上班时间的开始打卡时间
			changeGotoStart(e,index) {
				let time = e.detail.value
				let obj = this.timeArr[index]
				obj.ustart_time = time
				this.$set(this.timeArr,index,obj)
			},
			//选择上班时间的结束打卡时间
			changeGotoEnd(e,index) {
				let time = e.detail.value
				let obj = this.timeArr[index]
				obj.uend_time = time
				this.$set(this.timeArr,index,obj)
			},
			//选择上班时间  是否  需要打卡
			changeStart(e,index) {
				console.log(e,'=====')
				let num = e.detail.value ? 0 : 1
				let obj = this.timeArr[index]
				obj.start_status = num
				this.$set(this.timeArr,index,obj)
			},
			//选择下班时间
			changeGoOff(e,index){
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
			//选择下班时间的 开始打卡时间
			changeGoOffStart(e,index) {
				let time = e.detail.value
				let obj = this.timeArr[index]
				obj.dstart_time = time
				this.$set(this.timeArr,index,obj)
			},
			//选择下班时间的  结束打卡时间
			changeGoOffEnd(e,index) {
				let time = e.detail.value
				let obj = this.timeArr[index]
				obj.dend_time = time
				this.$set(this.timeArr,index,obj)
				if(obj.end_next == 1 && this.timeArr[0].start_next == 0){
					if(!this.handleSameday(this.timeArr[0].ustart_time,time)){
						uni.showModal({
							title:'提示',
							content:'上班打卡时间和下班打卡时间须在24小时之内',
							complete:(res)=>{
								
							}
						})
					}
				}
			},
			//选择下班时间  是否需要打卡
			changeEnd(e,index) {
				let num = e.detail.value ? 0 : 1
				let obj = this.timeArr[index]
				obj.end_status = num
				this.$set(this.timeArr,index,obj)
			},
			toSave() {
				uni.setStorageSync('timeArr',this.timeArr)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.period_warp{
		padding:24rpx 30rpx;
	}
	.title{
		font-size:24rpx;
		color:#999;
		margin-bottom:10rpx;
	}
	.box_list{
		.box_li{
			width:690rpx;
			border-radius: 10rpx;
			background:#fff;
			margin-bottom:15rpx;
			padding:0 24rpx;
			.b_time{
				padding:24rpx 0;
				border-bottom:1rpx solid #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom: 0;
				}
				.b_label{
					font-size:28rpx;
					color:#333;
					flex-shrink: 0;
				}
				.b_v_box{
					width:300rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.b_value{
						font-size:24rpx;
						color:#666;
						display: flex;
						justify-content: flex-end;
						align-items: center;
					}
					switch{
						transform: scale(0.6);
					}
					.minbox{
						width:140rpx;
						height:60rpx;
						border-radius: 8rpx;
						background:#f5f5f5;
						text-align: center;
						line-height: 60rpx;
						margin-right:15rpx;
						margin-left:15rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
	}
</style>