<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">回执时间<span>*</span></view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view :class="receipt_date ? 'valueActive' : '' ">
						{{receipt_date ? receipt_date : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<!-- 附件 -->
		<upload-img title="回执凭证" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="button" @click="$noMultipleClicks(sureSubmit)">提交</view>
	</view>
</template>

<script>
	import { netContractReceipt } from '@/api/api.js'
	import { getNowTime } from '@/utils/util.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				imgList:[],
				receipt_date:'',
				id:''
			}
		},
		onLoad(options) {
			this.id = options.id
			this.receipt_date = getNowTime()
			
		},
		methods:{
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			changeTime(e) {
				this.receipt_date = e.detail.value
			},
			sureSubmit() {
				if(this.imgList.length == 0) {
					uni.showToast({
						title:'请上传凭证',
						icon:'none'
					})
					return
				}
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					id:this.id,
					receipt_date:this.receipt_date,
					receipt_file_ids:arr.join(',')
				}
				netContractReceipt(params).then(res=>{
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
			.icon-you{
				width:40rpx;
				height:35rpx;
			}
		}
	}
</style>
