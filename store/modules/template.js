const state = {
	visit_plan_title:'',   //拜访计划 标题模版
	visit_plan_remarks:'',   //拜访计划   备注模版
	service_cost:'',    //产品安装 完成 服务费用
	level_remarks:'',   //更改 级别  原因
	cost_title:'',    //费用  主题
	event_need:'',    //上门 任务  完成任务时客户需求
	uninstall_reason:'',    //售后工单  上门安装  安装未完成原因
	workorder_title:'',   //工单标题
}

const actions = {
	
}

const mutations = {
	['VISIT_PLAN_TITLE'](state, data) {
		state.visit_plan_title = data
	},
	['VISIT_PLAN_REMARKS'](state, data) {
		state.visit_plan_remarks = data
	},
	['SERVICE_COST'](state, data) {
		state.service_cost = data
	},
	['LEVEL_REMARKS'](state, data) {
		state.level_remarks = data
	},
	['COST_TITLE'](state, data) {
		state.cost_title = data
	},
	['EVENT_NEED'](state, data) {
		state.event_need = data
	},
	['UNINSTALL_REASON'](state, data) {
		state.uninstall_reason = data
	},
	['WORKORDER_TITLE'](state, data) {
		state.workorder_title = data
	}
}

const getters = {
	
}

export default {
	state,
	mutations,
	actions,
	getters
}

