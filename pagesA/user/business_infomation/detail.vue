<template>
	<view>
		<view class="bus_title">{{info.name ? info.name :''}}</view>
		<view class="bus_list">
			<view class="bus_item">
				<view class="item_label">法人代表</view>
				<view class="ite_text">{{info.oper_name ? info.oper_name : ''}}</view>
			</view>
			<view class="bus_xian"></view>
			<view class="bus_item">
				<view class="item_label">注册资本</view>
				<view class="ite_text">{{info.money ? info.money : ''}}万元</view>
			</view>
			<view class="bus_xian"></view>
			<view class="bus_item">
				<view class="item_label">成立时间</view>
				<view class="ite_text">{{info.start_date ? info.start_date : ''}}</view>
			</view>
		</view>
		<view class="address_info">
			<view class="address_text">
				地址：{{info.address ? info.address : ''}}
			</view>
			<image :src="BASE_IMG_URL+'/index/local.png'" @click="toMap" class="addressimg" ></image>
		</view>
		<view class="address_info">
			<view class="address_text">
				<span>经营范围</span>：{{info.scope ? info.scope : ''}}
			</view>
		</view>
		
		<view class="bus_info">
			<view class="bus_left">工商信息</view>
			<view class="busbox" v-if="info">
				<view class="infoitem" @click="toBaseinfo">
					<view class="info_name">基本信息</view>
					<image :src="BASE_IMG_URL+'/index/renwu-zy.png'" class="infoimg" ></image>
				</view>
				<view class="infoitem" @click="toshareInfo">
					<view class="info_name">股东信息</view>
					<view class="info_text">{{info.enterprise.partners_total?info.enterprise.partners_total:''}}</view>
				</view>
				<view class="infoitem" @click="tosenior">
					<view class="info_name">高管信息</view>
					<view class="info_text">{{info.enterprise.employees_total?info.enterprise.employees_total:''}}</view>
				</view>
				<view class="infoitem" @click="toChangeinfo">
					<view class="info_name">变更信息</view>
					<view class="info_text">{{info.enterprise.changerecords_total?info.enterprise.changerecords_total:''}}</view>
				</view>
				<view class="infoitem" @click="toBranchinfo">
					<view class="info_name">企业分支结构</view>
					<view class="info_text">{{info.enterprise.branches_total?info.enterprise.branches_total:''}}</view>
				</view>
			</view>
		</view>
		
		<view class="bus_info" style="background:rgba(255, 162, 5, 0.1)">
			<view class="bus_left" style="color:#FFA205">风险</view>
			<view class="busbox">
				<view class="infoitem" @click="toAbnormal">
					<view class="info_name">经营异常</view>
					<view class="info_text" style="color:#FFA205">{{info.risk && info.risk.abnormal_total}}</view>
				</view>
			</view>
		</view>
		
		<view class="button" v-if="type == 2" @click="toBack">确认回填</view>
	</view>
</template>

<script>
	import { netBusinessDetail } from '@/api/user.js'
	import { netAddressTransLng } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				type:1,   //1自行查询   2新增客户 时查询信息
				name:'',
				info:{}
			}
		},
		onLoad(options) {
			this.name = options.name
			this.type = options.type
			this.getDetail()
		},
		methods:{
			//确认回填
			toBack() {
				netAddressTransLng({address:this.info.address}).then(res=>{
					res = res.data.result
					let a = res.address_components
					let b = res.location
					let params = {
						name: this.info.name,
						address_dingwei: a.province+a.city+a.district,
						address_detail: this.info.address,
						lat: b.lat,
						lng: b.lng
					}
					this.$store.commit('ADDCUSTOMERINFO',params)
					uni.navigateBack({
						delta:2
					})
				})
			},
			getDetail() {
				let params = {
					name: this.name
				}
				netBusinessDetail(params).then(res=>{
					if(res.code == 0) {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					}else if(res.code == 1) {
						this.info = res.data
						uni.setStorageSync('businessInfo',res.data)
					}
				})
			},
			toMap() {
				uni.setClipboardData({
					data: this.info.address,
					success:(res)=>{
						uni.showToast({
							title:'地址已复制，请粘贴搜索',
							icon:'none'
						})
						setTimeout(()=>{
							uni.chooseLocation({
								
							})
						},2000)
					}
				})
			},
			//基本信息
			toBaseinfo() {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/baseinfo'
				})
			},
			//股东信息
			toshareInfo() {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/shareholder_info'
				})
			},
			//高管信息
			tosenior() {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/senior_info'
				})
			},
			//变更信息
			toChangeinfo() {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/change_info'
				})
			},
			//分支机构
			toBranchinfo() {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/branch'
				})
			},
			//经营异常
			toAbnormal() {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/abnormal'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bus_title{
		padding:24rpx 30rpx;
		color:#333333;
		font-size:34rpx;
		text-align: center;
	}
	.bus_list{
		padding:24rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.bus_item{
			.item_label{
				font-size:30rpx;
				color:#666666;
			}
			.ite_text{
				font-size:30rpx;
				color:$uni-text-color;
				margin-top:15rpx;
				text-align: center;
			}
		}
		.bus_xian{
			width:1rpx;
			height:100rpx;
			background:#f5f5f5;
		}
	}
	.address_info{
		padding:24rpx 35rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		border-bottom:1rpx solid #f5f5f5;
		.address_text{
			font-size:30rpx;
			color:#666666;
			span{
				color:#333;
				font-size:32rpx;
			}
		}
		.addressimg{
			width:48rpx;
			height:48rpx;
			margin-left:15rpx;
			flex-shrink: 0;
		}
	}
	.bus_info{
		width:690rpx;
		border-radius: 20rpx;
		margin:24rpx auto;
		background:rgba(3, 170, 150, 0.2);
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding:30rpx;
		.bus_left{
			writing-mode:vertical-lr;
			font-size:32rpx;
			color:$uni-text-color;
			border-right:1rpx solid #999999;
			padding-right:15rpx;
			margin-right:15rpx;
		}
		.busbox{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			.infoitem{
				margin-right:80rpx;
				margin-bottom:24rpx;
				&:nth-child(3n){
					margin-right:0;
				}
				.info_name{
					font-size:28rpx;
					color:#333333;
					margin-bottom:15rpx;
				}
				.infoimg{
					width:44rpx;
					height:44rpx;
				}
				.info_text{
					color:$uni-text-color;
					font-size:28rpx;
				}
			}
		}
	}
</style>
