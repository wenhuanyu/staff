<template>
	<view>
		<view class="tab_list">
			<view class="tabli" :class="type == 0 ? 'tabliactive' : ''" @click="changeFirTab(0)">全部</view>
			<view class="tabli" :class="type == 1 ? 'tabliactive' : ''" @click="changeFirTab(1)">我创建的</view>
			<view class="tabli" :class="type == 2 ? 'tabliactive' : ''" @click="changeFirTab(2)">下属创建的</view>
		</view>
		
		<view class="signli" v-for="item in list" :key="item.id" @click="toSigndetail(item)">
			<view class="signtop">
				<image :src=" item.staff.img ? item.staff.img : BASE_IMG_URL+'/headImg.png'" class="headimg"  mode="scaleToFill"></image>
				<view class="info">
					<view class="infotop">
						<view class="name">{{item.staff.name}}</view>
						<view class="time">{{item.createtime}}</view>
					</view>
					<view class="address">{{item.location?item.location:''}}</view>
				</view>
			</view>
			<view class="kehu" @click.stop.prevent>
				<view>拜访客户：</view>
				<view class="kehuinfo" @click.stop="toMore(item.customer.id)">
					{{item.customer.name}}
				</view>
			</view>
		</view>
		<view style="height: 50rpx;"></view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
		<!-- 新增 -->
		<view class="icon_creat" @click="addChuchai">
			<image :src="BASE_IMG_URL+'/1.png'" mode="scaleToFill"></image>
		</view>
	</view>
</template>

<script>
	import { netGetSignList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	export default{
		data() {
			return {
				list:[],
				page:1,
				totalPage:1,
				BASE_IMG_URL:BASE_IMG_URL,
				type:0,   //0全部 1我创建的  2下属创建的
				customer_id:''
			}
		},
		onLoad(options) {
			if(options.customerid){
				this.customer_id = options.customerid
			}
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
			changeFirTab(type) {
				this.type = type
				this.init()
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					type:this.type,
					page:this.page,
					customer_id:this.customer_id
				}
				netGetSignList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			toPrevieimg(files) {
				uni.previewImage({
					urls: files
				})
			},
			toMore(id) {
				uni.navigateTo({
					url: '/pagesA/customerInfo/myCustomer/customerDetail?customerid='+id
				})
			},
			//出差 签到
			addChuchai() {
				uni.navigateTo({
					url:'/pagesB/signin/busSign'
				})
			},
			//签到详情
			toSigndetail(item) {
				uni.navigateTo({
					url:'/pagesB/signin/signDetail?id='+item.id
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
		margin-bottom:24rpx;
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
	.signli{
		padding:30rpx;
		background:#fff;
		border-radius: 10rpx;
		margin-bottom:20rpx;
		.signtop{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-bottom:24rpx;
			.headimg{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
			}
			.info{
				margin-left:15rpx;
				.infotop{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.name{
						font-size:26rpx;
						color:#333;
					}
					.time{
						font-size:24rpx;
						color:#999;
						margin-left:10rpx;
					}
				}
				.address{
					font-size:24rpx;
					color:#666;
					margin-top:15rpx;
				}
			}
		}
		.remark{
			padding:20rpx;
			font-size:24rpx;
			line-height: 32rpx;
		}
		.kehu{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size:24rpx;
			padding:0 20rpx;
			color:#666;
			.kehuinfo{
				font-size:24rpx;
				color:$uni-text-color;
			}
		}
	}
	.fujian{
		font-size:24rpx;
		color:#333;
		padding:0 20rpx;
		margin-top:20rpx;
		.imgbox{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-top:15rpx;
		}
		.fujianimg{
			width:120rpx;
			height:120rpx;
			margin-right:15rpx;
		}
	}
</style>
