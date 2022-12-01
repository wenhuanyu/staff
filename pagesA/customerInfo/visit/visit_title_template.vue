<template>
	<view>
		<view class="tem_list">
			<view class="tem_li" v-for="(item,index) in list" :key="index" @click="selectSure(item,index)">
				<radio value="r1" color="#008EFF" :checked="selectIndex == index" class="selfradio" />
				<view class="tem_con">{{item.field}}</view>
			</view>
			<view v-if="list.length == 0 || !list" class="noData">暂无更多</view>
		</view>
	</view>
</template>

<script>
	import { netTemplateList } from '@/api/template.js'
	
	export default{
		data() {
			return{
				list:[],
				selectobj:null,
				selectIndex:null,
				type:'任务内容',  
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList() {
				netTemplateList({type:this.type}).then(res=>{
					this.list = res.data.template
				})
			},
			selectSure(item,index){
				this.selectIndex = index
				this.$store.commit('VISIT_PLAN_TITLE',item.field)
				console.log(item,'----')
				if(item.field == '设计工单'){
					uni.redirectTo({
						url:'/pagesA/afterSales/designWorkOrder/addDesignOrder?type=2'
					})
					return
				}
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tem_list{
		padding:24rpx 30rpx;
		.tem_li{
			border-radius: 10rpx;
			padding:30rpx;
			background:#fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			margin-bottom:24rpx;
			.selfradio{
				transform: scale(0.7);
			}
			.tem_con{
				font-size:26rpx;
				color:#333;
				margin-left:24rpx;
			}
		}
	}
</style>
