import { myRequest } from './http.js'

//拜访计划  标题  模版
//type:  任务内容(标题)   任务备注   回款备注  服务费用  
//  客户类型   客户未成交  费用主题   任务目的
export function netTemplateList(data){
	return myRequest('/texttemplate/getText',data)
}


//操作记录  1客户  2联系人  3合同    4线索   5回款记录   
//6产品   7报价单    8工单       
//6商机    7报价单   8工单    9审批管理
export function netOperationRecord(data) {
	return myRequest('/operation/getList',data)
}


//生成二维码  地址
export const netGenerEwm = '/qrcode/qrcode'

