<template>
	<view>
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		<!-- 附件 -->
		<upload-img :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="button" @click="$noMultipleClicks(saveExamine)">确定</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL, SIGN_NO, BASE_URL } from '@/api/http.js'
	import { netEditAssitsStatus, uploadUrl } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				event_id:'',   //任务任务id
				status:3,   //取消任务 
				content:'',   //备注
				imgList:[],
				files:'',   //附件
			}
		},
		onLoad(options) {
			this.event_id = options.id
		},
		methods:{
			//上传图片
			uploadImg(obj) {
				this.imgList.push(obj)
			},
			//删除 图片
			delImg(index) {
				this.imgList.splice(index,1)
			},
			//确定
			saveExamine() {
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					event_id:this.event_id,
					status:3,
					content:this.content,
					file_ids:arr.join(',')
				}
				netEditAssitsStatus(params).then(res=>{
					uni.showToast({
						title: res.msg,
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
		background-color: #fff;
		padding:0rpx 40rpx 24rpx 50rpx;
		border-bottom:1rpx solid #EDEDED;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			text {
				color: #f00;
			}
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 20rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
	.inp_warp {
		padding:24rpx 40rpx 24rpx 50rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #333;
		}
	
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#FFA205;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#FFA205;
				margin-right:5rpx;
			}
		}
	}
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EDEDED;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EDEDED;
			&:nth-child(4n){
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
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
</style>
