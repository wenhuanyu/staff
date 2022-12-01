<template>
	<view>
		<view class="cell_con" v-for="(item,index) in product_list" :key="index" >
			<view class="cellLeft">
				<image :src="item.product.img" class="proimg" ></image>
				<view class="procenter">
					<view class="proname">{{item.product.name}}</view>
					<view class="context">单位：{{item.product.unit}}</view>
					<view class="context">编码：{{item.product.num}}</view>
					<view class="context">编号：{{item.number?item.number:'暂无'}}</view>
				</view>
			</view>
			<view class="proright">
				<view class="probox">{{item.status}}</view>
			</view>
		</view>
		<view style="height:30rpx"></view>
	</view>
</template>

<script>
	import { netCustomerProductList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				product_list:[],
				page:1,
				totalPage:1,
				customerid:''
			}
		},
		onLoad(options) {
			this.customerid = options.id
			this.getProductList()
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++ 
				this.getProductList()
			}
		},
		methods:{
			getProductList() {
				let params = {
					customer_id: this.customerid,
					page:this.page
				}
				netCustomerProductList(params).then(res=>{
					this.product_list = this.product_list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cell_con{
		background:#fff;
		padding:30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width:690rpx;
		margin:24rpx auto 0;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		.cellLeft{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.proimg{
				width:130rpx;
				height:130rpx;
				margin-right:24rpx;
			}
			.procenter{
				.proname{
					font-size:24rpx;
					color:#666666;
				}
				.context{
					font-size:24rpx;
					color:#999999;
					margin-top:15rpx;
				}
			}
		}
		
		.proright{
			text-align: center;
			.probox{
				font-size:26rpx;
				font-weight: bolc;
				color:$uni-text-color;
			}
		}
	}
</style>
