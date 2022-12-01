<template>
	<view>
		<view class="newwarp">
			<view class="new_title">工单进度</view>
			<view class="word_status">
				<view class="statustip" v-if="workorderInfo.check_status == 1" style="color:#008EFF">优惠费用待审核</view>
				<view v-else>
					<view class="statustip" v-if="workorderInfo.status == 0">待分配</view>
					<view class="statustip" v-if="workorderInfo.status == 1">待处理</view>
					<view class="statustip" v-if="workorderInfo.status == 2">处理中</view>
					<view class="statustip" v-if="workorderInfo.status == 3">已完成</view>
				</view>
			</view>
			<view class="stapbox">
				<uni-steps :options="shejiStepa" :active="workorderInfo.process - 1" />
			</view>
			<view class="new_info">
				<view class="new_li">关联客户：{{workorderInfo.customer && workorderInfo.customer.name}}</view>
				<view class="new_li">工单类型：{{workorderInfo.workorder_type}}</view>
			</view>
		</view>
		<!-- 更多操作 -->
		<more-pop 
			relation_type="workorder" 
			v-if="false" 
			:relation_id="workOrderid" 
			:staffList="workorderInfo.show_staff_data"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		
		<!-- 标签 -->
		<view class="labelwarp">
			<view class="label_li" @click="changeLabel(1)" :class="tabid == 1 ? 'label_liactive' : ''" >工单信息</view>
			<view class="label_li" @click="changeLabel(2)" :class="tabid == 2 ? 'label_liactive' : ''" >产品信息</view>
			<view class="label_li" @click="changeLabel(4)" :class="tabid == 4 ? 'label_liactive' : ''" >费用信息</view>
			<view class="label_li" @click="changeLabel(5)" :class="tabid == 5 ? 'label_liactive' : ''" >工单进度</view>
		</view>
		
		<!-- 工单信息/任务信息 -->
		<view class="newwarp" v-if="tabid == 1">
			<view class="new_title">工单信息</view>
			<view class="newbox">
				<view class="inp_warp">
					<view class="inp_title">工单标题:</view>
					<view class="form_right">
						<view>{{workorderInfo.title}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">工单类型:</view>
					<view class="form_right">
						<view>{{workorderInfo.workorder_type}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">工单编号:</view>
					<view class="form_right">
						<view>{{workorderInfo.workorder_number}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">创建人:</view>
					<view class="form_right" v-if="workorderInfo.create_staff">
						<image :src="workorderInfo.create_staff.img" class="staffimg" ></image>
						<view>{{workorderInfo.create_staff.name ? workorderInfo.create_staff.name : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">预约时间:</view>
					<view class="form_right">
						<view>{{workorderInfo.appointment_time ? workorderInfo.appointment_time : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">是否过保:</view>
					<view class="form_right">
						<view v-if="workorderInfo.is_over == 1">过保</view>
						<view v-if="workorderInfo.is_over == 2">未过保</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">备注:</view>
					<view class="form_right">
						<view>{{workorderInfo.remarks ? workorderInfo.remarks : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">解决结果:</view>
					<view class="form_right">
						<view v-if="workorderInfo.mobile_result == 1">已解决</view>
						<view v-if="workorderInfo.mobile_result == 11">未解决，创建了上门服务工单</view>
						<view v-if="workorderInfo.mobile_result == 12">未解决，创建了返厂维修工单</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">是否发送配件:</view>
					<view class="form_right">
						<view v-if="workorderInfo.use_parts && workorderInfo.use_parts.length == 0">否</view>
						<view v-else>是</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >使用配件:</view>
				</view>
				<view class="proowarp" v-if="workorderInfo.use_parts && workorderInfo.use_parts.length != 0">
					<view class="prali" v-for="(item,index) in workorderInfo.use_parts" :key="index">
						<view class="partli">{{item.name}}</view>
						<view class="partli" style="text-align: center;">{{item.number}}</view>
						<view class="partli" style="text-align: center;">￥{{item.price}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">解决情况说明:</view>
					<view class="form_right">
						<view>{{workorderInfo.desc ? workorderInfo.desc : ''}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 产品信息 -->
		<view class="probox" v-if="tabid == 2">
			<view class="proo_li_product" v-for="(item,index) in workorderInfo.product_part" :key="index">
				<view class="productli" style="border-bottom:1rpx solid #f5f5f5;">
					<view class="label">名称</view>
					<view class="label">编号</view>
					<view class="label">编码</view>
				</view>
				<view class="productli">
					<view class="label">{{item.product.name}}</view>
					<view class="label">{{item.number?item.number:'暂无编号'}}</view>
					<view class="label">{{item.product.num}}</view>
				</view>
				<view class="partli">
					维修配件：<view class="partname" v-for="(ele,eleindex) in item.parts" :key="eleindex" v-if="ele.is_select == 1">{{ele.name}}</view>
				</view>
			</view>
		</view>
		<!-- 费用信息 -->
		<view v-if="tabid == 4">
		<view class="editRepair" v-if="(workorderInfo.process == 4 || workorderInfo.process == 7) && workorderInfo.status != 3 && workorderInfo.status != 9 && workorderInfo.is_revoke == 1">
			<view class="editbtn"  @click="toEditCost">
				<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg" ></image>
				修改费用
			</view>
		</view>
		<view class="newwarp" >
			<view class="new_title">费用信息</view>
			<view class="newbox">
				<view class="inp_warp">
					<view class="inp_title">含税方式:</view>
					<view class="form_right">
						<view>{{workorderInfo.tax ? workorderInfo.tax : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >配件费用:</view>
				</view>
				<view class="proowarp" v-if="workorderInfo.use_parts && workorderInfo.use_parts.length != 0">
					<view class="prali" v-for="(item,index) in workorderInfo.use_parts" :key="index">
						<view class="partli">{{item.name}}</view>
						<view class="partli" style="text-align: center;">{{item.number}}</view>
						<view class="partli" style="text-align: center;">￥{{item.price}}</view>
						<view class="partli" v-if="item.is_charge == 1">收费</view>
						<view class="partli" v-if="item.is_charge == 0">不收费</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >总价格:</view>
					<view class="form_right">
						<view>{{workorderInfo.total_money ? workorderInfo.total_money : ''}}元</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >是否收费:</view>
					<view class="form_right">
						<view v-if="workorderInfo.is_charge == 1">收费</view>
						<view v-if="workorderInfo.is_charge == 2">不收费</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_charge == 1">
					<view class="inp_title" >优惠价格:</view>
					<view class="form_right">
						<view>{{workorderInfo.discount_money ? workorderInfo.discount_money : ''}}元</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_charge == 1">
					<view class="inp_title" >实际支付价格:</view>
					<view class="form_right">
						<view>{{workorderInfo.money ? workorderInfo.money : ''}}元</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >备注:</view>
					<view class="form_right">
						<view>{{workorderInfo.discount_desc ? workorderInfo.discount_desc : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >收款账号:</view>
					<view class="form_right">
						<view>{{workorderInfo.collection_account ? workorderInfo.collection_account : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >收款账号(图):</view>
					<view class="form_right" v-if="workorderInfo.collection_img && workorderInfo.collection_img.length != 0">
						<view style="width:120rpx;height:120rpx">
							<image 
								:src="workorderInfo.collection_img[0].url"
								style="width:120rpx;height:120rpx"
								
								@click="toPriimg"
							></image>
						</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_charge == 1">
					<view class="inp_title" >是否已经收取费用:</view>
					<view class="form_right">
						<view v-if="workorderInfo.is_pay == 1">是</view>
						<view v-else>否</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_pay == 1">
					<view class="inp_title">支付金额:</view>
					<view class="form_right">
						<view>{{workorderInfo.money}}</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_pay == 1">
					<view class="inp_title">支付方式:</view>
					<view class="form_right">
						<view>{{workorderInfo.pay_type}}</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_pay == 1">
					<view class="inp_title" >支付时间:</view>
					<view class="form_right">
						<view>{{workorderInfo.pay_time}}</view>
					</view>
				</view>
				<view class="proo_li_text">
					<view class="label">附件:</view>
					<view class="value" v-if="workorderInfo.pay_files && workorderInfo.pay_files.length != 0">
						<view class="imgbox" v-for="(item,index) in workorderInfo.pay_files" :key="index">
							<image :src="item" class="selfimg"  @click="toPriveimg(index)"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="newwarp" style="box-shadow: none;">
				<view class="new_title">审批流程</view>
				<!-- 审批流程 -->
				<approval-status :process="payment_approval"></approval-status>
			</view>
		</view>
		</view>
		<!-- 关联工单 -->
		<view class="proo_info" v-if="tabid == 3">
			<scroll-view scroll-y class="planscroll" @scrolltolower="loadMoreTask">
				<visit-plan :list="workorderList"></visit-plan>
			</scroll-view>
		</view>
		<!--  任务状态  -->
		<view class="process" v-if="tabid == 5">
			<scroll-view scroll-y class="planscroll" @scrolltolower="loadMorePlan">
				<view class="planwarp">
					<view class="new_plan_li" v-for="(item,index) in processList" :key="index">
						<view class="new_plan_top">
							<view class="new_pt_staff">
								<image :src="item.staff.img ? item.staff.img : BASE_IMG_URL+'/headImg.png'" class="pt_staffimg" mode=""></image>
								<view class="pt_staffname">{{item.staff.name}} -- {{item.staff.post}}</view>
							</view>
							<view class="new_pt_right">{{item.relation_process}}</view>
						</view>
						<view class="new_plan_info" @click="toSeeLocation(item)" v-if="item.location">
							<view class="new_p_ili">签到地点:{{item.location}}</view>
							<view class="new_p_ili">签到地点距离拜访对象:{{item.distance}}</view>
						</view>
						<view class="pl_remark" v-html="item.content"></view>
						<view class="imglist" v-if="item.files.length != 0">
							<image :src="ele" v-for="(ele,fileindex) in item.files" :key="fileindex" @click="previeImg(item.files,fileindex)" class="planimg" mode=""></image>
						</view>
						<view class="task_time">
							<image :src="BASE_IMG_URL+'/index/clock.png'" class="clockimg" mode=""></image>
							{{item.createtime}}
						</view>
					</view>
					<van-empty v-if="processList.length == 0" description="暂无更多"></van-empty>
				</view>
			</scroll-view>
		</view>
		
		<view style="height:100rpx;"></view>
		
		<view class="bot_more_operation" v-if="workorderInfo.status != 9 && workorderInfo.status !=3">
			<view class="bot_more_li" @click="toConcatCustomer" v-if="(workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1 || workorderInfo.is_operation == 1) && workorderInfo.status != 3">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">拨打电话</view>
			</view>
			<view class="bot_more_li" @click="toDownWork" v-if="workorderInfo.process < 2 && (workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1 || workorderInfo.is_operation == 1)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">完成工单</view>
			</view>
			<view class="bot_more_li" v-if="!workorderInfo.is_pay && workorderInfo.process == 4 && (workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1 || workorderInfo.is_operation == 1)" @click="toPay">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">去结算</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.process == 3 && workorderInfo.is_leader == 1" @click="toInputFree">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">录入费用</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.process > 0 && workorderInfo.is_examine == 1 && workorderInfo.is_leader == 1" @click="toPass">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">审核通过</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.process > 0 &&workorderInfo.is_examine == 1 && workorderInfo.is_leader == 1" @click="toRefuse">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">审核拒绝</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.process > 0 &&workorderInfo.is_examine == 1 && workorderInfo.is_leader == 1" @click="toWriteDiscount">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img_img" ></image>
				<view class="li_text">填写优惠</view>
			</view>
			
			<view class="bot_more_li"  @click="moreOperation">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="li_img" ></image>
				<view class="li_text">更多</view>
			</view>
		</view>
		<more-operation
			ref="operationChild"
			:workorderInfo="workorderInfo"
			@toDownP="toDown"
		></more-operation>
		<!-- 下载报价单 -->
		<uni-popup ref="downPopup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="acbox">
				<view class="acli" @click="onSelect('word')">word</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netWorkOrderDetail, netAcceptWorkOrder, netStartWorkOrder, netToconfirm,
	netAssistList, netCompleteWorkorder, netPartQuoteData, netApprovalDetail, netWorkorderStatusList } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import visitPlan from '@/pages/index/visit/index.vue'
	import moreOperation from './more-operation.vue'
	
	export default {
		mixins:[commonFun],
		components:{
			visitPlan,
			moreOperation
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				active:0,
				shejiStepa:[
					{text:'已开始'},
					{text:'已完成'}
				],
				workOrderid:'',
				workorderInfo:{},
				
				processList:[],   //进度 状态
				page:1,
				totalPage:1,
				isPriviimg:false,
				tabid:1,
				//费用 信息
				costList:[],   
				costPage:1,
				costTotalpage:1,
				//更多操作
				remindPeople:[],
				examineType:'',
				//关联工单
				workorderList:[],
				//下载报价单
				payment_approval:[],   //审批流程
				isLookImg:false,
			}
		},
		onLoad(options) {
			this.workOrderid = options.id
		},
		onShow() {
			this.getDefaultRemind()
			this.getApprovalList()
			if(!this.isLookImg){
				this.changeLabel(this.tabid)
				
				this.getDetail()
			}
		},
		onHide() {
		},
		methods:{
			getApprovalList() {
				let params = {
					type: 'workorder',
					relation_id: this.workOrderid
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//工单 状态 列表
			getStatusList() {
				let params = {
					workorder_id:this.workOrderid,
					page: this.page,
				}
				netWorkorderStatusList(params).then(res=>{
					this.processList = this.processList.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			loadMorePlan() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getStatusList()
			},
			//更多操作
			moreOperation() {
				this.$refs.operationChild.open()
			},
			//工单详情
			getDetail(){
				netWorkOrderDetail({id:this.workOrderid}).then(res=>{
					this.workorderInfo = res.data
				})
			},
			changeLabel(id) {
				this.tabid = id
				if(this.tabid == 3) {
					//协助任务
					this.getTasklist()
				}else if(this.tabid == 5) {
					//工单状态
					this.page = 1
					this.processList = []
					this.getStatusList()
				}
			},
			toConcatCustomer(){
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: this.workorderInfo.contacts.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: this.workorderInfo.contacts.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(this.workorderInfo.contacts.mobile, true);
				// #endif
			},
			//指派
			toAssign(type) {
				uni.navigateTo({
					url:'/pagesA/afterSales/turn_staff?id='+this.workorderInfo.id+'&type='+type
				})
			},
			//终止工单
			toRevoke() {
				uni.navigateTo({
					url:'/pagesA/afterSales/revokeWork?id='+this.workOrderid
				})
			},
			//撤销工单
			toChexiaoWork() {
				uni.navigateTo({
					url:'/pagesA/afterSales/chexiaoWork?id='+this.workOrderid
				})
			},
			//完成任务
			toDownWork() {
				uni.navigateTo({
					url:'/pagesA/afterSales/phoneAftersale/complete?id='+this.workOrderid
				})
			},
			//录入费用
			toInputFree() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/inputExpense?id='+this.workOrderid
				})
			},
			//去支付
			toPay() {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorder_payment?workorderid='+this.workOrderid+'&money='+this.workorderInfo.money
				})
			},
			//下载报价单
			toDown() {
				this.$refs.downPopup.open()
			},
			onSelect(type) {
				this.$refs.downPopup.close()
				let params = {
					id:this.workOrderid,
					type
				}
				netPartQuoteData(params).then(res=>{
					this.openFile({file:res.data.file,filename:res.data.filename,type:'file'})
				})
			},
			//通过
			toPass() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.workOrderid+'&type=workorder&status=1'
				})
			},
			//拒绝
			toRefuse() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.workOrderid+'&type=workorder&status=2'
				})
			},
			//填写优惠金额
			toWriteDiscount() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/discountMoney?id='+this.workOrderid+'&money='+this.workorderInfo.discount_money
				})
			},
			//修改录入的费用
			toEditCost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/editExpense?id='+this.workOrderid
				})
			},
			//查看图片
			toPriveimg(index){
				this.isLookImg = true
				uni.previewImage({
					current:index,
					urls:this.workorderInfo.pay_files
				})
			},
			//去确认是否 收款
			toConfirmReceipt() {
				netToconfirm({workorder_id:this.workOrderid}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getDetail()
						this.changeLabel(this.tabid)
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 工单状态
	.planwarp{
		width:100%;
		.new_plan_li{
			width:690rpx;
			border-radius: 20rpx;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
			margin:0 auto 24rpx;
			padding-bottom:24rpx;
			background:#fff;
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
						margin-right:15rpx;
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
					margin-bottom:15rpx;
					&:last-child{
						margin-bottom:0;
					}
				}
			}
			.pl_remark{
				padding:24rpx 30rpx;
				font-size:24rpx;
				color:#999999;
			}
			.imglist{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				padding:24rpx 30rpx;
				border-bottom:0;
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
	}
	.imgbox {
		width: 160rpx;
		height: 160rpx;
		margin-right: 14rpx;
		position: relative;
		margin-bottom: 24rpx;
		display: initial;
		&:nth-child(4n){
			margin-right:0;
		}
		.selfimg {
			width: 160rpx;
			height: 160rpx;
		}
	}
	.proo_li_text{
		padding:24rpx 0;
		border-bottom:1rpx solid #f5f5f5;
		.label{
			font-size:26rpx;
			color:#666;
		}
		.value{
			width: 630rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size:26rpx;
			background:rgba(202, 202, 202, 0.2);
		}
	}
	.acbox{
		width:750rpx;
		padding:30rpx 0;
		.acli{
			font-size:30rpx;
			padding:24rpx 0;
			text-align: center;
			border-bottom:1rpx solid #f5f5f5;
			font-weight: bold;
			&:last-child{
				border-bottom:0;
			}
		}
	}
	.editRepair{
		padding:10rpx 30rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom:20rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		.editbtn{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			text-align: center;
			line-height: 60rpx;
			.beizhuimg{
				width:30rpx;
				height:30rpx;
				margin-right:10rpx;
			}
		}
	}
	.proowarp{
		padding:15rpx 24rpx;
		.prali{
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 50rpx;
			border-bottom:1rpx solid #f5f5f5;
			.partli{
				width:150rpx;
				text-align: center;
			}
		}
	}
	.operation_record {
		background:#fff;
		padding: 20rpx 30rpx;
		.record_item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			padding-bottom:20rpx;
			border-bottom:1rpx solid #EAEAEA;
			margin-bottom:20rpx;
			&:last-child{
				border-bottom:none;
			}
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}
			.record_info {
				flex: 1;
				margin-left: 25rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				.info_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom:10rpx;
				}
				.shenhetext{
					font-size:26rpx;
					color:#666;
					line-height: 34rpx;
				}
			}
			.record_line {
				position: absolute;
				top: -102rpx;
				left: -26rpx;
				height: 105rpx;
				border-left: 4rpx dotted #dedede;
			}
		}
	}
	.proo_li_product{
		padding:24rpx;
		border-bottom:1rpx solid #f5f5f5;
		.productli{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0;
			.label{
				width:200rpx;
				text-align: center;
				font-size:26rpx;
				color:#999999;
			}
		}
		.partli{
			padding:24rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.partname{
				margin-right:15rpx;
			}
		}
	}
	.planscroll{
		width:100%;
		height:600rpx;
		background:#fff;
		padding:24rpx 0;
	}
.newwarp{
		margin-bottom:24rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		padding:30rpx;
		.new_title{
			font-size:26rpx;
			color:#666666;
			padding-left:40rpx;
			position: relative;
			&::before{
				content:'';
				width:10rpx;
				height:25rpx;
				background:$uni-text-color;
				border-radius: 5rpx;
				position: absolute;
				left:0;
				top:6rpx;
			}
		}
		.word_status{
			font-size:34rpx;
			color:$uni-text-color;
			margin:30rpx 0 0 0;
			.statustip{
				text-align: center;
			}
		}
		.stapbox{
			padding:0 30rpx;
			margin-bottom:10rpx;
		}
		.new_info{
			padding:0 30rpx;
			.new_li{
				font-size:26rpx;
				color:#999999;
				margin-bottom:20rpx;
			}
		}
	}

//工单信息
.newbox{
	padding-left:70rpx;
	padding-top:20rpx;
	.inp_warp{
		padding:10rpx 0;
		display: flex;
		justify-content: flex-start;
		.inp_title{
			font-size:26rpx;
			color:#999999;
			margin-right:20rpx;
			flex-shrink: 0;
		}
		.form_right{
			font-size:26rpx;
			color:#999999;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.staffimg{
				width:40rpx;
				height:40rpx;
				border-radius: 50%;
				margin-right:15rpx;
			}
		}
	}
}
//产品信息  配件信息
.probox{
	width:690rpx;
	background:#fff;
	margin:0 auto 24rpx;
	border-radius: 20rpx;
	box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
	.protitle{
		font-size:26rpx;
		color:#000;
		font-weight: bold;
		padding:24rpx;
		margin-top:24rpx;
	}
	.proli{
		padding:24rpx 30rpx;
		border-bottom:1rpx solid #f5f5f5;
		&:last-child{
			border-bottom:0;
		}
		.protext{
			font-size:26rpx;
			color:#999999;
			white-space:normal;
			word-break:break-all;
			margin-bottom:15rpx;
		}
	}
}
.process{
	width:100%;
	.pro_top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#fff;
		padding:0 24rpx 24rpx;
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
	.planscroll{
		width:100%;
		height:calc(100vh - 260rpx);
		background:#f5f5f5;
		padding:24rpx 0;
	}
}
.labelwarp{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap:wrap;
	padding:30rpx 30rpx 6rpx 30rpx;
	margin-bottom:24rpx;
	box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
	.label_li{
		width:198rpx;
		height:66rpx;
		border-radius: 10rpx;
		margin-right:49rpx;
		margin-bottom:24rpx;
		color:#999999;
		text-align: center;
		line-height: 66rpx;
		background:rgba(246, 246, 246, 1);
		&:nth-child(3n){
			margin-right:0;
		}
	}
	.label_liactive{
		background:#fff;
		line-height: 64rpx;
		color:$uni-text-color;
		border:1rpx solid $uni-text-color;
	}
}

.visib_bottom{
	position: fixed;
	left:0;
	bottom:0;
	width:100%;
	background:#fff;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex-wrap: wrap;
	padding:10rpx 24rpx;
	border-top:1rpx solid #f5f5f5;
	.rightbox{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-wrap: wrap;
	}
	.botfir{
		// width:180rpx;
		padding:0 15rpx;
		height:80rpx;
		background:#0287FF;
		font-size:24rpx;
		color:#fff;
		text-align: center;
		line-height: 80rpx;
		border-radius: 10rpx;
		margin-right:24rpx;
		margin-bottom:10rpx;
	}
	
}
</style>
