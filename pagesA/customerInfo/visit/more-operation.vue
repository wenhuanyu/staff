<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp" v-if="visitInfo.process != 3 && visitInfo.status != 3">
				<view class="ope_li" v-if="visitInfo.event_type && isPhoneTask" @click="toCall">
					<image :src="BASE_IMG_URL+'/index/quota_call.png'" class="opeimg" ></image>
					<view class="litext">拨打电话</view>
				</view>
				<view class="ope_li" v-if="visitInfo.is_revoke == 1 && visitInfo.process > 0 && visitInfo.process != 4"  @click="toChexiao">
					<image :src="BASE_IMG_URL+'/index/chexiao.png'" class="opeimg" ></image>
					<view class="litext">撤销任务</view>
				</view>
				<view class="ope_li" v-if="visitInfo.is_revoke == 1 && visitInfo.process == 0"  @click="toEditEvent">
					<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg" ></image>
					<view class="litext">修改任务</view>
				</view>
				<view class="ope_li" v-if="visitInfo.process != 4 && visitInfo.is_revoke == 1" @click="toRevoke">
					<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg" ></image>
					<view class="litext">终止任务</view>
				</view>
				<view class="ope_li" v-if="visitInfo.process == 0 && visitInfo.is_operation == 1" @click="toAssignStaff">
					<image :src="BASE_IMG_URL+'/index/zhuangpai.png'" class="opeimg" ></image>
					<view class="litext">指派</view>
				</view>
				<view class="ope_li" @click="phoneRepair" v-if="visitInfo.relation_type != 'event' && visitInfo.is_operation == 1">
					<image :src="BASE_IMG_URL+'/index/quota_edit.png'" class="opeimg" ></image>
					<view class="litext">电话维修</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			visitInfo:{
				type:Object,
				default:{}
			},
			showPop:{
				type:Boolean,
				default:false
			},
			isPhoneTask:{
				type:Boolean,
				default:false
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
			//撤销任务
			toChexiao() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/chexiaoVisit?id='+this.visitInfo.id,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//修改任务
			toEditEvent() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/editVisit?id='+this.visitInfo.id,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//撤销任务
			toRevoke() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/revokeVisit?id='+this.visitInfo.id,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			// 指派
			toAssignStaff() {
				uni.navigateTo({
					url:'/pagesA/afterSales/assign_staff?id='+this.visitInfo.id+'&mode=9',
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//电话维修
			phoneRepair() {
				uni.showModal({
					title:'提示',
					content:'请确认是否电话联系客户?',
					cancelText:'未联系',
					confirmText:'已联系',
					complete:(res)=>{
						if(res.confirm){
							uni.navigateTo({
								url:'/pagesA/customerInfo/visit/phoneRepair?id='+this.visitInfo.id,
								success:()=>{
									this.$refs.popup.close()
								}
							})
						}
					}
				})
			},
			//签到
			toSign(type) {
				this.$emit('toSignP',type)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ope_warp{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding:30rpx 0;
		.warpbox{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
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
