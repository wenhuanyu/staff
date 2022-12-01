<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp" v-if="info.status != 3">
				<!-- 师傅 -->
				<view class="ope_li" @click="toDownFile(2)" v-if="info.is_leader == 1 || info.is_operation == 1 || info.is_revoke == 1">
					<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
					<view class="litext">下载维修单</view>
				</view>
				<view class="ope_li" @click="toDownFile(1)" v-if="info.process == 4 && (info.is_leader == 1 || info.is_revoke == 1 || info.is_operation == 1)">
					<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
					<view class="litext">下载配件报价单</view>
				</view>
				<!-- 老大 -->
				<view class="ope_li" v-if="info.process == 0 && info.is_revoke == 1" @click="toRepartEdit">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg" ></image>
					<view class="litext">修改任务</view>
				</view>
				
				<!-- 助理 -->
				<view class="ope_li" v-if="info.process != 9 && info.is_leader == 1" @click="toApplication">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg" ></image>
					<view class="litext">转派</view>
				</view>
				<view class="ope_li" @click="toRevoke" v-if="info.process != 9 && info.is_leader == 1">
					<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg" ></image>
					<view class="litext">终止</view>
				</view>
				<view class="ope_li" @click="toChexiao" v-if="info.process > 0 && info.process < 4 && info.is_leader == 1">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg" ></image>
					<view class="litext">撤销</view>
				</view>
			</view>
			<view class="ope_warp" v-if="info.status == 3">
				<view class="ope_li" v-if="info.is_financial == 1 || info.is_leader == 1 || info.is_revoke == 1" @click="toDownFile(2)">
					<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
					<view class="litext">下载维修单</view>
				</view>
				<view class="ope_li" v-if="info.is_leader == 1 || info.is_revoke == 1" @click="toDownFile(1)">
					<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
					<view class="litext">下载配件报价单</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			info:{
				type:Object,
				default:{}
			},
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		methods:{
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			//已到货
			toComplete() {
				this.$emit('toCompleteP')
			},
			//下载
			toDownFile(type) {
				this.close()
				this.$emit('toDownFileP',type)
			},
			//重新编辑 任务
			toRepartEdit() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/edit?id='+this.info.id,
					success:()=>{
						this.close()
					}
				})
			},
			//指派负责人
			toApplication() {
				uni.navigateTo({
					url:'/pagesA/afterSales/proofing/applicationStaff?id='+this.info.id+'&type=3',
					success:()=>{
						this.close()
					}
				})
			},
			//终止 任务
			toRevoke() {
				uni.navigateTo({
					url:'/pagesA/afterSales/revokeWork?id='+this.info.id+'&type=1',
					success:()=>{
						this.close()
					}
				})
			},
			//撤销  任务
			toChexiao() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/chexiaoDepot?id='+this.info.id,
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
