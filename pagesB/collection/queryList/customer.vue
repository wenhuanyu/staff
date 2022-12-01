<template>
	<view style="padding:24rpx 0;">
		<customer-item :list="list"></customer-item>
	</view>
</template>

<script>
	import customerItem from '@/pages/index/myCustomer/item'
	import { netKehuList } from '@/api/api.js'
	
	export default{
		components:{
			customerItem
		},
		data() {
			return{
				page:1,
				totalPage:1,
				createtime:'',
				idlist:'',
				list:[]
			}
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		onLoad(options) {
			this.createtime = options.time
			this.idlist = options.idlist
			this.getList()
		},
		methods:{
			getList() {
				let params = {
					page: this.page,
					createtime: this.createtime,
					id_list: this.idlist
				}
				netKehuList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.list = this.list.concat(res.data.data)
				})
			}
		}
	}
</script>

<style>
</style>
