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
			<image :src="BASE_IMG_URL+'/index/shaixuan.png'" @click="toSearch" class="searchimg"></image>
		</view>
		
		<scroll-view scroll-y class="scrollbox">
			<view class="listwarp">
				<approval-item :list="list" :type="tablist[tabIndex].id"></approval-item>
			</view>
		</scroll-view>
		
		<!-- 创建用户图标 -->
		<view class="icon_creat" @click="createWorkaproval">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'"></image>
		</view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import approvalItem from '@/pages/user/work_approval/item.vue'
	import { netWorkExamineList, netWorkExamineNumber } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screenPop.vue'
	
	export default{
		components:{
			approvalItem,
			screenPop
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				tablist:[
					{id:1,name:'全部',num:0},
					{id:2,name:'我发起的',num:0},
					{id:3,name:'我审核的'}
				],
				tabIndex:0,
				page:1,
				totalPage:1,
				list:[],
				queryParams:{}
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.init()
			//获取 数量
			this.getNumber()
		},
		methods:{
			getNumber() {
				netWorkExamineNumber().then(res=>{
					this.tablist = [
						{id:1,name:'全部',num:res.data.woshenhe},
						{id:2,name:'我发起的',num:res.data.wofaqi},
						{id:3,name:'我审核的',num:res.data.woshenhe}
					]
				})
			},
			changeTab(index) {
				this.tabIndex = index
				this.init()
			},
			toSearch() {
				this.$refs.screenChild.open()
			},
			sureQuery(params) {
				this.queryParams = params
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
					...this.queryParams
				}
				netWorkExamineList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			createWorkaproval() {
				uni.navigateTo({
					url:'/pagesA/user/work_approval/createTab'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
		height:calc(100vh - 234rpx);
	}
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 130rpx;
		right: 50rpx;
		image {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
		}
	}
</style>
