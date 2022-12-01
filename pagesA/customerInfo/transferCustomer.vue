<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="fllow_form">
			<view class="key">接受对象<span>*</span></view>
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
	import { netTransKehu } from '@/api/api.js'
	
	export default{
		data(){
			return{
				id:'',
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
			this.id = options.id
			uni.setNavigationBarTitle({
				title: options.name
			})
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
						title:'请选择接受对象',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					staff_id:this.staffObj.id
				}
				netTransKehu(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.redirectTo({
							url:"/pages/index/myCustomer/index"
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
