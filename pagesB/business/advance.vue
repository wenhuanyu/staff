<template>
	<view class="">
		<view class="fllow_form">
			<view><text>*</text>商机阶段</view>
			<picker :range="arr" :value="arrIndex" @change="changeArr">
				<view class="form_right" >
					<view :class="arr[arrIndex] ? 'valueActive' : '' ">{{arr[arrIndex] ? arr[arrIndex] : '商机阶段'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_area">
			<view class="area_head">备注</view>
			<textarea
				maxlength="-1" 
				:class="remark ? 'valueActive' : '' " 
				placeholder="备注" 
				v-model="remark"
				placeholder-style="color:#999;font-size:32rpx;" />
		</view>
		<!-- 上传图片 -->
		<upload-image
			:imgList="imgList" 
			:flag="false"
			@uploadImg="uploadImg" 
			@delImg="delImg"
		></upload-image>
		<!-- 上传文件 -->
		<upload-file
			title="文件"
			v-if="false"
			:fileList="fileList"
			@uploadFile="uploadFile"
			@delFile="delFile"
		>
		</upload-file>
		
		
		<view class="button" @click="$noMultipleClicks(toSave)">
			保存
		</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import uploadImage from "@/components/uploadImg/index.vue"
	import uploadFile from '@/components/uploadFile/index.vue'
	import { netAdvanceBusiness } from '@/api/api.js'
	
	export default{
		components:{
			uploadImage,
			uploadFile
		},
		data() {
			return{
				noClick: true, //防止  重复点击
				arr:['初期沟通','立项跟踪','方案/报价','谈判审核','赢单','输单','无效'],
				arrIndex:0,
				remark:'',
				imgList:[],
				fileList:[],
				id:'',
			}
		},
		onLoad(options) {
			this.id = options.id
			this.arrIndex = options.status
		},
		methods:{
			changeArr(e) {
				this.arrIndex = e.detail.value
			},
			uploadImg(obj) {
				this.imgList.push(obj)
			},
			delImg(index) {
				this.imgList.splice(index,1)
			},
			uploadFile(obj) {
				this.fileList.push(obj)
			},
			delFile(index) {
				this.fileList.splice(index,1)
			},
			toSave(){
				let arr = []
				let b = this.imgList.concat(this.fileList)
				b.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					id:this.id,
					type:this.arrIndex,
					remark:this.remark,
					file:arr.join(',')
				}
				netAdvanceBusiness(params).then(res=>{
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
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 20rpx;
		color: #999;
		font-size: 32rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			:first-child {
				width: 450rpx;
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
		.theme {
			color: #5ca9fe;
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
		.form_input {
			input {
				text-align: right;
				margin-right: 10rpx;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding: 30rpx 20rpx;
		padding-bottom: 30rpx;
		color: #999;
		font-size: 32rpx;
		.area_head {
			margin-bottom:24rpx;
			margin-left:15rpx;
		}
		textarea {
		    width: 80%;
		    height: 300rpx;
		    padding: 30rpx;
		    background: #f8f8f8;
		    margin: 0 auto;
		}
	}
</style>