<template>
	<view>
		<!-- 搜索 -->
		<view class="tabwarp">
			<view class="tabli" 
				:class="tabIndex == index ? 'tabliactive' : ''" 
				v-for="(item,index) in tablist" 
				:key="index"
				@click="changeTab(index)"
				>
				<view class="tabtext">{{item.name}}</view>
				<image :src="BASE_IMG_URL + '/index/white-small-cancel.png'"></image>
				<view class="space"></view>
			</view>
			<image :src="BASE_IMG_URL+'/index/shaixuan.png'" @click="toSearch" class="searchimg"></image>
		</view>
		
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loodMore">
			<view class="quowarp">
				<quo-item :list="list" :type="tablist[tabIndex].id"></quo-item>
			</view>
		</scroll-view>
		<!-- 创建用户图标 -->
		<view class="icon_creat" @click="createQuotation">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'"></image>
		</view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { netQuotationList, netQuotationNumber } from '@/api/api.js'
	import quoItem from './item.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import screenPop from './screenPop.vue'
	
	export default{
		components:{
			quoItem,
			screenPop
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				tablist:[
					{id:1,name:'所有的',num:0},
					{id:2,name:'我审核的',num:0}
				],
				tabIndex:0,
				page:1,
				totalPage:1,
				status:'',    //0 进行中 1 转化成功  9作废
				name:'',   //搜索产品名称
				times:'',   //时间范围筛选
				staff_id:'',   //销售id
				list:[],
				queryParams:{},
				defaultObj:{
					type:'',
					times:''
				}
			}
		},
		onLoad(options) {
			if(options.type){
				this.defaultObj = options
			}
		},
		onShow() {
			this.init()
			//获取 报价单 数量
			// this.getNumber()
		},
		methods:{
			getNumber() {
				netQuotationNumber().then(res=>{
					this.tablist[0].num = res.data.faqi
					this.tablist[1].num = res.data.shenpi
				})
			},
			changeTab(index) {
				this.tabIndex = index
				this.litabIndex = 0
				this.init()
			},
			changeItem(index) {
				this.litabIndex = index
				this.init()
			},
			toSearch() {
				this.$refs.screenChild.open(this.defaultObj)
			},
			sureQuery(params) {
				this.queryParams = params
				this.defaultObj = {
					type: params.type,
					times: params.times
				}
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
					type_tab: this.tablist[this.tabIndex].id,
					type:this.defaultObj.type,
					times:this.defaultObj.times,
					...this.queryParams
				}
				netQuotationList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			loodMore() {
				if(this.page < this.totalPage){
					this.page ++
					this.getList()
				}
			},
			//新增
			createQuotation() {
				uni.navigateTo({
					url:'/pagesC/quotation/addQuotation'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabwarp{
		padding:0 24rpx 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-color: $uni-btn-bg-color;
		position: relative;
		.searchimg{
			width:37rpx;
			height:30rpx;
			position: absolute;
			right:50rpx;
			top:20rpx;
		}
		.tabli{
			display: flex;
			flex-direction: column;
			align-items: center;
			// width:50%;
			// text-align: center;
			.tabnum{
				font-size:34rpx;
				color:#666666;
			}
			.tabtext{
				font-size:28rpx;
				color:#FEFEFE;
				margin:15rpx 0;
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
		.tabli:nth-child(2){
			margin: 0 30rpx;
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
	.litab{
		padding: 0 30rpx;
		width:100%;
		height:100rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		display: flex;
		justify-content: space-around;
		align-items: center;
		.litab_item{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// width:33.33%;
			font-size:26rpx;
			color:#999999;
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
	.scrollbox{
		width:100%;
		height:calc(100vh - 110rpx);
		.quowarp{
			padding:24rpx;
		}
	}
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 100rpx;
		right: 100rpx;
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
	}
</style>
