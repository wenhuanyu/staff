<template>
	<view>
		<view class="scroll_li" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
			<view class="li_top">
				<view class="title">{{item.odd_numbers}}</view>
				<view class="status" v-if="item.check_status == 0 || item.check_status == 1">待审核</view>
				<view class="status_pass" v-if="item.check_status == 2">已同意</view>
				<view class="status_fail" v-if="item.check_status == 3 || item.check_status == 4">已拒绝</view>
			</view>
			<view class="li_bot">
				<view class="li_text">
					<view>申请人：</view>
					<view>{{item.create_staff.name}}</view>
				</view>
				<view class="li_text">
					<view>申请时间：</view>
					<view>{{item.storage_time}}</view>
				</view>
			</view>
			<view class="item_bot" @tap.stop.prevent>
				<view class="item_btn refuse_btn" @tap.stop="toExamine(2,item)">拒绝</view>
				<view class="item_btn sure_btn" @tap.stop="toExamine(1,item)">同意</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	
	export default{
		props:{
			list:{
				type:Array,
				default:[{}]
			}
		},
		data(){
			return{
				
			}
		},
		methods:{
			toExamine(status,item){
				uni.navigateTo({
					url:'/pages/template/examine?status='+status+'&type=parts&id='+item.id
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesC/sparepart/myapplyDetail?id='+item.id+'&type=2'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll_li{
		width:690rpx;
		margin:0 auto 24rpx;
		background:#fff;
		border-radius: 15rpx;
		box-shadow: 1rpx 1rpx 15rpx 3rpx rgba(0,0,0,0.1);
		.li_top{
			padding:24rpx 30rpx;
			border-bottom:1rpx solid #f5f5f5;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:15rpx;
			.title{
				font-size:32rpx;
				color:#333;
				flex:1;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.status{
				font-size:24rpx;
				color:#0287FF;
				padding:2rpx 15rpx;
				background:rgba(2, 135, 255, 0.1);
				border-radius: 5rpx;
			}
			.status_pass{
				font-size:24rpx;
				color:#1ABB85;
				padding:2rpx 15rpx;
				background:rgba(26, 187, 133, 0.1);
				border-radius: 5rpx;
			}
			.status_fail{
				font-size:24rpx;
				color:#F25340;
				padding:2rpx 15rpx;
				background:rgba(242, 83, 64, 0.1);
				border-radius: 5rpx;
			}
		}
		.li_bot{
			padding:24rpx 30rpx;
			.li_text{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size:28rpx;
				color:#666;
				margin-bottom:15rpx;
			}
		}
		.item_bot{
			padding:24rpx;
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
				border:1rpx solid #0287FF;
				line-height: 66rpx;
				color:#0287FF;
			}
			.sure_btn{
				background:#0287FF;
				color:#fff;
				line-height: 68rpx;
			}
		}
		.li_status{
			font-size:24rpx;
			color:#14c2c1;
		}
	}
</style>
