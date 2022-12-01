<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="fllow_form">
			<view class="key">负责人<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="button" @click="$noMultipleClicks(sureTransfer)">确定</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { netTransCustomerAll } from '@/api/api.js'
	
	export default{
		data(){
			return{
				ids:'',
				noClick:true,    //防止  重复点击
			}
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		onUnload() {
			this.$store.commit('STAFFOBJ',null)
		},
		onLoad(options) {
			this.ids = options.ids
		},
		methods:{
			toSelectStaff() {
				uni.navigateTo({
					url:'/pages/template/relation_staff?isDepart=14'
				})
			},
			sureTransfer() {
				if(!this.staffObj){
					uni.showToast({
						title:'请选择负责人',
						icon:'none'
					})
					return
				}
				let params = {
					ids:this.ids,
					staff_id:this.staffObj.id
				}
				netTransCustomerAll(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					uni.setStorageSync('removeSeas',true)
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			align-items: center;
		}
	}
</style>
