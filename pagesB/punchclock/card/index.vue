<template>
	<view class="" style="background-color: #f5f5f5;">
		<!-- 筛选 -->
		<view class="searchbox">
			<view class="searchtext" @click="toQuery">筛选<view class="iconfont icon-shaixuan"></view></view>
		</view>
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loodMore">
			<view class="payList">
				<view class="leave_li" v-for="(item,index) in list " :key="index" @click="toDetail(item)">
					<view class="cost_status" v-if="item.check_status == 0">审核中</view>
					<view class="cost_status" v-if="item.check_status == 1">审核中</view>
					<view class="cost_status" v-if="item.check_status == 2">审核通过</view>
					<view class="cost_status" v-if="item.check_status == 3">审核未通过</view>
					<view class="cost_status" v-if="item.check_status == 4">已撤回</view>
					<view class="content"> <text>补卡类型：</text> {{item.type == 0 ? '缺卡补卡':item.type == 1 ? '早退补卡': '迟到补卡'}}</view>
					<view class="content"> <text>补卡时间：</text> {{item.time}}</view>
					<view class="content"> <text>提交时间：</text> {{item.createtime}}</view>
				</view>
				<view class="noData" v-if="list.length == 0">暂无更多</view>
			</view>
		</scroll-view>
		<view class="icon_creat" @click="addCard">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'" mode="scaleToFill"></image>
		</view>
		
		<screen-pop ref="screenChild" @sureParams="sureParams"></screen-pop>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netCardList } from '@/api/api.js'
	import screenPop from './screen.vue'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
				queryParams:{}
			}
		},
		onShow() {
			this.init()
		},
		methods:{
			toQuery(){
				this.$refs.screenChild.init()
			},
			sureParams(params) {
				this.queryParams = params
				this.init()
			},
			loodMore() {
				if(this.page < this.totalPage){
					this.page ++
					this.getList()
				}
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					page:this.page,
					...this.queryParams
				}
				netCardList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesB/punchclock/card/detail?id='+item.id
				})
			},
			
			//补卡
			addCard() {
				uni.showModal({
					title:'请在打卡统计中提交补卡申请',
					content:'按照班次提交申请，补卡更精确',
					showCancel:false,
					complete:(res)=>{
						if(res.confirm){
							// #ifdef H5 || MP-WEIXIN
							uni.navigateTo({
								url:'/pagesB/punchclock/punchstatis/indextwo'
							})
							// #endif
							// #ifdef APP-PLUS
							this.$emit('changeType')
							// #endif
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	.scrollbox{
		width:750rpx;
		height:calc(100vh - 200rpx);
	}
	.cost_status{
		position: absolute;
		right:30rpx;
		top:30rpx;
		background:$uni-bg-opacity;
		border-radius: 5rpx;
		font-size: 26rpx;
		color: $uni-text-color;
		padding: 5rpx 12rpx;
	}
	.payList{
		.leave_li{
			width:690rpx;
			border-radius: 20rpx;
			background:#fff;
			padding:30rpx;
			margin:0 auto 24rpx;
			position: relative;
			.content{
				font-size:26rpx;
				color:#333;
				margin-bottom:10rpx;
				text{
					color:#999;
				}
			}
		}
	}
	.searchbox{
		display: flex;
		justify-content: flex-end;
		margin:24rpx;
		.searchtext{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:$uni-text-color;
			padding:8rpx 28rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			.icon-shaixuan{
				color:$uni-text-color;
			}
		}
	}
</style>