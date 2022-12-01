<template>
	<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
		<view class="reply_box">
			<view class="reply_warp">
				<view class="reply_text">回复：|</view>
				<input type="text" v-model="content" placeholder="请输入内容" class="reply_input">
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
				relation_type:'sign',  //sign 签到  event 任务(任务,拜访,任务)   article文章评论
				content:''
			}
		},
		methods:{
			init(obj) {
				this.$refs.popup.open()
				this.record_id = obj.record_id
				this.comment_id = obj.comment_id
				this.relation_type = obj.relation_type
			},
			sureSub() {
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
						this.$emit('replySuccess')
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
		.reply_warp{
			width:630rpx;
			height:60rpx;
			border:1rpx solid $uni-text-color;
			border-radius: 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 15rpx;
			margin:0 auto;
			.reply_text{
				font-size:26rpx;
				color:#999999;
			}
			.reply_input{
				font-size:26rpx;
				color:#333;
				height:58rpx;
				line-height: 58rpx;
				width:450rpx;
			}
		}
	}
</style>
