<template>
	<view class="">
		<view class="tab_list" style="margin-top:0;">
			<view class="tabli" :class="type == 0 ? 'tabliactive' : ''" @click="changeFirTab(0)">全部</view>
			<view class="tabli" :class="type == 1 ? 'tabliactive' : ''" @click="changeFirTab(1)">我负责的</view>
			<view class="tabli" :class="type == 2 ? 'tabliactive' : ''" @click="changeFirTab(2)">下属负责的</view>
		</view>
		
		<!-- 筛选 -->
		<view class="searchbox">
			<view class="searchtext" @click="toQuery">筛选<view class="iconfont icon-shaixuan"></view></view>
		</view>
		
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loodMore">
			<view class="payList">
				<pay-item :list="list"></pay-item>
			</view>
		</scroll-view>
		
		<view class="icon_creat" @click="toAddplan">
			<image :src="BASE_IMG_URL+'/1.png'" mode="scaleToFill"></image>
		</view>
		
		<screen-pop ref="screenChild" @sureParams="surePa"></screen-pop>
	</view>
</template>

<script>
	import { netPlanListf } from '@/api/api.js'
	import payItem from './item.vue'
	import screenPop from './screen.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			screenPop,
			payItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				type:0,
				page:1,
				totalPage:1,
				queryParams:{},
				list:[]
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.ini()
		},
		methods:{
			changeFirTab(type) {
				this.type = type
				this.ini()
			},
			toQuery() {
				this.$refs.screenChild.open()
			},
			surePa(params) {
				this.queryParams = params
				this.ini()
			},
			ini() {
				this.page = 1
				this.list = []
				setTimeout(()=>{
					this.getList()
				},200)
			},
			loodMore() {
				if(this.page < this.totalPage){
					this.page++
					this.getList()
				}
			},
			getList() {
				let params = {
					type:this.type,
					page:this.page,
					...this.queryParams
				}
				netPlanListf(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//添加回 款计划
			toAddplan() {
				uni.navigateTo({
					url:'/pagesB/payplan/addPaymentPlan'
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
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
	.tab_list{
		width:750rpx;
		height:80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background:#fff;
		margin-top:15rpx;
		.tabli{
			font-size:24rpx;
			color:#333;
			line-height: 75rpx;
			text-align: center;
			border-bottom:4rpx solid #fff;
		}
		.tabliactive{
			border-bottom:4rpx solid $uni-text-color;
		}
	}
	.searchbox{
		display: flex;
		justify-content: flex-end;
		margin:24rpx;
		.searchtext{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:$uni-text-color;
			padding:8rpx 28rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			.icon-shaixuan{
				color:$uni-text-color;
			}
		}
	}
	.scrollbox{
		width:750rpx;
		height:calc(100vh - 180rpx);
	}
</style>