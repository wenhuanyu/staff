export const indexFun = {
	methods:{
		//消息
		toNews() {
			uni.navigateTo({
				url:'/pages/news/index'
			})
		},
		//公海 客户
		toWaterCustomer() {
			uni.navigateTo({
				url:'/pages/index/waterCustomer/index'
			})
		},
		//线索
		toClues() {
			uni.navigateTo({
				url:'/pagesB/cluesManagement/cluesManagement'
			})
		},
		//商机
		toBusiness() {
			uni.navigateTo({
				url:'/pagesB/business/index'
			})
		},
		//线索池
		toCluesPool() {
			uni.navigateTo({
				url:'/pagesB/cluepool/index'
			})
		},
		//打卡
		toClock() {
			uni.navigateTo({
				url:'/pagesB/punchclock/index'
			})
		},
		//工作报告
		workreport() {
			uni.navigateTo({
				url:'/pagesB/workreport/list'
			})
		},
		//出差签到
		toSignList() {
			uni.navigateTo({
				url:'/pagesB/signin/signin'
			})
		},
		//我的客户
		toMyCustomer() {
			uni.navigateTo({
				url:'/pages/index/myCustomer/index'
			})
		},
		//工作审批
		toApproval() {
			uni.navigateTo({
				url:'/pagesA/user/work_approval/index'
			})
		},
		//备件管理
		toSparepart() {
			uni.navigateTo({
				url:'/pagesC/sparepart/index'
			})
		},
		//工单
		toAftersales() {
			uni.navigateTo({
				url:'/pagesA/afterSales/index'
			})
		},
		//订单
		toOrder() {
			uni.navigateTo({
				url:'/pagesB/order/index'
			})
		},
		//报价单
		toQuotation() {
			uni.navigateTo({
				url:'/pagesC/quotation/index'
			})
		},
		//新建拜访计划
		toCreateVisit() {
			uni.navigateTo({
				url:'/pagesA/customerInfo/visit/createVisit'
			})
		},
		//产品 管理
		toProductManage() {
			uni.navigateTo({
				url:'/pages/index/productManagements/index'
			})
		},
		//合同管理
		toContract() {
			uni.navigateTo({
				url:'/pages/index/contractManagements/index'
			})
		},
		//知识库
		toKnowledge() {
			uni.navigateTo({
				url:'/pagesA/user/knowledge_base/list'
			})
		},
		
		//费用管理
		toCostlist() {
			uni.navigateTo({
				url:'/pagesA/customerInfo/cost/list'
			})
		},
		//日志
		toJournal() {
			uni.navigateTo({
				url:'/pagesC/journal/index'
			})
		},
		//任务
		toAdd() {
			uni.navigateTo({
				url:'/pagesA/customerInfo/visit/visitList'
			})
		},
		//出纳
		toCashier() {
			uni.navigateTo({
				url:'/pagesA/customerInfo/cost/cashierSheet'
			})
		},
		
		//地图
		toMap() {
			uni.navigateTo({
				url:'/pages/map/index'
			})
		},
	}
}