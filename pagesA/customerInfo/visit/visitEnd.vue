<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="fllow_area" v-if="tp == 1">
			<view class="area_head key" style="margin:20rpx 0;">通话内容:<span>*</span></view>
			<textarea v-model="call_content" :class="call_content ? 'valueActive' : '' " placeholder="通话内容"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_area">
			<view class="area_head key" style="margin:20rpx 0;">处理结果:<span>*</span></view>
			<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="处理结果"
				placeholder-style="color:#999" />
		</view>
		<!-- 上传图片 -->
		<upload-img :title="tp == 1 ? '附件' : '凭证'" :flag="tp != 1" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
	</view>
</template>

<script>
	import { SIGN_NO, BASE_URL, BASE_IMG_URL } from '@/api/http.js'
	import { netAddSignin } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick: true, //防止  重复点击
				imgList:[],
				content:'',
				call_content:'',
				event_id:'',
				tp:1,  //1电话  2微信  
			}
		},
		onLoad(options) {
			this.event_id = options.id
			this.tp = options.tp
		},
		methods:{
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			sureSub() {
				if(this.tp == 1 && !this.call_content){
					uni.showToast({
						title:'请填写通话内容',
						icon:'none'
					})
					return
				}
				if(!this.content){
					uni.showToast({
						title:'请填写处理结果',
						icon:'none'
					})
					return
				}
				
				if(this.tp == 2 &&　this.imgList.length == 0) {
					uni.showToast({
						title:'请上传微信截图',
						icon:'none'
					})
					return
				}
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					event_id:this.event_id,
					event_process:3,
					content:this.content,
					call_content:this.call_content,
					file_ids:arr.join(',')
				}
				netAddSignin(params).then(res=>{
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
		box-sizing: border-box;
		padding:0rpx 40rpx 24rpx 50rpx;
		border-bottom:1rpx solid #f5f5f5;
		.area_head {
			margin-bottom: 10rpx;
	
			text {
				color: #f00;
			}
		}
		textarea {
			width: 590rpx;
			background: #f5f5f5;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 0 auto;
		}
	}
	.inp_warp {
		padding:24rpx 40rpx 24rpx 50rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #CCC;
	
		.inp_title {
			font-size: 26rpx;
			color: #333;
		}
	
		.form_right {
			display: flex;
			color: #999;
			input{
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.radiobox{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}
	.imglist {
		padding: 24rpx 50rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 180rpx;
			height: 180rpx;
			margin-right: 50rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EAEAEA;
			&:nth-child(3n){
				margin-right:0;
			}
			.delimg {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				position: absolute;
				right: -16rpx;
				top: -16rpx;
				background: rgba(0, 0, 0, 0.5);
				z-index: 2;
			}
			.selfimg {
				width: 180rpx;
				height: 180rpx;
			}
		}
	}
</style>
