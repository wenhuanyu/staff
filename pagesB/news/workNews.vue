<template>
	<view>
		<view class="work_trend">
			<view class="querylist">
				<view class="queryfir">
					<picker  @change="changeRead" :range="readList" :value="readIndex">
						<view class="form_right">
							<view>{{readList[readIndex] ? readList[readIndex] : '请选择'}}</view>
							<image :src="BASE_IMG_URL+'/newxia.png'" class="bottomimg" mode="scaleToFill"></image>
						</view>
					</picker>
				</view>
			</view>
			<view class="item_content" v-for="(item,index) in workList" :key="index" @click.stop="clientClick(item,index)">
				<view class="unread" v-if="item.is_read != 1"></view>
				<view class="con_img">
					<image :src="item.staff.img ? item.staff.img :BASE_IMG_URL+'/headImg.png'" mode="scaleToFill"></image>
					<view class="main_first">
						<view class="main_title" >
							<view class="first_left">
								<view>{{item.staff.name}}</view>
								<view class="fontColor">{{item.staff.post?item.staff.post:''}}</view>
							</view>
							<view class="main_type daofang" v-if="item.follow_type == '到访'">{{item.follow_type}}</view>
							<view class="main_type genjin" v-if="item.follow_type == '跟进'">{{item.follow_type}}</view>
							<view class="main_type other" v-if="item.follow_type != '跟进' && item.follow_type != '到访'">{{item.follow_type}}</view>
						</view>
						<view class="fontColor main_time">{{item.follow_time}}</view>
					</view>
				</view>
				<view class="con_main">
					<view class="main_second">
						<view>{{item.content}}</view>
					</view>
					<view class="main_img" v-if="item.file.length != 0">
						<image 
							:src="ele.file_path" 
							v-for="(ele,fileindex) in item.file" 
							:key="fileindex" 
							v-if="ele.types == 'image'"
							class="imgbox" 
							 mode="scaleToFill"
							@click.stop="toPrevieImg(ele.file_path)"
						></image>
					</view>
					<view class="main_third fontColor" v-if="item.next_time != null">
						<view class="third_left" >
							<view class="lxs_time">下次跟进时间：{{item.next_time}}</view>
						</view>
						<view class="third_right">
							<view class="iconfont icon-you"></view>
						</view>
					</view>
				</view>
			</view>
			<view style="height: 200rpx;"></view>
			<view class="noData" v-if="workList.length == 0">暂无更多</view>
		</view>
	</view>
</template>

<script>
	import { netKehuFollow } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	export default{
		data() {
			return{
				readList:['全部','已读','未读'],
				readIndex:0,
				page:1,
				totalPage:1,
				limit:10,
				workList:[],
				BASE_IMG_URL:BASE_IMG_URL,
			}
		},
		onShow() {
			this.workList = []
			this.page = 1
			this.getWorkList()
		},
		onReachBottom() {
			if(this.tabindex == 2){
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getWorkList()
			}
		},
		methods:{
			//获取 工作 动态
			getWorkList() {
				let params = {
					page: this.page,
					limit:this.limit,
					is_read: this.readIndex
				}
				netKehuFollow(params).then(res=>{
					this.workList = this.workList.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			//筛选 已读  未读
			changeRead(e) {
				this.readIndex = e.detail.value
				this.page = 1
				this.workList = []
				this.getWorkList()
			},
			//查看 图片
			toPrevieImg(file) {
				uni.previewImage({
					urls: [file]
				})
			},
			//工作动态  跳转到详情页面
			clientClick(item,index) {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/followUpDetail/followUpDetail?id='+item.id,
					success:()=>{
						let arr = this.workList
						arr[index].is_read = 1
						this.workList = arr
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.querylist{
		margin:40rpx 0 30rpx;
		padding:0 30rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.queryfir{
			margin-right:15rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			background:#fff;
			border-radius: 8rpx;
			.form_right{
				width:180rpx;
				height:50rpx;
				font-size:22rpx;
				color:#666;
				text-align: center;
				line-height: 48rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.bottomimg{
					width:20rpx;
					height:33rpx;
					margin-left:15rpx;
				}
			}
		}
	}
	//  工作动态
	.work_trend {
		padding: 0 30rpx 0 30rpx ;
		.querylist{
			padding:0;
			.queryfir{
				margin-right:0;
			}
		}
		.item_content {
			display: block;
			background-color: #fff;
			padding: 24rpx 24rpx 10rpx; 
			border-radius: 10rpx;
			margin-bottom: 30rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			position: relative;
			.unread{
				width:10rpx;
				height:10rpx;
				border-radius: 50%;
				position: absolute;
				right:5rpx;
				top:5rpx;
				background:#F43F3B;
			}
			.con_img {
				display: flex;
				.main_first {
					margin-bottom: 25rpx;
					padding-left: 25rpx;
					flex: 1;
					.main_time{
						line-height: 25px;
					}
					.main_title{
						display: flex;
						justify-content: space-between;
						.first_left {
							display: flex;
						
							:first-child {
								font-size: 32rpx;
								margin-right: 10rpx;
								margin-top: -3rpx;
							}
						
							:last-child {
								margin-top: 2rpx;
							}
						}
						.main_type{
							padding:5rpx 20rpx;
							border-radius: 5rpx;
							color:#fff;
						}
						.daofang{
							background:$uni-text-color;
						}
						.genjin{
							background:#ff7800;
						}
						.other{
							background:#1CBBB4;
						}
					}
					
				}
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}
		
			.con_main {
				flex: 1;
				.main_second{
					padding-bottom:20rpx;
				}
				.main_img{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;
					margin-top: 20rpx;
					.imgbox{
						padding: 10rpx;
						border-radius: 5rpx;
						border:1rpx solid #CCC;
						width:160rpx;
						height:160rpx;
						margin-right:14rpx;
						margin-bottom:14rpx;
					}
				}
				.main_third {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 20rpx 0 10rpx;
					.third_left {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.lxs_time{
							font-size:28rpx;
							margin-left:10rpx;
						}
					}
		
					.third_right {
						display: flex;
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
	
		.fontColor {
			color: #999;
		}
	
		.lxs_itme {
			padding-left: 5px;
			padding-top: 2px;
		}
	}
</style> 
