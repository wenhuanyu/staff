<template>
	<view>
		<!-- 搜索 -->
		<search-box @queryData="queryData" @showModal="showSc"></search-box>
		<view class="tabwarp">
			<view class="tabli" 
				:class="tabid == item.id ? 'tabliactive' : ''" 
				v-for="(item,index) in tablist" 
				:key="index"
				@click="changeTab(item.id)">
				<view class="tabtext">{{item.name}}</view>
				<image :src="BASE_IMG_URL + '/index/white-small-cancel.png'" ></image>
				<view class="space"></view>
			</view>
		</view>
		
		<view v-if="tabid == 1">
			<scroll-view scroll-y="true" class="scrollbox"  @scrolltolower="loodMoreWork">
				<view class="listwarp">
					<view class="cost_li" v-for="(item,index) in list" :key="index" @click="toCostDetail(item)">
						<view class="cost_title">工单编号：{{item.workorder_number}}</view>
						<view class="cost_text">工单类型：{{item.workorder_type}}</view>
						<view class="cost_text">关联客户：{{item.customer.name}}</view>
						<view class="cost_text">支付金额：{{item.money}}</view>
						<view class="cost_text">支付方式：{{item.pay_type}}</view>
						<view class="cost_text">创建时间：{{item.pay_time}}</view>
					</view>
					<view class="noData" v-if="list.length == 0">暂无更多</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="tabid == 2">
			<scroll-view scroll-y="true" class="scrollbox">
				<view>
					<view class="collection_item" v-for="(item,index) in payment_list" :key="index" @click="istoPaymentDetail(item)">
						<view class="collection_li">
							<view class="collec_title">回款单号：{{item.number}}</view>
						</view>
						<view class="new_collec">
							<view class="collect_left">
								<view class="collection_li">
									<view class="collec_text" >回款金额：{{item.money}}</view>
								</view>
								<view class="collection_li">
									<view class="collec_text">关联客户： {{item.customer.name}}</view>
								</view>
								<view class="collection_li">
									<view class="collec_text">关联合同： {{item.contract.num}}</view>
								</view>
								<view class="collection_li">
									<view class="collec_text" >回款日期： {{item.return_time}}</view>
								</view>
							</view>
							<view class="collection_li">
								<view class="recostatus" v-if="item.check_status == 0">
									<image :src="BASE_IMG_URL + '/index/check.png'" class="statusImg" ></image>
								</view>
								<view class="recostatus" v-if="item.check_status == 1">
									<image :src="BASE_IMG_URL + '/index/check.png'" class="statusImg" ></image>
								</view>
								<view class="recostatus" v-if="item.check_status == 2">
									<image :src="BASE_IMG_URL + '/index/passed.png'" class="statusImg" ></image>
								</view>
								<view class="recostatus" v-if="item.check_status == 3">
									<image :src="BASE_IMG_URL + '/index/refused.png'" class="statusImg" ></image>
								</view>
								<view class="recostatus" v-if="item.check_status == 4">
									<image :src="BASE_IMG_URL + '/index/recalled.png'" class="statusImg" ></image>
								</view>
							</view>
						</view>
					</view>
					<view class="noData" v-if="payment_list.length == 0">暂无更多</view>
				</view>
			</scroll-view>
			<!-- 回款金额统计 -->
			<view class="bot_total" @click="lookTotal">总金额合计> </view>
			
			<uni-popup ref="popupTotal" type="bottom" background-color="#fff">
				<view class="botwarp">
					<view class="wa_li">
						<view class="wa_label">合同总金额</view>
						<view class="wa_money"> <text>{{moneyInfo.allmoney?moneyInfo.allmoney:'0'}}</text>元 </view>
					</view>
					<view class="wa_li">
						<view class="wa_label">已回款金额</view>
						<view class="wa_money"> <text>{{moneyInfo.remoney?moneyInfo.remoney:'0'}}</text>元 </view>
					</view>
					<view class="wa_li">
						<view class="wa_label">回款中金额</view>
						<view class="wa_money"> <text>{{moneyInfo.inmoney?moneyInfo.inmoney:'0'}}</text>元 </view>
					</view>
					<view class="wa_li">
						<view class="wa_label">未回款金额</view>
						<view class="wa_money"> <text>{{moneyInfo.nomoney?moneyInfo.nomoney:'0'}}</text>元 </view>
					</view>
					<view class="wa_btn" @click="removeTotal">取消</view>
				</view>
			</uni-popup>
			
			<view class="icon_creat" @click="addPayment">
				<image :src="BASE_IMG_URL+'/index/add-btn.png'" mode="scaleToFill"></image>
			</view>
		</view>
	
		<screen-pop ref="screenChild" :type="tabid" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { netFinanceConfirm, netPaymentList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screenPop.vue'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				name:'',
				tablist:[
					{id:2,name:'合同回款'},
					{id:1,name:'工单收款'},
				],
				tabid:2,
				list:[],    //工单列表
				page:1,
				totalPage:1,
				queryParams:{},
				payment_list:[],   //合同列表
				defaultObj:{times:'',type:''},
				moneyInfo:{}
			}
		},
		onLoad(options) {
			if(options.type){
				this.defaultObj = {
					times: options.times,
					type: options.type,
					check_status: options.check_status
				}
				this.tabid = options.tabid
			}
		},
		onShow() {
			this.init()
		},
		methods:{
			//查看总金额合计
			lookTotal() {
				this.$refs.popupTotal.open()
			},
			removeTotal() {
				this.$refs.popupTotal.close()
			},
			init() {
				this.page = 1
				if(this.tabid == 1){
					this.list = []
					//工单列表
					this.getWorkorder()
				}else if(this.tabid == 2){
					//合同回款列表
					this.payment_list = []
					this.getPayment()
				}
			},
			changeTab(id) {
				this.tabid = id
				this.init()
			},
			queryData(e){
				this.name = e.value
				this.init()
			},
			showSc() {
				this.$refs.screenChild.open(this.defaultObj)
			},
			sureQuery(params) {
				this.queryParams = params
				this.defaultObj = {
					times: params.times,
					type: params.type,
					check_status: params.check_status
				}
				if(this.tabid == 1) {
					this.page = 1
					this.list = []
					this.getWorkorder()
				}else{
					this.page = 1
					this.payment_list = []
					this.getPayment()
				}
			},
			//工单列表
			getWorkorder() {
				let params = {
					page:this.page,
					name:this.name,
					...this.queryParams
				}
				netFinanceConfirm(params).then(res=>{
					this.totalPage = res.data.last_page
					this.list = this.list.concat(res.data.data)
				})
			},
			//工单加载更多
			loodMoreWork() {
				if(this.page < this.totalPage) {
					this.page ++
					this.getWorkorder()
				}
			},
			//工单详情
			toDetail(item) {
				if(item.workorder_type == '上门维修'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorderDetail?workorderid='+item.id
					})
				}else if(item.workorder_type == '返厂维修'){
					uni.navigateTo({
						url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+item.id
					})
				}else if(item.workorder_type == '电话售后'){
					uni.navigateTo({
						url:'/pagesA/afterSales/phoneAftersale/detail?id='+item.id
					})
				}
			},
			toCostDetail(item) {
				uni.navigateTo({
					url:'/pagesB/collection/workorder_cost_confirm?id='+item.id
				})
			},
			//回款列表
			getPayment() {
				let params = {
					name:this.name,
					page:this.page,
					times:this.defaultObj.times,
					type:this.defaultObj.type,
					check_status: this.defaultObj.check_status,
					...this.queryParams
				}
				netPaymentList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.payment_list = this.payment_list.concat(res.data.data)
					this.moneyInfo = res.data.moneyinfo
				})
			},
			//回款 详情
			istoPaymentDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/payment/paymentDetail?paymentid='+item.id
				})
			},
			//添加回款
			addPayment() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/payment/createPayment'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 130rpx;
		right: 100rpx;
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
	}
	.bot_total{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:calc(80rpx + env(safe-area-inset-bottom) / 2);
		background:#fff;
		font-size:24rpx;
		color:#333;
		text-align: center;
		line-height: 80rpx;
		color:$uni-text-color;
		border-top:1rpx solid #f5f5f5;
		padding-bottom:calc(env(safe-area-inset-bottom) / 2);
	}
	.botwarp{
		background:#fff;
		padding:0 24rpx;
		.wa_li{
			padding:24rpx 35rpx;
			border-bottom:1rpx solid #f5f5f5;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.wa_label{
				font-size:24rpx;
				color:#333;
			}
			.wa_money{
				font-size:24rpx;
				color:#666;
				text{
					color:$uni-text-color;
				}
			}
		}
		.wa_btn{
			width:100%;
			height:100rpx;
			font-size:24rpx;
			color:$uni-text-color;
			text-align: center;
			line-height: 100rpx;
		}
	}
	.searbox{
		padding:10rpx 0 20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background:$uni-btn-bg-color;
		.censear{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 24rpx;
			border-radius: 34rpx;
			background:#FFFFFF;
			width:487rpx;
			height:66rpx;
			.searimg{
				width:35rpx;
				height:35rpx;
				margin-right: 15rpx;
			}
			.lself{
				.lself{
					font-size:26rpx;
					color: #999;
				}
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 242rpx);
		.listwarp{
			width:690rpx;
			margin:24rpx auto;
			.cost_li{
				padding:24rpx;
				border-radius: 20rpx;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				margin-bottom:24rpx;
				.cost_title{
					border-bottom:1rpx solid #ededed;
					font-size:26rpx;
					color:#666;
					padding:0 0 24rpx 0;
					margin-bottom:20rpx;
				}
				.cost_text{
					font-size:26rpx;
					color: #999;
					margin-bottom:15rpx;
				}
			}
		}
	}
	.collection_item{
		padding: 0 24rpx 30rpx;
		width:690rpx;
		margin:24rpx auto 0;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		.collec_title{
			border-bottom:1rpx solid #ededed;
			font-size:26rpx;
			color:#666;
			padding:24rpx 0 24rpx 0;
		}
		.new_collec{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.collect_left{
			.collection_li{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom:15rpx;
				&:last-child{
					margin-bottom:0;
				}
				.collec_text{
					font-size:26rxp;
					color:#999999;
				}
			}
		}
		.collection_li{
			margin-top: 20rpx;
			.recostatus{
				.statusImg{
					width: 111rpx;
					height: 87rpx;
				}
			}
		}
	}
	
	.litab{
		display: flex;
		justify-content: space-around;
		align-items: center;
		height:100rpx;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		.litab_item{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size:26rpx;
			color:#999999;
		}
		.litab_text{
			padding-bottom: 15rpx;
			color:#999;
		}
		.space{
			width: 12rpx;
			height: 6rpx;
			background-color: rgba(0,0,0,0);
		}
		image{
			display: none;
		}
		.litab_item_active{
			
			.litab_text{
				padding-bottom: 15rpx;
				color:$uni-text-color;
			}
			.space{
				display: none;
			}
			image{
				display: inline-block;
				width: 12rpx;
				height: 6rpx;
			}
		}
	}
	.tabwarp{
		padding:0 24rpx 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-color: $uni-btn-bg-color;
		.tabli{
			margin: 0 30rpx;
			.tabnum{
				font-size:34rpx;
				color:#666666;
			}
			.tabtext{
				font-size:28rpx;
				color:#fff;
				margin:15rpx 0;
			}
			.space{
				width: 12rpx;
				height: 6rpx;
				background-color: rgba(0,0,0,0);
			}
			image{
				display: none;
			}
		}
		.tabliactive{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.tabnum{
				color:#0287FF;
			}
			.tabtext{
				color:#FFFFFF;
			}
			.space{
				display: none;
			}
			image{
				display: inline-block;
				width: 12rpx;
				height: 6rpx;
			}
		}
	}
</style>
