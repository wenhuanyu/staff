<template>
	<view class="">
		<!-- 顶部 -->
		<common-top title="商机" @toStaticPage="toStaticPage"></common-top>
		
		<view class="tab_list" style="margin-top:0;">
			<view class="tabli" :class="type == 0 ? 'tabliactive' : ''" @click="changeFirTab(0)">全部</view>
			<view class="tabli" :class="type == 1 ? 'tabliactive' : ''" @click="changeFirTab(1)">我负责的</view>
			<view class="tabli" :class="type == 2 ? 'tabliactive' : ''" @click="changeFirTab(2)">下属负责的</view>
		</view>
		<!-- 筛选 -->
		<view class="searchbox">
			<view class="searchtext" @click="toQuery">筛选<view class="iconfont icon-shaixuan"></view></view>
		</view>
		
		<view class="manage_con">
			<view class="clineInfo" v-for="(item,index) in list" :key="index" @click.stop="toDetail(item)">
				<view class="info_head">
					<view>{{item.name}}</view>
				</view>
				<view class="info_main">
					<view >
						<view class="main_left">
							<view class="left_top" v-if="item.customer" style="margin-top: 20rpx;color: #666;font-size: 30rpx;">
								{{item.customer ? item.customer.name : '--'}}
							</view>
							<view class="left_followUp" style="margin-top: 20rpx;color: #666;font-size: 30rpx;">
								<view>下次跟进时间：</view>
								<view>{{item.next_time ? item.next_time : '--'}}</view>
							</view>
							<view class="left_followUp" style="margin-top: 20rpx;color: #666;font-size: 30rpx;">
								<view>商机金额：</view>
								<view>{{item.money ? item.money : '--'}}</view>
							</view>
							<view class="left_foot">
								<view class="l_box">
									<span v-if="item.type == 0">初期沟通</span>
									<span v-if="item.type == 1">立项跟踪</span>
									<span v-if="item.type == 2">方案/报价</span>
									<span v-if="item.type == 3">谈判审核</span>
									<span v-if="item.type == 4">赢单</span>
									<span v-if="item.type == 5">输单</span>
									<span v-if="item.type == 6">无效</span>
								</view>
							</view>
						</view>
					</view>
					<view class="main_right" v-if="item.owner_staff">
						<image :src="item.owner_staff ? item.owner_staff.img : BASE_IMG_URL+'/headImg.png'"  mode="scaleToFill">
						</image>
						<view>{{item.owner_staff?item.owner_staff.name:''}}</view>
					</view>
				</view>
				<view class="info_footer" @click.stop.prevent>
					<view class="footer_content" @click="toAddfollow(item)">
						<image :src="BASE_IMG_URL+'/index/add.png'"  mode="scaleToFill"></image>
						<view>跟进</view>
					</view>
					<view class="footer_content" @click="toTrans(item)">
						<image :src="BASE_IMG_URL+'/zhuanyi.png'"  mode="scaleToFill"></image>
						<view>转移</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
		
		<view class="icon_creat" @click="addBusiness">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'" mode="scaleToFill"></image>
		</view>
		
		<view class="bot_total" @click="lookTotal">总金额合计> </view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="botwarp">
				<view class="wa_li">
					<view class="wa_label">商机总金额</view>
					<view class="wa_money"> <text>{{moneyInfo.allmoney?moneyInfo.allmoney:'0'}}</text>元 </view>
				</view>
				<view class="wa_li">
					<view class="wa_label">已成交金额</view>
					<view class="wa_money"> <text>{{moneyInfo.repayment_money?moneyInfo.repayment_money:'0'}}</text>元 </view>
				</view>
				<view class="wa_li">
					<view class="wa_label">未成交金额</view>
					<view class="wa_money"> <text>{{moneyInfo.no_money?moneyInfo.no_money:'0'}}</text>元 </view>
				</view>
				<view class="wa_btn" @click="removeTotal">取消</view>
			</view>
		</uni-popup>
		<!-- 筛选 -->
		<screen-pop 
			ref="screenChild" 
			@sureParams="sureParams"
			:searchForm="searchForm"
			@changeSearchData="changeSearchData"
			@resetForm="resetForm"
		></screen-pop>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netBusinessList } from '@/api/api.js'
	import screenPop from './screen.vue'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				type:0,
				page:1,
				totalPage:1,
				queryParams:{},
				moneyInfo:{},
				searchForm:null,
				defaultObj:{times:'',status:null}
			}
		},
		onLoad(options) {
			if(options.type){
				this.defaultObj = {
					times: options.times,
					status: options.status?options.status:''
				}
				this.type = options.type
			}
			this.handleSearchForm('business',(data)=>{
				this.searchForm = data
			})
		},
		onShow() {
			this.init()
		},
		onReachBottom() {
			if(this.page < this.totalPage){
				this.page ++
				this.getList()
			}
		},
		methods:{
			toStaticPage() {
				uni.navigateTo({
					url:'/pagesB/business/businessStatis'
				})
			},
			changeSearchData(type,key,value){
				let obj = this.handleChangeSearchValue(this.searchForm,type,key,value)
				this.$set(this.searchForm, obj.v_index, obj.v_obj)
			},
			resetForm() {
				let arr = JSON.parse(JSON.stringify(this.handleResetSearch(this.searchForm)))
				this.searchForm = arr
			},
			//查看总金额合计
			lookTotal() {
				this.$refs.popup.open()
			},
			removeTotal() {
				this.$refs.popup.close()
			},
			init() {
				this.page = 1
				this.list = []
				this.getList()
			},
			changeFirTab(type) {
				this.type = type
				this.init()
			},
			toQuery() {
				this.$refs.screenChild.open(this.defaultObj)
			},
			sureParams(params) {
				this.queryParams = params
				this.defaultObj = {
					times: params.times,
					status: params.contract_status
				}
				this.init()
			},
			getList() {
				let params = {
					page:this.page,
					type:this.type,
					createtime:this.defaultObj.times,
					contract_status:this.defaultObj.status,
					...this.queryParams,
					...this.handleSureSearch(this.searchForm)
				}
				netBusinessList(params).then(res=>{
					this.list = res.data.data
					this.totalPage = res.data.last_page
					this.moneyInfo = res.data.moneyinfo
				})
			},
			addBusiness(){
				uni.navigateTo({
					url:'/pagesB/business/addBusiness'
				})
			},
			//商机详情
			toDetail(item){
				uni.navigateTo({
					url:'/pagesB/business/detail?id='+item.id
				})
			},
			//添加跟进
			toAddfollow(item) {
				uni.navigateTo({
					url: '/pagesB/cluesManagement/newFllow?id='+item.id+'&type=5'
				})
			},
			//转移商机
			toTrans(item) {
				uni.navigateTo({
					url:'/pagesB/business/trans?id='+item.id
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
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 130rpx;
		right: 100rpx;
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
	}
	.clineInfo {
		background-color: #fff;
		padding: 30rpx 45rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: 2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);
	
		.info_head {
			display: flex;
			justify-content: space-between;
	
			:first-child {
				font-size: 34rpx;
				font-weight: 700;
				color: #333;
			}
		}
	
		.info_main {
			display: flex;
			justify-content: space-between;
	
			.main_left {
				.left_followUp {
					display: flex;
					font-size: 30rpx;
					color: #666;
				}
	
				.left_star {
					font-size: 30rpx;
					color: #666;
					display: flex;
					padding-bottom: 30rpx;
				}
	
				.left_foot {
					padding-bottom: 20rpx;
					margin-top:25rpx;
					.l_box {
						margin-right: 35rpx;
						float: left;
	
						span {
							background: $uni-bg-opacity;
							padding: 5rpx 12rpx;
							font-size: 26rpx;
							color: $uni-text-color;
							border-radius: 5rpx;
						}
					}
				}
			}
	
			.main_right {
				text-align: center;
				padding: 20rpx 15rpx 0 0;
	
				image {
					border-radius: 50%;
					width: 129rpx;
					height: 129rpx;
					margin-bottom: 5rpx;
				}
			}
		}
	
		.info_footer {
			display: flex;
			justify-content: space-around;
			padding-top: 30rpx;
			height: 80rpx;
			border-top: 1px solid #ededed;
			margin-top: 20rpx;
	
			.footer_content {
				// width: 25%;
				line-height: 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width: 48rpx;
					height: 48rpx;
					margin-right: 15rpx;
				}
			}
		}
	}
	.searchbox{
		display: flex;
		justify-content: flex-end;
		margin:24rpx;
		.searchtext{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:$uni-text-color;
			padding:8rpx 28rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
			.icon-shaixuan{
				color:$uni-text-color;
			}
		}
	}
	.tab_list{
		width:750rpx;
		height:80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background:#fff;
		.tabli{
			font-size:24rpx;
			color:#333;
			line-height: 75rpx;
			text-align: center;
			border-bottom:4rpx solid #fff;
		}
		.tabliactive{
			border-bottom:4rpx solid $uni-text-color;
		}
	}
	
	.bot_total{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:calc(80rpx + env(safe-area-inset-bottom) / 2);
		background:#fff;
		font-size:24rpx;
		color:#333;
		text-align: center;
		line-height: 80rpx;
		color:$uni-text-color;
		border-top:1rpx solid #f5f5f5;
		padding-bottom:calc(env(safe-area-inset-bottom) / 2);
	}
	.botwarp{
		background:#fff;
		padding:0 24rpx;
		.wa_li{
			padding:24rpx 35rpx;
			border-bottom:1rpx solid #f5f5f5;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.wa_label{
				font-size:24rpx;
				color:#333;
			}
			.wa_money{
				font-size:24rpx;
				color:#666;
				text{
					color:$uni-text-color;
				}
			}
		}
		.wa_btn{
			width:100%;
			height:100rpx;
			font-size:24rpx;
			color:$uni-text-color;
			text-align: center;
			line-height: 100rpx;
		}
	}
</style>