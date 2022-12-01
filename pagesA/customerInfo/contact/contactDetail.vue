<template>
	<view>
		<form-item v-if="listForm" :listForm="listForm" :isEdit="false"></form-item>
		<view class="bot_warp">
			<view class="bot_btn delebtn" @click="toDel">删除</view>
			<view class="bot_btn" @click="toEdit">编辑信息</view>
		</view>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem.vue'
	import { netConcatDetailInfo, netSetForm, netDelConcat } from '@/api/api.js'
	import { mapState } from 'vuex'
	
	export default{
		components:{
			formItem
		},
		data() {
			return{
				listForm:null,
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getInfo()
		},
		methods:{
			toEdit() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contact/editContact?id='+this.id
				})
			},
			//删除联系人
			toDel() {
				uni.showModal({
					title:'提示',
					content:'请确认是否删除联系人?',
					success:(res)=>{
						if(res.confirm){
							netDelConcat({id:this.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},2000)
							})
						}
					}
				})
			},
			//获取联系人信息
			getInfo() {
				netConcatDetailInfo({id:this.id}).then(res=>{
					this.info = res.data
					uni.setNavigationBarTitle({
						title:res.data.name
					})
					this.getForm()
				})
			},
			getForm() {
				let params = {
					type: 'contacts'
				}
				netSetForm(params).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bot_warp{
		display: flex;
		justify-content: space-around;
		align-items: center;
		width:750rpx;
		height:100rpx;
		margin-top:50rpx;
		.bot_btn{
			width:240rpx;
			height:70rpx;
			border-radius: 40rpx;
			text-align: center;
			line-height: 70rpx;
			font-size:26rpx;
			color:#fff;
			background:$uni-btn-bg-color;
		}
		.delebtn{
			line-height: 68rpx;
			background: #FFFFFF;
			border: 1px solid #999999;
			color:#999;
		}
	}
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 26rpx;
			color: #333;
		}
	}
</style>
