<template>
	<view>
		<view class="fllow_form">
			<view class="key">维修结果</view>
			<view class="form_right">
				<radio-group class="radiowarp" disabled>
					<view class="">
						<radio value="1" color="#0287FF" :checked="is_over == 1" />维修成功
					</view>
					<view class="">
						<radio value="2" color="#0287FF" :checked="is_over == 2" />维修失败
					</view>
				</radio-group>
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head">备注:</view>
			</view>
			<textarea v-model="remark" disabled maxlength="-1" :class="remark ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		<!-- 服务费用 -->
		<view class="fllow_form">
			<view>服务费用</view>
			<view class="form_right">
				<view class="valueActive">共计{{serviceMoney}}元</view>
			</view>
		</view>
		<view class="prolist" v-if="serviceList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in serviceList" :key="index">
					<view class="iconfont icon-jian" @click="delService(index)"></view>
					<view class="protext" style="width:160rpx">{{item.name}}</view>
					<view class="protext">
						<input type="text" v-model="item.money" @blur="(e)=>{changeMoney(e,index)}" placeholder="请输入服务费用" class="priceinput">元
					</view>
				</view>
			</view>
		</view>
		<!-- 配件费用 -->
		<view class="fllow_form" style="margin-top:24rpx;">
			<view>配件费用</view>
			<view class="form_right">
				<view class="valueActive">共计{{partsMoney}}元</view>
			</view>
		</view>
		<view class="prolist" v-if="partsList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in partsList" :key="index">
					<view class="iconfont icon-jian" @click="delParts(index)"></view>
					<view class="protext">{{item.name}}</view>
					<view class="protext">
						<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changePartNumber(e,index)}" />
					</view>
					<view class="protext" >{{item.price}}</view>
				</view>
			</view>
		</view>
		<view class="fllow_form" style="margin-top:24rpx">
			<view>优惠金额</view>
			<view class="form_right">
				<input type="number" disabled v-model="discount_money" class="form_input" placeholder="请输入优惠金额">
			</view>
		</view>
		<view class="fllow_form" style="margin-top:24rpx">
			<view>总计</view>
			<view class="form_right">
				<input type="number" disabled v-model="discount_money" class="form_input" placeholder="总计金额">
			</view>
		</view>
		<!-- 审核信息 -->
		<examine-people title="优惠审批人(依次审批)" :list="remindPeople" :showAdd="false"></examine-people>
		
		<view class="button">审核通过</view>
		<view class="button" style="background:red">审核拒绝</view>
		
		<view class="button">继续维修</view>
		<view class="button" style="background:#ff7800">不再维修</view>
		
	</view>
</template>

<script>
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				serviceMoney:'0.00',   //服务费用
				serviceList:[],
				partsMoney:'0.00',   //配件费用
				partsList:[],
				remindPeople:[],
				examineType:'approval',
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:24rpx 40rpx 24rpx 50rpx;
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx 40rpx;
		border-bottom:1rpx solid #f5f5f5;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
			}
		}
		textarea {
			width: 660rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size:26rpx;
			background:rgba(202, 202, 202, 0.2);
		}
	}
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom:0;
				}
				.icon-jian{
					font-size:42rpx;
					color:#ff7800;
				}
				.protext{
					font-size:24rpx;
					color:#333;
					width:200rpx;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					.priceinput{
						width:180rpx;
						font-size:24rpx;
						color:#333;
					}
				}
			}
		}
	}
	.add_in{
		display: flex;
		justify-content: center;
		align-items: center;
		padding:15rpx 0;
		background:#fff;
		font-size:28rpx;
		color:#14C2C1;
		.icon-jiahaocu{
			font-size:30rpx;
			color:#14C2C1;
		}
	}
	.arrive_bot{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:100rpx;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		padding:0 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 9;
		.arri_money{
			font-size:26rpx;
			color:#ff7800;
		}
		.arrbtn{
			width:120rpx;
			height:80rpx;
			background:#0287FF;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			font-size:26rpx;
			border-radius: 8rpx;
		}
	}
</style>
