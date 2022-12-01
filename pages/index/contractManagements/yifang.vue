<template>
	<view class="">
		<view class="inp_warp">
			<view class="inp_title key">法定代理人</view>
			<view class="form_right">
				<input type="text" adjust-position v-model="legal" placeholder="请填写法定代表人" class="rightinput" :class="legal ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">委托代理人</view>
			<view class="form_right">
				<input type="text" adjust-position v-model="entrust" placeholder="请填写委托代理人" class="rightinput" :class="entrust ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">经办人</view>
			<view class="form_right">
				<input type="text" adjust-position v-model="handler" placeholder="请填写经办人" class="rightinput" :class="handler ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">电话</view>
			<view class="form_right">
				<input type="text" adjust-position v-model="mobile" placeholder="请填写电话" class="rightinput" :class="mobile ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">传真</view>
			<view class="form_right">
				<input type="text" adjust-position v-model="fax" placeholder="请填写传真" class="rightinput" :class="fax ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">开户银行</view>
			<view class="form_right">
				<input type="text" adjust-position v-model="deposit" placeholder="请填写开户银行" class="rightinput" :class="deposit ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">帐号</view>
			<view class="form_right">
				<input type="text" adjust-position v-model="account" placeholder="请填写帐号" class="rightinput" :class="account ? 'valueActive' : '' ">
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureEdit)">提交</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import { netEditContractYifang, netContractDetail } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				//乙方信息
				handler:'',   //经办人
				legal:'',   //法定代表人
				entrust:'',   //委托代理人
				mobile:'',   //电话
				fax:'',   //传真
				account:'',   //帐号
				deposit:'',   //开户行
				id:'',  //合同id
			}
		},
		onLoad(options) {
			this.id = options.id
			//获取乙方信息
			this.getDetail()
		},
		methods:{
			//获取合同 详情信息
			getDetail() {
				netContractDetail({id:this.id}).then(res=>{
					res = res.data
					this.handler = res.handler
					this.legal = res.legal
					this.entrust = res.entrust
					this.mobile = res.mobile
					this.fax = res.fax
					this.account = res.account
					this.deposit = res.deposit
				})
			},
			sureEdit() {
				let params = {
					id:this.id,
					handler:this.handler,
					legal:this.legal,
					entrust:this.entrust,
					mobile:this.mobile,
					fax:this.fax,
					account:this.account,
					deposit:this.deposit
				}
				netEditContractYifang(params).then(res=>{
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
			color:#666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			.rightinput{
				width:100%;
				text-align: right;
			}
			.right_btn{
				font-size:24rpx;
				color:#03AA96;
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#03AA96;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#03AA96;
				margin-right:5rpx;
			}
		}
	}
</style>