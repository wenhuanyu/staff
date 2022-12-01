<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" @click="toCall" v-if="info.is_operation == 1 || info.is_examine == 1">
					<image :src="BASE_IMG_URL+'/index/quota_call.png'" class="opeimg" ></image>
					<view class="litext">拨打电话</view>
				</view>
				<view class="ope_li" @click="toEditquote(1)" v-if="info.is_operation == 1">
					<image :src="BASE_IMG_URL+'/index/quota_edit.png'" class="opeimg" ></image>
					<view class="litext">编辑</view>
				</view>
				<view class="ope_li" @click="toTurnto" v-if="status != 9 && info.check_status != 3 && info.is_operation == 1">
					<image :src="BASE_IMG_URL+'/index/quota_zhuang.png'" class="opeimg" ></image>
					<view class="litext">转为合同</view>
				</view>
				<view class="ope_li" @click="downFile" v-if="status != 9 && (info.is_operation == 1 || info.is_examine == 1)">
					<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
					<view class="litext">下载文档</view>
				</view>
				<view class="ope_li" @click="toVoid" v-if="status != 9 && info.is_operation == 1">
					<image :src="BASE_IMG_URL+'/index/quota_zuofei.png'" class="opeimg" ></image>
					<view class="litext">作废</view>
				</view>
				<view class="ope_li" @click="toEditquote(2)">
					<image :src="BASE_IMG_URL+'/index/ht-fuzhi.png'" class="opeimg" ></image>
					<view class="litext">复制</view>
				</view>
				<view class="ope_li" @click="toAddFile">
					<image :src="BASE_IMG_URL+'/index/ht-fujian.png'" class="opeimg" ></image>
					<view class="litext">上传附件</view>
				</view>
				<view class="ope_li" @click="toSendEmail">
					<image :src="BASE_IMG_URL+'/index/ht-youjian.png'" class="opeimg" ></image>
					<view class="litext">发送邮件</view>
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
			status:{
				type:Number,
				default:null
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
			//拨打电话
			toCall(){
				this.$refs.popup.close()
				this.$emit('toCallP')
			},
			//编辑报价单
			toEditquote(type) {
				this.$refs.popup.close()
				this.$emit('toEditquoteP',type)
			},
			//转为合同
			toTurnto() {
				this.$refs.popup.close()
				this.$emit('toTurntoP')
			},
			//下载
			downFile() {
				this.$refs.popup.close()
				this.$emit('downFileP')
			},
			//作废
			toVoid() {
				this.$refs.popup.close()
				this.$emit('toVoidP')
			},
			//上传附件
			toAddFile() {
				this.$refs.popup.close()
				this.$emit('toAddFileP')
			},
			//发送邮件
			toSendEmail() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/send_mail',
					success:()=>{
						this.$refs.popup.close()
					}
				})
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
