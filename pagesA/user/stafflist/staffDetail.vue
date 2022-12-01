<template>
	<view>
		<view class="staffInfo">
			<image :src="info.img ? info.img : '/static/index/header.png'" class="staffimg" ></image>
			<view class="info_right">
				<view class="info_text">姓名：{{info.name}}</view>
				<view class="info_li" @click="toCall">
					<view class="info_text">手机号：{{info.mobile}}</view>
					<image :src="BASE_IMG_URL+'/index/phone-call.png'" class="callimg" ></image>
				</view>
				<view class="info_text">入职时间：{{info.createtime}}</view>
				<view class="info_li">
					<view class="info_text">{{info.post}}</view>
					<view class="info_text">上级领导：{{info.parent_name ? info.parent_name : '无'}}</view>
				</view>
			</view>
		</view>
		<view class="tabwarp">
			<view class="tablist_new">
				<view class="tabtn" @click="changeTab(0)" :class="{'tabtn_active':active == 0}">工作动态</view>
				<view class="tabtn" @click="changeTab(1)" :class="{'tabtn_active':active == 1}">工作报告</view>
				<view class="tabtn" @click="changeTab(2)" :class="{'tabtn_active':active == 2}">业绩统计</view>
				<view class="tabtn" @click="changeTab(3)" :class="{'tabtn_active':active == 3}">路程轨迹</view>
			</view>
			<!-- 工作动态 -->
			<view v-show="active == 0">
				<follow-info ref="followChild" customerType="2" @seePicture="seePicture"></follow-info>
			</view>
			<!-- 工作报告 -->
			<view v-show="active == 1">
				<work-report ref="reportChild" @shaixuan="toScreen"></work-report>
			</view>
			<!-- 业绩统计 -->
			<view v-show="active == 2">
				<acheve-statis ref="acheveChild" @queryYeji="toSelectOne"></acheve-statis>
			</view>
			<!-- 路程轨迹 -->
			<view v-show="active == 3">
				<traill-item ref="traillChild" @queryThr="toSelectTwo"></traill-item>
			</view>
		</view>
		
		<!-- 工作报告筛选 -->
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
		<!-- 业绩统计筛选 -->
		<select-pop ref="selectChildOne" @sureTwoQuery="sureTwoQuery"></select-pop>
		<!-- 路程轨迹筛选 -->
		<select-pop ref="selectChildTwo" @sureTwoQuery="sureThrQuery"></select-pop>
	</view>
</template>

<script>
	import followInfo from '@/pages/index/myCustomer/follow_info.vue'
	import workReport from './workReport.vue'
	import { netStaffDetail } from '@/api/user.js'
	import acheveStatis from './acheveStatis.vue'
	import traillItem from './trailItem.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './components/screenPop.vue'
	import selectPop from './components/selectPop.vue'
	
	export default{
		components:{
			followInfo,
			workReport,
			acheveStatis,
			traillItem,
			screenPop,
			selectPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				staffid:'',
				staffname:'',
				active:0,
				info:{},
				lookImg:false,
				//路程轨迹筛选
				showThrSelect:false,
			}
		},
		onLoad(options) {
			this.staffid = options.staffid
			this.staffname = options.staffname
		},
		onShow() {
			if(!this.lookImg){
				this.getDetail()
			}
		},
		methods:{
			//筛选
			toScreen() {
				this.$refs.screenChild.open()
			},
			toSelectOne() {
				this.$refs.selectChildOne.open()
			},
			toSelectTwo() {
				this.$refs.selectChildTwo.open()
			},
			//工作报告筛选
			sureQuery(params) {
				this.$refs.reportChild.sureQuery(params)
			},
			//业绩统计 筛选
			sureTwoQuery(params) {
				this.$refs.acheveChild.sureQuery(params)
			},
			//路程轨迹筛选
			sureThrQuery(params) {
				this.showThrSelect = false
				this.$refs.traillChild.sureQuery(params)
			},
			seePicture() {
				this.lookImg = true
			},
			toCall() {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: this.info.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: this.info.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(this.info.mobile, true);
				// #endif
			},
			getDetail() {
				netStaffDetail({id:this.staffid}).then(res=>{
					this.info = res.data
				})
				this.changeTab(0)
			},
			changeTab(e) {
				this.active = e
				setTimeout(()=>{
					if(this.active == 0) {
						this.$refs.followChild.init(this.staffid,2)
					}else if(this.active == 1) {
						this.$refs.reportChild.init(this.staffid)
					}else if(this.active == 2) {
						this.$refs.acheveChild.init(this.staffid)
					}else if(this.active == 3) {
						this.$refs.traillChild.init(this.staffid)
					}
				},500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.staffInfo{
		padding:24rpx 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.staffimg{
			width:100rpx;
			height:100rpx;
			border-radius: 50%;
			flex-shrink: 0;
			margin-right:24rpx;
		}
		.info_right{
			flex:1;
			.info_text{
				font-size:30rpx;
				color:#999999;
				margin-bottom:15rpx;
			}
			.info_li{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:0 20rpx 0 0;
				.callimg{
					width:35rpx;
					height:35rpx;
				}
			}
		}
	}
	.tabwarp{
		border-top:1rpx solid #f5f5f5;
		border-bottom:1rpx solid #f5f5f5;
	}
</style>
