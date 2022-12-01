<template>
	<view class="">
		<view class="inp_warp">
			<view class="inp_title key">负责人<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj.id ? 'valueActive' : '' ">{{staffObj.name ? staffObj.name : '点击选择负责人'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSubmit)">
			保存
		</view>
	</view>
</template>

<script>
	import { netCluesTrans } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick: true, //防止  重复点击
				id:'',
			}
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		onLoad(options) {
			this.id = options.id
			this.clearRemindlist()
		},
		methods:{
			sureSubmit() {
				if(!this.staffObj.id){
					uni.showToast({
						title:'请选择负责人',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					staff_id:this.staffObj.id
				}
				netCluesTrans(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.redirectTo({
							url:'/pagesB/cluesManagement/cluesManagement'
						})
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
		}
	
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
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
</style>