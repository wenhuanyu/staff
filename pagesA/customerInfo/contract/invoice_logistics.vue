<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">物流单号<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="invoice_logistics_number" placeholder-style="color:#999;font-size:24rpx;" placeholder="请输入物流单号" class="rightinput" :class="invoice_logistics_number ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">发货时间<span>*</span></view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view :class="invoice_date ? 'valueActive' : '' ">
						{{invoice_date ? invoice_date : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<!-- 附件 -->
		<upload-img :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="button" @click="$noMultipleClicks(sureSubmit)">提交</view>
	</view>
</template>

<script>
	import { netContractInvoice } from '@/api/api.js'
	import { getNowTime } from '@/utils/util.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				id:'',
				invoice_date:'',
				imgList:[],
				invoice_logistics_number:''
			}
		},
		onLoad(options) {
			this.id = options.id
			this.invoice_date = getNowTime()
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
				this.invoice_date = e.detail.value
			},
			sureSubmit(){
				if(!this.invoice_logistics_number){
					uni.showToast({
						title:'请填写物流单号',
						icon:'none'
					})
					return
				}
				if(this.imgList.length == 0) {
					uni.showToast({
						title:'请上传发货凭证',
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
					invoice_file_ids:arr.join(','),
					invoice_date:this.invoice_date,
					invoice_logistics_number:this.invoice_logistics_number,
				}
				netContractInvoice(params).then(res=>{
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
