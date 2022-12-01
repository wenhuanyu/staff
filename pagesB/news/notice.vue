<template>
	<view class="the_reminder">
		<view class="reminder_item" v-for="(item,index) in list" :key="index" @click="toDetail(item.id)">
			
			<view class="name" style="display: -webkit-box;
					width: 300rpx;
					overflow: hidden;
					text-overflow: ellipsis; 
					word-wrap: break-word;
					white-space: normal !important;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;">{{item.title}}</view>
			<view>
				<view class="time" style="float: left;margin-right: 10rpx;">{{item.createtime}}</view>
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { netNoticeList } from '@/api/api.js'
	
	export default {
		data() {
			return {
				page:1,
				limit:10,
				totalPage:1,
				list:[]
			}
		},
		onShow() {
			this.page = 1
			this.list = []
			this.getList()
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods: {
			getList() {
				let params = {
					page: this.page,
					limit: this.limit
				}
				netNoticeList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			toDetail(id) {
				uni.navigateTo({
					url:'/pagesB/news/noticeDetail?id='+id
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
	.color{
		background: #fff;
	}
	.colore{
		background: #f00;
	}
	.the_reminder {
		padding: 0 20rpx 100rpx;
		.reminder_item {
			background-color: #fff;
			border-radius: 10rpx;
			padding:30rpx;
			margin-top:24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.name{
				font-size:26rpx;
				color:#333333;
			}
			.time{
				font-size:24rpx;
				color:#999999;
			}
		}
	}
	.lxs_time{
		padding-left: 5px;
		padding-top: 1px;
	}
	.message_num {
		width: 10rpx;
		height: 10rpx;
		// line-height: 10rpx;
		border-radius: 20rpx;
		// background-color: #f95e5a;
		color: #fff;
		float: right;
	}
</style>
