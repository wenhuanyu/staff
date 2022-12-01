<template>
	<view class="detail_con">
		<view class="title">{{info.title}}</view>
		<view class="desc">
			简介：{{info.desc}}
		</view>
		<view class="infobox">
			<view class="staff" v-if="info.staff">
				发布者：
				<image :src="info.staff.img" class="staffimg" ></image>
				<view class="staffname">{{info.staff.name}}</view>
			</view>
			<view class="time">{{info.createtime}}</view>
		</view>
		<view class="content" v-html="info.content"></view>
		<view class="line">---END---</view>
		
		<view class="bot_right">
			<view class="bot_right_box">
				<image :src="BASE_IMG_URL+'/index/open.png'" class="openimg" ></image>
				{{info.click_number}}
			</view>
			<view class="bot_right_box">
				<image :src="BASE_IMG_URL+'/index/pinglun.png'" class="commimg" ></image>
				{{comList.length}}
			</view>
		</view>
		
		<view class="commbox">
			<view class="commtitle">全部评论({{comList.length}})</view>
			<view class="commwarp">
				<view class="comm_con_box">
					<view class="comm_li" v-for="(item,index) in comList" :key="index">
						<view class="comm_li_right">
							<image :src="item.staff.img" class="commimg" ></image>
							<view class="comm_name" style="margin: 0 20rpx;white-space: nowrap;">{{item.staff.name}}: </view>
							<view class="comm_name">{{item.content}}</view>
						</view>
						<view class="comm_name" style="align-self: flex-end; font-size: 26rpx; color: #999;">{{item.createtime}}</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height:120rpx;"></view>
		<!-- 评论按钮 -->
		<view class="bot_bommon" @click="toCommon">
			<view class="bot_top">
				<view class="bot_left">发布评论</view>
				<view class="bot_right">发布</view>
			</view>
			<view class="bot_bottom"></view>
		</view>
		<!-- 评论 -->
		<reply-item ref="replyChild" @toSend="sendComm" ></reply-item>
		<!-- 编辑-->
		<view class="icon_creat" @click="editArticle" v-if="tid">
			<image :src="BASE_IMG_URL+'/user/newEdit.png'" class="addimg"></image>
		</view>
	</view>
</template>

<script>
	import { netArticleDetail, netCommentList, netPublishComment, netArticleNumber } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import replyItem from './common_reply.vue'
	
	export default{
		components:{
			replyItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				tid:'',
				pid:'',
				info:{},
				comList:[],
			}
		},
		onLoad(options) {
			this.id = options.id
			this.tid = options.tid
			this.pid = options.pid
			//文章点击次数
			this.getAddNumber()
		},
		onShow() {
			this.getDetail()
			this.getCommont()
		},
		methods:{
			//评论
			toCommon() {
				this.$refs.replyChild.open()
			},
			getAddNumber() {
				netArticleNumber({id:this.id}).then(res=>{})
			},
			getDetail() {
				netArticleDetail({id:this.id}).then(res=>{
					this.info = res.data
					let str = res.data.content
					str = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
					this.info.content = str
				})
			},
			getCommont() {
				let params = {
					relation_type:'article',
					record_id: this.id
				}
				netCommentList(params).then(res=>{
					this.comList = res.data
				})
			},
			sendComm(content) {
				if(!content){
					uni.showToast({
						title:'评论内容不能为空',
						icon:'none'
					})
					return
				}
				let params = {
					content: content,
					record_id: this.info.id,
					relation_type: 'article'
				}
				netPublishComment(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getCommont()
					},2000)
				})
			},
			//编辑
			editArticle() {
				uni.navigateTo({
					url:'/pagesA/user/knowledge_base/addArticle?tid='+this.tid+'&pid='+this.pid+'&sid='+this.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bot_bommon{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		background:#fff;
		.bot_top{
			width:750rpx;
			border-top:1rpx solid #d1d1d1;
			border-bottom:1rpx solid #d1d1d1;
			padding:24rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.bot_left{
				font-size:24rpx;
				color:#666;
			}
			.bot_right{
				font-size:24rpx;
				color:$uni-color-primary;
			}
		}
		.bot_bottom{
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
	.detail_con{
		padding:24rpx 30rpx;
		background-color: #FFF;
		.title{
			font-size:42rpx;
			color:#333333;
			margin-bottom:35rpx;
			text-align: left;
			font-weight: bold;
		}
		.desc{
			font-size:28rpx;
			color:#999;
			line-height: 46rpx;
			margin-bottom:30rpx;
		}
		.infobox{
			display: flex;
			justify-content:space-between;
			align-items: center;
			margin-bottom:24rpx;
			.staff{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				color: #999;
				.staffimg{
					width:56rpx;
					height:56rpx;
					border-radius: 50%;
					margin: 0 24rpx;
				}
				.staffname{
					font-size:26rpx;
					color:#999999;
				}
			}
			.time{
				font-size:26rpx;
				color:#999999;
			}
		}
		.content{
			width:690rpx;
			font-size:24rpx;
			overflow: hidden;
			img{
				width:100%;
			}
		}
	}
	.commbox{
		.commtitle{
			font-size:34rpx;
			color:#666666;
			padding:30rpx 0;
		}
		.commwarp{
			
			.comm_con_box{
				.comm_li{
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					margin-bottom:24rpx;
					padding-bottom: 15rpx;
					border-bottom:1rpx solid #ededed;
					.commimg{
						width:56rpx;
						height:56rpx;
						border-radius: 50%;
						margin-right:15rpx;
						flex-shrink: 0;
					}
					.comm_li_right{
						display: flex;
						justify-content: flex-start;
						align-items: flex-start;
						padding:15rpx 0 15rpx;
						flex:1;
						.comm_name{
							font-size:26rpx;
							color:#999999;
						}
					}
				}
			}
		}
	}
	.line{
		margin-top: 24rpx;
		text-align: center;
		font-size: 26rpx;
		color: #999;
	}
	.bot_right{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top:24rpx;
		.bot_right_box{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:26rpx;
			color:#999999;
			margin-right:24rpx;
			.openimg{
				width:44rpx;
				height:44rpx;
				margin-right:10rpx;
			}
			.commimg{
				width:38rpx;
				height:38rpx;
				margin-right:10rpx;
			}
		}
	}
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 130rpx;
		right: 100rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background:#fff;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		.addimg {
			width: 80rpx;
			height: 80rpx;
		}
	}
</style>
