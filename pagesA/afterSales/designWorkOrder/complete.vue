<template>
	<view>
		<view class="fllow_area">
			<view class="area_head">成功备注:</view>
			<textarea v-model="desc" :class="desc ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(subSave)">确定</view>
	</view>
</template>

<script>
	import { netCompleteWorkorder } from '@/api/api.js'
	
	export default{
		data(){
			return{
				noClick:true,    //防止  重复点击
				id:'',
				desc:'',
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods:{
			subSave() {
				let params = {
					id:this.id,
					desc:this.desc
				}
				netCompleteWorkorder(params).then(res=>{
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
	.test_top{
		width:100%;
		height:60rpx;
		background:rgba(2, 135, 255, 0.2);
		.tip{
			font-size:26rpx;
			color:#0287FF;
			padding-left:60rpx;
			line-height: 60rpx;
			position: relative;
			&::before{
				content:'';
				width:20rpx;
				height:35rpx;
				border-radius: 10rpx;
				background:#0287FF;
				position: absolute;
				left:30rpx;
				top:15rpx;
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx 40rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
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
