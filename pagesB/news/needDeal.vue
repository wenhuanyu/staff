<template>
	<view>
		<view class="backlog">
			<!-- 时间 -->
			<view class="backlog_time">
				{{isToday}}
			</view>
			<view class="backlog_content">
				<view class="backlog_item" @click="toLookList(1)">
					<view class="item_img">
						<image :src="BASE_IMG_URL+'/daiban_customer.png'" mode="scaleToFill"></image>
					</view>
					<view class="item_event">待跟进客户</view>
					<view class="item_num">
						<view>{{needDealinfo.customer?needDealinfo.customer:''}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="backlog_item" @click="toLookList(9)">
					<view class="item_img">
						<image :src="BASE_IMG_URL+'/tixing.png'" mode="scaleToFill"></image>
					</view>
					<view class="item_event">待跟进商机</view>
					<view class="item_num">
						<view>{{needDealinfo.business?needDealinfo.business:''}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="backlog_item" @click="toLookList(6)">
					<view class="item_img">
						<image :src="BASE_IMG_URL+'/daiban_contract.png'" mode="scaleToFill"></image>
					</view>
					<view class="item_event">待跟进合同</view>
					<view class="item_num">
						<view>{{needDealinfo.contract?needDealinfo.contract:''}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="backlog_item" @click="toLookList(7)">
					<view class="item_img">
						<image :src="BASE_IMG_URL+'/daiban_lead.png'" mode="scaleToFill"></image>
					</view>
					<view class="item_event">待跟进线索</view>
					<view class="item_num">
						<view>{{needDealinfo.lead?needDealinfo.lead:''}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="backlog_item" @click="toLookList(8)">
					<view class="item_img">
						<image :src="BASE_IMG_URL+'/daiban_contacts.png'" mode="scaleToFill"></image>
					</view>
					<view class="item_event">待跟进联系人</view>
					<view class="item_num">
						<view>{{needDealinfo.contacts?needDealinfo.contacts:''}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="backlog_item" @click="toLookList(2)">
					<view class="item_img">
						<image :src="BASE_IMG_URL+'/richeng.png'" mode="scaleToFill"></image>
					</view>
					<view class="item_event">待处理任务</view>
					<view class="item_num">
						<view>{{needDealinfo.event_one?needDealinfo.event_one:''}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="backlog_item" @click="toLookList(5)">
					<view class="item_img">
						<image :src="BASE_IMG_URL+'/tixing.png'" mode="scaleToFill"></image>
					</view>
					<view class="item_event">待回款提醒</view>
					<view class="item_num">
						<view>{{needDealinfo.receivables_plan?needDealinfo.receivables_plan:''}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netNeedDealtData } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	export default{
		data() {
			return{
				isToday:'',
				needDealinfo:{},
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.isToday = this.getNowData()
			this.getNeedDeal()
			
		},
		methods:{
			//当天
			getNowData() {
				let data = new Date() //当前日期
				let year = Number(data.getFullYear());//当前年
				let month = Number(data.getMonth())+1;
				let day = Number(data.getDate()); //当天
				return year+'-'+(month >= 10 ? month : '0'+month)+'-'+(day >= 10 ? day : '0'+day)
			},
			//获取 待办 事项
			getNeedDeal() {
				netNeedDealtData().then(res=>{
					this.needDealinfo = res.data
				})
			},
			//待办  事项   明细  列表
			toLookList(type) {
				//待跟进客户
				if(type == 1 || type == 6 || type == 7 || type == 8 || type == 9){
					uni.navigateTo({
						url:'/pagesB/news/needrecord?type='+type
					})
				}else if(type == 2){
					uni.navigateTo({
						url:'/pages/news/toduList'
					})
				}else{
					uni.navigateTo({
						url:'/pagesB/news/dataList?type='+type
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	// 待办事项
	.backlog {
		padding-bottom:100rpx;
		.backlog_time {
			height: 100rpx;
			padding-left: 30rpx;
			line-height: 100rpx;
			font-size: 28rpx;
		}
		.backlog_content {
			background:#fff;
			margin: 0 20rpx;
			.backlog_item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 20rpx;
				height: 120rpx;
				line-height: 120rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				border-radius: 20rpx;
				box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
				.item_img {
					width: 90rpx;
	
					image {
						width: 70rpx;
						height: 70rpx;
						margin-top: 53rpx;
					}
				}
	
				.item_event {
					flex: 1;
					font-size: 28rpx;
				}
	
				.item_num {
					display: flex;
				}
			}
		}
	}
</style>
