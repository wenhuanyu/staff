<template>
	<view class="warpbox">
		<view class="topbox">
			<image :src="info.staff && info.staff.img?info.staff.img:BASE_IMG_URL+'/headImg.png'" class="staffimg"></image>
			<view class="ribox">
				<view class="ritop">
					<view class="staffname">{{info.staff && info.staff.name ?info.staff.name:''}}</view>
					<view class="time">{{info.createtime}}</view>
				</view>
				<view class="riaddress" @click="toLookLocation">{{info.location?info.location:''}}</view>
			</view>
		</view>
		<view class="con_text">
			<view class="label">拜访客户：</view>
			<view class="right_text" @click="toMore(info.customer.id)">
				{{info.customer && info.customer.name}}
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<form-item v-if="listForm" :listForm="listForm" :isEdit="false"></form-item>
	</view>
</template>

<script>
	import { netGetSignDetail, netSetForm  } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			formItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				info:{},
				listForm:null
			}
		},
		onLoad(options) {
			this.id = options.id
			//获取详情
			this.getDetail()
		},
		methods:{
			getForm() {
				netSetForm({type: 'signin'}).then(res => {
					let arr = res.data.data
					this.listForm = this.handleFormDefaultValue(arr,this.info)
				})
			},
			getDetail(){
				netGetSignDetail({id:this.id}).then(res=>{
					this.info = res.data
					this.getForm()
				})
			},
			toPrevieimg(files,index) {
				uni.previewImage({
					current:index,
					urls: files
				})
			},
			toMore(id) {
				uni.navigateTo({
					url: '/pagesA/customerInfo/myCustomer/customerDetail?customerid='+id
				})
			},
			//查看详情
			toLookLocation() {
				uni.openLocation({
					latitude:Number(this.info.lat),
					longitude:Number(this.info.lng),
					name:this.info.location
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.warpbox{
		padding:24rpx 0;
		background:#fff;
		.topbox{
			padding:0 30rpx;
			display: flex;
			justify-content: flex-start;
			.staffimg{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				margin-right:24rpx;
			}
			.ribox{
				flex-shrink: 0;
				flex:1;
				.ritop{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.staffname{
						font-size:24rpx;
						color:#333;
					}
					.time{
						font-size:24rpx;
						color:#666;
					}
				}
				.riaddress{
					font-size:24rpx;
					color:$uni-text-color;
					margin-top:24rpx;
				}
			}
		}
	}
	.con_text{
		margin-top:24rpx;
		display: flex;
		justify-content: space-between;
		font-size:24rpx;
		padding:24rpx;
		border-bottom:1rpx solid #f5f5f5;
		border-top:1rpx solid #f5f5f5;
		color:#999;
		.label{
			font-size:24rpx;
			color:#666;
		}
		.right_text{
			color:$uni-text-color;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}
</style>