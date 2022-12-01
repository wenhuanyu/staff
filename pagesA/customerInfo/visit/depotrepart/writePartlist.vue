<template>
	<view>
		<view class="fllow_form" style="margin-top:24rpx;">
			<view class="key">机器型号</view>
			<view class="form_right" @click="toAddPart">
				<view class="iconfont icon-jiahaocu"></view>
				选择机器
			</view>
		</view>
		<view class="prolist" v-if="partsList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in partsList" :key="index">
					<view class="iconfont icon-jian" @click="delParts(index)"></view>
					<view class="protext">{{item.name}}</view>
					<view class="protext" >{{item.price}}</view>
				</view>
			</view>
		</view>
		<view class="button" @click="$noMultipleClicks(toAddVisit)">提交</view>
		
		
		<select-product ref="productChild" @selectList="selectParts"></select-product>
	</view>
</template>

<script>
	import selectProduct from '@/components/selectProduct/index.vue'
	
	export default{
		components:{
			selectProduct
		},
		data() {
			return{
				noClick:true,   //防止重复点击
				partsList:[],
			}
		},
		methods:{
			//机器
			toAddPart() {
				this.$refs.productChild.init()
			},
			delParts(index) {
				this.partsList.splice(index,1)
			},
			selectParts(arr) {
				let data = this.partsList.concat(arr)
				data.forEach(ele=>{
					ele.number = 1
				})
				this.partsList = this.deWeight(data)
			},
			toAddVisit() {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:24rpx 40rpx 24rpx 50rpx;
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
	}
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom:0;
				}
				.icon-jian{
					font-size:42rpx;
					color:#ff7800;
				}
				.protext{
					font-size:24rpx;
					color:#333;
					width:200rpx;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					.priceinput{
						width:180rpx;
						font-size:24rpx;
						color:#333;
					}
				}
			}
		}
	}
</style>
