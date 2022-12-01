<template>
	<view class="">
		<view class="tab_list">
			<view class="tabli" :class="type == 0 ? 'tabliactive' : ''" @click="changeFirTab(0)">全部</view>
			<view class="tabli" :class="type == 1 ? 'tabliactive' : ''" @click="changeFirTab(1)">我负责的</view>
			<view class="tabli" :class="type == 2 ? 'tabliactive' : ''" @click="changeFirTab(2)">下属负责的</view>
		</view>
		<!-- 筛选 -->
		<view class="searchbox">
			<view class="searchtext" @click="toQuery">筛选<view class="iconfont icon-shaixuan"></view></view>
		</view>
		
		<scroll-view scroll-y="true" class="scrollbox">
			<view class="listbox">
				<view class="pay_li" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
					<view class="recostatus" v-if="!item.invoice_time"><span>未开票</span></view>
					<view class="recostatus" v-if="item.invoice_time"><span>已开票</span></view>
					<view class="pay_num">回款编号：{{item.number}}</view>
					<view class="infobox">
						<view class="infoleft">
							<view class="litext">关联客户：{{item.customer?item.customer.name:''}}</view>
							<view class="litext">关联合同：{{item.contract?item.contract.name:''}}</view>
							<view class="litext">开票金额：{{item.money}}</view>
							<view class="litext">开票日期：{{item.time}}</view>
						</view>
						<view class="staffinfo">
							<image :src="item.owner_staff.img" class="staffimg"></image>
							<view class="staffname">{{item.owner_staff.name}}</view>
							<view class="status" v-if="item.check_status == 1">审核中</view>
							<view class="status" v-if="item.check_status == 2">审核通过</view>
							<view class="status" v-if="item.check_status == 3">审核未通过</view>
						</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</scroll-view>
		<view class="icon_creat" @click="toAddInvoice">
			<image :src="BASE_IMG_URL+'/1.png'" mode="scaleToFill"></image>
		</view>
		
		
		<screen-pop ref="screenChild" @sureParams="sureParams"></screen-pop>
	</view>
</template>

<script>
	import { netInvoiceList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screen.vue'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				type:0,
				page:1,
				totalPage:1,
				list:[],
				queryParams:{}
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.init()
		},
		methods:{
			changeFirTab(type) {
				this.type = type
				this.init()
			},
			toQuery() {
				this.$refs.screenChild.open()
			},
			sureParams(obj) {
				this.queryParams = obj
				this.init()
			},
			init(){
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					page:this.page,
					type:this.type,
					...this.queryParams
				}
				netInvoiceList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			toAddInvoice() {
				uni.navigateTo({
					url:'/pagesB/invoice/addInvoice'
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesB/invoice/detail?id='+item.id
				})
			}
		}
	}
</script>


<style>
	page{
		background-color: #f5f5f5;
	}
</style>
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
	.tab_list{
		width:750rpx;
		height:80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background:#fff;
		.tabli{
			font-size:24rpx;
			color:#333;
			line-height: 75rpx;
			text-align: center;
			border-bottom:4rpx solid #fff;
		}
		.tabliactive{
			border-bottom:4rpx solid $uni-text-color;
		}
	}
	.searchbox{
		display: flex;
		justify-content: flex-end;
		margin:24rpx;
		.searchtext{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:$uni-text-color;
			padding:8rpx 28rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			.icon-shaixuan{
				color:$uni-text-color;
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 120rpx);
		.listbox{
			width:690rpx;
			margin:0 auto;
			.pay_li{
				width:690rpx;
				background:#fff;
				padding:30rpx;
				box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
				border-radius: 20rpx;
				margin-bottom:20rpx;
				position: relative;
				.recostatus{
					background:$uni-bg-opacity;
					border-radius: 5rpx;
					font-size: 26rpx;
					color: $uni-text-color;
					padding: 5rpx 12rpx;
					position: absolute;
					right:24rpx;
					top:24rpx;
				}
				.pay_num{
					padding-bottom:14rpx;
					border-bottom:1rpx solid #f5f5f5;
					font-size:28rpx;
					color:#666;
					margin-bottom:14rpx;
				}
				.infobox{
					display: flex;
					justify-content: space-between;
					align-items: cneter;
					.infoleft{
						.litext{
							font-size:24rpx;
							color:#999;
							margin-bottom:10rpx;
						}
					}
					.staffinfo{
						display: flex;
						flex-direction: column;
						align-items: center;
						.staffimg{
							width:60rpx;
							height:60rpx;
							border-radius: 50%;
						}
						.staffname{
							font-size:24rpx;
							color:#666;
							margin-top:10rpx;
						}
						.status{
							font-size:26rpx;
							color: $uni-text-color;
							margin-top:15rpx;
						}
					}
				}
				
			}
		}
	}
</style>