<template>
	<view>
		<view class="new_info_warp">
			<view class="infobox">
				<view class="info_topli">
					<view class="info_li" style="margin-bottom:15rpx">
						<view class="first_child">
							{{info.name ? info.name : ''}}
						</view>
					</view>
					<view class="info_li">
						<view class="info_text" >
							<view><span>电话：</span>{{info.contacts && info.contacts.mobile?info.contacts.mobile:''}}</view>
						</view>
					</view>
					<view class="info_li">
						<view class="info_text" >
							<view><span>地址：</span>{{info.address?info.address:''}}</view>
						</view>
					</view>
					<view class="info_li">
						<view class="info_text">
							<view><span>最后跟进时间：</span>{{info.last_time?info.last_time:''}}</view>
						</view>
					</view>
					<view class="info_li" style="border-top:1rpx solid #EDEDED;margin-top:40rpx;padding-top:15rpx;">
						<view class="info_text">
							<view class="detailbtn" @click="selectPhone(info.contacts.mobile)">
								<image :src="BASE_IMG_URL + '/index/phone-call.png'" class="phone_img" ></image>
							</view>
							<view class="detailbtn" @click="toAddress">
								<image :src="BASE_IMG_URL + '/index/local.png'" class="address_img" ></image>
							</view>
							<view class="detailbtn" @click="toQuery">
								<image :src="BASE_IMG_URL+'/index/qichacha2.png'" style="height:48rpx;width:42rpx" class="address_img" ></image>
							</view>
						</view>
					</view>
				</view>
				<view class="newinfobox">
					<view class="info_bottomli">
						<view class="info_li">
							<view class="info_text">
								<span>销售总额</span>{{info.c_money ? info.c_money : '0'}}
							</view>
						</view>
						<view class="info_li">
							<view class="info_text">
								<span>回款总额</span>{{info.receivables_total && info.receivables_total.r_money ? info.receivables_total.r_money : '0'}}
							</view>
						</view>
					</view>
					<view class="info_bottomli">
						<view class="info_li">
							<view class="info_text">
								<span>工单收款</span>{{info.w_money ? info.w_money : '0'}}
							</view>
						</view>
						<view class="info_li">
							<view class="info_text">
								<span>费用总额</span>{{info.s_money ? info.s_money : '0'}}
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		<!-- 更多操作 -->
		<more-pop  
			relation_type="customer" 
			:relation_id="id" 
			:remindPeople="remindPeople"  
			:staffList="teamList"
			@delExamine="delPeople"
			v-if="info.is_operation == 1"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		
		<view class="tabwarp">
			<scroll-view scroll-x="true" style="width:750rpx;">
				<view class="tablist_new_list">
					<view class="tabtn" @click="changeTab(0)" :class="{'tabtn_active':active == 0}">跟进动态</view>
					<view class="tabtn" @click="changeTab(1)" :class="{'tabtn_active':active == 1}">任务计划</view>
					<view class="tabtn" @click="changeTab(2)" :class="{'tabtn_active':active == 2}">基本信息</view>
					<view class="tabtn" @click="changeTab(3)" :class="{'tabtn_active':active == 3}">工作内容</view>
					<view class="tabtn" @click="changeTab(4)" :class="{'tabtn_active':active == 4}">操作记录</view>
				</view>
			</scroll-view>
			
			<!-- 跟进动态 -->
			<scroll-view scroll-y="true" class="scrollbox" v-show="active == 0">
				<follow-info :customerType="type" ref="followChild" @seePicture="seePicture" :operation="info.is_operation"></follow-info>
			</scroll-view>
			<!-- 任务计划 -->
			<scroll-view scroll-y="true" class="scrollbox" v-show="active == 1">
				<visit-plan 
					:customerType="type" 
					ref="planChild" 
					:operation="info.is_operation"
					@shaixuan="shaixuan"
				></visit-plan>
			</scroll-view>
			<!-- 基本信息 -->
			<scroll-view scroll-y="true" class="scrollbox" v-show="active == 2">
				<base-info ref="infoChild"></base-info>
			</scroll-view>
			<!-- 工作内容 -->
			<scroll-view scroll-y="true" class="scrollbox" v-show="active == 3">
				<other-info :customerType="type" ref="otherInfoChild" @seePicture="seePicture" :operation="info.is_operation"></other-info>
			</scroll-view>
			<!-- 操作记录 -->
			<scroll-view scroll-y="true" class="scrollbox" v-show="active == 4">
				<operation-record ref="operationChild"></operation-record>
			</scroll-view>
		</view>
		
		<view style="height:calc(100rpx + env(safe-area-inset-bottom));"></view>
		<view class="de_bottom" v-if="type != 2 && info.is_operation == 1">
			<view class="de_li" @click="toAddDongtai" >
				<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="editimg" ></image>
				<view class="de_text">跟进</view>
			</view>
			<view class="de_li" @click="toEditCustomer" >
				<image :src="BASE_IMG_URL+'/index/edit-kehu.png'" class="editimg" ></image>
				<view class="de_text">编辑</view>
			</view>
			<view class="de_li" @click="toLookMore">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="editimg" ></image>
				<view class="de_text">更多</view>
			</view>
		</view>
		<uni-popup ref="morePopup" type="bottom" background-color="#fff">
			<view class="popuptitle">更多操作</view>
			<view class="ope_warp">
				<view class="ope_li" @click="transferCustomer">
					<image :src="BASE_IMG_URL+'/index/zhuangpai.png'" class="opeimg" ></image>
					<view class="litext">转移客户</view>
				</view>
				<view class="ope_li" @click="moveCustomer">
					<image :src="BASE_IMG_URL+'/index/chexiao.png'" class="opeimg" ></image>
					<view class="litext">移入公海</view>
				</view>
				<view class="ope_li" @click="toSign">
					<image :src="BASE_IMG_URL+'/signin.png?v=20221012'" class="opeimg" ></image>
					<view class="litext">出差签到</view>
				</view>
			</view>
		</uni-popup>
		
		<screen-visit ref="visitScreen" @sureQuery="sureQuery" ></screen-visit>
	</view>
</template>

<script>
	import visitPlan from './visitPlan.vue'
	import baseInfo from './baseInfo.vue'
	import otherInfo from './otherInfo.vue'
	import followInfo from './follow_info.vue'
	import { netCustomerDetail, netRemoveSeas, netTeamList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import screenVisit from './components/screenVisit.vue'
	import operationRecord from './operation_record.vue'
	
	export default{
		mixins:[commonFun],
		components:{
			visitPlan,
			baseInfo,
			otherInfo,
			followInfo,
			screenVisit,
			operationRecord
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				showMore:false,
				id:'',   //客户id
				info:{},
				active:0,
				lookImg:false,
				type:1,   //1我的客户   2公海客户
				remindPeople:[],
				examineType:'',
				isFixed:false,
				teamList:[]
			}
		},
		onLoad(options){
			this.id = options.customerid
			this.type = options.type
		},
		onShow(){
			this.getDefaultRemind()
			if(!this.lookImg){
				this.getDetail()
				//获取 客户团队成员
				this.getTeamList()
			}
		},
		methods:{
			//查看更多操作
			toLookMore() {
				this.$refs.morePopup.open()
			},
			//团队成员
			getTeamList() {
				netTeamList({id:this.id}).then(res=>{
					this.teamList = res.data
				})
			},
			//查询工商信息
			toQuery() {
				uni.navigateTo({
					url:'/pagesA/user/business_infomation/detail?name='+this.info.name
				})
			},
			shaixuan() {
				this.$refs.visitScreen.open()
			},
			sureQuery(params) {
				this.$refs.planChild.sureQuery(params)
			},
			delPeople(index){
				this.remindPeople.splice(index,1)
				uni.setStorageSync('remindlist', this.remindPeople)
				this.getDefaultRemind()
			},
			//传阅
			toCirculate() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.id+'&type=customer'
				})
			},
			//呼叫 联系人
			selectPhone(mobile) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: mobile,
					code: '+86',
					showDingCall: true,
					success:()=>{
						uni.navigateTo({
							url:'/pagesA/customerInfo/visit/add_phone_followup?id='+this.id+'&name='+this.info.contacts.name
						})
					}
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.makePhoneCall({
					phoneNumber	: mobile,
					success:(res)=>{
						uni.navigateTo({
							url:'/pagesA/customerInfo/visit/add_phone_followup?id='+this.id+'&name='+this.info.contacts.name
						})
					}
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(mobile, true);
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/add_phone_followup?id='+this.id+'&name='+this.info.contacts.name
				})
				// #endif
			},
			//添加  跟进动态
			toAddDongtai() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/add_followup?customerid='+this.id
				})
			},
			//编辑客户
			toEditCustomer() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/editCustomer?customerid='+this.id
				})
			},
			//转移客户
			transferCustomer() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/transferCustomer?id='+this.id+'&name=转移客户',
					success:()=>{
						this.$refs.morePopup.close()
					}
				})
			},
			//更改级别
			toChangeLevel() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/level/changeLevel?id='+this.id,
					success:()=>{
						this.$refs.morePopup.close()
					}
				})
			},
			//移入  公海
			moveCustomer() {
				uni.showModal({
					title:'提示',
					content:'确认要将当前客户移到公海吗?',
					success:(res)=>{
						if(res.confirm){
							let params = { id:this.id }
							netRemoveSeas(params).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								uni.setStorageSync('removeSeas',true)
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},1000)
							})
						}
					}
				})
			},
			getDetail() {
				netCustomerDetail({id:this.id}).then(res=>{
					this.info = res.data
					this.init()
				})
			},
			changeTab(e) {
				this.active = e
				this.init()
			},
			init() {
				if(this.active == 0) {
					//跟进动态
					this.$refs.followChild.init(this.id,1)
				}else if(this.active == 1) {
					//任务计划
					this.$refs.planChild.init(this.id)
				}else if(this.active == 2){
					//基本信息
					this.$refs.infoChild.init(this.id,this.info)
				}else if(this.active == 3){
					//工作内容
					this.$refs.otherInfoChild.init(this.id,this.info)
				}else{
					//操作记录
					this.$refs.operationChild.init(this.id)
				}
			},
			seePicture() {
				this.lookImg = true
			},
			//查看客户位置
			toAddress() {
				uni.openLocation({
					latitude:this.info.lat,
					longitude:this.info.lng,
					address:this.info.address,
					name:this.info.address,
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			//出差签到
			toSign() {
				uni.navigateTo({
					url:'/pagesB/signin/busSign?customerid='+this.id,
					success:()=>{
						this.$refs.morePopup.close()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ope_warp{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding:30rpx 0;
		.warpbox{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
		.ope_li{
			width:33.33%;
			margin-bottom:24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.opeimg{
				width:38rpx;
				height:38rpx;
				margin-bottom:10rpx;
			}
			.litext{
				font-size:26rpx;
				color:#999999;
				text-align: center;
			}
		}
	}
	//tab栏
	.tablist_new_list{
		padding:24rpx 10rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.tabtn{
			flex-shrink: 0;
			width:170rpx;
			text-align: center;
			font-size:26rpx;
			color:#999;
			padding-bottom:20rpx;
			position: relative;
			&::after{
				content:'';
				position: absolute;
				left:50%;
				transform: translateX(-50%);
				bottom:0;
				width:80rpx;
				height:10rpx;
				background:#fff;
				border-radius: 10rpx;
			}
		}
		.tabtn_active{
			width:170rpx;
			text-align: center;
			font-size:26rpx;
			color:#333;
			padding-bottom:20rpx;
			position: relative;
			&::after{
				content:'';
				position: absolute;
				left:50%;
				transform: translateX(-50%);
				bottom:0;
				width:80rpx;
				height:10rpx;
				background:$uni-btn-bg-color;
				border-radius: 10rpx;
				opacity: 0.5;
			}
		}
	}
	.new_info_warp{
		padding: 0 30rpx;
		background: linear-gradient(180deg, $uni-btn-bg-color 0%, $uni-btn-bg-color 57%, #FFFFFF 85%);
		.infobox{
			.info_topli{
				padding: 30rpx 40rpx;
				width: 690rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;
				box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
				.info_li{
					.info_text{
						display: flex;
						justify-content: space-between;
						font-size:26rpx;
						color:#666666;
						margin-bottom:10rpx;
						span{
							color:#666666;
						}
						.detailbtn{
							width:50%;
							height:50rpx;
							border-radius: 5rpx;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							border-right:1rpx solid #EDEDED;
							&:last-child{
								border-right:0;
							}
							.phone_img{
								width:40rpx;
								height:40rpx;
								flex-shrink: 0;
							}
							.address_img{
								width:40rpx;
								height:40rpx;
								flex-shrink: 0;
							}
						}
					}
				}
				
			}
			.newinfobox{
				margin: 20rpx 0;
				width: 690rpx;
				height: 268rpx;
				padding:40rpx 140rpx;
				border-radius: 10rpx;
				background-color: #FFFFFF;
				box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
			}
			.info_bottomli{
				display: flex;
				margin-bottom:30rpx;
				&:nth-child(2n){
					margin-bottom:0;
				}
				.info_li{
					width: 115rpx;
					&:nth-child(2n){
						margin-left:190rpx;
					}
					.info_text{
						display: flex;
						flex-direction: column;
						text-align: left;
						span{
							margin-bottom:10rpx;
						}
					}
				}
			}
		}
	}
	.de_bottom{
		width:750rpx;
		height:calc(100rpx + env(safe-area-inset-bottom));
		background:#fff;
		position: fixed;
		left:0;
		bottom:0;
		padding:0 50rpx env(safe-area-inset-bottom);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		z-index: 9;
		.de_li{
			text-align: center;
			.editimg{
				width:38rpx;
				height:38rpx;
			}
			.de_text{
				font-size:20rpx;
				color:#999;
				text-align: center;
			}
		}
	}
	.scrollbox{
		width:100%;
		height:calc(100vh - 100rpx);
	}
.tabwarp{
	border-top:1rpx solid #f5f5f5;
	border-bottom:1rpx solid #f5f5f5;
}
</style>
