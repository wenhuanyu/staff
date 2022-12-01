<template>
	<view>
		<view class="item_content">
			<view class="itemtop">
				<view class="con_img">
					<image :src="info && info.staff ? info.staff.img : BASE_IMG_URL+'/headImg.png'"  mode="scaleToFill"></image>
				</view>
				<view class="con_main">
					<view class="main_first">
						<view style="color: #333;font-size: 30rpx;">{{info.staff?info.staff.name:''}}</view>
						<view class="lxs_time" style="font-size: 30rpx ;color: #999;">{{info && info.follow_time}}</view>
					</view>
					<view class="main_type" @click="toLocation" v-if="info.location">{{info && info.location}}</view>
					<view class="main_type" v-if="info && info.follow_type == '到访'"><span>{{info && info.follow_type}}</span>
					</view>
					<view class="main_type" v-if="info && info.follow_type == '跟进'"><span>{{info && info.follow_type}}</span>
					</view>
					<view class="main_type" v-if="info && info.follow_type != '跟进' && info.follow_type != '到访'">
						<span>{{info && info.follow_type}}</span></view>
				</view>
			</view>

			<view class="main_second_con">
				<view>{{info && info.content}}</view>
			</view>
			<view class="imglist" v-if="imgList.length != 0">
				<view class="imgbox" v-for="(item,imgindex) in imgList" :key="imgindex">
					<image :src="item.file_path" class="selfimg" @click="openCommonImg(imgList,imgindex)" mode="scaleToFill"></image>
				</view>
			</view>
			<view class="fllow_file_li" v-if="fileList.length != 0">
				<view class="fil_li" v-for="(item,fileindex) in fileList" :key="fileindex">
					<image :src="BASE_IMG_URL+'/fujian.png'" class="fileimg" mode="scaleToFill"></image>
					<view class="filename" @click="openCommonFile(item)">{{item.name}}</view>
				</view>
			</view>
			
			<view class="main_third fontColor" v-if="info.next_time">
				下次跟进时间：{{info && info.next_time}}
			</view>
			<view class="customer" v-if="info.relation_type == 1" @tap.stop="toMore(info.relation_id,1)">关联客户：<span style="color:#008EFF">{{info.relation_name ? info.relation_name : '--'}}</span></view>
			<view class="customer" v-if="info.relation_type == 2" @tap.stop="toContactDetail(info.relation_id)">关联联系人：<span style="color:#008EFF">{{info.relation_name ? info.relation_name : '--'}}</span></view>
			<view class="customer" v-if="info.relation_type == 3" @tap.stop="toContractDetail(info.relation_id)">关联合同：<span style="color:#008EFF">{{info.relation_name ? info.relation_name : '--'}}</span></view>
			<view class="customer" v-if="info.relation_type == 4" @tap.stop="toClues(info.relation_id)">关联线索：<span style="color:#008EFF">{{info.relation_name ? info.relation_name : '--'}}</span></view>
			<view class="customer" v-if="info.relation_type == 5" @tap.stop="toBusiness(info.relation_id)">关联商机：<span style="color:#008EFF">{{info.relation_name ? info.relation_name : '--'}}</span></view>
		</view>
		<view class="comment">
			<image :src="BASE_IMG_URL+'/pl.png'"  mode="scaleToFill"></image>
			<view class="span">
				评论
				({{commont_list.length}})
			</view>
		</view>
		<!-- 评论列表 -->
		<view class="detail_tab">
			<view class="comment_list">
				<view class="content" v-for="(item,index) in commont_list" :key="index">
					<image class="image" :src="item.staff.img ? item.staff.img : BASE_IMG_URL+'/headImg.png'"
						 mode="scaleToFill"></image>
					<view class="main_first">
						<view style="font-size: 30rpx;color: #333;padding-top: 30rpx;">{{item.staff.name}}</view>
						<view style="font-size: 24rpx;color: #999;margin-top: 15rpx;">{{item.createtime}}</view>
					</view>
					<view class="main_second">
						<text style="word-break:break-all;text-indent:25rpx">{{item.content}}</text>
					</view>
				</view>
				<view class="noData" v-if="commont_list.length == 0">暂无更多</view>
			</view>
		</view>
		<view class="" style="height:100rpx;"></view>
		<!-- 评论按钮 -->
		<view class="bot_bommon" @click="toComment">
			<view class="bot_top">
				<view class="bot_left">发布评论</view>
				<view class="bot_right">发布</view>
			</view>
			<view class="bot_bottom"></view>
		</view>
		<!-- 发布评论 -->
		<post-comments ref="commentsChild" :info="info" @commentSuccess="commentSuccess"></post-comments>
	</view>
</template>

<script>
	import postComments from '../cluesMore/postComments.vue'
	
	import {
		netFollowRecordDetail,
		netAddComment,
		netGetCommentList
	} from '@/api/api.js'
	import {
		BASE_IMG_URL
	} from '@/api/http.js'
	export default {
		components:{
			postComments
		},
		data() {
			return {
				noClick: true, //防止重复点击
				popupShow: false,
				id: '',
				info: {},
				imgList:[],
				fileList:[],
				content: '',
				commont_list: [], //评论列表
				BASE_IMG_URL: BASE_IMG_URL,
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.imgList = []
			this.fileList = []
			this.getInfo()
		},
		created() {

		},
		methods: {
			getInfo() {
				netFollowRecordDetail({
					id: this.id
				}).then(res => {
					this.info = res.data
					let list = res.data.file
					list.forEach(ele=>{
						if(ele.types.indexOf('image') != -1){
							this.imgList.push({
								id:ele.id,
								file_path:ele.file_path,
								name:ele.name
							})
						}else{
							this.fileList.push({
								id:ele.id,
								file_path:ele.file_path,
								name:ele.name
							})
						}
					})
					if(this.info){
						// 获取  评论 列表
						this.getCommont()
					}
					
				})
			},
			getCommont() {
				netGetCommentList({
					record_id: this.id,
					relation_type:this.info.relation_type
				}).then(res => {
					this.commont_list = res.data
					uni.$emit("handClick",{//点击返回的这个页面触发一个事件，使用uni.$emit(“handClick”,{})
							rightText: this.commont_list.length, //传递的参数
						});

				})
			},
			publishClick() {
				this.popupShow = true
			},
			closePup() {
				this.popupShow = false
			},
			toComment() {
				this.$refs.commentsChild.init()
			},
			commentSuccess() {
				this.getCommont()
			},
			//查看图片
			toPreimg(index) {
				let arr = this.info.file
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					current:index,
					urls:data
				})
			},
			//联系人详情
			toContactDetail(id) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contact/contactDetail?id='+id
				})
			},
			//合同详情
			toContractDetail(id) {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractDetail?id='+id
				})
			},
			//线索详情
			toClues(id) {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/cluesMore/cluesMore?id='+id
				})
			},
			//客户详情
			toMore(id){
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+ id
				})
			},
			// 商机详情
			toBusiness(id) {
				uni.navigateTo({
					url:'/pagesB/business/detail?id='+id
				})
			},
			//查看位置
			toLocation() {
				uni.openLocation({
					latitude:this.info.lat,
					longitude:this.info.lng,
					name:this.info.location,
					fail:(err)=>{
						console.log(err)
					},
					success:(res)=>{
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
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
	.fllow_file_li {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		margin-bottom:24rpx;
		.fil_li {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-bottom: 14rpx;
			padding-top:15rpx;
			.fileimg {
				width: 20rpx;
				height: 20rpx;
				margin-right:25rpx;
			}
	
			.filename {
				width:450rpx;
				font-size: 24rpx;
				color: #999999;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
	
			.closeimg {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.imgbox {
			width: 120rpx;
			height: 120rpx;
			margin-right: 24rpx;
			position: relative;
			margin-bottom: 24rpx;
			.selfimg {
				width: 120rpx;
				height: 120rpx;
			}
		}
	}
	.item_content {
		margin-top: 20rpx;
		background: #fff;
		.itemtop{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:30rpx;
		}
		.con_img {
			margin-right:24rpx;
			image {
				width: 130rpx;
				height: 130rpx;
				border-radius: 50%;
			}
		}

		.con_main {
			flex:1;
			.main_first {
				display: flex;
				justify-content: space-between;
			}
			.main_type {
				margin-top: 30rpx;
				color: $uni-text-color;
				span {
					font-size: 26rpx;
					color: $uni-text-color;
					padding: 5rpx 12rpx;
					background: $uni-bg-opacity;
					border-radius: 5rpx;
				}
			}
		}
		.main_second_con{
			padding-left:40rpx;
			font-size: 30rpx;
			color: #666;
		}
		.main_second {
			font-size: 30rpx;
			color: #666;
			margin-left: 35rpx;
		}
		.main_third {
			font-size: 30rpx;
			color: #999999;
			padding-left: 35rpx;
			padding-bottom: 30rpx;
			margin-top:10rpx;
		}
		.customer{
			padding:0 30rpx 30rpx;
		}
	}

	.comment {
		height: 90rpx;
		width:750rpx;
		background: #fff;
		border-top: 1rpx solid #ededed;
		display: flex;
		justify-content: center;
		align-items: center;
		image {
			width: 40rpx;
			height: 36rpx;
			margin-right:10rpx;
		}
	}

	.detail_tab {
		.comment_list {
			margin-bottom: 50rpx;

			.content {
				background: #fff;
				border-bottom: 1px solid #ededed;
				padding-bottom: 30rpx;

				&:first-child {
					margin-top: 20rpx;
				}
				&:last-child{
					margin-bottom: 120rpx;
				}

				.image {
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin: 30rpx;
				}

				.main_first {
					padding-bottom: 20rpx;
				}

				.main_second {
					width: 600rpx;
					margin: 0 auto;
					font-size: 26rpx;
					color: #999;
					padding: 30rpx;

					text {
						line-height: 30rpx;
					}
				}
			}
		}
	}
</style>
