<template>
	<view class="follow_warp">
		<scroll-view scroll-y class="scrollbox">
			<view class="follow_item_box" >
				<view class="follow_item_top" v-if="info.staff">
					<view class="item_info" >
						<image :src="info.staff.img" class="headerimg" ></image>
						<view class="item_infor_right">
							<view class="info_top">
								<view class="info_top_left">
									<view class="info_name">{{info.staff.name}}</view>
									<view class="info_post">{{info.staff.post}}</view>
								</view>
								<view class="info_top_right">{{info.relation_process?info.relation_process:''}}{{info.follow?info.follow:''}}</view>
							</view>
						</view>
					</view>
					<view class="follow_remark" v-html="info.content"></view>
					<view class="follow_img_list" v-if="info.files && info.files.length != 0">
						<view class="imgbox" v-for="(imgitem,imgindex) in info.files" :key="imgindex" @click="toPreviimg(info.files,imgindex)">
							<image :src="imgitem" class="follow_img" ></image>
						</view>
					</view>
					
					<!-- 地址 -->
					<view class="follow_address" @click="toOpenMap" >
						<view class="address_right">
							<view class="address_ri_bot" v-if="info.follow_type">
								跟进类型：{{info.follow_type?info.follow_type:''}}
							</view>
							<view class="address_ri_top" v-if="info.distance">
								<span>签到</span>
								签到地点距离拜访对象：{{info.distance?info.distance:0}}
							</view>
							<view class="address_ri_bot" v-if="info.location">
								{{info.location?info.location:''}}
							</view>
							<view class="address_ri_top" v-if="info.next_time">
								下次跟进时间：{{info.next_time?info.next_time:0}}
							</view>
						</view>
					</view>
					<!-- 拜访客户 -->
					<view class="follow_customer" v-if="info.workorder" @click="toOrderDetail(info)">
						<view class="follow_cus_top">
							<image :src="BASE_IMG_URL+'/customer/visit_list.png'" class="visilistimg" ></image>
							<view class="cus_visit">{{info.workorder.title}}</view>
						</view>
						<view class="follow_cus_top">
							<image :src="BASE_IMG_URL+'/customer/visit_customer.png'" class="visilistimg" ></image>
							<view class="cus_name">客户：{{info.customer.name}}</view>
						</view>
					</view>
					<view class="follow_customer" v-if="info.event_title" @click="toVisitDetail(info.event_title)">
						<view class="follow_cus_top">
							<image :src="BASE_IMG_URL+'/customer/visit_list.png'" class="visilistimg" ></image>
							<view class="cus_visit">{{info.event_title.title}}</view>
						</view>
						<view class="follow_cus_top">
							<image :src="BASE_IMG_URL+'/customer/visit_customer.png'" class="visilistimg" ></image>
							<view class="cus_name">客户：{{info.customer.name}}</view>
						</view>
					</view>
				</view>
				<!-- 联系客户 -->
				<view class="customer_info" @click="toCustomerDetail" v-if="info.customer">
					<image :src="BASE_IMG_URL+'/index/icon2_a.png'" class="firimg" ></image>
					<view class="cus_name">{{info.customer.name}}</view>
				</view>
				<!-- 评论 -->
				<view class="follow_comment">
					<view class="fol_comm_top">
						<view class="fol_top_left">
							<view class="com_num">相关评论 （{{commenList.length}}）</view>
						</view>
						<!-- <view class="fol_top_right">
							<view class="right_text" @click="toComment(info)">+评论</view>
						</view> -->
					</view>
					<view class="comm_box">
						<view class="comm_item" v-for="(comitem,comindex) in commenList" :key="comindex">
							<view class="comm_li">
								<view class="comm_li_top">
									<view class="comm_li_left">
										<image :src="comitem.staff.img" class="staffimg" mode=""></image>
										<view class="ribox">
											<view class="ri_top">
												<view class="comm_name">{{comitem.staff.name}}</view>
												<view class="comm_post">{{comitem.staff.post}}</view>
											</view>
											<view class="ri_time">{{comitem.createtime}}</view>
										</view>
									</view>
									<view class="comm_li_right" @click="toReply(info,comitem)">回复</view>
								</view>
								<view class="comm_li_bot">
									<view class="comm_li_con">
										{{comitem.content}}
									</view>
								</view>
							</view>
						</view>
						<view class="noData" v-if="commenList.length == 0">暂无更多</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 评论按钮 -->
		<view class="bot_bommon" @click="toComment(info)">
			<view class="bot_top">
				<view class="bot_left">发布评论</view>
				<view class="bot_right">发布</view>
			</view>
			<view class="bot_bottom"></view>
		</view>
		<!-- 回复 -->
		<reply-item ref="replyChild" @replySuccess="replySuccess"></reply-item>
	</view>
</template>

<script>
	import replyItem from './components/common_reply.vue'
	import { netFollowDetail, netCommentList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			replyItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				info:{},
				commenList:[],   //评论列表
				customerid:'',
				type:1,   //1客户   2员工
				staffid:'',
				//当前查看的 评论
				listid:'',  
				listindex:null,
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
			//获取 评论列表
			this.getComList()
		},
		methods:{
			getDetail() {
				let params = { id:this.id }
				netFollowDetail(params).then(res=>{
					this.info = res.data
				})
			},
			//客户详情
			toCustomerDetail() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.info.customer.id
				})
			},
			//获取 某一条 动态的评论
			getComList() {
				let params = {
					record_id:this.id,
					relation_type: 'sign'
				}
				netCommentList(params).then(res=>{
					this.commenList = res.data
				})
			},
			//发表评论
			toComment(item) {
				let obj = {
					record_id: item.id,
					comment_id:'',
					relation_type:'sign'
				}
				this.$refs.replyChild.init(obj)
			},
			//回复 评论
			toReply(item,comitem) {
				let obj = {
					record_id: item.id,
					comment_id:comitem.id,
					relation_type:'sign'
				}
				this.$refs.replyChild.init(obj)
			},
			//评论 成功 重新请求
			replySuccess() {
				this.getComList()
			},
			//查看图片
			toPreviimg(arr,index){
				uni.previewImage({
					urls:arr,
					current:index,
					success:(res)=>{
						this.$emit('seePicture')
					}
				})
			},
			//查看地图
			toOpenMap() {
				uni.openLocation({
					latitude:Number(this.info.lat),
					longitude:Number(this.info.lng),
					address: this.info.location,
					name: this.info.location,
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			//查看 任务详情
			toVisitDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/visitDetail?id='+item.id
				})
			},
			//查看 工单详情
			toOrderDetail(item) {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorderDetail?workorderid='+item.id
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
	.follow_warp{
		width:750rpx;
		height:100vh;
		.scrollbox{
			width:100%;
			height:100vh;
			.follow_item_box{
				background:#fff;
				.follow_item_top{
					padding:30rpx;
					border-bottom:1rpx solid #f5f5f5;
					.item_info{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.headerimg{
							width:80rpx;
							height:80rpx;
							border-radius: 50%;
							margin-right:20rpx;
							flex-shrink: 0;
						}
						.item_infor_right{
							flex:1;
							.info_top{
								display: flex;
								justify-content: space-between;
								align-items: center;
								.info_top_left{
									display: flex;
									justify-content: flex-start;
									align-items: center;
									.info_name{
										font-size:30rpx;
										color:#333333;
										margin-right:24rpx;
									}
									.info_post{
										font-size:26rpx;
										color:#999999;
									}
								}
								.info_top_right{
									font-size:28rpx;
									color:#333;
								}
							}
							.info_time{
								font-size:26rpx;
								color:$uni-text-color;
								margin-top:24rpx;
							}
						}
					}
					.follow_visit_tiem{
						font-size:26rpx;
						color:#999999;
						margin:25rpx 0;
					}
					.follow_remark{
						font-size:26rpx;
						color:#333333;
						margin-bottom:24rpx;
						margin-top:24rpx;
					}
					.follow_img_list{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						flex-wrap: wrap;
						.imgbox{
							width: 100rpx;
							height: 100rpx;
							border-radius: 20rpx;
							margin-right:24rpx;
							margin-bottom:24rpx;
							.follow_img{
								width: 100rpx;
								height: 100rpx;
								border-radius: 20rpx;
							}
						}
					}
					.follow_address{
						width: 630rpx;
						border-radius: 20rpx;
						.address_right{
							.address_ri_top{
								display: flex;
								justify-content: flex-start;
								align-items: center;
								font-size:26rpx;
								color:#999999;
								margin-bottom:10rpx;
								span{
									font-size:26rpx;
									color:#999999;
									margin-right:15rpx;
								}
							}
							.address_ri_bot{
								font-size:26rpx;
								color:#999999;
							}
						}
					}
					.follow_customer{
						width: 630rpx;
						height: 112rpx;
						background: rgba(242, 242, 242, 0.5);
						border-radius: 20rpx;
						padding:15rpx 24rpx;
						margin-top:24rpx;
						.follow_cus_top{
							display: flex;
							justify-content: flex-start;
							align-items: center;
							&:first-child{
								margin-bottom:15rpx;
							}
							.visilistimg{
								width:36rpx;
								height:36rpx;
								margin-right:24rpx;
							}
							.cus_visit{
								font-size:26rpx;
								color:#333333;
							}
							.cus_name{
								font-size:26rpx;
								color:#999999;
							}
						}
					}
				}
				.customer_info{
					padding:30rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					border-bottom:1rpx solid #f5f5f5;
					.firimg{
						width:42rpx;
						height:42rpx;
						margin-right:24rpx;
					}
					.cus_name{
						font-size:30rpx;
						color:$uni-text-color;
					}
				}
				.follow_comment{
					padding:30rpx;
					.fol_comm_top{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.fol_top_left{
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.comimg{
								width:40rpx;
								height:40rpx;
								margin-right:24rpx;
							}
							.com_num{
								font-size:26rpx;
								color:#333333;
							}
						}
						.fol_top_right{
							display: flex;
							justify-content: flex-end;
							align-items: center;
							.right_text{
								font-size:30rxp;
								color:$uni-btn-bg-color;
								margin-right:24rpx;
							}
							.xiabox{
								width:30rxp;
								height:30rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								.xiaimg{
									width:30rpx;
									height:17rpx;
								}
							}
						}
					}
					.comm_box{
						margin-top:24rpx;
						.comm_item{
							width:630rpx;
							background:#fff;
							border-radius: 20rpx;
							padding:24rpx;
							margin:0 auto 24rpx;
							box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
							.comm_li{
								margin-top:15rpx;
								&:first-child{
									margin-top:0;
								}
							}
							.comm_li_top{
								display: flex;
								justify-content: space-between;
								align-items: center;
								.comm_li_left{
									display: flex;
									justify-content: flex-start;
									align-items: center;
									.staffimg{
										width:60rpx;
										height:60rpx;
										border-radius: 50%;
									}
									.ribox{
										margin-left:24rpx;
										.ri_top{
											display: flex;
											justify-content: flex-start;
											align-items: center;
											.comm_name{
												font-size:30rpx;
												color:#333333;
											}
											.comm_post{
												font-size:26rpx;
												color:#999999;
												margin-left:24rpx;
											}
										}
										.ri_time{
											font-size:24rpx;
											color:#666;
											margin-top:15rpx;
										}
									}
									.comm_status{
										font-size:26rpx;
										color:#999999;
									}
								}
								.comm_li_right{
									font-size:30rpx;
									color:$uni-text-color;
								}
							}
							.comm_li_bot{
								margin-top:20rpx;
								.comm_li_con{
									font-size:26rpx;
									color:#999999;
									white-space:normal; 
									word-break:break-all;
								}
							}
						}
					}
				}
			}
		}
	}
</style> 
