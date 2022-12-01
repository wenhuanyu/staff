<template>
	<view>
		<view class="data_warp">
			<scroll-view scroll-x class="scrollbox">
				<view class="databox">
					<view class="tabli" @click="changeTab(item.id)" :class="{'tabli_active' : item.id == tabId}" v-for="(item,index) in tabList" :key="index">
						<view class="liname">{{item.name}}</view>
						<view class="lip"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="data_content">
			<customer-analysis ref="childOne" v-show="tabId == 1"></customer-analysis>
			<sales-analysis ref="childTwo" v-show="tabId == 2" :showCharts="tabId == 2"></sales-analysis>
			<product-analysis ref="childThr" v-show="tabId == 3" :showCharts="tabId == 3"></product-analysis>
			<staff-achievement ref="childFor" v-show="tabId == 4" :showCharts="tabId == 4"></staff-achievement>
			<purchase-sales ref="childFive" v-show="tabId == 5" :showCharts="tabId == 5"></purchase-sales>
			<rank-list-analysis ref="childSix" v-show="tabId == 6" :showCharts="tabId == 6"></rank-list-analysis>
			<aftersale-analysis ref="childSive" v-show="tabId == 7" :showCharts="tabId == 7"></aftersale-analysis>
			<yeji-mubiao ref="childEit" v-show="tabId == 8" :showCharts="tabId == 8"></yeji-mubiao>
			<view class="noData" v-if="tabList.length == 0">暂无更多</view>
		</view>
		
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import tabBar from '@/components/tabbar/tabbar'
	import customerAnalysis from './customer_analysis.vue'
	import salesAnalysis from './sales_analysis.vue'
	import productAnalysis from './product_analysis.vue'
	import staffAchievement from './staff_achievement.vue'
	import purchaseSales from './purchase_sales.vue'
	import rankListAnalysis from './rank_list.vue'
	import aftersaleAnalysis from './aftersale_analysis.vue'
	import yejiMubiao from './yeji_mubiao.vue'
	import { mapState } from 'vuex'
	
	export default{
		components:{
			tabBar,
			customerAnalysis,
			salesAnalysis,
			productAnalysis,
			staffAchievement,
			purchaseSales,
			rankListAnalysis,
			aftersaleAnalysis,
			yejiMubiao
		},
		data() {
			return{
				// tabList:[
				// 	{id:1,name:'客户分析'},
				// 	{id:2,name:'销售分析'},
				// 	{id:3,name:'产品分析'},
				// 	{id:4,name:'员工业绩分析'},
				// 	{id:5,name:'进销存销售分析'},
				// 	{id:6,name:'排行榜'},
				// 	{id:7,name:'售后分析'},
				// 	{id:8,name:'业绩目标分析'}
				// ],
				tabList:[],
				tabId:1,
				chartDataOne:{
					"categories": ['2021-08-16','2021-08-17'],
					"series": [{
						"name": "老客跟进次数",
						"data": [1,0]
					}]
				},
				permission:{}
			}
		},
		onLoad() {
			this.permission = uni.getStorageSync('permission')
			let permis = this.permission.statistics.menus
			if(permis.customer.is_show == 1) {
				this.tabList.push({id:1,name:'客户分析'})
			}
			if(permis.contract.is_show == 1) {
				this.tabList.push({id:2,name:'销售分析'})
			}
			if(permis.product.is_show == 1) {
				this.tabList.push({id:3,name:'产品分析'})
			}
			if(permis.staff.is_show == 1) {
				this.tabList.push({id:4,name:'员工业绩分析'})
			}
			if(permis.parts.is_show == 1) {
				this.tabList.push({id:5,name:'进销存销售分析'})
			}
			if(permis.ranking.is_show == 1) {
				this.tabList.push({id:6,name:'排行榜'})
			}
			if(permis.workorder.is_show == 1) {
				this.tabList.push({id:7,name:'售后分析'})
			}
			if(permis.achievement.is_show == 1) {
				this.tabList.push({id:8,name:'业绩目标分析'})
			}
			
			if(this.tabList.length == 0) {
				this.tabId = null
			}else{
				let id = this.tabList[0].id
				this.changeTab(id)
			}
		},
		methods:{
			changeTab(id) {
				this.tabId = id
				if(id == 1) {
					this.$refs.childOne.init()
				}else if(id == 2) {
					this.$refs.childTwo.init()
				}else if(id == 3) {
					this.$refs.childThr.init()
				}else if(id == 4) {
					this.$refs.childFor.init()
				}else if(id == 5) {
					this.$refs.childFive.init()
				}else if(id == 6) {
					this.$refs.childSix.getRanking()
				}else if(id == 7) {
					this.$refs.childSive.init()
				}else if(id == 8) {
					this.$refs.childEit.init()
				}
			}
		}
	}
</script>

<style>
	page{
		background:#f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.data_warp{
		width:750rpx;
		height:100rpx;
		background:#fff;
		.scrollbox{
			width:702rpx;
			margin:0 auto;
			height:100rpx;
			.databox{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height:100rpx;
				padding-top:28rpx;
				.tabli{
					margin-right:45rpx;
					flex-shrink: 0;
					.liname{
						font-size:30rpx;
						color:#999999;
						margin-bottom:20rpx;
					}
					.lip{
						width:100rpx;
						height:10rpx;
						border-radius: 5rpx;
						margin:0 auto;
						background:#fff;
					}
				}
				.tabli_active{
					.liname{
						color:#0287FF;
					}
					.lip{
						background:rgba(2, 135, 255, 0.2);
					}
				}
			}
		}
	}
</style>
