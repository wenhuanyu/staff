<template>
	<view class="exam_warp">
		<view class="exam_tit">
			<view class="name key">
				{{title}}
				<view class="order" v-if="title == '审批人'">依次审批</view>
				<span v-if="flag">*</span>
			</view>
		</view>
		<view class="exam_list">
			<view class="exam_box" v-for="(item,index) in list" :key="index">
				<image :src="BASE_IMG_URL+'/index/close.png'" class="closeimg" v-if="item.isDel && showAdd" @click="delRemind(index)" ></image>
				<image :src="item.img" class="examimg" ></image>
				<view class="exam_text">{{item.name}}</view>
			</view>
			<image :src="BASE_IMG_URL+'/index/examine_add.png'" v-if="showAdd" @click="moreClick" class="exam_add"> </image>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			title:{
				type:String,
				default:'审批人'
			},
			list:{
				type:Array,
				default:[]
			},
			showAdd:{
				type:Boolean,
				default:true
			},
			type:{
				type:Number,
				default:1,   //1通用添加审批人   2添加团队人员
			},
			flag:{
				type:Boolean,
				default:true,   //是否必填
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			//更多
			moreClick() {
				uni.setStorageSync('isJump',true)
				uni.navigateTo({
					url: '/pages/selectMember/selectMember?status='+this.type
				})
			},
			//删除 提醒人
			delRemind(index) {
				this.$emit('delItem',index)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.exam_warp{
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		border-top:1rpx solid #EDEDED;
		background:#fff;
		.exam_tit{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.name{
				font-size:30rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.order{
					font-size:20rpx;
					color:$uni-top-bg-color;
					padding:3rpx;
					border:2rpx solid $uni-top-bg-color;
					border-radius: 5rpx;
					margin-left:8rpx;
				}
			}
			.exam_num{
				font-size:28rpx;
				color:#FFA205;
			}
		}
		.exam_list{
			margin-top:25rpx;
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			.exam_box{
				margin-right:50rpx;
				position: relative;
				margin-bottom:24rpx;
				.closeimg{
					position: absolute;
					right:-10rpx;
					top:-10rpx;
					width:30rpx;
					height:30rpx;
					border-radius: 50%;
					background:rgba(0,0,0,0.3);
				}
				.examimg{
					width:60rpx;
					height:60rpx;
					border-radius: 50%;
				}
				.exam_text{
					font-size:24rpx;
					color:#999999;
				}
			}
			.exam_add{
				width:70rpx;
				height:70rpx;
			}
		}
	}
</style>
