<template>
	<view class="group_company">
		<view class="contractinfo" v-if="info">
			<view class="nameli">
				<view class="name">{{info.name}}</view>
			</view>
			<view class="content" >
				下次跟进时间：{{info.next_time ? info.next_time : ''}}
			</view>
			<view class="content">
				商机金额：{{info.money ? info.money : ''}}
			</view>
			<view class="content" >
				创建人：{{info.owner_staff ? info.owner_staff.name : ''}}
			</view>
			<view class="bus_box">
				<view class="bustit">商机推进阶段:</view>
				<!-- <view class="busright">推进商机</view> -->
			</view>
			<view class="stepbox">
				<view class="stepli " :class="{'stepli_a':index <= options_active}" v-for="(item,index) in options" :key="index">
					<view class="num">{{index+1}}</view>
					<view class="step_text">{{item.title}} <text v-if="index != options.length-1"> > </text> </view>
				</view>
			</view>
		</view>
		
		<!-- 标签栏 -->
		<view class="tabwarp">
			<scroll-view scroll-x="true" style="width:750rpx;">
				<view class="tablist_new_list">
					<view class="tabtn" @click="changeTab(0)" :class="{'tabtn_active':active == 0}">跟进记录</view>
					<view class="tabtn" @click="changeTab(1)" :class="{'tabtn_active':active == 1}">基本信息</view>
					<view class="tabtn" @click="changeTab(2)" :class="{'tabtn_active':active == 2}">合同</view>
					<view class="tabtn" @click="changeTab(3)" :class="{'tabtn_active':active == 3}">推进历史</view>
				</view>
			</scroll-view>
			
			<!-- 跟进记录 -->
			<scroll-view scroll-y="true" class="scrollbox" v-if="active == 0">
				<follow-info ref="followChild" v-if="info.id" :info="info" :type="5"></follow-info>
			</scroll-view>
			<!-- 基本信息 -->
			<scroll-view scroll-y="true" class="scrollbox" v-if="active == 1">
				<base-info v-if="info.id" :info="info" ></base-info>
			</scroll-view>
			<!-- 合同 -->
			<scroll-view scroll-y="true" class="scrollbox" v-if="active == 2">
				<related-contract v-if="info.id" :info="info" ></related-contract>
			</scroll-view>
			<!-- 推进历史 -->
			<scroll-view scroll-y="true" class="scrollbox" v-if="active == 3">
				<advance-history v-if="info.id" :info="info"></advance-history>
			</scroll-view>
		</view>
		
		<view style="height:100rpx;"></view>
		<!-- 底部导航栏 -->
		<view class="bottom_nav">
			<view class="bottom_item" @click="followClick(info.id,5)">
				<image :src="BASE_IMG_URL+'/index/add.png'" class="botimg"></image>
				<view>跟进</view>
			</view>
			<view class="bottom_item" @click="moreClick">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="botimg"></image>
				<view>更多操作</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" @click="toTrans(info.id)">
					<image :src="BASE_IMG_URL+'/index/zhuangpai.png'" class="opeimg" ></image>
					<view class="litext">转移商机</view>
				</view>
				<view class="ope_li" @click="toEditcontract(info.id)">
					<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg" ></image>
					<view class="litext">修改商机</view>
				</view>
				<view class="ope_li" @click="advanceBusiness">
					<image :src="BASE_IMG_URL+'/tuijin.png'" class="opeimg" ></image>
					<view class="litext">推进商机</view>
				</view>
				<view class="ope_li" @click="toAddContract">
					<image :src="BASE_IMG_URL+'/addContr.png'" class="opeimg" ></image>
					<view class="litext">添加合同</view>
				</view>
				<view class="ope_li" @click="toDelBusiness(info.id)">
					<image :src="BASE_IMG_URL+'/del.png'" class="opeimg" ></image>
					<view class="litext">删除商机</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import baseInfo from './baseInfo.vue'
	import relatedContract from './relatedContract.vue'
	import advanceHistory from './advanceHistory.vue'
	import followInfo from '@/pagesB/cluesManagement/cluesMore/follow_info.vue'
	
	import { netBusinessDetail, netDelBusiness, netBusinessStage } from '@/api/api.js'
	export default {
		components: {
			baseInfo,
			relatedContract,
			advanceHistory,
			followInfo
		},
		data() {
			return {
				id: '', //商机id
				info: {},
				BASE_IMG_URL:BASE_IMG_URL,
				options:[
					{title: '初期沟通'}, 
					{title: '立项跟踪'}, 
					{title: '方案/报价'}, 
					{title: '谈判审核'},
					{title: '赢单'},
				],
				stageList:[],   //商机阶段
				options_active:0,
				active:0,
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onHide() {
			this.$refs.popup.close()
		},
		onShow() {
			this.info = {}
			//获取商机阶段
			// this.getStage()
			this.getInfo()
			this.changeTab(this.active)
		},
		methods: {
			getStage() {
				netBusinessStage().then(res=>{
					this.stageList = res.data
					
				})
			},
			changeTab(index) {
				this.active = index;
			},
			tabs_change(e) {
				this.current = e;
				this.mescroll.resetUpScroll();
			},
			moreClick() {
				this.$refs.popup.open()
			},
			//获取商机 详情信息
			getInfo() {
				netBusinessDetail({
					id: this.id
				}).then(res => {
					this.info = res.data
					let type = res.data.type
					if(type == 5){
						//输单
						this.options = [
							{title: '初期沟通'}, 
							{title: '立项跟踪'}, 
							{title: '方案/报价'}, 
							{title: '谈判审核'},
							{title: '输单'},
						]
						this.options_active = 4
					}else if(type == 6){
						//无效
						this.options = [
							{title: '初期沟通'}, 
							{title: '立项跟踪'}, 
							{title: '方案/报价'}, 
							{title: '谈判审核'},
							{title: '无效'},
						]
						this.options_active = 4
					}else{
						//赢单
						this.options_active = type
					}
				})
			},
			
			// 写新跟进
			followClick(id,type) {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/newFllow?id='+id+'&type='+type
				})
			},
			//转移商机
			toTrans(id) {
				uni.navigateTo({
					url:'/pagesB/business/trans?id='+id
				})
			},
			//编辑商机
			toEditcontract(id) {
				uni.navigateTo({
					url: '/pagesB/business/editBusiness?id='+this.id
				})
			},
			//删除商机
			toDelBusiness(id) {
				uni.showModal({
					title:'提示',
					content:'请确认是否删除？',
					success:(res)=>{
						if(res.confirm){
							netDelBusiness({id:id}).then(res=>{
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
			},
			//添加合同
			toAddContract() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/order/createOrder?customerid='+this.info.customer.id+'&businessid='+this.id
				})
			},
			//推进商机
			advanceBusiness() {
				uni.navigateTo({
					url:'/pagesB/business/advance?id='+this.id+'&status='+this.info.type
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
	
	.bus_box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size:30rpx;
		color:#fff;
		margin-bottom:24rpx;
		.busright{
			font-size:24rpx;
			width:120rpx;
			text-align: center;
			border:1rpx solid #fff;
			padding:5rpx 0;
			border-radius: 10rpx;
		}
	}
	.stepbox{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.xian{
			width:35rpx;
			height:2rpx;
			background:#c7c5c5;
			margin-bottom:35rpx;
		}
		.xian_a{
			background:#fff;
		}
		.stepli{
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			flex-shrink: 0;
			.num{
				width:40rpx;
				height:40rpx;
				border-radius: 50%;
				border:1rpx solid #c7c5c5;
				font-size:24rpx;
				text-align: center;
				line-height: 38rpx;
				color:#c7c5c5;
				margin-bottom:15rpx;
				margin-right:10rpx;
			}
			.step_text{
				font-size:26rpx;
				color:#c7c5c5;
				text{
					font-size:26rpx;
					color:#c7c5c5;
					margin-left:10rpx;
				}
			}
		}
		.stepli_a{
			.num{
				color:#fff;
				border:2rpx solid #fff;
			}
			.step_text{
				color:#fff;
				text{
					font-size:26rpx;
					color:#fff;
				}
			}
		}
	}
	.contractinfo {
		background: $uni-text-color;
		padding: 20rpx 40rpx;
		position: relative;
		.nameli {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-bottom: 24rpx;

			.zhangimg {
				width: 40rpx;
				height: 40rpx;
				margin-right: 15rpx;
			}

			.name {
				font-size: 32rpx;
				color: #fff;
				font-size: 36rpx;
				font-weight: 600;
			}
		}
		.content {
			font-size: 30rpx;
			color: #fff;
			margin: 15rpx 0;
		}
	}
	.bottom_nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 0;
		background-color: #fff;
		text-align: center;
		color: #999;
		z-index: 2;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		.bottom_item{
			font-size:24rpx;
			.botimg{
				width:40rpx;
				height:40rpx;
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
