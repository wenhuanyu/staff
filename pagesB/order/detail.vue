<template>
	<view class="orderin">
		<view class="orderinfo">
			<view class="title">订单详情</view>
			<view class="orin" style="margin-top: 33rpx;">关联合同：{{info.contract ? info.contract.num :''}}</view>
			<view class="orin" style="padding-bottom: 38rpx;">关联客户：{{info.customer ? info.customer.name : ''}}</view>
		</view>
		<!-- 更多操作 -->
		<!-- <more-pop 
			v-if="info.is_operation != 0" 
			 relation_type="order" 
			 :relation_id="id" 
			 :staffList="info.show_staff_data"
			 :remindPeople="remindPeople"
			 @delExamine="delExamine"
			 @clearRemindlist="clearRemindlist"
		 ></more-pop> -->
		
		<view class="or_proli">
			<view class="title">关联产品：</view>
			<view class="product" v-for="(item,index) in info.product" :key="index">
				<image :src="item.img"  class="proimg"></image>
				<view class="proright">
					<view class="name">{{item.name}}</view>
					<view class="text">编号：{{item.num?item.num:''}}</view>
					<view class="text">单位：{{item.unit}}</view>
					<view class="text">数量：{{item.number}}</view>
					<view class="text">零售价：{{item.price}}</view>
					<view class="text">批发价：{{item.wholesale}}</view>
				</view>
			</view>
		</view>
		<view class="or_proli">
			<view class="title">到账记录</view>
			<view class="arrival" v-for="(item,index) in info.record" :key="index">
				<view class="arri_time" v-html="item.content"></view>
				<view class="arri_img">
					<view class="imgtip">凭证：</view>
					<view class="imglist">
						<view class="imgbox" v-for="(eleitem,eleindex) in item.file_ids" :key="eleindex" @click="toPriev(item.file_ids,eleindex)">
							<image :src="eleitem" class="selfimg" ></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view style="height:110rpx"></view>
		<view class="botwarp" v-if="info.is_operation == 1">
			<view class="botbtn" @click="toWrite">填写信息</view>
		</view>
	</view>
</template>

<script>
	import { netOrderDetail } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				id:'',
				info:{},
				isPriveimg:false,
				showMore:false,
				remindPeople:[],
				examineType:'',
				
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getDefaultRemind()
			if(!this.isPriveimg) {
				this.getDetail()
			}
		},
		methods:{
			getDetail(){
				netOrderDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			},
			toWrite() {
				uni.navigateTo({
					url:'/pagesB/order/writeInfo?id='+this.id,
					success:()=>{
						this.isPriveimg = false
					}
				})
			},
			toPriev(arr,index) {
				this.isPriveimg = true
				uni.previewImage({
					current:index,
					urls:arr
				})
			},
			//传阅
			toCirculate() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.id+'&type=order'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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
			background: $uni-btn-bg-color;
		}
	}
	.arrival{
		padding:0 30rpx;
		margin: 40rpx 0 0 52rpx;
		.arri_time{
			font-size:26rpx;
			color:#999;
		}
		.arri_img{
			margin-top:15rpx;
			display: flex;
			.imgtip{
				font-size:26rpx;
				color:#999;
			}
			.imglist {
				background: #fff;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				.imgbox {
					width: 140rpx;
					height: 140rpx;
					margin-right: 24rpx;
					position: relative;
					margin-bottom: 24rpx;
					border-radius: 10rpx;
					&:nth-child(4n){
						margin-right:0;
					}
					.selfimg {
						width: 138rpx;
						height: 138rpx;
					}
				}
			}
		}
	}
	.botwarp{
		width:750rpx;
		height:100rpx;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left:0;
		bottom:0;
		.botbtn{
			width:400rpx;
			height:80rpx;
			border-radius: 10rpx;
			background:$uni-text-color;
			font-size:24rpx;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
		}
		.moreBtn{
			font-size:28rpx;
			color:$uni-text-color;
			font-weight: bold;
			margin-left:35rpx;
		}
	}
	.orderin{
		.orderinfo{
			padding-top: 40rpx;
			margin-bottom: 24rpx;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		}
		.team_warp{
			padding:24rpx 35rpx;
			padding-bottom:24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom:1rpx solid #f5f5f5;
			.team_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.teamtit{
					font-size:26rpx;
					color:#666;
					margin-right:24rpx;
				}
				.teambox{
					width:430rpx;
					height:60rpx;
					.staffheader{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.staffimg{
							width:60rpx;
							height:60rpx;
							border-radius: 50%;
							margin-right:20rpx;
							flex-shrink: 0;
						}
					}
				}
			}
			.team_right{
				font-size:28rpx;
				color:#007AFF;
				font-weight: bold;
				flex-shrink: 0;
			}
		}
		.or_proli{
			padding-top: 40rpx;
			padding-bottom:30rpx;
			margin-bottom: 24rpx;
			background-color: #FFFFFF;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		}
		.orin{
			padding:0 82rpx;
			margin-bottom:15rpx;
			font-size:26rpx;
			color: #999;
		}
	}
	.product{
		padding: 39rpx 30rpx 0 30rpx;
		margin-left: 52rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.proimg{
			width:170rpx;
			height:170rpx;
			margin-right:61rpx;
			border-radius: 20rpx;
		}
		.proright{
			font-size: 26rpx;
			color: #999;
			.name{
				font-size:26rpx;
				color:#999;
			}
			.text{
				font-size:26rpx;
				color:#999;
				margin-top:15rpx;
			}
		}
	}
</style>
