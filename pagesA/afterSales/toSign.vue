<template>
	<view>
		<view class="inp_warp" v-if="type == 3">
			<view class="inp_title key">配件</view>
			<view class="add_in" @click="addParts">
				<view class="iconfont icon-jiahaocu"></view>
				添加配件
			</view>
		</view>
		<view class="prolist" v-if="partsList.length != 0 && type == 3">
			<view class="probox">
				<view class="proli" v-for="(item,index) in partsList" :key="index">
					<view class="iconfont icon-jian" @click="delParts(index)"></view>
					<view class="protext" style="text-align: center;width:160rpx">{{item.name}}</view>
					<view>
						<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
					</view>
				</view>
			</view>
		</view>
		<view v-if="type == 3">
			<view class="inp_warp" >
				<view class="inp_title key">选择出行方式</view>
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
					<view class="inp_title key">起始公里数</view>
					<view class="form_right">
						<input 
							type="digit" 
							v-model="start_mileage" 
							placeholder="请输入起始公里数" 
							class="rightinput" 
							@blur="checkMileage"
							:class="start_mileage ? 'valueActive' : '' "
						>
					</view>
				</view>
			</view>
		</view>
		<!-- 上传图片 -->
		<upload-img :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="inp_warp" v-if="type == 4">
			<view class="inp_title key">预计完成时间 <span>*</span></view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					{{expected_end_time?expected_end_time:'预计完成时间'}}
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</picker>
		</view>
		<view style="background:#fff;">
			<view class="fllow_area">
				<view class="area_head key">备注:</view>
				<textarea v-model="desc" :class="desc ? 'valueActive' : '' " placeholder="备注"
					placeholder-style="color:#999" />
			</view>
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
	import { netWorkOrderStatus, netCompleteWorkorder, netStartWorkOrder, netLngTransAddress } from '@/api/api.js'
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
				type:1,   //1添加备注   2完成工单  3产品安装开始工单添加配件 出发  4设计工单
				//配件信息
				partsList:[],
				expected_end_time:'',    //预计完成时间
				//出行方式
				toolArray:['公司车','私家车','公交车','出租车','飞机','火车','其他'],  //工具
				toolIndex:0,
				car_type:'',  //出行方式
				start_mileage:'',   //起始公里数
			}
		},
		onLoad(options) {
			this.workorderid = options.workorderid
			this.type = options.type
			//获取位置
			this.getAddressinfo()
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
				let data = arr.concat(this.partsList)
				data.forEach(ele=>{
					ele.number = 1
				})
				this.partsList = this.deWeight(data)
			},
			//删除 配件
			delParts(index) {
				this.partsList.splice(index,1)
			},
			//修改 配件 数量
			changeNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e
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
				if(imgList.length == 0) {
					uni.showToast({
						title: '请上传附件',
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
				let params = {}
				if(this.type == 1 || this.type == 2){
					params = {
						location: address,
						lng: longitude,
						lat: latitude,
						file_ids:files,
						desc,
						id:workorderid,
					}
				}
				if(this.type == 3) {
					let arr = []
					partsList.forEach(ele=>{
						arr.push({
							id:ele.id,
							number: ele.number
						})
					})
					params = {
						location: address,
						lng: longitude,
						lat: latitude,
						file_ids:files,
						desc,
						id:workorderid,
						parts:arr,
						car_type:this.toolArray[this.toolIndex],
						start_mileage:this.start_mileage
					}
				}
				if(this.type == 4) {
					//设计工单
					if(!this.expected_end_time){
						uni.showToast({
							title:'请选择预计完成时间',
							icon:'none'
						})
						return
					}
					params = {
						location: address,
						lng: longitude,
						lat: latitude,
						file_ids:files,
						desc,
						id:workorderid,
						expected_end_time:this.expected_end_time
					}
				}
				this.submit(params)
			},
			submit(params) {
				if(this.type == 1) {
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
				}
				if(this.type == 2){
					netCompleteWorkorder(params).then(res => {
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
				if(this.type == 3 || this.type == 4) {
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
		width: 100%;
		height: 400rpx;

		#mapself {
			width: 100%;
			height: 400rpx;
		}
	}

	.locainfo {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-bottom:1rpx solid #f5f5f5;
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
		padding:24rpx 30rpx;
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
			border-radius: 10rpx;
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
				border-bottom:1rpx dashed #f5f5f5;
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
