<template>
	<view>
		<view class="tem_list">
			<view class="tem_li" v-for="(item,index) in list" :key="index" @click="selectSure(item,index)">
				<radio value="r1" color="#008EFF" :checked="selectIndex == index" class="selfradio" />
				<view class="tem_con">{{item.field}}</view>
			</view>
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
			}
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList() {
				netTemplateList({type:'任务备注'}).then(res=>{
					this.list = res.data.template
				})
			},
			selectSure(item,index){
				this.selectIndex = index
				this.$store.commit('VISIT_PLAN_REMARKS',item.field)
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
