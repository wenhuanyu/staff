<template>
	<view class="container">
		<view class="wrapper">
			<!-- logo -->
			<view class="titbox">
				<view class="firtit">{{info.mobile_name}}</view>
				<!-- <view class="sectit">实现客户到工单全流程管理</view> -->
			</view>
			<!-- 表单 -->
			<view class="login-box">	
				<view class="input-item">
					<view class="itemtit">手机号</view>
					<view class="itembot">
						<image class="phoneimg" :src="BASE_IMG_URL+'/index/phone1.png'" ></image>
						<input 
							type="text" 
							placeholder="请输入账号" 
							placeholderStyle="color:#999;font-size:30rpx"
							class="inp"
							v-model="account"
						>	
					</view>
				</view>
				<view class="input-item">
					<view class="itemtit">密码</view>
					<view class="itembot">
						<image class="suoimg" :src="BASE_IMG_URL+'/index/suo1.png'" ></image>
						<input class="inp" v-model="password" v-if="!showPassword" type="text" password placeholder="请输入密码" placeholder-class="pl" />
						<input class="inp" v-model="password" v-if="showPassword" type="text" placeholder="请输入密码" placeholder-class="pl" />
						<image :src="BASE_IMG_URL+'/index/nosee1.png'" v-if="!showPassword" @click="showPassword = true" class="eayimg" ></image>
						<image :src="BASE_IMG_URL+'/index/see1.png'" v-if="showPassword" @click="showPassword = false" class="eayimg" ></image>
					</view>
				</view>
			</view>
			<view class="tipwarp">
				<view class="tipp" @click="rememberPass"><radio value="" color="#008EFF" style="transform: scale(0.7);" :checked="remember" />记住账号密码</view>
			</view>
			<!-- 登录按钮 -->
			<view class="button" @tap="toLogin">登录</view>
			<!-- <view class="freelogin" @click="freeLogin">暂不登录，进行演示</view> -->
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { a_login, defaultInfo, login_text } from '@/api/api'
	
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				account:'',
				showPassword:false,
				password:'',
				info:{},
				remember:false,  //记住账号密码
			};
		},
		onShow() {
			this.account = uni.getStorageSync('commonAccount') ? uni.getStorageSync('commonAccount') : ''
			this.password = uni.getStorageSync('commonPass') ? uni.getStorageSync('commonPass') :''
			this.remember = uni.getStorageSync('commonRemember')
			//获取默认头部信息
			this.getDefInfo()
		},
		methods: {
			//记住账号 密码
			rememberPass() {
				this.remember = !this.remember
			},
			getDefInfo() {
				defaultInfo().then(res=>{
					this.info = res.data
					uni.setStorageSync('appid',res.data.appid)
				})
			},
			jump(path, query) {
				this.$Router.push({
					path: path,
					query: query
				});
			},
			toLogin() {
				if(!this.account){
					uni.showToast({
						title:'请填写账号',
						icon:'none'
					})
					return
				}
				if(!this.password){
					uni.showToast({
						title:'请填写密码',
						icon:'none'
					})
					return
				}
				let params = {
					account:this.account,
					password:this.password
				}	
				if(this.remember){
					uni.setStorageSync('commonAccount',this.account)
					uni.setStorageSync('commonPass',this.password)
				}else{
					uni.removeStorageSync('commonAccount')
					uni.removeStorageSync('commonPass')
				}
				uni.setStorageSync('commonRemember',this.remember)
				a_login(params).then(res=>{
					this.jumpPage(res)
				})
			},
			jumpPage(res) {
				uni.setStorageSync('userinfo',res.data.userinfo)
				uni.setStorageSync('token',res.data.userinfo.token)
				uni.redirectTo({
					url:'/pages/index/index'
				})
			},
			//暂不登录
			freeLogin() {
				login_text().then(res=>{
					this.jumpPage(res)
				})
			}
		}
	};
</script>

<style lang="scss">
	.freelogin{
		text-align: center;
		font-size:24rpx;
		color:red;
		margin-top:50px;
	}
	.tipwarp{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin:20rpx auto 30rpx;
		width:630rpx;
		.tipp{
			font-size:24rpx;
			color:$uni-text-color;
		}
	}
	.wrapper {
		position: absolute;
		z-index: 90;
		padding-bottom: 40upx;
		width: 100%;
		.titbox{
			padding:90rpx 0 100rpx;
			.firtit{
				font-size:48rpx;
				color:$uni-text-color;
				font-weight: bold;
				text-align: center;
			}
			.sectit{
				font-size:32rpx;
				color:#999999;
				margin-top:30rpx;
				text-align: center;
			}
		}
		// 输入
		.login-box {
			margin:0 auto;
			.input-item {
				padding:26rpx 30rpx;
				border-bottom: 1rpx solid #c7c7c7;
				width: 630rpx;
				margin:0 auto 50rpx;
				&:last-child{
					margin:0 auto 0;
				}
				.itemtit{
					font-size:30rpx;
					color:#666666;
					margin-bottom:40rpx;
				}
				.itembot{
					display: flex;
					justify-content: flex-start;
					align-items: center;
				}
				.phoneimg{
					width:41rpx;
					height:40rpx;
				}
				.suoimg{
					width:40rpx;
					height:44rpx;
				}	
				.inp {
					width:460rpx;
					margin-left:30rpx;
					font-size: 28rpx;
				}
				.pl {
					font-size:30rpx;
					color: #999999;
				}
				.eayimg{
					margin-left:30rpx;
					width:33rpx;
					height:33rpx;
				}
			}
		}
		.li_box{
			margin:40rpx auto 0;
			width:690rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:0 30rpx;
			font-weight: 700;
			.register{
				font-size:26rpx;
				color:#333333;
			}
			.forgot{
				font-size:26rpx;
				color:#333333;
			}
		}
		// 登录
		
	}
</style>
