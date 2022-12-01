<template>
	<view>
		<view class="jourbox">
			<view class="jour_top" @click="toScreenQuery">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="shaixuanimg"></image>
			</view>
		</view>
		<view class="jour_warp">
			<jour-item :list="list"></jour-item>
		</view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import jourItem from './item.vue'
	import screenPop from './screenPop.vue'
	import { netJournalList } from '@/api/api.js'
	
	export default{
		components:{
			jourItem,
			screenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				queryObj:{},
				page:1,
				totalPage:1,
				list:[]
			}
		},
		onLoad() {
			this.init()
			this.$store.commit('STAFFOBJ',null)
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods:{
			toScreenQuery() {
				this.$refs.screenChild.open()
			},
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
					page: this.page,
					...this.queryObj
				}
				netJournalList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.jourbox{
		padding:24rpx 24rpx 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.jour_top{
			width:100rpx;
			height:50rpx;
			background:#fff;
			border-radius: 8rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			display: flex;
			justify-content: center;
			align-items: center;
			.shaixuanimg{
				width:35rpx;
				height:27rpx;
			}
		}
	}
</style>
