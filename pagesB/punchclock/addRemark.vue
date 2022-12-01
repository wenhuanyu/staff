<template>
	<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent @maskClick="close">
		<view class="fllow_area">
			<view class="area_head">
				备注
			</view>
			<textarea
				maxlength="-1" 
				:class="remarks ? 'valueActive' : '' " 
				v-model="remarks"
				placeholder="备注" 
				placeholder-style="color:#999;font-size:32rpx;" />
		</view>
		<!-- 上传图片 -->
		<upload-image
			:flag="false"
			:imgList="imgList" 
			@uploadImg="uploadImg" 
			@delImg="delImg"
		></upload-image>
		<view class="button" @click="$noMultipleClicks(toSave)">
			保存
		</view>
		
	</uni-popup>
</template>

<script>
	import uploadImage from "@/components/uploadImg/index.vue"
	
	export default{
		components:{
			uploadImage
		},
		data() {
			return{
				noClick: true, //防止  重复点击
				imgList:[],
				remarks:''
			}
		},
		methods:{
			init(obj) {
				this.$refs.popup.open()
				this.imgList = obj.imgList
				this.remarks = obj.remarks
			},
			//图片
			uploadImg(obj){
				this.imgList.push(obj)
			},
			delImg(index) {
				this.imgList.splice(index,1)
			},
			toSave() {
				this.$emit('addSuccess',{remarks:this.remarks,imgList:this.imgList})
				this.$refs.popup.close()
			},
			close() {
				this.$refs.popup.close()
				this.$emit('closeContent')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_area {
		background-color: #fff;
		padding: 30rpx 20rpx;
		padding-bottom: 30rpx;
		color: #999;
		font-size: 32rpx;
		.area_head {
			margin-bottom:24rpx;
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