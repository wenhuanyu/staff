<template>
	<view>
		<!-- 搜索 -->
		<view class="searchbox">
			<view class="selfsearh">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" placeholder="请输入关键词搜索邮件" @input="changeName" class="searinput">
			</view>
			<view class="select">
				<image :src="BASE_IMG_URL+'/index/all.png'" class="allimg" ></image>
				<view class="seletext" @click="isToSelect">{{isSelect ? '取消' : '选择'}}</view>
			</view>
		</view>
		<view class="tablist">
			<view class="tabtext" :class="type == 2 ? 'tab_active' : ''" @click="changeTab(2)">全部邮件</view>
			<view class="tabtext" :class="type == 0 ? 'tab_active' : ''" @click="changeTab(0)">未读</view>
			<view class="tabtext" :class="type == 1 ? 'tab_active' : ''" @click="changeTab(1)">已读</view>
		</view>
		<scroll-view class="scrollbox" scroll-y>
			<view class="itemwarp">
				<view class="itemli" v-for="(item,index) in list" :key="index">
					
					<van-swipe-cell :right-width="65">
						<van-cell-group>
							<view class="boxitem" @click="toDetail(item)">
								<radio value="r1" v-if="isSelect" :checked="item.isSelect" color="#008EFF" />
								<view class="li_item">
									<view class="li_item_top">
										<view class="litop_left">
											<view class="li_title">{{item.from_name}}</view>
										</view>
										<view class="li_time">{{item.receivetime}}</view>
									</view>
									<view class="li_item_bot">
										<view class="li_item_bot_left">
											{{item.theme}}
										</view>
										<view class="li_bot_no" v-if="item.is_read == 0"></view>
									</view>
								</view>
							</view>
						</van-cell-group>
						<view slot="right">
							<view class="right_btn" @click="toDel(item)">
								<image :src="BASE_IMG_URL+'/index/delete.png'" class="delimg" ></image>
							</view>
						</view>
					</van-swipe-cell>
				</view>
				<view class="noData" v-if="list.length == 0">暂无更多</view>
			</view>
		</scroll-view>
		
		<view class="mailbot" v-if="isSelect">
			<view class="bot_left" @click="toAll">
				<radio value="2" color="#008EFF" style="transform: scale(0.7);" :checked="isSelectAll" /><text>{{isSelectAll ? '取消' : '全选'}}</text>
			</view>
			<view class="bot_right" @click="toDelAll">
				<image :src="BASE_IMG_URL+'/index/delete.png'" class="moreimg" ></image>
			</view>
		</view>
		<view class="mailbot" v-if="!isSelect">
			<view class="bot_left" @click="toSend">
				<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="maileditimg" ></image>
				<view class="bot_text">写邮件</view>
			</view>
			<view class="bot_right" @click="showOther">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="moreimg" ></image>
			</view>
		</view>
		
		<other-tab ref="otherChild"></other-tab>
	</view>
</template>

<script>
	import { netEmailList, netDelEmail, netSendEmailList } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import otherTab from './components/otherTab.vue'
	
	export default {
		components:{
			otherTab
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				page:1,
				totalPage:1,
				list:[],
				isSelect:false,
				isSelectAll:false,
				type:2,//全部  0未读   1已读
				name:'',
				action:2,  //action  1已发送   2收件箱
			}
		},
		onLoad(options) {
			this.action = options.action
		},
		onShow() {
			if(this.action == 1){
				uni.setNavigationBarTitle({
					title:'已发送'
				})
			}else{
				uni.setNavigationBarTitle({
					title:'收件箱'
				})
			}
			this.init()
		},
		methods: {
			showOther() {
				this.$refs.otherChild.open()
			},
			toSend() {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/send_mail'
				})
			},
			changeName(e) {
				this.name = e.detail.value
				this.init()
			},
			changeTab(type) {
				this.type = type
				this.init()
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			getList() {
				let params = {
					page:this.page,
					name:this.name,
					is_read:this.type == 2 ? '' : this.type
				}
				if(this.action == 2) {
					netEmailList(params).then(res=>{
						this.handle(res.data.data)
						this.totalPage = res.data.last_page
					})
				}else if(this.action == 1) {
					netSendEmailList(params).then(res=>{
						this.handle(res.data.data)
						this.totalPage = res.data.last_page
					})
				}
				
			},
			handle(data){
				data.forEach(ele=>{
					ele.isSelect = false
				})
				this.list = this.list.concat(data)
			},
			isToSelect() {
				this.isSelect = !this.isSelect
				
			},
			toAll() {
				this.isSelectAll = !this.isSelectAll
				let arr = this.list
				if(this.isSelectAll){
					arr.forEach(ele=>{
						ele.isSelect = true
					})
				}else{
					arr.forEach(ele=>{
						ele.isSelect = false
					})
				}
				this.list = arr
			},
			toDel(item){
				let params = {id:item.id}
				netDelEmail(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getList()
					},2000)
				})
			},
			toDelAll() {
				let arr = this.list
				let newArr = []
				arr.forEach(ele=>{
					if(ele.isSelect) {
						newArr.push(ele.id)
					}
				})
				let params = {id:newArr.join(',')}
				netDelEmail(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.init()
					},2000)
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/user/mailbox/mail_detail?id='+item.id
				})
			}
		}	
	}
</script>

<style lang="scss" scoped>
.searchbox{
	padding:24rpx 35rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background:$uni-text-color;
	.selfsearh{
		width:514rpx;
		height:68rpx;
		border-radius: 34rpx;
		background:#fff;
		padding:0 15rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.searimg{
			width:48rpx;
			height:48rpx;
		}
		.searinput{
			margin-left:24rpx;
			font-size:26rpx;
			color:$uni-text-color;
		}
	}
	.select{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.allimg{
			width:48rpx;
			height:48rpx;
			margin-right:15rpx;
		}
		.seletext{
			font-size:30rpx;
			color:#FFFFFF;
		}
	}
}
.tablist{
	padding:30rpx 60rpx;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	.tabtext{
		padding:10rpx 25rpx;
		border-radius: 20rpx;
		font-size:30rpx;
		color:$uni-text-color;
		border:1rpx solid $uni-text-color;
		margin-right:24rpx;
	}
	.tab_active{
		background:$uni-text-color;
		color:#fff;
	}
}
.mailbot{
	width:750rpx;
	height:97rpx;
	position: fixed;
	left:0;
	bottom:0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background:#fff;
	padding:0 30rpx;
	border-top:1rpx solid #f5f5f5;
	.bot_left{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.maileditimg{
			width:40rpx;
			height:40rpx;
			margin-right:15rpx;
		}
		.bot_text{
			font-size:28rpx;
			color:$uni-text-color
		}
	}
	.bot_right{
		width:40rpx;
		height:38rpx;
		.moreimg{
			width:40rpx;
			height:38rpx;
		}
	}
}
.scrollbox{
	width:100%;
	height:calc(100vh - 340rpx);
	.itemwarp{
		width:100%;
		margin-top:15rpx;
		.itemli{
			width:690rpx;
			margin:0 auto 24rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			border-radius: 20rpx;
			.boxitem{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width:690rpx;
				padding:30rpx;
				radio{
					transform: scale(0.7);
					margin-right:24rpx;
					flex-shrink: 0;
				}
			}
			.li_item{
				flex:1;
				.li_item_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.litop_left{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.liimg{
							width:50rpx;
							height:50rpx;
							border-radius: 50%;
							margin-right:24rpx;
						}
						.li_title{
							width:300rpx;
							font-size:30rpx;
							color:#333333;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
				}
				.li_item_title{
					font-size:28rpx;
					color:#333333;
					margin:15rpx 0;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.li_item_bot{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top:15rpx;
					.li_item_bot_left{
						font-size:24rpx;
						color:#999999;
						width:530rpx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.li_bot_no{
						width:26rpx;
						height:26rpx;
						background:#FFA205;
						border-radius: 50%;
					}
				}
			}
			.right_btn{
				width:130rpx;
				height:146rpx;
				background:#F2533E;
				display: flex;
				justify-content: center;
				align-items: center;
				border-top-right-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				.delimg{
					width:39rpx;
					height:43rpx;
				}
			}
		}
		
	}
}
</style>
