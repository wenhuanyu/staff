<template>
	<view class="examine-warp">
		<view class="exam-box">
			<image :src="BASE_IMG_URL+'/index/examine-1.png'" class="examimg" ></image>
			<view class="exam-text">请耐心等待管理员通过审核</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		}
	}
</script>

<style lang="scss" scoped>
	.examine-warp{
		width:100%;
		height:100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		.exam-box{
			text-align: center;
			.examimg{
				width:245rpx;
				height:200rpx;
				margin-bottom:20rpx;
			}
			.exam-text{
				font-size:26rpx;
				color:#007AFF;
			}
		}
	}
</style>
