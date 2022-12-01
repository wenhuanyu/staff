import { myRequest } from './http.js'

/////////////////////////////////////////////////////////////////////////////////////////////
//获取个人基本信息
export function netGetUserInfo() {
	return myRequest('/staff/getInfo')
}
//编辑 个人 信息
export function netEditUserInfo(data) {
	return myRequest('/staff/editInfo',data)
}
//绑定 手机号
export function netBindPhone(data) {
	return myRequest('/staff/use_phone',data)
}

//员工列表
export function netDepartStafflist(data) {
	return myRequest('/staff/getDepartmentStaffList',data)
}
//团队成员
export function netTeamSubordinate(data) {
	return myRequest('/staff/getStaffTeamList',data)
}

//员工详情
export function netStaffDetail(data) {
	return myRequest('/staff/getStaffDetail',data)
}

//员工  工作报告
export function netStaffWorkreport(data) {
	return myRequest('/staff/getWorkReport',data)
}


//员工详情 业绩统计
export function netStaffStatis(data) {
	return myRequest('/staff/getStaffStatistics',data)
}

//员工 运动 轨迹
export function netStaffTraill(data) {
	return myRequest('/staff/getStaffLocation',data)
}

//员工  审核 列表
export function netStaffExamineList(data) {
	return myRequest('/staff/getCheckStaffList',data)
}

//员工 审核 通过
export function netStaffExaminPass(data) {
	return myRequest('/staff/checkStaffSuccess',data)
}

//员工  审核 拒绝
export function netStaffExaminFail(data) {
	return myRequest('/staff/checkStaffError',data)
}

//部门 列表
export function netDepartment() {
	return myRequest('/staff/getDepartment')
}

//上级 列表
export function netParentList(data) {
	return myRequest('/staff/getParentList',data)
}

//工商信息  查询企业 列表
export function netQueryBusiness(data) {
	return myRequest('/enterprise/getEnterprise',data)
}

//工商信息  详情
export function netBusinessDetail(data) {
	return myRequest('/enterprise/getDetail',data)
}

//绑定 邮箱
export function netBindMail(data) {
	return myRequest('/staff/registerEmail',data)
}

//获取 邮件列表
export function netEmailList(data) {
	return myRequest('/receiveemail/getEmails',data)
}

//获取 已发送 邮件列表
export function netSendEmailList(data) {
	return myRequest('/sendemail/getSendEmails',data)
}

//删除  邮件
export function netDelEmail(data) {
	return myRequest('/receiveemail/delEmail',data)
}

//邮件详情
export function netEmailDetails(data) {
	return myRequest('/receiveemail/detailEmail',data)
}

//获取客户  联系人  邮件
export function netCustomerLinkEmail(data) {
	return myRequest('/contacts/getEmails',data)
}

//获取 员工 邮件
export function netStaffLinkEmail(data) {
	return myRequest('/staff/getEmails',data)
}

//发送邮件
export function netSendEmail(data) {
	return myRequest('/sendemail/sendEmail',data)
}

//获取 通知 列表
export function netMesList(data) {
	return myRequest('/message/getInfo',data)
}

//获取 系统  公告 列表
export function netNoticeList(data) {
	return myRequest('/notice/getList',data)
}

//公告  详情
export function netNoticeDetail(data) {
	return myRequest('/notice/getDetail',data)
}

//获取 消息 通知列表
export function netMessageList(data) {
	return myRequest('/message/getList',data)
}

//获取 待办事项  列表
export function netToduList(data) {
	return myRequest('/message/getStartEvent',data)
}

//获取 超时任务 列表
export function netTimeoutList(data) {
	return myRequest('/message/getOverEvent',data)
}

//获取 工作动态
export function netWorkSignList(data) {
	return myRequest('/message/getWorkSignin',data)
}


//获取 日志
export function netWorkReportList(data) {
	return myRequest('/message/getWorkreportMessage',data)
}





