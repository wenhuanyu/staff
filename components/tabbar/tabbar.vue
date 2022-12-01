<template>
	<view>
		<view class="block-height"></view>
		<view class="tab-warp">
			<view class="tab-box">
				<view class="tab-li" v-for="(item,index) in tablist" :key="index" @click="switchTabbar(item.pagePath)">
					<image :src="currentPath == item.pagePath ? item.selectedIconPath : item.iconPath " class="tabimg"></image>
					<view class="tab-text">{{item.text}}</view>
					<view class="tab-number" v-if="item.num > 0">{{item.num}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			tipNumber:{
				type:Number,
				default:0
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				tablist:[
					{
						pagePath: "/pages/index/index",
						iconPath: BASE_IMG_URL+"/index/icon1.png",
						selectedIconPath: BASE_IMG_URL+"/index/icon1_a.png",
						text: "首页",
						isTip:true,
						num:0
					},
					{
						pagePath: "/pages/index/myCustomer/index",
						iconPath: BASE_IMG_URL+"/index/icon2.png",
						selectedIconPath: BASE_IMG_URL+"/index/icon2_a.png",
						text: "客户",
						isTip:true,
						num:0
					},
					{
						pagePath: "/pages/news/index",
						iconPath: BASE_IMG_URL+"/tab_tip.png",
						selectedIconPath: BASE_IMG_URL+"/tab_tip_a.png",
						text: "消息",
						isTip:true,
						num: this.tipNumber
					},
					{
						pagePath: "/pages/user/index",
						iconPath: BASE_IMG_URL+"/index/icon4.png",
						selectedIconPath: BASE_IMG_URL+"/index/icon4_a.png",
						text: "我的",
						isTip:true,
						num:0
					}
				]
			}
		},
		computed:{
			currentPath() {
				let pages = getCurrentPages();
				let query = this.queryObj ? this.queryObj : {};
				let currPage = null;
				if (pages.length) {
					currPage = pages[pages.length - 1].route;
				}
				if (Object.keys(query).length) {
					let params = '';
					for (let key in query) {
						params += '?' + key + '=' + query[key] + '&';
					}
					params = params.substring(0, params.length - 1);
					return '/' + currPage + params;
				}
				return '/' + currPage;
			}
		},
		created() {
			
		},
		methods:{
			switchTabbar(path) {
				uni.redirectTo({
					url: path,
					fail:(err)=>{
						console.log(err)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.block-height{
		width:750rpx;
		height: calc(100rpx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);
	}
	.tab-warp{
		width:750rpx;
		height: calc(100rpx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);
		background:#fff;
		border-top: 1rpx solid #eeeeee;
		position: fixed;
		left:0;
		bottom:0;
		z-index:99;
		.tab-box{
			width: 100%;
			height: calc(100rpx + env(safe-area-inset-bottom) / 2);
			display: flex;
			align-items: center;
			justify-content: space-around;
			.tab-li {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				flex: 1;
				position: relative;
				.tabimg {
					width: 50rpx;
					height: 50rpx;
				}
				.tab-text {
					font-size: 20rpx;
				}
				.tab-number{
					font-size:24rpx;
					color:#fff;
					background:#F43F3B;
					width:40rpx;
					height:40rpx;
					border-radius: 50%;
					text-align: center;
					line-height: 40rpx;
					position: absolute;
					right:30rpx;
					top:0;
				}
			}
		}
	}
</style>
