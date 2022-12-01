<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" v-model="value" placeholder="请输入关键词搜索" @confirm="onSearch" class="lself" placeholder-style="color:#999">
			</view>
		</view>
		
		<view class="searchbox">
			<!-- 按指定类型搜索 -->
			<view class="search_text">
				按指定类型搜索
			</view>
			<!-- 搜索类型 -->
			<view class="search_type">
				<view class="search_item" @click="searchType(1)">
					<image :src="BASE_IMG_URL+'/index/lxr_gonghai.png'" ></image>
					<view class="item_content">公海客户</view>
				</view>
				<view class="search_item" @click="searchType(2)">
					<image :src="BASE_IMG_URL+'/index/icon2_a.png'" ></image>
					<view class="item_content">我的客户</view>
				</view>
				<view class="search_item" @click="searchType(3)">
					<image :src="BASE_IMG_URL+'/index/lxr_gongdan.png'"></image>
					<view class="item_content">工单</view>
				</view>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="search_history">
			<view class="history_head">
				<view>搜索历史</view>
				<view class="clear_title" @click="clearHistory">
					<view class="iconfont icon-clear"></view>
					<view>清除</view>
				</view>
			</view> 
			<view class="history_body" v-for="(item,index) in searchHistory" :key="index" @click="historySearch(item)">
				<view class="body_first">{{index+1}}</view>
				<view class="body_second">{{item}}</view>
				<view class="iconfont icon-search"></view>
			</view>
			<view class="noData" v-if="searchHistory.length == 0">暂无更多</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				value: '',
				searchHistory:[],   //这里模拟搜索历史
			}
		},
		onShow() {
			if(uni.getStorageSync('searchword')){
				this.searchHistory = uni.getStorageSync('searchword')
			}
		},
		methods: {
			changeValue(e) {
				this.value = e.detail.value
			},
			onSearch(val) {
				this.value = val.detail.value
				let searlist = uni.getStorageSync('searchword')
				if(searlist){
					if(searlist.indexOf(this.value) != -1) {
						let index = searlist.indexOf(this.value)
						searlist.splice(index,1)
					}
					if(searlist.length >= 10) {
						searlist.shift()
						searlist.push(this.value)
					}else{
						searlist.push(this.value)
					}
				}else{
					searlist = []
					searlist.push(this.value)
				}
				uni.setStorageSync('searchword',searlist)
				uni.navigateTo({
					url:'/pages/search/searchList?type=0&word='+this.value
				})
			},
			//清除
			clearHistory() {
				this.searchHistory = []
				uni.removeStorageSync('searchword')
			},
			onCancel(){
				uni.navigateBack({
					delta:1
				})
			},
			searchType(type) {
				uni.navigateTo({
					url:'/pages/search/searchList?type='+type+'&word='+this.value
				})
			},
			historySearch(value){
				this.value = value;
				uni.navigateTo({
					url:'/pages/search/searchList?type=0&word='+this.value
				})
			}
		}
	}
</script>

<style lang="scss">
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
	
	.searchbox{
		background:#fff;
	}
	.search_text {
		width: 100%;
		padding: 30rpx 0;
		text-align: center;
	}
	.search_type {
		display: flex;
		margin-bottom: 60rpx;
		justify-content: space-between;
		align-items: center;
		padding:30rpx 50rpx;
		.search_item {
			text-align: center;
			image {
				width: 60rpx;
				height: 60rpx;
				// border-radius: 50%;
				margin-bottom: 10rpx;
			}
		}
	}

	.search_history {
		.history_head {
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			margin-bottom: 20rpx;

			.clear_title {
				display: flex;
				.icon-clear {
					padding-right: 8rpx;
				}
				:last-child {
					color: $uni-text-color;
				}
			}
		}
	}

	.history_body {
		display: flex;
		margin: 0 24rpx;
		background-color: #fff;
		padding: 20rpx 0;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		.body_first {
			width: 25rpx;
			margin-left: 20rpx;
		}

		.body_second {
			flex: 1;
		}

		.icon-search {
			margin-right: 20rpx;
		}
	}
</style>
