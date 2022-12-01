<template>
	<view class="">
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="textArea">
				<textarea v-model="content" placeholder-style="font-size:24rpx;color:#999;" placeholder="请填写评论" />
				<view class="fabu" @click="$noMultipleClicks(btnPubClick)">
					发布
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netAddComment } from '@/api/api.js'
	
	export default{
		props:{
			info:{
				type:Object,
				default:{}
			},
		},
		data() {
			return{
				noClick:true,  //防止重复点击
				content:''
			}
		},
		methods:{
			init() {
				this.$refs.popup.open()
			},
			//发布 评论
			btnPubClick() {
				if (!this.content) {
					uni.showToast({
						title: '请填写评论',
						icon: 'none'
					})
					return
				}
				let params = {
					content: this.content,
					record_id: this.info.id,
					relation_type:this.info.relation_type
				}
				netAddComment(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						this.$emit('commentSuccess')
						this.content = ''
						this.$refs.popup.close()
					}, 2000)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.textArea {
		padding: 30rpx;
		height: 500rpx;
		textarea {
			width:660rpx;
			height: 150rpx;
			padding: 15rpx;
			border-radius: 10rpx;
			font-size:24rpx;
			color:#333;
			border: 1rpx solid #EAEAEA;
			margin:0 auto;
		}
		.fabu {
			width:680rpx;
			height:80rpx;
			border-radius: 40rpx;
			text-align: center;
			line-height: 80rpx;
			background:$uni-text-color;
			color:#fff;
			font-size:26rpx;
			margin:30rpx auto;
		}
	}
</style>