<template>
	<view class="profile">
		<view class="newbox" @click="toEdit">
			<view class="newinfo">
				<image :src="userInfo.img" class="staffimg" ></image>
				<view class="staff_info">
					<view class="staff_name">{{userInfo.name}}&nbsp;&nbsp;{{userInfo.post}}</view>
					<view class="staff_name">{{userInfo.mobile}}</view>
				</view>
			</view>
			<image :src="BASE_IMG_URL+'/index/lxr_set.svg'" class="rightimg" ></image>
		</view>
		
		<view class="warpbox">
			<view class="fun_box_fir">
				<view class="fun_fir_1" @click="toLinkNews">
					<view class="fun_tip" v-if="tipNumber">{{tipNumber}}</view>
					<image :src="BASE_IMG_URL+'/index/index_new_22_1.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view>消息</view>
				</view>
				<view class="fun_fir_1" @click="todiaban">
					<view class="fun_tip" v-if="info.agent && info.agent.count">{{info.agent && info.agent.count}}</view>
					<image :src="BASE_IMG_URL+'/index_new_23.svg'" class="fir_img_two" mode="scaleToFill"></image>
					<view>待办</view>
				</view>
				<view class="fun_fir_1" @click="toApprovel">
					<view class="fun_tip" v-if="info.examine && info.examine.count">{{info.examine && info.examine.count}}</view>
					<image :src="BASE_IMG_URL+'/index_new_7.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view>审批</view>
				</view>
			</view>
		</view>
		
		<view class="warpbox">
			<view class="warptitle">客户管理</view>
			<view class="fun_box">
				<view class="fun_fir" @click="toWaterCustomer" v-if="permission.menu && permission.menu.seas.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_gonghai.png'" class="fir_img" mode="scaleToFill"></image>
					<view>公海</view>
				</view>
				<view class="fun_fir" @click="toClues" v-if="permission.menu && permission.menu.leads.is_show == 1">
					<image :src="BASE_IMG_URL+'/index_new_2.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view>线索</view>
				</view>
				<view class="fun_fir" @click="toCluesPool" v-if="permission.menu && permission.menu.leadspool.is_show == 1">
					<image :src="BASE_IMG_URL+'/clue_chi.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view>线索池</view>
				</view>
				<view class="fun_fir" @click="toBusiness" v-if="permission.menu && permission.menu.business.is_show == 1">
					<image :src="BASE_IMG_URL+'/business.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view>商机</view>
				</view>
				<view class="fun_fir" @click="toContract" v-if="permission.menu && permission.menu.contract.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_hetong.png'" class="fir_img" mode="scaleToFill"></image>
					<view>合同</view>
				</view>
				
				<view class="fun_fir" @click="toQuotation" v-if="permission.menu && permission.menu.quote.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_baojiadan.png'" class="fir_img" mode="scaleToFill"></image>
					<view>报价单</view>
				</view>
				<view class="fun_fir" @click="toProductManage" v-if="permission.menu && permission.menu.product.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_changpin.png'" class="fir_img"></image>
					<view class="tabtext">产品</view>
				</view>
				<view class="fun_fir" @click="toMap" v-if="permission.menu && permission.menu.map.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_ditu.png'" class="fir_img"></image>
					<view class="tabtext">附近客户</view>
				</view>
			</view>
		</view>
		<view class="warpbox">
			<view class="warptitle">办公</view>
			<view class="fun_box">
				<!-- <view class="fun_fir" @click="toAftersales" v-if="permission.menu && permission.menu.workorder.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_gongdan.png'" class="fir_img" mode="scaleToFill"></image>
					<view>工单</view>
				</view> -->
				<view class="fun_fir" @click="toAdd" v-if="permission.menu && permission.menu.event.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_renwu.png'" class="fir_img" mode="scaleToFill"></image>
					<view>任务</view>
				</view>
				<view class="fun_fir" @click="toApproval">
					<image :src="BASE_IMG_URL+'/index/lxr_shenpi.png'" class="fir_img" mode="scaleToFill"></image>
					<view>办公</view>
				</view>
				<!-- #ifndef H5 -->
				<view class="fun_fir" @click="toClock" v-if="permission.menu && permission.menu.attendance.is_show == 1">
					<image :src="BASE_IMG_URL+'/daka1.png'" class="fir_img_two"></image>
					<view class="tabtext">打卡</view>
				</view>
				<!-- #endif -->
				<view class="fun_fir" @click="toSparepart" v-if="permission.menu && permission.menu.parts.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_kucun.png'" class="fir_img" ></image>
					<view class="tabtext">库存</view>
				</view>
				<view class="fun_fir" @click="workreport" v-if="permission.menu && permission.menu.daily.is_show == 1">
					<image :src="BASE_IMG_URL+'/gongzuobg.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view>工作报告</view>	
				</view>
				<view class="fun_fir" @click="toSignList" v-if="permission.menu && permission.menu.sign_in.is_show == 1">
					<image :src="BASE_IMG_URL+'/chuchaiqd.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view>出差签到</view>
				</view>
				<!-- <view class="fun_fir" @click="toReturnVisit" v-if="permission.menu && permission.menu.visit.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_huifang.png'" class="fir_img" ></image>
					<view class="tabtext">回访</view>
				</view> -->
				<view class="fun_fir" @click="toKnowledge" v-if="permission.menu && permission.menu.aftermarket.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_zhishiku.png'" class="fir_img" mode="scaleToFill"></image>
					<view>知识库</view>
				</view>
				<view class="fun_fir" v-if="permission.menu && permission.menu.work_report.is_show == 1" @click="toJournal">
					<image :src="BASE_IMG_URL+'/index/lxr_rizhi.png'" class="fir_img" ></image>
					<view class="tabtext">日志</view>
				</view>
				<view class="fun_fir" v-if="userInfo.email_code && userPermission.email.is_show == 1"  @click="toEmailbox">
					<image :src="BASE_IMG_URL+'/index/email2.png'" class="fir_img" ></image>
					<view class="tabtext">邮箱</view>
				</view>
			</view>
		</view>
		
		<view class="warpbox">
			<view class="warptitle">财务</view>
			<view class="fun_box">
				<view class="fun_fir" @click="toCostlist" v-if="permission.menu && permission.menu.consume.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_feiyong.png'" class="fir_img" mode="scaleToFill"></image>
					<view>费用</view>
				</view>
				<view class="fun_fir" @click="toCashier" v-if="permission.menu && permission.menu.cashier.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_chuna.png'" class="fir_img"></image>
					<view class="tabtext">出纳</view>
				</view>
				<view class="fun_fir" @click="toPayPlan">
					<image :src="BASE_IMG_URL+'/index_new_18.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view>回款计划</view>
				</view>
				<view class="fun_fir" @click="toCollection" v-if="permission.menu && permission.menu.receivables.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_huikuan.png'" class="fir_img" ></image>
					<view class="tabtext">收款</view>
				</view>
				<view class="fun_fir" @click="toOrder" v-if="permission.menu && permission.menu.order.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_dingdan.png'" class="fir_img"></image>
					<view class="tabtext">订单</view>
				</view>
				<view class="fun_fir" @click="toInvoice">
					<image :src="BASE_IMG_URL+'/index/fapiao.png'" class="fir_img"></image>
					<view class="tabtext">发票</view>
				</view>
			</view>	
		</view>
		<view class="warpbox">
			<view class="warptitle">商业智能</view>
			<view class="fun_box">
				<view class="fun_fir" @click="toAchievement">
					<image :src="BASE_IMG_URL+'/index_new_8.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view class="tabtext">业绩完成度</view>
				</view>
				<view class="fun_fir" @click="toJianbao">
					<image :src="BASE_IMG_URL+'/index_new_9.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view class="tabtext">销售简报</view>
				</view>
				<view class="fun_fir" @click="toTongji" v-if="permission.menu && permission.menu.statistics.is_show == 1">
					<image :src="BASE_IMG_URL+'/index_new_11.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view class="tabtext">综合分析</view>
				</view>
				<view class="fun_fir" @click="toTarget" v-if="permission.menu && permission.menu.achievement.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_mubiao.png'" class="fir_img_two" mode="scaleToFill"></image>
					<view class="tabtext">业绩目标</view>
				</view>
			</view>
		</view>
		
		<tab-bar v-if="tipNumber || tipNumber==0" :tipNumber="tipNumber"></tab-bar>
	</view>
</template>
	
<script>
	import tabBar from '@/components/tabbar/tabbar'
	import { netGetUserInfo, netMesList } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { indexFun } from '../index/index.js'
	
	export default {
		mixins:[indexFun],
		components:{
			tabBar
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				userInfo:{},
				info:{},
				permission:{},  ///权限
				userPermission:{},
				tipNumber:null,
			}
		},
		onShow() {
			this.permission = uni.getStorageSync('permission')
			this.userPermission = uni.getStorageSync('permission').menu
			this.getUserinfo()
			this.getInfo()
		},
		methods: {
			//获取消息
			getInfo() {
				netMesList().then(res=>{
					this.info = res.data
					this.tipNumber = res.data.total
				})
			},
			getUserinfo() {
				netGetUserInfo().then(res=>{
					this.userInfo = res.data
				})
			},
			toEdit() {
				uni.navigateTo({
					url:'/pages/user/set'
				})
			},
			//消息
			toLinkNews() {
				uni.navigateTo({
					url:'/pages/news/index'
				})
			},
			//待办
			todiaban() {
				uni.navigateTo({
					url:'/pagesB/news/needDeal'
				})
			},
			//审批
			toApprovel() {
				uni.navigateTo({
					url:'/pagesB/news/approvelManage/index'
				})
			},
			// //工商信息
			// toBusiness() {
			// 	uni.navigateTo({
			// 		url:'/pagesA/user/business_infomation/index'
			// 	})
			// },
			//我的邮箱
			toEmailbox() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/index?action=2'
				})
			},
			//回访
			toReturnVisit() {
				uni.navigateTo({
					url:'/pagesA/afterSales/returnVisit/index'
				})
			},
			//收款
			toCollection() {
				uni.navigateTo({
					url:'/pagesB/collection/index'
				})
			},
			//业绩完成度
			toAchievement() {
				uni.navigateTo({
					url:'/pagesC/achievementCompletion/achievementObject'
				})
			},
			//销售简报
			toJianbao() {
				uni.navigateTo({
					url:'/pagesC/achievementCompletion/collect'
				})
			},
			//数据统计
			toTongji() {
				uni.navigateTo({
					url:'/pagesB/data_analysis/index'
				})
			},
			//业绩目标
			toTarget() {
				uni.navigateTo({
					url:'/pages/target/achieveStatis'
				})
			},
			//回款计划
			toPayPlan() {
				uni.navigateTo({
					url:'/pagesB/payplan/index'
				})
			},
			//发票
			toInvoice() {
				uni.navigateTo({
					url:'/pagesB/invoice/index'
				})
			}
		}
	}
</script>

<style>
	page{
		background:#F4F4F4;
	}
</style>
<style lang="scss" scoped>
	.warpbox{
		width:702rpx;
		box-sizing: border-box;
		background:#fff;
		border-radius: 20rpx;
		margin:0 auto 30rpx;
		padding:30rpx;
		box-shadow: 1rpx 1rpx 10rpx rgba(0,0,0,0.1);
		.warptitle{
			font-size:26rpx;
			color:#333;
			margin-bottom:30rpx;
		}
		.fun_box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap:wrap;
			.fun_fir{
				flex-shrink: 0;
				background:#fff;
				border-radius: 10rpx;
				text-align: center;
				width:142rpx;
				height:115rpx;
				margin-right:24rpx;
				margin-bottom:24rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size:24rpx;
				color:#000;
				&:nth-child(4n){
					margin-right:0;
				}
				.fir_img{
					width:60rpx;
					height:60rpx;
				}
				.fir_img_two{
					width:50rpx;
					height:50rpx;
					margin-bottom:15rpx;
				}
			}
			
		}
	}
	.fun_box_fir{
		display: flex;
		justify-content: space-around;
		align-items: center;
		.fun_fir_1{
			flex-shrink: 0;
			background:#fff;
			border-radius: 10rpx;
			text-align: center;
			width:142rpx;
			height:115rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:#000;
			position: relative;
			.fun_tip{
				position: absolute;
				right:15rpx;
				top:-15rpx;
				border-radius: 50%;
				background:#F13E27;
				color:#fff;
				font-size:26rpx;
				width:40rpx;
				height:40rpx;
				text-align: center;
				line-height: 40rpx;
				z-index:2;
			}
			image{
				width:50rpx;
				height:50rpx;
				margin-bottom:15rpx;
			}
		}
	}
	.newbox{
		width:750rpx;
		padding:80rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(180deg, #cfe8fe 50%, #F1F4F6 88%, #F4F4F4 100%);
		.newinfo{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.staffimg{
				width:110rpx;
				height:110rpx;
				border-radius: 50%;
				margin-right:30rpx;
			}
			.staff_info{
				.staff_name{
					font-size:30rpx;
					color:#666;
					margin-bottom:15rpx;
				}
			}
		}
		.rightimg{
			width:40rpx;
			height:40rpx;
		}
	}
	.pro_list{
		margin-top:50rpx;
		.pro_li{
			padding:24rpx 30rpx;
			background:#fff;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:24rpx;
			.pro_li_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size:30rpx;
				color:#666;
				.probox{
					width:50rpx;
					height:43rpx;
					margin-right:26rpx;
				}
				.proliimg{
					width:43rpx;
					height:43rpx;
				}
			}
			.proliright{
				width:16rpx;
				height:29rpx;
			}
		}
	}
</style>