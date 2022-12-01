<template>
	<view>
		<!-- 搜索 -->
		<search-box @queryData="queryData" @showModal="showSc"></search-box>
		<!-- 一级tab -->
		<view class="tablist_new">
			<view class="tabtn" @click="changeTabtype(0)" :class="{'tabtn_active':tabtype == 0}">个人任务</view>
			<view class="tabtn" @click="changeTabtype(4)" :class="{'tabtn_active':tabtype == 4}">协助任务</view>
		</view>
		<!-- 列表 -->
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore">
			<view class="visitwarp">
				<visit-item :list="visitList" :type="types"></visit-item>
			</view>
		</scroll-view>
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
		<!-- 创建用户图标 -->
		<view class="icon_creat" @click="createVisit">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'"></image>
		</view>
	</view>	
</template>

<script>
	import visitItem from '@/pages/index/visit/index.vue'
	import { netScheduleList } from '@/api/api.js'
	import screenPop from './screenPop.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			visitItem,
			screenPop
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				show:false,
				tabtype:0,
				name:'',
				page:1,
				totalPage:1,
				visitList:[],
				types:'list',
				queryObj:{},
				isAdd:false,   //是否去添加任务任务
				defaultObj:{type:'',times:''}
			}
		},
		onLoad(options){
			if(options.type){
				this.defaultObj = {
					type:options.type,
					times:options.times
				}
			}
			this.init()
		},
		onShow() {
			if(this.isAdd){
				this.init()
			}
		},
		methods:{
			changeTabtype(type) {
				this.tabtype = type
				this.init()
			},
			changeTab(e) {
				this.init()
			},
			loadMore() {
				if(this.page < this.totalPage){
					this.page ++
					this.getList()
				}
			},
			//新建拜访计划
			createVisit() {
				this.isAdd = true
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/createVisit'
				})
			},
			init() {
				this.page = 1
				this.visitList = []
				setTimeout(()=>{
					this.getList()
				},200)
			},
			queryData(e) {
				this.name = e.value
				this.init()
			},
			showSc() {
				this.$refs.screenChild.open(this.defaultObj)
			},
			sureQuery(params) {
				this.queryObj = params
				this.defaultObj = {
					type: params.type,
					times: params.tiems
				}
				this.init()
			},
			getList() {
				let params = {
					page:this.page,
					name:this.name,
					type_tab:this.tabtype,
					type:this.defaultObj.type,
					times:this.defaultObj.times,
					...this.queryObj
				}
				netScheduleList(params).then(res=>{
					this.visitList = this.visitList.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.scrollbox{
		width:100%;
		height:calc(100vh - 200rpx);
		.visitwarp{
			width:690rpx;
			margin:0 auto;
			padding:24rpx 0;
		}
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
