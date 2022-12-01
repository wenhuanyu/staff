<template>
	<view style="padding:24rpx 0;">
		<list-item :list="list"></list-item>
	</view>
</template>

<script>
	import listItem from '@/pages/index/afterSales/list.vue'
	import { netWorkOrderList } from '@/api/api.js'
	
	export default{
		components:{
			listItem
		},
		data() {
			return{
				page:1,
				totalPage:1,
				createtime:'',
				end_time:'',
				idlist:'',
				type:1,    //1新建     2完成    3好评工单
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
			this.idlist = options.idlist
			this.type = options.type
			if(options.type == 1) {
				this.createtime = options.time
			}else if(options.type == 2) {
				this.end_time = options.time
			}
			this.getList()
		},
		methods:{
			getList() {
				let params = {
					page: this.page,
					id_list: this.idlist
				}
				if(this.type == 1) {
					params.createtime = this.createtime
				}else if(this.type == 2) {
					params.end_time = this.end_time
				}else{
					params.comment_score = 5
				}
				netWorkOrderList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.list = this.list.concat(res.data.data)
				})
			}
		}
	}
</script>

<style>
</style>
