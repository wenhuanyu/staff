<template>
	<view class="the_reminder">
		<view class="reminder_item" v-for="(item,index) in list" :key="index" @click="jumpDetail(item)">
			<view class="item_con">
				<view class="item_left">
					<view>{{item.content}}</view>
				</view>
				<view class="circle_dot" v-if="item.status == 0"></view>
			</view>
			<view class="item_time">
				<image :src="item.workreport.staff.img" class="staffimg" ></image>
				{{item.workreport.staff.name}}
			</view>
			<view class="item_time">
				<image :src="BASE_IMG_URL+'/index/clock.png'" class="comimg" ></image>
				<view class="lxs_time">{{item.send_time}}</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { netWorkReportList } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.page = 1
			this.list = []
			this.getList()
		},
		onReachBottom() {
			if(this.page >= this.totalPage) {
				return
			}
			this.page++
			this.getList()
		},
		methods:{
			getList() {
				netWorkReportList({page:this.page}).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			jumpDetail(item) {
				uni.navigateTo({
					url:'/pagesC/journal/journal_detail?id='+item.relation_id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.the_reminder {
		padding: 0 0 100rpx;
		.reminder_item {
			background-color: #fff;
			border-radius: 10rpx;
			width:690rpx;
			padding:24rpx 35rpx;
			margin:24rpx auto 0;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			.item_con {
				display: flex;
				padding: 20rpx 0;
				justify-content: space-between;
				.item_left{
					display: flex;
					justify-content: flex-start;
				}
				.icon-task {
					padding-right: 20rpx;
				}
	
				.circle_dot {
					width: 12rpx;
					height: 12rpx;
					background-color: #fb6260;
					margin: 11rpx 0 0 80rpx;
					border-radius: 10rpx;
				}
	
			}
	
			.item_time {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-bottom: 20rpx;
				color: #999;
				:last-child {
					margin-top: 5rpx;
				}
				.staffimg{
					width:40rpx;
					height:40rpx;
					border-radius: 50%;
					margin-right:24rpx;
				}
				.comimg{
					width:30rpx;
					height:30rpx;
					margin-right:15rpx;
				}
			}
		}
	}
	.lxs_time{
		padding-left: 5px;
		padding-top: 1px;
	}
</style>
