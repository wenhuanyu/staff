<template>
	<view class="tranfer_clue">
		<view class="fllow_form">
			<view style="color: #333;font-size: 32rpx;"><text>*</text>接收对象</view>
			<view class="form_right" @click="toSelectStaff">
				<view>{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="button" @click="Totrans">
			保存
		</view>
		
		<!-- 选择员工 -->
	</view>
</template>

<script>
	import { netTransBusiness } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	export default {
		mixins:[commonFun],
		data() {
			return {
				id:'',
			}
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
		},
		methods: {
			Totrans() {
				if(!this.staffObj){
					uni.showToast({
						title:'请选择接受对象',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					owner_staff_id: this.staffObj.id
				}
				netTransBusiness(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.redirectTo({
							url:"/pagesB/business/index"
						})
					},1000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
  .fllow_form {
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 0 30rpx 0 47rpx;
		margin: 0 0 30rpx;
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
	}
	.fllow_area {
				background-color: #fff;
				margin-bottom: 30rpx;
				padding-bottom: 30rpx;
				color: #999;
				.area_head {
					height: 100rpx;
					line-height: 100rpx;
					font-size: 32rpx;
					padding: 0 70rpx;
					text {
						color: #f00;
					}
				}
				textarea {
					width: 80%;
					height: 300rpx;
					padding: 30rpx;
					background: #f8f8f8;
					margin: 0 auto;
				}
			}
	#btn {
		font-size: 26rpx;
		color: #fff;
		text-align: center;
		line-height: 88rpx;
		width: 500rpx;
		height: 88rpx;
		background: $uni-text-color;
		border-radius: 29rpx;
	}
</style>
