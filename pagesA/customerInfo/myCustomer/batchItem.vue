<template>
	<view>
		<view class="batchItem" v-for="(item,index) in list" :key="index" @click="selectItem(index)">
			<radio :checked="item.select" value="" color="#008EFF" />
			<view class="customer">{{item.name}}</view>
			<view class="staffinfo">
				<image :src="item.owner_staff.img" class="staffimg"></image>
				{{item.owner_staff.name}}
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
				default:[]
			}
		},
		data() {
			return{
				
			}
		},
		methods:{
			selectItem(index) {
				this.$emit('selectCustomer',index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.batchItem{
		width:690rpx;
		margin:0 auto 24rpx;
		background:#fff;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
		padding:30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		radio{
			transform: scale(0.7);
		}
		.staffinfo{
			width:145rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size:26rpx;
			color:#333;
			.staffimg{
				width:40rpx;
				height:40rpx;
				border-radius: 50%;
				margin-right:24rpx;
			}
		}
		.customer{
			width:390rpx;
			text-align: left;
			font-size:26rpx;
			color:#000;
			overflow: hidden; /*隐藏*/
			white-space: nowrap;  /*不换行*/
			text-overflow: ellipsis
		}
	}
</style>
