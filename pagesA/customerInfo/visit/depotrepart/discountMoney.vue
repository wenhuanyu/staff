<template>
	<view>
		<view class="fllow_form">
			<view class="key">是否收费<span>*</span></view>
			<view class="form_right">
				<view class="radiowarp">
					<view class="radioli" @click="changeRadio(1)">
						<radio value="1" color="#008EFF" :checked="is_charge == 1" />收费
					</view>
					<view class="radioli" @click="changeRadio(2)">
						<radio value="2" color="#008EFF" :checked="is_charge == 2" />不收费
					</view>
				</view>
			</view>
		</view>
		<view class="fllow_form" v-if="is_charge == 1">
			<view class="key">优惠金额<span>*</span></view>
			<view class="form_right">
				<input type="digit" v-model="discount_money" style="background:#f5f5f5;height:60rpx;line-height: 60rpx;border-radius: 10rpx;padding-right:15rpx;box-sizing: border-box;" class="form_input" placeholder="请输入优惠金额">
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head" style="margin:20rpx 0;">备注:</view>
			<textarea v-model="discount_desc" :class="discount_desc ? 'valueActive' : '' " placeholder="备注"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
	</view>
</template>

<script>
	import { netExaminerEditMoney } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick: true, //防止  重复点击
				discount_money:'',
				discount_desc:'',
				id:'',
				is_charge:1,    //1收费  2不收费
			}
		},
		onLoad(options) {
			this.id = options.id
			this.discount_money = options.money
		},
		methods:{
			changeRadio(num) {
				this.is_charge = num
			},
			sureSub(){
				let params = {
					id:this.id,
					discount_money:this.discount_money,
					discount_desc:this.discount_desc,
					is_charge:this.is_charge,
				}
				netExaminerEditMoney(params).then(res=>{
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
	.radiowarp{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.radioli{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:26rpx;
			radio{
				transform: scale(0.7);
			}
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
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
	.fllow_area {
		background: #fff;
		box-sizing: border-box;
		padding:0rpx 30rpx 30rpx;
		border-bottom:1rpx solid #f5f5f5;
		.area_head {
			margin-bottom: 10rpx;
			color:#666;
		}
		textarea {
			width: 590rpx;
			background: #f5f5f5;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 0 auto;
		}
	}
</style>
