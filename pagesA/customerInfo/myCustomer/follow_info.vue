<template>
	<view class="follow_warp">
		<view class="pro_top" v-if="customerType == 1">
			<view class="top_name"></view>
			<view class="top_beizhu" @click="toAddDongtai" v-if="operation == 1">
				<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg" ></image>
				添加
			</view>
		</view>
		<scroll-view scroll-y class="scrollbox" @scrolltolower="loodMore">
			<view class="follow_item_box" v-for="(item,index) in list" :key="index"  @tap.stop="toDetail(item)">
				<view class="follow_item_top">
					<view class="item_info">
						<image :src="item.staff.img" class="headerimg" ></image>
						<view class="item_infor_right">
							<view class="info_top">
								<view class="info_top_left">
									<view class="info_name">{{item.staff.name}}</view>
									<view class="info_post">{{item.staff.post}}</view>
								</view>
								<view class="info_top_right">{{item.relation_process?item.relation_process:''}}{{item.follow?item.follow:''}}</view>
							</view>
							<view class="info_time" v-if="item.relation_type == 'workorder'" @tap.stop="toOrderDetail(item)">
								关联：<text>{{item.workorder && item.workorder.title}}</text>
							</view>
							<view class="info_time" v-if="item.relation_type == 'proofing'" @tap.stop="toProofingDetail(item)">
								关联：<text>打样</text>
							</view>
							<view class="info_time" v-if="item.event_title" @tap.stop="toVisitDetail(item.event_title)">
								关联：<text>{{item.event_title.title}}</text>
							</view>
						</view>
					</view>
					<!-- 地址 -->
					<view class="follow_address">
						<view class="address_right">
							<view class="address_ri_top" v-html="item.content"></view>
							<view class="follow_img_list" v-if="item.file_ids && item.file_ids.length != 0" @tap.stop.prevent>
								<view class="imgbox" v-for="(imgitem,imgindex) in item.file_ids" :key="imgindex" @tap.stop="toPreviimg(item.file_ids,imgindex)">
									<image :src="imgitem" class="follow_img" ></image>
								</view>
							</view>
						</view>
						<!-- @tap.stop="toOpenMap(item)" -->
						<view class="address_right" >
							<view class="address_ri_top" v-if="item.follow_type">
								<span>跟进类型：</span>{{item.follow_type}}
							</view>
							<view class="address_ri_top">
								<span>签到时间：</span>{{item.follow_time}}
							</view>
							<view class="address_ri_top" v-if="item.next_time">
								<span>下次跟进时间：</span>{{item.next_time}}
							</view>
							<view class="address_ri_top" v-if="item.location">
								<span>签到地点：</span>{{item.location?item.location:''}}
							</view>
							<view class="address_ri_bot" v-if="item.location">
								签到地点距离拜访对象：{{item.distance}}
							</view>
						</view>
					</view>
					
				</view>
				<!-- 评论 -->
				<view class="follow_comment" @tap.stop.prevent>
					<view class="fol_comm_top">
						<view class="fol_top_left">
							<image :src="BASE_IMG_URL+'/index/clock.png'" class="comimg" ></image>
							<view class="info_time">{{item.follow_time}}</view>
						</view>
						<view class="fol_top_right">
							<view class="right_text" >评论({{item.comment?item.comment:0}})</view>
						</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</scroll-view>
		
		<reply-item ref="replyChild" @replySuccess="replySuccess"></reply-item>
	</view>
</template>

<script>
	import replyItem from './components/common_reply.vue'
	import { netKehuFollow, netCommentList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		components:{
			replyItem
		},
		props:{
			customerType:{
				type:Number,
				default:1   ////1我的客户   2公海客户
			},
			operation:{
				type:Number,
				default:1
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
				customerid:'',
				type:1,   //1客户   2员工
				staffid:'',
				//当前查看的 评论
				listid:'',  
				listindex:null,
			}
		},
		methods:{
			//添加  跟进动态
			toAddDongtai() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/add_followup?customerid='+this.customerid
				})
			},
			init(id,type) {
				if(type == 1) {
					this.customerid = id
				}else if(type == 2) {
					this.staffid = id
				}
				this.list = []
				this.page = 1
				this.type = type
				this.getFollowList()
			},
			getFollowList() {
				let params = {}
				if(this.type == 1) {
					//客户
					params = {
						page: this.page,
						customer_id: this.customerid
					}
				}else if(this.type == 2){
					//员工
					params = {
						page: this.page,
						staff_id: this.staffid
					}
				}
				netKehuFollow(params).then(res=>{
					let data = this.handleData(res.data.data)
					this.list = this.list.concat(data)
					this.totalPage = res.data.last_page
				})
			},
			handleData(data) {
				data.forEach(ele=>{
					ele.commenList = []
					ele.showCommen = false
				})
				return data
			},
			loodMore() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getFollowList()
			},
			//详情
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/followUpDetail/followUpDetail?id='+item.id
				})
			},
			//获取 某一条 动态的评论
			loodComment(id,index,flag) {
				this.listid = id
				this.listindex = index
				let obj = this.list[index]
				obj.showCommen = flag
				if(obj.showCommen){
					let params = {
						record_id:id,
						relation_type: 'sign'
					}
					netCommentList(params).then(res=>{
						obj.commenList = res.data
					})
				}
				this.$set(this.list,index,obj)
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
				this.loodComment(this.listid,this.listindex,true)
			},
			//查看图片
			toPreviimg(arr,index){
				console.log('123')
				uni.previewImage({
					urls:arr,
					current:index,
					success:(res)=>{
						this.$emit('seePicture')
					}
				})
			},
			//查看地图
			toOpenMap(item) {
				uni.openLocation({
					latitude:Number(item.lat),
					longitude:Number(item.lng),
					address: item.location,
					name:item.location,
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
				let params = {relation_id:item.workorder.id}
				this.jumpWorkorderDetail(params)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pro_top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#fff;
		padding:24rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		.top_name{
			font-size:26rpx;
			color:#333;
		}
		.top_beizhu{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:24rpx;
			color:#666;
			.beizhuimg{
				width:30rpx;
				height:30rpx;
				margin-right:10rpx;
			}
		}
	}
	.follow_warp{
		width:750rpx;
		height:calc(100vh - 100rpx);
		.scrollbox{
			width:100%;
			height:calc(100vh - 100rpx);
			.follow_item_box{
				width:690rpx;
				margin:24rpx auto;
				border-radius: 20rpx;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				background:#fff;
				.follow_item_top{
					padding: 30rpx 36rpx 24rpx 36rpx;
					border-bottom:1rpx solid #f5f5f5;
					.item_info{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.headerimg{
							width:70rpx;
							height:70rpx;
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
										font-size:22rpx;
										color:#666;
										margin-right:24rpx;
									}
									.info_post{
										font-size:22rpx;
										color:#999999;
									}
								}
								.info_top_right{
									font-size:28rpx;
									color:#333;
								}
							}
							.info_time{
								font-size: 26rpx;
								color:#666;
								text{
									font-size: 26rpx;
									color: $uni-btn-bg-color;
								}
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
						padding: 0 24rpx;
						margin: 30rpx 0 0 0;
						width: 630rpx;
						border-radius: 20rpx;
						.address_right{
							flex:1;
							.address_ri_top{
								display: flex;
								justify-content: flex-start;
								align-items: center;
								font-size:26rpx;
								margin-bottom:10rpx;
								color:#999999;
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
								width:30rpx;
								height:30rpx;
								margin-right:15rpx;
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
								font-size:24rpx;
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
							background:rgba(242, 242, 242, 0.5);
							border-radius: 20rpx;
							padding:24rpx;
							margin-bottom:24rpx;
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
									.comm_name{
										font-size:30rpx;
										color:#333333;
									}
									.comm_post{
										font-size:26rpx;
										color:#999999;
										margin:0 15rpx;
									}
									.comm_status{
										font-size:26rpx;
										color:#999999;
									}
								}
								.comm_li_right{
									font-size:30rpx;
									color:#F2533E;
								}
							}
							.comm_li_bot{
								display: flex;
								justify-content: space-between;
								margin-top:10rpx;
								.comm_li_con{
									font-size:26rpx;
									color:#0287FF;
									white-space:normal; 
									word-break:break-all;
									flex:1;
								}
								.comm_li_time{
									font-size:22rpx;
									color:#999999;
									flex-shrink: 0;
								}
							}
						}
					}
				}
			}
		}
	}
</style> 
