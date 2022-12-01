<template>
	<view>
		<view class="itemwarp" :class="styleType == 'list' ? '' : 'index_wk_li'"  v-for="(item,index) in list" :key="index" @tap.stop="toDetail(item)">
			<view class="item_info">
				<view class="item_info_left">
					<view class="item_text">类型：{{item.formapproval.name}}</view>
					<view class="item_text">发起人：{{item.create_staff.name}}</view>
					<view class="item_text"><image :src="BASE_IMG_URL + '/index/clock.png'"></image>{{item.createtime}}</view>
				</view>
				<view class="item_info_right">
					<image :src="BASE_IMG_URL+'/index/check.png'" v-if="item.check_status == 1" class="itemstatusimg"></image>
					<image :src="BASE_IMG_URL+'/index/passed.png'" v-if="item.check_status == 2" class="itemstatusimg"></image>
					<image :src="BASE_IMG_URL+'/index/refused.png'" v-if="item.check_status == 3" class="itemstatusimg"></image>
					<image :src="BASE_IMG_URL+'/index/recalled.png'" v-if="item.check_status == 4" class="itemstatusimg"></image>
					<image :src="BASE_IMG_URL+'/index/stoped.png'" v-if="item.check_status == 9" class="itemstatusimg"></image>
				</view>
			</view>
			<view class="item_bot" v-if="type == 3 && item.check_status == 1" @tap.stop.prevent>
				<view class="item_btn refuse_btn" @tap.stop="toExamine(2,item)">拒绝</view>
				<view class="item_btn sure_btn" @tap.stop="toExamine(1,item)">同意</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			},
			type:{  //1全部  2我发起的   3我审核的
				type:Number,
				default:0
			},
			checkStatus:{   //1待审核  2审核通过  3审核拒绝
				type:Number,
				default:0
			},
			styleType:{
				type:String,
				default:'list'
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			toExamine(status,item) {
				uni.navigateTo({
					url:'/pages/template/examine?status='+status+'&id='+item.id+'&type=approval'
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/user/work_approval/approvalDetail?id='+item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.itemwarp{
		width:690rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin:24rpx auto 0;
		padding:0 40rpx;
		.item_title{
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			font-size:30rpx;
			color:#333333;
		}
		.item_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0;
			.item_info_left{
				.item_text{
					display: flex;
					align-items: center;
					font-size:26rpx;
					color:#999999;
					margin-bottom:22rpx;
					image{
						margin-right: 15rpx;
						width: 30rpx;
						height: 30rpx;
					}
				}
			}
			.item_info_right{
				width:121rpx;
				height:93rpx;
				flex-shrink: 0;
				margin-left:24rpx;
				.itemstatusimg{
					width:121rpx;
					height:93rpx;
				}
			}
		}
		.item_bot{
			padding:24rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top:1rpx solid #f5f5f5;
			.item_btn{
				width:284rpx;
				height:68rpx;
				border-radius: 10rpx;
				font-size:32rpx;
				text-align: center;
			}
			.refuse_btn{
				border:1rpx solid $uni-text-color;
				line-height: 66rpx;
				color:$uni-text-color;
			}
			.sure_btn{
				background:$uni-text-color;
				color:#fff;
				line-height: 68rpx;
			}
		}
	}
	.index_wk_li{
		width: 100%;
		background-color: #f6f6f6;
	}
</style>
