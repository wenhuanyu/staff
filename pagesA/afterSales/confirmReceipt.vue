<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key" >收款时间</view>
			<view class="form_right">
				
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		
		<upload-img :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="button" @click="$noMultipleClicks(sureSubmit)">确定</view>
		
	</view>
</template>

<script>
	import { netToconfirm } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,   //防止重复点击
				id:'',
				imgList:[]
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods:{
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			sureSubmit() {
				let params = {
					workorder_id:this.id,
					
				}
				netToconfirm().then(res=>{
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding:24rpx 45rpx 24rpx 50rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #333;
			text{
				color:#F00;
			}
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
			.right_btn{
				font-size:24rpx;
				color:#007AFF;
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
	
</style>
