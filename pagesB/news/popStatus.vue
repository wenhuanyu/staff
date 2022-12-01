<template>
	<view class="status_mask">
		<view class="status_box">
			<view class="title">修改状态</view>
			<view class="conwarp">
				<view class="sta_title">
					任务标题：{{schesTitle}}
				</view>
				<view class="sta_self">
					任务状态：
					<radio-group @change="radioChange" class="radiobox">
						<label class="radiolist" v-for="(item, index) in statusList" :key="item.id">
							<view>
								<radio :value="item.id" color="#008EFF" :checked="item.id == schestatus" />
							</view>
							<view>{{item.name}}</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="btnli">
				<view class="btn remove" @click="removeStatus">取消</view>
				<view class="btn sure" @click="sureChange">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netEditScheculeStatus } from '@/api/api.js'
	
	export default {
		props:{
			schestatus:{
				type:Number/String,
				default:'0'
			},
			schesTitle:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				statusList:[
					{id:'0', name:'未开始'},
					{id:'1', name:'执行中'},
					{id:'2', name:'已结束'},
					{id:'3', name:'已取消'}
				],
			}
		},
		methods:{
			radioChange(e) {
				this.$emit('changeStatus',e.detail.value)
			},
			sureChange() {
				this.$emit('changeSuccess')
			},
			removeStatus() {
				this.$emit('closeStatus')
			}
		}
	}
</script>

<style lang="scss">
	radio{
		transform: scale(0.6);
	}
</style>
<style lang="scss" scoped>
	.status_mask{
		position: fixed;
		left:0;
		right:0;
		top:0;
		bottom:0;
		background:rgba(0,0,0,0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9;
		.status_box{
			background:#fff;
			border-radius: 10rpx;
			padding:20rpx;
			min-width:300rpx;
			max-width: 680rpx;
			.title{
				font-size:26rpx;
				color:#333;
				text-align: center;
				padding-bottom:20rpx;
				border-bottom:1rpx solid #CCCCCC;
				margin-bottom:20rpx;
				
			}
			.conwarp{
				.sta_title{
					font-size:24rpx;
					color:#666;
					margin-bottom:20rpx;
					margin-top:40rpx;
				}
				.sta_self{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:24rpx;
					.radiobox{
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}
					.radiolist{
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}
				}
			}
			.btnli{
				display: flex;
				justify-content: space-around;
				align-items: center;
				margin-top:50rpx;
				padding-bottom:20rpx;
				.btn{
					width:200rpx;
					height:60rpx;
					border-radius: 15rpx;
					font-size:24rpx;
					color:#fff;
					text-align: center;
					line-height: 60rpx;
				}
				.sure{
					background:$uni-text-color;
					border: 1px solid $uni-text-color;
				}
				.remove{
					background:none;
					border: 1px solid $uni-text-color;
					color:  $uni-text-color;
				}
			}
		}
	}
</style>
