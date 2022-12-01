<template>
	<view>
		<view class="fllow_form">
			<view class="key">解决结果</view>
			<view class="form_right">
				<radio-group class="radiowarp" @change="changeRadio">
					<view class="">
						<radio value="1" color="#0287FF" :checked="is_successful == 1" />已解决
					</view>
					<view class="">
						<radio value="2" color="#0287FF" :checked="is_successful == 2" />未解决
					</view>
				</radio-group>
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head">计划备注:</view>
			</view>
			<textarea v-model="achieve_purpose" maxlength="-1" :class="achieve_purpose ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(submitResult)">提交</view>
	</view>
</template>

<script>
	import { netDonephoneRepair } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,   //防止重复点击
				is_successful:1,   //1 已解决 2未解决
				achieve_purpose:'',
				id:''
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods:{
			changeRadio(e) {
				this.is_successful = e.detail.value
			},
			submitResult() {
				let params = {
					id:this.id,
					is_successful:this.is_successful,
					achieve_purpose:this.achieve_purpose
				}
				netDonephoneRepair(params).then(res=>{
					if(this.is_successful == 2) {
						uni.showModal({
							title:'提示',
							content:'电话维修未解决，请前去创建上门服务或返厂维修任务',
							showCancel:false,
							confirmText:'知道了',
							complete:(res)=>{
								if(res.confirm){
									uni.navigateBack({
										delta:1
									})
								}
							}
						})
					}else{
						uni.showToast({
							title:'提交成功',
							icon:'none',
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:24rpx 45rpx 24rpx 50rpx;
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx 40rpx;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
			}
			.list_text{
				font-size:26rpx;
				color:#007AFF;
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
</style>
