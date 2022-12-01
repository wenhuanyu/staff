<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入关键词搜索" @input="queryData" class="lself" placeholder-style="color:#999">
			</view>
		</view>
		<view class="tablist">
			<view class="tabli" :class="type == 0 ? 'tabli_active' : ''" @click="changeTab(0)">
				全部备件
				<image :src="BASE_IMG_URL + '/index/green-small-cancel.png'"></image>
				<view class="space"></view>
			</view>
			<view class="tabli" :class="type == 1 ? 'tabli_active' : ''" @click="changeTab(1)">
				低库存备件
				<image :src="BASE_IMG_URL + '/index/green-small-cancel.png'" ></image>
				<view class="space"></view>
			</view>
		</view>
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore">
			<view class="spart_warp">
				<view class="kucun_tip" v-if="type == 1">
					<image :src="BASE_IMG_URL+'/index/kucun_tip.png'" class="kucunimg" ></image>
					库存量低，请及时补货
				</view>
				
				<part-item :list="list" :active="type"></part-item>
				<view class="noData" v-if="list.length == 0">暂无更多</view>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import partItem from './partItem.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import {
		netPartManageList
	} from '@/api/api.js'

	export default {
		components:{
			partItem
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				name: '',
				type: 0, //0全部  1低库存 
				page: 1,
				totalPage: 1,
				list: [],
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					name: this.name,
					type: this.type,
					page: this.page
				}
				netPartManageList(params).then(res => {
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//搜索
			queryData(e) {
				this.name = e.detail.value
				this.init()
			},
			loadMore() {
				if (this.page >= this.totalPage) {
					return
				}
				this.page++
				this.getList()
			},
			changeTab(type) {
				this.type = type
				this.init()
			},

		}
	}
</script>

<style lang="scss" scoped>
	.searbox{
		padding:10rpx 0 20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background:$uni-top-bg-color;
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
				margin-right: 15rpx;
				width:35rpx;
				height:35rpx;
			}
			.lself{
				font-size:26rpx;
				color:#999;
			}
		}
	}
	.tablist{
		width:750rpx;
		height: 100rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		.tabli{
			font-size: 26rpx;
			color: #999;
			text-align: center;
			.space{
				margin-top: 15rpx;
				width: 12rpx;
				height: 6rpx;
				background-color: rgba(0,0,0,0);
			}
			image{
				display: none;
			}
		}
		.tabli_active{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26rpx;
			color:$uni-text-color;
			.space{
				display: none;
			}
			image{
				margin-top: 15rpx;
				display: inline-block;
				width: 12rpx;
				height: 6rpx;
			}
		}
	}
	.scrollbox {
		box-sizing: border-box;
		height: calc(100vh - 180rpx);
		.spart_warp{
			.kucun_tip{
				padding:24rpx 24rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:26rpx;
				color:#F25340;
				.kucunimg{
					width:44rpx;
					height:44rpx;
				}
			}
			
		}
	}

	.spare_bot {
		width: 750rpx;
		background: #fff;
		height: 100rpx;
		background: #fff;
		border-top: 1rpx solid #f5f5f5;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;

		.spare_btn {
			width: 300rpx;
			height: 80rpx;
			font-size: 26rpx;
			text-align: center;
			line-height: 80rpx;
			color: #fff;
			background: #14c2c1;
			border-radius: 20rpx;
		}
	}
</style>
