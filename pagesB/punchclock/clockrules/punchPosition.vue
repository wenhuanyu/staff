<template>
	<view class="">
		<view class="listwarp" >
			<view class="x_warp" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
				<view class="x_left">
					<view class="x_p"> <span>地点</span> <text>{{item.address}}</text> </view>
					<view class="x_p"> <span>地址</span> <text>{{item.address_detail}}</text> </view>
					<view class="x_p"> <span>范围</span> <text>{{item.distance}}米</text> </view>
				</view>
				<view class="iconfont icon-arrows_right"></view>
			</view>
		</view>
		<view class="" style="height:200rpx" v-if="list.length == 0"></view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
		<!-- 新建 -->
		<view class="icon_creat" @click="toAddPosition">
			<image :src="BASE_IMG_URL+'/1.png'" mode="scaleToFill"></image>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netAddressList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[]
			}
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList() {
				netAddressList().then(res=>{
					this.list = res.data
				})
			},	
			//添加位置
			toAddPosition() {
				uni.navigateTo({
					url:'/pagesB/punchclock/clockrules/addPosition'
				})
			},
			//详情
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesB/punchclock/clockrules/addPosition?id='+item.id
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
	.listwarp{
		.x_warp{
			width:690rpx;
			background:#fff;
			border-radius: 10rpx;
			margin:24rpx auto 0;
			padding:30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.x_left{
				.x_p{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:24rpx;
					color:#999;
					margin-bottom:15rpx;
					&:last-child{
						margin-bottom:0;
					}
					span{
						flex-shrink: 0;
					}
					text{
						font-size:30rpx;
						color:#333;
						margin-left:24rpx;
					}
				}
			}
		}
	}
</style>