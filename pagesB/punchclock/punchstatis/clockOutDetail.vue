<template>
	<view class="">
		<view class="top">
			<image :src="info.create_staff.img" class="staffimg"></image>
			<view class="text">{{info.create_staff.name}}的外勤打卡</view>
		</view>
		<view class="section">
			<view class="sec_li"> <text>提交时间</text> {{info.createtime}}</view>
			<view class="sec_li"> <text>打卡类型</text> 外勤打卡</view>
			<view class="sec_li"> <text>打卡时间</text> {{info.time}}</view>
			<view class="sec_li"> <text>打卡事由</text> {{info.remarks?info.remarks:''}}</view>
			<view class="sec_li_file"> 
				<text>附件</text> 
				<view class="imgbox">
					<image v-for="(item,index) in info.file_ids" :key="index" :src="item.file_path" @click="toPrevieImg(info.file_ids,index)" class="selfimg"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netOutClockDetail } from '@/api/api.js'
	
	export default{
		data() {
			return{
				id:'',
				info:{},
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getDetail()
		},
		methods:{
			getDetail() {
				netOutClockDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			//查看 图片
			toPrevieImg(arr,index) {
				console.log(arr,'=====')
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					urls: data,
					current:index
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding:24rpx 30rpx;
		background:#fff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.staffimg{
			width:60rpx;
			height:60rpx;
			border-radius: 50%;
		}
		.text{
			font-size:24rpx;
			color:#333;
			margin:0 15rpx;
		}
		.statu{
			width:120rpx;
			border:1rpx solid $uni-text-color;
			border-radius: 10rpx;
			font-size:24rpx;
			color:$uni-text-color;
			text-align: center;
			padding:5rpx 0;
		}
	}
	.section{
		background:#fff;
		margin:24rpx 0;
		padding:40rpx 30rpx 30rpx 50rpx;
		.sec_li{
			display: flex;
			justify-content: flex-start;
			font-size:30rpx;
			color:#333;
			margin-bottom:20rpx;
			text{
				color:#999;
				margin-right:15rpx;
				flex-shrink: 0;
			}
		}
		.sec_li_file{
			display: flex;
			justify-content: flex-start;
			font-size:30rpx;
			color:#333;
			text{
				color:#999;
				margin-right:15rpx;
			}
			.imgbox{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				.selfimg{
					width:120rpx;
					height:120rpx;
					border-radius: 10rpx;
					margin:0 15rpx 15rpx 0;
				}
			}
		}
	}
	.btnlist {
		padding: 20rpx 24rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top: 1rpx solid #DDDDDD;
		background: #fff;
	
		.btn {
			width: 300rpx;
			height: 60rpx;
			border-radius: 8rpx;
			font-size: 24rpx;
			color: #fff;
			text-align: center;
			line-height: 60rpx;
		}
	
		.pass {
			background:$uni-text-color;
		}
	
		.refuse {
			background: #F43F3B;
		}
	}
</style>