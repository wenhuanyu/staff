<template>
	<view class="">
		<view class="fllow_form">
			<view><text>*</text>负责人</view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择负责人'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="button" @click="$noMultipleClicks(sureSubmit)">
			保存
		</view>
	</view>
</template>

<script>
	import { netAllDistriCluesPool } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick: true, //防止  重复点击
				id:'',
			}
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		onLoad(options) {
			this.$store.commit('STAFFOBJ',null)
			this.id = options.ids
		},
		onShow() {
			
		},
		methods:{
			sureSubmit() {
				if(!this.staffObj){
					uni.showToast({
						title:'请选择负责人',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					staff_id:this.staffObj.id
				}
				netAllDistriCluesPool(params).then(res=>{
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
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 0 30rpx;
		color: #999;
		font-size: 32rpx;
	
		.form_right {
			display: flex;
			color: #999;
	
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
	
		text {
			color: #f00;
			margin-left: 10rpx;
		}
	
		.form_input {
			input {
				height: 100%;
				text-align: right;
			}
		}
	
		.fllow_button {
			margin-top: 15rpx;
		}
	}
</style>