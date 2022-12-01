<template>
	<view>
		<view class="textbox">
			<textarea name="" v-model="desc" maxlength="-1" placeholder="请填写备注" id="" class="textcontent"></textarea>
		</view>
		<view class="button" @click="$noMultipleClicks(saveExamine)">保存</view>
	</view>
</template>

<script>
	import { netRepairIsjixu } from '@/api/api.js'
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				id:'',
				is_continue:1,   //1 继续维修 9取消维修
				desc:''
			}
		},
		onLoad(options) {
			this.id = options.id
			this.is_continue = options.continue
		},
		onShow() {
			if(this.is_continue == 1) {
				uni.setNavigationBarTitle({
					title:'继续维修'
				})
			}else{
				uni.setNavigationBarTitle({
					title:'取消维修'
				})
			}
		},
		methods:{
			saveExamine() {
				if(!this.desc) {
					uni.showToast({
						title:'请填写备注',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					is_continue:this.is_continue,
					desc:this.desc
				}
				netRepairIsjixu(params).then(res=>{
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
