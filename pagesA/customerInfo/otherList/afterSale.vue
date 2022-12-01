<template>
	<view>
		<view class="cost_item" v-for="(item,index) in afterSale_list" :key="index"  @tap.stop="toSaleDetail(item)">
			<view class="cost_li_con" >
				问题描述：{{item.title}}
			</view>
			<view class="cost_li_con" >
				客户名称：{{item.customer.name}}
			</view>
			<view class="cost_li_con" >
				工单编号：{{item.workorder_number}}
			</view>
		</view>
	</view>
</template>

<script>
	import { netWorkOrderList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				afterSale_list:[],
				customerid:'',
				page:1,
				totalPage:1
			}
		},
		onLoad(options) {
			this.customerid = options.id
			this.getSaleafterList()
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++
				this.getSaleafterList()
			}
		},
		methods:{
			//售后 列表
			getSaleafterList() {
				let params = {
					customer_id:this.customerid,
					page:this.page
				}
				netWorkOrderList(params).then(res=>{
					this.afterSale_list = this.afterSale_list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//售后  工单 详情
			toSaleDetail(item) {
				if(item.workorder_type == '产品发货' || item.workorder_type == '配件配送'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorder/distribution_word?workorderid='+item.id
					})
					return
				}
				if(item.workorder_type == '品质异常单'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorder/quality_order_detail?workorderid='+item.id
					})
					return
				}
				if(item.workorder_type == '返厂维修'){
					uni.navigateTo({
						url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+item.id
					})
					return
				}
				if(item.workorder_type == '设计工单'){
					uni.navigateTo({
						url:'/pagesA/afterSales/designWorkOrder/designDetail?id='+item.id
					})
					return
				}
				if(item.workorder_type == '电话售后'){
					uni.navigateTo({
						url:'/pagesA/afterSales/phoneAftersale/detail?id='+item.id
					})
					return
				}
				uni.navigateTo({
					url:'/pagesA/afterSales/workorderDetail?workorderid='+item.id
				})
			},
			//查看  售后 图片
			toPriveSaleimg(arr,index) {
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					urls:data,
					current:index,
					success:(res)=>{
						this.$emit('seePicture')
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cost_item{
		padding:24rpx 30rpx;
		width:690rpx;
		margin:24rpx auto 0;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		.cost_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cost_text{
				font-size:26rpx;
				color:#999999;
				margin-bottom:15rpx;
			}
			.cost_status{
				font-size: 24rpx;
				color: #00B954;
				padding:5rpx 8rpx;
				background:rgba(0, 185, 84, 0.2);
			}
			.cost_money{
				font-size:34rpx;
				color:#FFA205;
			}
		}
		.cost_li_con{
			font-size:26rpx;
			color:#999999;
			margin-bottom:15rpx;
		}
		.cost_li_img{
			.cost_img_tit{
				font-size:26rpx;
				color:#999999;
				margin-bottom:15rpx;
			}
			.cost_img_list{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				.cost_img_box{
					width:100rpx;
					height:100rpx;
					border-radius: 20rpx;
					margin-right:45rpx;
					.costimg{
						width:100rpx;
						height:100rpx;
						border-radius: 20rpx;
					}
				}
			}
		}
	}
</style>
