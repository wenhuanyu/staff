<template>
	<view>
		<view class="itemwarp" v-for="(item,index) in list" :key="index" @tap.stop="toDetail(item)">
			<view class="newitem">
				<view class="item_radio" v-if="isAllopera" @tap.stop="toSelectItem(index)">
					<radio value="r1" :checked="item.select" color="#008EFF"></radio>
				</view>
				<view class="itemnum">报销单号：{{item.number}}</view>
				<view class="itemstaff">
					{{item.staff.name}}
					<image :src="item.staff.img" class="staffimg"></image>
				</view>
			</view>
			<view class="newiteminfo">
				<view class="neleft">
					<view class="neli">关联客户：{{item.customer?item.customer.name:'无'}}</view>
					<view class="neli">消费金额：{{item.money}}</view>
					<view class="neli">
						<image :src="BASE_IMG_URL + '/index/clock.png'" class="neclock"></image>
						<view class="nelitext">{{item.submit_date}}</view>
					</view>
				</view>
				<view class="neright">
					<image :src="BASE_IMG_URL+'/index/check.png'" v-if="item.check_status == 1" class="itemstatusimg"></image>
					<image :src="BASE_IMG_URL+'/index/passed.png'" v-if="item.check_status == 2" class="itemstatusimg"></image>
					<image :src="BASE_IMG_URL+'/index/refused.png'" v-if="item.check_status == 3" class="itemstatusimg"></image>
					<image :src="BASE_IMG_URL+'/index/stoped.png'" v-if="item.check_status == 9" class="itemstatusimg"></image>
				</view>
			</view>
			<view class="item_bot" v-if="type == 2 && item.check_status == 1 && !isAllopera" @tap.stop.prevent>
				<view class="item_btn refuse_btn" @tap.stop="toExamine(2,item)">拒绝</view>
				<view class="item_btn sure_btn" @tap.stop="toExamine(1,item)">同意</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	
	export default{
		props:{
			list:{
				type:Array,
				default:()=>{
					return []
				}
			},
			isAllopera:{   //是否批量操作
				type:Boolean,
				default:false
			},
			type:{
				type:Number/String,
				default:null
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		created() {
		},
		methods:{
			toSelectItem(index) {
				this.$emit('selectItem',index)
			},
			toExamine(status,item) {
				uni.navigateTo({
					url:'/pages/template/examine?status='+status+'&id='+item.id+'&type=consume'
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/detail?id='+item.id
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
		.newitem{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 24rpx 24rpx 0;
			border-bottom:1rpx solid #EDEDED;
			.item_radio{
				radio{
					transform: scale(0.7);
				}
			}
			.itemnum{
				font-size:26rpx;
				color:#666666;
			}
			.itemstaff{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size:22rpx;
				color:#999999;
				.staffimg{
					width:45rpx;
					height:45rpx;
					border-radius: 50%;
					margin-left:20rpx;
				}
			}
		}
		.newiteminfo{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 35rpx 24rpx 0;
			.neleft{
				.neli{
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.neclock{
						width:30rpx;
						height:30rpx;
						margin-right:15rpx;
					}
				}
			}
		}
		.neright{
			width:122rpx;
			height:96rpx;
			.itemstatusimg{
				width:122rpx;
				height:96rpx;
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
				border-radius: 34rpx;
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
</style>
