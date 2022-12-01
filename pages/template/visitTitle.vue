<template>
	<view>
		<view class="tem_list">
			<view class="tem_li" v-for="(item,index) in list" :key="index" @click="selectSure(item,index)">
				<radio value="r1" color="#008EFF" :checked="selectIndex == index" class="selfradio" />
				<view class="tem_con">{{item.field}}</view>
			</view>
			<view class="noData" v-if="list.length == 0 || !list">暂无更多</view>
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
			if(options.type){
				this.type = options.type
				uni.setNavigationBarTitle({
					title: this.type
				})
			}
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
				if(this.type == '任务内容'){
					this.$store.commit('VISIT_PLAN_TITLE',item.field)
				}
				if(this.type == '服务费用'){
					this.$store.commit('SERVICE_COST',item.field)
				}
				if(this.type == '费用主题'){
					this.$store.commit('COST_TITLE',item.field)
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
