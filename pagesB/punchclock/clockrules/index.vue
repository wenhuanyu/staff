<template>
	<view class="">
		<view class="li_rule" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
			<view class="top_tit">
				<view class="ruletitle">{{item.name}}</view>
				<view class="iconfont icon-arrows_right"></view>
			</view>
			<view class="litext">人员：{{item.staff_info}}</view>
			<view class="litext">类型：{{item.type == 0 ? '固定上下班' : ''}}</view>
			<view class="litext">时间：{{item.time_info}}</view>
			<view class="litext">位置：{{item.address_info}}</view>
		</view>
		<!-- 新建 -->
		<view class="icon_creat" @click="toCreate" v-if="list.length < 1">
			<image :src="BASE_IMG_URL+'/1.png'" mode="scaleToFill"></image>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netRulesList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList() {
				netRulesList().then(res=>{
					this.list = res.data
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesB/punchclock/clockrules/addRules?id='+item.id
				})
			},
			toCreate() {
				uni.navigateTo({
					url:'/pagesB/punchclock/clockrules/addRules'
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
	.li_rule{
		width:690rpx;
		border-radius: 10rpx;
		background:#fff;
		padding:30rpx;
		margin:24rpx auto 0;
		.top_tit{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:15rpx;
			.ruletitle{
				font-size:30rpx;
				color:#333;
			}
		}
		.litext{
			font-size:24rpx;
			color:#999;
			margin-bottom:10rpx;
			&:last-child{
				margin-bottom:0;
			}
		}
	}
</style>