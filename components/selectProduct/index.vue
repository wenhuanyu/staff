<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent @click.stop.prevent>
			<view class="popup_title">选择产品</view>
			<view class="searbox">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searchimg" ></image>
				<input type="text" placeholder="按照产品编码/名称搜索" v-model="name" @input="queryList" class="selfinput">
			</view>
			<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMoredata" lower-threshold="30">
				<view class="pop_list">
					<view class="pop_li" v-for="(item,index) in list" :key="index" @click.stop.prevent>
						<view class="pop_li_top">
							<view class="pop_title">{{item.name}}</view>
							<view class="pop_num">{{item.num}}</view>
						</view>
						<view class="pop_info" @tap.stop="changeSelect(index)">
							<view class="pop_radio">
								<radio color='#008EFF' :checked="item.select" ></radio>
							</view>
							<image :src="item.img" class="infoimg" ></image>
							<view class="pop_info_cen">
								<view class="pop_info_text">单位：{{item.unit}}</view>
								<view class="pop_info_text">零售价：{{item.price}}</view>
								<view class="pop_info_text">批发价：{{item.wholesale}}</view>
								<view class="pop_bottom" @tap.stop.prevent v-if="!isSingle">
									数量
									<view class="conright">
										<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
										</van-stepper>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="noData" v-if="list.length == 0">暂无更多</view>
				</view>
			</scroll-view>
			<view class="popup_bottom" @click.stop.prevent>
				<view class="pp_left_box" >
					<view class="pp_left" v-if="!isSingle">
						<radio color="#008EFF" :checked="isAll" @click="selectAll"></radio>全选
					</view>
					<view class="selectnum">已选{{selectArr.length}}项</view>
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
	import { netProductList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			isSingle:{
				type:Boolean,
				default:false
			},
			isChangeNumber:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				page:1,
				totalPage:1,
				name:'',
				typeid:'',
				list:[],
				isAll:false,
				selectArr:[]
			}
		},
		methods:{
			queryList(e) {
				this.init()
			},
			init(id) {
				this.$refs.popup.open()
				if(id){
					this.typeid = id
				}
				this.page = 1
				this.list = []
				this.getProductList()
			},
			getProductList() {
				let params = {
					page:this.page,
					name:this.name,
					type_id:this.typeid
				}
				netProductList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
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
				this.handleSelect()
			},
			//选择
			changeSelect(index) {
				if(this.isSingle){
					let arr = this.list
					arr.forEach(ele=>{
						ele.select = false
					})
					this.list = arr
				}
				
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
				this.handleSelect()
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
				this.handleSelect()
			},
			closePopup() {
				this.$refs.popup.close()
				this.selectArr = []
			},
			handleSelect() {
				let arr = this.list
				let newdata = []
				arr.forEach(ele=>{
					if(ele.select){
						newdata.push(ele.id)
					}
				})
				this.selectArr = newdata
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
				this.selectArr = []
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
				background:#fff;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				border-radius: 24rpx;
				margin-bottom:24rpx;
				.pop_li_top{
					padding:28rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom:1rpx solid #f5f5f5;
					.pop_title{
						font-size:34rpx;
						color:#333333;
					}
					.pop_num{
						font-size:30rpx;
						color:#666666;
					}
				}
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
					.infoimg{
						width:140rpx;
						height:140rpx;
						border-radius: 20rpx;
						margin-right:90rpx;
					}
					.pop_info_cen{
						.pop_info_text{
							font-size:28rpx;
							color:#666666;
							margin-bottom:15rpx;
						}
						.pop_bottom{
							display: flex;
							justify-content: flex-start;
							align-items: center;
							font-size:28rpx;
							color:#666666;
							.conright{
								margin-left:10rpx;
								.stepbtn{
									width:38rpx;
									height:38rpx;
									border:1rpx solid $uni-btn-bg-color;
								}
							}
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
		.pp_left_box{
			display: flex;
			justify-content: flex-start;
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
			.selectnum{
				font-size:30rpx;
				color:$uni-text-color;
				margin-left:24rpx;
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
