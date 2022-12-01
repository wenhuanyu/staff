<template>
	<view class="">
		<view class="inp_warp">
			<view class="inp_title key">{{title}}<span v-if="flag">*</span></view>
			<view class="form_right" @click="toUploadFile" v-if="isEdit">
				<view>点击上传</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="doc_item" v-for="(item,index) in fileList" :key="index">
			<image :src="BASE_IMG_URL+'/index/file-clip.png'" class="remarkimg" ></image>
			<view class="doc_name" @click="toLookFile(item)">{{item.name}}</view>
			<image :src="BASE_IMG_URL+'/index/delete.png'" @click="delFile(index)" class="deleimg" v-if="isEdit"></image>
		</view>
		<video style="width:100%;" :src="videoUrl" v-if="videoUrl"></video>
		
		<tki-file-manager ref="filemanager" @result="resultPath"></tki-file-manager>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { uploadUrl } from '@/api/api.js'
	import tkiFileManager from "@/components/tki-file-manager/tki-file-manager.vue"
	
	export default{
		components:{
			tkiFileManager
		},
		props:{
			title:{
				type:String,
				default:'附件'
			},
			flag:{     //是否必填
				type:Boolean,
				default:false
			},
			fileList:{
				type:Array,
				default:[]
			},
			isEdit:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				videoUrl:''
			}
		},
		methods:{
			//上传附件
			toUploadFile() {
				// #ifdef H5
				uni.chooseFile({
					count:1,
					success:(res)=>{
						let data = res.tempFiles[0]
						this.Upload(data.path,data.name)
					}
				})
				// #endif
				// #ifdef MP-WEIXIN
				wx.chooseMessageFile({
					count:1,
					success:(res)=>{
						let data = res.tempFiles[0]
						this.Upload(data.path,data.name)
					}
				})
				// #endif
				// #ifdef APP-PLUS
				this.$refs.filemanager._openFile()
				// #endif
			},
			resultPath(e){
				console.log(e,'选择的文件')
				this.Upload(e)
			},
			Upload(file,name) {
				uni.uploadFile({
					url: uploadUrl,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token'),
					},
					filePath: file,
					formData:name?{name}:{},
					success: (res) => {
						let data = JSON.parse(res.data)
						if (data.code == 1) {
							let res = data.data
							res.name = name?name:res.name
							res.file_path = res.url
							console.log(res,'上传文件')
							this.$emit('uploadFile',res)
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//查看附件
			toLookFile(item) {
				let suffix = item.name.substring(item.name.lastIndexOf('.')+1)
				if(suffix == 'mp4'){
					this.videoUrl = item.file_path
				}else{
					this.videoUrl = ''
					this.openCommonFile(item)
				}
			},
			//删除附件
			delFile(id,index) {
				this.$emit('delFile',index)
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.doc_item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:24rpx 35rpx;
		background:#fff;
		border-bottom:1rpx solid #EDEDED;
		.remarkimg{
			width:31rpx;
			height:33rpx;
			margin-right:15rpx;
		}
		.deleimg{
			width:44rpx;
			height:44rpx;
		}
		.doc_name{
			width:575rpx;
			font-size:24rpx;
			color:#333;
			overflow: hidden;
		}
	}
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
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
		}
	}
</style>