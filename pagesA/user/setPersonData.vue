<template>
	<view class="set_person_data">
		<view class="set_head">
			<view class="set_img">
				<image :src="img ? img : '/static/index/header.png'" ></image>
			</view>
			<view class="set_name" @click="changeHeaderImg">
				<view class="set_header">修改头像</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="label">姓名</view>
			<view class="form_input">
				<input type="text" v-model="name" placeholder="姓名" />
			</view>
		</view>
		<view class="fllow_form">
			<view class="label">部门职务</view>
			<view class="form_input">
				<input type="text" v-model="post" placeholder="点击填写" />
			</view>
		</view>
		<view class="fllow_form">
			<view class="label">员工编号</view>
			<view class="form_input">
				<input type="number" v-model="num" placeholder="点击填写" />
			</view>
		</view>
		<view class="fllow_form">
			<view class="label">性别</view>
			<picker @change="changeSex" :range="sexList" :range-key="'name'" :value="sexIndex">
				<view class="form_right">
					<view>{{sex == 1 ? '男' : '女'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_form">
			<view class="label">邮箱</view>
			<view class="form_input">
				<input type="text" style="width:400rpx;" :disabled="email" v-model="email" placeholder="点击填写邮箱" />
			</view>
		</view>
		<view class="fllow_form">
			<view class="label">手机号</view>
			<view class="form_input">
				<button type="default" class="buttonNumber" @getphonenumber="getPhone" open-type="getPhoneNumber">{{mobile?mobile:'获取手机号'}}</button>
			</view>
		</view>
		<view class="fllow_form">
			<view class="label">部门</view>
			<view class="form_input">
				<view>{{department_name ? department_name : ''}}</view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="label">我的上级</view>
			<view class="form_input">
				<view>{{parent_name ? parent_name : ''}}</view>
			</view>
		</view>
		<view class="button" @click="saveInfo">保存</view>
	</view>
</template>

<script>
	import { netGetUserInfo, netEditUserInfo, netBindPhone } from '@/api/user.js'
	import { BASE_URL, SIGN_NO, BASE_IMG_URL } from '@/api/http.js'
	import { uploadUrl } from '@/api/api.js'
	
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				name:'',   //姓名
				img:'',   //头像
				email:'',  //邮箱
				sex:'',   //性别   1男   2女
				post:'',   //岗位
				num:'',    //员工编号
				mobile:'',  //手机号
				department_id:'',  //部门id
				department_name:'',   //部门名称
				parent_id:'',  //上级 id
				parent_name:'',  //上级 名称
				sexList:[
					{id:1,name:'男'},
					{id:2,name:'女'}
				],
				sexIndex:null
			}
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				netGetUserInfo().then(res=>{
					res = res.data
					this.id = res.id
					this.name = res.name
					this.img = res.img
					this.email = res.email
					this.sex = res.sex
					this.post = res.post
					this.num = res.num
					this.mobile = res.mobile
					this.department_name = res.department_name
					this.parent_name = res.parent_name
					this.department_id = res.department_id
					this.parent_id = res.parent_id
				})
			},
			changeSex(e) {
				this.sexIndex = e.detail.value
				this.sex = this.sexList[e.detail.value].id
			},
			getPhone(e) {
				if(e.detail.errMsg == "getPhoneNumber:ok"){
					let encryptedData = e.detail.encryptedData
					let iv = e.detail.iv
					let code = ''
					uni.login({
						success:(res)=>{
							code = res.code
							let params = {
								encryptedData,iv,code
							}
							this.bindPhone(params)
						}
					})
				}
			},
			bindPhone(params) {
				netBindPhone(params).then(res=>{
					this.mobile = res.data.mobile
				})
			},
			changeHeaderImg() {
				uni.chooseImage({
					count:1,
					sizeType:['compressed'],
					success:(res)=>{
						let file = res.tempFilePaths[0]
						this.uploadFile(file)
					}
				})
			},
			uploadFile(file){
				uni.uploadFile({
					url:uploadUrl,
					name:'file',
					header:{
						'token':uni.getStorageSync('token'),
						'sign-no':SIGN_NO
					},
					filePath: file,
					success:(res)=>{
						let data = JSON.parse(res.data)
						if(data.code == 1) {
							this.img = data.data.url
						}else{
							uni.showToast({
								title:'上传失败',
								icon:'none'
							})
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			saveInfo() {
				let {
					id,
					name,   //姓名
					img,   //头像
					email,  //邮箱
					sex,   //性别   1男   2女
					post,   //岗位
					num,   //员工编号
					mobile,  //手机号
					department_id,  //部门id
					parent_id,  //上级 id
				} = this
				if(!name){
					uni.showToast({
						title:'请填写姓名',
						icon:'none'
					})
					return
				}
				if(!post){
					uni.showToast({
						title:'请填写部门职务',
						icon:'none'
					})
					return
				}
				if(!mobile){
					uni.showToast({
						title:'请填写手机号',
						icon:'none'
					})
					return
				}
				let params = {
					id,
					name,   //姓名
					img,   //头像
					email,  //邮箱
					sex,   //性别   1男   2女
					post,   //岗位
					num,   //员工编号
					mobile,  //手机号
					department_id,  //部门id
					parent_id,  //上级 id
				}
				netEditUserInfo(params).then(res=>{
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
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx;
		.label{
			color:#666;
		}
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			.icon-you{
				font-size:40rpx;
			}
		}
		.theme {
			color: #5ca9fe;
		}
		.form_input {
			input {
				text-align: right;
				margin-right: 10rpx;
			}
			.buttonNumber{
				width:300rpx;
				background:#fff;
				height: 35rpx;
				line-height: 35rpx;
				font-size:30rpx;
				color:#999;
				padding:0;
				text-align: right;
				&::after{
					border:none;
				}
			}
		}
	}
	.set_person_data {
		font-size: 28rpx;
		.set_head {
			display: flex;
			justify-content: space-between;
			padding: 30rpx;
			background-color: #fff;
			border-bottom: 1rpx solid #EAEAEA;
			.set_img {
				width: 80rpx;
				height: 80rpx;
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
			}
			.set_name {
				display: flex;
				align-items: center;
				.icon-you{
					font-size:40rpx;
					color:#999;
				}
			}
		}
		.set_con {
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 30rpx 0 24rpx;
			border-bottom: 1rpx solid #EAEAEA;
			.con_right {
				display: flex;
			}
		}
		.mar-b {
			margin-bottom: 30rpx;
		}
	}
</style>
