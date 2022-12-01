<template>
	<view>
		<view class="tem_list">
			<view class="tem_li" v-for="(item,index) in list" :key="index" @click="selectSure(index)">
				<radio value="r1" color="#008EFF" :checked="item.select" class="selfradio" />
				<view class="tem_con">{{item.field}}</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
		<view style="height:120rpx;"></view>
		<view class="botwarp">
			<view class="botbtn" @click="sureSelect">确定</view>
		</view>
	</view>
</template>

<script>
	import { netTemplateList } from '@/api/template.js'
	
	export default{
		data() {
			return{
				list:[],
				
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList() {
				netTemplateList({type:'工单标题'}).then(res=>{
					let data = res.data.template
					data.forEach(ele=>{
						ele.select = false
					})
					this.list = data
				})
			},
			selectSure(index){
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
			},
			sureSelect() {
				let arr = []
				this.list.forEach(ele=>{
					if(ele.select){
						arr.push(ele.field)
					}
				})
				this.$store.commit('WORKORDER_TITLE',arr.join('，'))
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
	.botwarp{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background:#fff;
		z-index: 9;
		border-top:1rpx solid #f5f5f5;
		.botbtn{
			width:660rpx;
			height:80rpx;
			border-radius: 10rpx;
			background:$uni-text-color;
			color:#fff;
			font-size:26rpx;
			text-align: center;
			line-height: 80rpx;
		}
	}
</style>
