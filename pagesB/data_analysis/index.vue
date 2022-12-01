<template>
	<view>
		<view class="tablist_new">
			<view class="tabtn" @click="changeTabs(0)" :class="{'tabtn_active':active == 0}">图表统计</view>
			<view class="tabtn" @click="changeTabs(1)" :class="{'tabtn_active':active == 1}">数字统计</view>
		</view>
		<!-- 图表统计 -->
		<view v-if="active == 0">
			<view class="data_warp">
				<scroll-view scroll-x class="scrollbox">
					<view class="databox">
						<view class="tabli" @click="changeTwoTab(item.id)" :class="{'tabli_active' : item.id == tabId}" v-for="(item,index) in tabTwoList" :key="index">
							<view class="liname">{{item.name}}</view>
							<view class="lip"></view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="data_content">
				<customer-analysis ref="childOne" v-show="tabId == 1" :showCharts="tabId == 1"></customer-analysis>
				<sales-analysis ref="childTwo" v-show="tabId == 2" :showCharts="tabId == 2"></sales-analysis>
				<product-analysis ref="childThr" v-show="tabId == 3" :showCharts="tabId == 3"></product-analysis>
				<staff-achievement ref="childFor" v-show="tabId == 4" :showCharts="tabId == 4"></staff-achievement>
				<purchase-sales ref="childFive" v-show="tabId == 5" :showCharts="tabId == 5"></purchase-sales>
				<rank-list-analysis ref="childSix" v-show="tabId == 6" :showCharts="tabId == 6"></rank-list-analysis>
				<aftersale-analysis ref="childSive" v-show="tabId == 7" :showCharts="tabId == 7"></aftersale-analysis>
				<yeji-mubiao ref="childEit" v-show="tabId == 8" :showCharts="tabId == 8"></yeji-mubiao>
				<view v-if="tabList.length == 0" class="noData">暂无更多</view>
			</view>
		</view>
		<!-- 数字统计 -->
		<view v-if="active == 1">
			<scroll-view class="scrollbox" scroll-x>
				<view class="tabwarp">
					<view class="tabli" v-for="(item,index) in tabList" :key="item" @click="changeTab(index)">
						<view class="tabname">{{item}}</view>
						<view class="tabbot" :class="{'tabactive': tabIndex == index }"></view>
					</view>
				</view>
			</scroll-view>
			<view class="content">
				<scroll-view scroll-y class="scrollcontent" >
					<view class="statiswarp">
						<view class="statis_li" v-for="(item,index) in list" :key="index">
							<view class="static_tip">{{item.name}}</view>
							<view class="statis_con">
								<view class="statis_on" v-for="(ele,eleindex) in item.data" :key="eleindex">
									<view class="tit">{{ele.key}}</view>
									<view class="num">
										{{ele.value}}
										<span>个</span>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netTaskStatisData, netContractStatisData,
	netQuoteStatisData, netPartStatisData, netWorkorderStatisData, 
	netCostStatisData, netChunaStatisData } from '@/api/api.js'
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
				tabList:['费用','出纳','合同','备件','报价单','工单','任务'],
				tabIndex:0,
				list:[],
				
				tabTwoList:[
					{id:1,name:'客户分析'},
					{id:2,name:'销售分析'},
					{id:3,name:'产品分析'},
					{id:4,name:'员工业绩分析'},
					{id:5,name:'进销存销售分析'},
					{id:6,name:'排行榜'},
					{id:7,name:'售后分析'},
					{id:8,name:'业绩目标分析'}
				],
				tabId:1,
				chartDataOne:{
					"categories": ['2021-08-16','2021-08-17'],
					"series": [{
						"name": "老客跟进次数",
						"data": [1,0]
					}]
				},
				active:0,
				permission:{}
			}
		},
		onLoad() {
			this.changeTab(this.tabIndex)
			if(this.tabTwoList.length == 0) {
				this.tabId = null
			}else{
				let id = this.tabTwoList[0].id
				this.changeTwoTab(id)
			}
			
			this.$store.commit('STAFFOBJ',null)
			this.$store.commit('CUSTOMEROBJ',null)
		},
		methods:{
			//changTab
			changeTabs(e) {
				this.active = e
			},
			changeTab(index) {
				this.tabIndex = index
				let name = this.tabList[this.tabIndex]
				if(name == '费用') {
					this.getCostData()
				}else if(name == '出纳'){
					this.getChuna()
				}else if(name == '合同'){
					this.getContractData()
				}else if(name == '备件'){
					this.getPartData()
				}else if(name == '报价单'){
					this.getQuoteData()
				}else if(name == '工单'){
					this.getWorkorder()
				}else if(name == '任务'){
					this.getTaskData()
				}
			},
			changeTwoTab(id) {
				this.tabId = id
				console.log(id,'-----')
				setTimeout(()=>{
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
				},500)
			},
			getTaskData() {
				netTaskStatisData().then(res=>{
					this.list = res.data
				})
			},
			getContractData() {
				netContractStatisData().then(res=>{
					this.list = res.data
				})
			},
			getQuoteData() {
				netQuoteStatisData().then(res=>{
					this.list = res.data
				})
			},
			getCostData() {
				netCostStatisData().then(res=>{
					this.list = res.data
				})
			},
			getChuna() {
				netChunaStatisData().then(res=>{
					this.list = res.data
				})
			},
			getPartData() {
				netPartStatisData().then(res=>{
					this.list = res.data
				})
			},
			getWorkorder() {
				netWorkorderStatisData().then(res=>{
					this.list = res.data
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.data_warp{
		width:750rpx;
		height:100rpx;
		background:#fff;
		.scrollbox{
			width:750rpx;
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
						background:#F3F3F3;
					}
				}
				.tabli_active{
					.liname{
						color:$uni-text-color;
					}
					.lip{
						background:$uni-bg-opacity;
					}
				}
			}
		}
	}
	.scrollbox{
		width:750rpx;
		background:#F3F3F3;
		padding:0 24rpx;
		box-sizing: border-box;
		.tabwarp{
			padding:24rpx 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width:auto;
			.tabli{
				margin-right:30rpx;
				flex-shrink: 0;
				&:last-child{
					margin-right:0;
				}
				.tabname{
					font-size:30rpx;
					color:#999999;
					margin-bottom:10rpx;
					text-align: center;
				}
				.tabbot{
					width:80rpx;
					height:10rpx;
					border-radius: 5rpx;
					background:none;
				}
				.tabactive{
					background:$uni-text-color;
				}
			}
		}
	}
	.content{
		.scrollcontent{
			height:calc(100vh - 300rpx);
			width:100%;
			.statiswarp{
				.statis_li{
					padding:35rpx;
					box-shadow: 0px 1px 15px 0px rgba(115, 142, 255, 0.14);
					margin-bottom:24rpx;
					.static_tip{
						padding-left:35rpx;
						font-size:30rpx;
						font-weight: bold;
						position: relative;
						&::before{
							content:'';
							width:22rpx;
							height:30rpx;
							border-radius: 5rpx;
							background:$uni-text-color;
							position: absolute;
							left:0;
							top:8rpx;
						}
					}
					.statis_con{
						display: flex;
						justify-content: flex-start;
						align-items:center;
						flex-wrap: wrap;
						padding:0 24rpx;
						.statis_on{
							width:50%;
							border-bottom:1rpx solid #f5f5f5;
							padding:24rpx 0;
							&:last-child{
								border-bottom: 0;
							}
							&:nth-last-child(2){
								border-bottom: 0;
							}
							.tit{
								font-size:28rpx;
								color:#999999;
							}
							.num{
								font-size:40rpx;
								color:#333333;
								margin-top:8rpx;
								span{
									font-size:28rpx;
									color:#666;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
