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
		
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMore">
			<view class="scroll_warp">
				<view class="scroll_li" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
					<view class="li_top">
						<view class="title">{{item.odd_numbers}}</view>
						<view class="status" v-if="item.check_status == 0 || item.check_status == 1">待审核</view>
						<view class="status_pass" v-if="item.check_status == 2">已同意</view>
						<view class="status_fail" v-if="item.check_status == 3 || item.check_status == 4">已拒绝</view>
					</view>
					<view class="li_bot">
						<view class="li_text">
							<view>申请人：</view>
							<view>{{item.create_staff.name}}</view>
						</view>
						<view class="li_text">
							<view>申请时间：</view>
							<view>{{item.storage_time}}</view>
						</view>
					</view>
				</view>
				<view class="noData" v-if="list.length == 0">暂无更多</view>
			</view>
		</scroll-view>
		
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { netMyApplyPartlist, netOutorInNumber } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screenPop.vue'
	
	export default{
		components:{
			screenPop
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				show:false,
				page:1,
				totalPage:1,
				name:'',
				list:[],
				tablist:[
					{id:1,name:'入库',num:1},
					{id:2,name:'出库',num:1}
				],
				tabIndex:0,
				queryParams:{},
				check_type:1,   //1我发起的 2我审批的
			}
		},
		onLoad(options) {
			this.check_type = options.type
			if(this.check_type == 1) {
				uni.setNavigationBarTitle({
					title:'我发起的'
				})
			}else if(this.check_type == 2) {
				uni.setNavigationBarTitle({
					title:'我审核的'
				})
			}
		},
		onShow() {
			this.getNumber()
		},
		methods:{
			getNumber() {
				netOutorInNumber({check_type:this.check_type}).then(res=>{
					this.tablist = [
						{id:1,name:'入库',num:res.data.ruku},
						{id:2,name:'出库',num:res.data.chuku}
					]
					this.init()
				})
			},
			changeTab(index) {
				this.tabIndex = index
				this.litabIndex = 0
				this.init()
			},
			changeItem(index) {
				this.litabIndex = index
				this.init()
			},
			loadMore() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getList()
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
			getList() {
				let params = {
					page: this.page,
					type: this.tablist[this.tabIndex].id,
					check_type: this.check_type,
					...this.queryParams
				}
				netMyApplyPartlist(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			queryData(e) {
				this.name = e
				this.init()
			},
			closePopup() {
				this.show = false
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesC/sparepart/myapplyDetail?id='+item.id+'&type='+this.check_type
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
			// width:50%;
			// text-align: center;
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
				display: inline-block;
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
		justify-content: space-around;
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
		box-sizing: border-box;
		height:calc(100vh - 234rpx);
		.scroll_warp{
			padding:24rpx;
			.scroll_li{
				background:#fff;
				border-radius: 15rpx;
				box-shadow: 1rpx 1rpx 15rpx 3rpx rgba(0,0,0,0.1);
				margin-bottom:24rpx;
				.li_top{
					padding:24rpx 30rpx;
					border-bottom:1rpx solid #f5f5f5;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom:15rpx;
					.title{
						font-size:32rpx;
						color:#333;
						flex:1;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.status{
						font-size:24rpx;
						color:$uni-text-color;
						padding:2rpx 15rpx;
						background:$uni-bg-opacity;
						border-radius: 5rpx;
					}
					.status_pass{
						font-size:24rpx;
						color:#1ABB85;
						padding:2rpx 15rpx;
						background:rgba(26, 187, 133, 0.1);
						border-radius: 5rpx;
					}
					.status_fail{
						font-size:24rpx;
						color:#F25340;
						padding:2rpx 15rpx;
						background:rgba(242, 83, 64, 0.1);
						border-radius: 5rpx;
					}
				}
				.li_bot{
					padding:24rpx 30rpx;
					.li_text{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						font-size:28rpx;
						color:#666;
						margin-bottom:15rpx;
					}
				}
				.li_status{
					font-size:24rpx;
					color:#14c2c1;
				}
			}
		}
	}
	.popbox{
		width:650rpx;
		height:100vh;
		position: relative;
		.po_title{
			font-size:30rpx;
			color:#333;
			padding:30rpx;
		}
		.po_warp{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap:wrap;
			padding:24rpx;
			.po_label{
				width:90px;
				height:60rpx;
				font-size:24rpx;
				color:#333;
				text-align: center;
				line-height: 58rpx;
				border:1rpx solid #C8C7CC;
				border-radius: 30rpx;
				margin-right:24rpx;
				margin-bottom:24rpx;
			}
		}
		.pop_btnlist{
			position: absolute;
			left:0;
			bottom:0;
			width:100%;
			height:80rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.p_btn{
				width:50%;
				height:80rpx;
				font-size:26rpx;
				color:#fff;
				text-align: center;
				line-height: 80rpx;
			}
			.btnfir{
				background:#14c2c1;
			}
			.btnsec{
				background:#ff7800;
			}
		}
	}
</style>
