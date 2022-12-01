<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" @click="cancelExamine" v-if="info.check_status == 0 || info.check_status == 1">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg" ></image>
					<view class="litext">撤回审核</view>
				</view>
				<view class="ope_li"  @click="editPayment"  v-if="(info.check_status == 4 || info.check_status == 3)">
					<image :src="BASE_IMG_URL+'/index/hetong-huikuan.png'" class="opeimg" ></image>
					<view class="litext">编辑回款</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
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
				noClick:true,    //防止  重复点击
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
			cancelExamine() {
				this.$emit('cancelExamineP')
				this.close()
			},
			editPayment() {
				this.$emit('editPaymentP')
				this.close()
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
