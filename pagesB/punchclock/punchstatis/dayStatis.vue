<template>
	<view class="">
		<view class="daybox">
			<view class="day_li" v-for="(item,index) in list" :key="index" @click="toLookDetail(item)">
				<view class="day">{{item.day}}</view>
				<view class="li_right">{{item.msg}}</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
	</view>
</template>

<script>
	import { netClockDayStatis } from '@/api/api.js'
	
	export default{
		data() {
			return{
				year:'',
				month:'',
				type:'',
				list:[]
			}
		},
		onLoad(options) {
			this.year = options.year
			this.month = options.month
			this.type = options.type
			//获取数据
			this.getList()
		},
		methods:{
			getList() {
				let params = {
					month:this.year+'-'+this.month,
					type:this.type
				}
				netClockDayStatis(params).then(res=>{
					this.list = res.data
				})
			},
			//查看详情
			toLookDetail(item) {
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/index?time='+item.day
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.daybox{
		width:750rpx;
		background:#fff;
		padding:0 24rpx;
		.day_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			&:last-child{
				border-bottom:0;
			}
			.day{
				font-size:26rpx;
				color:#333;
			}
			.li_right{
				font-size:26rpx;
				color:red;
			}
		}
	}
</style>