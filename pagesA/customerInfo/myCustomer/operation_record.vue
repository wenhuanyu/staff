<template>
	<view>
		<view class="ope_warp" v-for="item in list" :key="item.id">
			<view class="ope_top">
				<view class="staffbox">
					<image :src="item.staff.img" class="staffimg"></image>
					<view class="staffname">{{item.staff.name}}</view>
				</view>
				<view class="time">{{item.createtime}}</view>
			</view>
			<view class="content">{{item.content}}</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { netCustomerOperation } from '@/api/api.js'
	
	export default{
		data() {
			return{
				customer_id:'',  //客户id
				list:[],  //操作记录
			}
		},
		methods:{
			init(id){
				this.customer_id = id
				this.getList()
			},
			getList() {
				let params = {
					relation_type:1,
					relation_id: this.customer_id
				}
				netCustomerOperation(params).then(res=>{
					this.list = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ope_warp{
		width:690rpx;
		margin:24rpx auto;
		padding:30rpx;
		border-radius: 20rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		background:#fff;
		.ope_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom:15rpx;
			border-bottom:1rpx solid #f5f5f5;
			.staffbox{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.staffimg{
					width:45rpx;
					height:45rpx;
					border-radius: 50%;
					margin-right:24rpx;
				}
				.staffname{
					font-size:24rpx;
					color:#666;
				}
			}
			.time{
				font-size:24rpx;
				color:#999;
			}
		}
		.content{
			margin-top:24rpx;
			font-size:24rpx;
			color:#333;
			line-height: 42rpx;
		}
	}
</style>
