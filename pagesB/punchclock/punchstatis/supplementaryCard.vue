<template>
	<view class="">
		<view class="fllow_form">
			<view><text>*</text>补卡原因</view>
			<view class="form_input">
				<view class="valueActive">
					{{type == 0 ? '补卡打卡' : type == 1 ? '早退打卡' : '迟到打卡'}} <text v-if="clockTime">({{clockTime}})</text>
				</view>
			</view>
		</view>
		<view class="fllow_form">
			<view><text>*</text>补卡时间</view>
			<picker @change="changeTime" mode="time" :value="time">
				<view class="form_right">
					<view :class="dayTime ? 'valueActive' : '' ">{{dayTime}} {{time ? time : '补卡时间'}}</view>
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_area">
			<view class="area_head">
				<text class="b_color">*</text>补卡事由
			</view>
			<textarea
				maxlength="-1" 
				:class="remark ? 'valueActive' : '' " 
				v-model="remark"
				placeholder="补卡事由" 
				placeholder-style="color:#999;font-size:32rpx;" />
		</view>
		<!-- 上传图片 -->
		<upload-img
			:imgList="imgList" 
			@uploadImg="uploadImg" 
			@delImg="delImg"
			:flag="false"
		></upload-img>
		
		<!-- 固定审批 -->
		<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
		<!-- 审核信息 -->
		<examine-people v-if="approvalPro.status == 0" :remindPeople="remindPeople" @delExamine="delRemind"></examine-people>
		<view class="button" @click="$noMultipleClicks(toSave)">
			保存
		</view>
	</view>
</template>

<script>
	import { netCheckworkDetail, netApprovalProcess, netSupplementClock } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick: true, //防止  重复点击
				approvalPro:{},
				remindPeople:[],
				examineType:'',
				imgList:[],
				statisc_id:'',   //打卡id
				clockTime:'',   //打卡时间
				dayTime:'',    //年月日
				time:'',     //时分秒
				checkInfo:{},   //考勤详情
				type:'',   //0:补卡 1：早退 2：迟到
				title:'',
				remark:'',
				file_ids:''
			}
		},
		onLoad(options) {
			this.statisc_id = options.id
			this.type = options.type
			let time = options.time
			this.clockTime = time.substring(time.length-8,time.length-3)
			//获取 补卡/早退/迟到时间
			this.getTime()
			//获取审批流程
			this.getProcess()
		},
		onShow() {
			if(this.approvalPro.status == 0){
				this.getDefaultRemind()
			}
		},
		methods:{
			getTime() {
				netCheckworkDetail({statisc_id:this.statisc_id}).then(res=>{
					res = res.data
					this.checkInfo = res
					this.dayTime = res.time
					if(this.type == 1) {
						this.time = res.end_time
					}else if(this.type == 2){
						this.time = res.start_time
					}else if(this.type == 0){
						
					}
				})
			},
			changeTime(e) {
				let t = e.detail.value
				let a = t.split(":")   //选择的时间
				let date = new Date();
				if(this.type == 1) {
					//早退
					let b = this.checkInfo.dstart_time.split(':')   //下班开始打卡时间
					let c = this.checkInfo.dend_time.split(':')      //下班结束打卡时间
					if(date.setHours(a[0], a[1]) < date.setHours(b[0], b[1])){
						uni.showToast({
							title:'补卡时间不能早于'+this.checkInfo.time+this.checkInfo.dstart_time,
							icon:'none'
						})
					}else if(date.setHours(a[0], a[1]) > date.setHours(c[0], c[1])){
						uni.showToast({
							title:'补卡时间不能晚于'+this.checkInfo.time+this.checkInfo.dstart_time,
							icon:'none'
						})
					}else{
						this.time = t
					}
				}else if(this.type == 2){
					//迟到
					let d = this.checkInfo.ustart_time.split(':')   //上班开始打卡时间
					let e = this.checkInfo.uend_time.split(':')   //上班结束打卡时间
					if(date.setHours(a[0], a[1]) < date.setHours(d[0], d[1])){
						uni.showToast({
							title:'补卡时间不能早于'+this.checkInfo.time+this.checkInfo.dstart_time,
							icon:'none'
						})
					}else if(date.setHours(a[0], a[1]) > date.setHours(e[0], e[1])){
						uni.showToast({
							title:'补卡时间不能晚于'+this.checkInfo.time+this.checkInfo.dstart_time,
							icon:'none'
						})
					}else{
						this.time = t
					}
				}else if(this.type == 0){
					
				}
			},
			//审批流程
			getProcess() {
				netApprovalProcess({type:'card'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						this.getDefaultRemind()
					}
				})
			},
			//图片
			uploadImg(obj){
				this.imgList.push(obj)
			},
			delImg(index) {
				this.imgList.splice(index,1)
			},
			toSave(){
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
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
				let params = {
					statisc_id:this.statisc_id,
					type:this.type,
					time:this.dayTime +' '+ this.time,
					title:this.type == 0 ? '补卡打卡' : this.type == 1 ? '早退打卡' : '迟到打卡'+'('+this.clockTime+')',
					remark:this.remark,
					file_ids:arr.join(','),
					flow_staff_ids:this.approvalPro.status == 0 ? b.join(',') : ''
				}
				netSupplementClock(params).then(res=>{
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
	.top_warp{
		padding:24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.topnum{
			font-size:24rpx;
			color:#666;
		}
		.history{
			font-size:24rpx;
			color:$uni-text-color;
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 20rpx;
		color: #999;
		font-size: 32rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			:first-child {
				width: 450rpx;
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
		.theme {
			color: #5ca9fe;
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
		.form_input {
			input {
				text-align: right;
				margin-right: 10rpx;
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