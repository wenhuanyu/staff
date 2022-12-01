<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popup_title">选择备件</view>
			<view class="searbox">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searchimg" ></image>
				<input type="text" @input="queryData" placeholder="按照备件名称搜索" class="selfinput">
			</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="pop_list">
					<view class="pop_li" v-for="(item,index) in list" :key="index" @click.stop="changeSelect(index)">
						<view class="pop_title">{{item.name}}</view>
						<view class="pop_info">
							<view class="pop_radio">
								<radio color='#008EFF' :checked="item.select" ></radio>
							</view>
							<view class="pop_info_right">
								<view class="pop_info_cen">
									<view class="pop_info_text">编号：{{item.num}}</view>
									<view class="pop_info_text">规格：{{item.unit}}</view>
									<view class="pop_info_text">单价：{{item.price}}</view>
								</view>
							</view>
						</view>
						<view class="pop_bottom" @click.stop.prevent>
							<view class="conright">
								<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
							</view>
						</view>
					</view>
					<view class="noData" v-if="list.length == 0">暂无更多</view>
				</view>
			</scroll-view>
			<view class="popup_bottom">
				<view class="pp_left">
					<radio color="#008EFF" :checked="isAll" @click="selectAll"></radio>全选
				</view>
				<view class="pp_right">
					<view class="right_btn remove" @click="closePopup">取消</view>
					<view class="right_btn sure" @click="sureSelectData">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netSparePartsList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			showProduct:{
				type:Boolean,
				default:false
			},
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				page:1,
				totalPage:1,
				name:'',
				list:[],
				isAll:false
			}
		},
		methods:{
			queryData(e) {
				this.name = e.detail.value
				this.init()
			},
			init() {
				this.$refs.popup.open()
				this.page = 1
				this.list = []
				this.getProductList()
			},
			getProductList() {
				let params = {
					name:this.name
				}
				netSparePartsList(params).then(res=>{
					this.list = this.list.concat(res.data)
					this.handleData()
				})
			},
			loadMoredata() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getProductList()
			},
			handleData() {
				let arr = this.list
				console.log(arr)
				arr.forEach(ele=>{
					ele.number = 1
					ele.select = false
				})
				
				this.list = arr
			},
			changeNumber(e,index) {
				let obj = this.list[index]
				if(e > 1){
					obj.select = true
				}
				obj.number = e
				this.$set(this.list,index,obj)
			},
			//选择
			changeSelect(index) {
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
			},
			//全选
			selectAll() {
				this.isAll = !this.isAll
				let arr = this.list
				if(this.isAll){
					arr.forEach(ele=>{
						ele.select = true
					})
				}else{
					arr.forEach(ele=>{
						ele.select = false
					})
				}
				this.list = arr
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
				this.$emit('selectList',newarr)
			}
		}
	}
</script>

<style>
	
</style>
<style lang="scss" scoped>

.conright{
	display: flex;
	justify-content: flex-end;
	align-items: center;
	.conAdd, .reduce{
		width:40rpx;
		height:40rpx;
		border-radius: 8rpx;
		background:#f5f5f5;
		font-size:34rpx;
		text-align: center;
		line-height: 40rpx;
	}
	.numberinput{
		width:60rpx;
		height:40rpx;
		border-radius: 8rpx;
		background:#f5f5f5;
		font-size:34rpx;
		text-align: center;
		line-height: 40rpx;
		margin:0 10rpx;
	}
}
	.popup_title{
		text-align: center;
		font-size:34rpx;
		color:3333;
		padding:24rpx;
	}
	.searbox{
		width:650rpx;
		height:68rpx;
		border-radius: 34rpx;
		margin:0 auto;
		border:1rpx solid $uni-text-color;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding:0 15rpx;
		.searchimg{
			width:48rpx;
			height:48rpx;
			margin-right:15rpx;
		}
		.selfinput{
			width:450rpx;
			font-size:26rpx;
			color:$uni-text-color;
		}
	}
	.scrollbox{
		width:100%;
		height:700rpx;
		.pop_list{
			padding:24rpx;
			.pop_li{
				width:690rpx;
				border-radius: 20rpx;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				background:#fff;
				margin-bottom:24rpx;
				.pop_title{
					font-size:32rpx;
					color:#333;
					padding:24rpx;
					border-bottom:1rpx solid #F5F5F5;
					margin-bottom:24rpx;
				}
				.pop_info{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding:0 24rpx;
					.pop_radio{
						margin-right:24rpx;
						radio{
							transform: scale(0.7);
						}
					}
					.pop_info_right{
						display: flex;
						justify-content: flex-start;
						.infoimg{
							width:90rpx;
							height:90rpx;
							margin-right:24rpx;
							flex-shrink: 0;
						}
						.pop_info_cen{
							.pop_info_text{
								font-size:26rpx;
								color:#666;
								margin-bottom:15rpx;
							}
						}
					}
				}
				.pop_bottom{
					padding:0 24rpx 24rpx;
					display: flex;
					justify-content: flex-end;
					.conright{
						.conAdd, .reduce, .numberinput{
							background:#fff;
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
		justify-content: space-between;
		align-items: center;
		.pp_left{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size:26rpx;
			color:3333;
			radio{
				transform: scale(0.7);
			}
		}
		.pp_right{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.right_btn{
				width:165rpx;
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
	}
</style>
