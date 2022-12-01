<template>
	<view>
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore">
			<view class="pro_top">
				<view class="top_name"></view>
				<view class="top_beizhu" @click="toShaixuan">
					<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="beizhuimg" ></image>
					筛选
				</view>
			</view>
			<view class="jour_warp">
				<jour-item :list="list"></jour-item>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	import jourItem from './workItem.vue'
	import { netStaffWorkreport } from '@/api/user.js'
	import { netJournalList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			jourItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				showScreen:false,
				staffid:'',
				list:[],
				pages:1,
				totalPage:1,
				queryObj:{}
			}
		},
		methods:{
			init(id) {
				this.staffid = id
				this.initList()
			},
			loadMore(){
				if(this.page < this.totalPage){
					this.page ++
					this.getList()
				}
			},
			getList() {
				let params = {
					page:this.page,
					staff_id:this.staffid,
					...this.queryObj
				}
				netJournalList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			initList() {
				this.list = []
				this.page = 1
				this.getList()
			},
			toShaixuan() {
				this.$emit('shaixuan')
			},
			sureQuery(params) {
				this.queryObj = params
				this.initList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pro_top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#fff;
		padding:0 24rpx 24rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		.top_name{
			font-size:26rpx;
			color:#333;
		}
		.top_beizhu{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:24rpx;
			color:#666;
			.beizhuimg{
				width:35rpx;
				height:27rpx;
				margin-right:10rpx;
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 100rpx);
	}
</style>
