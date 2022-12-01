<template>
	<view class="group_company">
		<view class="group_head">
			<view class="group_item">
				<view>线索名称</view>
				<view class="text">{{info && info.name}}</view>
			</view>
			<view class="group_item">
				<view>线索来源</view>
				<view class="text">{{info && info.source}}</view> 
			</view>
			<view class="group_item">
				<view>下次跟进时间</view>
				<view class="text">{{info && info.next_time ? info.next_time : '--'}}</view>
			</view>
		</view>
		<!-- 标签栏 -->
		<view class="tabwarp">
			<scroll-view scroll-x="true" style="width:750rpx;">
				<view class="tablist_new_list">
					<view class="tabtn" @click="changeTab(0)" :class="{'tabtn_active':active == 0}">跟进记录</view>
					<view class="tabtn" @click="changeTab(1)" :class="{'tabtn_active':active == 1}">基本信息</view>
					<view class="tabtn" @click="changeTab(2)" :class="{'tabtn_active':active == 2}">相关信息</view>
				</view>
			</scroll-view>
			
			<!-- 跟进记录 -->
			<scroll-view scroll-y="true" class="scrollbox" v-if="active == 0">
				<follow-info v-if="info" :info="info" :type="4"></follow-info>
			</scroll-view>
			<!-- 基本信息 -->
			<scroll-view scroll-y="true" class="scrollbox" v-if="active == 1">
				<info-detail v-if="info" :info="info"></info-detail>
			</scroll-view>
			<!-- 相关信息 -->
			<scroll-view scroll-y="true" class="scrollbox" v-if="active == 2">
				<cust-detail v-if="info" :kehuid="info.id"></cust-detail>
			</scroll-view>
		</view>
		<view style="height:120rpx"></view>
		<!-- 底部导航栏 -->
		<view class="bottom_nav">
			<view class="bottom_item" @click="newFollowClick">
				<image :src="BASE_IMG_URL+'/index/add.png'" class="botimg" mode=""></image>
				<view>写新跟进</view>
			</view>
			<view class="bottom_item" @click="getaddCustomer">
				<image :src="BASE_IMG_URL+'/index/move-kehu.png'" class="botimg" mode=""></image>
				<view>转客</view>
			</view>
			<view class="bottom_item" @click="toCall(info.mobile)">
				<image :src="BASE_IMG_URL+'/index/phone-call.png'" class="botimg" mode=""></image>
				<view>拨打电话</view>
			</view>
			<view class="bottom_item" @click="toLookMore">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="botimg" mode=""></image>
				<view>更多</view>
			</view>
		</view>
		<uni-popup ref="morePopup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" @click="editClues">
					<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg" ></image>
					<view class="litext">编辑线索</view>
				</view>
				<view class="ope_li" @click="toTransfer">
					<image :src="BASE_IMG_URL+'/index/zhuangpai.png'" class="opeimg" ></image>
					<view class="litext">更换负责人</view>
				</view>
				<view class="ope_li" @click="deleteClueClick">
					<image :src="BASE_IMG_URL+'/clus_del.png'" class="opeimg" ></image>
					<view class="litext">删除线索</view>
				</view>
				<view class="ope_li" @click="toPool">
					<image :src="BASE_IMG_URL+'/index/chexiao.png'" class="opeimg" ></image>
					<view class="litext">移入线索池</view>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import infoDetail from './baseInfo.vue';
	import custDetail from './relateInfo.vue';
	import followInfo from './follow_info.vue'
	import { netCluesDetail, netDelClues, netLeadsTransCustomer, netLeadsToCluepool } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',   //线索
				info:null,
				active:0,
				
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.info = null
			this.getInfo()
		},
		onHide() {
			this.$refs.morePopup.close()
		},
		created() {
			
		},
		components: {
			infoDetail,
			custDetail,
			followInfo
		},
		methods: {
			changeTab(e) {
				this.active = e
			},
			//查看更多操作
			toLookMore() {
				this.$refs.morePopup.open()
			},
			change(index) {
				this.current = index;
			},
			tabs_change(e) {
				this.current = e;
				this.mescroll.resetUpScroll();
			},
			//获取客户信息
			getInfo() {
				netCluesDetail({id:this.id}).then(res=>{
					this.info = res.data
					uni.setNavigationBarTitle({
						title:res.data.name
					})
				})
			},
			//写  新跟进
			newFollowClick() {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/newFllow?id='+this.info.id+'&type=4'
				})
			},
			//编辑 线索
			editClues() {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/cluesMore/editInfo?id='+this.id
				})
			},
			//拨打电话
			selectPhone(e) {
				let obj = e.detail
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
				    phoneNumber: obj.mobile, 
				    code: '+86'
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: obj.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(obj.mobile, true);
				// #endif
			},
			
			// 任务
			taskClick() {
				this.taskShow = true;
				this.show = false;
			},
			// 取消底部弹出框
			onCancel() {
				this.taskShow = false;
				this.statusShow = false;
				this.telShow = false;
				this.show = false;
			},
			// 变更状态
			statusClick() {
				this.statusShow = true;
				this.show = false;
			},
			// 电话
			telClick() {
				this.telShow = true;
				this.show = false;
			},
			// 领取线索
			getCluesClick() {
				this.show = false;
				uni.showModal({
					title: '是否确定领取公池客户',
					content: '领取后长时间未跟进，客户将自动转为公共客户',
					cancelColor: "#008EFF",
					confirmColor: "#008EFF",
					success: function(res) {
						if (res.confirm) {
							netReceiveKehu().then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									uni.navigateTo({
										url: '/pages/index/groupCompany/groupCompany?id='+res.data.id
									})
								},1000)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// 删除线索
			deleteClueClick() {
				uni.showModal({
					title: '提示',
					content: '请确认是否删除吗？',
					cancelColor: "#008EFF",
					confirmColor: "#008EFF",
					success: (res) => {
						if (res.confirm) {
							netDelClues({id:this.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								this.$refs.morePopup.close()
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},2000)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// 隐藏遮罩层
			onClickHide() {
				this.overShow = false;
			},
			//更换负责人
			toTransfer() {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/cluesMore/transfer?id='+this.id
				})
			},
			//转客
			getaddCustomer() {
				uni.showModal({
					title:'提示',
					content:'请确认是否转客户?',
					complete:(data)=>{
						if(data.confirm){
							netLeadsTransCustomer({id:this.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									uni.navigateTo({
										url:'/pages/index/myCustomer/index'
									})
								},2000)
							})
						}
					}
				})
			},
			// 电话
			toCall(phone) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: phone, // 期望拨打的电话号码
					code: '+86', // 国家代号，中国是+86
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: phone
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(phone, true);
				// #endif
			},
			//移入公海
			toPool() {
				uni.showModal({
					title:'提示',
					content:'请确认是否移入公海?',
					complete:(data)=>{
						if(data.confirm){
							netLeadsToCluepool({id:this.id}).then(res=>{
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
				})
			}
		}
	}
</script>

<style lang="scss">
	.tabwarp{
		border-top:1rpx solid #f5f5f5;
		border-bottom:1rpx solid #f5f5f5;
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 100rpx);
		background:#f5f5f5;
	}
	//tab栏
	.tablist_new_list{
		width:750rpx;
		padding:24rpx 10rpx;
		display: flex;
		justify-content: space-around;	
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.tabtn{
			flex-shrink: 0;
			width:170rpx;
			text-align: center;
			font-size:26rpx;
			color:#999;
			padding-bottom:20rpx;
			position: relative;
			&::after{
				content:'';
				position: absolute;
				left:50%;
				transform: translateX(-50%);
				bottom:0;
				width:80rpx;
				height:10rpx;
				background:#fff;
				border-radius: 10rpx;
			}
		}
		.tabtn_active{
			width:170rpx;
			text-align: center;
			font-size:26rpx;
			color:#333;
			padding-bottom:20rpx;
			position: relative;
			&::after{
				content:'';
				position: absolute;
				left:50%;
				transform: translateX(-50%);
				bottom:0;
				width:80rpx;
				height:10rpx;
				background:$uni-btn-bg-color;
				border-radius: 10rpx;
				opacity: 0.5;
			}
		}
	}
	.group_head {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 0;
		background-color: #fff;
		text-align: center;

		.group_item {
			width: 33.33%;
			color: #999;
			margin-bottom:15rpx;
			.text{
				line-height:48rpx;
				color: #666;
			}
			.group_htz{
				margin-top: 8rpx;
			}
		}
	}
	.group_tab {
		margin: 20rpx 0;
	}
	.bottom_nav {
		position: fixed;
		display: flex;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 0;
		background-color: #fff;
		text-align: center;
		color: #999;
		display: flex;
		justify-content: space-around;
		align-items: center;
		z-index: 2;
		border-top:1rpx solid #f5f5f5;
		.bottom_item {
			.botimg{
				width:40rpx;
				height:40rpx;
				margin-bottom:5rpx;
			}
		}
	}

	.ope_warp{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding:30rpx 0;
		.warpbox{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
		.ope_li{
			width:33.33%;
			margin-bottom:24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.opeimg{
				width:38rpx;
				height:38rpx;
				margin-bottom:10rpx;
			}
			.litext{
				font-size:26rpx;
				color:#999999;
				text-align: center;
			}
		}
	}
</style>
