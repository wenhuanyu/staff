<template>
	<view class="">
		<view class="inp_warp">
			<view class="inp_title key">发票号码</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="invoice_number ? 'valueActive' : '' " placeholder="发票号码" v-model="invoice_number">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">实际开票日期<span>*</span></view>
			<picker mode="date" @change="changeTime">
				<view class="form_right">
					<view class="" :class="invoice_time ? 'valueActive' : '' ">{{invoice_time?invoice_time:'实际开票日期'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">物流单号</view>
			<view class="form_right">
				<input type="text" class="rightinput" :class="logistics ? 'valueActive' : '' " placeholder="物流单号" v-model="logistics">
			</view>
		</view>
		<upload-img :flag="false" :single="1" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="button" @click="$noMultipleClicks(toBiaoji)">
			保存
		</view>
		
	</view>
</template>

<script>
	import { netBiaojiInvoice } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				id:'',
				imgList:[],
				invoice_number:'',
				invoice_time:'',
				logistics:'',
				image:''
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods:{
			changeTime(e) {
				this.invoice_time = e.detail.value
			},
			uploadImg(obj){
				this.imgList.push(obj)
			},
			delImg(index) {
				this.imgList.splice(index,1)
			},
			toBiaoji() {
				if(!this.invoice_time){
					uni.showToast({
						title:'请选择实际开票时间',
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
					invoice_number:this.invoice_number,
					invoice_time:this.invoice_time,
					logistics:this.logistics,
					image:arr.join(',')
				}
				netBiaojiInvoice(params).then(res=>{
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
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
		}
	}
</style>