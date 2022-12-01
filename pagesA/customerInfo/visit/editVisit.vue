<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">任务类型<span>*</span></view>
			<view class="form_right">
				<view class="valueActive">{{event_type}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联客户<span>*</span></view>
			<view class="form_right">
				<view :class="customerinfo ? 'valueActive' : '' ">
					{{customerinfo ? customerinfo.name : '选择关联客户'}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">紧要程度<span>*</span></view>
			<picker @change="changeCritical" :range="critical_list" :value="criticalIndex" :range-key="'name'">
				<view class="form_right">
					<view :class="critical_list[criticalIndex] ? 'valueActive' : '' ">
						{{critical_list[criticalIndex] ? critical_list[criticalIndex].name : '选择紧要程度'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开始时间</view>
			<view class="form_right">
				<select-time-picker
					placeholder="选择开始时间" 
					:defaultValue="start_time"
					fields="minute"
					@change="changeNewStartTime"
				></select-time-picker>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">预计结束时间</view>
			<view class="form_right">
				<select-time-picker
					placeholder="选择结束时间" 
					:start="limit_time"
					:defaultValue="end_time"
					fields="minute"
					@change="changeNewEndTime"
					v-if="limit_time"
				></select-time-picker>
				<view v-else @click="toDone">选择结束时间</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">提醒</view>
			<picker @change="changeRemind" :range="remindList" :value="remindIndex">
				<view class="form_right">
					<view :class="remindList[remindIndex] ? 'valueActive' : '' ">
						{{remindList[remindIndex] ? remindList[remindIndex] : '选择提醒时间'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_form" >
			<view class="" style="color:#666">指派员工</view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head">计划备注:</view>
				<view class="list_text" @click="toRemarksTemp">选择模板</view>
			</view>
			<textarea v-model="remarks" maxlength="-1" :class="remarks ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	import { netEditEvent, netVisitDetail } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		components:{
			selectTimePicker
		},
		data() {
			return{
				noClick:true,   //防止重复点击
				id:'',
				title:'',
				event_type:'',
				critical_list:[    //紧要程度
					{ id:0, name:'普通'},
					{ id:1, name:'重要'},
					{ id:2, name:'紧急'},
					{ id:4, name:'重要且紧急'},
				],
				criticalIndex:0,
				remindList:['准时提醒','5分钟前','15分钟前','30分钟前','一个小时前','两个小时前','一天前','两天前','一周前'],
				remindIndex:1,
				start_time:'',
				end_time:'',
				limit_time:'',
				remarks:''
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
			templateTitle: state => state.template.visit_plan_title,   //标题
			staffObj: state => state.customer.staffObj,
			templateRemark: state => state.template.visit_plan_remarks,   //备注
		}),
		watch:{
			templateTitle(newv,oldv){
				this.title = newv
			}
		},
		onShow() {
			if(this.templateRemark) {
				this.remarks += this.templateRemark
			}
		},
		
		onLoad(options) {
			this.id = options.id
			this.getInfo()
		},
		methods:{
			getInfo() {
				netVisitDetail({id:this.id}).then(res=>{
					res = res.data
					this.event_type = res.event_type
					this.title = res.title
					this.$store.commit('CUSTOMEROBJ',res.customer)
					//处理紧要程度
					this.handleJinyao(res.level)
					this.start_time = res.start_time
					this.end_time = res.end_time
					this.limit_time = res.start_time
					this.remarks = res.remark
				})
			},
			handleJinyao(id) {
				this.critical_list.forEach((ele,index)=>{
					if(ele.id == id){
						this.criticalIndex = index
					}
				})
			},
			//新组建   开始时间
			changeNewStartTime(dt) {
				this.start_time = dt.f3
				this.limit_time = ''
				this.end_time = ''
				setTimeout(()=>{
					let Y = dt.YYYY
					let M = dt.M
					let D = dt.D
					let h = Number(dt.h) + 1
					if(h > 24){
						h = 1
						D = D + 1
					}
					this.limit_time = `${Y}-${M}-${D} ${h}:${dt.m}`
				},200)
			},
			changeNewEndTime(e) {
				this.end_time = e.f3
			},
			//去选择  备注 模版
			toRemarksTemp() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/needTemplate?type=任务备注'
				})
			},
			//提醒时间
			changeRemind(e) {
				this.remindIndex = e.detail.value
			},
			//紧要程度
			changeCritical(e) {
				this.criticalIndex = e.detail.value
			},
			sureSub() {
				if(!this.title){
					uni.showToast({
						title:'请填写标题',
						icon:'none'
					})
					return
				}
				if(!this.customerinfo){
					uni.showToast({
						title:'请选择关联客户',
						icon:'none'
					})
					return
				}
				// if((this.event_type.indexOf('微信') == -1) && !this.start_time){
				// 	uni.showToast({
				// 		title:'请选择开始时间',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				// if((this.event_type.indexOf('微信') == -1) && !this.end_time){
				// 	uni.showToast({
				// 		title:'请选择预计结束时间',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				let params = {
					id:this.id,
					title:this.title,
					remarks:this.remarks,
					start_time:this.start_time,
					end_time:this.end_time,
					level:this.critical_list[this.criticalIndex].id,
					remindtype:this.remindIndex,
					staff_id:this.staffObj?this.staffObj.id:'',
				}
				netEditEvent(params).then(res=>{
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
	.fir_text{
		font-size:26rpx;
		color:$uni-text-color;
		margin-left:15rpx;
	}
	.fllow_area {
		background: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
				color:#666;
			}
			.list_text{
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
		textarea {
			width: 660rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size:26rpx;
			background:rgba(202, 202, 202, 0.2);
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding:30rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
	}
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
			.right_btn{
				font-size:24rpx;
				color:#007AFF;
			}
		}
	}
</style>
