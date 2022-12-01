<template>
	<view>
		<view class="tem_list">
			<view class="tem_li" v-for="(item,index) in list" :key="index" @click="selectSure(item,index)">
				<radio value="r1" color="#008EFF" :checked="item.select" class="selfradio" />
				<view class="tem_con">{{item.field}}</view>
			</view>
		</view>
		
		<view style="height:100px;"></view>
		<view class="botbox">
			<view class="bot_btn" @click="sureLevel">确定</view>
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
				netTemplateList({type:'级别变更原因'}).then(res=>{
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
			},
			sureLevel(){
				let arr = []
				let data = this.list
				data.forEach(ele=>{
					if(ele.select){
						arr.push(ele.field)
					}
				})
				this.$store.commit('LEVEL_REMARKS',arr.join(','))
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
	.botbox{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:100rpx;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
		.bot_btn{
			width:500rpx;
			height:88rpx;
			border-radius: 29rpx;
			background:$uni-btn-bg-color;
			font-size:30rpx;
			color:#fff;
			text-align: center;
			line-height: 88rpx;
		}
	}
</style>
