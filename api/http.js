export const BASE_URL = 'https://1924.mzth.cn/addons/qingdongams'
export const BASE_IMG_URL = 'https://1924.mzth.cn/assets/addons/qingdongams/mini'

export const myRequest = (url, data, flag=true, method,) => {
	if(flag){
		uni.showLoading({title:'加载中……'})
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			method: method || 'POST',
			data: data || {},
			timeout:6000,
			header: {
				'Content-Type': "application/json",
				'token': uni.getStorageSync('token')
			},
			success: (res) => {
				res = res.data
				if(flag) {
					uni.hideLoading()
				}
				if (res.code == 1) {
					resolve(res)
				} else if (res.code == 401) {
					uni.navigateTo({
						url: '/pages/login/index'
					})
				}else if(res.code == 402) {
					//未完善 用户 信息
					uni.showModal({
						title: '提示',
						content: res.msg,
						showCancel: false,
						success: (res) => {
							uni.navigateTo({
								url: '/pagesA/user/setPersonData'
							})
						}
					})
				}else if(res.code == 403){
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				}else if(res.code == 405) {
					resolve(res)
					uni.reLaunch({
						url:'/pagesA/user/examineing'
					})
				}else{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				}
			},
			fail: (err) => {
				uni.hideLoading()
				// #ifdef MP-ALIPAY
				err = err.data
				if(err.code == 401){
					uni.showToast({
						title: err.msg,
						icon: 'none'
					})
					setTimeout(()=>{
						uni.navigateTo({
							url: '/pages/login/index'
						})
					},2000)
				}
				// #endif
				// #ifndef MP-ALIPAY
				uni.showToast({
					title: '访问异常,请稍后访问',
					icon:'none'
				})
				// #endif
				reject(err)
			}
		})
	}).catch(err=>{console.log(err)})
}

