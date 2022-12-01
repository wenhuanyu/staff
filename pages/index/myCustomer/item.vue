<template>
	<view>
		<view class="cusitem" :class="type == 'list' ? '' : 'cusIndexitem'" v-for="(item,index) in list" :key="index"
			@tap.stop="toDetail(item)">
			<view class="cus_top">
				<view class="cus_name" :class="{'cus_name_a':item.is_operation == 1}">{{item.name}}</view>
				<view class="fir_sta"
					v-if="type == 'list'">
					{{item.follow}}</view>
			</view>
			<view class="cus_info">
				<view class="cus_info_top">
					<view class="info_right">
						<view class="info_fir" :class="type == 'list' ? 'info_fir_margin' : ''">
							<view class="fir_name">
								联系人：{{item.contacts ? item.contacts.name : ''}}</view>
						</view>
						<view class="info_fir" :class="type == 'list' ? 'info_fir_margin' : ''"
							v-if="type == 'list'">
							<view class="fir_name">电话：{{item.contacts ? item.contacts.mobile : ''}}</view>
						</view>
						<view class="info_fir" :class="type == 'list' ? 'info_fir_margin' : ''"
							v-if="type == 'list'">
							<view class="fir_name">地址：{{item.address?item.address:''}}</view>
						</view>
						<view class="info_fir">
							<view class="fir_name">最后跟进时间：{{item.last_time?item.last_time:''}}</view>
						</view>
					</view>
					<view class="info_left"
						v-if="item.owner_staff && type == 'list'">
						<image :src="item.owner_staff.img" class="cusimg"></image>
						<view class="staffname">{{item.owner_staff.name}}</view>
					</view>
				</view>
				<view class="cus_info_bot" v-if="type == 'list'">
					<view class="bot_con">
						销售总额:￥{{item.c_money ? item.c_money : 0}}</view>
					<view class="bot_con">
						回款总额:￥{{item.receivables_total && item.receivables_total.r_money ? item.receivables_total.r_money : 0}}
					</view>
				</view>
			</view>
			<view class="cus_btn" v-if="item.is_operation == 1" @tap.stop.prevent>
				<view class="btn_fir" @tap.stop="toCall(item)">
					<image :src="BASE_IMG_URL+'/index/phone-call.png'" class="btnimg"></image>呼叫
				</view>
				<view class="btn_fir" @tap.stop="toNavigate(item)">
					<image :src="BASE_IMG_URL+'/index/local.png'" class="btnimg"></image>导航
				</view>
				<view class="btn_fir" v-if="item.is_operation == 1" @click="toMerge(item)">
					<image  :src="BASE_IMG_URL+'/index/customer_hebing.png'" class="btnimg"></image>合并
				</view>
				<view class="btn_fir" v-if="item.is_operation == 1" @tap.stop="toAdd(item)">
					<image :src="BASE_IMG_URL+'/index/add.png'" class="btnimg"></image>新建
				</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>

		<!-- 底部弹窗 -->
		<add-file-pop ref="filepopChild" :info="newBuildFileInfo"></add-file-pop>
	</view>
</template>

<script>
	import addFilePop from './components/botPop.vue'
	import {
		BASE_IMG_URL
	} from '@/api/http.js'
	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			addFilePop
		},
		props: {
			list: {
				type: Array,
				default: []
			},
			type: {
				type: String,
				default: 'list'
			}
		},
		data() {
			return {
				BASE_IMG_URL: BASE_IMG_URL,
				//底部弹窗
				newBuildFileInfo: null,
			}
		},
		created() {
		},
		methods: {
			toCall(item) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: item.contacts.mobile,
					code: '+86',
					showDingCall: true,
					success: () => {
						uni.navigateTo({
							url: '/pagesA/customerInfo/visit/add_phone_followup?id=' + item.id +
								'&name=' + item.contacts.name
						})
					}
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.makePhoneCall({
					phoneNumber: item.contacts.mobile,
					success: (res) => {
						uni.navigateTo({
							url: '/pagesA/customerInfo/visit/add_phone_followup?id=' + item.id +
								'&name=' + item.contacts.name
						})
					}
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(item.contacts.mobile, true);
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/add_phone_followup?id=' + item.id + '&name=' + item.contacts
						.name
				})
				// #endif
			},
			//导航
			toNavigate(item) {
				if(item.lat){
					uni.openLocation({
						latitude: item.lat,
						longitude: item.lng,
						address: item.address,
						name: item.address,
						fail: (err) => {
							uni.showToast({
								title: err.errMsg,
								icon: 'none'
							})
						}
					})
				}else{
					uni.showToast({
						title:'暂无地址',
						icon:'none'
					})
				}
			},
			//新建
			toAdd(item) {
				this.newBuildFileInfo = item
				this.$refs.filepopChild.open()
			},
			//详情
			toDetail(item) {
				uni.navigateTo({
					url: '/pagesA/customerInfo/myCustomer/customerDetail?customerid=' + item.id
				})
			},
			//合并
			toMerge(item) {
				uni.navigateTo({
					url: '/pagesA/customerInfo/merge/list?id=' + item.id + '&name=' + item.name
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cusitem {
		width: 690rpx;
		margin: 0 auto 24rpx;
		background: #fff;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;

		.cus_top {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.fir_sta {
				font-size: 22rpx;
				color: #999999;
			}

			.cus_status {
				font-size: 22rpx;
				color: #fff;
				background: #1ABB85;
				border-radius: 16rpx;
				padding: 2rpx 10rpx;
				flex-shrink: 0;
				margin-right: 24rpx;
			}

			.cus_name {
				flex: 1;
				font-size: 26rpx;
				color: #666666;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.cus_name_a{
				color: $uni-text-color;
			}
		}

		.cus_info {
			padding: 24rpx 0;
			border-bottom: 1rpx solid #EDEDED;
			border-top: 1rpx solid #EDEDED;
			margin: 24rpx 0;

			.cus_info_top {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: 20rpx;

				.info_left {
					flex-shrink: 0;
					text-align: center;

					.cusimg {
						width: 84rpx;
						height: 84rpx;
						border-radius: 50%;
						margin-bottom: 8rpx;
					}

					.staffname {
						font-size: 30rpx;
						color: #666666;
					}
				}

				.info_right {
					flex: 1;

					.info_fir {
						display: flex;
						justify-content: flex-start;

						.firimg {
							width: 42rpx;
							height: 42rpx;
							margin-right: 10rpx;
							flex-shrink: 0;
						}

						.secimg {
							width: 35rpx;
							height: 35rpx;
							margin-right: 10rpx;
							flex-shrink: 0;
						}

						.thrimg {
							width: 33rpx;
							height: 39rpx;
							margin-right: 10rpx;
							flex-shrink: 0;
						}

						.fir_name {
							font-size: 26rpx;
							color: #999999;
						}
					}

					.info_fir_margin {
						margin-bottom: 10rpx;
					}
				}
			}

			.cus_info_bot {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.bot_con {
					font-size: 24rpx;
					color: #999999;
				}
			}
		}

		.cus_btn {
			display: flex;
			justify-content: space-around;
			align-items: center;

			.btn_fir {
				width: 30%;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #008EFF;
				border-right: 1rpx solid #EDEDED;

				&:last-child {
					border-right: 0;
				}

				.btnimg {
					width: 31rpx;
					height: 31rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	.cusIndexitem {
		width: 100%;
		background: #F6F6F6;
	}
</style>
