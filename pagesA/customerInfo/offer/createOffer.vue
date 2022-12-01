<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title">客户名称<text>*</text></view>
			<view class="form_right">
				<input type="text" placeholder="请输入客户名称" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">联系人<text>*</text></view>
			<view class="form_right">
				<input type="text" placeholder="请输入联系人" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">购买产品<text>*</text></view>
			<view class="form_right">
				<view class="right_btn">添加产品</view>
			</view>
		</view>
		<view class="pro_warp">
			<view class="pro_li" v-for="item in 3" :key="item">
				<view class="pro_left">
					<image src="/static/index/header.png" class="proimg" ></image>
					<view class="pro_info">
						<view class="info_name">全自动肩带缝纫机</view>
						<view class="info_label">JD_300</view>
					</view>
				</view>
				<view class="pro_right">
					<view class="pro_number">×1</view>
					<view class="pro_money">￥2000</view>
				</view>
			</view>
			<view class="total_money">
				合计：<span>￥2000</span>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">优惠金额<text>*</text></view>
			<view class="form_right">
				<input type="text" placeholder="优惠金额" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">实际需支付<text>*</text></view>
			<view class="form_right">
				<input type="text" placeholder="实际需支付" class="rightinput">
			</view>
		</view>
		
		<view class="inp_warp" style="margin:24rpx 0 0;">
			<view class="inp_title">上传凭证<text>*</text></view>
			<view class="form_right">
				<view>点击上传</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="imglist" v-if="imgList.length != 0">
			<view class="imgbox" v-for="(item,index) in imgList" :key="index">
				<image :src="BASE_IMG_URL+'/index/close.png'" class="delimg" @click="delImg(index)" ></image>
				<image :src="item.url" class="selfimg" ></image>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head">备注:<text>*</text></view>
			<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		<!-- 审核信息 -->
		<view class="affiliation">
			<view class="aff_head">由谁审核<text>*</text></view>
			<view class="aff_con">
				<view class="aff_item affbox" v-for="(item,index) in remindPeople" :key="index">
					<image :src="BASE_IMG_URL+'/index/close.png'" class="delremind" v-if="item.isDel" @click="delRemind(index)" ></image>
					<image :src="item.img ? item.img : '/static/index/header.png'"></image>
					<view>{{item.name}}</view>
				</view>
				<view class="aff_item aff_last" @click="moreClick">
					<image src="/static/img/more.png"></image>
					<view>更多</view>
				</view>
			</view>
		</view>
		
		<view class="button">提交</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				imgList:[],
				remindPeople:[]
			}
		},
		methods:{
			//更多
			moreClick() {
				uni.navigateTo({
					url: '/pages/selectMember/selectMember'
				})
			},
			//删除 提醒人
			delRemind(index) {
				this.remindPeople.splice(index, 1)
				uni.setStorageSync('remindlist', this.remindPeople)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding: 30rpx 24rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #333;
			text{
				color:#F00;
			}
		}
	
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			view{
				color:#999;
			}
			.rightinput{
				width:100%;
				text-align: right;
				color: #999;
			}
			.right_btn{
				font-size:24rpx;
				color:#007AFF;
			}
		}
	}
	.pro_warp{
		padding:30rpx 45rpx;
		background:#fff;
		margin-bottom:24rpx;
		.pro_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom:20rpx;
			margin-bottom:24rpx;
			border-bottom:1rpx solid #EDEDED;
			.pro_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.proimg{
					width:160rpx;
					height:75rpx;
					margin-right:20rpx;
					flex-shrink: 0;
				}
				.pro_info{
					flex:1;
					.info_name{
						font-size:26rpx;
						color:#333;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.info_label{
						font-size:24rpx;
						color:#666;
						margin-top:15rpx;
					}
				}
			}
			.pro_right{
				.pro_number{
					font-size:26rpx;
					color:#666;
					margin-bottom:24rpx;
				}
				.pro_money{
					font-size:26rpx;
					color:#F00;
				}
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
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EDEDED;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EDEDED;
	
			.delimg {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				position: absolute;
				right: -16rpx;
				top: -16rpx;
				background: rgba(0, 0, 0, 0.5);
				z-index: 2;
			}
	
			.selfimg {
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding: 0 30rpx 30rpx;
		margin-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			text {
				color: #f00;
			}
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 50rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
	.affiliation {
		background-color: #fff;
		margin-bottom: 20rpx;
		margin-top:24rpx;
		padding-bottom: 40rpx;
		.aff_head {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 30rpx;
			font-size:26rpx;
			text {
				color: #f00;
				margin-left: 10rpx;
			}
		}
		.aff_con {
			display: flex;
			text-align: center;
			flex-wrap: wrap;
		
			.aff_item {
				width: 100rpx;
				margin-right: 15rpx;
				margin-bottom:15rpx;
				image {
					margin-bottom: 15rpx;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}
		
			.affbox {
				position: relative;
		
				.delremind {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					position: absolute;
					right: -16rpx;
					top: -16rpx;
					background: rgba(0, 0, 0, 0.5);
					z-index: 2;
				}
			}
		
			.aff_last {
				image {
					margin-bottom: 15rpx;
					width: 80rpx;
					height: 50rpx;
				}
			}
		}
	}
</style>
