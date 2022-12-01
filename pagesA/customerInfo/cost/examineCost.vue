<template>
	<view>
		<view class="textbox">
			<textarea name="" v-model="content" placeholder="请输入审核意见" id="" class="textcontent"></textarea>
		</view>
		<view class="button" @click="$noMultipleClicks(saveExamine)">保存</view>
	</view>
</template>

<script>
	import { netAllExamineCost } from '@/api/api.js'
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				status:'',    //1成功   2失败
				id:'',
				content:''
			}
		},
		onLoad(options) {
			this.status = options.status
			this.id = options.id
		},
		onShow() {
			if(this.status == 1) {
				uni.setNavigationBarTitle({
					title:'通过审批'
				})
			}else{
				uni.setNavigationBarTitle({
					title:'拒绝审批'
				})
			}
		},
		methods:{
			saveExamine() {
				let params = {
					relation_type: 'consume',
					relation_id:this.id,
					content:this.content,
					status: this.status
				}
				netAllExamineCost(params).then(res=>{
					uni.setStorageSync('editCostFlag',true)
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
