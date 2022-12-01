<template>
	<view>
		<!-- 搜索 -->
		<search-box @queryData="queryData" @showModal="showSc"></search-box>
		<view class="artic_warp">
			<view class="artic_item" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
				<view class="artic_top">
					<view class="artic_name">{{item.title}}</view>
					<view class="artic_info">
					<image :src="item.img" class="artic_img" ></image>
						<view class="artic_con">{{item.desc}}</view>
					</view>
				</view>
				<view class="artic_bot">
					<view class="bot_left">
						<view class="bot_time">{{item.createtime}}</view>
					</view>
					<view class="bot_right">
						<view class="bot_right_box">
							<image :src="BASE_IMG_URL+'/index/yulan.png'" class="openimg" ></image>
							{{item.click_number}}
						</view>
						<view class="bot_right_box">
							<image :src="BASE_IMG_URL+'/index/pinglun.png'" class="commimg" ></image>
							{{item.comment_num}}
						</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
		
		<!-- 创建 -->
		<view class="icon_creat" @click="createArticle" v-if="type_id">
			<image :src="BASE_IMG_URL+'/index/add.png'"></image>
		</view>
		
		<screen-pop 
			ref="screenChild"
			@sureQuery="sureParams"
		></screen-pop>
	</view>
</template>

<script>
	import { netArticleList,netKnowledgeList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screen'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				type_id:'',
				pid:'',
				pname:'',
				name:'',
				list:[],
				page:1,
				totalPage:1,
				focus:false,
				name:'',
				showSelectL:false,//显示筛选选项
				showSelectR:false,
				parentList:[],
				parentIndex:0,
				parentid:'',
				typeList:[],
				typeIndex:0,
				queryParams:{}
			}
		},
		onLoad(options) {
			this.init()
		},
		onShow() {
			
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods:{
			//搜索
			queryData(e) {
				this.name = e.value
				this.list = []
				this.getList()
			},
			//筛选
			showSc() {
				this.$refs.screenChild.open()
			},
			sureParams(params) {
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
					page:this.page,
					name:this.name,
					...this.queryParams
				}
				netArticleList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/user/knowledge_base/detail?id='+item.id+'&tid='+this.type_id+'&pid='+this.pid
				})
			},
			//添加
			createArticle() {
				uni.navigateTo({
					url:'/pagesA/user/knowledge_base/addArticle?tid='+this.type_id+'&pid='+this.pid
				})
			},
			
			handleClickLeft(){
				this.showSelectR = false
				this.showSelectL = true
			},
			handleClickRight(){
				this.showSelectL = false
				this.showSelectR = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topChose{
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100rpx;
		.left{
			display: flex;
			justify-content: center;
			image{
				width:42rpx;
				height:42rpx;
				margin-left:10rpx;
			}
			view{
				font-size: 26rpx;
				color: $uni-text-color;
			}
		}
	}
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
			width:487rpx;
			height:60rpx;
			.searimg{
				width:35rpx;
				height:35rpx;
				margin-right: 15rpx;
			}
			.lself{
				.lself{
					font-size:26rpx;
					color:rgba(2, 135, 255, 1);
				}
			}
		}
	}
	.artic_title{
		width:690rpx;
		background:#fff;
		border-radius: 10rpx;
		margin:24rpx auto;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		font-size:34rpx;
		color:#0287FF;
		text-align: center;
		line-height: 70rpx;
	}
	.artic_warp{
		padding-top:24rpx;
		.artic_item{
			width:690rpx;
			margin:0 auto 24rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			padding:24rpx 30rpx;
			border-radius: 20rpx;
			.artic_top{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				.artic_img{
					width:140rpx;
					height:140rpx;
					border-radius: 10rpx;
					margin-right:30rpx;
					flex-shrink: 0;
				}
				.artic_name{
					width:390rpx;
					font-size:28rpx;
					color:#666;
					margin-bottom:24rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.artic_info{
					display: flex;
					flex-wrap: nowrap;
					.artic_con{
						font-size:26rpx;
						height:100rpx;
						color:#999;
						line-height: 34rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						overflow: hidden;
					}
				}
			}
			.artic_bot{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top:30rpx;
				.bot_left{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.headerimg{
						width:50rpx;
						height:50rpx;
						border-radius: 50%;
					}
					.bot_name{
						font-size:26rpx;
						color:#999999;
						margin:0 30rpx;
					}
					.bot_time{
						font-size:26rpx;
						color:#999999;
					}
				}
				.bot_right{
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.bot_right_box{
						display: flex;
						justify-content: center;
						align-items: center;
						font-size:26rpx;
						color:#999999;
						margin-right:24rpx;
						.openimg{
							width:44rpx;
							height:44rpx;
							margin-right:10rpx;
						}
						.commimg{
							width:38rpx;
							height:38rpx;
							margin-right:10rpx;
						}
					}
				}
			}
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
