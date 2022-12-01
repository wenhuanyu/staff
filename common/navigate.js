import { netStaffDefaultReviewer, netWorkOrderDetail, uploadUrl } from '@/api/api.js'
import { BASE_URL, SIGN_NO } from '@/api/http.js'
export const commonFun = {
	props:{
		childType:{
			type:Boolean,
			default:false
		}
	},
	onLoad() {
		if(!this.isAddTeam){
			this.clearRemindlist()
		}
	},
	methods: {
		jumpWorkorderDetail(item) {
			netWorkOrderDetail({id:item.relation_id}).then(res=>{
				if(res.data.workorder_type == '上门维修' || res.data.workorder_type == '上门安装' || res.data.workorder_type == '生产工单' || res.data.workorder_type == '配件安装'){
					//  售后服务 上门维修 
					uni.navigateTo({
						url:'/pagesA/afterSales/workorderDetail?workorderid='+item.relation_id
					})
				}else if(res.data.workorder_type == '返厂维修'){
					//  售后服务 返厂维修  优惠金额 审批
					uni.navigateTo({
						url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+item.relation_id
					})
				}else if(res.data.workorder_type == '产品发货' || res.data.workorder_type == '配件配送'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorder/distribution_word?workorderid='+item.relation_id
					})
				}else if(res.data.workorder_type == '品质异常单'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorder/quality_order_detail?workorderid='+item.relation_id
					})
				}else if(res.data.workorder_type == '设计工单'){
					uni.navigateTo({
						url:'/pagesA/afterSales/designWorkOrder/designDetail?id='+item.relation_id
					})
				}else if(res.data.workorder_type == '电话售后'){
					uni.navigateTo({
						url:'/pagesA/afterSales/phoneAftersale/detail?id='+item.relation_id
					})
				}
			})
		},
		//去选择客户
		toSelectCustomer() {
			uni.setStorageSync('isJump',true)    //新建合同的时候  判断是否跳页面
			this.$store.commit('VISIT_PLAN_REMARKS','')
			this.$store.commit('VISIT_PLAN_TITLE','')
			uni.navigateTo({
				url:'/pages/template/relation_customer'
			})
		},
		//去选择员工 
		toSelectStaff(type) {
			uni.setStorageSync('isJump',true)    //新建合同的时候  判断是否跳页面
			this.$store.commit('VISIT_PLAN_REMARKS','')
			this.$store.commit('VISIT_PLAN_TITLE','')
			if(type){
				uni.navigateTo({
					url:'/pages/template/relation_staff?type='+type
				})
			}else{
				uni.navigateTo({
					url:'/pages/template/relation_staff'
				})
			}
		},
		// 去重
		deWeight(arr,flag=false) {
		    for (var i = 0; i < arr.length - 1; i++) {
		        for (var j = i + 1; j < arr.length; j++) {
		            if (arr[i].id == arr[j].id) {
						if(flag){
							arr[i].number += arr[j].number
						}
		                arr.splice(j, 1);
		                j--;
		            }
		        }
		    }
		    return arr;
		},
		//获取  需要默认提醒的人
		getDefaultRemind() {
			netStaffDefaultReviewer({type:this.examineType}).then(res=>{
				res = res.data
				res.forEach((ele,index) => {
					ele.isDel = false
				})
				this.remindPeople = this.deWeight([...res,...uni.getStorageSync('remindlist')])
				console.log(this.remindPeople,'默认审核人')
			})
		},
		//删除 提醒人
		delItem(index) {
			this.remindPeople.splice(index, 1)
			uni.setStorageSync('remindlist', this.remindPeople)
		},
		delExamine(index) {
			this.remindPeople.splice(index, 1)
			uni.setStorageSync('remindlist', this.remindPeople)
			this.getDefaultRemind()
		},
		clearRemindlist() {
			this.remindPeople = []
			if(uni.getStorageSync('EditContract')){
				let arr = uni.getStorageSync('contractRemindlist')
				uni.setStorageSync('remindlist', arr)
				this.getDefaultRemind()
			}else{
				uni.setStorageSync('remindlist', [])
			}
		},
		//加签的时候    处理默认的  审核人
		handleApproval(data) {
			let arr = []
			data.forEach(ele=>{
				arr.push(ele.check_staff)
			})
			return arr
		},
		// 打开文档
		openFile(data) {
			// #ifdef MP-WEIXIN
			uni.showLoading({title:'正在打开'})
			let name = data.filename
			let suffix = name.substring(name.indexOf('.')+1)
			let manage = uni.getFileSystemManager()
			if(data.type == 'file'){
				uni.downloadFile({
					url: data.file,
					success:(downres)=>{
						uni.hideLoading();
						let urls = wx.env.USER_DATA_PATH+'/'+data.filename
						manage.saveFile({
							tempFilePath:downres.tempFilePath,
							filePath:urls,
							fileType: suffix,
							success:(saveData)=>{
								uni.openDocument({
									filePath: saveData.savedFilePath,
									showMenu: true,
									success:(res) => {
										uni.hideToast()
									},
									fail:(er)=>{
										uni.hideToast()
									}
								})
							}
						})
					},
					fail:(errmsg)=>{console.log(errmsg)}
				})
			}else{
				uni.hideLoading();
				uni.previewImage({
					urls:[ data.file ]
				})
			}
			// #endif
			// #ifdef H5
			window.open(data.file)
			// #endif
		},
		//上传文件
		toUploadFile(callback) {
			// #ifdef MP-WEIXIN
			wx.chooseMessageFile({
				count:1,
				success:(res)=>{
					let data = res.tempFiles[0]
					let url = this.Upload(data.path,data.name,(calldata)=>{
						callback(calldata)
					})
				}
			})
			// #endif
			// #ifdef H5
			uni.chooseFile({
				count:1,
				success:(res)=>{
					let data = res.tempFiles[0]
					let url = this.Upload(data.path,data.name,(calldata)=>{
						callback(calldata)
					})
				}
			})
			// #endif
		},
		Upload(file,name,callback) {
			uni.uploadFile({
				url: uploadUrl,
				name: 'file',
				header: {
					'token': uni.getStorageSync('token'),
					'sign-no': SIGN_NO
				},
				filePath: file,
				formData:{name},
				success: (res) => {
					let data = JSON.parse(res.data)
					if (data.code == 1) {
						let res = data.data
						res.name = name
						callback(res)
					} else {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						})
					}
				},
				fail: (err) => {
					console.log(err)
				}
			})
		},
	}
}