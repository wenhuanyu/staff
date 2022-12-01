<template>
	<view>
		<view class="tem_list">
			<view class="tem_li" v-for="(item,index) in list" :key="index" @click="selectSure(item,index)">
				<radio value="r1" color="#008EFF" :checked="item.select" class="selfradio" />
				<view class="tem_con">{{item.field}}</view>
			</view>
		</view>
		<view class="button" @click="$noMultipleClicks(toSave)">确定</view>
	</view>
</template>

<script>
	import { netTemplateList } from '@/api/template.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				list:[],
				selectobj:null,
				selectIndex:null,
				type:'客户需求', 
			}
		},
		onLoad(options) {
			this.$store.commit('EVENT_NEED','')
			this.$store.commit('UNINSTALL_REASON','')
			this.$store.commit('VISIT_PLAN_REMARKS','')
			if(options.type){
				this.type = options.type
			}
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList() {
				netTemplateList({type:this.type}).then(res=>{
					let data = res.data.template
					data.forEach(ele=>{
						ele.select = false
					})
					this.list = data
				})
			},
			selectSure(item,index){
				let obj = this.list[index]
				obj.select = !obj.select
				this.$set(this.list,index,obj)
			},
			//确定
			toSave() {
				let str = '';
				this.list.forEach(ele=>{
					if(ele.select){
						str += ele.field+','
					}
				})
				if(this.type == '客户需求'){
					this.$store.commit('EVENT_NEED',str)
				}else if(this.type == '安装未完成原因'){
					this.$store.commit('UNINSTALL_REASON',str)
				}else if(this.type == '任务备注'){
					this.$store.commit('VISIT_PLAN_REMARKS',str)
				}
				
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					})
				},500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tem_list{
		padding:24rpx 30rpx;
		.tem_li{
			border-radius: 10rpx;
			padding:30rpx;
			background:#fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			margin-bottom:24rpx;
			.selfradio{
				transform: scale(0.7);
			}
			.tem_con{
				font-size:26rpx;
				color:#333;
				margin-left:24rpx;
			}
		}
	}
</style>
