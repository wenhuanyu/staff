<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="fllow_form">
			<view class="key">收款金额<span>*</span></view>
			<view class="form_right">
				<input type="text" disabled :class="money ? 'valueActive' : '' "  v-model="money" placeholder="填写收款金额" />
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">收款方式<span>*</span></view>
			<picker @change="changePay"  :value="payIndex" :range="payList" >
				<view class="form_right">
					<view :class="payList[payIndex] ? 'valueActive' : '' ">{{payList[payIndex] ? payList[payIndex] : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<!-- 上传附件 -->
		<upload-img :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="button" v-if="payList[payIndex] == '微信'" @click="getEwm">获取微信收款码</view>
		<view class="button" @click="$noMultipleClicks(surePay)">确认收款信息</view>
		
		<!-- 微信收款码 -->
		<view class="ewm_warp" v-if="showEwm" @tap.stop="showEwm = false">
			<view class="ewm_box" @tap.stop.prevent>
				<image :src="ewmUrl" class="ewmimg"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_URL, BASE_IMG_URL, SIGN_NO } from '@/api/http.js'
	import { netGenerEwm } from '@/api/template.js'
	import { netPaymentMethod, netTopayWorkorder, netWatchPayEwm,  } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				money:'',
				workorderid:'',
				imgList:[],
				payList:[],
				payIndex:0,
				showEwm:false,
				ewmUrl:''
			}
		},
		onLoad(options) {
			this.money = options.money
			this.workorderid = options.workorderid
			this.getPayList()
		},
		methods:{
			//获取收款方式
			getPayList() {
				netPaymentMethod().then(res=>{
					this.payList = res.data
				})
			},
			//修改 收款方式
			changePay(e) {
				this.payIndex = e.detail.value
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			getEwm() {
				netWatchPayEwm({id:this.workorderid}).then(res=>{
					this.showEwm = true
					this.ewmUrl = BASE_URL+netGenerEwm+'?text='+res.data.code_url
				})
			},
			surePay() {
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
					id:this.workorderid,
					pay_type: this.payList[this.payIndex],
					pay_files:arr.join(',')
				}
				netTopayWorkorder(params).then(res=>{
					uni.showToast({
						title: res.msg,
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
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding:30rpx;
		.nameinput{
			width:500rpx;
		}
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
	}
	.inp_warp {
		padding:24rpx 45rpx 24rpx 50rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #333;
			text{
				color:#F00;
			}
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
			.right_btn{
				font-size:24rpx;
				color:#007AFF;
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#FFA205;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#FFA205;
				margin-right:5rpx;
			}
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
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EDEDED;
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
	
			.selfimg {
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
	.ewm_warp{
		position: fixed;
		left:0;
		right:0;
		top:0;
		bottom:0;
		background:rgba(0,0,0,0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		.ewm_box{
			width:600rpx;
			height:600rpx;
			background:#fff;
			display: flex;
			justify-content: center;
			align-items: center;
			.ewmimg{
				width:500rpx;
				height:500rpx;
			}
		}
	}
</style>
