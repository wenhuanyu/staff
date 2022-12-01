<template>
	<view class="">
	<view class="boxwarp">
		<!-- <view class="apptitle">审批流程</view> -->
		<view class="approbox" v-if="process.status == 1">
			<view class="appli" v-for="(item,index) in process.stepList" :key="index">
				<view class="xian"></view>
				<view class="title" v-if="item.status == 1">指定员工(任意一人)</view>
				<view class="title" v-if="item.status == 2">指定员工(会签)</view>
				<view class="title" v-if="item.status == 3">直属上级</view>
				<view class="stafflist" v-for="(staffitem,staffindex) in item.stafflist" :key="staffindex">
					<view class="staffli">
						<image :src="staffitem.img" class="staffimg" mode=""></image>
						<view class="staffname">{{staffitem.name}}</view>
					</view>
					<view class="staffcon">
						<view class="approval_status">{{staffitem.examine_reord.check_time?staffitem.examine_reord.check_time:''}}</view>
						<view class="approval_status" v-if="staffitem.examine_reord.status == 0">待审核</view>
						<view class="approval_status" v-if="staffitem.examine_reord.status == 1">审核通过</view>
						<view class="approval_status" v-if="staffitem.examine_reord.status == 2">审核拒绝</view>
						<view class="approval_status" v-if="staffitem.examine_reord.status == 3">撤销审批</view>
						<view class="approval_status">{{staffitem.examine_reord.content?staffitem.examine_reord.content:''}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="info_item" v-if="process.status == 0">
			<view class="operation_record">
				<view class="record_item" v-for="(aitem,aindex) in process.stepList[0].stafflist" :key="aindex">
					<image :src="aitem.img ? aitem.img : BASE_IMG_URL+'/headImg.png'"  mode="scaleToFill"></image>
					<view class="record_info">
						<view class="info_top">
							<view>{{aitem.name}}</view>
							<view class="record_time">
								{{aitem.examine_reord.check_time ? aitem.examine_reord.check_time : ''}}
							</view>
						</view>
						<view v-if="aitem.examine_reord.status == 0">待审核</view>
						<view v-if="aitem.examine_reord.status == 1">审核通过</view>
						<view v-if="aitem.examine_reord.status == 2">审核拒绝</view>
						<view v-if="aitem.examine_reord.status == 3">撤销审批</view>
						<view class="shenhetext" v-if="aitem.examine_reord.status == 1 || aitem.examine_reord.status == 2" style="margin-top:10rpx">审核意见：{{aitem.examine_reord.content}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	
	export default{
		props:{
			process:{
				type:Object/Array,
				default:{}
			}
		},
		data() {
			return{
				
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.boxwarp{
		background:#fff;
		width:100%;
		padding-bottom:50rpx;
	}
	.apptitle{
		padding:24rpx;
		font-size: 26rpx;
		color: #333;
	}
	.approbox{
		padding:0 24rpx;
		.appli{
			padding-left:24rpx;
			position: relative;
			&::after{
				content:'';
				width:14rpx;
				height:14rpx;
				border-radius: 50%;
				background:$uni-color-primary;
				position: absolute;
				left:0;
				top:10rpx;
			}
			&:last-child{
				.xian{
					display: none;
				}
			}
			.xian{
				width:2rpx;
				height:calc(100% - 8rpx);
				background:$uni-color-primary;
				position: absolute;
				top:20rpx;
				left:5rpx;
			}
			.title{
				font-size:28rpx;
				color:#666;
			}
			.stafflist{
				margin-top:24rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-bottom:24rpx;
				border-bottom:1rpx solid #f5f5f5;
				.staffli{
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-right:24rpx;
					margin-bottom:24rpx;
					flex-shrink: 0;
					.staffimg{
						width:60rpx;
						height:60rpx;
						border-radius: 50%;
						margin-bottom:10rpx;
					}
					.staffname{
						font-size:26rpx;
						color:#999;
					}
				}
				.staffcon{
					margin-left:24rpx;
					.approval_status{
						font-size:24rpx;
						color:#333;
						margin-bottom:15rpx;
					}
				}
			}
		}
	}
	.operation_record {
			background:#fff;
			padding: 20rpx 30rpx;
			.record_item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				padding-bottom:20rpx;
				border-bottom:1rpx solid #EAEAEA;
				margin-bottom:20rpx;
				&:last-child{
					border-bottom:none;
				}
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					flex-shrink: 0;
				}
				.record_info {
					flex: 1;
					margin-left: 25rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					.info_top{
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom:10rpx;
					}
					.shenhetext{
						font-size:26rpx;
						color:#666;
						line-height: 34rpx;
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
</style>