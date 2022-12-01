<template>
	<view>
		<view class="opewrap">
			<view class="operation" @click="toEdit">修改</view>
			<view class="operation" @click="toAdd">添加</view>
		</view>
		<view class="cirtit">负责人</view>
		<view class="peobox">
			<view class="peoinfo" v-for="(item,index) in list" :key="index" v-if="item.roles == 1">
				<image :src="item.staff.img" class="peoimg" ></image>
				<view class="peoright">
					<view class="pr_left">
						<view class="name">{{item.staff.name}}</view>
						<view class="pr_post">{{item.staff.post}} - {{item.staff.name}}</view>
						<view class="pr_text">团队角色 负责人</view>
						<view class="pr_text">权限 负责人</view>
					</view>
					<image :src="BASE_IMG_URL+'/index/phone-call.png'" @click="toCall(item)" class="pr_phone" >
				</view>
			</view>
		</view>
		<view class="cirtit">团队成员</view>
		<view class="peobox">
			<view class="peoinfo" v-for="(item,index) in list" :key="index" v-if="item.roles == 2">
				<image :src="item.staff.img" class="peoimg" ></image>
				<view class="peoright">
					<view class="pr_left">
						<view class="name">{{item.staff.name}}</view>
						<view class="pr_post">{{item.staff.post}} - {{item.staff.name}}</view>
						<view class="pr_text">团队角色 普通员工</view>
						<view class="pr_text" v-if="item.is_edit == 0">权限 只读</view>
						<view class="pr_text" v-if="item.is_edit == 1">权限 读写</view>
					</view>
					<image :src="BASE_IMG_URL+'/index/phone-call.png'" @click="toCall(item)" class="pr_phone" >
				</view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
		<view style="height:30rpx;"></view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				type:'',
				list:[]
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.list = uni.getStorageSync('teamList')
		},
		methods:{
			sureSub() {
				uni.setStorageSync('teamList',this.list)
				uni.navigateBack({
					delta:1
				})
			},
			toCall(item) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: item.staff.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber:item.staff.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(item.staff.mobile, true);
				// #endif
			},
			//添加
			toAdd() {
				uni.setStorageSync('team', [])
				uni.navigateTo({
					url:'/pagesA/customerInfo/team/add'
				})
			},
			//修改
			toEdit() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/team/edit'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.opewrap{
		padding:35rpx 35rpx 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.operation{
			font-size:28rpx;
			color:$uni-text-color;
			font-weight: bold;
			margin-left:30rpx;
		}
	}
	.cirtit{
		padding:24rpx 30rpx;
		font-size:28rpx;
		border-bottom:1rpx solid #f5f5f5;
	}
	.peobox{
		.peoinfo{
			padding:24rpx 30rpx;
			display: flex;
			justify-content: flex-start;
			border-bottom:1rpx solid #f5f5f5;
			&:last-child{
				border-bottom:0;
			}
			.peoimg{
				width:100rpx;
				height:100rpx;
				border-radius: 50%;
				flex-shrink: 0;
				margin-right:24rpx;
			}
			.peoright{
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex:1;
				.pr_left{
					.name{
						font-size:28rpx;
						color:#333;
						margin-bottom:15rpx;
					}
					.pr_post{
						font-size:26rpx;
						color:#666;
						margin-bottom:10rpx;
					}
					.pr_text{
						font-size:26rpx;
						color:#999;
						margin-bottom:10rpx;
					}
				}
				.pr_phone{
					width:42rpx;
					height:40rpx;
				}
			}
		}
	}
</style>
