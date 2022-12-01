<template>
	<view>
		<!-- 搜索 -->
		<search-box @queryData="queryData" @showModal="showModal"></search-box>
		
		<view class="tabwarp">
			<!-- 待处理 -->
			<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore">
				<view class="warpbox">
					<list-item :list="list"></list-item>
				</view>
			</scroll-view>
		</view>
		
		<!-- 创建用户图标 -->
		<view class="icon_creat" @click="createWorkOrder">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'"></image>
		</view>
		
		<screen-pop ref="screenChild" :typeName="workorder_type" @changeTypeName="changeTypeName" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import { netWorkOrderList } from '@/api/api.js'
	import listItem from '@/pages/index/afterSales/list.vue'
	import screenPop from './components/screenPop.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		mixins:[commonFun],
		components:{
			listItem,
			screenPop
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				name:'',
				page:1,
				totalPage:1,
				queryObj:{},
				list:[],
				oneList:[],   //待分配
				twoList:[],  //待处理
				thrList:[],   //处理中
				forList:[],   //已完成
				typeList:['全部','我的客户','下属负责的客户'],
				type:null,
				address:'',
				workorder_type:'',   //工单类型
			}
		},
		onLoad(options) {
			if(options.type){
				this.workorder_type = options.type
			}
			this.$store.commit('CUSTOMEROBJ',null)
			this.$store.commit('STAFFOBJ',null)
		},
		onShow() {
			this.init()
		},
		onUnload() {
			this.$store.commit('CUSTOMEROBJ',null)
			this.$store.commit('STAFFOBJ',null)
		},
		methods:{
			changeTypeName(name) {
				this.workorder_type = name
			},
			queryData(e){
				this.name = e.value
				this.init()
			},
			showModal() {
				this.$refs.screenChild.open()
			},
			sureQuery(params) {
				this.queryObj = params
				this.init()
			},
			init() {
				this.page = 1
				this.list = []
				setTimeout(()=>{
					this.getList()
				},200)
			},
			//加载更多
			loadMore() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getList()
			},
			getList() {
				let params = Object.assign({},{
					name:this.name,
					page:this.page,
					workorder_type:this.workorder_type,
				},this.queryObj)
				netWorkOrderList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			createWorkOrder() {
				uni.navigateTo({
					url:'/pages/index/orderSettlement/addWorkOrder'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.search_warp{
	width:100%;
	padding:0 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background:#fff;
	.search_left{
		flex:1;
	}
	.search_right{
		flex-shrink: 0;
		width:40rpx;
		height:40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.shaixuanimg{
			width:40rpx;
			height:40rpx;
		}
	}
}
.scrollbox{
	width:100%;
	height:calc(100vh - 100rpx);
	.warpbox{
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
