<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp" v-if="workorderInfo.workorder_type == '生产工单'">
				<view class="ope_li" v-if="workorderInfo.process >= 0 && workorderInfo.status == 2 && workorderInfo.is_revoke == 1" @click="toChexiaoWork">
					<image :src="BASE_IMG_URL+'/index/chexiao.png'" class="opeimg" ></image>
					<view class="litext">撤销工单</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.process == 0 && workorderInfo.status == 1 && workorderInfo.is_revoke == 1" @click="toEditWork">
					<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg" ></image>
					<view class="litext">修改工单</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.process != 9 && workorderInfo.status != 3 && workorderInfo.is_revoke == 1" @click="toAssign(2)">
					<image :src="BASE_IMG_URL+'/index/zhuangpai.png'" class="opeimg" ></image>
					<view class="litext">转派</view>
				</view>
				<view class="ope_li" v-if="workorderInfo.status != 9 && workorderInfo.status != 3 && workorderInfo.is_leader == 1" @click="toRevoke">
					<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg" ></image>
					<view class="litext">终止工单</view>
				</view>
			</view>
			<view class="" v-if="workorderInfo.workorder_type == '上门安装' || workorderInfo.workorder_type == '上门维修' || workorderInfo.workorder_type == '配件安装'">
				<view class="ope_warp" v-if="workorderInfo.status != 9 && workorderInfo.status != 3">
						<view class="ope_li"  @click="toLookProgram">
							<image :src="BASE_IMG_URL+'/index/jiejue.png'" class="opeimg" ></image>
							<view class="litext">解决方案</view>
						</view>
					<!-- 工程师 -->
						<view class="ope_li" v-if="workorderInfo.process >= 4 && workorderInfo.status != 3 && workorderInfo.is_operation == 1" @click="toDown">
							<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
							<view class="litext">下载配件报价单</view>
						</view>
					<!-- 助理 -->
						<view class="ope_li" v-if="workorderInfo.process >= 4 && workorderInfo.is_revoke != 1 && workorderInfo.is_operation != 1 && workorderInfo.is_leader == 1" @click="toDown">
							<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
							<view class="litext">下载配件报价单</view>
						</view>
					<!-- 老大 -->
						<view class="ope_li" v-if="workorderInfo.process != 9 && workorderInfo.status != 3 && workorderInfo.is_leader == 1 && workorderInfo.is_revoke == 1" @click="toAssign(2)">
							<image :src="BASE_IMG_URL+'/index/zhuangpai.png'" class="opeimg" ></image>
							<view class="litext">转派</view>
						</view>
						<view class="ope_li" v-if="workorderInfo.process >= 4 && workorderInfo.is_revoke == 1 && workorderInfo.is_operation != 1 && workorderInfo.is_leader != 1" @click="toDown">
							<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
							<view class="litext">下载配件报价单</view>
						</view>
						<view class="ope_li" v-if="workorderInfo.process >= 0 && workorderInfo.status == 2 && workorderInfo.is_revoke == 1" @click="toChexiaoWork">
							<image :src="BASE_IMG_URL+'/index/chexiao.png'" class="opeimg" ></image>
							<view class="litext">撤销工单</view>
						</view>
						<view class="ope_li" v-if="workorderInfo.process == 0 && workorderInfo.status == 1 && workorderInfo.is_revoke == 1" @click="toEditWork">
							<image :src="BASE_IMG_URL+'/index/sheji_edit.png'" class="opeimg" ></image>
							<view class="litext">修改工单</view>
						</view>
						<view class="ope_li" v-if="workorderInfo.status != 9 && workorderInfo.status != 3 && workorderInfo.is_leader == 1" @click="toRevoke">
							<image :src="BASE_IMG_URL+'/index/ht-zhongzhi.png'" class="opeimg" ></image>
							<view class="litext">终止工单</view>
						</view>
				</view>
				<view class="ope_warp" v-if="workorderInfo.status == 3">
					<view class="ope_li" @click="toAuto" v-if="workorderInfo.is_autograph == 0 && workorderInfo.process > 2 && workorderInfo.is_operation == 1">
						<image :src="BASE_IMG_URL+'/index/quota_edit.png'" class="opeimg" ></image>
						<view class="litext">客户签名</view>
					</view>
					<view class="ope_li" @click="toDown" v-if="(workorderInfo.is_financial == 1 || workorderInfo.is_leader == 1) && workorderInfo.workorder_type != '上门安装'">
						<image :src="BASE_IMG_URL+'/index/ht-xiazai.png'" class="opeimg" ></image>
						<view class="litext">下载配件报价单</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			workorderInfo:{
				type:Object,
				default:{}
			},
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
			//指派
			toAssign(type) {
				this.close()
				this.$emit('toAssignP',type)
			},
			//录入产品标号
			toInputNumber(type) {
				this.close()
				this.$emit('toInputNumberP',type)
			},
			//添加物流信息
			toAddlogistics() {
				this.close()
				this.$emit('toAddlogisticsP')
			},
			//终止工单
			toRevoke() {
				this.close()
				this.$emit('toRevokeP')
			},
			//修改工单
			toEditWork() {
				this.close()
				this.$emit('toEditWorkP')
			},
			//撤销工单
			toChexiaoWork() {
				this.close()
				this.$emit('toChexiaoWorkP')
			},
			//解决方案
			toLookProgram() {
				this.close()
				this.$emit('toLookProgramP')
			},
			//下载
			toDown() {
				this.close()
				this.$emit('toDownP')
			},
			//签名
			toAuto() {
				this.close()
				this.$emit('toAutoP')
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
