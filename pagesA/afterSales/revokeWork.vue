<template>
	<view>
		<view class="textbox">
			<textarea name="" v-model="desc" placeholder="请输入终止原因" id="" class="textcontent"></textarea>
		</view>
		<view class="button" @click="$noMultipleClicks(saveExamine)">确定</view>
	</view>
</template>

<script>
	import { netRevokeWorkorder, netRevokeProofing } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				id:'',  //工单id   任务id
				desc:'',
				type:1,  //1工单   2打样
			}
		},
		onLoad(options) {
			this.id = options.id
			if(options.type){
				this.type = options.type
			}
		},
		methods:{
			saveExamine() {
				let params = {
					id:this.id,
					desc:this.desc
				}
				if(this.type == 1) {
					netRevokeWorkorder(params).then(res=>{
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
				}else if(this.type == 2) {
					netRevokeProofing(params).then(res=>{
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
	}
</script>

<style lang="scss" scoped>
	.textbox{
		background:#fff;
		padding:20rpx 24rpx;
		.textcontent{
			width:100%;
			height:300rpx;
			border-radius: 8rpx;
			border:1rpx solid #CCCCCC;
			padding:20rpx;
			box-sizing: border-box;
		}
	}
</style>
