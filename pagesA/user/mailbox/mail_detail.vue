<template>
	<view>
		<view class="mail_info">
			<view class="mail_title">{{info?info.theme:''}}</view>
			<view class="mail_num">{{info?info.from_account:''}}</view>
			<view class="mail_time">{{info?info.receivetime:''}}</view>
		</view>
		<view class="mail_content" v-html="info.content"></view>
		<view class="imglist" v-if="info.imgs.length != 0">
			<view class="imgbox" v-for="(item,index) in info.imgs" :key="index" @click="toPrevie(info.imgs,index)">
				<image :src="item" class="selfimg" ></image>
			</view>
		</view>
		<view class="fllow_file_li" v-if="info.attach.length != 0">
			<view class="fil_li" v-for="(item,index) in info.attach" :key="index">
				<image :src="BASE_IMG_URL+'/index/fujian.png'" class="fileimg" ></image>
				<view class="filename">{{item.name}}</view>
			</view>
		</view>
		
		<view style="height:100rpx"></view>
		<view class="mail_bot">
			<view class="bot_li" @click="toReply">
				<image :src="BASE_IMG_URL+'/index/bianji.png'" class="firimg" ></image>
				<view class="bot_text">回复</view>
			</view>
			<view class="bot_li" @click="toForward">
				<image :src="BASE_IMG_URL+'/index/share.png'" class="firimg" ></image>
				<view class="bot_text">转发</view>
			</view>
			<view class="bot_li" @click="$noMultipleClicks(delEmail)">
				<image :src="BASE_IMG_URL+'/index/delete_bg.png'" class="firimg" ></image>
				<view class="bot_text">删除</view>
			</view>
			<view class="bot_li" @click="toDownFile">
				<image :src="BASE_IMG_URL+'/index/down.png'" class="firimg" ></image>
				<view class="bot_text">下载附件</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_URL, SIGN_NO, BASE_IMG_URL } from '@/api/http.js'
	import { netEmailDetails, netDelEmail } from '@/api/user.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				info:null
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
		},
		methods:{
			getDetail() {
				netEmailDetails({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			delEmail() {
				uni.showModal({
					title:'提示',
					content:'请确认是否删除?',
					success:(res)=>{
						if(res.confirm){
							netDelEmail({id:this.info.id}).then(res=>{
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
				})
			},
			toPrevie(arr,index) {
				uni.previewImage({
					current:index,
					urls:arr
				})
			},
			//下载 附件
			toDownFile() {
				let url = this.info.imgs
				let file = this.info.attach
				if(url.length != 0){
					url.forEach(ele=>{
						this.downImg(ele)
					})
				}
				if(file.length != 0) {
					file.forEach(ele=>{
						this.saveFile(ele)
					})
				}
			},
			downImg(url) {
				uni.downloadFile({
					url:url,
					header: {
						'token': uni.getStorageSync('token'),
						'sign-no': SIGN_NO
					},
					success:(res)=>{
						console.log(res)
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath
						})
					}
				})
			},
			saveFile(ele) {
				uni.downloadFile({
					url:ele.path,
					header: {
						'token': uni.getStorageSync('token'),
						'sign-no': SIGN_NO
					},
					success:(res)=>{
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success:(res)=>{
								console.log(res,'文件')
								wx.openDocument({
								    filePath: res.savedFilePath,
								    success: function (res) {
										console.log('打开文档成功')
								    },
								});
							},
							fail:(err)=>{
								console.log(err,'文件2')
							}
						})
					}
				})
			},
			//回复
			toReply() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/send_mail?num='+this.info.from_account
				})
			},
			//转发
			toForward() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/send_mail?id='+this.info.id+'&type=2'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mail_info{
		padding:30rpx;
		border-top:2rpx solid #f5f5f5;
		border-bottom:2rpx solid #f5f5f5;
		.mail_title{
			font-size:34rpx;
			color:#333333;
		}
		.mail_num{
			font-size:28rpx;
			color:#999999;
			margin:15rpx 0;
		}
		.mail_time{
			font-size:28rpx;
			color:#999999;
		}
	}
	.mail_content{
		padding:30rpx;
		color:#666666;
		font-size:28rpx;
	}
	.imglist{
		padding:24rpx 34rpx;
		background:#fff;
		border-bottom:1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.imgbox{
			width:160rpx;
			height:160rpx;
			margin-right:14rpx;
			position: relative;
			margin-bottom:24rpx;
			border:1rpx solid #EAEAEA;
			.delimg{
				width:32rpx;
				height:32rpx;
				border-radius:50%;
				position: absolute;
				right:-16rpx;
				top:-16rpx;
				background:rgba(0,0,0,0.5);
				z-index: 2;
			}
			.selfimg{
				width:160rpx;
				height:160rpx;
			}
		}
	}
	.fllow_file_li{
		padding:24rpx 34rpx;
		background:#fff;
		border-bottom:1rpx solid #EAEAEA;
		.fil_li{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			.fileimg{
				width:40rpx;
				height:40rpx;
				margin-right:30rpx;
			}
			.filename{
				font-size:24rpx;
				color:#999999;
			}
			.closeimg{
				width:32rpx;
				height:32rpx;
			}
		}
	}
	
	.mail_bot{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:98rpx;
		padding:0 35rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		background:#fff;
		z-index:9;
		.bot_li{
			text-align: center;
			.firimg{
				width:48rpx;
				height:48rpx;
			}
			.bot_text{
				font-size:28rpx;
				color:#666666;
			}
		}
	}
</style>
