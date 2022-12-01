<template>
	<uni-popup ref="popup" type="center" background-color="#fff" @touchmove.stop.prevent>
		<view class="centerbox">
			<view class="popuptitle">新建</view>
			<view class="botbox">
				<view class="botwarp">
					<view class="botli" :class="1 == tabid ? 'botli_active' : ''"  @click="changeTab(1)">费用</view>
					<view class="botli" :class="2 == tabid ? 'botli_active' : ''"  @click="changeTab(2)">合同</view>
					<view class="botli" :class="3 == tabid ? 'botli_active' : ''"  @click="changeTab(3)">回款</view>
					<view class="botli" :class="4 == tabid ? 'botli_active' : ''"  @click="changeTab(4)">报价</view>
					<view class="botli" :class="5 == tabid ? 'botli_active' : ''"  @click="changeTab(5)">售后</view>
				</view>
				<view class="botbtn" @click="sureAdd">确认</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import { mapState } from 'vuex'
	
	export default{
		props:{
			info:{
				type:Object,
				default:null
			}
		},
		data() {
			return{
				tabarr:[
					{id:0,name:'拜访'},
					{id:1,name:'费用'},
					{id:2,name:'合同'},
					{id:3,name:'回款'},
					{id:4,name:'报价'},
					{id:5,name:'售后'}
				],
				tabid:0,
			}
		},
		created() {
		},
		methods:{
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			changeTab(index) {
				this.tabid = index
			},
			sureAdd() {
				if(this.tabid == 5) {
					//售后
					uni.navigateTo({
						url:'/pagesA/customerInfo/visit/createVisit?customerid='+this.info.id,
						success:()=>{
							this.close()
						}
					})
				}else if(this.tabid == 1) {
					//费用
					uni.navigateTo({
						url:'/pagesA/customerInfo/cost/createNewCost?customerid='+this.info.id,
						success:()=>{
							this.close()
						}
					})
				}else if(this.tabid == 2) {
					//合同
					uni.navigateTo({
						url:'/pagesA/customerInfo/order/createOrder?customerid='+this.info.id+'&type=1',
						success:()=>{
							this.close()
						}
					})
				}else if(this.tabid == 3) {
					//回款
					uni.navigateTo({
						url:'/pagesA/customerInfo/payment/createPayment?customerid='+this.info.id+'&name='+this.info.name,
						success:()=>{
							this.close()
						}
					})
				}else if(this.tabid == 4) {
					//报价
					uni.navigateTo({
						url:'/pagesC/quotation/addQuotation?customerid='+this.info.id,
						success:()=>{
							this.close()
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.centerbox{
		width:660rpx;
		border:20rpx;
		background:#fff;
	}
	.botbox{
		width:660rpx;
		padding:30rpx;
		.botwarp{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.botli{
				width:165rpx;
				height:60rpx;
				border-radius: 30rpx;
				border:1rpx solid $uni-text-color;
				font-size:30rpx;
				color:$uni-text-color;
				text-align: center;
				line-height: 58rpx;
				margin-right:52rpx;
				margin-bottom:40rpx;
				&:nth-child(3n){
					margin-right:0;
				}
			}
			.botli_active{
				background:$uni-text-color;
				color:#fff;
			}
		}
		.botbtn{
			width:500rpx;
			height:88rpx;
			border-radius: 30rpx;
			background:$uni-text-color;
			color:#fff;
			text-align: center;
			line-height: 88rpx;
			margin:30rpx auto;
		}
		
	}
</style>
