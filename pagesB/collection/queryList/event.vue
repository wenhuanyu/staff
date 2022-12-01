<template>
	<view class="visitwarp" >
		<visit-item :list="list" :type="types"></visit-item>
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
				type:1,     //type 1未完成    2完成
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
			this.type = options.type
			this.getList()
		},
		methods:{
			getList() {
				let params = {
					page: this.page,
					id_list: this.idlist
				}
				if(this.type == 1) {
					params.times = this.createtime
					params.status = '0,1'
				}else{
					params.actual_end_time = this.createtime
					params.status = 2
				}
				netScheduleList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.list = this.list.concat(res.data.data)
					console.log(this.list,'数据')
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
