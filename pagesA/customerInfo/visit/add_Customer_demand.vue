<template>
	<view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head">客户需求:</view>
				<view class="list_text" @click="toRemarksTemp">选择模板</view>
			</view>
			<textarea v-model="needs" maxlength="-1" :class="needs ? 'valueActive' : '' " placeholder="请填写客户需求"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureAdd)">确定</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { netAddeventDemand } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick: true, //防止  重复点击
				needs:'',
				id:'',
			}
		},
		computed:mapState({
			event_need: state => state.template.event_need
		}),
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			if(this.event_need) {
				this.needs = this.needs+this.event_need
			}
		},
		methods:{
			//选择客户需求 模板
			toRemarksTemp() {
				this.$store.commit('EVENT_NEED','')
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/needTemplate'
				})
			},
			sureAdd() {
				if(!this.needs){
					uni.showToast({
						title:'请填写客户需求',
						icon:'none'
					})
					return
				}
				let params = {
					event_id: this.id,
					needs:this.needs
				}
				netAddeventDemand(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					this.$store.commit('EVENT_NEED','')
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
	.fllow_area {
		background: #fff;
		box-sizing: border-box;
		padding:30rpx;
		border-bottom:1rpx solid #f5f5f5;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom:15rpx;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
				color:#666;
			}
			.list_text{
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
		textarea {
			width: 590rpx;
			background: #f5f5f5;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 0 auto;
		}
	}
</style>
