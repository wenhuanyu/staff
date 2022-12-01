<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">到账时间</view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view :class="payment_date ? 'valueActive' : '' ">
						{{payment_date ? payment_date : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<!-- 附件 -->
		<upload-img title="凭证" :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="remarks" :class="remarks ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="toSubmit">提交</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL, BASE_URL, SIGN_NO } from '@/api/http.js'
	import { netInputVoucher, uploadUrl } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				imgList:[],
				id:'',
				payment_date:'',
				remarks:''
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
			//删除 图片
			delImg(index) {
				this.imgList.splice(index,1)
			},
			changeTime(e) {
				this.payment_date = e.detail.value
			},
			toSubmit() {
				if(!this.payment_date){
					uni.showToast({
						title:'请选择到账时间',
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
					payment_date:this.payment_date,
					file_ids:arr.join(','),
					remarks:this.remarks
				}
				netInputVoucher(params).then(res=>{
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
	.fllow_area {
		background-color: #fff;
		padding:24rpx 40rpx 24rpx 50rpx;
		// border-bottom:1rpx solid #f5f5f5;
		margin-bottom: 30rpx;
		.area_head {
			margin-bottom:15rpx;
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
		padding:24rpx 30rpx;
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
			width: 75rpx;
			height: 75rpx;
			margin-right: 24rpx;
			position: relative;
			margin-bottom: 24rpx;
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
			.addselfimg{
				width: 75rpx;
				height: 75rpx;
			}
			.selfimg {
				width: 75rpx;
				height: 75rpx;
			}
		}
	}
</style>
