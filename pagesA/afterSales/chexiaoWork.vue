<template>
	<view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head">撤销原因:</view>
			</view>
			<textarea v-model="content" maxlength="-1" :class="content ? 'valueActive' : '' " placeholder="请填写撤销原因"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(saveExamine)">保存</view>
	</view>
</template>

<script>
	import { netChexiaoWork } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				content:'',
				event_id:''
			}
		},
		onLoad(options) {
			this.event_id = options.id
		},
		methods:{
			saveExamine() {
				if(!this.content){
					uni.showToast({
						title:'请填写撤销原因',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.event_id,
					desc:this.content
				}
				netChexiaoWork(params).then(res=>{
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
