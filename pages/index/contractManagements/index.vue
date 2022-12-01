<template>
	<view>
		<!-- 顶部 -->
		<common-top title="合同" @toStaticPage="toStaticPage"></common-top>
		<!-- 搜索 -->
		<search-box @queryData="queryData" @showModal="showSc"></search-box>
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore">
			<view style="padding:24rpx 0;">
				<item :list="contract_list"></item>
			</view>
		</scroll-view>
		<!-- 创建合同图标 -->
		<view class="icon_creat" @click="createContract">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'"></image>
		</view>
		<!-- 合同金额统计 -->
		<view class="bot_total" @click="lookTotal">总金额合计> </view>
		
		<uni-popup ref="popupTotal" type="bottom" background-color="#fff">
			<view class="botwarp">
				<view class="wa_li">
					<view class="wa_label">累计合同总金额</view>
					<view class="wa_money"> <text>{{moneyInfo.allmoney?moneyInfo.allmoney:'0'}}</text>元 </view>
				</view>
				<view class="wa_li">
					<view class="wa_label">累计已回款金额</view>
					<view class="wa_money"> <text>{{moneyInfo.repayment_money?moneyInfo.repayment_money:'0'}}</text>元 </view>
				</view>
				<view class="wa_li">
					<view class="wa_label">累计未回款金额</view>
					<view class="wa_money"> <text>{{moneyInfo.no_money?moneyInfo.no_money:'0'}}</text>元 </view>
				</view>
				<view class="wa_btn" @click="removeTotal">取消</view>
			</view>
		</uni-popup>
		
		<screen-pop 
			ref="screenChild" 
			@sureQuery="sureQuery"
			:searchForm="searchForm"
			@changeSearchData="changeSearchData"
			@resetForm="resetForm"
		></screen-pop>
	</view>
</template>

<script>
	import { netOutContractList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import Item from './item.vue'
	import screenPop from './screenPop.vue'
	
	export default{
		components:{
			screenPop,
			Item
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				name:'',
				page:1,
				totalPage:1,
				contract_list:[],
				queryObj:{},
				searchForm:null,  //搜索表单
				defaultObj:{type:'',times:'',check_status:''},
				moneyInfo:{},
			}
		},
		
		onLoad(options) {
			if(options.type){
				this.defaultObj = options
			}
			this.$store.commit('CUSTOMEROBJ',null)
			this.$store.commit('STAFFOBJ',null)
			//获取搜索表单
			this.getSearchForm()
		},
		onShow() {
			this.init()
		},
		methods:{
			//统计页面
			toStaticPage() {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractStatis'
				})
			},
			//查看总金额合计
			lookTotal() {
				this.$refs.popupTotal.open()
			},
			removeTotal() {
				this.$refs.popupTotal.close()
			},
			//搜索表单
			getSearchForm() {
				this.handleSearchForm('contract',(data)=>{
					this.searchForm = data
				})
			},
			changeSearchData(type,key,value){
				let obj = this.handleChangeSearchValue(this.searchForm,type,key,value)
				this.$set(this.searchForm, obj.v_index, obj.v_obj)
			},
			resetForm() {
				let arr = JSON.parse(JSON.stringify(this.handleResetSearch(this.searchForm)))
				this.searchForm = arr
			},
			loadMore() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getContract()
			},
			showSc() {
				this.$refs.screenChild.open(this.defaultObj)
			},
			sureQuery(params) {
				this.queryObj = params
				this.defaultObj = {
					type: params.type,
					times: params.createtime,
					check_status: params.check_status
				}
				this.init()
			},
			init() {
				this.page = 1
				this.totalPage = 1
				this.contract_list = []
				this.getContract()
			},
			getContract() {
				let params = {
					name:this.name,
					page:this.page,
					type:this.defaultObj.type,
					createtime:this.defaultObj.times,
					check_status:this.defaultObj.check_status,
					...this.queryObj,
					...this.handleSureSearch(this.searchForm)
				}
				netOutContractList(params).then(res=>{
					this.contract_list = this.contract_list.concat(res.data.data)
					this.totalPage = res.data.last_page
					this.moneyInfo = res.data.moneyinfo
				})
			},
			queryData(e) {
				this.name = e.value
				this.init()
			},
			
			toCustomerDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+item.customer.id
				})
			},
			//创建合同
			createContract() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/order/createOrder'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			width:584rpx;
			height:68rpx;
			.searimg{
				width:48rpx;
				height:48rpx;
			}
			.lself{
				width:500rpx;
				.lself{
					font-size:26rpx;
					color:rgba(2, 135, 255, 1);
				}
			}
		}
	}
	.tabwarp{
		padding: 25rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width:750rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		border-radius: 10rpx;
		overflow: hidden;
		.tabli{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size:26rpx;
			color:#999999;
			text{
				color: #999;
				padding-bottom: 15rpx;
			}
			.space{
				display: inline-block;
				width: 12rpx;
				height: 6rpx;
				background-color: rgba(0,0,0,0);
			}
			image{
				display: none;
			}
		}
		.tabli_active{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26rpx;
			color: $uni-text-color;
			text{
				color: $uni-text-color;
				padding-bottom: 15rpx;
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
	.scrollbox{
		width:750rpx;
		padding-bottom:24rpx;
		height:calc(100vh - 200rpx);
	}
	
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
</style>
