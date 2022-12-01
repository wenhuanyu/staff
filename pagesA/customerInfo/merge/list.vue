<template>
	<view>
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL + '/index/search.png'" class="searimg"></image>
				<input type="text" placeholder="请输入关键词搜索" @input="queryData" class="lself" placeholder-style="color:#999">
			</view>
		</view>
		<view class="aread">
			<view class="arli">已选客户：{{oriName}}</view>
			<view class="arli">已选客户：{{mergeName}}</view>
		</view>
		
		<scroll-view scroll-y class="scrollbox" style="height:calc(100vh - 350rpx);" @scrolltolower="loadMore">
			<view class="listbox">
				<view class="cusli" v-for="(item,index) in list" :key="index" @click="toSelect(item)">
					<radio color="#008EFF" value="1" :checked="mergeid == item.id"></radio>
					<view class="cusname">{{item.name}}</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="botwarp">
			<view class="bot_btn" @click="toMerge">进行合并</view>
		</view>
		
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netKehuList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				oriName:'',
				mergeid:'',
				mergeName:'',
				page:1,
				totalPage:1,
				name:'',
				list:[],
			}
		},
		onLoad(options) {
			this.id = options.id
			this.oriName = options.name
			this.getList()
		},
		methods:{
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					page:this.page,
					name:this.name
				}
				netKehuList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			loadMore() {
				if(this.page < this.totalPage){
					this.page ++
					this.getList()
				}
			},
			toSelect(item) {
				this.mergeid = item.id
				this.mergeName = item.name
			},
			queryData(e) {
				this.name = e.detail.value
				this.init()
			},
			toMerge() {
				if(!this.mergeid){
					uni.showToast({
						title:'请选择需要合并的客户',
						icon:'none'
					})
					return
				}
				if(this.id == this.mergeid){
					uni.showToast({
						title:'合并的客户不能为同一个客户',
						icon:'none'
					})
					return
				}
				uni.navigateTo({
					url:'/pagesA/customerInfo/merge/mergeDetail?ids='+this.id+','+this.mergeid
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searbox{
		padding:10rpx 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background:$uni-btn-bg-color;
		box-sizing: border-box;
		.censear{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 22rpx;
			border-radius: 30rpx;
			background:#fff;
			width:660rpx;
			height:60rpx;
			.searimg{
				width:35rpx;
				height:35rpx;
			}
			.lself{
				padding: 13rpx 0 13rpx 19rpx;
				width:450rpx;
				color: #999;
				font-size:26rpx;
			}
		}
	}
	.aread{
		padding:24rpx 30rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		.arli{
			font-size:26rpx;
			color:#666666;
			margin-bottom:24rpx;
			&:last-child{
				margin-bottom:0;
			}
		}
	}
	.scrollbox{
		width:100%;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		padding:20rpx 30rpx;
		box-sizing: border-box;
			.cusli{
				padding:24rpx 0;
				border-bottom:1rpx solid #f5f5f5;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				radio{
					transform: scale(0.7);
					margin-right:15rpx;
				}
				.cusname{
					font-size:28rpx;
					color:#999999;
				}
			}
	}
	.botwarp{
		width:750rpx;
		height:100rpx;
		background:#fff;
		position: fixed;
		left:0;
		bottom:0;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
		.bot_btn{
			width:690rpx;
			height:80rpx;
			background:$uni-btn-bg-color;
			font-size:30rpx;
			text-align: center;
			line-height: 80rpx;
			border-radius: 40rpx;
			color:#fff;
		}
	}
</style>
