<template>
	<view class="cust_detail">
		<view class="cust_item">
			<view class="cust_item_head">
				<view class="head_info">
					<image :src="BASE_IMG_URL+'/fujian.png'" class="peopleimg" mode="scaleToFill"></image>
					<view>附件</view>
				</view>
			</view> 
			<view class="item_doc">
				<view class="doc_item" v-for="(item,index) in file_list" :key="index" @click.stop="openCommonFile(item)">
					<image :src="BASE_IMG_URL+'/index/file-clip.png'" class="fileimg" mode="scaleToFill"></image>
					<input type="text" :disabled="item.disabled" :focus="item.focus" :data-index="index"
						v-model="item.name" @confirm="changeName" @blur="changeName" class="doc_name"/>
					<view class="doc_size">{{item.size}}</view>
					<!-- #ifdef MP-WEIXIN -->
					<!-- <image :src="BASE_IMG_URL+'edit.png'" class="editimg" @click.stop="edit(index)" mode="scaleToFill"></image> -->
					<!-- #endif -->
				</view>
			</view>
			<view class="noData" v-if="file_list.length == 0">暂无更多</view>
		</view>
		
	</view>
</template>

<script>
	import{netEditFileName, netCluesFiles} from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
export default {
		props: {
			kehuid: {
				type: Number,
				default: null
			},
			type: {
				type: Number,
				default: 1 //1客户 2联系人 3合同
			}
		},
		data() {
			return {
				file_list: [], //附件 列表
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		created() {
			//附件 列表、
			this.getFile()
		},
		methods: {
			//附件 列表
			getFile() {
				let params = {
					leads_id: this.kehuid
				}
				netCluesFiles(params).then(res => {
					res.data.forEach(item => {
						item.disabled = true
						item.focus = false
						item.url = item.file_path
					})
					this.file_list = res.data
				})
			},
			//编辑
			edit(index) {
				let obj = this.file_list[index]
				obj.disabled = false
				obj.focus = true
				this.file_list[index] = obj
			},
			changeName(e) {
				console.log(e)
				let name = e.detail.value
				let index = e.currentTarget.dataset.index
				let params = {
					id: this.file_list[index].id,
					name: this.file_list[index].name
				}
				netEditFileName(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						this.getFile()
					}, 2000)
				})
			},
			//操作记录
			operationList() {
				let params = {
					relation_type: this.type,
					relation_id: this.kehuid
				}
				netOperationList(params).then(res => {
					this.operation_list = res.data
				})
			},
			//合同详情
			toDetail(id) {
				uni.navigateTo({
					url: '/pagesB/contract/contractDetail?id=' + id
				})
			},
			//回款  详情
			toPaymentDetail(item) {
				uni.navigateTo({
					url: '/pagesB/contract/paymentDetail?id=' + item.id
				})
			},
			//添加  回款
			toAddPayment() {
				uni.navigateTo({
					url: '/pagesB/contract/addContractPayment?kehuid=' + this.kehuid
				})
			},
			//新建费用
			addCost() {
				uni.navigateTo({
					url: '/pages/index/groupCompany/cost/addCost?kehuid=' + this.kehuid
				})
			},
			//费用 详情
			toCostDetail(id) {
				uni.navigateTo({
					url: '/pages/index/groupCompany/cost/costDetail?id='+id
				})
			},
			//新建  下级客户
			toCreatCustomer() {
				uni.navigateTo({
					url:'/pagesA/crm/createCustomer/createCustomer?id='+this.kehuid
				})
			},
			//客户详情
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/index/groupCompany/groupCompany?id='+item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cust_detail {

		.cust_item {
			
			margin-bottom: 20rpx;
			.cust_item_head {
				display: flex;
				justify-content: space-between;
				line-height: 100rpx;
				border-bottom: 1rpx solid #EAEAEA;
				background-color: #fff;
				padding: 0 24rpx;
				.head_info {
					display: flex;
					align-items: center;
					
					.icon--task {
						margin-right: 10rpx;
					}
				}

				.head_new {
					display: flex;
					align-items: center;
					color: #1c9bfc;

					.icon-clock {
						margin-right: 10rpx;
					}
				}
			}

			.lxr_con_list {
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid #C0C0C0;

				&:last-child {
					border-bottom: none;
				}

				.name {
					font-size: 28rpx;
					color: #333333;
					margin-top: 15rpx;
				}

				.info {
					font-size: 24rpx;
					color: #999999;
					margin: 10rpx 0;
				}

				.proce_li {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.pro_li_left {
						display: flex;
						justify-content: flex-start;
						align-items: center;

						.protext {
							font-size: 24rpx;
							color: #999999;
						}

						.probox {
							width: 120rpx;
							height: 15rpx;
							border-radius: 8rpx;
							background: #C0C0C0;
							margin: 0 15rpx;

							.proin {
								width: 20%;
								height: 15rpx;
								border-radius: 8rpx;
								background: #ff7800;
							}
						}

						.pronum {
							font-size: 24rpx;
							color: #999999;
						}
					}

					.pro_li_right {
						color: #ec7f51;
						font-size: 28rpx;
						font-weight: 500;
					}
				}

				.con_status {
					font-size: 24rpx;
					color:$uni-text-color;
					margin-top: 10rpx;
				}
			}

			.cust_item_con {
				border-bottom: 1rpx solid #EAEAEA;
				padding: 15rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.con_info {
					padding: 10rpx 0;

					:first-child {
						color: #060606;
						font-weight: 700;
						line-height: 50rpx;
						font-size: 28rpx;
					}

					:last-child {
						color: #469369;
						line-height: 50rpx;
					}
				}

				.con_money {
					color: #ec7f51;
					font-size: 28rpx;
					line-height: 150rpx;
					font-weight: 700;
				}
			}

			.item_doc {
				.doc_item {
					padding: 30rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #f7faff;
					line-height: 60rpx;
					margin-bottom: 20rpx;
					.fileimg{
						width: 20rpx;
						height: 20rpx;
						margin-right:25rpx;
					}
					input{
						background-color: #F7FAFF;
					}

					.doc_name {
						flex: 1;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.doc_size {
						width: 130rpx;
					}

					.editimg {
						width: 40rpx;
						height: 40rpx;
					}

					.icon-clear {
						width: 50rpx;
					}
				}
			}

			.operation_record {
				padding: 40rpx 20rpx 40rpx 60rpx;

				.record_item {
					display: flex;
					justify-content: space-between;
					line-height: 86rpx;
					margin-top: 20rpx;
					
					.record_img {
						position: relative;
						display: flex;
						line-height: 200rpx;

						image {
							width: 80rpx;
							height: 80rpx;
						}

						.record_info {
							margin-top: 16rpx;
							margin-left: 15rpx;
							line-height: 50rpx;
							font-size: 28rpx;

							:last-child {
								font-size: 24rpx;
							}
						}

						.record_line {
							position: absolute;
							top: -102rpx;
							left: -26rpx;
							height: 105rpx;
							border-left: 4rpx dotted #dedede;
						}

						&::before {
							content: '';
							display: block;
							position: absolute;
							top: 6rpx;
							left: -34rpx;
							width: 15rpx;
							height: 15rpx;
							border: 5rpx solid #dedede;
							border-radius: 15rpx;
						}
					}
				}
			}
		}
	}

	.peopleimg {
		width: 35rpx;
		height: 35rpx;
		margin-right: 15rpx;
	}

	.phoneimg {
		width: 40rpx;
		height: 60rpx;
		margin-right: 20rpx;
	}

	.con-name,
	.con-mobile {
		line-height: 50rpx;
	}

	.con-mobile {
		color: #999;
	}
	.cline_li{
		padding:20rpx 0;
		border-bottom:1rpx solid #CCCCCC;
		&:last-child{
			border-bottom:0;
		}
	}
	.clineInfo {
		.info_head {
			display: flex;
			justify-content: space-between;
			:first-child {
				font-size: 28rpx;
				font-weight: 700;
				color: #999;
			}
	
			:last-child {
				&::before {
					position: relative;
					display: block;
					content: '';
					width: 10rpx;
					height: 10rpx;
					top: 24rpx;
					left: -22rpx;
					background-color: #52c1f5;
					border-radius: 5rpx;
				}
			}
		}
	
		.info_main {
			display: flex;
			justify-content: space-between;
	
			.main_left {
				.left_followUp {
					display: flex;
					padding: 20rpx 0;
				}
	
				.left_star {
					display: flex;
					padding-bottom: 20rpx;
				}
			}
	
			.main_right {
				text-align: center;
				padding: 20rpx 20rpx 0 0;
	
				image {
					width: 44rpx;
					height: 44rpx;
					margin-bottom: 5rpx;
				}
			}
		}
	}
</style>
