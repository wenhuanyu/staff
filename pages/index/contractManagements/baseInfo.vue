<template>
	<view>
		<view class="base-info">
			<view class="inp_warp">
				<view class="inp_title">客户名称：</view>
				<view class="form_right">{{info.customer && info.customer.name}}</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">客户签约人：</view>
				<view class="form_right">{{info.contacts && info.contacts.name}}</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">公司签约人：</view>
				<view class="form_right">{{info.order_staff && info.order_staff.name}}</view>
			</view>
			<form-item v-if="listForm" :listForm="listForm" :isEdit="false"></form-item>
		</view>
		<view class="buyInfo">
			<view class="productbox">
				<view class="title">购买信息</view>
				<view class="prod_cell" v-if="info.is_check_success == 0">
					<view class="cell_con" v-for="(item,index) in info.product" :key="index">
						<image :src="item.img" class="proimg"></image>
						<view class="procenter">
							<view class="proname">{{item.name}}</view>
							<view class="contextTwo">
								<view class="context" style="margin-right: 64rpx;">
									单位：{{item.unit}}
								</view>
								<view class="context">
									数量：{{item.number}}
								</view>
							</view>
							<view class="context">零售价：{{item.price}}</view>
							<view class="context">批发价：{{item.wholesale}}</view>
							<view class="context">编码：{{item.num}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 乙方信息 -->
		<view class="addressInfo">
			<view class="addressTop">
				<view class="title">乙方信息</view>
				<view class="editImg" @click="toEditYifang">
					<image :src="BASE_IMG_URL + '/index/edit-address.png'" ></image>
				</view>
			</view>
			<view class="basic_main">
				<view class="basname">法定代理人：</view>
				<view class="bascon">{{info.legal?info.legal:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">委托代理人：</view>
				<view class="bascon">{{info.entrust?info.entrust:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">经办人：</view>
				<view class="bascon">{{info.handler?info.handler:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">电话：</view>
				<view class="bascon">{{info.mobile?info.mobile:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">传真：</view>
				<view class="bascon">{{info.fax?info.fax:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">开户银行：</view>
				<view class="bascon">{{info.deposit?info.deposit:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">账号：</view>
				<view class="bascon">{{info.account?info.account:''}}</view>
			</view>
		</view>
		<!-- 回款计划 -->
		<view class="returnPlan">
			<view class="title">回款信息</view>
			<view class="plan">
				<view class="basic_main">
					<view>回款计划：</view>
				</view>
				<view class="plan_li" v-for="(item,index) in plan_list" :key="index">
					<view class="plantip">{{item.num}}</view>
					<view class="plantip">{{item.money}}</view>
					<view class="plantip">{{item.return_date}}</view>
				</view>
			</view>
			<!-- 回款记录 -->
			<view class="record">
				<view class="basic_main">
					<view>回款记录：</view>
				</view>
				<view class="collection_item" v-for="(item,index) in paymentlist" :key="index" @click="istoPaymentDetail(item)">
					<view class="collection_li">
						<view class="collec_text" style="color: #008EFF;">回款单号：{{item.number}}</view>
						<view class="collec_text">回款金额：￥{{item.money}}</view>
						<view class="collec_text" style="margin-bottom: 0;">回款日期：{{item.return_time}}</view>
					</view>
					<view class="collection_li">
						<view class="recostatus" v-if="item.check_status == 0">
							<image :src="BASE_IMG_URL + '/index/check.png'"></image>
						</view>
						<view class="recostatus" v-if="item.check_status == 1">
							<image :src="BASE_IMG_URL + '/index/check.png'" ></image>
						</view>
						<view class="recostatus" v-if="item.check_status == 2">
							<image :src="BASE_IMG_URL + '/index/passed.png'" ></image>
						</view>
						<view class="recostatus" v-if="item.check_status == 3" style="color:red">
							<image :src="BASE_IMG_URL + '/index/refused.png'" ></image>
						</view>
						<view class="recostatus" v-if="item.check_status == 4" style="color:red">
							<image :src="BASE_IMG_URL + '/index/recalled.png'" ></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 业绩分配比例 -->
		<view class="partnerB">
			<view class="title">业绩分配比例</view>
			<view class="ach_list" v-if="info.ratios && info.ratios.length != 0">
				<view class="ach_li" v-for="(item,index) in info.ratios" :key="index">
					<view class="ach_rate">
						业绩占比<span>({{item.ratio}}%)</span>
					</view>
					<view class="ach_staff">
						<image :src="item.staff.img?item.staff.img:BASE_IMG_URL+'/headImg.png'" style="border-radius: 50%;" class="uploadimg"></image>
						<view class="ach_t">{{item.staff.name}}</view>
					</view>
					<view class="ach_money">可分业绩<span>({{item.money}}元)</span></view>
				</view>
			</view>
		</view>
		<!-- 发票物流 -->
		<view class="partnerB">
			<view class="title">发票物流信息</view>
			<view class="basic_main">
				<view class="basname">物流单号：</view>
				<view class="bascon">{{info.invoice_logistics_number?info.invoice_logistics_number:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">发货时间：</view>
				<view class="bascon">{{info.invoice_date?info.invoice_date:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">发货凭证：</view>
				<view class="imglist" v-if="info.invoice_file_ids">
					<image v-for="(item,index) in info.invoice_file_ids" :key="index" :src="item" @click="toPriveimg(info.invoice_file_ids,index)" class="imgli" ></image>
				</view>
			</view>
		</view>
		<!-- 回执单信息 -->
		<view class="partnerB">
			<view class="title">回执单信息</view>
			<view class="basic_main">
				<view class="basname">回执时间：</view>
				<view class="bascon">{{info.receipt_date?info.receipt_date:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">回执凭证：</view>
				<view class="imglist" v-if="info.receipt_file_ids">
					<image v-for="(item,index) in info.receipt_file_ids" :key="index" :src="item" @click="toPriveimg(info.receipt_file_ids,index)" class="imgli"></image>
				</view>
			</view>
		</view>
		<!-- 审批流程 -->
		<view class="partnerB">
			<view class="title" style="margin-bottom:24rpx;">审批流程</view>
			<approval-status :process="paymentApproval"></approval-status>
		</view>
		<!-- 操作记录 -->
		<view class="operate" v-if="operationList.length != 0">
			<view class="title">操作记录</view>
			<view class="opretion_li" v-for="(item,index) in operationList" :key="index">
				<view class="opreinfo">
					<image :src="item.staff.img ? item.staff.img : '/static/index/header.png'" class="opreimg" ></image>
					<view class="oprename">{{item.staff.name}}</view>
				</view>
				<view class="opreright">
					<view class="righttop">
						操作内容：<span v-html="item.content"></span>
					</view>
					<view class="righttop">
						操作时间：{{item.createtime}}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 收货地址 信息 -->
		<view class="addressInfo">
			<view class="addressTop">
				<view class="title">收货地址</view>
				<view class="editImg" @click="toEditAddress">
					<image :src="BASE_IMG_URL + '/index/edit-address.png'" ></image>
				</view>
			</view>
			<view class="basic_main">
				<view class="basname">收货人：</view>
				<view class="bascon">{{info.consignee?info.consignee:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname">联系方式：</view>
				<view class="bascon">{{info.consignee_mobile?info.consignee_mobile:''}}</view>
			</view>
			<view class="basic_main">
				<view class="basname" style="flex-shrink: 0;margin-right:15rpx">详细地址：</view>
				<view class="bascon">{{info.delivery_address?info.delivery_address+info.delivery_address_detail:''}}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netPaymentApproval, netSetForm,  } from '@/api/api.js'
	import { netOperationRecord } from '@/api/template.js'
	import formItem from '@/components/form/formitem.vue'
	import { mapState } from 'vuex'
	
	export default {
		props:{
			info:{
				type:Object,
				default:{}
			},
			paymentlist:{
				type:Array,
				default:[]
			},
			paymentApproval:{
				type:Object,
				default:{}
			},
			plan_list:{
				type:Array,
				default:[]
			}
		},
		components:{
			formItem
		},
		data() {
			return {
				listForm:null,
				operationList:[],   //操作记录
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		created() {
			//获取 form
			this.getForm()
			//获取 操作记录
			this.getOperation()
		},
		methods: {
			//修改收货地址
			toEditAddress() {
				uni.navigateTo({
					url:'/pages/index/contractManagements/to_edit_address?id='+this.info.id
				})
			},
			getForm() {
				netSetForm({type:'contract'}).then(res=>{
					if(res.data) {
						res = res.data.data
						this.listForm = this.handleFormDefaultValue(res,this.info)
					}
				})
			},
			getOperation() {
				let params = {
					relation_type: 3,
					relation_id: this.info.id
				}
				netOperationRecord(params).then(res=>{
					this.operationList = res.data
				})
			},
			//回款 详情
			istoPaymentDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/payment/paymentDetail?paymentid='+item.id
				})
			},
			//查看 收款账号图片
			toPreImg() {
				let url = this.info.collection_img[0].url
				uni.previewImage({
					urls: [ url ]
				})
			},
			//查看图片
			toPriveimg(arr,index){
				uni.previewImage({
					current:index,
					urls: arr
				})
			},
			//修改乙方信息
			toEditYifang() {
				uni.navigateTo({
					url:'/pages/index/contractManagements/yifang?id='+this.info.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color:#666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
		}
	}
	// 业绩分配
	.ach_list{
		background:#fff;
		padding:30rpx;
		border-bottom:1rpx solid #f5f5f5;
		margin-bottom:24rpx;
		.ach_li{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-bottom:24rpx;
			margin-bottom:24rpx;
			border-bottom:1rpx solid #f5f5f5;
			&:last-child{
				border-bottom:0;
				margin-bottom:0;
			}
			.ach_rate{
				font-size:24rpx;
				color:#666;
				margin-right:30rpx;
				span{
					color:$uni-text-color;
				}
			}
			.ach_staff{
				display: flex;
				flex-direction: column;
				text-align: center;
				.uploadimg{
					width:80rpx;
					height:80rpx;
				}
				.staffinfo{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:24rpx;
					color:#666;
					.staffimg{
						width:80rpx;
						height:80rpx;
						border-radius: 50%;
						margin-right:24rpx;
					}
				}
				.ach_t{
					font-size:24rpx;
					color:#666;
					margin-top:10rpx;
				}
			}
			.ach_money{
				margin-left:30rpx;
				font-size:26rpx;
				span{
					color:$uni-text-color;
				}
			}
		}
	}
	.title{
		margin-left: 52rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
		&::before{
			content:'';
			position:absolute;
			left:30rpx;
			// top:26rpx;
			width:10rpx;
			height:25rpx;
			border-radius: 5rpx;
			background: $uni-text-color;
		}
	}
	.basic_main {
		padding: 24rpx 0 0 82rpx;
		display: flex;
		background-color: #fff;
		.basname{
			color: #999999;
			font-size:26rpx;
		}
		.bascon{
			color: #999999;
			font-size:26rpx;
			.accountimg{
				width:110rpx;
				height:110rpx;
			}
		}
		.imglist{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			.imgli{
				width:100rpx;
				height:100rpx;
				border-radius: 5rpx;
				margin-right:24rpx;
			}
		}
	}
	.base-info{
		padding: 32rpx 0;
		width: 750rpx;
		background-color: #fff;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
	}
	.buyInfo{
		margin-top: 20rpx;
		padding: 32rpx 0;
		background-color: #fff;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
		.productbox{
			padding: 32rpx 0 18rpx 0;
		}
		.prod_cell{
			margin-top: 20rpx;
			padding:0 82rpx;
			background:#fff;
		}
		.cell_con{
			display: flex;
			justify-content: space-between;
			align-items: center;
			background:#fff;
			margin-bottom:15rpx;
			.proimg{
				width:188rpx;
				height:188rpx;
				margin-right:64rpx;
				border-radius: 10rpx;
			}
			.procenter{
				width:350rpx;
				.proname{
					font-size:26rpx;
					color:#666666;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.contextTwo{
					display: flex;
				}
				.context{
					font-size:24rpx;
					color:#999999;
					margin-top:10rpx;
				}
			}
			.proright{
				text-align: center;
				width:100rpx;
				.probox{
					width:70rpx;
					height:70rpx;
					border-radius: 10rpx;
					background:rgba(2, 135, 255, 0.1);
					display: flex;
					justify-content: center;
					align-items: center;
					font-size:30rpx;
					font-weight: bolc;
					color:#0287FF;
				}
				.ptotext{
					font-size:26rpx;
					color:#999999;
					margin-top:15rpx;
				}
			}
		}
	}
	.partnerB{
		margin-top: 20rpx;
		padding: 32rpx 0;
		background-color: #fff;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
	}
	
	.returnPlan{
		margin-top: 20rpx;
		padding: 32rpx 0;
		background-color: #fff;
		.plan_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin:15rpx 30rpx 15rpx 82rpx;
			padding: 0 15rpx;
			height: 45rpx;
			background: #F6F6F6;
			border-radius: 10rpx;
			.plantip{
				font-size:26rpx;
				color:#999;
			}
		}
		.collection_item{
			margin:15rpx 30rpx 15rpx 82rpx;
			padding: 26rpx 67rpx 26rpx 15rpx;
			display: flex;
			justify-content: space-between;
			background: #F6F6F6;
			border-radius: 10rpx;
			
			.collection_li{
				display: flex;
				flex-direction: column;
				justify-content: center;
				.collec_text{
					font-size:26rpx;
					color:#999999;
					margin-bottom: 22rpx;
				}
				.recostatus{
					image{
						width: 122rpx;
						height: 96rpx;
					}
				}
			}
		}
	}
	// .info_item{
	// 	border-bottom:1rpx solid #f5f5f5;
	// }
	.approveFlow{
		padding: 25rpx 0 0 0;
		margin-top: 20rpx;
		background-color: #FFFFFF;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		.operation_record {
			padding: 20rpx 0 25rpx 0;
			border-bottom: 10rpx solid #f6f6f6;
			margin: 0 30rpx;
			&:last-child{
				border-bottom:none;
			}
			.record_item {
				display: flex;
				justify-content: space-between;
				margin: 0 0 0 52rpx;
				padding-bottom:20rpx;
				border-bottom:1rpx solid #EAEAEA;
				&:last-child{
					border-bottom:none;
				}
				image {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					flex-shrink: 0;
				}
				.record_info {
					display: flex;
					align-items: center;
					.info_top{
						margin-right: 61rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						image{
							margin-bottom: 15rpx;
						}
						>view{
							font-size: 26rpx;
							color: #999;
						}
					}
					.info_right{
						font-size: 26rpx;
						color: #999;
						.shenhetext{
							line-height: 34rpx;
						}
					}
				}
				.record_line {
					position: absolute;
					top: -102rpx;
					left: -26rpx;
					height: 105rpx;
					border-left: 4rpx dotted #dedede;
				}
			}
		}
	}
	
.operate{
	margin-top: 20rpx;
	padding-top: 20rpx;
	background-color: #FFFFFF;
	box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
	.opretion_li{
		padding: 24rpx 0 24rpx 52rpx;
		margin: 0 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom:10rpx solid #f6f6f6;
		&:last-child{
			border-bottom: none;
		}
			.opreinfo{
				flex-shrink: 0;
				text-align: center;
				margin-right:61rpx;
				.opreimg{
					width:70rpx;
					height:70rpx;
					border-radius: 50%;
					margin-bottom:10rpx;
				}
				.oprename{
					font-size:26rpx;
					color:#999;
				}
			}
			.opreright{
				.righttop{
					font-size:24rpx;
					color:#666;
					margin-bottom:10rpx;
					display: flex;
					justify-content: flex-start;
				}
			}
		}
	}
	
	.addressInfo{
		margin-top: 20rpx;
		padding: 0 30rpx 34rpx 0;
		background-color: #FFFFFF;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		.addressTop{
			padding-top: 25rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.editImg{
				margin-right: 52rpx;
				display: inline-block;
				image{
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
		
	}
	
	.basic_head {
		display: flex;
		padding: 30rpx 24rpx 30rpx;
		:last-child {
			font-weight: 700;
			margin-left: 8rpx;
		}
	}

</style>
