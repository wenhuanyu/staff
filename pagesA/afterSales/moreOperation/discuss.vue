<template>
	<view>
		<view class="discuss_list">
			<view class="dis_li" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
				<view class="distitle">讨论主题：{{item.title}}</view>
				<view class="distitle">发起人：{{item.staff.name}}</view>
				<view class="distitle">发起时间：{{item.createtime}}</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
		
		<!-- 创建 -->
		<view class="icon_creat" @click="toDiscuss">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'"></image>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netDiscussList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
				id:'',
				type:''
			}
		},
		onLoad(options) {
			this.id = options.id
			this.type = options.type
		},
		onShow() {
			this.init()
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++
				this.getList()
			}
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
					relation_type:this.type,
					relation_id:this.id
				}
				netDiscussList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//详情
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/discussDetail?id='+item.id
				})
			},
			//发起讨论
			toDiscuss() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/createDiscuss?id='+this.id+'&type='+this.type
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 100rpx;
		right: 100rpx;
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
	}
	.discuss_list{
		margin-top:24rpx;
		.dis_li{
			width:690rpx;
			padding:30rpx;
			margin:0 auto 24rpx;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
			border-radius: 10rpx;
			.distitle{
				font-size:24rpx;
				margin-bottom:15rpx;
				color:#666;
				&:last-child{
					margin-bottom:0;
				}
			}
		}
	}
</style>
