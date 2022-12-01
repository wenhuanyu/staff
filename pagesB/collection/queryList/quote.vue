<template>
	<view style="padding:24rpx 0;">
		<quo-item :list="list"></quo-item>
	</view>
</template>

<script>
	import { netQuotationList } from '@/api/api.js'
	import quoItem from '@/pagesC/quotation/item'
	
	export default{
		components:{
			quoItem
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
				netQuotationList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.list = this.list.concat(res.data.data)
				})
			}
		}
	}
</script>

<style>
</style>
