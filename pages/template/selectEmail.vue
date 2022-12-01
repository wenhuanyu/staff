<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg"></image>
				<input type="text" placeholder="请输入关键词搜索" @input="queryData" class="lself" placeholder-style="color:#999">
			</view>
		</view>
		<!-- tab -->
		<view class="tabwarp">
			<view class="tabli" :class="tabindex == 1 ? 'tabactive' : ''" @click="changeTab(1)">客户</view>
			<view class="tabli" :class="tabindex == 2 ? 'tabactive' : ''" @click="changeTab(2)">内部员工</view>
		</view>
		<scroll-view class="scrollbox" scroll-y v-if="tabindex == 1">
			<view class="itemwarp">
				<view class="itemli" v-for="(item,index) in customerList" :key="index" @click="selectCus(index)">
					<radio value="1" :checked="item.isSelect" color="#008EFF" class="selfRadio"></radio>
					<view class="item_right">
						<view class="item_name">{{item.name}}</view>
						<view class="item_account">{{item.email}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<scroll-view class="scrollbox" scroll-y v-if="tabindex == 2">
			<view class="itemwarp">
				<view class="itemli" v-for="(item,index) in staffEmailList" :key="index" @click="selectStaff(index)">
					<radio value="1" :checked="item.isSelect" color="#008EFF" class="selfRadio"></radio>
					<view class="item_right">
						<view class="item_name">{{item.name}}</view>
						<view class="item_account">{{item.email}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="bottom">
			<view class="botright">已选择{{staffselectAll.length + cusselectAll.length}}人</view>
			<view class="bot_btn" @click="sure">确定</view>
		</view>
		
	</view>
</template>

<script>
	import { netCustomerLinkEmail, netStaffLinkEmail } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				tabindex:1,
				name:'',
				customerList:[],
				staffEmailList:[],
				cusselectAll:[],
				staffselectAll:[],
				type:1,   //1收件人   2抄送人
			}
		},
		onLoad(options) {
			this.type = options.type
			this.getCusEmail()
			this.getStaffEmail()
		},
		methods:{
			changeTab(type) {
				this.tabindex = type
				if(this.tabindex == 1) {
					this.getCusEmail()
				}else{
					this.getStaffEmail()
				}
			},
			queryData(e) {
				this.name = e.detail.value
				if(this.tabindex == 1) {
					this.getCusEmail()
				}else{
					this.getStaffEmail()
				}
			},
			getCusEmail() {
				netCustomerLinkEmail({name:this.name}).then(res=>{
					let data = this.handle(res.data)
					this.customerList = data
				})
			},
			getStaffEmail() {
				netStaffLinkEmail({name:this.name}).then(res=>{
					let data = this.handle(res.data)
					this.staffEmailList = data
				})
			},
			handle(data) {
				data.forEach(ele=>{
					ele.isSelect = false
				})
				return data
			},
			selectCus(index) {
				let obj = this.customerList[index]
				obj.isSelect = !obj.isSelect
				this.$set(this.customerList,index,obj)
				this.handleCus()
			},
			selectStaff(index) {
				let obj = this.staffEmailList[index]
				obj.isSelect = !obj.isSelect
				this.$set(this.staffEmailList,index,obj)
				this.handleStaff()
			},
			handleCus() {
				this.cusselectAll = []
				let arr = this.customerList
				arr.forEach(ele=>{
					if(ele.isSelect){
						this.cusselectAll.push(ele)
					}
				})
			},
			handleStaff() {
				this.staffselectAll = []
				let arr = this.staffEmailList
				arr.forEach(ele=>{
					if(ele.isSelect){
						this.staffselectAll.push(ele)
					}
				})
			},
			sure() {
				let arr = this.cusselectAll.concat(this.staffselectAll)
				if(this.type == 1) {
					//收件人
					this.$store.commit('SENDEMAILLIST',arr)
				}else{
					//抄送人
					this.$store.commit('CCLIST',arr)
				}
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
	.tabwarp{
		width:690rpx;
		height:80rpx;
		border-radius: 20rpx;
		margin:24rpx auto;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		background:#fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.tabli{
			width:50%;
			font-size:30rpx;
			color:#333;
			text-align: center;
			line-height: 80rpx;
		}
		.tabactive{
			background:$uni-bg-opacity;
			color:$uni-text-color;
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 278rpx);
		.itemwarp{
			margin:24rpx 0;
			.itemli{
				width:690rpx;
				padding:30rpx;
				border-radius: 20rpx;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				margin:0 auto 24rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.selfRadio{
					transform: scale(0.7);
				}
				.item_right{
					margin-left:24rpx;
					.item_name{
						font-size:32rpx;
						color:#333;
					}
					.item_account{
						font-size:28rpx;
						color:#999;
						margin-top:15rpx;
					}
				}
			}
		}
	}
	.bottom{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:98rpx;
		background:#fff;
		padding:0 45rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		.botright{
			font-size:30rpx;
			color:$uni-text-color;
		}
		.bot_btn{
			width:140rpx;
			height:60rpx;
			background:$uni-text-color;
			font-size:28rpx;
			color:#fff;
			text-align: center;
			line-height: 60rpx;
			border-radius: 20rpx;
		}
	}
</style>
