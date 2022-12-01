<template>
	<view class="visitwarp">
		<visit-item :list="list" type="list"></visit-item>
	</view>
</template>

<script>
	import visitItem from '@/pages/index/visit/index'
	import { netToduList } from '@/api/user.js'
	
	export default{
		components:{
			visitItem
		},
		data() {
			return{
				list:[]
			}
		},
		onLoad() {
			this.getList()
		},
		methods:{
			getList() {
				netToduList().then(res=>{
					this.list = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.visitwarp{
		width:690rpx;
		margin:0 auto;
		padding:24rpx 0;
	}
</style>
