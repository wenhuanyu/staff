import { myRequest, BASE_URL } from './http.js'

//上传
export const uploadUrl = BASE_URL+'/common/upload'

//登录
export function login(data){
	return myRequest('/staff/wxLogin',data)
}

//账号 密码登录
export function a_login(data) {
	return myRequest('/staff/login',data)
}

// 免登录 体验
export function login_text() {
	return myRequest('/staff/logintest')
}

//获取默认 信息
export function defaultInfo() {
	return myRequest('/common/getConfig')
}

//退出登录
export function netOutLogin() {
	return myRequest('/staff/logout')
}

//修改密码
export function netEditPassword(data) {
	return myRequest('/staff/changepwd',data)
}

//发送code  给后台  获取用户信息
export function netSendCode(data) {
	return myRequest('/staff/wechatBind',data)
}

//判断是否绑定微信
export function nerIsbindWechat(){
	return myRequest('/staff/staffBind')
}

//解绑微信
export function netUnboundWecgat() {
	return myRequest('/staff/unboundWechat')
}

//获取登录者的  权限
export function netJurisdiction() {
	return myRequest('/common/getStaffRule')
}

//获取 登录者  信息
export function netLoginerInfo() {
	return myRequest('/staff/getStaffInfo')
}

//根据地址 转 经纬度
export function netAddressTransLng(data) {
	return myRequest('/common/addressGeocoder',data)
}

//根据经纬度 转 地址
export function netLngTransAddress(data) {
	return myRequest('/common/getGeocoder',data)
}

//客户列表
export function netKehuList(data) {
	return myRequest('/customer/getList',data)
}

//客户合并的时候  客户信息
export function netKehuMergeInfo(data) {
	return myRequest('/customer/getMergeCustomerDetail',data)
}

//客户合并 提交
export function netKehuSubMerge(data) {
	return myRequest('/customer/mergeCustomer',data)
}

//公海客户 列表
export function netSeasKehuList(data) {
	return myRequest('/customer/getSeasList',data)
}

//领取客户
export function netReceiveKehu(data) {
	return myRequest('/customer/receive',data)
}

//获取员工默认的提醒或审核人   record 跟进 contract 合同 consume 费用 receivables 回款  
//  customer客户  parts出库/入库   approval工单审批   achievement业绩目标  quote报价单
export function netStaffDefaultReviewer(data) {
	return myRequest('/staff/getStaffIds',data)
}

//获取下级员工
export function netSubordinateStaff() {
	return myRequest('/customer/getSearchStaffList')
}

//创建客户
export function netAddkehu(data) {
	return myRequest('/customer/addCustomer',data)
}
//筛选条件
export function netSelect() {
	return myRequest('/common/selectOption')
}
//上级 客户列表 筛选
export function netPrevCustomer(data) {
	return myRequest('/customer/getSelectList',data)
}
//客户名称查重
export function netCheckName(data) {
	return myRequest('/customer/selectName',data)
}
//员工 列表
export function netStaffList(data) {
	return myRequest('/common/getSelectStaff',data)
}

//添加 出差 签到
/**
 *event_process  1 开始 2 到达 3 拜访完成  4 评价
 *event_id 任务id
 */
export function netAddSignin(data) {
	return myRequest('/event/addSign',data)
}
//新建 费用 relation_type 关联业务 contract 合同 receivables 回款 quote 报价单  workorder工单
export function netAddCost(data) {
	return myRequest('/consume/addConsume',data)
}
//根据 客户  筛选联系人  customer_id
export function netLianxiren(data) {
	return myRequest('/contacts/getSelectList',data)
}
//自动生成 订单编号
export function netAutoOrderNumber() {
	return myRequest('/contract/getContractNumber')
}

//创建订单
export function netCreateContract(data) {
	return myRequest('/contract/addContract',data)
}
//获取 客户 合同  列表
export function netContractList(data) {
	return myRequest('/contract/getCustomerContacts',data)
}
//合同详情
export function netContractDetail(data) {
	return myRequest('/contract/getDetail',data)
}
//修改合同的乙方信息
export function netEditContractYifang(data) {
	return myRequest('/contract/editContractPartyB',data)
}
//创建   回款 
export function netAddPayment(data) {
	return myRequest('/receivables/addReceivables',data)
}
//获取 回款  编号   自动生成
export function netPaymentNumber() {
	return myRequest('/receivables/getReceivablesNumber')
}
//添加 拜访计划
export function netAddVisitplant(data) {
	return myRequest('/event/addEvent',data)
}
//拜访计划 详情
export function netVisitDetail(data) {
	return myRequest('/event/getDetail',data)
}
//首页 任务  列表   1 今日计划 2 本周计划 3 本月计划
export function netScheduleIndexList(data) {
	return myRequest('/event/getIndexList',data)
}
//任务  列表 
export function netScheduleList(data) {
	return myRequest('/event/getList',data)
}

//获取 任务首页 数字
export function netIndexTaskNum() {
	return myRequest('/event/getListNumber')
}
//任务   计划动态  列表  
//event_id 任务id   
//customer_id  客户id
export function netPlanDynamicList(data) {
	return myRequest('/event/getSign',data)
}
//新建  打样 任务
export function netProoPlan(data) {
	return myRequest('/event/addEvent',data)
}
//获取报价单 自动生成编号
export function netOfferAutoNumber() {
	return myRequest('/quote/getQuoteNumber')
}
//添加报价单
export function netAddquotation(data) {
	return myRequest('/quote/addQuote',data)
}
// 报价单列表
export function netQuotationList(data) {
	return myRequest('/quote/getList',data)
}

//获取报价单待审批数量
export function netQuotationNumber(data) {
	return myRequest('/quote/getQuoteCheckNumber',data)
}

// 报价单 详情
export function netQuotationDetail(data) {
	return myRequest('/quote/quoteDetail',data)
}
// 编辑  报价单 
export function netEditQuotation(data) {
	return myRequest('/quote/editQuote',data)
}
//作废  报价单
export function netTovoidQuotation(data) {
	return myRequest('/quote/tovoidQuote',data)
}


//下载 报价单 文件、
export function netQuotaFile(data) {
	return myRequest('/quote/downloadQuote',data)
}

//添加 产品
export function netAddProduct(data) {
	return myRequest('/product/addProduct',data)
}

//修改产品
export function netEditProduct(data) {
	return myRequest('/product/editProduct',data)
}

//获取 产品  详情
export function netProductDetail(data) {
	return myRequest('/product/getProductDetail',data)
}

//客户详情
export function netCustomerDetail(data) {
	return myRequest('/customer/customerDetail',data)
}

//客户 该买 产品列表
export function netCustomerProductList(data) {
	return myRequest('/customer_product/getList',data)
}

//客户关联得附件
export function netCustomerFileList(data) {
	return myRequest('/customer/getFilesList',data)
}
//添加客户附件
export function netAddCustomerFile(data) {
	return myRequest('/customer/addFiles',data)
}

//客户的操作记录
export function netCustomerOperation(data) {
	return myRequest('/operation/getList',data)
}

//移入 公海
export function netRemoveSeas(data) {
	return myRequest('/customer/moveSeas',data)
}

//批量移入公海
export function netRemoveSeasAll(data) {
	return myRequest('/customer/batchMoveSeas',data)
}

//批量转移客户
export function netTransCustomerAll(data) {
	return myRequest('/customer/batchTransfer',data)
}

//批量移除团队成员
export function netRemoveTeamAll(data) {
	return myRequest('/setting/batchDelShowStaff',data)
}

//批量添加团队成员
export function netAddTeamAll(data) {
	return myRequest('/setting/batchAddShowStaff',data)
}

//编辑 客户信息
export function netEditKehu(data) {
	return myRequest('/customer/editCustomer',data)
}

//获取联系人  详情
export function netConcatDetailInfo(data) {
	return myRequest('/contacts/getDetail',data)
}

//编辑联系人  信息
export function netEditConcatInfo(data) {
	return myRequest('/contacts/editContacts',data)
}

//删除联系人
export function netDelConcat(data) {
	return myRequest('/contacts/delContacts',data)
}

//转移 客户
export function netTransKehu(data) {
	return myRequest('/customer/transfer',data)
}

//详情 联系人列表
export function netContact(data) {
	return myRequest('/contacts/getSelectList',data)
}

//新增 联系人  国外区号
export function netEnMobild(data) {
	return myRequest('/contacts/getMobileCode',data)
}

//新建 联系人
export function netAddContact(data) {
	return myRequest('/contacts/addContacts',data)
}


//详情  回款 列表
export function netPaymentList(data) {
	return myRequest('/receivables/getList',data)
}

//详情  费用 列表
export function netCostList(data) {
	return myRequest('/consume/getList',data)
}

// 费用  详情
export function netCostDetail(data) {
	return myRequest('/consume/getDetail',data)
}

//撤销费用
export function netDelcost(data) {
	return myRequest('/consume/cancelConsume',data)
}

//编辑费用
export function netEditCost(data) {
	return myRequest('/consume/editConsume',data)
}

//获取  费用  数量
export function netCostNumber(data) {
	return myRequest('/consume/getConsumeNumber',data)
}

//合同 列表
export function netOutContractList(data) {
	return myRequest('/contract/getList',data)
}

//合同   撤回 审批
export function netCancelExamine(data) {
	return myRequest('/contract/cancel',data)
}

//编辑  合同
export function netEditContract(data) {
	return myRequest('/contract/editContract',data)
}

//审核  relation_type  receivables回款  contract合同  consume费用   workorder工单
export function netExamine(data) {
	return myRequest('/examine_record/examine',data)
}

//获取  回款  详情
export function netPaymentDetail(data) {
	return myRequest('/receivables/getDetail',data)
}

//  回款  撤回  审批
export function netPaymentCancel(data) {
	return myRequest('/receivables/cancel',data)
}

//编辑  回款  信息
export function netEditPaymentInfo(data) {
	return myRequest('/receivables/editReceivables',data)
}

//获取工单编号
export function netWorkOrderNumber() {
	return myRequest('/workorder/getWorkorderNumber')
}

//工单  获取 客户地址
export function netCustomerAddress(data) {
	return myRequest('/workorder/getCustomerAddress',data)
}

//工单 获取客户 对应 的合同列表
export function netCustomerContractInfo(data) {
	return myRequest('/contract/getSelectList',data)
}
//添加  工单
export function netAddWorkOrder(data) {
	return myRequest('/workorder/addWorkorder',data)
}

//售后 工单 列表
export function netWorkOrderList(data) {
	return myRequest('/workorder/getList',data)
}

//工单详情  （ workorder_type 返厂维修）
export function netWorkOrderDetail(data) {
	return myRequest('/workorder/getWorkorderDetail',data)
}

//添加  工单 状态
export function netWorkOrderStatus(data) {
	return myRequest('/workorder/addLog',data)
}

//工单  状态   列表
export function netWorkorderStatusList(data) {
	return myRequest('/workorder/getLogs',data)
}

//创建工单  选择 产品
export function netWorkOrderProduct(data) {
	return myRequest('/customer_product/getSelectList',data)
}

//工单 指派  负责人
export function netWorkOrderAssign(data) {
	return myRequest('/workorder/assign_order',data)
}

//接受工单
export function netAcceptWorkOrder(data) {
	return myRequest('/workorder/accept_order',data)
}

//工单 转派
export function netTransferWorkOrder(data) {
	return myRequest('/workorder/transfer',data)
}

//开始工单
export function netStartWorkOrder(data) {
	return myRequest('/workorder/start_order',data)
}

//工单  添加 物流信息
export function netAddLogisticsInfomation(data) {
	return myRequest('/workorder/addLogistics',data)
}

//工单 获取 物流信息列表
export function netLogisticsList(data) {
	return myRequest('/workorder/getLogisticsList',data)
}

//添加 产品 编号
export function netInputProductNumber(data) {
	return myRequest('/workorder/setCustomerProductNumber',data)
}
//添加配件配送工单的 配送信息
export function netInputPartInfo(data) {
	return myRequest('/workorder/setCustomerPartsNumber',data)
}

//完成  工单
export function netCompleteWorkorder(data) {
	return myRequest('/workorder/complete',data)
}

// 产品  零件 列表
export function netSparePartsList(data) {
	return myRequest('/parts/getSelectList',data)
}

//产品 安装  到达 签到
export function netProductInstallArrive(data) {
	return myRequest('/workorder/addSign',data)
}

//零件 出库和入库

export function netPartsoutOrin(data) {
	return myRequest('/parts/addStocks',data)
}

//零件  出库和入库  申请编号
export function netPartsNumber() {
	return myRequest('/parts/getPartsNumber')
}

//备件 管理   备件列表
export function netPartManageList(data) {
	return myRequest('/parts/getList',data)
}

//获取备件 详情
export function netPartDetail(data) {
	return myRequest('/parts/getPartsDetail',data)
}

//备件 库存 修改 记录
export function netPartEditRecord(data) {
	return myRequest('/parts/getStockRecord',data)
}

//我申请的 备件 列表
//type  0 全部 1出库 2入库
//check_status  1审核中、2审核通过、3审核未通过 
//check_type  	1我发起的 2我审批的
export function netMyApplyPartlist(data) {
	return myRequest('/parts/myStockRecord',data)
}

//工作动态  跟进动态
export function netFollowList(data) {
	return myRequest('/sign_in/getList',data)
}

//跟进 动态  详情
export function netFollowDetail(data) {
	return myRequest('/record/getRecordDetail',data)
}

//获取  评论列表  sign 签到 customer 客户 event 任务  article文章评论
//workreport 工作报告（日志）   workorder 工单评论   discuss讨论
export function netCommentList(data) {
	return myRequest('/comment/commentList',data)
}

//发布 评论
export function netPublishComment(data) {
	return myRequest('/comment/addComment',data)
}

//获取 任务列表
export function netCustomerEventlist(data) {
	return myRequest('/event/getList',data)
}

//首页 数据简报 
export function netBriefingData(data) {
	return myRequest('/index/briefing',data)
}

//首页 目标完成情况
export function netAchievedata(data) {
	return myRequest('/index/getAchievement',data)
}

//首页  备件数量
export function netIndexPartsNumber(data) {
	return myRequest('/index/parts',data)
}

//首页排行榜   1 获客 2拜访 3业绩 4回款 5工单
export function netIndexRankingdata(data) {
	return myRequest('/index/ranking',data)
}

//首页 备件管理  出库审批
//// type   0全部 1入库 2出库
//check_status  1 待审核  2 已审核 3已拒绝
export function netIndexPartList(data) {
	return myRequest('/parts/examineStockRecord',data)
}

//获取审批记录列表 
export function netWorkExamineList(data) {
	return myRequest('/approval/examineApprovalList',data)
}

//获取 审批 数量
export function netWorkExamineNumber(data) {
	return myRequest('/approval/examineApprovalNumber',data)
}

//审批名称 列表
export function netWorkExamineName() {
	return myRequest('/approval/getList')
}

//根据审批名称  获取 审批表单
export function netWorkExamineForm(data) {
	return myRequest('/approval/getFormapproval',data)
}

//创建 审批 提交
export function netCreateWorkExamine(data) {
	return myRequest('/approval/addApproval',data)
}

//获取 审批 详情
export function netWorkExamineDetail(data) {
	return myRequest('/approval/getDetail',data)
}

//撤销审批
export function netCancelWorkExamine(data) {
	return myRequest('/approval/cancel',data)
}

//修改 审批
export function netEditWorkExamine(data) {
	return myRequest('/approval/editApproval',data)
}

//首页 审核 数据
export function netIndexExaminedata() {
	return myRequest('/index/examine')
}


//获取 出库 入库 数量
export function netOutorInNumber(data) {
	return myRequest('/parts/getReloadNumber',data)
}

//获取 备件 详情
export function netApplyPartDetail(data) {
	return myRequest('/parts/getPartsReloadDetail',data)
}

//首页 工单 信息
export function netWorkOrderInfo(data) {
	return myRequest('/index/workorder',data)
}


//知识库 分类
export function netKnowledgeList(data) {
	return myRequest('/aftermarket/typeList',data)
}

//获取 文章列表
export function netArticleList(data) {
	return myRequest('/aftermarket/articleList',data)
}

//文章 详情
export function netArticleDetail(data) {
	return myRequest('/aftermarket/detail',data)
}

//文章点击 册数
export function netArticleNumber(data) {
	return myRequest('/aftermarket/viewArticle',data)
}

//添加文章
export function netAddArticle(data) {
	return myRequest('/aftermarket/addArticle',data)
}

//修改文章
export function netEditArticle(data) {
	return myRequest('/aftermarket/editArticle',data)
}

//获取 目标 部门
export function netTargetDepartList(data) {
	return myRequest('/achievement/getDepartment',data)
}

//获取 员工  业绩目标  列表
export function netStaffTargetList(data) {
	return myRequest('/achievement/getStaffList',data)
}

//获取 员工 业绩目标  详情
export function netStaffTargetDetail(data) {
	return myRequest('/achievement/getStaffDetail',data)
}

//获取  团队  业绩目标
export function netTeamTargetList(data) {
	return myRequest('/achievement/getTeamList',data)
}

//获取 团队 业绩目标详情
export function netTeamTargetDetail(data) {
	return myRequest('/achievement/getTeamDetail',data)
}

//获取 公司  业绩目标
export function netCompanyTarget(data) {
	return myRequest('/achievement/getCompanyAchievement',data)
}

//获取个人  我的 业绩  目标  详情
export function netMyselfTargetDetail(data) {
	return myRequest('/achievement/getMyAchievementDetail',data)
}

//获取 个人 团队  目标  详情
export function netMyTeamDetail(data) {
	return myRequest('/achievement/getMyTeamDetail',data)
}

//个人  设置  年目标
export function netSetYearTarget(data) {
	return myRequest('/achievement/staffEditAchievement',data)
}

//个人  修改  目标  历史记录
export function netPersonalHistory(data) {
	return myRequest('/achievement/editRecords',data)
}

//获取 个人  修改  详情
export function netPersonalHistoryDetail(data) {
	return myRequest('/achievement/getRecordsDetail',data)
}

//设置  员工  团队   公司  年目标
//status  1获客 2拜访 3业绩 4回款 5工单
//type   3个人 2团队 1公司
//ids   id列表
//yeartarget   year
export function netSetTarget(data) {
	return myRequest('/achievement/addAchievement',data)
}

//日志  列表
export function netJournalList(data) {
	return myRequest('/workreport/getList',data)
}

//工作  日志  详情
export function netJournalDetail(data) {
	return myRequest('/workreport/getDetail',data)
}


//扫二维码  进入产品信息
export function netProductInfo(data) {
	return myRequest('/equipment/getEquipDetail',data)
}


//创建跟进
export function netCreateFollowup(data) {
	return myRequest('/sign_in/createRecord',data)
}
/**
 * 数据 分析
 **/

//客户分析  客户数分析
export function netCustomerNumberAnalysis(data) {
	return myRequest('/statistics/getCustomerCount',data)
}

//客户分析   老客跟进分析
export function netLKfollowAnalysis(data) {
	return myRequest('/statistics/getCustomerSignIn',data)
}

//客户  转化率 分析
export function netCZAnalysis(data) {
	return myRequest('/statistics/getCustomerTradeRate',data)
}

//客户 售后满意度  分析
export function netSHMYDAnalysis(data) {
	return myRequest('/statistics/getWorkorderSatisfied',data)
}

//客户 成交周期  分析
export function netCJZQAnalysis(data) {
	return myRequest('/statistics/getCustomerTrade',data)
}

//销售分析  销售漏斗分析
export function netXSAnalysis(data) {
	return myRequest('/statistics/getStaffCustomer',data)
}

//产品分析   产品销售分析
export function netCPxsAnalysis(data) {
	return myRequest('/statistics/getProductCount',data)
}

//产品分析  部件问题分析
export function netBJAnalysis(data) {
	return myRequest('/statistics/getProductParts',data)
}

//员工业绩分析  合同 数分析
export function netContractNumAna(data) {
	return myRequest('/statistics/getContractCount',data)
}

//员工业绩分析  合同金额分析
export function netContractMoneyAna(data) {
	return myRequest('/statistics/getContractMoney',data)
}

//员工业绩分析  回款金额分析
export function netContractPayment(data) {
	return myRequest('/statistics/getReceivablesMoney',data)
}

//员工业绩分析  合同总汇表
export function netContractTotal(data) {
	return myRequest('/statistics/getContractSummary',data)
}

//进销存销售分析   销售汇总分析
export function netSalesSummary(data) {
	return myRequest('/statistics/getSalesSummary',data)
}

//进销存销售分析 产品销售 分析
export function netSaleProductAna(data) {
	return myRequest('/statistics/getProductSummary',data)
}

//售后分析  工单数分析
export function netWorkOrderAna(data) {
	return myRequest('/statistics/getWorkorderCount',data)
}


//售后分析  工单金额分析
export function netWorkOrderMoneyAna(data) {
	return myRequest('/statistics/getWorkorderMoney',data)
}

//业绩目标完成分析-合同金额分析
export function netYejiContract(data) {
	return myRequest('/statistics/getContractTarget',data)
}

//业绩目标完成分析-回款金额分析
export function netYejiPayment(data) {
	return myRequest('/statistics/getReceivablesTarget',data)
}

//地图   周围客户
export function netAroundCustomer(data) {
	return myRequest('/customer/nearby',data)
}

//地图  所有 员工
export function netAroundStaffList() {
	return myRequest('/staff/getAllStaffLocation')
}


//更改 客户 级别
export function netChangeCustomerLevel(data) {
	return myRequest('/customer/changeCustomerType',data)
}

//获取 提醒人
export function netNoticePeopleList() {
	return myRequest('/staff/getTeamStaffId')
}

//客户 延迟成交 反馈、
export function netDelayClosing(data) {
	return myRequest('/customer/feedbackToLeader',data)
}

//是否 生效合同 
export function netTakeContactStatus(data) {
	return myRequest('/contract/startContract',data)
}

//工单 电话知道结果
export function netPhoneProblem(data) {
	return myRequest('/workorder/addMobileLog',data)
}

//获取 收款方式
export function netPaymentMethod() {
	return myRequest('/workorder/getPayType')
}

//确认信息 去支付
export function netTopayWorkorder(data) {
	return myRequest('/workorder/pay_order',data)
}


//获取微信 收款码
export function netWatchPayEwm(data) {
	return myRequest('/workorder/getPayOrder',data)
}

//客户详情 产品列表里边添加产品
export function netAddProductinList(data) {
	return myRequest('/customer_product/addProduct',data)
}

//通过公里数  计算 金额  number 公里数
export function netComputedMoney(data) {
	return myRequest('/consume/consume_count',data)
}

//打样 详情
export function netProofingDetail(data) {
	return myRequest('/proofing/getDetail',data)
}

//获取 打样进度
export function netProoProgress(data) {
	return myRequest('/proofing/getLogs',data)
}

//打样  指派负责人
export function netAssignStaff(data) {
	return myRequest('/proofing/assign_proofing',data)
}


//打样  申请机器
export function netApplicationmachine(data) {
	return myRequest('/proofing/application_machine',data)
}

//打样 其他部门协助
export function netOtherAssist(data) {
	return myRequest('/proofing/addEvents',data)
}

//打样  协助任务列表
export function netAssistList(data) {
	return myRequest('/event/getList',data)
}

//打样  协助任务 详情
export function netAssitsDetail(data) {
	return myRequest('/event/getDetail',data)
}


//打样  修改任务 状态
export function netEditAssitsStatus(data) {
	return myRequest('/event/updateStatus',data)
}

//机器出库
export function netMachineout(data) {
	return myRequest('/proofing/machine_out',data)
}

//打样  生产部  指派测试负责人
export function netApplicatonTestStaff(data) {
	return myRequest('/proofing/assign_test',data)
}

//打样 填写 测试 结果
export function netWriteTestresult(data) {
	return myRequest('/proofing/addTestResults',data)
}

//打样  继续测试/取消测试
export function netCancelOrContinue(data) {
	return myRequest('/proofing/isContinueTest',data)
}

//打样  提交采购部领导
export function netPurchSamples(data) {
	return myRequest('/proofing/submitPurchase',data)
}

//打样 完成采购
export function netCompleteSamples(data) {
	return myRequest('/proofing/completePurchase',data)
}

//打样  提交售后部领导
export function netSubAftersale(data) {
	return myRequest('/proofing/submitAfter',data)
}


//检查联系人名称是否重复
export function netCheckNameRepeat(data) {
	return myRequest('/contacts/isNameDuplicate',data)
}

//电话维修 服务  任务  指派
export function netRepairAssign(data) {
	return myRequest('/event/assign_event',data)
}

//电话维修  完成任务
export function netDonephoneRepair(data) {
	return myRequest('/event/complete_event',data)
}

//售后服务 返厂维修  指派
export function netDepotRepairAssign(data) {
	return myRequest('/workorder/assign_order',data)
}

//售后服务  填写维修结果
export function netWriteRepairResult(data) {
	return myRequest('/workorder/repair_result',data)
}


//售后服务 优惠金额审批时  审核人可以 修改优惠金额
export function netExaminerEditMoney(data) {
	return myRequest('/workorder/editDiscountMoney',data)
}

//售后服务  维修失败的时候  是否继续维修
export function netRepairIsjixu(data) {
	return myRequest('/workorder/isContinueTest',data)
}

//售后服务 返厂维修 添加协助任务
export function netRepairxiezhu(data) {
	return myRequest('/workorder/addEvents',data)
}

//返厂维修  录入工单费用
export function netRepairInputFee(data) {
	return myRequest('/workorder/enterWorkorderMoney',data)
}

//工单   终止工单
export function netRevokeWorkorder(data) {
	return myRequest('/workorder/cancelWorkorder',data)
}

//打样  撤销打样任务
export function netRevokeProofing(data) {
	return myRequest('/proofing/cancelProofing',data)
}

//打样获取测试 结果
export function netTestresult(data) {
	return myRequest('/proofing/getTestResults',data)
}

//编辑打样任务 
export function netEditproofing(data) {
	return myRequest('/proofing/editProofing',data)
}

//修改任务 信息
export function netEditEvent(data) {
	return myRequest('/event/editEvent',data)
}

//修改工单
export function netEditWorkorder(data) {
	return myRequest('/workorder/editWorkorder',data)
}

//客户服务_电话   客户服务_微信  开始工作
export function netServeStart(data) {
	return myRequest('/event/start_mobile_order',data)
}

//报价单 特约条款
export function netSpecialTerm() {
	return myRequest('/quote/getClauseText')
}

//产品分类
export function netProductType() {
	return myRequest('/product/getProductType')
}

//根据产品分类  获取产品列表  type_id
export function netProductList(data) {
	return myRequest('/product/getList',data)
}

//获取帐户 信息
export function netAccountList() {
	return myRequest('/contract/getAccountList')
}

//预览合同
export function netPreviewContract(data) {
	return myRequest('/contract/downloadContract',data)
}

//报销费用  报销单号
export function netBaoxiaoNum() {
	return myRequest('/consume/getNumber')
}

//获取区域列表
export function netEareList() {
	return myRequest('/customer/getManagementList')
}

//费用批量 审核
export function netAllExamineCost(data) {
	return myRequest('/examine_record/examine_consume',data)
}


//获取订单 列表
export function netOrderList(data) {
	return myRequest('/order/getList',data)
}

//获取订单详情
export function netOrderDetail(data) {
	return myRequest('/order/getDetail',data)
}

//订单 录入 到账时间  到账凭证
export function netInputVoucher(data) {
	return myRequest('/order/inputPayment',data)
}

//获取工单 对应的产品
export function netWorkWuliuProduct(data) {
	return myRequest('/workorder/getWorkorderProduct',data)
}

//品质异常单  单号
export function netAbnormalNumber() {
	return myRequest('/workorder/getBadWorkorderNumber')
}

//添加品质异常进度
export function netAbnormalProcess(data) {
	return myRequest('/workorder/addProgress',data)
}

//获取品质异常 进度
export function netAbnormalLog(data) {
	return myRequest('/workorder/getProgressList',data)
}


//出纳列表
export function netCashierList(data) {
	return myRequest('/consume/getCashierList',data)
}

//出纳  打款
export function netCashierMoney(data) {
	return myRequest('/consume/cashier',data)
}


//合同审核通过之后  修改合同  获取合同详情
export function netContractpassDetail(data) {
	return myRequest('/contract/getContractDetail',data)
}

//合同审核通过之后  修改提交接口
export function netContractPassSubmitedit(data) {
	return myRequest('/contract/editReviewedContract',data)
}

//预览报价单
export function netPrevieQuotation(data) {
	return myRequest('/quote/previewPdf',data)
}

//修改 物流信息
export function netEditLogistics(data) {
	return myRequest('/workorder/editLogistics',data)
}

//撤销任务
export function netChexiaoVisit(data) {
	return myRequest('/event/revokeEvent',data)
}

//撤销工单
export function netChexiaoWork(data) {
	return myRequest('/workorder/revokeWorkorder',data)
}

//撤销打样
export function netChexiaoProo(data) {
	return myRequest('/proofing/revokeProofing',data)
}

//发起讨论
export function netLaunchDiscuss(data) {
	return myRequest('/discuss/addDiscuss',data)
}

//讨论列表
export function netDiscussList(data) {
	return myRequest('/discuss/getList',data)
}

//讨论详情
export function netDiscussDetail(data) {
	return myRequest('/discuss/getDetail',data)
}

//修改讨论
export function netEditDiscuss(data) {
	return myRequest('/discuss/editDiscuss',data)
}


//获取工单联合跟进人列表
export function netFollowPerson(data) {
	return myRequest('/workorder/getShowStaff',data)
}
//修改工单联合跟进人
export function netEditFollowperson(data) {
	return myRequest('/workorder/editShowStaff',data)
}
//添加工单联合跟进人
export function netAddFollowPerson(data) {
	return myRequest('/workorder/addShowStaff',data)
}


//获取报价单 跟进人 列表
export function netQuoteFollowList(data) {
	return myRequest('/quote/getShowStaff',data)
}
//修改报价单  跟进人
export function netEditQuoteFollow(data) {
	return myRequest('/quote/editShowStaff',data)
}
//新增报价单 跟进人
export function netAddQuoteFollow(data) {
	return myRequest('/quote/addShowStaff',data)
}


//获取打样 跟进人 列表
export function netProoFollowList(data) {
	return myRequest('/proofing/getShowStaff',data)
}
//修改打样   跟进人
export function netEditProofingFollow(data) {
	return myRequest('/proofing/editShowStaff',data)
}
//新增打样  跟进人
export function netAddProofingFollow(data) {
	return myRequest('/proofing/addShowStaff',data)
}


//获取合同 跟进人 列表
export function netContractFollowList(data) {
	return myRequest('/contract/getShowStaff',data)
}
//修改合同   跟进人
export function netEditContractFollow(data) {
	return myRequest('/contract/editShowStaff',data)
}
//新增合同  跟进人
export function netAddContractFollow(data) {
	return myRequest('/contract/addShowStaff',data)
}

//获取订单 跟进人 列表
export function netOrderFollowList(data) {
	return myRequest('/order/getShowStaff',data)
}
//修改订单   跟进人
export function netEditOrderFollow(data) {
	return myRequest('/order/editShowStaff',data)
}
//新增订单  跟进人
export function netAddOrderFollow(data) {
	return myRequest('/order/addShowStaff',data)
}

//获取任务 跟进人 列表
export function netEventFollowList(data) {
	return myRequest('/event/getShowStaff',data)
}
//修改任务   跟进人
export function netEditEventFollow(data) {
	return myRequest('/event/editShowStaff',data)
}
//新增任务  跟进人
export function netAddEventFollow(data) {
	return myRequest('/event/addShowStaff',data)
}
/*
客户团队
*/
//获取客户 跟进人 列表
export function netCustomerFollowList(data) {
	return myRequest('/customer/getShowStaff',data)
}
//修改客户   跟进人
export function netEditCustomerFollow(data) {
	return myRequest('/customer/editShowStaff',data)
}
//新增客户  跟进人
export function netAddCustomerFollow(data) {
	return myRequest('/customer/addShowStaff',data)
}
//客户团队 
//获取团队成员
export function netTeamList(data) {
	return myRequest('/setting/team',data)
}
//修改团队成员
export function netTeamEdit(data) {
	return myRequest('/setting/editShowStaff',data)
}
//获取业绩分割比例
export function netDistributionType(data) {
	return myRequest('/contract/getRatio',data)
}

//获取费用 跟进人 列表
export function netConsumeFollowList(data) {
	return myRequest('/consume/getShowStaff',data)
}
//修改费用   跟进人
export function netEditConsumeFollow(data) {
	return myRequest('/consume/editShowStaff',data)
}
//新增费用  跟进人
export function netAddConsumeFollow(data) {
	return myRequest('/consume/addShowStaff',data)
}


// approval
//获取审批跟进人 列表
export function netApprovalFollowList(data) {
	return myRequest('/approval/getShowStaff',data)
}
//修改审批   跟进人
export function netEditApprovalFollow(data) {
	return myRequest('/approval/editShowStaff',data)
}
//新增审批  跟进人
export function netAddApprovalFollow(data) {
	return myRequest('/approval/addShowStaff',data)
}


//添加审批人
export function netAddapprovalAll(data) {
	return myRequest('/examine_record/addExamineStaff',data)
}

//终止费用
export function netTerminationCost(data) {
	return myRequest('/consume/revokeConsume',data)
}
//终止审批
export function netTerminationApprove(data) {
	return myRequest('/approval/revokeApproval',data)
}

//终止合同
export function netTerminationContract(data) {
	return myRequest('/contract/revokeContract',data)
}

//传阅
export function netAllCirculateData(data) {
	return myRequest('/message/sendMessage',data)
}

//客户统计
export function netCustomerStatisData(data) {
	return myRequest('/statistics/getCustomerStatistics',data)
}
//任务统计
export function netTaskStatisData(data) {
	return myRequest('/statistics/getEventStatistics',data)
}
//审批统计
export function netApproverStatisData(data) {
	return myRequest('/statistics/getApprovalStatistics',data)
}
//合同统计
export function netContractStatisData(data) {
	return myRequest('/statistics/getContractStatistics',data)
}
//报价单 统计
export function netQuoteStatisData(data) {
	return myRequest('/statistics/getQuoteStatistics',data)
}
//备件 统计
export function netPartStatisData(data) {
	return myRequest('/statistics/getPartsStatistics',data)
}
//工单 统计
export function netWorkorderStatisData(data) {
	return myRequest('/statistics/getWorkorderStatistics',data)
}
//费用 统计
export function netCostStatisData(data) {
	return myRequest('/statistics/getConsumeStatistics',data)
}
//出纳 统计
export function netChunaStatisData(data) {
	return myRequest('/statistics/getCashierStatistics',data)
}

//获取客户所属地区
export function netCustomerArea(data) {
	return myRequest('/customer/getAddressProvince',data)
}
//客户所属地区
export function netAreaList() {
	return myRequest('/customer/getAreaManagement')
}


//工单签名
export function netSignWorkorder(data) {
	return myRequest('/workorder/autograph',data)
}

//审批人列表
export function netApprovalPeople(data) {
	return myRequest('/examine_record/flowStaffList',data)
}

//返厂维修  生成 配件报价单
export function netPartQuoteData(data) {
	return myRequest('/workorder/downloadWorkorder',data)
}

//ocr识别  车牌号
export function netOcrDistinguish(data) {
	return myRequest('/ocrimg/getOcr',data)
}

// ocr  识别  名片
export function netOcrIdentcard(data) {
	return myRequest('/ocrimg/business_card',data)
}
//获取历史 车牌号列表
export function netHistoryHumber(data) {
	return myRequest('/workorder/getCarNumber',data)
}
//获取上一次的 结束公里数
export function netEndKilometers(data) {
	return myRequest('/workorder/getEndMileage',data)
}

//上门维修工单  创建人修改配件信息
export function netEditWorkorderPart(data) {
	return myRequest('/workorder/input_parts',data)
}

//回访工单
export function netWriteVisitContent(data) {
	return myRequest('/workorder/visitWorkorder',data)
}
//获取回访工单列表
export function netReturnVisitList(data) {
	return myRequest('/workorder/getVisitList',data)
}


//设置10s保存一次 
//合同 contract
//报价单   quote
//工作报告   日报,周报,月报,季报,年报
//设置缓存
export function netSetStorage(data) {
	return myRequest('/common/setCacheData',data,false)
}
//获取 缓存
export function netGetStorage(data) {
	return myRequest('/common/getCacheData',data,false)
}


//下载返厂维修单
export function netDownReturnWorkorder(data) {
	return myRequest('/workorder/downloadFanchang',data)
}

//打样 完成
export function netProoDownFinish(data) {
	return myRequest('/proofing/completeProofing',data)
}


//合同 报价单 上传附件
//报价单 添加附件
export function netQuoteAddFile(data) {
	return myRequest('/quote/addFiles',data)
}
//报价单 获取附件列表
export function netQuoteFileList(data) {
	return myRequest('/quote/getFilesList',data)
}
//删除报价单 相关附件
export function netQuoteDelFile(data) {
	return myRequest('/quote/deleteFiles',data)
}


//合同 添加附件
export function netContractAddFile(data) {
	return myRequest('/contract/addFiles',data)
}
//合同 获取附件列表
export function netContractFileList(data) {
	return myRequest('/contract/getFilesList',data)
}
//删除 合同相关附件
export function netContractDelFile(data) {
	return myRequest('/contract/deleteFiles',data)
}

//财务确认收款
export function netToconfirm(data) {
	return myRequest('/workorder/financial_audit',data)
}

//打样 转派
export function netProoTran(data) {
	return myRequest('/proofing/transfer',data)
}


//客户确认  发货
export function netContractStart(data) {
	return myRequest('/contract/startContract',data)
}

//获取 培训内容
export function netTrainContent(data) {
	return myRequest('/workorder/training_content',data)
}

//获取 协助任务 列表
export function netOtherAssistList(data) {
	return myRequest('/workorder/getAssistTaskList',data)
}

//获取 支付类型  文字
export function netPayTypeText(data) {
	return myRequest('/contract/getPayTypeText',data)
}

//打样  任务失败
export function netProoingFail(data) {
	return myRequest('/proofing/failProofing',data)
}

//打样  进度状态
export function netProoingFollow(data) {
	return myRequest('/proofing/getLogs',data)
}


//设计工单  设计失败
export function netDesignFail(data) {
	return myRequest('/workorder/failWorkorder',data)
}


//工单 结算完 之后  财务需要确认
export function netFinanceConfirm(data) {
	return myRequest('/workorder/getFinancialList',data)
}


//获取 设计工单 协助任务的部门列表
export function netWorkorderDepart(data) {
	return myRequest('/workorder/getWorkorderDepartment',data)
}

//获取 打样  邀请协助人的部门列表
export function netProofingDepart(data) {
	return myRequest('/proofing/getProofingDepartment',data)
}

//任务 新增客户需求
export function netAddeventDemand(data) {
	return myRequest('/event/addNeeds',data)
}

//任务  获取客户列表
export function netDemandList(data) {
	return myRequest('/event/getNeedsList',data)
}


//合同那   修改收货信息
export function netAddContractAddress(data) {
	return myRequest('/contract/editContractAddress',data)
}

//添加备件
export function netAddPartdata(data) {
	return myRequest('/parts/addParts',data)
}

//发货工单 填写回执单
export function netFillReceiptWork(data) {
	return myRequest('/workorder/receiptWorkorder',data)
}

//合同发票单
export function netContractInvoice(data) {
	return myRequest('/contract/invoiceContract',data)
}

//合同回执单
export function netContractReceipt(data) {
	return myRequest('/contract/receiptContract',data)
}


//首页  报价单tab数据
export function netQuotationTabNumber() {
	return myRequest('/index/quote')
}
//首页  费用 tab 数量
export function netCostTabNumber() {
	return myRequest('/index/consume')
}
//首页  合同 tab 数量
export function netContractTabNumber() {
	return myRequest('/index/contract')
}
//首页  工单 tab 数量
export function netWorkTabNumber(data) {
	return myRequest('/index/workorder_count',data)
}

//首页  财务 数据简报
export function netFinanceData() {
	return myRequest('/index/financeBriefing')
}

//首页 售后  数据简报
export function netAfterData() {
	return myRequest('/index/afterBriefing')
}

//首页  售后目标
export function netAfterAchieve(data) {
	return myRequest('/index/getAfterAchievement',data)
}


//发送验证码
export function netSendsms(data) {
	return myRequest('/staff/sendSms',data)
}

//手机号登录
export function netMobileLogin(data) {
	return myRequest('/staff/mobileLogin',data)
}
//////////////////////////////////////////////////////////////////////////////////////
// 线索
//获取线索  列表  有分页
export function netCluesList(data) {
	return myRequest('/leads/getList',data)
}

//获取 线索列表  无分页
export function netGetNopageClueslist(data) {
	return myRequest('/leads/getSelectList',data)
}

//添加   线索 、
export function netAddClues(data) {
	return myRequest('/leads/addLeads',data)
}

//线索 详情
export function netCluesDetail(data) {
	return myRequest('/leads/getDetail',data)
}
//修改 线索
export function netEditClues(data) {
	return myRequest('/leads/editLeads',data)
}
//删除  线索
export function netDelClues(data) {
	return myRequest('/leads/delLeads',data)
}

//线索   附件
export function netCluesFiles(data){
	return myRequest('/leads/getFilesList',data)
}

//线索更换负责人
export function netCluesTrans(data) {
	return myRequest('/leads/transfer',data)
}
/////////////////////////////////////
//客户 筛选条件  归属人
export function netSearchStaffList(data) {
	return myRequest('/customer/getSearchStaffList',data)
}

//跟进 记录 详情
export function netFollowRecordDetail(data) {
	return myRequest('/record/getRecordDetail',data)
}

//跟进 记录  添加评论
export function netAddComment(data) {
	return myRequest('/record/addComment',data)
}

//获取  评论 列表
export function netGetCommentList(data) {
	return myRequest('/record/commentList',data)
}
//获取客户  跟进记录    线索动态
export function netKehuFollow(data) {
	return myRequest('/record/getList',data)
}
///////////////////////////////////////////////////////////////////////
//表单设置  leads 线索 customer 客户 contacts 联系人 contract 合同 examine回款  business商机
export function netSetForm(data) {
	return myRequest('/common/getForm',data)
}
//搜索条件   表单
export function netSearchForm(data) {
	return myRequest('/common/getSearchFields',data)
}
////////////////////////////////////////////////////////////////////////////
//创建 跟进 记录
export function netAddFollowRecords(data) {
	return myRequest('/record/createRecord',data)
}
/////////////////////////////////////////////////////////////////////
//商机列表
export function netBusinessList(data) {
	return myRequest('/business/getList',data)
}
//商机详情
export function netBusinessDetail(data) {
	return myRequest('/business/getDetail',data)
}
//增加商机
export function netAddBusiness(data) {
	return myRequest('/business/addBusiness',data)
}
//修改商机
export function netEditBusiness(data) {
	return myRequest('/business/editBusiness',data)
}
//转移商机
export function netTransBusiness(data) {
	return myRequest('/business/batch_change',data)
}
//删除商机
export function netDelBusiness(data) {
	return myRequest('/business/delete',data)
}
//客户关联的商机
export function netRelationBusiness(data) {
	return myRequest('/business/business_list',data)
}
//选择关联   商机列表
export function netSelectBusinessList(data) {
	return myRequest('/business/get_select_list',data)
}
//商机关联的合同
export function netRelationContract(data) {
	return myRequest('/business/contract',data)
}
//推进商机 状态
export function netAdvanceBusiness(data) {
	return myRequest('/business/business_status',data)
}
//推进商机阶段的  历史
export function netBusinessHistory(data) {
	return myRequest('/business/business_history',data)
}
///////////////////////////////////////////////////////////////////////////////////
/*
线索池
*/
//  线索池列表  有分页
export function netCluesPoolList(data) {
	return myRequest('/leadspool/getList',data)
}
//添加   线索池 、
export function netAddCluesPool(data) {
	return myRequest('/leadspool/addLeads',data)
}

//线索池 详情
export function netCluesPoolDetail(data) {
	return myRequest('/leadspool/getDetail',data)
}
//修改 线索池
export function netEditCluesPool(data) {
	return myRequest('/leadspool/editLeads',data)
}
//删除  线索池
export function netDelCluesPool(data) {
	return myRequest('/leadspool/delLeads',data)
}

//线索池   附件
export function netCluesPoolFiles(data){
	return myRequest('/leadspool/getFilesList',data)
}

//领取 线索池
export function netReceiveCluesPool(data) {
	return myRequest('/leadspool/achieve',data)
}

//批量分配  线索
export function netAllDistriCluesPool(data) {
	return myRequest('/leadspool/transfer',data)
}

/////////////////////////////////////////////////////////////
//判断是否可以打卡
export function netIsPunch(data) {
	return myRequest('/attendance/is_card',data,'POST',false)
}
//正常打卡
export function netPunchClock(data) {
	return myRequest('/attendance/card_add',data)
}
//外出打卡
export function netOutClock(data) {
	return myRequest('/attendance/other_card',data)
}
//补卡申请
export function netSupplementClock(data) {
	return myRequest('/attendance/card_late',data)
}
//获取考情详情
export function netCheckworkDetail(data) {
	return myRequest('/attendance/get_statisc',data)
}
//获取打卡统计
export function netClockStatis(data) {
	return myRequest('/attendance/statistics',data)
}
//获取考勤月统计
export function netClockMonthStatis(data) {
	return myRequest('/attendance/month_statistics',data)
}
//获取 考勤日统计
export function netClockDayStatis(data) {
	return myRequest('/attendance/day_statistics',data)
}
//计算请假时长
export function netLeaveDuration(data) {
	return myRequest('/attendance/getleavetime',data)
}
//请假
export function netApplyLeave(data) {
	return myRequest('/attendance/leave',data)
}
//获取补卡记录
export function netCardList(data) {
	return myRequest('/attendance/get_card_late',data)
}
//补卡记录详情
export function netCardDetail(data) {
	return myRequest('/attendance/get_card_detail',data)
}
//获取请假记录
export function netLeaveList(data) {
	return myRequest('/attendance/get_leave',data)
}
//获取请假记录详情
export function netLeaveDetail(data) {
	return myRequest('/attendance/get_leave_detail',data)
}
//获取外勤打卡详情
export function netOutClockDetail(data) {
	return myRequest('/attendance/get_attendance_detail',data)
}
////////////////////////////////////////////////////////////
//添加规则
export function netAddRules(data) {
	return myRequest('/attendance/rule_add',data)
}
//规则列表
export function netRulesList(data) {
	return myRequest('/attendance/rule_list',data)
}
//规则详情
export function netRulesDetail(data) {
	return myRequest('/attendance/rule_detail',data)
}
//规则删除
export function netDelRules(data) {
	return myRequest('/attendance/rule_del',data)
}
//规则修改
export function netEditRules(data) {
	return myRequest('/attendance/rule_update',data)
}
///////////////////////////////////////////////////////////////////////////
//判断是否已经设置
export function netisSetTimeslot() {
	return myRequest('/attendance/is_week')
}
//添加时间段
export function netAddTimeSlot(data) {
	return myRequest('/attendance/time_add',data)
}
//时间段修改
export function netEditTimeSlot(data) {
	return myRequest('/attendance/time_update',data)
}
//时间段列表
export function netTimeSlotList(data) {
	return myRequest('/attendance/time_list',data)
}
//时间段详情
export function netTimeSlotDetail(data) {
	return myRequest('/attendance/time_detail',data)
}
//时间段删除
export function netDelTimeSlot(data) {
	return myRequest('/attendance/time_del',data)
}
///////////////////////////////////////////////////////
//地址添加
export function netAddAddress(data) {
	return myRequest('/attendance/address_add',data)
}
//地址详情
export function netAddressDetail(data) {
	return myRequest('/attendance/address_detail',data)
}
//地址修改
export function netEditAddress(data) {
	return myRequest('/attendance/address_update',data)
}
//地址列表
export function netAddressList(data) {
	return myRequest('/attendance/address_list',data)
}
//地址删除
export function netDelAddress(data){
	return myRequest('/attendance/address_del',data)
}
///////////////////////////////////////////////////////////////////////////////////
/**
 * 工作报告
 * */
//创建工作报告
 export function netCreateWork(data) {
	 return myRequest('/daily/createDaily',data)
 }
 //获取 工作  报告
 export function netWorkreportList(data) {
	 return myRequest('/daily/getList',data)
 }
 //获取  工作报告  详情
 export function netWorkDetail(data) {
	 return myRequest('/daily/getDailyDetail',data)
 }
 //创建工作报告草稿
 export function netCreateStraf(data) {
 	 return myRequest('/daily/daily_draft',data)
 }
 //获取  工作报告草稿  详情
 export function netWorkDraftDetail(data) {
 	 return myRequest('/daily/getDailyDraftDetail',data)
 }
 //获取工作报告已读和未读列表
 export function netWorkisRead(data) {
	 return myRequest('/daily/getDailyRead',data)
 }
 ////////////////////////////////////////////////////////////////////////////////////////
 //获取审批流程
 // type:  contract 合同   receivables  回款   consume 费用   achievement 业绩目标  
 //  approval 办公  quota报价单   parts 入库/出库  workorder工单里的费用
 export function netApprovalProcess(data) {
 	return myRequest('/staff/getsteplist',data)
 }
 
 //审批流程详情 
 //type:  contract 合同   receivables  回款    consume 费用   achievement 业绩目标   
 //  approval 办公   quota报价单    parts 入库/出库
 //relation_id 
 export function netApprovalDetail(data) {
 	return myRequest('/staff/getstepdetail',data)
 }
 //获取  回款  审批  流程    relation_type receivables 回款 contract 合同 consume 费用   parts备件
 // achievement目标
 export function netPaymentApproval(data) {
 	return myRequest('/api/examine_record/getList',data)
 }
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////
 //通知消息列表
 export function netMessageList(data) {
 	return myRequest('/message/getList',data)
 }
 //消息 列表
 export function netAgentList(data) {
 	return myRequest('/message/getInfo',data)
 }
 //公告 列表
 export function netNoticeList(data) {
 	return myRequest('/notice/getList',data)
 }
 //公告详情
 export function netNoticeDetail(data) {
 	return myRequest('/notice/getDetail',data)
 }
 //获取 待办 事项
 export function netNeedDealtData() {
 	return myRequest('/index/agent')
 }
 //待跟进客户
 export function daibanKehuFollow(data) {
 	return myRequest('/record/getcustomerList',data)
 }
 //获取  待跟进  任务列表
 export function netGetFollowList() {
 	return myRequest('/index/event_task')
 }
 //获取 待处理  任务列表
 export function netGetScheList() {
 	return myRequest('/index/event_one')
 }
 //获取  待审核  合同 列表
 export function netGetContractList() {
 	return myRequest('/index/examine_contract')
 }
 //获取  待审核   回款  列表
 export function netGetPaymentList() {
 	return myRequest('/index/examine_receivables')
 }
 //获取  待回款  提醒 列表
 export function netGetPaymentRemindList() {
 	return myRequest('/index/examine_receivables_plan')
 }
 //修改任务 状态
 export function netEditScheculeStatus(data) {
 	return myRequest('/event/changeStatus',data)
 }
 //获取待审批数量
 export function netPendApprovel(data) {
 	return myRequest('/message/getExamineInfo',data)
 }
 //获取审批通知  列表
 export function netApprovelNotice(data) {
 	return myRequest('/examine_record/get_examine_list',data)
 }
 //获取  出差  签到 列表
 export function netGetSignList(data) {
 	return myRequest('/event/getOutSign',data)
 }
 //签到 详情
 export function netGetSignDetail(data) {
 	return myRequest('/event/getOutSignDetail',data)
 }
 //添加 出差 签到
 export function netAddOutSignin(data) {
 	return myRequest('/event/addOutSign',data)
 }
 /////////////////////////////////////////////////////////////
//获取业绩统计
export function netAchievementStatistics(data) {
	return myRequest('/statistics/getAchievementDetail',data)
}
//获取  成员 默认目标详情
export function netGetDefaultSelfDetail(data){
	return myRequest('/achievement/getMyAchievementDetail',data)
}
//获取 部门  年  筛选条件
export function netGetTargetSelect() {
	return myRequest('/achievement/getDepartment')
}
//修改  我的  业绩目标
export function netSetMymubiao(data){
	return myRequest('/achievement/staffEditAchievement',data)
}
//我的  业绩目标  修改记录
export function netGetRecordList(data) {
	return myRequest('/achievement/editRecords',data)
}
//修改  记录  修改  详情
export function netGetRecordDetail(data) {
	return myRequest('/achievement/getRecordsDetail',data)
}
// 目标 完成 度
export function netTargetData(data) {
	return myRequest('/statistics/staffAchievementStatistics',data)
}
//业绩  新增 总汇
export function netAddDataRank() {
	return myRequest('/statistics/newRanking')
}
/**
 * 业绩 新增  个人  团队  数据 
 * */
 //个人
 export function netPersonalData(data) {
	 return myRequest('/statistics/newRanking',data)
 }
 //团队
 export function netTeamData(data) {
	 return myRequest('/statistics/addCustomerStatistics',data)
 }
 //回款计划  列表
 export function netPlanListf(data) {
 	return myRequest('/receivables_plan/getList',data)
 }
 //回款计划  无分页列表
 export function netPlanNopage(data) {
	 return myRequest('/receivables_plan/getSelectList',data)
 }
 //创建 回款  计划
 export function netAddPlan(data) {
 	return myRequest('/receivables_plan/addPlan',data)
 }
 //获取部门  树状结构
 export function netDepartmentTree(data) {
	return myRequest('/staff/getDepartment',data)
 }
 //获取商机阶段
 export function netBusinessStage() {
	return myRequest('/business/follow')
 }
 //合同统计
 export function netNewContractStatis(data) {
	return myRequest('/statistics/contractStatistics',data)
}
 //商机统计
export function netNewBusinessStatis(data) {
	return myRequest('/statistics/businessStatistics',data)
}
//获取联系人列表
export function netNewLinkList(data) {
	return myRequest('/contacts/getList',data)
}
//客户统计
export function netNewCustomerStatis(data) {
	return myRequest('/statistics/customerStatistics',data)
}

 //线索转客户
export function netLeadsTransCustomer(data) {
	return myRequest('/leads/convert_customer',data)
}
//线索 移入线索池
export function netLeadsToCluepool(data) {
	return myRequest('/leads/movePool',data)
}
/**
 * 发票管理
 */
//发票列表
export function netInvoiceList(data) {
	return myRequest('/invoice/getList',data)
}
//添加发票
export function netAddInvoice(data) {
	return myRequest('/invoice/addInvoice',data)
}
//修改发票
export function netEditInvoice(data) {
	return myRequest('/invoice/editInvoice',data)
}
//发票详情
export function netDetailInvoice(data) {
	return myRequest('/invoice/getDetail',data)
}
//发票编号
export function netInvoiceNumber() {
	return myRequest('/invoice/getNumber')
}
//发票标记为已开票
export function netBiaojiInvoice(data) {
	return myRequest('/invoice/startInvoice',data)
}

