<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL + '/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入关键词搜索" @input="queryData" class="lself" placeholder-style="color:#999">
			</view>
			<!-- 筛选 -->
			<view class="seletab_warp">
				<view class="sele_box" @click="toSort">
					<image :src="BASE_IMG_URL + '/index/sort-two.png'" class="seleimg" ></image>
				</view>
				<view class="sele_box" @click="toShowScreemn">
					<image :src="BASE_IMG_URL + '/index/shaixuan.png'" class="seleimgsec" ></image>
				</view>
			</view>
		</view>
		
		<!-- 列表 -->
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loodMore">
			<view class="list_warp">
				<w-customer-item :list="list" @receiveSuccess="receiveSuccess"></w-customer-item>
			</view>
		</scroll-view>
		
		<!-- 排序筛选 -->
		<sort-pop ref="sortChild" @sortQuery="sortQuery" ></sort-pop>
		<!-- 筛选 -->
		<!-- 筛选 -->
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
	import wCustomerItem from './item.vue'
	import { netSeasKehuList } from '@/api/api.js'
	import sortPop from '@/pages/index/myCustomer/components/sortPop.vue'
	import screenPop from '@/pages/index/myCustomer/components/screenPop.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default {
		components:{
			wCustomerItem,
			sortPop,
			screenPop
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				level:3,
				page:1,
				totalPage:1,
				list:[],
				queryParams:{},
				sort:'',
				searchForm:[],  //搜索表单
			}
		},
		onLoad(){
			this.init()
			//获取搜索表单
			this.getSearchForm()
		},
		methods:{
			loodMore() {
				if(this.page < this.totalPage){
					this.page ++
					this.getList()
				}
			},
			//搜索
			queryData(e) {
				this.name = e.detail.value
				this.list = []
				this.init()
			},
			//排序筛选
			toSort() {
				this.$refs.sortChild.open()
			},
			//排序 查询
			sortQuery(data) {
				this.sort = data
				this.init()
			},
			//搜索表单
			getSearchForm() {
				this.handleSearchForm('customer',(data)=>{
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
			//筛选弹框
			toShowScreemn() {
				this.$refs.screenChild.open()
			},
			sureQuery(params) {
				this.queryParams = params
				this.init()
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					page:this.page,
					name:this.name,
					is_seas: 1,
					sortid:this.sort,
					...this.queryParams,
					...this.handleSureSearch(this.searchForm)
				}
				netSeasKehuList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			receiveSuccess() {
				this.init()
			},
			toDetail() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searbox{
		padding:0 24rpx 24rpx 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background:$uni-btn-bg-color;
		box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0, 0, 0, 0.2);
		.censear{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 22rpx;
			border-radius: 23rpx;
			background:#F6F6F6;
			width:487rpx;
			height:60rpx;
			.searimg{
				width:38rpx;
				height:35rpx;
			}
			.lself{
				padding: 13rpx 0 13rpx 19rpx;
				width:450rpx;
				color: #999;
				font-size:26rpx;
			}
		}
	}
	.seletab_warp{
		width:203rpx;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		.sele_box{
			display: flex;
			justify-content: center;
			align-items: center;
			.seleimg{
				width:36rpx;
				height:36rpx;
			}
			.seleimgsec{
				width:35rpx;
				height:28rpx;
			}
		}
		.sele_box_active{
			color:#118EFF;
		}
		
	}
	.search_box {
		padding: 0rpx 24rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;

		.left_box {
			flex: 1;
		}

		.right_btn {
			font-size: 28rpx;
			color: #007AFF;
		}
	}
	.sele_box {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 24rpx;
		height: 70rpx;
		// background: #fff;
		// border-bottom:1rpx solid #f5f5f5;
		.se_li {
			width: 200rpx;
			height: 70rpx;

			.se_box {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 70rpx;

				.se_text {
					font-size: 24rpx;
					color: 3333;
				}

				.iconfont {
					font-size: 24rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 110rpx);
		.list_warp{
			padding:30rpx;
		}
	}
</style>
