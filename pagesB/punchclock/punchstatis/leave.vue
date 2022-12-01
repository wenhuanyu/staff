<template>
	<view class="">
		<view class="inp_warp">
			<view class="inp_title key">请假类型<span>*</span></view>
			<picker @change="changeType" :range="arr" :value="arrIndex">
				<view class="form_right">
					<view :class="arr[arrIndex] ? 'valueActive' : '' ">{{arr[arrIndex] ? arr[arrIndex] : '请假类型'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开始时间<span>*</span></view>
			<picker @change="changeStartTime" @columnchange="changeColumn" mode="multiSelector" :range="dateTimeArray" :value="dateTime">
				<view class="form_right">
					<view :class="start_time ? 'valueActive' : '' ">{{start_time ? start_time : '开始时间'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">结束时间<span>*</span></view>
			<picker @change="changeEndTime" @columnchange="changeColumn" mode="multiSelector" :range="dateTimeArray" :value="dateTime">
				<view class="form_right">
					<view :class="end_time ? 'valueActive' : '' ">{{end_time ? end_time : '结束时间'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">请假时长<span>*</span></view>
			<view class="form_right">
				<view :class="hour ? 'valueActive' : '' ">{{hour ? hour : '请假时长(小时)'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head key">请假事由<span>*</span></view>
			<textarea
				maxlength="-1" 
				:class="remarks ? 'valueActive' : '' " 
				v-model="remarks"
				placeholder="请假事由" 
				placeholder-style="color:#999;font-size:24rpx;" />
		</view>
		<!-- 上传图片 -->
		<upload-image
			:imgList="imgList" 
			@uploadImg="uploadImg" 
			@delImg="delImg"
			:flag="false"
		></upload-image>
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 审核信息 -->
		<examine-people v-if="approvalPro.status == 0" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(toSave)">
			保存
		</view>
		
	</view>
</template>

<script>
	import { netApprovalProcess, netApplyLeave, netLeaveDuration } from '@/api/api.js'
	import { dateTimePicker } from '@/utils/dateTimePicker.js'
	import uploadImage from "@/components/uploadImg/index.vue"
	import { commonFun } from '@/common/navigate'
	
	export default{
		mixins:[commonFun],
		components:{
			uploadImage
		},
		data() {
			return{
				noClick: true, //防止  重复点击
				arr:['年假', '事假', '病假', '调休假', '婚假', '产假', '陪产假', '其他'],
				arrIndex:null,
				start_time:'',
				end_time:'',
				hour:'',
				remarks:'',
				imgList:[],
				approvalPro:{},
				dateTimeArray: [],
				dateArr: [],
				dateTime: [],
				remindPeople:[],
				examineType:'leave',
			}
		},
		onLoad() {
			this.getProcess()
			this.initTime()
		},
		onShow() {
			if(this.approvalPro.status == 0){
				this.getDefaultRemind()
			}
		},
		methods:{
			changeType(e) {
				this.arrIndex = e.detail.value
			},
			//图片
			uploadImg(obj){
				this.imgList.push(obj)
			},
			delImg(index) {
				this.imgList.splice(index,1)
			},
			changeStartTime(e) {
				this.start_time = this.handleTime(e.detail.value)
				if(this.start_time && this.end_time){
					this.handleDuration()
				}
			},
			changeEndTime(e) {
				this.end_time = this.handleTime(e.detail.value)
				if(this.start_time && this.end_time){
					this.handleDuration()
				}
			},
			handleDuration(){
				let params = {
					start_time:this.start_time,
					end_time:this.end_time
				}
				netLeaveDuration(params).then(res=>{
					this.hour = res.data.hour
				})
			},
			withData(param) {
				return param < 10 ? '0' + param : '' + param;
			},
			initTime() {
				let date = new Date()
				let endYear = date.getFullYear()
				let mont = this.withData(date.getMonth() + 1)
				let day = this.withData(date.getDate())
				let hour = this.withData(date.getHours())
				let minu = this.withData(date.getMinutes())
				let seco = this.withData(date.getSeconds())
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let obj = dateTimePicker();
				// 精确到分的处理，将数组的秒去掉
				let lastArray = obj.dateTimeArray.pop();
				let lastTime = obj.dateTime.pop();
				let lastDate = obj.dateArray.pop()
				this.dateTimeArray = obj.dateTimeArray
				this.dateArr = obj.dateArray
				this.dateTime = obj.dateTime
			},
			changeColumn(e) {
				let index = e.detail.column
				let value = e.detail.value
				if (index == 1) {
					let month = this.dateArr[index][value]
					let date = new Date();
					let endYear = date.getFullYear();
					let str = endYear + '-' + month + '-' + '01' + ' ' + '00' + ':' + '00' + ':' + '00'
					let obj = dateTimePicker();
					
					// 精确到分的处理，将数组的秒去掉
					let lastArray = obj.dateTimeArray.pop();
					let lastTime = obj.dateTime.pop();
					let lastDate = obj.dateArray.pop()
					this.dateTimeArray = obj.dateTimeArray
					this.dateArr = obj.dateArray
					this.dateTime = obj.dateTime
				}
			},
			handleTime(arr) {
				let year = this.dateArr[0][arr[0]]
				let month = this.dateArr[1][arr[1]]
				let day = this.dateArr[2][arr[2]]
				let hour = this.dateArr[3][arr[3]]
				let minu = this.dateArr[4][arr[4]]
				let str = year + '-' + month + '-' + day + ' ' + hour + ':' + minu
				return str
			},
			//审批流程
			getProcess() {
				netApprovalProcess({type:'leave'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						this.getDefaultRemind()
					}
				})
			},
			toSave() {
				if(!this.arr[this.arrIndex]){
					uni.showToast({
						title:'请选择请假类型',
						icon:'none'
					})
					return
				}
				if(!this.start_time){
					uni.showToast({
						title:'请选择请假开始时间',
						icon:'none'
					})
					return
				}
				if(!this.end_time){
					uni.showToast({
						title:'请选择请假结束时间',
						icon:'none'
					})
					return
				}
				if(this.hour <= 0){
					uni.showToast({
						title:'请填写请假时长',
						icon:'none'
					})
					return
				}
				if(!this.remarks){
					uni.showToast({
						title:'请填写请假事由',
						icon:'none'
					})
					return
				}
				if (this.remindPeople.length == 0 && this.approvalPro.status == 0) {
					uni.showToast({
						title: '请选择审核人',
						icon: 'none'
					})
					return
				}
				let b = []
				this.remindPeople.forEach(ele => {
					b.push(ele.id)
				})
				
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				
				let params = {
					type:this.arr[this.arrIndex],
					start_time:this.start_time,
					end_time:this.end_time,
					remarks:this.remarks,
					hour:this.hour,
					file_ids:arr.join(','),
					flow_staff_ids:this.approvalPro.status == 0 ? b.join(',') : ''
				}
				netApplyLeave(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color:#666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			.rightinput{
				font-size:24rpx;
				width:100%;
				text-align: right;
			}
			.right_btn{
				font-size:24rpx;
				color:$uni-text-color;
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			.icon-jiahaocu{
				font-size:28rpx;
				color:$uni-text-color;
				margin-right:5rpx;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding: 30rpx 20rpx;
		padding-bottom: 30rpx;
		color: #999;
		font-size: 32rpx;
		.area_head {
			margin-bottom:24rpx;
		}
		textarea {
		    width: 80%;
		    height: 300rpx;
		    padding: 30rpx;
		    background: #f8f8f8;
		    margin: 0 auto;
		}
	}
</style>