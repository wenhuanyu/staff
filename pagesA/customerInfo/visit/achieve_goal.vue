<template>
	<view>
		<view class="tem_list">
			<view class="tem_li" v-for="(item,index) in list" :key="index" @click="selectSure(item,index)">
				<radio value="r1" color="#008EFF" :checked="item.select" class="selfradio" />
				<view class="tem_con">{{item.field}}</view>
			</view>
			<view class="noData" v-if="list.length == 0 || !list">暂无更多</view>
		</view>
		<view class="button" @click="sureSelect">确定</view>
	</view>
</template>

<script>
	import { netTemplateList } from '@/api/template.js'
	
	export default{
		data() {
			return{
				list:[],
				type:'任务目的',
				selectList:[]
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList() {
				netTemplateList({type:this.type}).then(res=>{
					let data = res.data.template
					data.forEach(ele=>{
						ele.select = false
					})
					this.list = data
				})
			},
			selectSure(item,index){
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
				this.handleSelect()
			},
			handleSelect() {
				this.selectList = []
				let data = this.list
				data.forEach(ele=>{
					if(ele.select){
						this.selectList.push(ele)
					}
				})
			},
			sureSelect() {
				this.$store.commit('SETACHIEVEGOAL',this.selectList)
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
