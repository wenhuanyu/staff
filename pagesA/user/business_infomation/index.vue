<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入关键词搜索" v-model="keyworkd" @input="queryData" class="lself" placeholder-style="color:#999">
			</view>
		</view>
		
		<scroll-view scroll-y class="scrollbox">
			<view class="list_warp" v-if="list.length != 0">
				<view class="list_item" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
					<view class="item_name">{{item.name}}</view>
					<view class="item_text">
						法人：<span>{{item.oper_name}}</span>
					</view>
					<view class="item_text">
						经营状况：<span>{{item.status}}</span>
					</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</scroll-view>
	</view>
</template>

<script>
	import { netQueryBusiness } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				keyworkd:'',
				list:[],
				type:1,   //1自行查询   2新增客户 时查询信息
			}
		},
		onLoad(options) {
			console.log(options)
			if(options.name && options.name != ''){
				this.keyworkd = options.name
			}
			if(options.type){
				this.type = options.type
			}
			this.getList()
		},
		methods:{
			queryData(e) {
				this.keyworkd = e.detail.value
				this.getList()
			},
			getList() {
				let params = {
					keywords: this.keyworkd
				}
				netQueryBusiness(params).then(res=>{
					this.list = res.data
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/detail?name='+item.name+'&type='+this.type
				})
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
				font-size:26rpx;
				color:#999;
				width:500rpx;
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 148rpx);
	}
	.list_warp{
		width:690rpx;
		margin:24rpx auto;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		.list_item{
			padding:24rpx 35rpx;
			border-bottom:1rpx solid #f5f5f5;
			.item_name{
				font-size:30rpx;
				color:#666666;
			}
			.item_text{
				margin-top:15rpx;
				display: flex;
				justify-content: flex-start;
				font-size:28rpx;
				color:#666666;
				span{
					color:#999999;
				}
			}
		}
	}
</style>
