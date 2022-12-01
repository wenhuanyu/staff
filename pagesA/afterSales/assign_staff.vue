<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入关键词搜索" v-model="name" @input="queryName" class="lself" placeholder-style="color:#008EFF">
			</view>
		</view>
		<scroll-view class="scrollbox" scroll-y>
			<view class="tem_list">
				<view class="tem_li" v-for="(item,index) in list" :key="index" @click="checkCustomer(item)">
					<radio value="r1" color="#008EFF" :checked="checkobj && (checkobj.id == item.id)" class="selfradio" />
					<image :src="item.img ? item.img : BASE_IMG_URL+'/user/mail1.png'" class="customerimg" ></image>
					<view class="tem_con">{{item.name}}</view>
				</view>
			</view>
		</scroll-view>
		<view style="height:120rpx"></view>
		<view class="botwarp">
			<view class="aleardy">已选择：</view>
			<scroll-view scroll-x class="bot_scrollbox">
				<view class="botlist">
					<view class="botli">
						<view class="botname">{{checkobj && checkobj.name}}</view>
					</view>
				</view>
			</scroll-view>
			<view class="botbtn" @click="$noMultipleClicks(sureCustomer)">确定</view>
		</view>
	</view>
</template>

<script>
	import { netStaffList, netWorkOrderAssign, netTransferWorkOrder, netRepairAssign } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick: true, //防止  重复点击
				page:1,
				name:'',
				totalPage:1,
				list:[],
				checkobj:null,
				workorderid:'',  //工单id
				type:1,   //1指派   2转派
				
				mode:null,   //9电话维修  任务
				id:''
			}
		},
		onLoad(options) {
			if(options.mode) {
				this.mode = options.mode
				this.id = options.id
			}else{
				this.workorderid = options.workorderid
				this.type = options.type
			}
		},
		onShow() {
			this.getList()
		},
		onReachBottom() {
			
		},
		methods:{
			getList() {
				let params = {
					name:this.name,
				}
				netStaffList(params).then(res=>{
					let data = res.data
					data.forEach(ele=>{
						ele.select = false
					})
					this.list = data
				})
			},
			checkCustomer(item){
				this.checkobj = item
			},
			queryName(e) {
				this.getList()
			},
			sureCustomer() {
				if(this.mode == 9) {
					let params = {
						staff_id: this.checkobj.id,
						id:this.id
					}
					netRepairAssign(params).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					})
				}else{
					let params = {
						id: this.workorderid,
						staff_id: this.checkobj.id
					}
					if(this.type == 1) {
						//指派
						netWorkOrderAssign(params).then(res=>{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},2000)
						})
					}else{
						//转派
						netTransferWorkOrder(params).then(res=>{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},2000)
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searbox{
		padding:10rpx 0 20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background:$uni-btn-bg-color;
		.censear{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 24rpx;
			border-radius: 34rpx;
			background:#FFFFFF;
			width:584rpx;
			height:68rpx;
			.searimg{
				width:48rpx;
				height:48rpx;
			}
			.lself{
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 222rpx);
	}
	.tem_list{
		padding:24rpx;
		.tem_li{
			border-radius: 10rpx;
			padding:30rpx;
			background:#fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-bottom:24rpx;
			.selfradio{
				transform: scale(0.7);
			}
			.customerimg{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				margin:0 24rpx;
			}
			.tem_con{
				font-size:26rpx;
				color:#333;
			}
		}
	}
	.botwarp{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		background:#fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:0 24rpx;
		box-sizing: border-box;
		box-shadow: 1rpx 1rpx 5rpx 3rpx rgba(0,0,0,0.1);
		height:120rpx;
		.aleardy{
			font-size:24rpx;
			color:$uni-text-color;
		}
		.bot_scrollbox{
			width:460rpx;
			.botlist{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.botli{
					margin-right:24rpx;
					.botimg{
						width:60rpx;
						height:60rpx;
						border-radius: 50%;
					}
					.botname{
						font-size:24rpx;
						color:#333;
					}
				}
			}
		}
		.botbtn{
			width:140rpx;
			color:#fff;
			background:$uni-text-color;
			height:80rpx;
			text-align: center;
			line-height: 80rpx;
			font-size:24rpx;
			border-radius: 10rpx;
		}
	}
</style>
