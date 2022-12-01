<template>
	<!-- 搜索 -->
	<view class="l_search">
		<view class="l_selfsearch">
			<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
			<input type="text" :placeholder="placeholder" @input="queryData" class="lself" placeholder-style="color:#999">
		</view>
		<view class="l_tip"  @click="showModal">
			<image :src="BASE_IMG_URL+'/index/shaixuan.png'" class="tipimg" ></image>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			placeholder:{
				type:String,
				default:'请输入关键词搜索'
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			queryData(e) {
				console.log(e)
				this.$emit('queryData',e.detail)
			},
			showModal() {
				this.$emit('showModal')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.l_search{
		padding: 0 30rpx 24rpx;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:$uni-text-color;
		.l_selfsearch{
			width:560rpx;
			height:60rpx;
			border-radius: 34rpx;
			background:#FFFFFF;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 24rpx;
			.searimg{
				width:48rpx;
				height:40rpx;
				margin-right:24rpx;
			}
			.lself{
				width:500rpx;
				font-size:26rpx;
				color:#666;
			}
		}
		.l_tip{
			margin-right: 30rpx;
			.tipimg{
				width:37rpx;
				height:30rpx;
			}
		}
	}
</style>
