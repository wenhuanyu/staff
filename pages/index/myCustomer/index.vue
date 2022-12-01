<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="lxr_top_warp" :style="{height:topHeight+'px',paddingTop:paddingHeight+'px'}">
			<view class="lxr_top_title" :class="{'lxr_top_title_a':topType == 1}" @click="changeTopType(1)">客户</view>
			<view class="lxr_top_title" :class="{'lxr_top_title_a':topType == 2}" @click="changeTopType(2)">联系人</view>
			<image :src="BASE_IMG_URL+'/index/top_static.png'" v-if="topType == 1" @click="toStaticPage" class="lxr_topstatic" mode=""></image>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY || APP-PLUS || H5 -->
		<view class="statusHeight"></view>
		<view class="lxr_top_warp lxr_top_warp_app">
			<view class="lxr_top_title" :class="{'lxr_top_title_a':topType == 1}" @click="changeTopType(1)">客户</view>
			<view class="lxr_top_title" :class="{'lxr_top_title_a':topType == 2}" @click="changeTopType(2)">联系人</view>
			<image :src="BASE_IMG_URL+'/index/top_static.png'" v-if="topType == 1" @click="toStaticPage" class="lxr_topstatic" mode=""></image>
		</view>
		<!-- #endif -->
		
		<view class="" v-if="topType == 1">
			<!-- 搜索 -->
			<view class="searbox">
				<view class="searfir">
					<view class="censear">
						<image :src="BASE_IMG_URL + '/index/search.png'" class="searimg"></image>
						<input type="text" placeholder="请输入关键词搜索" @input="queryData" class="lself" placeholder-style="color:#999">
					</view>
					<view class="fir_right">
						<image :src="BASE_IMG_URL+'/index/cus_add.png'" @click="createCustomer" class="fir_add_img" ></image>
						<image :src="BASE_IMG_URL+'/index/cus_piliang.png'" v-if="type == 1 || type == 11" @click="allOperation" class="fir_pilian_img"></image>
						<image :src="BASE_IMG_URL+'/index/cus_shaixuan.png'" @click="toQuery" class="cus_shaixuan_img" ></image>
					</view>
				</view>
			</view>
			<!-- 列表 -->
			<scroll-view scroll-y class="scrollbox" @scrolltolower="loodMore">
				<view class="tip" v-if="total > 0">找到{{total}}个结果</view>
				<view class="tip" v-else>未查询到结果</view>
				<view class="list_warp">
					<customer-item :list="list"></customer-item>
				</view>
			</scroll-view>
			<!-- 筛选 -->
			<screen-pop 
				ref="screenChild" 
				:suborStaff="suborStaff" 
				@sureQuery="sureQuery" 
				:searchForm="searchForm" 
				@changeSearchData="changeSearchData"
				@resetForm="resetForm"
				:topHeight="topHeight"
			></screen-pop>
			<!-- 批量操作 -->
			<batch-operation ref="batchChild"></batch-operation>
		</view>
		<view class="" v-if="topType == 2">
			<!-- 搜索 -->
			<search-box placeholder="请输入姓名/手机/电话搜索" @queryData="queryLinkData" @showModal="showLinkScreen"></search-box>
			<link-screen-pop 
				:searchForm="linkSearchForm" 
				@changeSearchData="changeLinkSearchData"
				@resetForm="resetLinkForm"
				ref="linkScreenChild" 
				@sureQuery="sureLinkQuery"
				:topHeight="topHeight"
			></link-screen-pop>
		
			<!-- 联系人列表 -->
			<scroll-view scroll-y class="scrollbox" @scrolltolower="loodLinkMore">
				<view class="linkbox">
					<view class="linkli" v-for="(ele,eleindex) in linkList" :key="eleindex" >
						<view class="link_left" @click="toLinkDetail(ele)">
							<view class="link_head">{{ele.name?ele.name.substr(0,1):''}}</view>
							<view class="link_info">
								<view class="linkname">{{ele.name?ele.name:''}}</view>
								<view class="linkmobile">{{ele.mobile?ele.mobile:''}}</view>
							</view>
						</view>
						<image :src="BASE_IMG_URL+'/index/phone-call.png'" @click.stop="toCallLink(ele)" class="mobileimg" mode=""></image>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<tab-bar v-if="tipNumber || tipNumber==0" :tipNumber="tipNumber"></tab-bar>
	</view>
</template>

<script>
	import { netKehuList, netSubordinateStaff, netNewLinkList } from '@/api/api.js'
	import { netMesList } from '@/api/user.js'
	import customerItem from './item.vue'
	import batchOperation from './components/batchOperation.vue'
	import sortPop from './components/sortPop.vue'
	import responPop from './components/responPop.vue'
	import screenPop from './components/screenPop.vue'
	import linkScreenPop from './components/linkScreenPop.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import tabBar from '@/components/tabbar/tabbar'
	
	export default{
		components:{
			customerItem,
			sortPop,
			screenPop,
			tabBar,
			responPop,
			batchOperation,
			linkScreenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				topType:1,   //1客户  2联系人
				list:[],
				page:1,
				totalPage:1,
				total:0,
				show:false,
				sortList:[
					{id:1,name:'名称正序'},
					{id:2,name:'名称倒序'},
					{id:3,name:'创建时间正序'},
					{id:4,name:'创建时间倒序'},
					{id:5,name:'下次跟进时间正序'},
					{id:6,name:'下次跟进时间倒序'}
				],
				sortIndex:null,
				sourceList:[],
				sourceIndex:null,
				followList:[],
				followIndex:null,
				//排序 筛选
				sort:null,
				//搜索条件
				suborStaff:[],
			    Search:false,
				name:'',   //客户名称
				sortid:'',   //排序属性
				queryParams:{},
				isAdd:false,   //新增客户
				//我负责的  筛选
				type:0,
				searchForm:null,  //搜索表单
				linkSearchForm:null,
				tipNumber:null,  //消息提醒,
				defaultObj:{times:'',status:''},
				topHeight:0,   //状态栏 + 小程序右上角按钮
				paddingHeight:0,  //顶部状态栏高度
				btnHeight:0,   //小程序右上角按钮的高度
				//////////////////////////////////////////////////////
				//联系人参数
				linkNama:'',
				linkParams:{},
				linkList:[],
				linkPage:1,
				linkTotalPage:1,
			}
		},
		onLoad(options) {
			if(options.type){
				this.type = options.type == 2 ? 11 : options.type
				this.defaultObj = {
					times: options.times,
					status: options.status?options.status:''
				}
			}
			this.init()
			this.isAdd = false
			uni.removeStorageSync('removeSeas')
			//获取下级员工
			this.getSuborstaff()
			//获取搜索表单
			this.getSearchForm()
			//提示消息
			this.getTipNumber()
			//获取设备信息
			// #ifdef MP-WEIXIN
			this.getSysInfo()
			// #endif
		},
		onShow() {
			if(uni.getStorageSync('removeSeas') || this.isAdd){
				this.init()
			}
		},
		onHide() {
		},
		methods:{
			getSysInfo() {
				uni.getSystemInfo({
					success: (res) => {
						let rect = wx.getMenuButtonBoundingClientRect();
						this.topHeight = rect.bottom + 5
						this.btnHeight = rect.height
						this.paddingHeight = rect.top
					}
				})
			},
			changeTopType(type) {
				this.topType = type
				if(type == 1) {
					this.init()
				}else{
					this.initLink()
					this.getLinkSearchForm()
				}
			},
			//客户统计
			toStaticPage() {
				uni.navigateTo({
					url:'/pages/index/myCustomer/customerStatis'
				})
			},
			getTipNumber() {
				netMesList().then(res=>{
					this.tipNumber = res.data.total
				})
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
			toQuery() {
				this.$refs.screenChild.open(this.defaultObj)
			},
			//筛选
			showRespon() {
				this.$refs.responChild.open()
			},
			//批量操作
			allOperation() {
				this.$refs.batchChild.open()
			},
			//排序
			toSortQuery() {
				this.$refs.sortPopChild.open()
			},
			//查看是否有下级员工 来决定是否有  所属员工的筛选
			getSuborstaff() {
				netSubordinateStaff().then(res=>{
					this.suborStaff = res.data
				})
			},
			loodMore() {
				if(this.page < this.totalPage) {
					this.page ++
					this.getList()
				}
			},
			init() {
				this.list = []
				this.page = 1
				this.totalPage = 1
				//获取客户 列表
				this.getList()
			},
			getList() {
				let params = {
					page:this.page,
					limit: this.limit,
					name:this.name,
					sortid:this.sort,
					type:this.type,
					createtime:this.defaultObj.times,
					contract_status:this.defaultObj.status,
					...this.queryParams,
					...this.handleSureSearch(this.searchForm)
				}
				netKehuList(params).then(res=>{
					res = res.data
					this.list = this.list.concat(res.data)
					this.page = res.current_page
					this.totalPage = res.last_page
					this.total = res.total
				})
			},
			//创建 新客户
			createCustomer() {
				this.isAdd = true
				uni.navigateTo({
					url:'/pagesA/customerInfo/createCustomer'
				})
			},
			//搜索
			queryData(e) {
				this.name = e.detail.value
				this.init()
			},
			//排序 查询
			sortQuery(data) {
				this.sort = data
				this.init()
			},
			sureQuery(params) {
				console.log(params,'搜多')
				this.queryParams = params
				this.type = params.type
				this.defaultObj = {
					times: params.createtime,
					status: params.contract_status
				}
				this.init()
			},
			////////////////////////////////////////////////////////////////////////////////////////////////////////
			//联系人
			queryLinkData(e) {
				console.log(e,'=====')
				this.linkNama = e.value
				this.initLink()
			},
			//联系人搜索
			showLinkScreen() {
				this.$refs.linkScreenChild.open()
			},
			getLinkSearchForm() {
				this.handleSearchForm('contacts',(data)=>{
					this.linkSearchForm = data
				})
			},
			changeLinkSearchData(type,key,value){
				let arr = this.linkSearchForm
				arr.forEach((ele,index)=>{
					if(ele.field == type){
						ele[key] = value
						this.$set(this.linkSearchForm, index, ele)
					}
				})
			},
			resetLinkForm() {
				this.linkSearchForm = this.handleResetSearch(this.linkSearchForm)
			},
			sureLinkQuery(obj) {
				this.linkParams = obj
				this.initLink()
			},
			initLink() {
				this.linkPage = 1
				this.linkList = []
				this.getLinkList()
			},
			getLinkList() {
				let params = {
					name:this.linkNama,
					page:this.linkPage,
					...this.linkParams,
					...this.handleSureSearch(this.linkSearchForm)
				}
				netNewLinkList(params).then(res=>{
					this.linkList = this.linkList.concat(res.data.data)
					this.linkTotalPage = res.data.last_page
				})
			},
			loodLinkMore() {
				if(this.linkPage < this.linkTotalPage){
					this.linkPage ++
					this.getLinkList()
				}
			},
			toCallLink(item) {
				uni.makePhoneCall({
					phoneNumber:item.mobile
				})
			},
			//联系人详情
			toLinkDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contact/contactDetail?id='+item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lxr_top_warp{
		background:$uni-text-color;
		width:100%;
		padding-left:24rpx;
		padding-right:24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.lxr_top_title{
			font-size:28rpx;
			color:#fff;
			margin-right:30rpx;
		}
		.lxr_top_title_a{
			font-size:38rpx;
			transform: all .2s ease;
		}
		.lxr_topstatic{
			width:45rpx;
			height:45rpx;
		}
	}
	.statusHeight{
		width:100%;
		height:var(--status-bar-height);
		background:$uni-text-color;
	}
	.lxr_top_warp_app{
		background:$uni-text-color;
		width:100%;
		height:80rpx;
	}
	.searbox{
		padding:0 24rpx 24rpx;
		background:#008EFF;
		box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
		.searfir{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.censear{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding:0 22rpx;
				border-radius: 30rpx;
				background:#f6f6f6;
				width:480rpx;
				height:60rpx;
				.searimg{
					width:35rpx;
					height:35rpx;
					
					padding:0;
				}
				.lself{
					width:430rpx;
					color: #999;
					font-size:26rpx;
					background:#f6f6f6;
				}
			}
			.fir_right{
				width:195rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.fir_add_img{
					width:43rpx;
					height:43rpx;
				}
				.fir_pilian_img{
					width:42rpx;
					height:42rpx;
				}
				.cus_shaixuan_img{
					width:40rpx;
					height:40rpx;
				}
			}
		}
	}
.scrollbox{
	width:100%;
	height:calc(100vh - 300rpx);
	.tip{
		padding:15rpx 26rpx 0;
		font-size:24rpx;
		color:#008EFF;
		text-align: center;
	}
	.list_warp{
		padding:24rpx;
	}
}
.icon_creat {
	position: fixed;
	z-index: 1;
	bottom: 130rpx;
	right: 100rpx;
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	image {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}
}
//联系人
.linkbox{
	.linkli{
		width:690rpx;
		background:#fff;
		border-radius: 20rpx;
		padding:24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		margin:24rpx auto 0;
		.link_left{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.link_head{
				width:60rpx;
				height:60rpx;
				background:$uni-top-bg-color;
				border-radius: 50%;
				font-size:36rpx;
				color:#fff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.link_info{
				margin-left:24rpx;
				.linkname{
					font-size:30rpx;
					color:#333;
				}
				.linkmobile{
					font-size:26rpx;
					color:#666;
					margin-top:8rpx;
				}
			}
		}
		.mobileimg{
			width:40rpx;
			height:42rpx;
		}
	}
}
</style>
