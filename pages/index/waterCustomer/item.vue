<template>
	<view>
		<view class="cusitem" v-for="(item,index) in list" :key="index" @click.stop="toDetail(item)">
			<view class="custop">
				<view class="cusname">{{item.name}}</view>
			</view>
			<view class="cusInfo">
				<view class="cusLeft">
					<view class="custext">联系人: {{item.contacts?item.contacts.name:''}}</view>
					<view class="custext">联系电话: {{item.contacts?item.contacts.mobile:''}}</view>
					<view class="custext">地址: {{item.address?item.address:''}}</view>
				</view>
			</view>
			<view class="botwarp" @click.stop.prevent>
				<view class="cusbot" @click.stop="toReceive(item)"><image :src="BASE_IMG_URL + '/index/get.png'"></image>领取客户</view>
				<view class="cusbot" @click.stop="transferCustomer(item)"><image :src="BASE_IMG_URL + '/index/playerGroup.png'" ></image>分配客户</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { netReceiveKehu } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				level:3,
			}
		},
		created() {
		},
		methods:{
			toCall(item) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: item.contacts.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: item.contacts.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(item.contacts.mobile, true);
				// #endif
			},
			toNavigate(item) {
				uni.openLocation({
					latitude: item.lat,
					longitude: item.lng,
					address: item.address,
					name: item.address,
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			toReceive(item) {
				uni.showModal({
					title:'是否确定领取公池客户',
					content:'领取后长时间未跟进，客户将自动转为公共客户',
					success:(res)=>{
						if(res.confirm){
							netReceiveKehu({customer_id:item.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									this.$emit('receiveSuccess')
								},2000)
							})
						}
					}
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+item.id+'&type=2'
				})
			},
			//分配客户
			transferCustomer(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/transferCustomer?id='+item.id+'&name=分配客户'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cusitem{
		width:690rpx;
		background:#fff;
		border-radius: 20rpx;
		box-shadow: 1rpx 1rpx 8rpx 3rpx rgba(0,0,0,0.05);
		padding:30rpx;
		margin:0 auto 24rpx;
		.custop{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cusname{
				font-size: 26rpx;
				color: #666666;
				font-size:32rpx;
				width:600rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.cuslevel{
				width:208rpx;
				flex-shrink: 0;
			}
		}
		.cusInfo{
			padding:20rpx 0;
			margin:20rpx 0;
			border-bottom:1rpx solid #EDEDED;
			border-top:1rpx solid #EDEDED;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cusLeft{
				flex:1;
				margin-right:24rpx;
				.custext{
					font-size: 26rpx;
					color: #999999;
					margin-bottom:15rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
			.cusRight{
				flex-shrink: 0;
				text-align: center;
				.phonebox{
					width:90rpx;
					height:90rpx;
					border-radius: 50%;
					background:#0287FF;
					display: flex;
					justify-content: center;
					align-items: center;
					.phoneimg{
						width:46rpx;
						height:46rpx;
					}
				}
				.addressimg{
					width:30rpx;
					height:36rpx;
					margin:30rpx auto 0;
				}
			}
		}
		.botwarp{
			display: flex;
			justify-content: center;
			align-items: center;
			.cusbot{
				font-size: 24rpx;
				color: $uni-text-color;
				text-align: center;
				width:50%;
				border-right:1rpx solid #EDEDED;
				&:last-child{
					border-right:0;
				}
				image{
					margin-right: 10rpx;
					width: 25rpx;
					height: 27rpx;
				}
			}
		}
	}
</style>
