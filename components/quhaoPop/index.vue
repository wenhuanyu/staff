<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popup_title">选择国家</view>
			<view class="searbox">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searchimg" ></image>
				<input type="text" placeholder="名称搜索" v-model="name" @input="queryData" class="selfinput">
			</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="list_warp">
					<view class="list_item" v-for="(item,index) in list" :key="index" @click="changeQuhao(item)">
						<view class="name">{{item.name}}</view>
						<view class="number" v-if="!isCountry">{{item.number}}</view>
					</view>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	import { netEnMobild } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			show:{
				type:Boolean,
				default:false
			},
			isCountry:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				list:[],
				name:'',
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			queryData(e) {
				this.getMobileCode()
			},
			getMobileCode(){
				this.$refs.popup.open()
				let params = {
					name: this.name
				}
				netEnMobild(params).then(res=>{
					this.list = res.data
				})
			},
			closePop() {
				this.$emit('close')
			},
			changeQuhao(item) {
				this.$refs.popup.close()
				this.$emit('sureQuhao',item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup_title{
		text-align: center;
		font-size:34rpx;
		color:#333333;
		padding:24rpx;
	}
	.searbox{
		width:650rpx;
		height:68rpx;
		border-radius: 34rpx;
		margin:0 auto;
		border:1rpx solid $uni-text-color;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding:0 15rpx;
		.searchimg{
			width:48rpx;
			height:48rpx;
			margin-right:15rpx;
		}
		.selfinput{
			width:450rpx;
			font-size:26rpx;
			color:#999;
		}
	}
	.scrollbox{
		width:100%;
		height:700rpx;
		
	}
	.list_warp{
		padding:30rpx;
		.list_item{
			padding:24rpx 40rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			margin-bottom:24rpx;
			border-radius: 10rpx;
			.name{
				font-size:30rpx;
				color:#333;
			}
			.number{
				font-size:30rpx;
				color:#666;
				margin-left:30rpx;
			}
		}
	}
</style>
