<template>
	<view>
		<view class="newbox">
			<view class="newtitle">任务信息</view>
			<view class="new_info">
				<view class="newli">
					<view class="newlabel">计划标题:</view>
					<view class="newvalue">{{visitInfo.title}}</view>
				</view>
				<view class="newli">
					<view class="newlabel">预期目的:</view>
					<view class="newvalue">{{visitInfo.event_type?visitInfo.event_type:''}}</view>
				</view>
				<view class="newli">
					<view class="newlabel">备注:</view>
					<view class="newvalue">{{visitInfo.remark?visitInfo.remark:'暂无'}}</view>
				</view>
				<view class="newli">
					<view class="newlabel">开始时间</view>
					<view class="newvalue">{{visitInfo.start_time?visitInfo.start_time:''}}</view>
				</view>
				<view class="newli">
					<view class="newlabel">预期结束时间</view>
					<view class="newvalue">{{visitInfo.end_time?visitInfo.end_time:''}}</view>
				</view>
				<view class="newli" v-if="visitInfo.achieve_purpose">
					<view class="newlabel">达到目的</view>
					<view class="newvalue">{{visitInfo.achieve_purpose}}</view>
				</view>
			</view>
		</view>
		<view class="sec_warp">
			<view class="sec_top">
				<view class="sec_left">
					<view class="label">计划状态</view>
					<view class="sec_sta">{{visitInfo.status_text}}</view>
				</view>
				<view class="sec_left">
					<view class="label">客户</view>
					<view class="sec_sta" style="color:#008EFF" @click="toCustomerDetail">{{visitInfo.customer && visitInfo.customer.name}}</view>
				</view>
				<view class="sec_left">
					<view class="label">销售</view>
					<view class="sec_sta">{{visitInfo.staff && visitInfo.staff.name}}</view>
				</view>
				<view class="sec_left">
					<view class="label">紧要程度</view>
					<view class="sec_sta stacolor" v-if="visitInfo.level == 0">普通</view>
					<view class="sec_sta stacolor" v-if="visitInfo.level == 1">重要</view>
					<view class="sec_sta stacolor" v-if="visitInfo.level == 2">紧急</view>
					<view class="sec_sta stacolor" v-if="visitInfo.level == 4">重要且紧急</view>
				</view>
			</view>
			<view v-if="visitInfo.relation_type != 'event'">
				<uni-steps :options="steps" active-color="#008EFF" :active="visitInfo.process -1" />
			</view>
		</view>
		<!-- 更多操作 -->
		<more-pop 
			v-if="false" 
			relation_type="event" 
			:relation_id="visit_id" 
			:staffList="visitInfo.show_staff_data"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		
		<view class="vantabbox" >
			<view class="tablist_new" v-if="visitInfo.event_type && !isPhoneTask && event_type != '客户服务_微信'">
				<view class="tabtn" @click="onChange(0)" :class="{'tabtn_active':activetabs == 0}">计划动态</view>
				<view class="tabtn" @click="onChange(1)" :class="{'tabtn_active':activetabs == 1}">相关费用</view>
				<view class="tabtn" @click="onChange(2)" :class="{'tabtn_active':activetabs == 2}">客户需求</view>
			</view>
			<view class="tablist_new" v-else>
				<view class="tabtn" @click="onChange(0)" :class="{'tabtn_active':activetabs == 0}">计划动态</view>
				<view class="tabtn" @click="onChange(1)" :class="{'tabtn_active':activetabs == 1}">相关费用</view>
			</view>
		</view>
		<!-- 计划动态 -->
		<scroll-view v-if="activetabs == 0" scroll-y style="width:100%;height:calc(100vh - 90rpx)" lower-threshold="30" @scrolltolower="loadPlandata">
			<view class="planwarp">
				<view class="new_plan_li" v-for="(item,index) in List" :key="index" @tap.stop="toDynaDetail(item)">
					<view class="new_plan_top">
						<view class="new_pt_staff">
							<image :src="item.staff.img ? item.staff.img : '/static/index/header.png'" class="pt_staffimg" ></image>
							<view class="pt_staffname">{{item.staff.name}} -- {{item.staff.post}}</view>
						</view>
						<view class="new_pt_right">{{item.relation_process}}</view>
					</view>
					<view class="new_plan_info" @click="toSeeLocation(item)" v-if="item.location">
						<view class="new_p_ili">签到地点:{{item.location?item.location:''}}</view>
						<view class="new_p_ili">签到地点距离拜访对象:{{item.distance?item.distance:0}}</view>
					</view>
					<view class="pl_remark" v-html="item.content"></view>
					<view class="imglist" v-if="item.file_ids.length != 0">
						<image 
							:src="ele" 
							v-for="(ele,fileindex) in item.file_ids" 
							:key="fileindex" 
							@click="previeImg(item.file_ids,fileindex)" 
							class="planimg" 
							
						></image>
					</view>
					<view class="task_time">
						<image :src="BASE_IMG_URL+'/index/clock.png'" class="clockimg" ></image>
						{{item.createtime}}
					</view>
				</view>
				<view class="noData" v-if="List.length == 0">暂无更多</view>
			</view>
			<view style="height:120rpx"></view>
		</scroll-view>
		<!-- 相关费用 -->
		<scroll-view v-if="activetabs == 1" scroll-y style="width:100%;height:calc(100vh - 90rpx)">
			<view class="pro_top">
				<view class="top_name"></view>
				<view class="top_beizhu" @click="toAddCost">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg" ></image>
					添加费用
				</view>
			</view>
			<view class="itemwarp" v-for="(item,index) in feeList" :key="index" @tap.stop="toDetail(item)">
				<view class="item_title">关联客户：{{item.customer?item.customer.name:''}}</view>
				<view class="item_info">
					<view class="item_info_left">
						<view class="item_text" >消费日期：{{item.submit_date}}</view>
						<view class="item_text" >消费金额：{{item.money}}</view>
					</view>
					<view class="item_info_right key">{{item.check_status_text}}</view>
				</view>
				<view class="item_text" style="padding-bottom:24rpx" >备注：{{item.remark?item.remark:''}}</view>
			</view>
			<view class="noData" v-if="feeList.length == 0">暂无更多</view>
		</scroll-view>
		<!-- 客户需求 -->
		<scroll-view v-if="activetabs == 2" scroll-y style="width:100%;height:calc(100vh - 90rpx)">
			<view class="pro_top">
				<view class="top_name"></view>
				<view class="top_beizhu" @click="toAddneeds">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg" ></image>
					添加客户需求
				</view>
			</view>
			<view class="itemwarp" v-for="(item,index) in demandList" :key="index">
				<view class="item_title"><span style="color:#999">客户需求</span>：{{item.needs?item.needs:''}}</view>
				<view class="item_info">
					<view class="item_info_left">
						<view class="item_text" >填写时间：{{item.createtime}}</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="demandList.length == 0">暂无更多</view>
		</scroll-view>
		
		<view style="height:100rpx;"></view>
		<view 
			class="bot_more_operation"  
			v-if="(visitInfo.is_revoke == 1 || visitInfo.is_operation == 1) && visitInfo.status != 3">
			<view class="bot_more_li" v-if="visitInfo.process == 0 && visitInfo.is_operation == 1" @click="toSign(1)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">开始工作</view>
			</view>
			<view class="bot_more_li" v-if="visitInfo.process == 1 && visitInfo.is_operation == 1" @click="toSign(2)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">到达签到</view>
			</view>
			<view class="bot_more_li" v-if="visitInfo.process == 2 && visitInfo.is_operation == 1" @click="toSign(3)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">完成任务</view>
			</view>
			<view class="bot_more_li" v-if="visitInfo.process == 3 && visitInfo.status == 1 && visitInfo.is_operation == 1"  @click="toSign(4)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">返程签到</view>
			</view>
			<view class="bot_more_li" @click="morePop">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="li_img" ></image>
				<view class="li_text">更多</view>
			</view>
		</view>
		
		<more-operation
			ref="operationChild"
			:visitInfo="visitInfo"
			@toSignP="toSign"
			:isPhoneTask="isPhoneTask"
		></more-operation>
	</view>
</template>

<script>
	import { netVisitDetail, netPlanDynamicList, netCostList, netAddSignin, netDemandList } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import moreOperation from './more-operation.vue'
	
	export default{
		components:{
			moreOperation
		},
		mixins:[commonFun],
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				steps:[
					{text:'出发'},
					{text:'到达'},
					{text:'拜访结束'}
				],
				active:1,
				activetabs:0,
				showMore:false,
				visit_id:'',
				visitInfo:{},  //任务信息
				event_type:'',   //预期目的
				List:[],  //计划动态列表
				planPage:1,
				planTotalPage:1,
				isPrivieImg:false,    //是否 查看图片了
				feeList:[],  //费用列表
				remindPeople:[],
				examineType:'',
				//是否是  电话任务
				isPhoneTask:false,
				//客户需求
				demandList:[],
			}
		},
		onLoad(options) {
			this.visit_id = options.id
		},
		created() {
			
		},
		onHide() {
			
		},
		onShow() {
			this.getDefaultRemind()
			if(!this.isPrivieImg){
				this.init()
			}
			//获取客户需求列表
			this.getDemandList()
		},
		methods:{
			//更多操作
			morePop() {
				this.$refs.operationChild.open()
			},
			//添加客户需求
			toAddneeds() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/add_Customer_demand?id='+this.visit_id
				})
			},
			//添加费用
			toAddCost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost?customerid='+this.visitInfo.customer.id+'&relationid='+this.visit_id+'&event_type=event'
				})
			},
			//获取客户 需求 列表
			getDemandList() {
				netDemandList({event_id:this.visit_id}).then(res=>{
					this.demandList = res.data
				})
			},
			//传阅
			toCirculate() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.id+'&type=event'
				})
			},
			init() {
				//任务详情
				this.getInfo()
				//相关费用
				this.getFee()
			},
			//相关费用
			getFee() {
				let params = {
					limit:10000,
					relation_type:'event',
					relation_id:this.visit_id
				}
				netCostList(params).then(res=>{
					this.feeList = res.data.data
				})
			},
			//客户详情
			toCustomerDetail() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+this.visitInfo.customer.id
				})
			},
			getInfo() {
				netVisitDetail({id:this.visit_id}).then(res=>{
					this.visitInfo = res.data
					if(this.visitInfo.event_type.indexOf('电话') != -1){
						this.isPhoneTask = true
					}else{
						this.isPhoneTask = false
					}
					this.event_type = res.data.event_type
					//获取计划动态
					this.List = []
					this.planPage = 1
					this.getPlanList()
				})
			},
			getPlanList() {
				let params = {
					event_id: this.visit_id,
					customer_id: this.visitInfo.customer.id,
					page: this.planPage
				}
				netPlanDynamicList(params).then(res=>{
					this.List = this.List.concat(res.data.data)
					this.planTotalPage = res.data.last_page
				})
			},
			//动态计划  加载更多
			loadPlandata(){
				if(this.planPage >= this.planTotalPage){
					return
				}
				this.planPage ++
				this.getPlanList()
			},
			onChange(e) {
				this.activetabs = e
			},
			//开始工作 type 1 开始 2 到达 3 拜访完成  4 评价
			toSign(type) {
				if((this.visitInfo.event_type.indexOf('电话') != -1) || this.visitInfo.event_type == '客户服务_微信'){
					if(type == 1){
						uni.showModal({
							title:'提示',
							content:'请确认是否开始工作?',
							success:(res)=>{
								if(res.confirm){
									netAddSignin({event_id:this.visit_id,event_process:1}).then(res => {
										uni.showToast({
											title: res.msg,
											icon: 'none'
										})
										this.showPop = false
										setTimeout(()=>{
											//任务详情
											this.init()
										},2000)
									})
								}
							}
						})
					}else if(type == 3){
						let tp = this.visitInfo.event_type.indexOf('电话') != -1 ? 1 : 2
						uni.navigateTo({
							url:'/pagesA/customerInfo/visit/visitEnd?id='+this.visit_id+'&tp='+tp
						})
					}
				}else{
					if(type == 1 ) {
						uni.navigateTo({
							url:'/pagesA/customerInfo/visit/signVisit?eventid='+this.visitInfo.id+'&type='+type+'&cusname='+this.visitInfo.customer.name+'&customerid='+this.visitInfo.customer.id+'&name='+this.visitInfo.event_type
						})
					}else if(type == 2) {
						uni.navigateTo({
							url:'/pagesA/customerInfo/visit/arrivalVisit?eventid='+this.visitInfo.id+'&type='+type+'&cusname='+this.visitInfo.customer.name+'&customerid='+this.visitInfo.customer.id+'&carType='+this.visitInfo.car_type+'&arriveSign='+this.visitInfo.start_mileage
						})
					}else if(type == 4){
						uni.navigateTo({
							url:'/pagesA/customerInfo/visit/arrivalVisit?eventid='+this.visitInfo.id+'&type='+type+'&cusname='+this.visitInfo.customer.name+'&customerid='+this.visitInfo.customer.id+'&carType='+this.visitInfo.car_type+'&endmileage='+this.visitInfo.end_mileage
						})
					}else if(type == 3 ) {
						uni.navigateTo({
							url:'/pagesA/customerInfo/visit/completeVisit?eventid='+this.visitInfo.id+'&type='+type+'&cusname='+this.visitInfo.customer.name+'&customerid='+this.visitInfo.customer.id
						})
					}
				}
			},
			//查看 动态 位置
			toSeeLocation(item) {
				uni.openLocation({
					latitude: Number(item.lat),
					longitude: Number(item.lng),
					address: item.location,
					name: item.location,
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			//详情
			toDynaDetail(item) {
				uni.navigateTo({
					url:'/pages/index/myCustomer/record_detail?id='+item.id
				})
			},
			//查看图片
			toPreviimg(arr,index){
				this.isPrivieImg = true
				uni.previewImage({
					urls:arr,
					current:index
				})
			},
			//费用详情
			toDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/detail?id='+item.id
				})
			},
			//拨打电话
			toCall() {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: this.visitInfo.contacts.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: this.visitInfo.contacts.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(this.visitInfo.contacts.mobile, true);
				// #endif
			},
			//更多操作
			moreOperation() {
				this.showMore = true
			},
			closeMore() {
				this.showMore = false
			},
			//查看图片
			previeImg(arr,index) {
				uni.previewImage({
					current:index,
					urls:arr
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.new_plan_li{
		width:690rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin:0 auto 24rpx;
		padding-bottom:24rpx;
		.new_plan_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 30rpx;
			border-bottom:1rpx solid #EDEDED;
			.new_pt_staff{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.pt_staffimg{
					width:70rpx;
					height:70rpx;
					border-radius: 50%;
					margin-right:5rpx;
				}
				.pt_staffname{
					font-size:22rpx;
					color:#666666;
				}
			}
			.new_pt_right{
				font-size:26rpx;
				color:#333333;
			}
		}
		.new_plan_info{
			padding:24rpx 30rpx 0;
			.new_p_ili{
				font-size:24rpx;
				color:#999999;
				margin-bottom:5rpx;
				&:last-child{
					margin-bottom:0;
				}
			}
		}
		.pl_remark{
			padding:20rpx 30rpx;
			font-size:24rpx;
			color:#999999;
		}
		.imglist{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			padding:0rpx 24rpx;
			.planimg{
				width:110rpx;
				height:110rpx;
				border-radius: 10rpx;
				margin-right:24rpx;
				margin-bottom:24rpx;
			}
		}
		.task_time{
			padding:24rpx 30rpx 0 30rpx;
			border-top:1rpx solid #EDEDED;
			font-size:24rpx;
			margin-top:15rpx;
			color:#999;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.clockimg{
				width:30rpx;
				height:30rpx;
				margin-right:24rpx;
			}
		}
	}
	.newbox{
		padding:24rpx 30rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		.newtitle{
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: #666;
			padding-left:30rpx;
			position: relative;
			margin-bottom:24rpx;
			&::before{
				content:'';
				position:absolute;
				left:0rpx;
				width:10rpx;
				height:25rpx;
				border-radius: 5rpx;
				background: $uni-btn-bg-color;
			}
		}
		.new_info{
			padding-left:50rpx;
			.newli{
				display: flex;
				justify-content: flex-start;
				margin-bottom:15rpx;
				.newlabel{
					font-size:26rpx;
					color:#999999;
					margin-right:15rpx;
					flex-shrink: 0;
				}
				.newvalue{
					font-size:26rpx;
					color:#999999;
				}
			}
		}
	}
	.pro_top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#fff;
		padding:24rpx;
		margin:15rpx 0;
		// box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
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
				margin-right:15rpx;
			}
		}
	}
	.itemwarp{
		width:660rpx;
		border-radius: 10rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		margin:24rpx auto 0;
		padding:0 40rpx;
		background:#fff;
		.item_title{
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			font-size:30rpx;
			color:#333333;
		}
		.item_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0 0;
			.item_info_left{
				.item_text{
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
				}
			}
			.item_info_right{
				width:121rpx;
				height:93rpx;
				flex-shrink: 0;
				margin-left:24rpx;
				.itemstatusimg{
					width:121rpx;
					height:93rpx;
				}
			}
		}
		.item_text{
			font-size:26rpx;
			color:#999999;
			margin-bottom:15rpx;
		}
		.item_bot{
			padding:24rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top:1rpx solid #f5f5f5;
			.item_btn{
				width:284rpx;
				height:68rpx;
				border-radius: 34rpx;
				font-size:32rpx;
				text-align: center;
			}
			.refuse_btn{
				border:1rpx solid #0287FF;
				line-height: 66rpx;
				color:#0287FF;
			}
			.sure_btn{
				background:#0287FF;
				color:#fff;
				line-height: 68rpx;
			}
		}
	}
	.follow_item_box{
		width:690rpx;
		margin:24rpx auto;
		border-radius: 20rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
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
							color:#0287FF;
						}
					}
					.info_time{
						font-size:26rpx;
						color:#999999;
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
					// background: #FE9440;
					border:1rpx solid #f5f5f5;
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
				height: 112rpx;
				background: rgba(2, 135, 255, 0.1);
				border-radius: 20rpx;
				display: flex;
				justify-content: flex-start;
				padding:15rpx 24rpx;
				.duiimg{
					width:41rpx;
					height:41rpx;
					margin-right:24rpx;
					flex-shrink: 0;
				}
				.address_right{
					flex:1;
					.address_ri_top{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						font-size:26rpx;
						color:#0287FF;
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
						color:#F2533E;
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
	.det_info{
		padding:24rpx 45rpx 24rpx 50rpx;
		background:#fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.det_label{
			font-size:26rpx;
			color:#666;
			flex-shrink: 0;
			margin-right:24rpx;
		}
		.det_right{
			font-size:26rpx;
			color:#333;
		}
	}
	.sec_warp{
		padding:30rpx 24rpx;
		background:#fff;
		border-bottom:1rpx solid #f5f5f5;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		.sec_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:0 40rpx;
			.sec_left{
				text-align: center;
				margin-bottom:10px;
				max-width:180rpx;
				.label{
					font-size:24rpx;
					color:#666;
					margin-bottom:8px;
				}
				.sec_sta{
					font-size:24rpx;
					color:#333;
				}
				.stacolor{
					color:#DD524D;
				}
			}
		}
	}
	.vantabboxtop{
		position: fixed;
		left:0;
		top:0;
		width:100%;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
	}
	.planwarp{
		padding:24rpx 35rpx;
		.plan_li{
			margin-bottom:50rpx;
			.plan_lef{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.plancir{
					display: block;
					width:10rpx;
					height:10rpx;
					border-radius: 50%;
					border:4rpx solid #14c2c1;
					margin-right:20rpx;
				}
			}
			.plan_info_box{
				margin-top:24rpx;
				background:#fff;
				border-radius: 10rpx;
				padding:30rpx;
				.plan_info_firbox{
					display: flex;
					justify-content: space-between;
					.planinfoleft{
						display: flex;
						justify-content: flex-start;
						.planheaderimg{
							width:60rpx;
							height:60rpx;
							border-radius: 50%;
							flex-shrink: 0;
							margin-right:24rpx;
						}
					}
				}
				.plan_info{
					margin-top:24rpx;
					.plan_info_fir{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.name{
							font-size:26rpx;
							color:#000;
						}
						.post{
							font-size:24rpx;
							color:#000;
							margin-left:15rpx;
						}
					}
					.plan_info_sec{
						display: flex;
						justify-content: flex-start;
						.text{
							font-size:26rpx;
							color:#000;
						}
					}
					.imglist{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						flex-wrap: wrap;
						margin:24rpx 0;
						.planimg{
							width:193rpx;
							height:180rpx;
							margin-right:24rpx;
							margin-bottom:24rpx;
						}
					}
					.plan_info_thr{
						background:#f1f1f1;
						padding:24rpx;
						border-radius: 5rpx;
						.daka{
							font-size:26rpx;
						}
						.text{
							font-size:28rpx;
							color:$uni-text-color;
							padding-left:15rpx;
							margin-top:10rpx;
						}
					}
				}
				.plan_status{
					font-size:26rpx;
					color:$uni-text-color;
					flex-shrink: 0;
				}
			}
		}
	}
	.de_bottom{
		position: fixed;
		left:0;
		bottom:0;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		width:750rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-wrap: wrap;
		padding:10rpx 24rpx;
		.botbtn{
			font-size:28rpx;
			color:$uni-text-color;
			margin-right:9rpx;
			padding:15rpx 15rpx;
			border:1rpx solid $uni-text-color;
			border-radius: 8rpx;
			margin-bottom:15rpx;
		}
		.morebtn{
			font-size:28rpx;
			color:#007AFF;
			font-weight: bold;
			margin-left:15rpx;
		}
	}
</style>
