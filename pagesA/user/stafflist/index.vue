<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入关键词搜索" @input="queryData" class="lself" placeholder-style="color:#008EFF">
			</view>
		</view>
		<scroll-view scroll-y class="scrollbox">
			<view class="list_warp">
				<view class="list_li" v-for="(item,index) in list" :key="index" @click="treeItemClick(item)">
					<image :src="item.img" class="staffimg" mode=""></image>
					<view class="staffname">{{item.name}}({{item.post?item.post:''}})</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</scroll-view>
	</view>
</template>
<script>
	import { netTeamSubordinate } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				active:[],
				list:[],
				name:''
			}
		},
		onLoad() {
			this.getList()
		},
		methods:{
			treeItemClick(item) {
				uni.navigateTo({
					url:'/pagesA/user/stafflist/staffDetail?staffid='+item.id+'&staffname='+item.name
				})
			},
			getList() {
				netTeamSubordinate({name:this.name}).then(res=>{
					this.list = res.data
				})
			},
			queryData(e) {
				this.name = e.detail.value
				this.list = []
				setTimeout(()=>{
					this.getList()
				},1000)
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
				width:450rpx;
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 100rpx);
		padding:24rpx 0;
		box-sizing: border-box;
		.list_warp{
			.list_li{
				width:690rpx;
				margin:0 auto 24rpx;
				padding:24rpx;
				background:#fff;
				border-radius: 24rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				.staffimg{
					width:60rpx;
					height:60rpx;
					border-radius: 50%;
				}
				.staffname{
					font-size:26rpx;
					color:#333;
					margin-left:24rpx;
				}
			}
		}
	}
</style>