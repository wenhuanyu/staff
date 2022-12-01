<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popup_title">选择产品分类</view>
			<scroll-view scroll-y class="scrollbox" lower-threshold="30">
				<view class="pop_list">
					<view class="pop_li" v-for="(item,index) in list" :key="index">
						<view class="pop_info" @tap.stop="changeSelect(index)">
							<view class="pop_radio">
								<radio color='#008EFF' :checked="item.select" ></radio>
							</view>
							<view class="typename">{{item.name}}</view>
						</view>
					</view>
					<view class="noData" v-if="list.length == 0">暂无更多</view>
				</view>
			</scroll-view>
			<view class="popup_bottom">
				<view class="right_btn remove" @click="closePopup">取消</view>
				<view class="right_btn sure" @click="sureSelectData">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netProductType } from '@/api/api.js'
	
	export default{
		props:{
			showType:{
				type:Boolean,
				default:false
			},
		},
		data(){
			return{
				list:[],
			}
		},
		methods:{
			init() {
				this.$refs.popup.open()
				netProductType().then(res=>{
					this.list = res.data
					this.handleData()
				})
			},
			handleData() {
				let arr = this.list
				arr.forEach(ele=>{
					ele.select = false
				})
				this.list = arr
			},
			//选择
			changeSelect(index) {
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
			},
			closePopup() {
				this.$refs.popup.close()
			},
			//确定
			sureSelectData() {
				let arr = this.list
				let newarr = []
				arr.forEach(ele=>{
					if(ele.select){
						newarr.push(ele)
					}
				})
				this.$refs.popup.close()
				this.$emit('selectType',newarr)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup_title{
		text-align: center;
		font-size:34rpx;
		color:#333333;
		padding:24rpx;
	}
	.scrollbox{
		width:100%;
		height:700rpx;
		.pop_list{
			padding:24rpx;
			.pop_li{
				background:#fff;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				border-radius: 24rpx;
				margin-bottom:24rpx;
				
				.pop_info{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding:24rpx 30rpx;
					.pop_radio{
						margin-right:32rpx;
						radio{
							transform: scale(0.7);
						}
					}
				}
			}
		}
	}
	.popup_bottom{
		width:100%;
		padding:0 24rpx;
		height:100rpx;
		border-top:1rpx solid #f5f5f5;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.right_btn{
			width:240rpx;
			height:60rpx;
			font-size:30rpx;
			text-align: center;
			border-radius: 30rpx;
		}
		.remove{
			border:1rpx solid $uni-text-color;
			color:$uni-text-color;
			line-height: 58rpx;
			margin-right:24rpx;
		}
		.sure{
			background:$uni-text-color;
			color:#fff;
			line-height: 58rpx;
		}
	}
</style>
