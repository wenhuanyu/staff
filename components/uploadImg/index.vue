<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">{{title}}: <span v-if="flag">*</span></view>
			<view class="form_right">
				<view>上传图片</view>
				<view class="iconfont icon-arrows_right"></view>
			</view>
		</view>
		<view class="imglist" v-if="isEdit">
			<view class="imgbox" v-for="(item,index) in imgList" :key="index">
				<image :src="BASE_IMG_URL+'/index/close.png'" class="delimg" @click="delImg(index)" ></image>
				<image :src="item.file_path" class="selfimg_img" @click="toPriveImg(index)" ></image>
			</view>
			<view class="imgbox_tow" @click="uploadFiles" v-if="imgList.length < single && isEdit">
				<image :src="BASE_IMG_URL+'/index/addfile.png'" class="selfimg" ></image>
			</view>
		</view>
		<view class="imglist" v-else-if="imgList.length">
			<view class="imgbox" v-for="(item,index) in imgList" :key="index">
				<image :src="item.file_path" class="selfimg_img" @click="toPriveImg(index)" ></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_URL,  BASE_IMG_URL } from '@/api/http.js'
	import { uploadUrl } from '@/api/api.js'
	
	export default{
		props:{
			imgList:{
				type:Array,
				default:[]
			},
			flag:{     //是否必填
				type:Boolean,
				default:true
			},
			title:{    //标题
				type:String,
				default:'附件'
			},
			single:{    //是否单张图片
				type:Number,
				default:9
			},
			istype:{
				type:String,
				default:'all'
			},
			isEdit: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			//查看图片
			toPriveImg(index) {
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.file_path)
				})
				uni.previewImage({
					urls: arr,
					current:index
				})
			},
			//上传图片
			uploadFiles() {
				this.$store.commit('VISIT_PLAN_REMARKS','')
				let arr = []
				if(this.istype == 'all'){
					arr = ['album','camera']
				}else if(this.istype == 'album'){
					//从相册选图
					arr = ['album']
				}else if(this.istype == 'camera'){
					//直接拍照
					arr = ['camera']
				}
				uni.chooseImage({
					count: 9,
					sourceType: arr,
					sizeType:['compressed'],
					success: (res) => {
						let file = res.tempFilePaths
						file.forEach(ele=>{
							this.toUpload(ele)
						})
					}
				})
			},
			toUpload(file) {
				uni.uploadFile({
					url: uploadUrl,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token')
					},
					filePath: file,
					success: (res) => {
						let data = JSON.parse(res.data)
						if (data.code == 1) {
							let obj = {
								id: data.data.id,
								file_path: data.data.url
							}
							this.$emit('uploadImg',obj)
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
			delImg(index) {
				this.$emit('delImg',index)
			},
		}
	}
</script>

<style lang="scss" scoped>
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
			.selfimg_img{
				width: 160rpx;
				height: 160rpx;
			}
			
		}
		.imgbox_tow{
			width: 75rpx;
			height: 75rpx;
			.selfimg {
				width: 75rpx;
				height: 75rpx;
			}
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
			color: #666666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
		}
	}
</style>
