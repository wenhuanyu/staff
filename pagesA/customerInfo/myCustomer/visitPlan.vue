<template>
	<view class="follow_warp">
		<view class="pro_top" v-if="customerType == 1">
			<view class="top_name" @click="toShaixuan">
				<image :src="BASE_IMG_URL + '/index/green-shaixuan.png'"></image>
			</view>
			<view class="top_beizhu" @click="toAddPlan" v-if="operation == 1">
				<image :src="BASE_IMG_URL+'/index/add.png'" class="beizhuimg"></image>
			</view>
		</view>
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loodMore">
			<view class="planbox">
				<visit-plan :list="list"></visit-plan>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	import { netCustomerEventlist } from '@/api/api.js'
	import visitPlan from '@/pages/index/visit/index.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	
	export default{
		components:{
			visitPlan
		},
		props:{
			customerType:{
				type:Number,
				default:1   ////1我的客户   2公海客户
			},
			operation:{
				type:Number,
				default:1
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
				customerid:'',
				queryObj:{}
			}
		},
		methods:{
			toShaixuan() {
				this.$emit('shaixuan')
			},
			sureQuery(params) {
				this.queryObj = params
				this.init(this.customerid)
			},
			//添加 任务计划
			toAddPlan() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/createVisit?customerid='+this.customerid
				})
			},
			init(id) {
				this.customerid = id
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					customer_id: this.customerid,
					page:this.page,
					...this.queryObj
				}
				netCustomerEventlist(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			loodMore(){
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getList()
			}
		}
	}
</script>

<style scoped lang="scss">
	.pro_top{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background:#fff;
		padding:24rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		.top_name{
			width: 40rpx;
			height: 31rpx;
			margin-right:35rpx;
			image{
				width: 40rpx;
				height: 31rpx;
			}
		}
		.top_beizhu{
			width:38rpx;
			height:38rpx;
			margin-right:10rpx;
			.beizhuimg{
				width:38rpx;
				height:38rpx;
			}
		}
	}
.follow_warp{
	width:750rpx;
	height:calc(100vh - 100rpx);
	.scrollbox{
		width:100%;
		height:calc(100vh - 100rpx);
		.planbox{
			width:690rpx;
			margin:24rpx auto;
			// border-radius: 20rpx;
			// box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			// padding:30rpx 36rpx;
		}
	}
}
</style>
