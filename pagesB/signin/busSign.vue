<template>
	<view>
		<view class="mapbox">
			<map 
				style="width:750rpx;height:400rpx;"
				name="" 
				id="mapself" 
				:latitude="latitude" 
				:longitude="longitude" 
				:markers="markers"
				></map>
		</view>
		<view class="position">
			<view class="locainfo">
				<view class="localeft">
					<image :src="BASE_IMG_URL+'/ydw.png'" class="dingwei" mode="scaleToFill"></image>
					<view class="text">{{address}}</view>
				</view>
			</view>
			<view style="background:#fff;">
				<view class="inp_warp">
					<view class="inp_title">拜访客户:</view>
					<view class="form_right" @click="toSelectCustomer" v-if="!defaultCustomer">
						<view class="ritext" :class="customerObj ? 'valueActive' : '' ">
							{{customerObj ? customerObj.name : '点击选择'}}
						</view>
						<view class="iconfont icon-you"></view>
					</view>
					<view class="form_right" v-if="defaultCustomer">
						<view class="ritext" :class="customerObj ? 'valueActive' : '' ">
							{{customerObj ? customerObj.name : '点击选择'}}
						</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<form-item :listForm="listForm" v-if="listForm" istype="camera" @changeData="changeOtherData"></form-item>
			</view>
			<!-- 提醒人 -->
			<examine-people title="提醒人" :flag="false" :list="remindPeople" @delItem="delItem"></examine-people>
			<view style="height:120rpx"></view>
			<view class="savebox">
				<view class="savebtn" @click="$noMultipleClicks(toAdd)">保存</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		netAddOutSignin,
		netSetForm,
		netLngTransAddress,
		netCustomerDetail
	} from '@/api/api.js'
	import {
		BASE_IMG_URL
	} from '@/api/http.js'
	import formItem from '@/components/form/formitem.vue'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	export default {
		mixins:[commonFun],
		components:{
			formItem,
		},
		data() {
			return {
				noClick: true, //防止  重复点击
				longitude: null,
				latitude: null,
				markers: [],
				address: '',
				kehuList: [],
				kehuIndex: null,
				kehuName: '',
				BASE_IMG_URL: BASE_IMG_URL,
				location: '', //地址 
				lng: '',
				lat: '',
				files: '',
				customer_id: '',
				defaultCustomer: false,
				listForm: null,
				mapKey:'',
				remindPeople:[],
				examineType:'sign'
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
		}),
		onLoad(options) {
			//获取 位置信息
			this.getAddressinfo()
			if (options.customerid) {
				this.customer_id = options.customerid
				this.defaultCustomer = true
				//获取 客户信息
				this.getKehuInfo()
			}
			//获取表单
			this.getForm()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
		},
		methods: {
			getForm() {
				netSetForm({type: 'signin'}).then(res => {
					res = res.data.data
					res.forEach(ele=>{
						ele.value = ele.value?ele.value:''
					})
					this.listForm = res
				})
			},
			changeOtherData(name, value, obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			getKehuInfo() {
				netCustomerDetail({id:this.customer_id}).then(res=>{
					res = res.data
					let obj = {
						id:res.id,
						name:res.name
					}
					this.$store.commit('CUSTOMEROBJ',obj)
				})
			},
			getAddressinfo() {
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					altitude: true,
					success: (res) => {
						this.longitude = res.longitude
						this.latitude = res.latitude
						this.markers = [{
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: BASE_IMG_URL+'/weizhi.png',
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
					}
				})
			},
			//保存
			toAdd() {
				let {
					longitude,
					latitude,
					address,
				} = this
				if (!this.customerObj) {
					uni.showToast({
						title: '请选择拜访客户',
						icon: 'none'
					})
					return
				}
				let obj = this.checkCommonForm(this.listForm)
				if(!obj){
					return
				}
				let arr = []
				this.remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					location: address,
					lng: longitude,
					lat: latitude,
					customer_id: this.customerObj.id,
					...obj,
					reminds_id:arr.join(',')
				}
				netAddOutSignin(params).then(res => {
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
	radio {
		transform: scale(0.6);
	}
	page{
		background-color: #f5f5f5;
	}
</style>

<style lang="scss" scoped>
	.valueActive {
		color: #333;
	}

	.mapbox {
		width: 750rpx;
		height: 400rpx;
		overflow: hidden;
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
				width: 44rpx;
				height: 44rpx;
				margin-right: 15rpx;
			}

			.text {
				font-size: 26rpx;
				color: #333;
			}
		}

		.locaright {
			image {
				width: 46rpx;
				height: 46rpx;
			}
		}
	}

	.inp_warp {
		padding: 24rpx;
		background: #fff;
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #CCC;
		border-top: 1px solid #ededed;
		.inp_title {
			font-size: 24rpx;
			color: #666;
		}
		.form_right {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			font-size: 24rpx;
			text-align: right;
			color: #999;
		}
	}

	.savebox {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:calc(100rpx + env(safe-area-inset-bottom) / 2);
		background:#fff;
		z-index: 2;
		padding-bottom:calc(env(safe-area-inset-bottom) / 2);
		.savebtn {
			font-size: 26rpx;
			color: #fff;
			text-align: center;
			line-height: 88rpx;
			width: 500rpx;
			height: 88rpx;
			background: $uni-text-color;
			border-radius: 29rpx;
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
</style>
