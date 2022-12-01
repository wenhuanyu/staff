<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg"></image>
				<input type="text" placeholder="请输入关键词搜索" v-model="name" @input="queryName" class="lself" placeholder-style="color:#999">
			</view>
		</view>
		<scroll-view class="scrollbox" scroll-y>
			<view class="tem_list">
				<view class="tem_li" v-for="(item,index) in list" :key="index" @click="checkCustomer(item)">
					<radio value="r1" color="#008EFF" :checked="checkobj && (checkobj.id == item.id)" class="selfradio" />
					<image :src="item.img ? item.img : '/static/index/header.png'" class="customerimg"></image>
					<view class="tem_con">{{item.name}}</view>
					<view class="tem_con">{{item.post}}</view>
				</view>
			</view>
		</scroll-view>
		<view style="height:120rpx"></view>
		<view class="botwarp">
			<view class="aleardy">已选择：</view>
			<scroll-view scroll-x class="bot_scrollbox">
				<view class="botlist">
					<view class="botli">
						<view class="botname">{{checkobj && checkobj.name ? checkobj.name : ''}}</view>
					</view>
				</view>
			</scroll-view>
			<view class="botbtn" @click="sureCustomer">确定</view>
		</view>
	</view>
</template>

<script>
	import { netStaffList, netSubordinateStaff } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				page:1,
				name:'',
				totalPage:1,
				list:[],
				checkobj:null,
				departId:'',   //部门id
				//type  获取下级员工
				type:null,  //2获取下级员工
			}
		},
		onLoad(options) {
			if(options.isDepart) {
				this.departId = options.isDepart
			}
			if(options.type){
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
				if(this.type == 2) {
					netSubordinateStaff().then(res=>{
						let data = res.data
						data.forEach(ele=>{
							ele.select = false
						})
						this.list = data
					})
				}else{
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
				}
			},
			checkCustomer(item){
				this.checkobj = item
			},
			queryName(e) {
				this.list = []
				this.getList()
			},
			sureCustomer() {
				console.log(this.checkobj,'已经选择成员')
				this.$store.commit('STAFFOBJ',this.checkobj)
				uni.navigateBack({
					delta:1
				})
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
				color:#999;
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
			padding:30rpx;
			background:#fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom:1rpx solid #f5f5f5;
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
				margin-right:30rpx;
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
			flex-shrink: 0;
		}
		.bot_scrollbox{
			width:400rpx;
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
			width:160rpx;
			color:#fff;
			background:$uni-btn-bg-color;
			height:80rpx;
			text-align: center;
			line-height: 80rpx;
			font-size:24rpx;
			border-radius: 10rpx;
		}
	}
</style>
