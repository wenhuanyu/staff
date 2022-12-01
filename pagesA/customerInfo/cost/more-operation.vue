<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" v-if="info.is_edit == 1 && info.is_operation == 1" @click="toEdit">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg" ></image>
					<view class="litext">修改费用</view>
				</view>
				<view class="ope_li" v-if="info.check_status != 2 && info.check_status != 3 && info.is_operation == 1" @click="toTermination">
					<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg" ></image>
					<view class="litext">终止费用</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netTerminationCost } from '@/api/api.js'
	
	export default{
		props:{
			showPop:{
				type:Boolean,
				default:false
			},
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
			close() {
				this.$refs.popup.close()
			},
			//修改费用
			toEdit() {
				let customerid = this.info.customer ? this.info.customer.id : ''
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost?id='+this.info.id+'&customerid='+customerid+'&relationid='+this.info.relation_id,
					success:()=>{
						this.close()
					}
				})
			},
			//终止
			toTermination() {
				uni.showModal({
					title:'提示',
					content:'请确认是否终止费用审批？',
					success:(res)=>{
						if(res.confirm){
							netTerminationCost({id:this.info.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									this.close()
									this.$emit('zhongzhiSuccess')
								},2000)
							})
						}
					}
				})
			},
			//添加审批人
			toAddapprover() {
				this.showImg = false
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/approver?id='+this.info.id+'&type=consume',
					success:()=>{
						this.close()
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
