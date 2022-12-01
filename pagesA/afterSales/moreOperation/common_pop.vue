<template>
	<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
		<view class="reply_box">
			<view class="fllow_area">
				<view class="fllo_list">
					<view class="area_head key">评论内容:</view>
				</view>
				<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="请填写评论内容"
					placeholder-style="color:#999" />
			</view>
			<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
		</view>
	</uni-popup>
</template>

<script>
	import { netPublishComment } from '@/api/api.js'
	
	export default{
		props:{
			
		},
		data() {
			return{
				noClick:true,   //防止重复点击
				record_id:'',
				comment_id:'',
				relation_type:'',
				content:''
			}
		},
		methods:{
			init(obj) {
				this.$refs.popup.open()
				this.record_id = obj.id
				this.relation_type = obj.type
				this.comment_id = obj.commenid
			},
			sureSub() {
				if(!this.content) {
					uni.showToast({
						title:'请填写评论内容',
						icon:'none'
					})
					return
				}
				let params = {
					record_id:this.record_id,
					comment_id:this.comment_id,
					relation_type:this.relation_type,
					content:this.content
				}
				netPublishComment(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.content = ''
						this.$refs.popup.close()
						this.$emit('commonSuccess')
					},2000)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.reply_box{
		padding:50rpx 0;
		z-index:10000;
		.fllow_area {
			background: #fff;
			padding:30rpx 40rpx;
			border-bottom:1rpx solid #f5f5f5;
			.fllo_list{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.area_head {
					margin-bottom: 20rpx;
					font-size:26rpx;
				}
			}
			textarea {
				width: 660rpx;
				padding: 20rpx;
				border-radius: 10rpx;
				margin: 24rpx auto;
				box-sizing: border-box;
				font-size:26rpx;
				background:rgba(202, 202, 202, 0.2);
			}
		}
	}
</style>
