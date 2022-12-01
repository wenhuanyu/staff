<template>
	<view>
		<!-- 添加成员 -->
		<examine-people title="传阅人员" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确认</view>
	</view>
</template>

<script>
	import { netAllCirculateData } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,    //防止  重复点击
				remindPeople:[],
				examineType:'',
				id:'',
				type:''
			}
		},
		onLoad(options) {
			this.id = options.id
			this.type = options.type
		},
		onShow() {
			this.getDefaultRemind()
		},
		methods:{
			sureSub() {
				let arr = []
				this.remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					relation_type:this.type,
					relation_id:this.id,
					staff_id:arr.join(',')
				}
				netAllCirculateData(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
