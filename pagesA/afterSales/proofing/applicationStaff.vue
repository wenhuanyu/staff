<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="fllow_form">
			<view class="key">指派负责人<span>*</span></view>
			<view class="form_right" @click="toSelectStaff">
				<view :class="staffObj ? 'valueActive' : '' ">{{staffObj ? staffObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head key">备注<span>*</span></view>
			<textarea v-model="desc" maxlength="-1" class="textself" placeholder="备注" placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(submit)">确定</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { netAssignStaff, netApplicatonTestStaff, netDepotRepairAssign } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				id:'',
				desc:'',
				type:1,   //1指派负责人   2指派测试负责人    3返厂维修指派
			}
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		onLoad(options) {
			this.$store.commit('STAFFOBJ',null)
			this.id = options.id
			this.type = options.type
		},
		onUnload() {
			this.$store.commit('STAFFOBJ',null)
		},
		methods:{
			//去选择 指派员工
			toSelectStaff() {
				uni.navigateTo({
					url:'/pages/template/relation_staff'
				})
			},
			submit() {
				if(!this.staffObj){
					uni.showToast({
						title:'请选择指派人',
						icon:'none'
					})
					return
				}
				if(!this.desc){
					uni.showToast({
						title:'请填写备注',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					staff_id: this.staffObj.id,
					desc:this.desc
				}
				if(this.type == 1) {
					netAssignStaff(params).then(res=>{
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
				}else if(this.type == 2){
					netApplicatonTestStaff(params).then(res=>{
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
				}else if(this.type == 3) {
					//售后服务  返厂维修 指派
					netDepotRepairAssign(params).then(res=>{
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
		.nameinput{
			width:500rpx;
		}
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
			color:#666;
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
</style>
