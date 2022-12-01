<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">回访日期<span>*</span></view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view :class="visit_time ? 'valueActive' : '' ">
						{{visit_time ? visit_time : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		
		<view class="inp_warp">
			<view class="inp_title key">客户满意度<span>*</span></view>
			<view class="form_right">
				<uni-rate :size="18" :value="satisfaction" @change="changeRate" />
			</view>
		</view>
		
		<view class="fllow_area">
			<view class="area_head key">
				<view>服务态度:<span>*</span></view>
				<uni-rate :size="18" :value="service_score" @change="changeService" />
			</view>
			<textarea v-model="visit_service" maxlength="-1" :class="visit_service ? 'valueActive' : '' " placeholder="请填写服务态度"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_area">
			<view class="area_head key">
				<view>技术水平:<span>*</span></view>
				<uni-rate :size="18" :value="skill_score" @change="changeSkill" />
			</view>
			<textarea v-model="visit_skill" maxlength="-1" :class="visit_skill ? 'valueActive' : '' " placeholder="请填写售后技术水平"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_area">
			<view class="area_head">
				<view>回访意见:</view>
				<uni-rate :size="18" :value="opinion_score" @change="changeOpinion" />
			</view>
			<textarea v-model="visit_opinion" maxlength="-1" :class="visit_opinion ? 'valueActive' : '' " placeholder="请填写回访意见"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="visit_desc" maxlength="-1" :class="visit_desc ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(toSave)">确定</view>
		<view style="height:env(safe-area-inset-bottom);"></view>
	</view>
</template>

<script>
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	import { netWriteVisitContent } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				id:'',
				satisfaction:0,
				visit_time:'',   //回访时间
				visit_desc:'',   //备注
				visit_opinion:'',   //回访意见
				visit_service:'',   //服务态度
				service_score:0,   //服务态度评分
				visit_skill:'',   //技术水平
				skill_score:0,   //技术水平 评分
				opinion_score:0,   //回访意见 评分
			}
		},
		onLoad(options) {
			this.id = options.id
			let arr = getNewDateArry()
			this.visit_time = `${arr[0]}-${arr[1]}-${arr[2]}`
		},
		methods:{
			changeTime(e) {
				this.visit_time = e.detail.value
			},
			changeRate(e) {
				console.log(e,'===')
				this.satisfaction = e.value
			},
			//服务态度 评分
			changeService(e) {
				this.service_score = e.value
			},
			//技术评分
			changeSkill(e) {
				this.skill_score = e.value
			},
			//回访意见 评分
			changeOpinion(e) {
				this.opinion_score = e.value
			},
			toSave() {
				if(!this.satisfaction){
					uni.showToast({
						title:'请给客户满意评分',
						icon:'none'
					})
					return
				}
				if(!this.service_score){
					uni.showToast({
						title:'请给服务态度评分',
						icon:'none'
					})
					return
				}
				// skill_score
				if(!this.skill_score){
					uni.showToast({
						title:'请给技术水平评分',
						icon:'none'
					})
					return
				}
				// opinion_score
				if(!this.opinion_score){
					uni.showToast({
						title:'请给回访评分',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					satisfaction:this.satisfaction,
					visit_desc:this.visit_desc,
					visit_time:this.visit_time,
					visit_opinion:this.visit_opinion,
					opinion_score:this.opinion_score,
					visit_service:this.visit_service,
					service_score:this.service_score,
					visit_skill:this.visit_skill,
					skill_score:this.skill_score,
				}
				netWriteVisitContent(params).then(res=>{
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
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		margin-bottom: 30rpx;
		.area_head {
			margin-bottom:24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color:#666;
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 20rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
</style>
