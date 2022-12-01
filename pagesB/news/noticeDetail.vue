<template>
	<view class="warp">
		<view class="content title">
			标题：{{info.title}}
		</view>
		<view class="content time">
			时间：{{info.createtime}}
		</view>
		<view class="content">
			内容：
		</view>
		<view class="content" v-html="info.content"></view>
	</view>
</template>

<script>
	import { netNoticeDetail } from '@/api/api.js'
	export default{
		data() {
			return {
				info:{},
				id:''
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getDetail()
		},
		methods:{
			getDetail() {
				netNoticeDetail({id:this.id}).then(res=>{
					this.info = res.data
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
	.warp{
		padding:20rpx 24rpx;
		background:#fff;
		.content{
			font-size:28rpx;
			color:#666;
			line-height: 45rpx;
			width:100%;
		}
		.title{
			font-size:32rpx;
			color:#333;
		}
		.time{
			color:#999;
			font-size:26rpx;
		}
	}
</style>
