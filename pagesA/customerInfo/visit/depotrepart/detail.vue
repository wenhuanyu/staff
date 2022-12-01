<template>
	<view>
		<view class="to_warp">
			<view class="newtitle">工单进度</view>
			<view class="title" v-if="info.is_examine == 1">维修费用待审核</view>
			<view class="content_con" :class="showMore ? 'con_maxHeight' : 'con_minHeight'">
				<uni-steps direction="column" :options="steps" active-color="#008EFF" :active="active" />
			</view>
			<view class="dou_warp" @click="changeShow">
				{{showMore?'收起':'查看详情'}}
				<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="douimg"></image>
			</view>
			<view class="cus_info">
				<view class="cus_name">客户：{{info.customer && info.customer.name}}</view>
			</view>
			<view class="cus_info" v-if="false">
				<view class="cus_name">客户：{{info.customer && info.customer.name}}</view>
				<view class="cus_bot">
					<view class="cus_btn" @click="toNavigation">
						<image :src="BASE_IMG_URL+'/customer/address.png'" class="daohangimg"></image>
						导航
					</view>
					<view class="cus_btn" @click="toConcatCustomer">
						<image :src="BASE_IMG_URL+'/customer/call.png'" class="phoneimg"></image>
						呼叫
					</view>
				</view>
			</view>
		</view>

		<!-- 更多操作 -->
		<more-pop v-if="false" relation_type="workorder" :relation_id="id"
			:staffList="info.show_staff_data" :remindPeople="remindPeople" @delExamine="delExamine"
			@clearRemindlist="clearRemindlist"></more-pop>

		<view class="labelwarp">
			<view class="label_li" :class="tabid == 1 ?'label_liactive':''" @click="changeTab(1)">返厂维修信息</view>
			<view class="label_li" :class="tabid == 2 ?'label_liactive':''" @click="changeTab(2)">维修结果</view>
			<view class="label_li" :class="tabid == 3 ?'label_liactive':''" @click="changeTab(3)">物流信息</view>
			<view class="label_li" :class="tabid == 6 ?'label_liactive':''" @click="changeTab(6)">协助任务列表</view>
		</view>

		<!-- 返厂维修信息 -->
		<scroll-view scroll-y class="scroll_box" v-if="tabid == 1">
			<view class="proo_info" style="box-shadow: 0;">
				<view class="prootitle">返厂维修信息</view>
				<view class="newboxp">
					<view class="proo_li">
						<view class="label">创建人:</view>
						<view class="value" v-if="info.create_staff">
							<image :src="info.create_staff.img" class="staffimg"></image>
							{{info.create_staff.name}}
						</view>
					</view>
					<view class="proo_li">
						<view class="label">归属人:</view>
						<view class="value" v-if="info.owner_staff">
							<image :src="info.owner_staff.img" class="staffimg"></image>
							{{info.owner_staff.name}}
						</view>
					</view>
					<view class="proo_li">
						<view class="label">工单编号:</view>
						<view class="value">
							{{info.workorder_number}}
						</view>
					</view>
					<view class="proo_li">
						<view class="label">机器型号:</view>
					</view>
					<view class="proo_li_product" v-for="(item,index) in info.product_part" :key="index">
						<view class="productli" style="border-bottom:1rpx solid #f5f5f5;">
							<view class="label">名称</view>
							<view class="label">编号</view>
							<view class="label">数量</view>
						</view>
						<view class="productli">
							<view class="label">{{item.product.name}}</view>
							<view class="label">{{item.number?item.number:'暂无编号'}}</view>
							<view class="label">{{item.product.num}}</view>
						</view>
					</view>
					<view class="proo_li">
						<view class="label">过保类型:</view>
						<view class="value" v-if="info.is_over == 1">过保</view>
						<view class="value" v-if="info.is_over == 2">未过保</view>
					</view>
					<view class="proo_li_text">
						<view class="label">问题描述:</view>
						<view class="value">{{info.desc ? info.desc : ''}}</view>
					</view>
					<view class="proo_li_text">
						<view class="label">注意事项:</view>
						<view class="value">{{info.matters ? info.matters : ''}}</view>
					</view>
					<view class="proo_li">
						<view class="label">要求维修完成日期:</view>
						<view class="value">{{info.appointment_time}}</view>
					</view>
					<view class="proo_li">
						<view class="label">附件:</view>
					</view>
					<view class="imglist" v-if="info.file && info.file.length != 0">
						<view class="imgbox" v-for="(item,index) in info.file" :key="index">
							<image :src="item.file_path" class="selfimg" @click="toPreviimg(info.file,index)"></image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 维修结果 -->
		<scroll-view scroll-y class="scroll_box" v-if="tabid == 2">
			<view class="editRepair">
				<view class="editbtn" v-if="info.process == 3" @click="toEditRepair">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg"></image>
					修改维修结果
				</view>
				<view class="editbtn" v-if="info.process == 4 || info.process == 7" @click="toEditCost">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg"></image>
					修改费用
				</view>
			</view>
			<view class="proo_info">
				<view class="prootitle">维修结果</view>
				<view class="newboxp">
					<view class="proo_li">
						<view class="label">工单类型:</view>
						<view class="value">{{info.workorder_type ? info.workorder_type : ''}}</view>
					</view>
					<view class="proo_li">
						<view class="label">维修结果:</view>
						<view class="value" v-if="info.resolved_results == 1">已解决</view>
						<view class="value" v-if="info.resolved_results == 12">维修失败</view>
					</view>
					<view class="proo_li">
						<view class="label">是否更换配件:</view>
						<view class="value" v-if="info.is_replace == 1">是</view>
						<view class="value" v-if="info.is_replace == 0">否</view>
					</view>
					<view class="proo_li">
						<view class="label">是否回收配件:</view>
						<view class="value" v-if="info.is_recovery == 1">是</view>
						<view class="value" v-if="info.is_recovery == 0">否</view>
					</view>
					<view class="proo_li_text">
						<view class="label">检查/故障判断:</view>
						<view class="value">{{info.results ? info.results : ''}}</view>
					</view>
					<view class="proo_li_text">
						<view class="label">保养注意事项:</view>
						<view class="value">{{info.maintain ? info.maintain : ''}}</view>
					</view>
					<!-- v-if="info.is_operation != 1" -->
					<view >
						<view class="proo_li">
							<view class="label">服务费用:</view>
						</view>
						<view class="proowarp" v-if="info.pay_service && info.pay_service.length != 0">
							<view class="prali" v-for="(item,index) in info.pay_service" :key="index">
								<view>{{item.name}}</view>
								<view>￥{{item.money}}</view>
							</view>
						</view>
						<view class="proo_li">
							<view class="label">配件费用:</view>
						</view>
						<view class="proowarp" v-if="info.use_parts && info.use_parts.length != 0">
							<view class="prali" v-for="(item,index) in info.use_parts" :key="index">
								<view class="partli">{{item.name}}</view>
								<view class="partli" style="text-align: center;">{{item.number}}</view>
								<view class="partli" style="text-align: center;">￥{{item.price}}</view>
								<view class="partli" v-if="item.is_charge == 1">收费</view>
								<view class="partli" v-if="item.is_charge == 0">不收费</view>
							</view>
						</view>
						<view class="proo_li">
							<view class="label">是否收费:</view>
							<view class="value" v-if="info.is_charge == 1">收费</view>
							<view class="value" v-if="info.is_charge == 2">不收费</view>
						</view>
						<view class="proo_li" v-if="info.is_charge == 1">
							<view class="label">优惠金额:</view>
							<view class="value">{{info.discount_money?info.discount_money:''}}</view>
						</view>
						<view class="proo_li_text">
							<view class="label">备注:</view>
							<view class="value">{{info.discount_desc ? info.discount_desc : ''}}</view>
						</view>
						<view class="proo_li">
							<view class="label">总计:</view>
							<view class="value">{{info.total_money?info.total_money:''}}</view>
						</view>
						<view class="proo_li" v-if="info.is_charge == 1">
							<view class="label">实际金额:</view>
							<view class="value">{{info.money?info.money:''}}</view>
						</view>
						<view class="proo_li">
							<view class="label">含税方式:</view>
							<view class="value">{{info.tax?info.tax:''}}</view>
						</view>
						<view class="proo_li" v-if="info.is_charge == 1">
							<view class="label">是否已收费:</view>
							<view class="value" v-if="info.is_pay == 1">是</view>
							<view class="value" v-if="info.is_pay == 0">否</view>
						</view>
						<view v-if="info.is_pay == 1">
							<view class="proo_li">
								<view class="label">支付方式:</view>
								<view class="value">{{info.pay_type?info.pay_type:''}}</view>
							</view>
							<view class="proo_li">
								<view class="label">支付时间:</view>
								<view class="value">{{info.pay_time?info.pay_time:''}}</view>
							</view>
							<view class="proo_li" v-if="info.pay_order">
								<view class="label">支付订单号:</view>
								<view class="value">{{info.pay_order?info.pay_order:''}}</view>
							</view>
							<view class="proo_li">
								<view class="label">附件:</view>
							</view>
							<view class="imglist" v-if="info.pay_files && info.pay_files.length != 0">
								<view class="imgbox" v-for="(item,index) in info.pay_files" :key="index">
									<image :src="item" class="selfimg" @click="previeImg(info.pay_files,index)"></image>
								</view>
							</view>
						</view>
						<view class="proo_li_text">
							<view class="label">审批流程:</view>
							<!-- 审批流程 -->
							<approval-status :process="payment_approval"></approval-status>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 物流信息 -->
		<view v-if="tabid == 3">
			<view class="editRepair" style="margin:24rpx 0;"
				v-if="info.process == 9 && info.is_operation == 1 && info.status != 3">
				<view class="editbtn" @click="toEditLog">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg"></image>
					修改物流信息
				</view>
			</view>
			<view class="proo_info">
				<view class="logi_li" v-for="(item,index) in logisticsList" :key="index">
					<view v-if="item.type == '物流配送'">
						<view class="logi_top">
							<view class="log_num">单号：{{item.number}}</view>
							<view class="logi_f" @click="toCopy(item.number)">复制</view>
						</view>
						<view class="logi_info">
							<view>时间：</view>
							<view>{{item.createtime}}</view>
						</view>
						<view class="logi_img">
							<view>附件：</view>
							<view class="imgbox">
								<image :src="ele.url" @click="previeImg(item.file_ids,indexele)"
									v-for="(ele,indexele) in item.file_ids" :key="indexele" class="selflogi"></image>
							</view>
						</view>
						<view class="logi_img" style="margin-top:0;">
							<view>物流信息：</view>
							<uni-steps direction="column" :options="item.content" :active="item.content.length" />
						</view>
					</view>
					<view v-if="item.type == '送货上门'">
						<view class="logi_info">
							<view>送货方式：</view>
							<view>{{item.company}}</view>
						</view>
						<view class="logi_info">
							<view>送货费用：</view>
							<view>{{item.money}}</view>
						</view>
						<view class="logi_img">
							<view>附件：</view>
							<view class="imgbox">
								<image :src="ele.url" @click="previeImg(item.file_ids,indexele)"
									v-for="(ele,indexele) in item.file_ids" :key="indexele" class="selflogi"></image>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>
		<!-- 评价信息 -->
		<view class="proo_info" v-if="tabid == 5">
			<view class="proo_li">
				<view class="label">解决结果</view>
				<view class="value" v-if="info.is_resolved == 1">已解决</view>
				<view class="value" v-if="info.is_resolved == 2">未解决</view>
			</view>
			<view class="proo_li">
				<view class="label">评分</view>
				<view class="value">
					<uni-rate :value="info.comment_score" readonly />
				</view>
			</view>
			<view class="proo_li_text">
				<view class="label">备注</view>
				<view class="value">{{info.comment_content?info.comment_content:''}}</view>
			</view>
			<view class="proo_li">
				<view class="label">附件</view>
			</view>
			<view class="imglist" v-if="info.comment_files && info.comment_files.length != 0">
				<view class="imgbox" v-for="(item,index) in info.comment_files" :key="index">
					<image :src="item" class="selfimg" @click="commentPrevieImg(info.comment_files,index)"></image>
				</view>
			</view>
		</view>
		<!-- 协助任务列表 -->
		<view class="proo_info" v-if="tabid == 6">
			<scroll-view scroll-y class="planscroll">
				<view class="prootitle">协助任务列表</view>
				<view class="task_list">
					<view v-for="(elitem,elitemindex) in taskList" :key="elitemindex" style="margin-bottom:24rpx;">
						<view class="task_li" v-for="(item,index) in elitem.data" :key="index">
							<view class="toeval" @click="toCommon(item)" v-if="item.status == '进行中'">
								回复
							</view>
							<view class="toeval" v-else style="color:red">
								{{item.status}}
							</view>
							<view class="task_time">邀请的协助人：
								<image :src="item.staff.img" class="staffimg"></image>{{item.staff.name}}
							</view>
							<view class="task_remrk">备注：{{item.remark}}</view>
							<view class="task_time">邀请协助时间:{{item.createtime}}</view>
							<view class="assist_list">
								<view class="assist_li" v-for="(ele,eleindex) in item.comments" :key="eleindex">
									<view class="ass_left">
										<image :src="ele.staff.img" class="staffimg"></image>
									</view>
									<view class="ass_right">
										<view class="right_top">
											<view class="staffname">{{ele.staff.name}}</view>
											<view class="ass_content">{{ele.createtime}}</view>
										</view>
										<view class="ass_content" style="margin:15rpx 0">
											{{ele.content}}
										</view>
										<view class="ass_content" style="margin-bottom:15rpx;">
											附件：
										</view>
										<view class="imgbox">
											<image v-for="(imgitem,imgindex) in ele.files" :key="imgindex"
												:src="imgitem" class="selfimg" @click="toPreimg(ele.files,imgindex)">
											</image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="taskList.length == 0" class="noData">暂无更多</view>
				</view>
			</scroll-view>
		</view>
		<view style="height:100rpx"></view>

		<view class="bot_more_operation">
			<view class="bot_more_li" @click="toAssist"
				v-if="info.process != 9 && info.status != 9 && info.process < 3 && (info.is_operation == 1 || info.is_leader == 1)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">邀请协作</view>
			</view>
			<view class="bot_more_li" @click="toWriteRepair"
				v-if="(info.process == 1 || info.process == 6) && (info.is_operation == 1 || info.is_leader == 1) && info.status != 9">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">填写维修结果</view>
			</view>
			<view class="bot_more_li" @click="toWriteLogi"
				v-if="info.process == 5 && info.status != 9 && (info.is_operation == 1 || info.is_leader == 1)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">填写物流信息</view>
			</view>
			<view class="bot_more_li"
				v-if="info.process == 8 && info.status != 9 && (info.is_leader == 1 || info.is_leader == 1 || info.is_revoke == 1)"
				@click="toComplete">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">已到货</view>
			</view>
			<view class="bot_more_li" @click="toCollection"
				v-if="info.process == 4 && info.status != 9 && (info.is_operation == 1 || info.is_leader == 1)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">去结算</view>
			</view>
			<view class="bot_more_li" @click="toContinueRepart(1)"
				v-if="info.process == 2 && info.status != 9 && info.is_leader == 1">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">继续维修</view>
			</view>
			<view class="bot_more_li" @click="toContinueRepart(9)"
				v-if="info.process == 2 && info.status != 9 && info.is_leader == 1">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">取消维修</view>
			</view>
			<view class="bot_more_li" v-if="info.process == 3 && info.is_leader == 1 && info.status != 9"
				@click="toInputFee">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">录入费用</view>
			</view>
			<view class="bot_more_li"
				v-if="info.is_examine == 1 && info.process == 7 && info.is_leader == 1 && info.status != 9"
				@click="toWriteDiscount">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">填写优惠金额</view>
			</view>
			<view class="bot_more_li"
				v-if="info.is_examine == 1 && info.process == 7 && info.is_leader == 1 && info.status != 9"
				@click="toPass">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">审核通过</view>
			</view>
			<view class="bot_more_li"
				v-if="info.is_examine == 1 && info.process == 7 && info.is_leader == 1 && info.status != 9"
				@click="toRefuse">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img"></image>
				<view class="li_text">审核拒绝</view>
			</view>
			<view class="bot_more_li" @click="moreOperation">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="li_img"></image>
				<view class="li_text">更多操作</view>
			</view>
		</view>
		<more-operation ref="operationChild" :info="info" @toCompleteP="toComplete" @toDownFileP="toDownFile">
		</more-operation>
		<!-- 下载报价单 -->
		<uni-popup ref="downPopup" type="bottom" background-color="#fff">
			<view class="acbox">
				<view class="acli" @click="onSelect('word')">word</view>
			</view>
		</uni-popup>
		<!-- 评论回复 -->
		<common-pop @commonSuccess="commonSuccess" @close="close" ref="commentChild"></common-pop>

	</view>
</template>

<script>
	import {
		netProofingDetail,
		netWorkorderStatusList,
		netOtherAssistList,
		netPartQuoteData,
		netToconfirm,
		netWorkOrderDetail,
		netLogisticsList,
		netExaminerEditMoney,
		netDownReturnWorkorder,
		netCompleteWorkorder,
		netApprovalDetail
	} from '@/api/api.js'
	import {
		BASE_IMG_URL
	} from '@/api/http.js'
	import {
		commonFun
	} from '@/common/navigate.js'
	import commonPop from './common_pop.vue'
	import moreOperation from './more-operation.vue'

	export default {
		mixins: [commonFun],
		components: {
			commonPop,
			moreOperation
		},
		data() {
			return {
				BASE_IMG_URL: BASE_IMG_URL,
				noClick: true, //防止  重复点击
				steps: [],
				active: 0,
				tabid: 1,
				showMore: false,
				id: '', //打样申请id
				info: {},
				progress: [], //打样进度

				taskList: [], //任务列表
				taskPage: 1,
				taskTotalpage: 0,
				logisticsList: [], //物流信息
				discount_money: 0,
				showMorePop: false,
				remindPeople: [],
				examineType: '',
				//下载返厂维修单
				downType: 1, //1配件报价单    2返厂维修单
				payment_approval:[],   //审批流程
			}
		},
		onLoad(options) {
			this.id = options.id
			if (options.tabid) {
				this.tabid = options.tabid
			}
		},
		onShow() {
			this.getDefaultRemind()

			this.steps = []
			this.init()
			this.getApprovalList()
		},
		onHide() {

		},
		methods: {
			getApprovalList() {
				let params = {
					type: 'workorder',
					relation_id: this.workOrderid
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//更多操作
			moreOperation() {
				this.$refs.operationChild.open()
			},
			//其他部门协助
			toAssist() {
				uni.navigateTo({
					url: '/pagesA/afterSales/proofing/assist?id=' + this.info.id + '&type=2'
				})
			},
			//填写维修结果
			toWriteRepair() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/writeRepair?id=' + this.info.id
				})
			},
			//填写物流单号
			toWriteLogi() {
				uni.navigateTo({
					url: '/pagesA/afterSales/addLogisticsInfo?id=' + this.info.id
				})
			},
			//收款金额
			toCollection() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/collection?id=' + this.info.id + '&money=' + this
						.info.money
				})
			},
			//继续维修
			toContinueRepart(type) {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/repair?id=' + this.info.id + '&continue=' + type
				})
			},
			//录入费用
			toInputFee() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/inputExpense?id=' + this.info.id + '&type=' + this
						.info.workorder_type
				})
			},
			//填写优惠金额
			toWriteDiscount() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/discountMoney?id=' + this.info.id + '&money=' +
						this.info.discount_money
				})
			},
			//审核通过
			toPass() {
				uni.navigateTo({ //status   1成功   2失败
					url: '/pages/template/examine?id=' + this.info.id + '&type=workorder&status=1'
				})
			},
			//审核拒绝
			toRefuse() {
				uni.navigateTo({ //status   1成功   2失败
					url: '/pages/template/examine?id=' + this.info.id + '&type=workorder&status=2'
				})
			},
			//去评论
			toCommon(item) {
				this.isLookImg = false
				let obj = {
					id: item.id,
					type: 'assist_event',
					commenid: ''
				}
				this.$refs.commentChild.init(obj)
			},
			//评论成功
			commonSuccess() {
				this.getTasklist()
			},
			//查看评论图片
			toPreimg(arr, index) {
				this.isLookImg = true
				uni.previewImage({
					current: index,
					urls: arr
				})
			},
			//////////////////////////////////////////////////////////////////////////////////////////
			//下载报价单
			toDownFile(downType) {
				this.downType = downType
				this.$refs.downPopup.open()
			},
			onSelect(type) {
				this.$refs.downPopup.close()
				let params = {
					id: this.id,
					type
				}
				if (this.downType == 1) {
					//配件报价单
					netPartQuoteData(params).then(res => {
						this.openFile({
							file: res.data.file,
							filename: res.data.filename,
							type: 'file'
						})
					})
				} else {
					netDownReturnWorkorder(params).then(res => {
						this.openFile({
							file: res.data.file,
							filename: res.data.filename,
							type: 'file'
						})
					})
				}
			},
			//导航
			toNavigation() {
				uni.openLocation({
					latitude: this.info.lat,
					longitude: this.info.lng,
					address: this.info.address+this.info.address_detail,
					name: this.info.address+this.info.address_detail,
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			toConcatCustomer() {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: this.info.contacts.mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: this.info.contacts.mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(this.info.contacts.mobile, true);
				// #endif
			},
			///////////////////////////////////////////////////////////////////////////
			init() {
				//返厂维修 详情
				this.getDetail()
				//获取 任务进度
				this.getProgress()

				this.changeTab(this.tabid)
			},
			getDetail() {
				netWorkOrderDetail({
					id: this.id
				}).then(res => {
					this.info = res.data
					this.discount_money = res.data.discount_money
				})
			},
			//打样进度
			getProgress() {
				netWorkorderStatusList({
					workorder_id: this.id,
					limit: 1000
				}).then(res => {
					let data = res.data.data
					data.forEach(ele => {
						ele.content = ele.content.replace('<br>', '')
						this.steps.push({
							text: ele.createtime,
							desc: ele.content
						})
					})
				})
			},
			changeTab(id) {
				this.tabid = id
				if (id == 6) {
					//任务列表
					this.getTasklist()
				} else if (id == 3) {
					//物流信息
					this.getLogisList()
				} else if (id == 7) {
					//操作记录

				}
			},
			//任务列表
			getTasklist() {
				let params = {
					relation_id: this.id,
					relation_type: 'workorder',
					type: 4,
				}
				netOtherAssistList(params).then(res => {
					this.taskList = res.data
				})
			},
			//查看图片
			toPreviimg(data, index) {
				let arr = []
				data.forEach(ele => {
					arr.push(ele.file_path)
				})
				uni.previewImage({
					urls: arr,
					current: index
				})
			},
			previeImg(arr, index) {
				let data = []
				arr.forEach(ele => {
					data.push(ele.url)
				})
				uni.previewImage({
					urls: data,
					current: index
				})
			},
			commentPrevieImg(arr, index) {
				uni.previewImage({
					urls: arr,
					current: index
				})
			},
			//到达签到
			toDownsign() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/signVisit?eventid=' + this.visitInfo.id
				})
			},
			//进度 展开收起
			changeShow() {
				this.showMore = !this.showMore
			},
			//填写 配件清单
			toWritePart() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/writePartlist'
				})
			},
			//物流信息
			getLogisList() {
				netLogisticsList({
					workorder_id: this.id
				}).then(res => {
					this.logisticsList = res.data
				})
			},
			//复制 物流单号
			toCopy(number) {
				uni.setClipboardData({
					data: number,
					success: (res) => {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				})
			},
			//评价二维码
			toCodeeval() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/evalQR?id=' + this.id
				})
			},
			//修改维修结果
			toEditRepair() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/editRepair?id=' + this.id
				})
			},
			//修改录入的费用
			toEditCost() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/editExpense?id=' + this.id
				})
			},
			//修改物流信息
			toEditLog() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/visit/depotrepart/editLogistics?id=' + this.id
				})
			},
			//传阅
			toCirculate() {
				uni.navigateTo({
					url: '/pagesA/afterSales/moreOperation/circulate/index?id=' + this.id + '&type=workorder'
				})
			},
			//已完成
			toComplete() {
				netCompleteWorkorder({
					id: this.id
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						this.getDetail()
						//获取 任务进度
						this.getProgress()
					}, 2000)
				})
			},
			//去确认是否 收款
			toConfirmReceipt() {
				netToconfirm({
					workorder_id: this.id
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						this.getDetail()
					}, 2000)
				})
				// uni.navigateTo({
				// 	url:'/pagesA/afterSales/confirmReceipt?id='+this.workOrderid
				// })
			},
			//查看附件
			previeImgLog(arr, index) {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.toeval {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 26rpx;
		color: $uni-text-color;
		position: absolute;
		right: 30rpx;
		top: 30rpx;

		.addimg {
			width: 38rpx;
			height: 37rpx;
			margin-right: 15rpx;
		}
	}

	.acbox {
		width: 750rpx;
		padding: 30rpx 0;

		.acli {
			font-size: 30rpx;
			padding: 24rpx 0;
			text-align: center;
			border-bottom: 1rpx solid #f5f5f5;
			font-weight: bold;

			&:last-child {
				border-bottom: 0;
			}
		}
	}

	.editRepair {
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		padding: 0 30rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 20rpx;

		.editbtn {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 26rpx;
			color: $uni-text-color;
			text-align: center;
			line-height: 60rpx;

			.beizhuimg {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
	}

	.scroll_box {
		width: 100%;
		height: 900rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
	}

	.logi_li {
		.logi_top {
			padding: 24rpx 0;
			border-bottom: 1rpx solid #f5f5f5;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.log_num {
				font-size: 28rpx;
				color: #333333;
			}

			.logi_f {
				font-size: 28rpx;
				color: $uni-text-color;
				margin-left: 24rpx;
			}
		}

		.logi_info {
			display: flex;
			justify-content: flex-start;
			margin-top: 24rpx;
			font-size: 28rpx;
			color: #666666;
			margin-bottom: 15rpx;
		}

		.logi_img {
			font-size: 28rpx;
			color: #666666;
			margin-top: 24rpx;

			.imgbox {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-top: 24rpx;

				.selflogi {
					width: 150rpx;
					height: 150rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;

					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}
	}

	.imglist {
		background: #fff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		.imgbox {
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;

			&:nth-child(4n) {
				margin-right: 0;
			}

			.selfimg {
				width: 160rpx;
				height: 160rpx;
			}
		}
	}

	.planscroll {
		width: 100%;
		height: 900rpx;
		background: #fff;
	}

	//任务列表
	.task_list {
		.task_li {
			width: 660rpx;
			background: #fff;
			box-sizing: border-box;
			padding: 30rpx;
			border-radius: 10rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0, 0, 0, 0.1);
			margin: 24rpx auto 0;
			// border-top:20rpx solid #007AFF;
			position: relative;

			.task_time {
				font-size: 24rpx;
				margin-top: 15rpx;
				color: #666;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.staffimg {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			}

			.task_remrk {
				margin-top: 15rpx;
				line-height: 40rpx;
				color: #666;
			}

			.assist_list {
				margin-top: 24rpx;
				border-top: 16rpx solid #f5f5f5;

				.assist_li {
					padding: 20rpx 0;
					border-bottom: 1rpx solid #f5f5f5;
					display: flex;
					justify-content: flex-start;

					&:last-child {
						border-bottom: 0;
					}

					.ass_left {
						.staffimg {
							width: 50rpx;
							height: 50rpx;
							border-radius: 50%;
						}
					}

					.ass_right {
						margin-left: 24rpx;
						flex: 1;

						.right_top {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.staffname {
								font-size: 24rpx;
								color: #666;
							}

							.ass_content {
								font-size: 24rpx;
								color: #666;
								line-height: 38rpx;
								margin-bottom: 15rpx;
							}
						}

						.ass_content {
							font-size: 24rpx;
							color: #666;
						}
					}

					.imgbox {
						display: flex;
						justify-content: flex-start;
						flex-wrap: wrap;

						.selfimg {
							width: 120rpx;
							height: 120rpx;
							margin-right: 24rpx;
						}
					}
				}
			}
		}
	}

	.to_warp {
		width: 100%;
		background: #fff;
		border-radius: 10rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom: 24rpx;
		padding: 30rpx;
	
	.newtitle {
			font-size: 26rpx;
			color: #666666;
			padding-left: 40rpx;
			position: relative;

			&::before {
				content: '';
				width: 10rpx;
				height: 25rpx;
				background: $uni-text-color;
				border-radius: 5rpx;
				position: absolute;
				left: 0;
				top: 6rpx;
			}
		}

		.title {
			padding: 24rpx 30rpx;
			font-size: 24rpx;
			color: $uni-text-color;
			border-bottom: 1rpx solid #f5f5f5;
			text-align: center;
		}

		.content_con {
			// width:500rpx;
			// margin:24rpx auto;
		}

		.con_minHeight {
			height: 100rpx;
			overflow: hidden;
		}

		.con_maxHeight {
			height: auto;
		}

		.dou_warp {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: $uni-text-color;
			padding: 24rpx 0;
			border-top: 1rpx solid #f5f5f5;

			.douimg {
				width: 20rpx;
				height: 24rpx;
				margin-right: 10rpx;
			}
		}
	
	.cus_info {
			padding: 24rpx 0 0 0;
			border-top: 1rpx solid #f5f5f5;

			.cus_name {
				font-size: 30rpx;
				color: #666;
				padding: 0 24rpx;
				margin-bottom: 15rpx;
			}

			.cus_link {
				font-size: 28rpx;
				color: #666666;
				margin-bottom: 15rpx;
				padding: 0 24rpx;
				text-align: center;
			}

			.cus_bot {
				margin-top: 24rpx;
				padding: 0 24rpx;
				border-top: 1rpx solid #f5f5f5;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.cus_btn {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 30rpx;
					color: $uni-text-color;
					padding: 24rpx 0;

					.daohangimg {
						width: 40rpx;
						height: 48rpx;
						margin-right: 15rpx;
					}

					.phoneimg {
						width: 48rpx;
						height: 48rpx;
						margin-right: 15rpx;
					}
				}
			}
		}
	}

	.labelwarp {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		padding: 30rpx 30rpx 6rpx 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
		margin-bottom: 20rpx;
		background-color: #fff;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);

		.label_li {
			width: 198rpx;
			height: 66rpx;
			background: #F6F6F6;
			border: 1px solid #EDEDED;
			border-radius: 10rpx;
			margin-right: 49rpx;
			margin-bottom: 24rpx;
			color: #999;
			text-align: center;
			line-height: 64rpx;

			&:nth-child(3n) {
				margin-right: 0;
			}
		}

		.label_liactive {
			background: #fff;
			color:$uni-text-color;
			border: 1px solid $uni-btn-bg-color;
		}
	}

	.proo_info {
		padding: 30rpx;
		background: #fff;
		border-radius: 10rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);

		.prootitle {
			font-size: 26rpx;
			color: #666666;
			padding-left: 40rpx;
			margin-bottom: 24rpx;
			position: relative;

			&::before {
				content: '';
				width: 10rpx;
				height: 25rpx;
				background: $uni-text-color;
				border-radius: 5rpx;
				position: absolute;
				left: 0;
				top: 6rpx;
			}
		}

		.partli {
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 45rpx;
		}

		.newboxp {
			padding-left: 60rpx;

			.proo_li {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: 15rpx;

				.label {
					color: #999;
					margin-right: 15rpx;
				}

				.value {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					color: #999;

					.staffimg {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}
				}
			}
		}

		.proo_li_product {
			padding: 24rpx 0;
			border-bottom: 1rpx solid #f5f5f5;

			.productli {
				display: flex;
				justify-content: space-between;
				align-items: center;

				padding-bottom: 24rpx;
				margin-bottom: 24rpx;

				.label {
					width: 200rpx;
					text-align: center;
					font-size: 26rpx;
					color: #999999;
				}

				.value {
					font-size: 26rpx;
					color: #666666;
				}
			}

			.partli {
				padding: 24rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;

				.partname {
					margin-right: 15rpx;
				}
			}
		}

		.proowarp {
			padding: 15rpx 24rpx;

			.prali {
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 50rpx;
				border-bottom: 1rpx solid #f5f5f5;

				.partli {
					width: 150rpx;
					text-align: center;
				}
			}
		}

		.proo_li_text {
			.label {
				font-size: 26rpx;
				color: #999999;
				margin-right: 15rpx;
				margin-bottom: 15rpx;
			}

			.value {
				width: 630rpx;
				padding: 20rpx;
				border-radius: 10rpx;
				margin: 0rpx auto 15rpx;
				box-sizing: border-box;
				font-size: 26rpx;
				background: rgba(202, 202, 202, 0.2);
			}
		}
	}

	.btn_warp {
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 15rpx 24rpx;
		width: 750rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		border-top: 1rpx solid #f5f5f5;
		z-index: 99;

		.btn {
			font-size: 28rpx;
			color: #fff;
			background: #0287FF;
			padding: 0 15rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
			margin-bottom: 24rpx;
			flex-shrink: 0;
		}

	}

	.visib_bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		padding: 10rpx 24rpx;
		border-top: 1rpx solid #f5f5f5;
		z-index: 9;

		.program {
			font-size: 26rpx;
			color: #0287FF;
		}
	
	.bot_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			flex-wrap: wrap;

			.ribhtbox {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				flex-wrap: wrap;
			}

			.btn {
				// width:180rpx;
				padding: 0 15rpx;
				height: 80rpx;
				background: #0287FF;
				font-size: 24rpx;
				color: #fff;
				text-align: center;
				line-height: 80rpx;
				border-radius: 10rpx;
				margin-right: 24rpx;
				margin-bottom: 10rpx;
			}
		}
	}
</style>
