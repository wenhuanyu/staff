<template>
	<view style="padding:24rpx 0;">
		<view class="follow_item_box" v-for="(item,index) in list" :key="index" >
			<view class="follow_item_top">
				<view class="item_info">
					<image :src="item.staff.img" class="headerimg" ></image>
					<view class="item_infor_right">
						<view class="info_top">
							<view class="info_top_left">
								<view class="info_name">{{item.staff.name}}</view>
								<view class="info_post">{{item.staff.post}}</view>
							</view>
							<view class="info_top_right">{{item.relation_process}}</view>
						</view>
						<view class="info_time" v-if="item.relation_type == 'workorder'" @tap.stop="toOrderDetail(item)">
							关联：<text>{{item.workorder.title}}</text>
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
						<view class="follow_img_list" v-if="item.file_ids.length != 0" @tap.stop.prevent>
							<view class="imgbox" v-for="(imgitem,imgindex) in item.file_ids" :key="imgindex" @tap.stop="toPreviimg(item.file_ids,imgindex)">
								<image :src="imgitem" class="follow_img" ></image>
							</view>
						</view>
					</view>
					<view class="address_right" @tap.stop="toOpenMap(item)" v-if="item.location">
						<view class="address_ri_top">
							<span>签到时间：</span>{{item.createtime}}
						</view>
						<view class="address_ri_top">
							<span>签到地点：</span>{{item.location?item.location:''}}
						</view>
						<view class="address_ri_bot">
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
						<view class="info_time">{{item.createtime}}</view>
					</view>
					<view class="fol_top_right">
						<view class="right_text" @tap.stop="toDetail(item)">评论({{item.comment?item.comment:0}})</view>
					</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="list.length == 0">暂无更多</view>
	</view>
</template>

<script>
	import { netFollowList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				page:1,
				totalPage:1,
				createtime:'',
				idlist:'',
				list:[]
			}
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		onLoad(options) {
			this.createtime = options.time
			this.idlist = options.idlist
			this.getList()
		},
		methods:{
			getList() {
				let params = {
					page: this.page,
					createtime: this.createtime,
					id_list: this.idlist
				}
				netFollowList(params).then(res=>{
					this.totalPage = res.data.last_page
					this.list = this.list.concat(res.data.data)
				})
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
			//详情
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/record_detail?id='+item.id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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
							color: $uni-text-color;
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
					background: #FE9440;
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
						color:$uni-text-color;
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
</style>
