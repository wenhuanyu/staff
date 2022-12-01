<template>
	<view>
		<view class="tabwarp">
			<view class="tabli" v-for="(item,index) in tablist" :key="index" @click="toCreate(item)">
				<image :src="item.img" class="tabimg" ></image>
				<view class="tabtext">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netWorkExamineName } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				tablist:[],
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		onLoad() {
			this.getTab()
		},
		methods:{
			getTab() {
				netWorkExamineName().then(res=>{
					this.tablist = res.data
				})
			},
			toCreate(item) {
				uni.navigateTo({
					url:'/pagesA/user/work_approval/createApproval?id='+item.id+'&name='+item.name
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabwarp{
		padding:30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.tabli{
			width:210rpx;
			text-align: center;
			padding:24rpx;
			margin-right:26rpx;
			margin-bottom:26rpx;
			// box-shadow: 1rpx 1rpx 15rpx 2rpx rgba(0,0,0,0.1);
			&:nth-child(3n){
				margin-right:0;
			}
			.tabimg{
				width:50rpx;
				height:50rpx;
			}
			.tabtext{
				height:60rpx;
				font-size:26rpx;
				color:#333;
			}
		}
	}
</style>
