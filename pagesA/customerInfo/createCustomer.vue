<template>
	<view class="create_customer">
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="fllow_form">
			<view class="key">客户名称<span>*</span></view>
			<view class="form_right">
				<input type="text" class="nameinput" placeholder-style="color:#999;font-size:26rpx"
					:class="name ? 'valueActive' : ''" v-model="name" placeholder="输入客户名称" />
				<view class="theme" @click="checkName">查重</view>
			</view>
			<view class="busibox" @click="toQuery">
				<image :src="BASE_IMG_URL+'/index/qichacha.png'" class="busiimg"></image>
			</view>
			<view class="l_saoma" @click="toScanCode">
				<image :src="BASE_IMG_URL+'/index/customer_sm.png'" class="saomaimg"></image>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<form-item v-if="listForm" :listForm="listForm" :isNotRequired="isRequired"  @changeData="changeData"></form-item>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<form-item v-if="listForm" :listForm="listForm" :isNotRequired="isRequired"  @changeData="changeData"></form-item>
		<!-- #endif -->
		<!-- 审核信息 -->
		<examine-people title="提醒人" :flag="false" :list="remindPeople" @delItem="delItem"></examine-people>
		<!-- 团队 -->
		<view class="teamwarp">
			<view class="team_tit key" @click="toCirculate">团队：</view>
			<scroll-view scroll-x class="teambox">
				<view class="staffheader">
					<view class="staffbox" v-for="(item,index) in teamList" :key="index">
						<image :src="item.staff.img" class="staffimg"></image>
						<view class="staff_name">{{item.staff.name}}</view>
					</view>
					<span style="color:#008EFF" @click="toCirculate"> >> </span>
				</view>
			</scroll-view>
		</view>

		<view class="button" @click="$noMultipleClicks(subSave)">保存</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import {
		netSetForm,
		netAddkehu,
		netSelect,
		netPrevCustomer,
		netAreaList,
		netCheckName,
		netOcrIdentcard,
		uploadUrl,
		netAddressTransLng,
		netCluesDetail,
	} from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import {
		checkPhone
	} from '@/utils/util.js'
	import {
		BASE_URL,
		SIGN_NO,
		BASE_IMG_URL
	} from '@/api/http.js'
	import {
		commonFun
	} from '@/common/navigate.js'
	import {
		mapState
	} from 'vuex'

	export default {
		mixins: [commonFun],
		components: {
			formItem,
		},
		data() {
			return {
				BASE_IMG_URL: BASE_IMG_URL,
				noClick: true, //防止  重复点击
				name: '', //客户名称
				isQuery: false, //是否使用 企查查  查询企业信息
				//联系人
				remindPeople: [], //提醒谁看
				examineType: 'customer',
				listForm: null, //附加信息
				teamList: [], //团队成员
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed: mapState({
			customerInfo: state => state.customer.addCustomerInfo
		}),
		onLoad(options) {
			this.$store.commit('ADDCUSTOMERINFO', null)
			if (options.id) {
				this.parent_id = options.id
				this.parentDisabled = true
				//上级
				this.getDefaultKehulist()
			} else {
				this.parentDisabled = false
			}
			//从线索 转客
			if(options.leads_id) {
				this.leads_id = options.leads_id
			}
			this.listForm = null
			this.init()
			//获取当前团队的负责人
			let userinfo = uni.getStorageSync('userinfo')
			console.log(userinfo,'账号信息')
			this.teamList[0] = {
				staff: {
					id: userinfo.id,
					img: userinfo.img,
					name: userinfo.name,
					post: userinfo.post,
					mobile: userinfo.mobile
				},
				roles: 1,
				is_edit: 1
			}
		},
		onShow() {
			if (this.customerInfo && this.isQuery) {
				console.log('回填信息')
				this.name = this.customerInfo.name
			}
			//获取  默认需要提醒的人
			this.getDefaultRemind()
			//获取 团队
			if (uni.getStorageSync('teamList')) {
				this.teamList = uni.getStorageSync('teamList')
			}
		},
		onUnload() {
			uni.removeStorageSync('teamList')
		},
		methods: {
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			init() {
				if(this.leads_id){
					return Promise.all([this.getForm(),this.getclubInfo()])
				}else{
					return Promise.all([this.getForm()])
				}
			},
			//获取线索信息
			getclubInfo() {
				netCluesDetail({id:this.leads_id}).then(res=>{
					this.name = res.data.name
					//处理默认 客户附加信息
					this.listForm.forEach(item=>{
						item.value = res.data[item.id]
					})
					res.data.name='';
				})
			},
			//扫码识别 客户名片
			toScanCode() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						let data = res.tempFilePaths[0]
						uni.uploadFile({
							url: uploadUrl,
							name: 'file',
							header: {
								'token': uni.getStorageSync('token'),
								'sign-no': SIGN_NO
							},
							filePath: data,
							success: (res) => {
								let data = JSON.parse(res.data)
								this.ocrImg = data.data
								let params = {
									type_id: 14,
									file_id: data.data.id
								}
								netOcrIdentcard(params).then(res => {
									res = res.data
									this.handleValue(res)
								})
							},
							fail: (err) => {
								console.log(err)
							}
						})

					}
				})
			},
			//处理值
			handleValue(data) {
				for(let key in data) {
					if(key == 'name'){
						this.name = data[key].value
					}else{
						let arr = this.listForm
						arr.forEach((ele,index)=>{
							if(ele.id == key){
								ele.value = data[key].value
								this.$set(this.listForm,ele,index)
							}
						})
					}
				}
			},
			//////////////////////////////////////////////////////////////////////////////////////
			toCirculate() {
				uni.setStorageSync('teamList', this.teamList)
				uni.navigateTo({
					url: '/pagesA/customerInfo/team/index'
				})
			},
			//////////////////////////////////////////////////////////////////////////////////////
			// 选择成员
			moreClick() {
				uni.navigateTo({
					url: '/pages/selectMember/selectMember'
				})
			},
			getForm() {
				netSetForm({
					type: 'customer'
				}).then(res => {
					res = res.data.data
					res.forEach((item, index) => {
						if (item.id == 'name') {
							res.splice(index, 1)
						}
						item.value = ''
					})
					this.listForm = res
				})
			},
			changeData(name, value, obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			//姓名查重
			checkName() {
				let name = this.name
				if (!name) {
					uni.showToast({
						title: '请填写客户姓名',
						icon: 'none',
						duration: 2000
					})
					return
				}
				netCheckName({
					name
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					})

				})
			},
			//查询工商信息
			toQuery() {
				uni.navigateTo({
					url: '/pagesA/user/business_infomation/index?name=' + this.name + '&type=2',
					success: () => {
						this.isQuery = true
					}
				})
			},
			//保存并添加联系人
			subSaveOradd() {
				this.subSave(2)
			},
			//完成
			subSave(type) {
				let {
					name, //客户名称
					remindtype, //任务提醒
					remindPeople,
				} = this
				if (!name) {
					uni.showToast({
						title: '请填写客户名称',
						icon: 'none',
						duration: 2000
					})
					return
				}
				let params = {}
				// 附加信息
				let arr = []
				let customer = this.checkCommonForm(this.listForm)
				if(!customer){
					return
				}
				//团队
				let teamArr = []
				this.teamList.forEach(ele => {
					teamArr.push({
						roles: ele.roles,
						is_edit: ele.is_edit,
						...ele.staff
					})
				})
				customer = Object.assign({}, customer, {
					name,
					show_staff_id: teamArr,
				})
				if (remindPeople.length == 0) {
					uni.showToast({
						title: '请选择审核人',
						icon: 'none'
					})
					return
				}
				 //提醒谁看
				let remarr = []
				remindPeople.forEach(ele => {
					remarr.push(ele.id)
				})
				params.reminds_id = remarr.join(',')
				params.customer = customer
				if(this.leads_id){
					params.leads_id = this.leads_id
				}
				console.log(params)
				netAddkehu(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					})
					if(type == 2) {
						//去添加联系人
						uni.navigateTo({
							url:'/pagesA/customerInfo/contact/createContact?id='+res.data.id+'&pageType=2'
						})
					}else{
						uni.setStorageSync('addsuccess', true)
						setTimeout(() => {
							uni.removeStorageSync('teamList')
							uni.navigateBack({
								delta: 1
							})
						}, 2000)
					}
				})
			}
		}
	}
</script>

<style>
	radio {
		transform: scale(0.6);
	}
</style>
<style lang="scss" scoped>
	.botwarp{
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin:50rpx 0;
		.botbtn{
			height:80rpx;
			border-radius: 40rpx;
			font-size:24rpx;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			background:$uni-btn-bg-color;
		}
	}
	.l_saoma {
		width: 40rpx;
		height: 40rpx;
		margin-left: 15rpx;

		.saomaimg {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.teamwarp {
		padding: 24rpx 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background: #fff;

		.team_tit {
			font-size: 26rpx;
			margin-right: 24rpx;
		}

		.teambox {
			width: 500rpx;

			.staffheader {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.staffbox {
					margin-right: 24rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.staffimg {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
					}

					.staff_name {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
		}
	}

	.inp_warp {
		padding: 30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;

		.inp_title {
			font-size: 26rpx;
			color: #666666;
		}

		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.rightinput {
				text-align: right;
			}

			.change_btn {
				width: 94rpx;
				height: 44rpx;
				border-radius: 22rpx;
				font-size: 26rpx;
				text-align: center;
				color: #0287FF;
				border: 1rpx solid #0287FF;
				line-height: 42rpx;
				margin-right: 15rpx;
			}

			.activebtn {
				background: #0287FF;
				color: #fff;
			}

			.selebox {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-shrink: 0;

				.sele_quhao {
					font-size: 34rpx;
					color: $uni-text-color;
				}

				.xiaimg {
					width: 24rpx;
					height: 14rpx;
					margin-left: 10rpx;
				}
			}

		}
	}
	.valueActive {
		color: #333;
	}

	.affiliation {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding-bottom: 40rpx;

		.aff_head {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 30rpx;
		}

		.aff_con {
			display: flex;
			text-align: center;
			flex-wrap: wrap;

			.aff_item {
				width: 100rpx;
				margin-right: 15rpx;
				margin-bottom: 15rpx;

				image {
					margin-bottom: 15rpx;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}

			.affbox {
				position: relative;

				.delremind {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					position: absolute;
					right: -16rpx;
					top: -16rpx;
					background: rgba(0, 0, 0, 0.5);
					z-index: 2;
				}
			}

			.aff_last {
				image {
					margin-bottom: 15rpx;
					width: 80rpx;
					height: 50rpx;
				}
			}
		}
	}
	.fllow_file_li {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EDEDED;

		.fil_li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 14rpx;

			.fileimg {
				width: 20rpx;
				height: 20rpx;
			}

			.filename {
				font-size: 24rpx;
				color: #999999;
			}

			.closeimg {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	.create_customer {
		font-size: 28rpx;

		.mar_top {
			margin-top: 30rpx;
		}

		.fllow_form {
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			border-bottom: 1rpx solid #EDEDED;
			padding: 30rpx;

			.nameinput {
				width: 330rpx;
			}

			.form_right {
				display: flex;
				align-items: center;
				color: #999;
				text-align: right;
				align-items: center;

				.location {
					width: 300rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				image {
					width: 40rpx;
					height: 40rpx;
					margin: 28rpx 5rpx 0 0;
				}
			}

			.theme {
				color: $uni-text-color;
				margin-left: 15rpx;
			}

			.busibox {
				width: 42rpx;
				height: 48rpx;
				margin-left: 15rpx;

				.busiimg {
					width: 42rpx;
					height: 48rpx;
				}
			}

			.form_input {
				input {
					width: 300rpx;
					text-align: right;
					height: 100rpx;
					line-height: 100rpx;
					text-align: right;
					margin-right: 10rpx;
				}
			}
		}

		.fllow_area {
			background-color: #fff;
			padding: 30rpx;
			border-bottom: 1rpx solid #EDEDED;
			margin-bottom: 30rpx;

			.area_head {
				margin-bottom: 24rpx;
			}

			textarea {
				width: 620rpx;
				height: 260rpx;
				margin: 0 auto;
				background: rgba(202, 202, 202, 0.2);
				font-size: 26rpx;
				color: #999999;
				border-radius: 10rpx;
				padding: 24rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
