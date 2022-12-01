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
			<view class="que_list" v-if="numberList.length != 0">
				<view class="que_li" v-for="(item,index) in numberList" :key="index" @click="selectNumber(item)">
					<radio value="item" color="#008EFF" :checked="car_number == item" />
					<view class="que_titq">{{item}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title key">车牌号<span>*</span></view>
				<view class="form_right">
					<input type="text" v-model="car_number" placeholder="请输入车牌号" class="rightinput" :class="car_number ? 'valueActive' : '' ">
					<image :src="BASE_IMG_URL+'/index/upload_car.png'" class="paizhaoimg"  @click="uploadChepai"></image>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title key">起始公里数<span>*</span></view>
				<view class="form_right">
					<input type="number" @blur="checkMileage" v-model="start_mileage" placeholder="请输入起始公里数" class="rightinput" :class="start_mileage ? 'valueActive' : '' ">
				</view>
			</view>
		</view>
		<upload-img :imgList="imgList" @uploadImg="uploadImg" istype="camera" @delImg="delImg"></upload-img>
		
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="desc" :class="desc ? 'valueActive' : '' " placeholder="备注"
				placeholder-style="color:#999" />
		</view>
		<view style="height:120rpx"></view>
		<view class="savebox">
			<view class="button" @click="$noMultipleClicks(toAdd)">保存</view>
		</view>
		<select-work-parts ref="partsChild" @selectList="selectParts"></select-work-parts>
	</view>
</template>

<script>
	import { SIGN_NO, BASE_URL, BASE_IMG_URL } from '@/api/http.js'
	import { netWorkOrderStatus, netCompleteWorkorder, netStartWorkOrder,
	 netEndKilometers, netOcrDistinguish, netHistoryHumber, netWorkOrderDetail, uploadUrl, netLngTransAddress } from '@/api/api.js'
	import selectWorkParts from '@/components/selectWorkParts/index'
	import { commonFun } from '@/common/navigate'
	export default {
		mixins:[commonFun],
		components:{
			selectWorkParts
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				noClick: true, //防止  重复点击
				longitude: null,
				latitude: null,
				markers: [],
				address: '',
				imgList: [],

				location: '', //地址 
				lng: '',
				lat: '',
				files: '',
				desc: '',
				workorderid:'',   //工单id
				//配件信息
				partsList:[],
				expected_end_time:'',    //预计完成时间
				//出行方式
				toolArray:['公司车','私家车','公交车','出租车','飞机','火车','其他'],  //工具
				toolIndex:0,
				car_type:'',  //出行方式
				start_mileage:'',   //起始公里数
				car_number:'',   //车牌号
				
				numberList:[],   //历史车牌号
				ocrImg:{}
			}
		},
		onLoad(options) {
			this.workorderid = options.workorderid
			//获取位置
			this.getAddressinfo()
			//获取车牌号 历史记录
			this.handleHistoryCar()
			//获取配件信息
			// this.getDetail()
		},
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
			getDetail(){
				netWorkOrderDetail({id:this.workorderid}).then(res=>{
					this.partsList = res.data.parts
				})
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
							iconPath: '../../static/index/weizhi.png',
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
						if(err.errMsg == 'getLocation:fail auth deny'){
							uni.navigateTo({
								title:'请允许使用位置信息',
								icon:'none'
							})
						}
					}
				})
			},
			againRepos() {
				this.address = ''
				this.getAddressinfo()
			},
			//预计完成  时间
			changeTime(e) {
				this.expected_end_time = e.detail.value
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
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//////////////////////////////////////////////////////////////////
			//选择出行方式
			changeTool(e) {
				this.toolIndex = e.detail.value
			},
			//添加 配件
			addParts() {
				this.$refs.partsChild.init(this.workorderid)
			},
			selectParts(arr) {
				arr.forEach(ele=>{
					ele.number = 1
				})
				let data = this.partsList.concat(arr)
				this.partsList = this.deWeight(data)
			},
			//删除 配件
			delParts(index) {
				this.partsList.splice(index,1)
			},
			//修改 配件 数量
			changeNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e.detail
				this.$set(this.partsList,index,obj)
			},
			//////////////////////////////////////////////////////////////////////////////
			//保存
			toAdd() {
				let {
					longitude,
					latitude,
					address,
					imgList,
					desc,
					workorderid,
					partsList,
				} = this
				let car_type = this.toolArray[this.toolIndex]
				if(imgList.length == 0) {
					uni.showToast({
						title: '请上传附件',
						icon: 'none'
					})
					return
				}
				
				let arr = []
				imgList.forEach(item => {
					arr.push(item.id)
				})
				
				let partarr = []
				partsList.forEach(ele=>{
					partarr.push({
						id:ele.id,
						number: ele.number
					})
				})
				let params = {
					location: address,
					lng: longitude,
					lat: latitude,
					file_ids: arr.join(','),
					desc,
					id:workorderid,
					// parts:partarr,
					car_type:this.toolArray[this.toolIndex],
					start_mileage:this.start_mileage,
					car_number:this.car_number
				}
				
				this.submit(params)
			},
			submit(params) {
				netStartWorkOrder(params).then(res=>{
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
	.que_list{
		border-bottom: 1rpx solid #EAEAEA;
		padding:0 45rpx 0 50rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.que_li{
			background-color: #fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-right:15rpx;
			&:last-child{
				border-bottom:0;
			}
			radio{
				transform: scale(0.7);
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
		border-bottom:1rpx solid #EDEDED;
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
			color: $uni-text-color;
		}
	}

	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #666;
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
				margin-left:24rpx;
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
			color:#14C2C1;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#14c2c1;
				margin-right:5rpx;
			}
		}
	}

	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		margin-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			color:#666;
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
		border-bottom: 1rpx solid #EDEDED;
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
			border: 1rpx solid #EDEDED;
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
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #EDEDED;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom:0;
				}
				.icon-jian{
					font-size:42rpx;
					color:#ff7800;
				}
				.protext{
					font-size:24rpx;
					color:#333;
					margin-bottom:15rpx;
				}
			}
		}
	}
</style>
