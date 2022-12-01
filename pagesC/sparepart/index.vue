<template>
	<view>
		<view class="part_warp">
			<view class="parttitle">记录</view>
			<view class="part_content">
				<view class="part_li"  @click="toMyapply(1)">
					<image :src="BASE_IMG_URL+'/index/myApply.png'" class="firpart" ></image>
					<view class="part_text">我申请的</view>
				</view>
				<view class="part_li"  @click="toMyapply(2)">
					<image :src="BASE_IMG_URL+'/index/waitCheck.png'" class="firpart" ></image>
					<view class="part_text">我审核的</view>
				</view>
			</view>
		</view>
		<view class="part_warp">
			<view class="parttitle">库存管理</view>
			<view class="part_content">
				<view class="part_li" @click="toSpareList">
					<image :src="BASE_IMG_URL+'/index/stockSearch.png'" class="firpart" ></image>
					<view class="part_text">库存查询</view>
				</view>
				<view class="part_li"  @click="toInLibrary(2)">
					<image :src="BASE_IMG_URL+'/index/outStock.png'" class="firpart" ></image>
					<view class="part_text">出库</view>
				</view>
				<view class="part_li"  @click="toInLibrary(1)">
					<image :src="BASE_IMG_URL+'/index/inStock.png'" class="firpart" ></image>
					<view class="part_text">入库</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	
	export default{
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		onLoad() {
		},
		methods:{
			//我申请的
			toMyapply(type) {
				uni.navigateTo({
					url:'/pagesC/sparepart/myApply?type='+type
				})
			},
			//库存查询
			toSpareList() {
				uni.navigateTo({
					url:'/pagesC/sparepart/sparepartList'
				})
			},
			//入库
			toInLibrary(type) {
				uni.navigateTo({
					url:'/pagesC/sparepart/inLibrary?type='+type
				})
			},
			//出库
			toOutLibrary() {
				uni.navigateTo({
					url:'/pagesC/sparepart/outLibrary'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.parttitle{
		padding:26rpx 50rpx;
		font-size: 26rpx;
		color: #666666;
		position: relative;
		&::before{
			content:'';
			position:absolute;
			left:30rpx;
			top:33rpx;
			width:10rpx;
			height:25rpx;
			border-radius: 5rpx;
			background:$uni-btn-bg-color;
		}
	}

	.part_warp{
		margin-top: 20rpx;
		padding: 0 30rpx 0;
		display: flex;
		flex-direction: column;
		width: 750rpx;
		height: 221rpx;
		background: #FFFFFF;
		border: 1rpx solid #FFFFFF;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		
		.part_content{
			display: flex;
			justify-content: space-evenly;
			.part_li{
				text-align: center;
				margin-right:160rpx;
				&:nth-child(3n){
					margin-right:0;
				}
				.firpart{
					width:48rpx;
					height:48rpx;
				}
				.part_text{
					font-size: 26rpx;
					color: #999999;
				}
			}
		}
	}
</style>
