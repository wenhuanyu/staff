<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="topbox">
				<view class="addbtn" @click="toAddpart">新增</view>
				<view class="popup_title">添加配件</view>
			</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="pop_list">
					<view class="pop_li" v-for="(item,index) in list" :key="index">
						<view class="pop_info" @click="changeSelect(index)">
							<view class="pop_radio">
								<radio color='#008EFF' :checked="item.select" ></radio>
							</view>
							<view class="pop_info_right">
								<view class="pop_info_cen">
									<view class="pop_info_text">名称：{{item.name}}</view>
								</view>
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
	
	export default{
		props:{
			showParts:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				list:[],
				isAll:false,
				workorder_id:'',
				name:'',
			}
		},
		methods:{
			//新增配件
			toAddpart() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/workorder/addParts',
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
			changeSearch(e) {
				this.name = e.detail
				this.init(this.workorder_id)
			},
			init(id) {
				this.$refs.popup.open()
				if(id) {
					this.workorder_id = id
				}
				this.list = []
				this.getPartsList()
			},
			getPartsList() {
				let params = {
					name:this.name,
					workorder_id:this.workorder_id
				}
				netSparePartsList(params).then(res=>{
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
			changeNumber(e,index) {
				let obj = this.list[index]
				if(e.detail > 1){
					obj.select = true
				}
				obj.number = e.detail
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
				this.closePopup()
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
	.topbox{
		width:100%;
		position: relative;
		.addbtn{
			width:100rpx;
			font-size:26rpx;
			color:$uni-text-color;
			position: absolute;
			left:35rpx;
			top:30rpx;
		}
		.popup_title{
			text-align: center;
			font-size:34rpx;
			color:3333;
			padding:24rpx;
		}
	}
	.searbox{
		padding:0 24rpx;
	}
	.scrollbox{
		width:100%;
		height:700rpx;
		.pop_list{
			padding:24rpx;
			.pop_li{
				background:#f5f5f5;
				border-radius: 8rpx;
				margin-bottom:24rpx;
				.pop_title{
					font-size:32rpx;
					color:#333;
					padding:24rpx;
					border-bottom:1rpx solid #d0d0d0;
					margin-bottom:24rpx;
				}
				.pop_info{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding:24rpx;
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
				height:80rpx;
				font-size:26rpx;
				text-align: center;
				border-radius: 10rpx;
			}
			.remove{
				width:140rpx;
				border:1rpx solid #f5f5f5;
				color:#333;
				line-height: 78rpx;
				margin-right:24rpx;
			}
			.sure{
				width:200rpx;
				background:$uni-text-color;
				color:#fff;
				line-height: 80rpx;
			}
		}
	}
</style>
