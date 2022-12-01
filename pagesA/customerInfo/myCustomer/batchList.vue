<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="searfir">
				<view class="censear">
					<image :src="BASE_IMG_URL + '/index/search.png'" class="searimg"></image>
					<input type="text" placeholder="请输入关键词搜索" @input="queryData" class="lself" placeholder-style="color:#999">
				</view>
				<view class="fir_right">
					<view class="firbtn" @click="selectAll">全选</view>
					<view class="firbtn" @click="selectRemove">取消</view>
				</view>
			</view>
			<view class="seartwo">
				<view class="sele_box" @click="showRespon" style="width:240rpx" v-if="role_type != 0">
					{{responObj.name}}
					<image :src="BASE_IMG_URL+'/index/cus_xia.png'" class="cus_xia_img" ></image>
				</view>
				<view class="sele_box" @click="toSortQuery" style="width:160rpx">
					排序
					<image :src="BASE_IMG_URL+'/index/cus_paixu.png'" class="cus_paixu_img" ></image>
				</view>
				<view class="sele_box" @click="toQuery" style="width:160rpx">
					筛选
					<image :src="BASE_IMG_URL+'/index/cus_shaixuan.png'" class="cus_shaixuan_img" ></image>
				</view>
			</view>
		</view>
		
		<!-- 列表 -->
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loodMore">
			<view class="list_warp">
				<batch-customer-item :list="list" @selectCustomer="selectCustomer"></batch-customer-item>
			</view>
		</scroll-view>
		
		<!-- 底部确定按钮 -->
		<view class="botwarp">
			<view class="botleft">已选择：<span>{{selectArr.length}}</span></view>
			<view class="botbtn" @click="sureSubmit">确定</view>
		</view>
		
		<!-- 我负责的进行筛选 -->
		<respon-pop :sortList="responList" @responQuery="responQuery" ref="responChild"></respon-pop>
		<!-- 排序筛选 -->
		<sort-pop ref="sortPopChild" @sortQuery="sortQuery"></sort-pop>
		<!-- 筛选 -->
		<screen-pop 
			ref="screenChild"
			:suborStaff="suborStaff" 
			@sureQuery="sureQuery" 
			:popType="2"
			:role_type="role_type"
			:searchForm="searchForm"
			@changeSearchData="changeSearchData"
			@resetForm="resetForm"
		></screen-pop>
	</view>
</template>

<script>
	import { netKehuList, netSubordinateStaff, netRemoveSeasAll } from '@/api/api.js'
	import batchCustomerItem from './batchItem.vue'
	import sortPop from '@/pages/index/myCustomer/components/sortPop.vue'
	import responPop from '@/pages/index/myCustomer/components/responPop.vue'
	import screenPop from '@/pages/index/myCustomer/components/screenPop.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import tabBar from '@/components/tabbar/tabbar'
	
	export default{
		components:{
			batchCustomerItem,
			sortPop,
			screenPop,
			tabBar,
			responPop,
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
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
				responList:[
					{id:1,name:'我负责的'},
					{id:11,name:'我下属负责的'},
				],
				responObj:{id:1,name:'我负责的'},
				type:0,  //0 转移  1更换负责人  2作废  3添加团队成员  4移除团队成员
				selectArr:[],  //选择了的客户
				role_type:0,  //角色
				searchForm:[],  //搜索表单
			}
		},
		onLoad(options) {
			this.type = options.type
			if(this.type == 0) {
				uni.setNavigationBarTitle({
					title:'批量转移'
				})
			}else if(this.type == 1) {
				uni.setNavigationBarTitle({
					title:'批量更换负责人'
				})
			}else if(this.type == 2) {
				uni.setNavigationBarTitle({
					title:'批量作废'
				})
			}else if(this.type == 3) {
				uni.setNavigationBarTitle({
					title:'批量添加团队成员'
				})
			}else if(this.type == 4) {
				uni.setNavigationBarTitle({
					title:'批量移除团队成员'
				})
			}
			this.role_type = uni.getStorageSync('roleType')
			this.init()
			this.isAdd = false
			uni.removeStorageSync('removeSeas')
			//获取下级员工
			this.getSuborstaff()
			//获取搜索表单
			this.getSearchForm()
		},
		onShow() {
			if(uni.getStorageSync('removeSeas') || this.isAdd){
				this.init()
			}
		},
		methods:{
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
			//筛选
			showRespon() {
				this.$refs.responChild.open()
			},
			toQuery() {
				this.$refs.screenChild.open()
			},
			//批量操作
			//关闭 
			closeBotPop() {
				this.showBotPop = false
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
					type:this.role_type == 0 ? 1 : this.responObj.id,
					...this.queryParams,
					...this.handleSureSearch(this.searchForm)
				}
				netKehuList(params).then(res=>{
					res = res.data
					this.list = this.list.concat(this.handleData(res.data))
					this.page = res.current_page
					this.totalPage = res.last_page
					this.total = res.total
				})
			},
			handleData(data) {
				let arr = []
				data.forEach(ele=>{
					arr.push({
						id:ele.id,
						name:ele.name,
						owner_staff:ele.owner_staff,
						select:false
					})
				})
				return arr
			},
			//搜索
			queryData(e) {
				this.name = e.detail.value
				this.init()
			},
			//排序
			toSortQuery() {
				this.$refs.sortPopChild.open()
			},
			//排序 查询
			sortQuery(data) {
				this.sort = data
				this.init()
			},
			sureQuery(params) {
				this.queryParams = params
				this.init()
			},
			responQuery(item) {
				this.responObj = item
				this.init()
			},
			//选择 客户
			selectCustomer(index) {
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
				//处理  选择客户的数量
				this.handleSelectNum()
			},
			//全选
			selectAll() {
				this.list.forEach(ele=>{
					ele.select = true
				})
				this.selectArr = this.list
			},
			//取消
			selectRemove() {
				this.list.forEach(ele=>{
					ele.select = false
				})
				this.selectArr = []
			},
			//处理  选择客户的数量
			handleSelectNum() {
				let arr = []
				this.list.forEach(ele=>{
					if(ele.select) {
						arr.push(ele)
					}
				})
				this.selectArr = arr
			},
			//确定
			sureSubmit() {
				let arr = []
				this.selectArr.forEach(ele=>{
					arr.push(ele.id)
				})
				if(arr.length == 0) {
					uni.showToast({
						title:'请选择客户',
						icon:'none'
					})
					return
				}
				if(this.type == 0) {
					//批量转移
					this.allTrans(arr)
				}else if(this.type == 1) {
					//批量更换负责人
					uni.navigateTo({
						url:'/pagesA/customerInfo/allOperation/transferAll?ids='+arr.join(',')
					})
				}else if(this.type == 2) {
					//批量作废
					
				}else if(this.type == 3) {
					//批量添加团队成员
					uni.navigateTo({
						url:'/pagesA/afterSales/moreOperation/circulate/add?id='+arr.join(',')+'&type=customerAll'
					})
				}else if(this.type == 4) {
					// 批量移除团队成员
					uni.navigateTo({
						url:'/pages/selectMember/selectMember?delFlag=2&ids='+arr.join(',')
					})
				}
			},
			//批量转移
			allTrans(arr) {
				uni.showModal({
					title:'提示',
					content:'请确认是否移入公海?',
					success:(res)=>{
						if(res.confirm){
							netRemoveSeasAll({ids:arr.join(',')}).then(data=>{
								uni.showToast({
									title:data.msg,
									icon:'none'
								})
								uni.setStorageSync('removeSeas',true)
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},2000)
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searbox{
		padding:0 24rpx 24rpx;
		background:$uni-text-color;
		box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
		.searfir{
			display: flex;
			justify-content: space-around;
			align-items: center;
			.censear{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding:0 22rpx;
				border-radius: 30rpx;
				background:#f6f6f6;
				width:500rpx;
				height:60rpx;
				.searimg{
					width:35rpx;
					height:35rpx;
				}
				.lself{
					width:450rpx;
					color: #999;
					font-size:26rpx;
				}
			}
			.fir_right{
				width:145rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.firbtn{
					font-size:26rpx;
					color:#fff;
				}
			}
		}
		.seartwo{
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top:24rpx;
			.sele_box{
				width:200rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:26rpx;
				color:#fff;
				.cus_xia_img{
					width:20rpx;
					height:11rpx;
					margin-left:10rpx;
				}
				.cus_paixu_img{
					width:21rpx;
					height:21rpx;
					margin-left:10rpx;
				}
				.cus_shaixuan_img{
					width:21rpx;
					height:21rpx;
					margin-left:10rpx;
				}
			}
		}
	}
.scrollbox{
	width:100%;
	height:calc(100vh - 242rpx);
	.tip{
		padding:15rpx 26rpx 0;
		font-size:24rpx;
		color:$uni-text-color;
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
.botwarp{
	width:750rpx;
	height:100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding:0 35rpx;
	border-top:1rpx solid #f5f5f5;
	.botleft{
		font-size:26rpx;
		color:#333;
		span{
			margin-left:15rpx;
		}
	}
	.botbtn{
		width:120rpx;
		height:60rpx;
		border-radius: 10rpx;
		background:$uni-btn-bg-color;
		font-size:24rpx;
		color:#fff;
		text-align: center;
		line-height: 60rpx;
	}
}
</style>
