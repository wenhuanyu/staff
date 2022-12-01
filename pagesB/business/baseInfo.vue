<template>
	<view class="">
		<view class="basic_main">
			<view class="basictit">客户名称</view>
			<view style="color:#008EFF" @click="toKehuInfo">{{info.customer.name}}</view>
		</view>
		<form-item v-if="listForm" :listForm="listForm" :isEdit="false"></form-item>
		<view class="basic_main">
			<view>购买产品</view>
			<view></view>
		</view>
		<view class="pro_warp" v-if="info.product && info.product.length != 0">
			<view class="li_warp" v-for="(item,index) in info.product" :key="index">
				<image class="pro_img" :src="item.img" mode=""></image>
				<view class="cell_con">
					<view class="cell_con_top">
						<view class="contitle">{{item.name}}</view>
					</view>
					<view class="context">编码：{{item.num}}</view>
					<view class="info_l">
						<view class="context">单位：{{item.unit}}</view>
						<view class="context">数量：{{item.number}}</view>
					</view>
					<view class="context">零售价：￥{{item.price}}</view>
					<view class="context">批发价：￥{{item.wholesale}}</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { netSetForm  } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			formItem
		},
		props:{
			info:{
				type:Object,
				default:{}
			},
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				listForm:null
			}
		},
		created() {
			//获取 form
			this.getForm()
		},
		methods:{
			getForm() {
				netSetForm({type:'business'}).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
				})
			},
			//客户信息
			toKehuInfo() {
				uni.navigateTo({
					url: '/pages/index/groupCompany/groupCompany?id=' + this.info.customer.id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.basic_main {
		display: flex;
		justify-content: space-between;
		padding: 0 32rpx;
		background-color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-bottom: 1rpx solid #EAEAEA;
		font-size:24rpx;
		.basictit{
			font-size: 24rpx;
			color:#666;
		}
	}
	.pro_warp{
		padding:30rpx 24rpx;
		background:#fff;
		margin-bottom:24rpx;
		.li_warp{
			padding-bottom:24rpx;
			margin-bottom:24rpx;
			border-bottom:1rpx solid #f5f5f5;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			position: relative;
			.pro_status{
				font-size:26rpx;
				color:#007AFF;
				position: absolute;
				right:35rpx;
				top:10rpx;
			}
			.pro_img{
				width:160rpx;
				height:160rpx;
				flex-shrink: 0;
				margin-right:24rpx;
			}
			.cell_con{
				padding:0 40rpx 0 0;
				flex:1;
				.cell_con_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.contitle{
						font-size:28rpx;
						color:#333;
					}
				}
				.context{
					font-size:26rpx;
					color:#999;
					margin-top:10rpx;
				}
				.info_l{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.context{
						font-size:26rpx;
						color:#999;
						margin-right:24rpx;
						&:last-child{
							margin-right:0;
						}
					}
				}
				.con_info{
					margin-top:15rpx;
					.contitle{
						font-size:26rpx;
						color:#333;
					}
					.config_li{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin-top:24rpx;
						border-bottom:1rpx solid #f5f5f5;
						&:last-child{
							border-bottom:0;
						}
						.conimg{
							width:80rpx;
							height:80rpx;
							border-radius: 10rpx;
							margin-right:20rpx;
						}
						.config_name{
							width:100rpx;
							font-size:24rpx;
							color:#333;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						.config_step{
							margin-left:24rpx;
						}
					}
				}
				.conbot{
					margin-top:10rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.conmoney{
						font-size:26rpx;
						color:#333;
					}
				}
			}
			.right_del_btn{
				width:90rpx;
				height:240rpx;
				background:#F00;
				color:#fff;
				text-align: center;
				line-height: 224rpx;
			}
		}
		.total_money{
			text-align: right;
			font-size:26rpx;
			span{
				font-size:26rpx;
				color:#F00;
			}
		}
	}
</style>