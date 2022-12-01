<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp" v-if="workorderInfo.status != 3 && workorderInfo.status != 9">
				<!-- 工程师 -->
				<!-- 老大 业务助理 -->
				<view class="ope_li" v-if="workorderInfo.status == 1 && workorderInfo.is_leader == 1" @click="toAssign(2)">
					<image :src="BASE_IMG_URL+'/index/ht-fuzhi.png'" class="opeimg" ></image>
					<view class="litext">转派</view>
				</view>
				<!-- 老大 -->
				<view class="ope_li" v-if="workorderInfo.process < 3 && (workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1)" @click="toChexiaoWork">
					<image :src="BASE_IMG_URL+'/index/chexiao.png'" class="opeimg" ></image>
					<view class="litext">撤销工单</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.status == 1 && (workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1)" @click="toEditWork">
					<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg" ></image>
					<view class="litext">修改工单</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.status != 9 && workorderInfo.status != 3 && workorderInfo.is_revoke == 1" @click="toRevoke">
					<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg" ></image>
					<view class="litext">终止工单</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netAcceptWorkOrder, netStartWorkOrder, netCompleteWorkorder } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			workorderInfo:{
				type:Object,
				default:{}
			},
			lat:{
				type:Number/String,
				default:null,
			},
			lng:{
				type:Number/String,
				default:null
			},
			location:{
				type:String,
				default:''
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		created() {
			
		},
		methods:{
			open() {
				this.$refs.popup.open()
			},
			//指派
			toAssign(type) {
				uni.navigateTo({
					url:'/pagesA/afterSales/assign_staff?workorderid='+this.workorderInfo.id+'&type='+type,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//撤销工单
			toChexiaoWork() {
				uni.navigateTo({
					url:'/pagesA/afterSales/chexiaoWork?id='+this.workorderInfo.id,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			//修改工单
			toEditWork() {
				if(this.workorderInfo.workorder_type == '配件配送'){
					uni.navigateTo({
						url:'/pagesA/afterSales/partsWorkorder/parts_distribution?id='+this.workorderInfo.id,
						success:()=>{
							this.$refs.popup.close()
						}
					})
				}else{
					uni.navigateTo({
						url:'/pages/index/orderSettlement/template/product_delivery?id='+this.workorderInfo.id+'&type='+this.workorderInfo.workorder_type,
						success:()=>{
							this.$refs.popup.close()
						}
					})
				}
			},
			//撤销工单
			toRevoke() {
				uni.navigateTo({
					url:'/pagesA/afterSales/revokeWork?id='+this.workorderInfo.id,
					success:()=>{
						this.$refs.popup.close()
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
