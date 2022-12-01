<template>
	<view>
		<!-- 搜索 -->
		<view class="searbox">
			<view class="censear">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入关键词搜索" @focus="toSearch" class="lself" placeholder-style="color:#4E80F5">
			</view>
		</view>
		<view class="topChose">
			<view class="left" @click="handleClickLeft">
				<view>{{choseName}}</view>
				<image :src="BASE_IMG_URL+'/index/xiangxia.png'" class="xiaimg" ></image>
			</view>
			<view class="right" @click="handleClickRight">
				<view>{{choseType}}</view>
				<image :src="BASE_IMG_URL+'/index/xiangxia.png'" class="xiaimg" ></image>
			</view>
		</view>
		<!-- 筛选条件 -->
		<view class="mask" v-if="showSelectL">
			<view class="screebox">
				<scroll-view scroll-y class="scrollsele">
					<view class="listwarp">
						<view class="list_item" :class="parentid == item.id ? 'list_item_active' : ''" v-for="(item,index) in parentList" :key="index" @click="changeParent(item)">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="mask" v-if="showSelectR">
			<view class="screebox">
				<scroll-view scroll-y class="scrollsele">
					<view class="listwarp">
						<view class="tab_item" :class="typeIndex == index ? 'tab_item_active' : ''" v-for="(item,index) in typeList" :key="index" @click="changeType(item,index)">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 筛选条件 -->
		
		<view class="know_warp">
			<view class="know_left">
				<scroll-view scroll-y class="leftscroll">
					<view class="listwarp">
						<view class="list_item" :class="parentid == item.id ? 'list_item_active' : ''" v-for="(item,index) in parentList" :key="index" @click="changeParent(item)">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
			<view class="know_right">
				<view class="right_title">问题分类</view>
				<scroll-view scroll-y class="rightscroll">
					<view class="tabwarp">
						<view class="tab_item" :class="typeIndex == index ? 'tab_item_active' : ''" v-for="(item,index) in typeList" :key="index" @click="changeType(index)">{{item.name}}</view>
						<view class="noData" v-if="typeList.length == 0">暂无更多</view>
					</view>
				</scroll-view>
				<view class="right_btn" @click="sureList">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netKnowledgeList, netArticleList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				pid:0,
				parentList:[],
				parentid:'',
				parentname:'',
				typeList:[],
				typeIndex:null,
				name:'',
				showSelectL:false,//显示筛选选项
				showSelectR:false,
				choseName:"",//选择后显示的机器名称
				choseType:"",//选择后显示的问题类型
			}
		},
		onLoad() {
			this.getList()
		},
		methods:{
			toSearch() {
				uni.navigateTo({
					url:'/pagesA/user/knowledge_base/list?type=1'
				})
			},
			getList() {
				netKnowledgeList({pid:this.pid}).then(res=>{
					this.parentList = res.data
					this.parentid = res.data[0].id
					this.parentname = res.data[0].name
					this.choseName = res.data[0].name
					this.getChild()
				})
			},
			changeParent(item) {
				this.parentid = item.id
				this.parentname = item.name
				this.typeIndex = null
				this.getChild()
				this.showSelectL = false
				this.choseName = item.name
			},
			getChild() {
				netKnowledgeList({pid:this.parentid}).then(res=>{
					this.typeList = res.data
					if(res.data.length != 0){
						this.choseType = res.data[0].name
					}else{
						this.choseType = '暂无'
					}
				})
			},
			changeType(item,index) {
				this.typeIndex = index
				this.choseType = item.name
				this.showSelectR = false
			},
			
			sureList() {
				if(!this.typeList[this.typeIndex]) {
					uni.showToast({
						title:'请选择问题分类',
						icon:'none'
					})
					return
				}
				let id = this.typeList[this.typeIndex].id
				let pname = this.parentname
				let name = this.typeList[this.typeIndex].name
				let pid = this.parentid
				uni.navigateTo({
					url:'/pagesA/user/knowledge_base/list?id='+id+'&pname='+pname+'&name='+name+'&pid='+pid
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
		>view{
			display: flex;
			justify-content: space-around;
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
			width:584rpx;
			height:68rpx;
			.searimg{
				width:48rpx;
				height:48rpx;
			}
			.lself{
				.lself{
					font-size:26rpx;
					color:rgba(2, 135, 255, 1);
				}
			}
		}
	}
	.know_warp{
		width:750rpx;
		height:calc(100vh - 100rpx);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.know_left{
			width:250rpx;
			height:calc(100vh - 100rpx);
			.leftscroll{
				width:100%;
				height:100%;
				background:#f5f5f5;
				.listwarp{
					.list_item{
						font-size:32rpx;
						color:#999999;
						padding:30rpx 40rpx;
						background:#f5f5f5;
						border-bottom:1rpx solid rgba(153, 153, 153, 0.5);
						border-right:1rpx solid rgba(153, 153, 153, 0.5);
					}
					.list_item_active{
						background:#fff;
						color:#0287FF;
						border-right:0;
						position: relative;
						&::before{
							width:20rpx;
							height:100%;
							content:'';
							position: absolute;
							left:0;
							top:0;
							background:#0287FF;
						}
					}
				}
			}
		}
		.know_right{
			width:500rpx;
			height:calc(100vh - 82rpx);
			.right_title{
				font-size:30rpx;
				color:#666666;
				text-align: center;
				padding:30rpx 0;
			}
			.right_btn{
				width:415rpx;
				height:88rpx;
				border-radius: 10rpx;
				background:#0287FF;
				font-size:32rpx;
				color:#fff;
				text-align: center;
				line-height: 88rpx;
				margin:24rpx auto;
			}
			.rightscroll{
				width:100%;
				height:calc(100vh - 312rpx);
				.tabwarp{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;
					.tab_item{
						font-size:30rpx;
						padding:10rpx 34rpx;
						border-radius: 10rpx;
						border:1rpx solid #0287FF;
						color:#0287FF;
						margin-right:15rpx;
						margin-left:15rpx;
						margin-bottom:24rpx;
						flex-shrink: 0;
					}
					.tab_item_active{
						background:#0287FF;
						color:#fff;
					}
				}
			}
		}
	}
</style>
