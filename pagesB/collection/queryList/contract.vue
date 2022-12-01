<template>
	<view style="padding:24rpx 0;">
		<item :list="contract_list"></item>
	</view>
</template>

<script>
	import Item from '@/pages/index/contractManagements/item.vue'
	import { mapState } from 'vuex'
	import { netOutContractList } from '@/api/api.js'
	
	
	export default{
		components:{
			Item
		},
		data() {
			return{
				page:1,
				totalPage:1,
				contract_list:[],
				createtime:'',
				idlist:'',
			}
		},
		onLoad(options) {
			this.createtime = options.time
			this.idlist = options.idlist
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
					page: this.page,
					createtime: this.createtime,
					id_list: this.idlist
				}
				netOutContractList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.contract_list = this.contract_list.concat(res.data.data)
				})
			}
		}
	}
	
</script>

<style>
</style>
