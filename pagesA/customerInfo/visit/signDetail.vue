<template>
	<view>
		<view class="plan_li">
			<view class="plan_info_box" >
				<view class="plan_info_firbox">
					<view class="planinfoleft">
						<image :src="info.staff.img ? info.staff.img : '/static/index/header.png'" class="planheaderimg" ></image>
						<view class="plan_info_fir">
							<view class="name">{{info.staff.name}}</view>
							<view class="post">{{info.staff.post}}</view>
						</view>
					</view>
					<view class="plan_status">{{info.relation_process}}</view>
				</view>
				<view class="plan_lef">
					<span class="plancir"></span>
					{{info.createtime}}
				</view>
				<view class="plan_info">
					<view class="plan_info_sec">
						<view class="text">备注：</view>
						<view class="text">{{info.content}}</view>
					</view>
					<view class="imglist">
						<image :src="ele" v-for="(ele,fileindex) in info.files" :key="fileindex" @click="previeImg(info.files,fileindex)" class="planimg" ></image>
					</view>
					<view class="plan_info_thr">
						<view class="daka">打卡点：（距离客户{{info.distance ? info.distance : ''}}）</view>
						<view class="text">{{info.location}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="com_warp">
			<view class="com_tab">评论</view>
			<view class="com_list">
				<view class="com_li">
					<image src="" class="comimg" ></image>
					<view class="com_li_right">
						<view class="liname">测试</view>
						<view class="litext">备注事件</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				info:{
					createtime:'2021-05-05',
					staff:{name:'测试',post:'职位'},
					relation_process:'已结束',
					content:'备注',
					files:['https://keqi.jinlangte.cn/uploads/20210716/6addcae71432ab35bdf0d571bc225687.png'],
					distance:'20'
				}
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.plan_li{
		margin-bottom:50rpx;
		.plan_lef{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-top:10rpx;
			.plancir{
				display: block;
				width:10rpx;
				height:10rpx;
				border-radius: 50%;
				border:4rpx solid #14c2c1;
				margin-right:20rpx;
			}
		}
		.plan_info_box{
			background:#fff;
			border-radius: 10rpx;
			padding:30rpx;
			.plan_info_firbox{
				display: flex;
				justify-content: space-between;
				.planinfoleft{
					display: flex;
					justify-content: flex-start;
					.planheaderimg{
						width:60rpx;
						height:60rpx;
						border-radius: 50%;
						flex-shrink: 0;
						margin-right:24rpx;
					}
				}
			}
			.plan_info{
				margin-top:24rpx;
				.plan_info_fir{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.name{
						font-size:26rpx;
						color:#000;
					}
					.post{
						font-size:24rpx;
						color:#000;
						margin-left:15rpx;
					}
				}
				.plan_info_sec{
					display: flex;
					justify-content: flex-start;
					.text{
						font-size:26rpx;
						color:#000;
					}
				}
				.imglist{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;
					margin:24rpx 0;
					.planimg{
						width:193rpx;
						height:180rpx;
						margin-right:20rpx;
						margin-bottom:20rpx;
						&:nth-child(3n){
							margin-right:0;
						}
					}
				}
				.plan_info_thr{
					background:#f1f1f1;
					padding:24rpx;
					border-radius: 5rpx;
					.daka{
						font-size:26rpx;
					}
					.text{
						font-size:28rpx;
						color:$uni-text-color;
						padding-left:15rpx;
						margin-top:10rpx;
					}
				}
			}
			.plan_status{
				font-size:26rpx;
				color:$uni-text-color;
				flex-shrink: 0;
			}
		}
	}
	.com_warp{
		.com_tab{
			font-size:30rpx;
			font-weight: bold;
			color:#333;
			background:#f5f5f5;
			padding:0 24rpx;
			margin-bottom:30rpx;
		}
		.com_list{
			width:750rpx;
			background:#fff;
			padding:30rpx 0 30rpx 30rpx;
			.com_li{
				display: flex;
				justify-content: flex-start;
				.comimg{
					width:80rpx;
					height:80rpx;
					border-radius: 50%;
					margin-right:24rpx;
					flex-shrink: 0;
				}
				.com_li_right{
					padding-right:24rpx;
					.liname{
						font-size:28rpx;
						color:#000;
						margin-bottom:24rpx;
					}
					.litext{
						font-size:26rpx;
						color:#666;
					}
				}
			}
		}
	}
</style>
