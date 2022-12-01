<template>
	<view class="">
		<view class="fllow_form">
			<view><text>*</text>是否继续跟进</view>
			<view class="form_right">
				<radio-group @change="changeRelation" class="labellist">
					<label class="" class="labelbox">
						<radio color="#008EFF" :value="0" :checked="type == 0" />否
					</label>
					<label class="" class="labelbox">
						<radio color="#008EFF" :value="1" :checked="type == 1" />是
					</label>
				</radio-group>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head">备注信息</view>
			<textarea v-model="remarks" :class="remarks ? 'valueActive' : '' "placeholder="备注信息" placeholder-style="color:#999" />
		</view>
		<view class="" v-if="type == 1">
			<view class="fllow_form" v-if="relation_type == 1">
				<view><text>*</text>客户状态</view>
				<picker @change="changeStatus" :value="statusIndex" :range="statusList">
					<view class="form_right">
						<view :class="statusList[statusIndex] ? 'valueActive' : '' ">{{statusList[statusIndex] ? statusList[statusIndex] : '点击选择'}}</view>
						<view class="iconfont icon-arrows_right"></view>
					</view>
				</picker>
			</view>
			<view class="fllow_form">
				<view><text>*</text>跟进类型</view>
				<picker @change="changeFollow" :value="followIndex" :range="followList">
					<view class="form_right">
						<view :class="followList[followIndex] ? 'valueActive' : '' ">{{followList[followIndex] ? followList[followIndex] : '点击选择'}}</view>
						<view class="iconfont icon-arrows_right"></view>
					</view>
				</picker>
			</view>
			<view class="fllow_form">
				<view><text>*</text>下次跟进时间</view>
				<!-- #ifdef MP-WEIXIN || H5 || APP-PLUS-->
				<picker @change="changeTime" mode="multiSelector" :range="dateTimeArray" :value="dateTime">
					<view class="form_right">
						<view :class="next_time ? 'valueActive' : '' ">{{next_time ? next_time : '点击选择'}}</view>
						<view class="iconfont icon-arrows_right"></view>
					</view>
				</picker>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<picker @change="changeAlipayTime" mode="date">
					<view class="form_right">
						<view :class="next_time ? 'valueActive' : '' ">{{next_time ? next_time : '点击选择'}}</view>
						<view class="iconfont icon-arrows_right"></view>
					</view>
				</picker>
				<!-- #endif -->
			</view>
			<view class="fllow_form">
				<view style="padding-left: 27rpx;">上传附件</view>
				<view class="form_right" @click="uploadClick">
					<view>选择附件</view>
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</view>
			<u-action-sheet
				:list="uploadActions" 
				v-model="uploadShow"
				@click="uploadType"
			></u-action-sheet>
			
			<view class="imglist" v-if="imgList.length != 0">
				<view class="imgbox" v-for="(item,imgindex) in imgList" :key="imgindex">
					<image :src="BASE_IMG_URL+'close.png'" class="delimg" @click="delImg(imgindex)" mode="scaleToFill"></image>
					<image :src="item.file_path" class="selfimg" @click="openCommonImg(imgList,imgindex)" mode="scaleToFill"></image>
				</view>
			</view>
			<view class="fllow_file_li" v-if="fileList.length != 0">
				<view class="fil_li" v-for="(item,fileindex) in fileList" :key="fileindex">
					<image :src="BASE_IMG_URL+'fujian.png'" class="fileimg" mode="scaleToFill"></image>
					<view class="filename" @click="openCommonFile(item)">{{item.name}}</view>
					<image :src="BASE_IMG_URL+'close.png'" class="closeimg" @click="delFile(fileindex)" mode="scaleToFill"></image>
				</view>
			</view>
			<view class="fllow_area">
				<view class="area_head"><text>*</text>跟进内容</view>
				<textarea v-model="content" :class="content ? 'valueActive' : '' "placeholder="勤跟进,多签单" placeholder-style="color:#999" />
			</view>
			<examine-template :remindPeople="remindPeople" :flag="false" title="提醒谁看" @delExamine="delRemind"></examine-template>
		</view>
		<view class="btn_g bg-blue button-hover round" @click="$noMultipleClicks(saveParams)">
			保存
		</view>
		
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/util/api.js'
	import { commonF } from '@/common/common'
	import { netSelect, netContinueIsFollow } from '@/api/kehu.js'
	import { netMapKey } from '@/api/login.js'
	import { uploadUrl } from '@/api/index.js'
	import {
		dateTimePicker,
		getMonthDay
	} from '@/util/dateTimePicker.js'
	var QQMapWX;
	var qqmapsdk;
	
	export default{
		mixins: [commonF],
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				type:0,
				content:'',
				remarks:'',
				//跟进类型
				followList: [], 
				followIndex: null,
				statusList: [], //客户状态
				statusIndex: null,
				next_time:'',  //下次跟进时间
				//上传附件
				imgList: [],
				fileList: [],
				// #ifdef MP-WEIXIN
				uploadActions: [
					{
						id: 1,
						text: '拍照',
						color: '#008EFF'
					},
					{
						id: 2,
						text: '从相册中选择',
						color: '#008EFF'
					},
					{
						id: 3,
						text:'上传文件',
						color: '#008EFF'
					}
				],
				// #endif
				// #ifdef H5 || APP-PLUS
				uploadActions: [
					{
						id: 1,
						text: '拍照',
						color: '#008EFF'
					},
					{
						id: 2,
						text: '从相册中选择',
						color: '#008EFF'
					}
				],
				// #endif
				remindPeople: [], //提醒谁看
				examineType:'record',
				dateTime: null,
				dateTimeArray: null,
				dateArr: null,
				uploadShow:false,
				//用户位置
				mapKey:'',
				lng:'',
				lat:'',
				address:'',
				record_id:'',
				relation_type:'',
				relation_id:''
			}
		},
		onLoad(options) {
			this.record_id = options.id
			this.relation_id = options.relation_id
			this.relation_type = options.relation_type
			
			this.initTime()
			//获取位置
			this.getLocation()
			this.getSelectList()
		},
		methods:{
			getSelectList() {
				netSelect().then(res => {
					this.followList = res.data['跟进类型']
					this.statusList = res.data['客户状态']
				})
			},
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					altitude: true,
					isHighAccuracy: true,
					success:(data)=>{
						this.lng = data.longitude
						this.lat = data.latitude
						this.getKey()
					},
					fail: (err) => {
						uni.showToast({
							title:'次数频繁，请稍后再试',
							icon:'none'
						})
					}
				})
			},
			//获取地图key
			getKey() {
				netMapKey().then(res=>{
					if(res.data.map_key){
						this.mapKey = res.data.map_key
						QQMapWX = require('../../../util/qqmap-wx-jssdk.min.js')
						qqmapsdk = new QQMapWX({
							key: res.data.map_key // 必填
						})
						// #ifndef H5
						//地址逆解析
						qqmapsdk.reverseGeocoder({
							location: {
								longitude: this.lng,
								latitude: this.lat
							},
							success: (re) => {
								this.address = re.result.address
							}
						})
						// #endif
						// #ifdef H5
						this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1',{
							key:this.mapKey,
							output:'jsonp',
							location:`${this.lat},${this.lng}`,
							get_poi:'1'
						}).then(res=>{
							this.address = res.result.address_component.province+res.result.address_component.city+res.result.formatted_addresses.rough
						})
						// #endif
					}else{
						uni.showToast({
							title:'请在后台配置地图key',
							icon:'none'
						})
					}
				})
			},
			initTime() {
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let obj = dateTimePicker()
				// 精确到分的处理，将数组的秒去掉
				let lastArray = obj.dateTimeArray.pop();
				let lastTime = obj.dateTime.pop();
				let lastDate = obj.dateArray.pop()
			
				this.dateTimeArray = obj.dateTimeArray
				this.dateTime = obj.dateTime
				this.dateArr = obj.dateArray
			},
			//跟进时间
			changeTime(e) {
				let arr = e.detail.value
				let str = this.handleTime(arr)
				this.next_time = str
			},
			changeAlipayTime(e) {
				this.next_time = e.detail.value
			},
			handleTime(arr) {
				let year = this.dateArr[0][arr[0]]
				let month = this.dateArr[1][arr[1]]
				let day = this.dateArr[2][arr[2]]
				let hour = this.dateArr[3][arr[3]]
				let minu = this.dateArr[4][arr[4]]
				let str = year + '-' + month + '-' + day +' '+hour+':'+minu
				return str
			},
			// 上传附件
			uploadClick() {
				this.uploadShow = true
			},
			onCancel() {
				this.uploadShow = false
			},
			uploadType(index) {
				if (index == 0) {
					//拍照
					uni.chooseImage({
						sourceType: ['camera'],
						sizeType:['compressed'],
						success: (res) => {
							let file = res.tempFilePaths
							file.forEach(ele=>{
								this.uploadFile(ele, 1)
							})
						}
					})
				} else if (index == 1) {
					//相册 选择
					uni.chooseImage({
						sourceType: ['album'],
						sizeType:['compressed'],
						success: (res) => {
							let file = res.tempFilePaths
							file.forEach(ele=>{
								this.uploadFile(ele, 1)
							})
						}
					})
				} else {
					//选择文件
					wx.chooseMessageFile({
						count: 1,
						type: 'file',
						success: (res) => {
							let file = res.tempFiles[0]
							this.uploadFile(file, 2)
						},
						fail: (err) => {
							console.log(err)
						}
					})
				}
			},
			//type  上传图片1  或  文件2
			uploadFile(file, type) {
				uni.uploadFile({
					url: uploadUrl,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token')
					},
					// #ifdef MP-ALIPAY
					fileType:'image',
					// #endif
					filePath: type == 1 ? file : file.path,
					formData:{name:type == 2 ? file.name : ''},
					success: (res) => {
						let data = JSON.parse(res.data)
						this.uploadShow = false
						if(data.code == 1) {
							if (type == 1) {
								let obj = {
									id:data.data.id,
									file_path:data.data.url
								}
								this.imgList.push(obj)
							} else {
								let fileobj = {
									id:data.data.id,
									file_path:data.data.url
								}
								// file.url = data.data
								file = Object.assign({}, file, fileobj)
								this.fileList.push(file)
							}
						}else{
							uni.showToast({
								title:'上传失败',
								icon:'none'
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//删除 图片
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//删除  文件
			delFile(index) {
				this.fileList.splice(index, 1)
			},
			changeRelation(e) {
				this.type = e.detail.value
				this.content = ''
			},
			//跟进类型
			changeFollow(e) {
				this.followIndex = e.detail.value
			},
			//客户状态
			changeStatus(e) {
				this.statusIndex = e.detail.value
			},
			saveParams() {
				if(this.type == 0) {
					this.handleFir()
				}else if(this.type == 1){
					this.handleSec()
				}
			},
			//不再跟进
			handleFir() {
				let params = {
					type:this.type,
					remarks:this.remarks,
					record_id:this.record_id,
					relation_type:this.relation_type,
					type:this.type
				}
				netContinueIsFollow(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none',
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})
			},
			//继续跟进
			handleSec() {
				if(this.relation_type == 1 && !this.statusList[this.statusIndex]){
					uni.showToast({
						title:'请选择客户状态',
						icon:'none'
					})
					return
				}
				if(!this.followList[this.followIndex]){
					uni.showToast({
						title:'请选择跟进类型',
						icon:'none'
					})
					return
				}
				if(!this.next_time){
					uni.showToast({
						title:'请选择下次跟进时间',
						icon:'none'
					})
					return
				}
				if(!this.content){
					uni.showToast({
						title:'请填写跟进内容',
						icon:'none'
					})
					return
				}
				let files = '' //上传附件
				let arr = []
				this.imgList.forEach(ele => {
					arr.push(ele.id)
				})
				this.fileList.forEach(ele => {
					arr.push(ele.id)
				})
				let remarr = []
				this.remindPeople.forEach(ele => {
					remarr.push(ele.id)
				})
				let params = {
					files:arr.join(','),
					reminds_id:remarr.join(','),
					follow_type:this.followList[this.followIndex],
					next_time:this.next_time,
					content:this.content,
					relation_id:this.relation_id,
					relation_type:this.relation_type,
					lng:this.lng,
					lat:this.lat,
					location:this.address,
					remarks:this.remarks,
					type:this.type,
					record_id:this.record_id,
				}
				netContinueIsFollow(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none',
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	radio{
		transform: scale(0.6);
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 40rpx 30rpx 47rpx;
		font-size: 32rpx;
		color: #999999;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
	}
	.fllow_area {
		background-color: #fff;
		padding: 0 55rpx;
		font-size: 32rpx;
		color: #999999;
		padding-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
	
			text {
				color: #f00;
			}
		}
		textarea {
			height: 300rpx;
			padding: 30rpx;
			background: #f8f8f8;
			border-radius: 15rpx;
			margin: 0 auto;
		}
	}
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
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
			border: 1rpx solid #EAEAEA;
	
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
	.fllow_file_li {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		.fil_li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 14rpx;
			padding-top:15rpx;
			border-bottom:1rpx solid #f5f5f5;
			.fileimg {
				width: 20rpx;
				height: 20rpx;
			}
	
			.filename {
				font-size: 24rpx;
				color: #999999;
			}
	
			.closeimg {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
</style>