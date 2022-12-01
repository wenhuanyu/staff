<template>
	<view class="info_detail">
		<view class="info_item">
			<form-item v-if="listForm" :listForm="listForm" :isEdit="false"></form-item>
		</view>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem.vue'
	import { netPrevCustomer, netSetForm } from '@/api/api.js'
	import { mapState } from 'vuex'
	
	export default{
		components:{
			formItem
		},
		created() {
		},
		data() {
			return{
				listForm:null,
				parentName:'',
				customerid:'',
				info:{},
			}
		},
		methods:{
			init(id,info) {
				this.customerid = id
				this.info = info
				this.getForm()
				this.getDefaultKehulist()
			},
			//默认客户
			getDefaultKehulist() {
				if(this.info.parent_id == 0){
					this.parentName = ''
					return
				}
				netPrevCustomer({id:this.info.parent_id}).then(res => {
					this.parentName = res.data.data[0].name
				})
			},
			getForm() {
				netSetForm({type:'customer'}).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
				})
			},
			jumpMap() {
				uni.openLocation({
					latitude: this.info.lat,
					longitude: this.info.lng,
					address: this.info.address+this.info.address_detail,
					name: this.info.address+this.info.address_detail,
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			toPriimg(arr,index) {
				let data = []
				arr.forEach(ele=>{
					data.push(ele.url)
				})
				uni.previewImage({
					current:index,
					urls:data
				})
			},
			//拨打电话
			toCall() {
				let mobile;
				if(this.info.contacts.region == 1) {
					mobile = this.info.contacts.mobilecode + this.info.contacts.mobile
				}else{
					mobile = this.info.contacts.mobile
				}
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: this.info.contacts.mobile,
					code: this.info.contacts.mobilecode,
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
			}
		}
	}
</script>

<style lang="scss" scoped>
.info_detail {
	background:#fff;
	margin:24rpx auto;
	border-radius: 20rpx;
	.basic_head {
		display: flex;
		padding: 30rpx 24rpx 30rpx;
		:last-child {
			font-weight: 700;
			margin-left: 8rpx;
		}
	}
	.basic_main {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		line-height: 40rpx;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		:first-child {
			color: #666;
			flex-shrink: 0;
			margin-right:15rpx;
		}
		.imgbox{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			.imgself{
				width:110rpx;
				height:110rpx;
				border-radius: 5rpx;
				margin-left:20rpx;
				margin-bottom:20rpx;
			}
		}
	}
}
</style>
