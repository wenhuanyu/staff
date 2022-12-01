<template>
	<view>
		<view class="fllow_area">
			<view class="area_head">原因分析:</view>
			<textarea v-model="data1" maxlength="-1" :class="data1 ? 'valueActive' : '' " placeholder="请填写原因分析"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_area">
			<view class="area_head">改善结果:</view>
			<textarea v-model="data2" maxlength="-1" :class="data2 ? 'valueActive' : '' " placeholder="请填写改善结果"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_area">
			<view class="area_head">评估改善结果:</view>
			<textarea v-model="data4" maxlength="-1" :class="data4 ? 'valueActive' : '' " placeholder="请填写评估改善结果"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_area">
			<view class="area_head">完善制度工艺流程:</view>
			<textarea v-model="data5" maxlength="-1" :class="data5 ? 'valueActive' : '' " placeholder="请填写完善制度工艺流程"
				placeholder-style="color:#999" />
		</view>
		<view class="inp_warp">
			<view class="inp_title">完成时间</view>
			<picker @change="changeData" mode="date">
				<view class="form_right">
					<view :class="data3 ? 'valueActive' : '' ">
						{{data3 ? data3 : '完成时间'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title">责任人</view>
			<view class="form_right">
				<input type="text" v-model="duty_staff" placeholder="请填写责任人" class="rightinput" :class="duty_staff ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">分析人</view>
			<view class="form_right">
				<input type="text" v-model="analyst_staff" placeholder="请填写分析人" class="rightinput" :class="analyst_staff ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">实施人</view>
			<view class="form_right">
				<input type="text" v-model="implementer_staff" placeholder="请填写实施人" class="rightinput" :class="implementer_staff ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">主管</view>
			<view class="form_right">
				<input type="text" v-model="director_staff" placeholder="请填写主管" class="rightinput" :class="director_staff ? 'valueActive' : '' ">
			</view>
		</view>
		
		<view class="button" @click="submit">提交</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import { netAbnormalProcess } from '@/api/api.js'
	
	export default{
		data() {
			return{
				data1:'',
				data2:'',
				data3:'',
				data4:'',
				data5:'',
				duty_staff:'',
				analyst_staff:'',
				implementer_staff:'',
				director_staff:'',
				workorder_id:''
			}
		},
		onLoad(options) {
			this.workorder_id = options.workorderid
		},
		methods:{
			changeData(e) {
				this.data3 = e.detail.value
			},
			submit() {
				let params = {
					data1: this.data1,
					data2: this.data2,
					data3: this.data3,
					data4: this.data4,
					data5: this.data5,
					duty_staff: this.duty_staff,
					analyst_staff: this.analyst_staff,
					implementer_staff:this.implementer_staff,
					director_staff:this.director_staff,
					workorder_id:this.workorder_id
				}
				netAbnormalProcess(params).then(res=>{
					uni.showToast({
						title: res.msg,
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
		padding:24rpx 45rpx 24rpx 50rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #333;
			text{
				color:#F00;
			}
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
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
	.fllow_area {
		background-color: #fff;
		padding:24rpx 40rpx 24rpx 50rpx;
		border-bottom:1rpx solid #EDEDED;
		.area_head {
			margin-bottom:15rpx;
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
