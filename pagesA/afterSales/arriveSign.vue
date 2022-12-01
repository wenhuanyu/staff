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
			<view class="inp_warp">
				<view class="inp_title">客户:</view>
				<view class="form_right">
					<view :class="customer_name ? 'valueActive' : '' " >
						{{customer_name ? customer_name : '点击选择'}}</view>
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</view>
			<view v-if="car_type == '公司车' || car_type == '私家车'">
				<view class="inp_warp">
					<view class="inp_title key">开始公里数<span>*</span></view>
					<view class="form_right">
						<input type="number" @blur="checkMileage" v-model="start_mileage" placeholder="请输入开始公里数" placeholder-class="inputpla" class="rightinput" :class="start_mileage ? 'valueActive' : '' ">
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">结束公里数<span>*</span></view>
					<view class="form_right">
						<input type="number" @blur="checkendMileage" v-model="end_mileage" placeholder="请输入结束公里数" placeholder-class="inputpla" class="rightinput" :class="end_mileage ? 'valueActive' : '' ">
					</view>
				</view>
			</view>
			<upload-img :imgList="imgList" @uploadImg="uploadImg" istype="camera" @delImg="delImg"></upload-img>
			<view class="fllow_area">
				<view class="area_head" style="margin:20rpx 0;">备注:</view>
				<textarea v-model="desc" :class="desc ? 'valueActive' : '' " placeholder="备注"
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
	import { netProductInstallArrive, netLngTransAddress } from '@/api/api.js'
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
				desc: '',
				event_id:'',   //任务id
				event_process:2,    //1 开始 2 到达 3 拜访完成  4 返程签到
				
				car_type:'',   //出行方式
				start_mileage:'',   //起始公里数
				end_mileage:'',   //结束公里数
			}
		},
		onLoad(options) {
			this.event_id = options.eventid    //任务id
			this.customer_name = options.cusname   //客户姓名
			this.customer_id = options.customerid  //客户id
			this.car_type = options.carType    //出行方式
			this.start_mileage = options.arriveSign  //起始公里数
			
			//获取位置
			this.getAddressinfo()
			
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
			checkendMileage(e) {
				if(isNaN(Number(this.end_mileage))){
					uni.showToast({
						title:'结束公里数只能为数字/不能有空格',
						icon:'none'
					})
					this.end_mileage = ''
				}
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
					desc,
					event_id,
					event_process,
				} = this
				if((this.car_type == '公司车' || this.car_type == '私家车') && !this.end_mileage) {
					uni.showToast({
						title:'请填写结束公里数',
						icon:'none'
					})
					return
				}
				if(imgList.length == 0) {
					uni.showToast({
						title:'请上传图片',
						icon:'none'
					})
					return
				}
				
				let arr = []
				imgList.forEach(item => {
					arr.push(item.id)
				})
				let params = {
					location: address,
					lng: longitude,
					lat: latitude,
					file_ids:arr.join(','),
					desc,
					id:event_id,
					end_mileage:this.end_mileage
				}
				netProductInstallArrive(params).then(res => {
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
		padding:30rpx;
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
			color: #007AFF;
		}
	}
	.addcost{
		width:200rpx;
		height:60rpx;
		background:#007AFF;
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
			color: #999;
			.inputpla{
				font-size:24rpx;
				color:#999;
			}
			.rightinput{
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
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
