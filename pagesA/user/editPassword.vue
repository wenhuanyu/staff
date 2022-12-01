<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">旧密码<span>*</span></view>
			<view class="form_right">
				<input type="password" v-model="oldpassword" placeholder="请输入旧密码" class="rightinput" :class="oldpassword ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">新密码<span>*</span></view>
			<view class="form_right">
				<input type="password" v-model="newpassword" placeholder="请输入新密码" class="rightinput" :class="newpassword ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">确认新密码<span>*</span></view>
			<view class="form_right">
				<input type="password" v-model="renewpassword" placeholder="请确认新密码" class="rightinput" :class="renewpassword ? 'valueActive' : '' ">
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(subSave)">确定</view>
	</view>
</template>

<script>
	import { netEditPassword } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				oldpassword:'',
				newpassword:'',
				renewpassword:'',
			}
		},
		methods:{
			subSave() {
				if(!this.oldpassword){
					uni.showToast({
						title:'请输入旧密码',
						icon:'none'
					})
					return
				}
				if(!this.newpassword){
					uni.showToast({
						title:'请输入新密码',
						icon:'none'
					})
					return
				}
				if(!this.renewpassword){
					uni.showToast({
						title:'请确认新密码',
						icon:'none'
					})
					return
				}
				let params = {
					oldpassword:this.oldpassword,
					newpassword:this.newpassword,
					renewpassword:this.renewpassword
				}
				netEditPassword(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.redirectTo({
							url:'/pages/user/index'
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
			color:#666666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.rightinput{
				text-align: right;
			}
			.change_btn{
				width:94rpx;
				height:44rpx;
				border-radius: 22rpx;
				font-size:26rpx;
				text-align: center;
				color:#0287FF;
				border:1rpx solid #0287FF;
				line-height: 42rpx;
				margin-right:15rpx;
			}
			.activebtn{
				background:#0287FF;
				color:#fff;
			}
			.selebox{
				display: flex;
				justify-content: center;
				align-items: center;
				flex-shrink: 0;
				.sele_quhao{
					font-size:34rpx;
					color:$uni-text-color;
				}
				.xiaimg{
					width:24rpx;
					height:14rpx;
					margin-left:10rpx;
				}
			}
			
		}
	}
</style>
