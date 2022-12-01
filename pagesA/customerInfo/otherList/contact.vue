<template>
	<view class="">
		<view class="cust_item_con" v-for="(item,index) in contact_list" :key="index">
			<view class="contact_info" @click="jumpDetail(item.id)">
				<view class="con-name">{{item.name}}</view>
				<view class="con-mobile">{{item.new_mobile}}</view>
			</view>
			<view class="contact_phone" @click="selectPhone(item.mobile)">
				<image :src="BASE_IMG_URL+'/index/phone-call.png'" class="phoneimg" ></image>
				呼叫
			</view>
		</view>
	</view>
</template>

<script>
	import{ netContact } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				customerid:'',
				page:1,
				totalPage:1,
				contact_list:[],
			}
		},
		onLoad(options) {
			this.customerid = options.id
		},
		onShow() {
			this.getContactList()
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++
				this.getContactList()
			}
		},
		methods:{
			//联系人列表
			getContactList() {
				let params = {
					customer_id: this.customerid,
					page:1,
					limit:30
				}
				netContact(params).then(res => {
					this.contact_list = res.data
				})
			},
			//联系人 详情
			jumpDetail(id) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contact/contactDetail?id='+id
				})
			},
			//呼叫 联系人
			selectPhone(mobile) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(mobile, true);
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cust_item_con {
		padding: 15rpx 24rpx;
		width:690rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#fff;
		margin:24rpx auto 0;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 10rpx;
		.contact_info {
			flex: 1;
			padding: 10rpx 0;
			.con-name{
				font-size:26rpx;
				color:#999;
			}
			.con-mobile{
				font-size:26rpx;
				color:#999;
			}
		}
		.contact_phone{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			.phoneimg {
				width:50rpx;
				height:50rpx;
				margin-right:24rpx;
			}
		}
		
	}
</style>
