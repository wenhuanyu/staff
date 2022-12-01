<template>
	<view style="padding:24rpx 0;">
		<visit-item :list="visitList" :type="types"></visit-item>
	</view>
</template>

<script>
	import visitItem from '@/pages/index/visit/index.vue'
	import { netScheduleList } from '@/api/api.js'
	
	export default{
		components:{
			visitItem
		},
		data() {
			return{
				page:1,
				totalPage:1,
				createtime:'',
				idlist:'',
				list:[],
				types:'list',
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
				netScheduleList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.list = this.list.concat(res.data.data)
				})
			}
		}
	}
</script>

<style>
</style>
