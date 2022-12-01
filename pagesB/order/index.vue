<template>
	<view>
		<!-- 搜索 -->
		<search-box @queryData="queryInputData" @showModal="showSc"></search-box>
		
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore">
			<view class="orderwarp">
				<item :list="list" ></item>
			</view>
		</scroll-view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { netOrderList } from '@/api/api.js'
	import item from './item.vue'
	import screenPop from './screen_pop.vue'
	
	export default{
		components:{
			item,
			screenPop
		},
		data() {
			return{
				name:'',
				page:1,
				totalPage:1,
				list:[],
				queryObj:{}
			}
		},
		onLoad() {
			this.init()
		},
		onShow() {
			
		},
		methods:{
			sureQuery(params) {
				this.queryObj = params
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
					number:this.name,
					...this.queryObj
				}
				netOrderList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.list = this.list.concat(res.data.data)
				})
			},
			showSc() {
				this.$refs.screenChild.open()
			},
			queryInputData(e) {
				this.name = e.value
				this.init()
			},
			loadMore() {
				if(this.page < this.totalPage){
					this.page ++
					this.getList()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scrollbox{
		width:100%;
		height:calc(100vh - 100rpx);
		.orderwarp{
			width:690rpx;
			margin:0 auto;
			padding:24rpx 0;
		}
	}
</style>
