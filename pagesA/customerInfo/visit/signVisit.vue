<template>
	<view>
		<view class="mapbox">
			<map name="" style="width:750rpx;height:400rpx;" id="mapself" :latitude="latitude" :longitude="longitude" :markers="markers"></map>
		</view>
		<view class="locainfo">
			<view class="localeft">
				<image :src="BASE_IMG_URL+'/index/local.png'" class="dingwei" ></image>
				<view class="text">{{address}}</view>
			</view>
		</view>
		<view style="background:#fff;">
			<view class="addcost" v-if="event_process == 3 || event_process == 4" @click="toAddCost">添加费用</view>
			<view class="inp_warp">
				<view class="inp_title">客户:</view>
				<view class="form_right">
					<view :class="customer_name ? 'valueActive' : '' " >
						{{customer_name ? customer_name : '点击选择'}}</view>
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</view>
			<view v-if="event_process == 1 && (this.name.indexOf('上门') != -1)">
				<view class="inp_warp">
					<view class="inp_title key">选择出行方式<span>*</span></view>
					<picker @change="changeTool" :range="toolArray" :value="toolIndex">
						<view class="form_right">
							<view :class="toolArray[toolIndex] ? 'valueActive' : '' ">
								{{toolArray[toolIndex] ? toolArray[toolIndex] : '选择出行方式'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
				<view v-if="toolArray[toolIndex] == '公司车' || toolArray[toolIndex] == '私家车'">
					<view class="inp_warp">
						<view class="inp_title">车牌号历史记录</view>
					</view>
					
					<view class="que_list" style="display: flex;justify-content: flex-start;align-items: center;flex-wrap:wrap;" v-if="numberList.length != 0">
						<view class="que_li" style="border:none;flex-shrink: 0;margin:15rpx;padding:0" v-for="(item,index) in numberList" :key="index" @click="selectNumber(item)">
							<radio value="item" color="#008EFF" :checked="car_number == item" />
							<view class="que_titq">{{item}}</view>
						</view>
					</view>
					
					<view class="inp_warp">
						<view class="inp_title key">车牌号<span>*</span></view>
						<view class="form_right">
							<input type="text" v-model="car_number" placeholder-style="font-size:24rpx;color:#999;" placeholder="请输入车牌号" class="rightinput" :class="car_number ? 'valueActive' : '' ">
							<image :src="BASE_IMG_URL+'/index/upload_car.png'" class="paizhaoimg"  @click="uploadChepai"></image>
						</view>
					</view>
					<view class="inp_warp">
						<view class="inp_title key">起始公里数<span>*</span></view>
						<view class="form_right">
							<input 
								type="number" 
								v-model="start_mileage" 
								placeholder-style="font-size:24rpx;color:#999;" 
								placeholder="请输入起始公里数" 
								class="rightinput" 
								@blur="checkMileage"
								:class="start_mileage ? 'valueActive' : '' "
							>
						</view>
					</view>
				</view>
			</view>
			<view v-if="event_process == 3">
				<view class="fllow_form">
					<view class="key">达到目的<span>*</span></view>
					<view class="form_right" @click="toSelectAchieve">
						<view>请选择</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="que_list" v-if="achievegoal.length != 0">
					<view class="que_li" v-for="(item,index) in achievegoal" :key="index">
						<view class="iconfont icon-jian" @click="delAchieve(index)"></view>
						<view class="que_titq">{{item.field}}</view>
					</view>
				</view>
				<view class="fllow_form">
					<view class="key">下一行程<span>*</span></view>
					<picker @change="changeTrip" :range="triplist" :value="tripIndex">
						<view class="form_right">
							<view :class="{'valueActive':triplist[tripIndex]}">{{triplist[tripIndex] ? triplist[tripIndex] : '请选择下一行程'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
			</view>
			<!-- 上传图片 -->
			<upload-img :imgList="imgList" @uploadImg="uploadImg" istype="camera" @delImg="delImg"></upload-img>
			
			<view class="fllow_area">
				<view class="area_head" style="margin:20rpx 0;">备注:</view>
				<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="备注"
					placeholder-style="color:#999" />
			</view>
		</view>
		<view style="height:120rpx"></view>
		<view class="savebox">
			<view class="button" @click="$noMultipleClicks(toAdd)">保存</view>
		</view>
	</view>
</template>

<script>
	import { SIGN_NO, BASE_URL, BASE_IMG_URL } from '@/api/http.js'
	import { netAddSignin, netHistoryHumber, netEndKilometers, netOcrDistinguish, uploadUrl, netLngTransAddress } from '@/api/api.js'
	import { mapState } from 'vuex'
	
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				noClick: true, //防止  重复点击
				longitude: null,
				latitude: null,
				markers: [],
				address: '',
				imgList: [],
				customer_name:'',  //客户名称
				customer_id:'',   //客户id

				location: '', //地址 
				lng: '',
				lat: '',
				files: '',
				content: '',
				event_id:'',   //任务id
				event_process:'',    //1 开始 2 到达 3 拜访完成  4 返程签到
				resultType:[
					{id:1,name:'是'},
					{id:2,name:'否'}
				],
				resultIndex:0,
				//行程
				triplist:['返程','拜访下一家'],
				tripIndex:0,
				//出行方式
				toolArray:['公司车','私家车','公交车','出租车','飞机','火车','其他'],  //工具
				toolIndex:0,
				name:'',   //任务 预期目的
				isShowTool:false,
				car_type:'',   //出行方式
				start_mileage:'',   //起始公里数
				car_number:'',
				numberList:[]
			}
		},
		onLoad(options) {
			this.event_process = options.type
			this.event_id = options.eventid
			this.customer_name = options.cusname
			this.customer_id = options.customerid
			
			if(this.event_process == 1){
				uni.setNavigationBarTitle({
					title:'开始工作'
				})
			}else if(this.event_process == 2){
				uni.setNavigationBarTitle({
					title:'到达签到'
				})
			}else if(this.event_process == 3) {
				uni.setNavigationBarTitle({
					title:'完成任务'
				})
			}else if(this.event_process == 4) {
				uni.setNavigationBarTitle({
					title:'返程签到'
				})
			}
			
			this.name = options.name
			this.isShowTool = this.name.indexOf('上门') != -1
			//获取位置
			this.getAddressinfo()
			//获取车牌历史记录
			this.handleHistoryCar()
			
		},
		computed:mapState({
			achievegoal: state => state.customer.achievegoal
		}),
		methods: {
			//校验 开始公里数 是否为数字
			checkMileage(e) {
				if(isNaN(Number(this.start_mileage))){
					uni.showToast({
						title:'开始公里数只能为数字/不能有空格',
						icon:'none'
					})
					this.start_mileage = ''
				}
			},
			//上传车牌号
			uploadChepai() {
				uni.chooseImage({
					count:1,
					success:(res)=>{
						let data = res.tempFilePaths[0]
						uni.uploadFile({
							url:uploadUrl,
							name:'file',
							header:{
								'token':uni.getStorageSync('token'),
								'sign-no':SIGN_NO
							},
							filePath: data,
							success:(res)=>{
								let data = JSON.parse(res.data)
								this.ocrImg = data.data
								let params = {
									type_id:13,
									file_id:data.data.id
								}
								netOcrDistinguish(params).then(res=>{
									this.car_number = res.data.number
									//通过车牌号 查询开始公里数
									this.handleStart()
								})
							},
							fail:(err)=>{
								console.log(err)
							}
						})
						
					}
				})
			},
			//查看车牌号 图片
			toPreChepaihao() {
				let img = this.ocrImg.url
				uni.previewImage({
					urls: [img]
				})
			},
			//从历史记录 里边选择车牌号
			selectNumber(item) {
				this.car_number = item
				this.handleStart()
			},
			//获取历史 车牌记录
			handleHistoryCar() {
				netHistoryHumber().then(res=>{
					this.numberList = res.data
				})
			},
			//通过车牌号 查询上次的 公里数
			handleStart() {
				netEndKilometers({car_number:this.car_number}).then(res=>{
					this.start_mileage = res.data.end_mileage
				})
			},
			toSelectAchieve() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/achieve_goal'
				})
			},
			//删除 达到目的
			delAchieve(index) {
				this.achievegoal.splice(index,1)
			},
			//下一行程
			changeTrip(e) {
				this.tripIndex = e.detail.value
			},
			//选择出行方式
			changeTool(e) {
				this.toolIndex = e.detail.value
			},
			getAddressinfo() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						console.log(res, '获取位置')
						this.longitude = res.longitude
						this.latitude = res.latitude
						this.markers = [{
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../../static/index/weizhi.png',
							width: 30,
							height: 30
						}]
						//地址逆解析
						let params = {
							lat: res.latitude,
							lng: res.longitude
						}
						netLngTransAddress(params).then(data=>{
							data = data.data.result
							this.address = data.address
						})
					},
					fail: (err) => {
						console.log(err, '错误')
						uni.showToast({
							title:'请允许使用位置信息',
							icon:'none'
						})
					}
				})
			},
			againRepos() {
				this.address = ''
				this.getAddressinfo()
			},
			radioChange(e) {
				this.resultIndex = e.detail.value
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//保存
			toAdd() {
				let {
					longitude,
					latitude,
					address,
					imgList,
					content,
					event_id,
					event_process,
					car_number
				} = this
				let car_type = this.toolArray[this.toolIndex]
				if((car_type == '公司车' || car_type == '私家车') && !this.start_mileage){
					uni.showToast({
						title:'请填写起始公里数',
						icon:'none'
					})
					return
				}
				if((car_type == '公司车' || car_type == '私家车') && !this.car_number){
					uni.showToast({
						title:'请填写车牌号',
						icon:'none'
					})
					return
				}
				if(imgList.length == 0) {
					uni.showToast({
						title: '请上传附件',
						icon: 'none'
					})
					return
				}
				if(event_process == 3 && this.achievegoal.length == 0) {
					uni.showToast({
						title:'请选择达到目的',
						icon:'none'
					})
					return
				}
				let visitarr = []
				this.achievegoal.forEach(ele=>{
					visitarr.push(ele.field)
				})
				
				let files = ''
				let arr = []
				imgList.forEach(item => {
					arr.push(item.id)
				})
				files = arr.join(',')
				let params = {
					location: address,
					lng: longitude,
					lat: latitude,
					file_ids:files,
					content,
					event_id,
					event_process,
					last_event:this.triplist[this.tripIndex],
					achieve_purpose:visitarr.join(','),
					car_type:this.toolArray[this.toolIndex],
					start_mileage:this.start_mileage,
					car_number
				}
				netAddSignin(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})
			},
			//添加费用
			toAddCost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost?customerid='+this.customer_id+'&relationid='+this.event_id+'&event_type=event'
				})
			}
		}
	}
</script>
<style>
	radio{
		transform: scale(0.6);
	}
</style>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:24rpx 40rpx 24rpx 50rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
	}
	.que_list{
		border-bottom: 1rpx solid #EAEAEA;
		padding:0 45rpx 0 50rpx;
		.que_li{
			background-color: #fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:24rpx 0;
			border-bottom: 1rpx solid #EAEAEA;
			&:last-child{
				border-bottom:0;
			}
			.icon-jian{
				font-size:40rpx;
				color:#ff7800;
				margin-right:30rpx;
			}
			.que_title{
				font-size:24rpx;
				color:#333;
			}
		}
	}
	.valueActive {
		color: #333;
	}
	.mapbox {
		width: 750rpx;
		height: 400rpx;

	}

	.locainfo {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;

		.localeft {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.dingwei {
				width: 30rpx;
				height: 30rpx;
				margin-right: 15rpx;
			}

			.text {
				font-size: 26rpx;
				color: #333;
			}
		}

		.locaright {
			font-size: 26rpx;
			color:$uni-text-color;
		}
	}
	.addcost{
		width:200rpx;
		height:60rpx;
		background:#bcbcbc;
		border-radius: 10rpx;
		font-size:26rpx;
		color:#fff;
		line-height: 60rpx;
		text-align: center;
		margin-bottom:24rpx;
		margin-left:34rpx;
	}
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #CCC;
		.inp_title {
			font-size: 26rpx;
			color: #666;
		}

		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			input{
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin-left:24rpx;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.radiobox{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}

	.fllow_area {
		background: #fff;
		box-sizing: border-box;
		padding:30rpx;
		.area_head {
			margin-bottom: 10rpx;
			color:#666;
		}
		textarea {
			width: 590rpx;
			background: #f5f5f5;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 0 auto;
		}
	}

	.savebox {
		width: 750rpx;
		height: 120rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1rpx solid #CCC;
		z-index: 2;
	}

	.imglist {
		padding: 24rpx 50rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		.imgbox {
			width: 180rpx;
			height: 180rpx;
			margin-right: 50rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EAEAEA;
			&:nth-child(3n){
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
				width: 180rpx;
				height: 180rpx;
			}
		}
	}
</style>
