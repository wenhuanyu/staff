const state = {
	permission:{},   //权限
	customerobj:null,   //选择的客户
	staffObj:null,   //选择的 员工
	sparePartList:[],   //配件信息
	sendEmailList:[],   //邮件  收件人列表
	ccList:[],   //邮件  抄送人列表
	addCustomerInfo:null,   //新增客户 信息
	costlist:[],   //费用列表
	problemParent:{},   //问题类型
	problemList:[],   ///问题分类
	programList:[],   //解决问题的方案
	achievegoal:[],    //达到目的
	staffTwo:null,  //批量选择的列表 员工
}

const actions = {
	
}

const mutations = {
	['SETPERMISSION'](state, data) {
		state.permission = data
	},
	['CUSTOMEROBJ'](state, data) {
		state.customerobj = data
	},
	['STAFFOBJ'](state, data) {
		state.staffObj = data
	},
	['STAFFTWO'](state, data) {
		state.staffTwo = data
	},
	['SENDEMAILLIST'](state, data) {
		state.sendEmailList = data
	},
	['CCLIST'](state, data) {
		state.ccList = data
	},
	['ADDCUSTOMERINFO'](state, data) {
		state.addCustomerInfo = data
	},
	['SETCOSTlIST'](state, data) {
		state.costlist = data
	},
	['SETPROBLEMPARENT'](state, data) {
		state.problemParent = data
	},
	['SETPROBLEMLIST'](state, data) {
		state.problemList = data
	},
	['SETPROGRAMLIST'](state, data) {
		state.programList = data
	},
	['SETACHIEVEGOAL'](state, data) {
		state.achievegoal = data
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
