import { netSearchForm } from '@/api/api.js'

// 防止处理多次点击
function noMultipleClicks(methods, info) {
    // methods是点击后需要执行的函数， info是函数需要传的参数
    let that = this;
    if (that.noClick) {
        // 第一次点击
        that.noClick= false;
        if((info && info !== '') || info ==0) {
            // info是执行函数需要传的参数
            methods(info);
        } else {
            methods();
        }
        setTimeout(()=> {
            that.noClick= true;
        }, 5000)
    } else {
        //  这里是重复点击的判断
		
    }
}

//搜索表单渲染时 的  数据处理
function handleSearchForm(type,callback) {
	netSearchForm({type}).then(res=>{
		let data = res.data
		let newData = []
		data.forEach(ele=>{
			let obj = {
				form_type:ele.form_type,
				name:ele.name,
				field:ele.field,
				input_tips:ele.input_tips,
			}
			if(ele.form_type == 'radio' || ele.form_type == 'checkbox'){
				obj.content = ele.setting.split('|')
			}else if(ele.form_type == 'TimePicker' || ele.form_type == 'DatePicker'){
				obj.start_time = ''
				obj.end_time = ''
				obj.value = ''
			}else if(ele.form_type == 'select'){
				obj.content = []
				let arr = ele.setting.split('|')
				arr.forEach((item,index)=>{
					obj.content.push({
						label:item,
						nodeKey:index
					})
				})
			}else if(ele.form_type == 'label'){
				obj.content = JSON.parse(ele.setting)
			}else{
				obj.value = ''
			}
			newData.push(obj)
		})
		callback(newData)
	})
}

//搜索表单  值修改时处理
function handleChangeSearchValue(arr,type,key,value){
	let v_index,v_obj
	arr.forEach((ele,index)=>{
		if(ele.field == type){
			if(ele.form_type == 'label'){
				let a = []
				let s_arr = []
				let v_arr = ele.content
				value.forEach(vele=>{
					a.push(vele.label)
					s_arr.push(vele.la_va)
				})
				console.log(a,s_arr,'标签')
				//判断值  默认选中
				s_arr.forEach(sele=>{
					v_arr.forEach(vitem=>{
						vitem.children.forEach(cele=>{
							if(sele == cele.la_va){
								cele.checked = true
							}
						})
					})
				})
				ele.content = v_arr
				ele.value_arr = value
				ele[key] = a.join(',')
			}else{
				ele[key] = value
			}
			v_index = index
			v_obj = ele
		}
	})
	return {v_index,v_obj}
}

//搜索表单 确定时的  数据处理
function handleSureSearch(data){
	let obj = {}
	if(data && data.length){
		data.forEach(ele=>{
			if((ele.form_type == "DatePicker" || ele.form_type == "TimePicker") && ele.value == 'zidingyi'){
				obj[ele.field] = (ele.start_time && ele.end_time) ? ele.start_time+','+ele.end_time : ''
			}else if(ele.form_type == 'staff' || ele.form_type == 'customer' || ele.form_type == 'contact' || ele.form_type == 'business' || ele.form_type == 'contract' || ele.form_type == 'department'){
				obj[ele.field] = ele.value?ele.value.id:''
			}else if(ele.form_type == 'switch'){
				if(typeof ele.value == 'string'){
					obj[ele.field] = ''
				}else{
					obj[ele.field] = ele.value ? 1 : 0
				}
			}else if(ele.form_type == 'label'){
				let arr = ele.value_arr?ele.value_arr:[]
				let b = []
				arr.forEach(ele=>{
					b.push(ele.la_va)
				})
				obj[ele.field] = b.join(',')
			}else{
				obj[ele.field] = ele.value
			}
		})
	}
	return obj
}

//重置搜索 表单
function handleResetSearch(data) {
	data.forEach(ele=>{
		if((ele.form_type == "DatePicker" || ele.form_type == "TimePicker") && ele.value == 'zidingyi'){
			ele.start_time = ''
			ele.end_time = ''
		}else if(ele.form_type == "label"){
			ele.value = ''
			ele.value_arr = []
			ele.content.forEach(pele=>{
				pele.children.forEach(cele=>{
					delete cele.checked
				})
			})
		}else{
			ele.value = ''
		}
	})
	console.log(data,'重置')
	return data
}

//查看详情时  给form表单赋值
function handleFormDefaultValue(arr,info){
	if(arr.length && info){
		arr.forEach(ele=>{
			if(ele.component == 'checkbox'){
				let a = ele.config.content
				let s = info[ele.id]?info[ele.id].split(','):[]
				a.forEach(aele=>{
					if(s.includes(aele.value)){
						aele.select = true
					}
				})
				ele.config.content = a
			}else if(ele.component == 'editor'){
				ele.value = info[ele.id]?info[ele.id].replaceAll('<img','<img style="max-width:100%;height:auto"'):''
				ele.value_t = info[ele.id]
			}else if(ele.component == 'label'){
				let s_arr = info[ele.id]?info[ele.id].split(','):[]
				console.log(s_arr)
				let v_arr = ele.config.content
				let f_arr = []
				s_arr.forEach(sele=>{
					v_arr.forEach(vitem=>{
						vitem.children.forEach(cele=>{
							if(sele == cele.la_va){
								f_arr.push(cele)
								cele.checked = true
							}
						})
					})
				})
				ele.value_arr = f_arr
				ele.value = info[ele.id]
				ele.config.content = v_arr
			}else{
				ele.value = info[ele.id]?info[ele.id]:''
			}
		})
	}
	return arr
}

//form表单 修改数据的时候  给value赋值
function changeFormData(name,value,obj) {
	if(obj.component == 'map'){
		obj.value = value[0] + value[1]
		obj.lat = value[2]
		obj.lng = value[3]
	}else if(obj.component == 'location'){
		obj.value = value[0]
		obj.lat = value[1]
		obj.lng = value[2]
	}else if(obj.component == 'checkbox'){
		let arr = obj.config.content
		let s = value.split(',')
		arr.forEach(ele=>{
			if(s.includes(ele.value)){
				ele.select = true
			}
		})
		obj.config.content = arr
		obj.value = value
	}else if(obj.component == 'editor'){
		obj.value = value.replaceAll('<img','<img style="max-width:100%;height:auto"')
		obj.value_t = value
	}else if(obj.component == 'label'){
		let a = []   //值
		value.forEach(ele=>{
			a.push(ele.label)
		})
		obj.value_arr = value
		obj.value = a.join(',')
	}else{
		obj.value = value
	}
	return obj
}


//提交的数据 进行校验必填 非必填
function checkCommonForm(data){
	let arr = []
	data.forEach(ele=>{
		arr.push({
			required: ele.config.required,
			msg: ele.config.placeholder,
			...ele
		})
	})
	console.log(arr,'提交的数据')
	let obj = {}
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].required && !arr[i].value) {
			uni.showToast({
				title: arr[i].msg,
				icon: 'none'
			})
			return
		}
		if(arr[i].component == 'uploadImage' || arr[i].component == 'uploadFile'){
			let a = arr[i].value?arr[i].value:[]
			let ids = []
			a.forEach(ele=>{
				ids.push(ele.id)
			})
			obj[arr[i].id] = ids.join(',')
		}else if(arr[i].component == 'map'){
			obj[arr[i].id] = arr[i].value
			obj[arr[i].id+'_lat'] = arr[i].lat
			obj[arr[i].id+'_lng'] = arr[i].lng
		}else if(arr[i].component == 'location'){
			obj[arr[i].id] = arr[i].value
			obj[arr[i].id+'_lat'] = arr[i].lat
			obj[arr[i].id+'_lng'] = arr[i].lng
		}else if(arr[i].component == 'staff' || arr[i].component == 'customer' || arr[i].component == 'contact' || arr[i].component == 'business' || arr[i].component == 'contract' || arr[i].component == 'department'){
			obj[arr[i].id] = arr[i].value?arr[i].value.id:''
		}else if(arr[i].component == 'switch'){
			if(typeof arr[i].value == 'string'){
				obj[arr[i].id] = ''
			}else{
				obj[arr[i].id] = arr[i].value ? 1 : 0
			}
		}else if(arr[i].component == 'label'){
			console.log(arr[i].value_arr,'值')
			let v_arr = arr[i].value_arr?arr[i].value_arr:[]
			let a = []
			v_arr.forEach(ele=>{
				a.push(ele.la_va)
			})
			obj[arr[i].id] = a.join(',')
		}else{
			obj[arr[i].id] = arr[i].value
		}
	}
	return obj
}

// 处理时间
function handleTime(num) {
	if(num >= 10){
		return num
	}else{
		return '0'+num
	}
}

//去重
function deWeight(arr) {
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[i].id == arr[j].id) {
				arr.splice(j, 1);
				j--;
			}
		}
	}
	return arr;
}

// 打开文档
function openCommonFile(data) {
	let arr = ['png','jpg','img','image','gif','jpeg']
	let name = data.name
	let suffix = name.substring(name.lastIndexOf('.')+1)
	if(!arr.includes(suffix)){
		// #ifdef MP-WEIXIN
		uni.downloadFile({
			url: data.file_path,
			success: (downres) => {
				uni.getSystemInfo({
					success:(res)=>{
						if(res.platform == 'windows' || res.platform == 'mac'){
							//pc端
							wx.saveFileToDisk({
								filePath:downres.tempFilePath,
								success:(saveSuc)=>{
									console.log(saveSuc)
								},
								fail:(saveFail)=>{
									console.log(saveFail)
								}
							})
						}else{
							downOrOpen(downres,data.name,data.file_path,suffix)
						}
					}
				})
			},
			fail: (errmsg) => {
				uni.hideLoading()
				console.log(errmsg,'===')
			}
		})
		// #endif
		// #ifdef H5
		window.open(data.file_path)
		// #endif
	}else{
		uni.previewImage({
			urls: [data.file_path],
			complete:(res)=>{
				console.log(res)
			}
		})
	}
}

function downOrOpen(downres,name,file,type) {
	uni.showLoading({title:'正在加载'})
	let manage = uni.getFileSystemManager()
	let urls = wx.env.USER_DATA_PATH + '/' + name
	manage.saveFile({		
		tempFilePath: downres.tempFilePath,
		filePath: urls,
		fileType: type,
		success: (saveData) => {
			uni.openDocument({
				filePath: saveData.savedFilePath,
				showMenu: true,
				fileType:type,
				success: (res) => {
					console.log(res,'成功打开')
					uni.hideLoading()
				},
				fail: (er) => {
					console.log(er,'打开失败')
					uni.hideLoading()
				}
			})
		}
	})
}

function openCommonImg(data,index) {
	let arr = []
	data.forEach(ele=>{
		arr.push(ele.file_path)
	})
	uni.previewImage({
		urls:arr,
		current:index
	})
}

//导出
export default {
    noMultipleClicks,      // 禁止多次点击
	handleSearchForm,      //处理搜索表单
	handleSureSearch,
	handleResetSearch,
	handleChangeSearchValue,    //搜索表单修改值时  处理form
	handleFormDefaultValue,    //查看详情时给form表单  赋值
	changeFormData,     //自定义的form表单 改变值 赋值
	checkCommonForm,    //提交的数据进行校验
	handleTime,
	deWeight,    //去重
	openCommonFile,   //打开文档/图片
	openCommonImg,   //打开图片
}