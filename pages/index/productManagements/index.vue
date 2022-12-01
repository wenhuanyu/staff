<template>
	<view class="warpbox">
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入关键词搜索" @input="queryData" class="lself" placeholder-style="color:#999">
			</view>
		</view>
		<scroll-view scroll-y class="scrollbox">
			<view class="pop_info_right">
				<view class="pop_info_cen" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
					<view class="pro_info">
						<image :src="item.img" class="proimg" ></image>
						<view class="pro_info_right">
							<view class="info_text" style="font-size: 28rpx; color: #666;">{{item.name}}</view>
							<view class="info_text">编码：{{item.num}}</view>
							<view class="info_text">单位：{{item.unit}}</view>
							<view class="info_text">零售价：{{item.price}}</view>
							<view class="info_text">批发价：{{item.wholesale}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { netProductList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
				name:'',
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
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods:{
			queryData(e) {
				this.name = e.detail.value
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					page:this.page,
					name:this.name
				}
				netProductList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			toAddProduct() {
				uni.navigateTo({
					url:'/pages/index/productManagements/addProduct?type=1'
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pages/index/productManagements/addProduct?type=2&id='+item.id
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
		background:$uni-top-bg-color;
		.censear{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 24rpx;
			border-radius: 34rpx;
			background:#FFFFFF;
			width:488rpx;
			height:68rpx;
			.searimg{
				padding-right: 15rpx;
				width:35rpx;
				height:35rpx;
			}
			.lself{
				font-size:26rpx;
			}
		}
	}
	.scrollbox{
		width:750rpx;
		height:calc(100vh - 110rpx);
	}
	.pop_info_right{
		padding:24rpx 0;
		.pop_info_cen{
			width: 690rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
			border-radius: 10rpx;
			margin:24rpx auto 0;
		}
		.pro_title{
			padding:24rpx 0;
			font-size:30rpx;
			color:#333333;
		}
		.pro_info{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:24rpx;
			.proimg{
				margin: 33rpx 0 33rpx 30rpx;
				width: 158rpx;
				height: 158rpx;
				border-radius: 10rpx;
			}
			.pro_info_right{
				margin-left: 75rpx;
				.info_text{
					font-size:26rpx;
					color:#999999;
					margin-bottom:14rpx;
					&:last-child{
						margin-bottom:0;
					}
				}
			}
		}
		.pro_num{
			font-size:28rpx;
			color:#0287FF;
			padding:24rpx 0;
		}
	}
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
</style>
