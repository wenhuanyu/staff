<template>
	<view class="">
		<view class="listbox">
			<view class="li" v-for="(item,index) in list" :key="index">
				<view class="time">推进时间：{{item.createtime}}</view>
				<view class="content">
					<span>推进阶段：</span> 
					<text v-if="item.type == 0">初期沟通</text>
					<text v-if="item.type == 1">立项跟踪</text>
					<text v-if="item.type == 2">方案/报价</text>
					<text v-if="item.type == 3">谈判审核</text>
					<text v-if="item.type == 4">赢单</text>
					<text v-if="item.type == 5">输单</text>
					<text v-if="item.type == 6">无效</text>
				</view>
				<view class="content">
					<span>备注：</span>{{item.remark}}
				</view>
				<view class="main_img" @click.stop.prevent v-if="item.imgList != item">
					<image v-for="(ele,imgindex) in item.imgList" :key="imgindex" :src="ele.file_path" @click.stop="toPrevieImg(item.imgList,imgindex)" class="imgbox" ></image>
				</view>
				<view class="fllow_file_li" @click.stop.prevent v-if="item.fileList.length != 0">
					<view class="fil_li" v-for="(fileitem,fileindex) in item.fileList" :key="fileindex">
						<image :src="BASE_IMG_URL+'fujian.png'" class="fileimg" mode="scaleToFill"></image>
						<view class="filename" @click="openCommonFile(fileitem)">{{fileitem.name}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netBusinessHistory } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			info:{
				type:Object,
				default:{}
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[]
			}
		},
		created() {
			this.getList()
		},
		methods:{
			getList() {
				netBusinessHistory({id:this.info.id}).then(res=>{
					res = res.data
					res.forEach(ele=>{
						ele.imgList = []
						ele.fileList = []
						if(ele.file){
							ele.file.forEach(item=>{
								if(item.types.indexOf('image') != -1){
									ele.imgList.push({
										id:item.id,
										file_path:item.file_path,
										name:item.name
									})
								}else{
									ele.fileList.push({
										id:item.id,
										file_path:item.file_path,
										name:item.name
									})
								}
							})
						}
					})
					this.list = res
				})
			},
			//查看 图片
			toPrevieImg(arr,index) {
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					urls: data,
					current:index
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.listbox{
		.li{
			padding:24rpx;
			background:#fff;
			border-radius: 20rpx;
			width:690rpx;
			margin:24rpx auto 0;
			box-shadow:2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);
			.time{
				font-size:30rpx;
				color:#000;
				padding-bottom:24rpx;
				border-bottom:1rpx solid #f5f5f5;
				margin-bottom:15rpx;
			}
			.content{
				display: flex;
				justify-content: flex-start;
				font-size: 28rpx;
				color:#333;
				margin-bottom:15rpx;
			}
			.main_img {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 20rpx;
				.imgbox {
					padding: 10rpx;
					border-radius: 10rpx;
					width: 160rpx;
					height: 160rpx;
					margin-right: 14rpx;
					margin-bottom: 14rpx;
				}
			}
			.fllow_file_li {
				padding: 24rpx 34rpx;
				background: #fff;
				.fil_li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding-bottom: 14rpx;
					padding-top:15rpx;
					.fileimg {
						width: 20rpx;
						height: 20rpx;
						margin-right:25rpx;
					}
					.filename {
						width:450rpx;
						font-size: 24rpx;
						color: #999999;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.closeimg {
						width: 32rpx;
						height: 32rpx;
					}
				}
			}
		}
	}
</style>