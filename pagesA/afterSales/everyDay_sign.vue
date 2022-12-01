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
		
		<!-- 上传图片 -->
		<upload-img :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view style="background:#fff;">
			<view class="fllow_area">
				<view class="area_head key">备注:<span>*</span></view>
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
	import { netWorkOrderStatus, netLngTransAddress } from '@/api/api.js'
	import { commonFun } from '@/common/navigate'
	
	export default {
		mixins:[commonFun],
		components:{
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
			}
		},
		onLoad(options) {
			this.workorderid = options.workorderid
			//获取位置
			this.getAddressinfo()
		},
		methods: {
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
					workorderid,
					partsList,
				} = this
				if(imgList.length == 0) {
					uni.showToast({
						title: '请上传附件',
						icon: 'none'
					})
					return
				}
				if(!desc) {
					uni.showToast({
						title: '请填写备注',
						icon: 'none'
					})
					return
				}
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
					desc,
					id:workorderid,
				}
				netWorkOrderStatus(params).then(res => {
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
		padding:24rpx 40rpx 24rpx 50rpx;
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
