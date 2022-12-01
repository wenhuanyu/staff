<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" @click="toCancel" v-if="info.check_status == 1">
					<image :src="BASE_IMG_URL+'/index/chexiao.png'" class="opeimg" ></image>
					<view class="litext">撤销审批</view>
				</view>
				<view class="ope_li" v-if="info.check_status == 3 || info.check_status == 4" @click="toEdit">
					<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg" ></image>
					<view class="litext">修改审批</view>
				</view>
				<view class="ope_li" v-if="info.check_status != 2 && info.check_status != 3" @click="toTrimation">
					<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg" ></image>
					<view class="litext">终止审批</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netCancelWorkExamine, netTerminationApprove } from '@/api/api.js'
	
	export default{
		props:{
			info:{
				type:Object,
				default:{}
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			open() {
				this.$refs.popup.open()
			},
			//撤销审批
			toCancel() {
				netCancelWorkExamine({id:this.info.id}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.$refs.popup.close()
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			},
			toEdit() {
				this.$refs.popup.close()
				this.$emit('toAEdit')
			},
			//zhongzhi
			toTrimation() {
				uni.showModal({
					title:'提示',
					content:'请确认是否终止审批？',
					success:(res)=>{
						if(res.confirm){
							netTerminationApprove({id:this.info.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									this.$refs.popup.close()
									this.$emit('zhongzhiSuccess')
								},2000)
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.ope_warp{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding:30rpx 0;
		.ope_li{
			width:33.33%;
			margin-bottom:24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.opeimg{
				width:38rpx;
				height:38rpx;
				margin-bottom:10rpx;
			}
			.litext{
				font-size:26rpx;
				color:#999999;
				text-align: center;
			}
		}
	}
</style>
