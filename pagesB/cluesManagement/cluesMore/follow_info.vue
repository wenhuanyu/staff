<template>
	<view class="customer_dynamic">
		<view class="fllow_item" v-for="(item,index) in list" :key="index"
			@click.stop="isSeas == 1 ? clientClick(item.id) : ''">
			<view class="item_content">
				<view class="con_img">
					<image :src="item.staff.img ? item.staff.img : BASE_IMG_URL+'/headImg.png'" class="headerimg" mode="scaleToFill">
					</image>
					<view class="main_first">
						<view class="main_title">
							<view class="first_left">
								<view class="f_l_yop">
									<view>{{item.staff.name}}</view>
									<view>{{item.follow_time}}</view>
								</view>
								<view class="f_l_bottom" style="margin-top: 30rpx;">
									<view class="main_type daofang" v-if="item.follow_type == '到访'">
										{{item.follow_type}}
									</view>
									<view class="main_type genjin" v-if="item.follow_type == '跟进'">
										{{item.follow_type}}
									</view>
									<view class="main_type other"
										v-if="item.follow_type != '跟进' && item.follow_type != '到访'">
										{{item.follow_type}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="con_main">
					<view class="main_second">
						<view>{{item.content}}</view>
					</view>
					<view class="lxs_time" v-if="item.next_time">下次跟进时间：{{item.next_time ? item.next_time : ''}}</view>
					<view class="main_img" @click.stop.prevent v-if="item.imgList.length != 0">
						<image v-for="(ele,imgindex) in item.imgList" :key="imgindex" :src="ele.file_path" @click.stop="toPrevieImg(item.imgList,imgindex)" class="imgbox" ></image>
					</view>
					<view class="fllow_file_li" @click.stop.prevent v-if="item.fileList.length != 0">
						<view class="fil_li" v-for="(fileitem,fileindex) in item.fileList" :key="fileindex">
							<image :src="BASE_IMG_URL+'/fujian.png'" class="fileimg" mode="scaleToFill"></image>
							<view class="filename" @click="openCommonFile(fileitem)">{{fileitem.name}}</view>
						</view>
					</view>
				</view>
				<view class="comment">
					<image :src="BASE_IMG_URL+'/pl.png'" mode="scaleToFill"></image>({{item.comment_num}})
					<view class="span">查看评论</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import {
		netKehuFollow,
		netGetCommentList,
		netFollowRecordDetail
	} from '@/api/api.js'
	import {
		BASE_IMG_URL
	} from '@/api/http.js'
	export default {
		props: {
			info: {
				type: Object,
				default: {}
			},
			type: {
				type: Number,
				default: 1 //1客户 2联系人 3合同 4线索 5商机
			},
			isSeas: {
				type: Number,
				default: 1, //1普通客户   2公海客户
			}
		},
		data() {
			return {
				list: [],
				page: 1,
				limit: 10,
				totalPage: 1,
				commont_list: [], //评论列表
				BASE_IMG_URL: BASE_IMG_URL,
				amount: [],
			}
		},
		created() {
			this.getFollowList()
		},
		onReachBottom() {
			if (this.page >= this.totalPage) {
				return
			}
			this.page = this.page + 1
			this.getFollowList()
		},
		onLoad(options) {
			
		},
		onShow() {
		},
		methods: {
			// 跳转到详情页面 
			clientClick(id) {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/followUpDetail/followUpDetail?id=' + id,
				})
			},
			getFollowList() {
				let params = {
					relation_id: this.info.id,
					relation_type: this.type, //1客户 2联系人 3合同 4线索 5商机
					page: this.page
				}
				netKehuFollow(params).then(res => {
					let arr = res.data.data
					arr.forEach(ele=>{
						ele.imgList = []
						ele.fileList = []
						ele.file.forEach(item=>{
							if(item.types.indexOf('image') != -1){
								ele.imgList.push({
									id:item.id,
									file_path:item.file_path,
									name:item.name
								})
							}else{
								ele.fileList.push({
									id:item.id,
									file_path:item.file_path,
									name:item.name
								})
							}
						})
					})
					this.list = this.list.concat(arr)
					this.page = res.data.current_page
					this.totalPage = res.data.last_page
				})
			},
			//查看 图片 
			toPrevieImg(arr,index) {
				console.log(arr,'====')
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					urls: data,
					current:index
				})
			}
		}
	}
</script>

<style lang="scss">
	.fllow_file_li {
		padding: 24rpx 34rpx;
		background: #fff;
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
	.comment {
		margin-top: 20rpx;
		height: 90rpx;
		background: #fff;
		border-top: 1rpx solid #ededed;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		image {
			width: 40rpx;
			height: 36rpx;
			float: left;
			
		}
		.span{
			margin-left:10rpx;
			display: block;
			color:$uni-text-color;
		}
	}

	.customer_dynamic {
		margin: 20rpx 0rpx;
		.fllow_item {
			.item_data {
				&::before {
					content: '';
					display: inline-block;
					margin: 0 15rpx 0 24rpx;
					width: 20rpx;
					height: 20rpx;
					border-radius: 10rpx;
					border: 2rpx solid $uni-text-color;
				}
			}

			.item_content {
				display: block;
				background-color: #fff;
				padding: 24rpx 24rpx 10rpx;
				border-radius: 10rpx;
				margin-bottom: 30rpx;

				.con_img {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.headerimg{
						width:100rpx;
						height:100rpx;
						border-radius: 50%;
					}
					.main_first {
						margin-bottom: 25rpx;
						padding-left: 25rpx;
						flex: 1;
						.main_title {
							display: flex;
							width: 100%;
							justify-content: space-between;

							.first_left {
								width: 100%;
								.f_l_yop {
									width: 100%;
									display: flex;
									justify-content: flex-start;
								}
								:first-child {
									font-size: 28rpx;
									margin-right: 30rpx;
								}
							}
							.main_type {
								margin-top:24rpx;
								width: 85rpx;
								height: 36rpx;
								background: $uni-bg-opacity;
								border-radius: 10rpx;
								color: $uni-text-color;
								text-align: center;
								line-height: 36rpx;
							}
						}
					}
				}

				.con_main {
					flex: 1;
					margin-left: 30rpx;
					font-size: 30rpx;
					color: #666666;

					.main_second {
						padding-bottom: 20rpx;
					}

					.main_img {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						flex-wrap: wrap;
						margin-top: 20rpx;
						.imgbox {
							padding: 10rpx;
							border-radius: 10rpx;
							width: 120rpx;
							height: 120rpx;
							margin-right: 14rpx;
							margin-bottom: 14rpx;
						}
					}

					.main_third {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin: 20rpx 0 10rpx;

						.third_left {
							display: flex;
							justify-content: center;
							align-items: center;

							.icon-setup {
								margin-top: -4rpx;
								margin-right: 10rpx;
							}
						}

						.third_right {
							display: flex;

							.right_num {
								display: flex;

								.icon-shaixuan {
									margin-top: -4rpx;
									margin-right: 10rpx;
								}

								:last-child {
									margin-right: 20rpx;
								}
							}

							.icon-arrows_right {
								margin-top: -4rpx;
							}
						}
					}

					.main_fourth {
						padding-bottom: 10rpx;
					}
				}
			}
		}

		.fontColor {
			color: #999;
		}

	}
</style>
