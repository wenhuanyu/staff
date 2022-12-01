<template>
	<view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head">失败原因:</view>
			</view>
			<textarea v-model="desc" :class="desc ? 'valueActive' : '' " placeholder="失败原因"
				placeholder-style="color:#999" />
		</view>
		<view class="button" @click="$noMultipleClicks(sureSub)">确认</view>
	</view>
</template>

<script>
	import { netDesignFail } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,   //防止重复点击
				desc:'',
				id:''
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods:{
			sureSub() {
				let params = {
					id:this.id,
					desc:this.desc
				}
				netDesignFail(params).then(res=>{
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
	.fllow_area {
		background: #fff;
		padding:30rpx 40rpx;
		border-bottom:1rpx solid #f5f5f5;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
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
