<template>
	<view>
		<view class="litab">
			<view class="litab_item" 
			:class="tabIndex == index ? 'litab_item_active' : ''"
			v-for="(item,index) in tablist" 
			:key="index"
			@click="changeTab(index)"
			>
				{{item.name}}
				<view class="space"></view>
				<image :src="BASE_IMG_URL + '/index/green-small-cancel.png'" ></image>
			</view>
			<view class="screen_box">
				<view v-if="tabIndex == 0">
					<view class="screen_left" @click="toAllOpe">
						<image :src="BASE_IMG_URL + '/index/allOpera.png'" ></image>
					</view>
				</view>
				<view v-else></view>
				<view class="screen_right" @click="toQuery">
					<image :src="BASE_IMG_URL + '/index/green-shaixuan.png'" class="bottomimg" ></image>
				</view>
			</view>
		</view>
		
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loadmore">
			<view class="listwarp">
				<view class="itemwarp" v-for="(item,index) in list" :key="index" @tap.stop="toDetail(item)">
					<view class="new_top">
						<view class="item_radio" v-if="isAllopera" @tap.stop="toSelectItem(index)">
							<radio value="r1" :checked="item.select" color="#008EFF"></radio>
						</view>
						<view class="item_title" >费用单号：{{item.number}}</view>
					</view>
					<view class="item_info">
						<view class="item_info_left">
							<view>
								<view class="item_text" >消费金额：{{item.money}}</view>
								<view class="item_text" >关联客户：{{item.customer?item.customer.name:'无'}}</view>
								<view class="item_text" >消费日期：{{item.submit_date}}</view>
							</view>
						</view>
						<view class="item_text_staff" v-if="item.staff">
							<image :src="item.staff.img" class="staffimg" ></image>
							<text>{{item.staff.name}}</text>
						</view>
					</view>
					<view class="item_bot" v-if="tabIndex == 0 && !isAllopera" @tap.stop.prevent>
						<view class="item_btn" @tap.stop="toPaymoney(item)">
							<image :src="BASE_IMG_URL + '/index/expenses-one.png'" ></image>
							<text>打款</text>
						</view>
					</view>
				</view>
				<view class="noData" v-if="list.length == 0">暂无更多</view>
			</view>
		</scroll-view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery" :type="2"></screen-pop>
		
		<!-- 批量审批按钮 -->
		<view style="height:120rpx" v-if="isAllopera"></view>
		<view class="bot_warp" v-if="isAllopera">
			<view class="allOpera">
				<view class="screen_left" v-if="!isSelectAll" @click="toSelect">全选</view>
				<view class="screen_left" v-else @click="toRemove">取消</view>
			</view>
			<view class="totalmoney">总计：<text>{{totalMoney}}</text></view>
			<view class="bot_btn" @click="toAllPay">批量打款</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netCashierList, netCashierMoney } from '@/api/api.js'
	import screenPop from './screen_pop.vue'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				tablist:[
					{id:0,name:'未打款'},
					{id:1,name:'已打款'}
				],
				tabIndex:0,
				isAllopera:false,
				isSelectAll:false,
				page:1,
				totalPage:1,
				list:[],
				queryObj:{},
				totalMoney:0,   //总金额
			}
		},
		onLoad() {
			this.$store.commit('STAFFOBJ',null)
			this.$store.commit('CUSTOMEROBJ',null)
		},
		onShow() {
			this.init()
		},
		methods:{
			toQuery() {
				this.$refs.screenChild.open()
			},
			changeTab(index) {
				this.tabIndex = index
				this.init()
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			sureQuery(params) {
				this.queryObj = params
				this.init()
			},
			loadmore() {
				if(this.page < this.totalPage){
					this.page ++ 
					this.getList()
				}
			},
			getList() {
				let params = {
					page:this.page,
					is_cashier:this.tabIndex,
					...this.queryObj
				}
				netCashierList(params).then(res=>{
					let data = res.data.data
					data.forEach(ele=>{
						ele.select = false
					})
					this.list = this.list.concat(data)
					this.totalPage = res.data.last_page
				})
			},
			toAllOpe() {
				this.isAllopera = !this.isAllopera
			},
			toSelect() {
				let data = this.list
				data.forEach(ele=>{
					ele.select = true
				})
				this.list = data
				//计算金额
				this.handleMoney()
				this.isSelectAll = !this.isSelectAll
			},
			toRemove() {
				let data = this.list
				data.forEach(ele=>{
					ele.select = false
				})
				this.list = data
				//计算金额
				this.handleMoney()
				this.isSelectAll = !this.isSelectAll
			},
			toRemoveOpe() {
				this.isAllopera = false
				this.toRemove()
			},
			toSelectItem(index) {
				console.log(index,'操作')
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
				//计算金额
				this.handleMoney()
			},
			handleMoney() {
				let arr = this.list
				let money = 0
				arr.forEach(ele=>{
					if(ele.select) {
						money += Number(ele.money)
					}
				})
				this.totalMoney = money
			},
			//打款
			toPaymoney(item) {
				let params = {ids:item.id}
				uni.showModal({
					title:'提示',
					content:'请确认是否打款?',
					success:(res)=>{
						if(res.confirm){
							this.toPay(params)
						}
					}
				})
			},
			toAllPay() {
				let arr = []
				this.list.forEach(ele=>{
					if(ele.select) {
						arr.push(ele.id)
					}
				})
				if(arr.length == 0){
					uni.showToast({
						title:'选择打款人',
						icon:'none'
					})
					return;
				}
				let params = { ids:arr.join(',') }
				uni.showModal({
					title:'提示',
					content:'请确认是否打款?',
					success:(res)=>{
						if(res.confirm){
							this.toPay(params)
						}
					}
				})
			},
			toPay(params) {
				netCashierMoney(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.isAllopera = false
						this.isSelectAll = false
						this.init()
					},2000)
				})
			},
			//详情
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/detail?id='+item.id+'&type=chuna'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bot_warp{
		width:750rpx;
		height:100rpx;
		border-top:1rpx solid #f5f5f5;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding:0 35rpx;
		background:#fff;
		z-index: 999;
		position: fixed;
		left:0;
		bottom:0;
		.totalmoney{
			font-size:28rpx;
			color:#007AFF;
		}
		.bot_btn{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 200rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1rpx solid $uni-btn-bg-color;
			border-radius: 10rpx;
			font-size:24rpx;
			color:$uni-text-color;
		}
		.allOpera{
			font-size: 26rpx;
			color: $uni-text-color;
		}
		.totalmoney{
			font-size: 26rpx;
			color: #333;
			text{
				font-size: 26rpx;
				color: $uni-text-color;
			}
		}
	}
	.itemwarp{
		width:690rpx;
		border-radius: 10rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		margin:24rpx auto 0;
		padding:0 40rpx;
		.new_top{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom:1rpx solid #f5f5f5;
			padding:24rpx 0;
		}
		.item_radio{
			width:37rpx;
			height:37rpx;
			margin-right:24rpx;
			radio{
				transform: scale(0.7);
			}
		}
		.item_title{
			font-size:26rpx;
			color:#666;
		}
		.item_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0 24rpx;
			.item_info_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.item_text{
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
				}
			}
			
			.item_text_staff{
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size:26rpx;
				color:#999999;
				.staffimg{
					width:88rpx;
					height:88rpx;
					border-radius: 50%;
				}
				text{
					margin-top: 20rpx;
				}
			}
			.item_info_right{
				width:121rpx;
				height:93rpx;
				flex-shrink: 0;
				margin-left:24rpx;
				.itemstatusimg{
					width:121rpx;
					height:93rpx;
				}
			}
		}
		.item_text{
			font-size:26rpx;
			color:#999999;
			margin-bottom:15rpx;
		}
		.item_bot{
			padding:24rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
			border-top:1rpx solid #f5f5f5;
			.item_btn{
				display: flex;
				align-items: center;
				
				text{
					font-size:26rpx;
					color:$uni-btn-bg-color;
				}
				image{
					margin-right: 15rpx;
					width: 29rpx;
					height: 26rpx;
				}
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 100rpx);
		.listwarp{
			padding:0 0 24rpx;
		}
	}
	.litab{
		display: flex;
		justify-content: space-around;
		align-items: center;
		width:750rpx;
		height: 100rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		.litab_item{
			text-align: center;
			font-size:26rpx;
			color:#999999;
			.space{
				margin-top: 10rpx;
				width: 12rpx;
				height: 6rpx;
				background-color: rgba(0,0,0,0);
			}
			image{
				display: none;
			}
		}
		.litab_item_active{
			display: flex;
			flex-direction: column;
			align-items: center;
			color:$uni-text-color;
			font-size: 26rpx;
			.space{
				display: none;
			}
			image{
				margin-top: 10rpx;
				display: inline-block;
				width: 12rpx;
				height: 6rpx;
			}
		}
	}
	
	.screen_box{
		display: flex;
		.left_warp{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.screen_left{
				margin-right:15rpx;
				&:last-child{
					margin-right:0;
				}
			}
		}
		.screen_left{
			
			image{
				width: 30rpx;
				height: 30rpx;
			}
		}
		.screen_right{
			margin-left: 40rpx;
			.bottomimg{
				width:35rpx;
				height:27rpx;
			}
		}
	}
</style>
