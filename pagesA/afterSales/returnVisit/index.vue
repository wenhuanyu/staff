<template>
	<view>
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入工单编号搜索" v-model="name" @input="queryData" class="lself" placeholder-style="color:#999;font-size:24rpx">
			</view>
		</view>
		
		<view class="tabwarp">
			<view class="tablist_new">
				<view class="tabtn" @click="changeTab(0)" :class="{'tabtn_active':is_visit == 0}">未回访</view>
				<view class="tabtn" @click="changeTab(1)" :class="{'tabtn_active':is_visit == 1}">已回访</view>
			</view>
			<!-- 未回访 -->
			<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore" v-if="is_visit == 0">
				<view class="warpbox">
					<list-item :list="list" :type="2"></list-item>
				</view>
			</scroll-view>
			<!-- 已回访 -->
			<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore" v-if="is_visit == 1">
				<view class="warpbox">
					<list-item :list="list" :type="2"></list-item>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import listItem from '@/pages/index/afterSales/list.vue'
	import { netReturnVisitList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			listItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
				is_visit:'0',   //0未回访 1 已回访
				name:''
			}
		},
		onLoad() {
			this.init()
		},
		onShow() {
			
		},
		methods:{
			changeTab(e) {
				this.is_visit = e
				this.init()
			},
			queryData(e) {
				this.init()
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					name:this.name,
					is_visit:this.is_visit,
					page:this.page
				}
				netReturnVisitList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
					console.log(this.list,'数据')
				})
				
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
				.lself{
					font-size:26rpx;
					color:rgba(2, 135, 255, 1);
				}
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 200rpx);
		.warpbox{
			padding:24rpx;
		}
	}
</style>
