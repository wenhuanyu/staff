<template>
	<view>
		<view class="tabwarp">
			<view class="tabli"
				:class="tabIndex == index ? 'tabliactive' : ''" 
				v-for="(item,index) in tablist" 
				:key="index"
				@click="changeTab(index)"
				>
				<view class="tabtext">{{item.name}}</view>
				<image :src="BASE_IMG_URL + '/index/white-small-cancel.png'" ></image>
				<view class="space"></view>
			</view>
			<view class="screen_left" v-if="tabIndex == 1 && queryObj.check_status == 1" @click="toAllOpe">
				<image :src="BASE_IMG_URL + '/index/allOpera_white.png'" ></image>
			</view>
			<image :src="BASE_IMG_URL+'/index/shaixuan.png'" @click="screenBox" class="searchimg"></image>
		</view>
		
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loadmore">
			<view class="listwarp">
				<cost-item 
					:list="list" 
					:isAllopera="isAllopera" 
					@selectItem="selectItem" 
					:type="tablist[tabIndex] && tablist[tabIndex].id" 
				></cost-item>
			</view>
		</scroll-view>
		
		<!-- 创建费用 -->
		<view class="icon_creat" @click="createCostOrder">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'"></image>
		</view>
		
		<!-- 批量审批按钮 -->
		<view style="height:120rpx" v-if="isAllopera"></view>
		<view class="bot_warp" v-if="isAllopera">
			<view class="allOpera">
				<view class="screen_left" v-if="!isSelectAll" @click="toSelect">全选</view>
				<view class="screen_left" v-else @click="toRemove">取消</view>
			</view>
			<view class="bot_btn" @click="toExamine(2)">拒绝</view>
			<view class="bot_btn" @click="toExamine(1)">同意</view>
		</view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import costItem from './item.vue'
	import { netCostList, netCostNumber, netAllExamineCost } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import screenPop from './screen_pop.vue'
	
	
	export default{
		components:{
			costItem,
			screenPop
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				tablist:[
					{id:1,name:'所有的',num:1},
					{id:2,name:'我审核的',num:2}
					// {id:3,name:'全部',num:3}
				],
				tabIndex:0,
				page:1,
				totalPage:1,
				list:[],
				queryObj:{},

				isAllopera:false, //是否多选
				isSelectAll:false ,//是否全选
			}
		},
		onLoad() {	
			this.init()
			this.getNumber()
			uni.setStorageSync('editCostFlag',false)
			this.$store.commit('CUSTOMEROBJ',null)
			this.$store.commit('STAFFOBJ',null)
		},
		onUnload() {
			this.$store.commit('CUSTOMEROBJ',null)
			this.$store.commit('STAFFOBJ',null)
			uni.setStorageSync('editCostFlag',false)
		},
		onShow() {
			let flag = uni.getStorageSync('editCostFlag')
			
			if(flag){
				this.init()
				this.getNumber()
			}
		},
		methods:{
			//筛选
			screenBox() {
				this.$refs.screenChild.open()
			},
			getNumber() {
				netCostNumber().then(res=>{
					this.tablist = [
						{id:1,name:'我发起的',num:res.data.faqi},
						{id:2,name:'我审核的',num:res.data.shenpi}
						// {id:3,name:'全部',num:res.data.shenpi}
					]
				})
			},
			changeTab(index) {
				this.tabIndex = index
				if(this.tabIndex != 1) {
					this.isAllopera = false
					this.isSelectAll = false
				}
				this.init()
			},
			sureQuery(params) {
				this.queryObj = params
				this.init()
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList(){
				let params = {
					type: this.tablist[this.tabIndex].id,
					...this.queryObj
				}
				netCostList(params).then(res=>{
					let data = res.data.data
					if(this.tabIndex == 1 && this.queryObj.check_status == 1) {
						//处理data数据
						data.forEach(ele=>{
							ele.select = false
						})
					}
					this.list = this.list.concat(data)
					this.totalPage = res.data.last_page
					
				})
			},
			handleDate() {
				let arr = this.list
				arr.forEach(ele=>{
					ele.select = false
				})
				this.list = arr
			},
			//批量操作
			toAllOpe() {
				this.isAllopera = !this.isAllopera
				this.isSelectAll = !this.isSelectAll
				this.handleDate()
				console.log(this.isAllopera,this.isSelectAll)
			},
			//全选
			toSelect() {
				this.isSelectAll = true
				let arr = this.list
				arr.forEach(ele=>{
					ele.select = true
				})
				this.list = arr
			},
			//取消全选
			toRemove() {
				this.isSelectAll = false
				this.handleDate()
			},
			//取消操作
			// toRemoveOpe() {
			// 	this.isAllopera = false
			// 	this.isSelectAll = false
			// 	this.handleDate()
			// },
			//单个选
			selectItem(index) {
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
			},
			//去审核
			toExamine(status) {
				//status 1成功   2失败
				let arr = []
				this.list.forEach(ele=>{
					if(ele.select){
						arr.push(ele.id)
					}
				})
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/examineCost?status='+status+'&id='+arr.join(',')
				})
			},
			loadmore() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getList()
			},
			createCostOrder() {
				this.$store.commit('CUSTOMEROBJ',null)
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost'
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
		.allOpera{
			margin: 0 30rpx 0;
			.screen_left{
				font-size: 26rpx;
				color:$uni-text-color;
			}
		}
		.bot_btn{
			width: 200rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1rpx solid $uni-btn-bg-color;
			border-radius: 10rpx;
			text-align: center;
			line-height: 60rpx;
			font-size:26rpx;
			color:$uni-text-color;
		}
	}
	.screen_box{
		// width:690rpx;
		// padding:24rpx 45rpx 0;
		// margin:0 auto;
		// border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		.left_warp{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			// .screen_left{
			// 	margin-right:15rpx;
			// 	&:last-child{
			// 		margin-right:0;
			// 	}
			// }
		}
		.screen_left{
			image{
				width: 30rpx;
				height: 30rpx;
			}
		}
		.screen_right{
			
			.bottomimg{
				margin-left: 30rpx;
				width: 35rpx;
				height: 27rpx;
			}
		}
	}
	.tabwarp{
		padding:0 24rpx 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-color: $uni-btn-bg-color;
		position: relative;
		.searchimg{
			width:37rpx;
			height:30rpx;
			position: absolute;
			right:50rpx;
			top:20rpx;
		}
		.screen_left{
			position: absolute;
			top:20rpx;
			right:130rpx;
			image{
				width: 30rpx;
				height: 30rpx;
			}
		}
		.tabli{
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.tabnum{
				font-size:34rpx;
				color:#666666;
			}
			.tabtext{
				font-size:28rpx;
				color:#FEFEFE;
				margin:15rpx 0;
			}
			.space{
				width: 12rpx;
				height: 6rpx;
				background-color: rgba(0,0,0,0);
			}
			image{
				display: none;
			}
		}
		.tabli:nth-child(2){
			margin: 0 30rpx;
		}
		.tabliactive{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.tabnum{
				color:#0287FF;
			}
			.tabtext{
				color:#FFFFFF;
			}
			.space{
				display: none;
			}
			image{
				display: inline-block;
				width: 12rpx;
				height: 6rpx;
			}
		}
	}
	.litab{
		padding: 0 30rpx;
		width:100%;
		height:100rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.litab_item{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// width:33.33%;
			font-size:26rpx;
			color:#999999;
			.litab_text{
				padding-bottom: 15rpx;
				color:#999;
			}
			.space{
				width: 12rpx;
				height: 6rpx;
				background-color: rgba(0,0,0,0);
			}
			image{
				display: none;
			}
		}
		.litab_item_active{
			.litab_text{
				padding-bottom: 15rpx;
				color:$uni-text-color;
			}
			.space{
				display: none;
			}
			image{
				display: inline-block;
				width: 12rpx;
				height: 6rpx;
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
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 130rpx;
		right: 100rpx;
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
	}
</style>
