<template>
	<view>
		<view class="li_warp" @tap.stop="toDetail(item)" v-for="(item,index) in list" :key="index">
			<view class="li_select" @tap.stop="select(index)">
				<radio value="1" color="#008EFF" :checked="item.select" />
			</view>
			<view class="li_title">{{item.title}}</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
		<view class="botbox">
			<view class="button" @click="sure" style="margin:10rpx auto">确定</view>
		</view>
	</view>
</template>

<script>
	import { netArticleList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				list:[],
				page:1,
				totalPage:1,
				ids:''
			}
		},
		onLoad(options) {
			this.ids = options.id
			this.page = 1
			this.list = []
			this.getList()
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods:{
			getList() {
				let params = {
					page:this.page,
					type_ids: this.ids
				}
				netArticleList(params).then(res=>{
					let data = res.data.data
					data.forEach(ele=>{
						ele.select = false
					})
					this.list = this.list.concat(data)
					this.totalPage = res.data.last_page
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/user/knowledge_base/detail?id='+item.id
				})
			},
			select(index) {
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
			},
			sure() {
				let arr = []
				this.list.forEach(ele=>{
					if(ele.select){
						arr.push(ele)
					}
				})
				if(arr.length == 0) {
					uni.showToast({
						title:'请选择方案',
						icon:'none'
					})
					return
				}
				this.$store.commit('SETPROGRAMLIST',arr)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.li_warp{
		width:690rpx;
		background:#fff;
		border-radius: 20rpx;
		margin:24rpx auto 0;
		padding:30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		.li_select{
			width:40rpx;
			height:40rpx;
			margin-right:24rpx;
			radio{
				transform: scale(0.7);
			}
		}
		.li_title{
			font-size:28rpx;
			color:#333;
		}
	}
	.botbox{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		
	}
</style>
