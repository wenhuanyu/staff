<template>
	<view>
		<view class="fllow_area">
			<view class="area_head" v-if="status == 1">开始备注:</view>
			<view class="area_head" v-if="status == 2">完成备注:</view>
			<view class="area_head" v-if="status == 3">失败备注:</view>
			<textarea v-model="content" maxlength="-1" :class="content ? 'valueActive' : '' " placeholder="请填写开始/完成备注"
				placeholder-style="color:#999" />
		</view>
		<upload-img :flag="false" :imgList="imgList" @delImg="delImg" @uploadImg="uploadImg"></upload-img>
		
		<view class="button" @click="$noMultipleClicks(subSave)">确定</view>
	</view>
</template>

<script>
	import { netEditAssitsStatus } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				imgList:[],
				id:'',
				content:'',
				status:'',   //1开始   2完成  3失败
			}
		},
		onLoad(options) {
			this.id = options.id
			this.status = options.status
		},
		methods:{
			delImg(index) {
				this.imgList.splice(index,1)
			},
			uploadImg(data) {
				this.imgList.push(data)
			},
			subSave() {
				let arr = []
				this.imgList.forEach(ele => {
					arr.push(ele.id)
				})
				let params = {
					status: this.status,
					event_id: this.id,
					content: this.content,
					file_ids: arr.join(',')
				}
				netEditAssitsStatus(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_area {
		background: #fff;
		padding: 30rpx 40rpx;
		border-bottom:1rpx solid #f5f5f5;
		.area_head {
			margin-bottom: 20rpx;
			font-size: 26rpx;
		}
	
		textarea {
			width: 660rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size: 26rpx;
			background: rgba(202, 202, 202, 0.2);
		}
	}
</style>
