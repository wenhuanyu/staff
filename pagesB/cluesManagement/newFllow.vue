<template>
	<view class="new_fllow">
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key">跟进类型<span>*</span></view>
			<picker @change="changeFollow" :value="followIndex" :range="followList">
				<view class="form_right">
					<view :class="follow_type ? 'valueActive' : '' ">{{follow_type ? follow_type : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title key">下次跟进时间</view>
			<!-- #ifdef MP-WEIXIN || H5 || APP-PLUS-->
			<picker  @change="changeTime" mode="multiSelector" :range="dateTimeArray" :value="dateTime">
				<view class="form_right">
					<view :class="next_time ? 'valueActive' : '' ">{{next_time ? next_time : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<picker @change="changeAlipayTime" mode="date">
				<view class="form_right">
					<view :class="next_time ? 'valueActive' : '' ">{{next_time ? next_time : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
			<!-- #endif -->
		</view>
		<upload-img :flag="false" v-if="!isRequired" :imgList="imgList" @delImg="delImg" @uploadImg="uploadImg"></upload-img>
		<!-- <upload-file :fileList="fileList" v-if="!isRequired" @delFile="delFile" @uploadFile="uploadFile"></upload-file> -->
		
		<view class="fllow_area">
			<view class="area_head key">跟进内容<span>*</span></view>
			<textarea :value="content" :class="content ? 'valueActive' : '' " @input="changeContent" placeholder="勤跟进,多签单" placeholder-style="color:#999" />
		</view>
		<view class="inp_warp" v-if="relation_type == 1 && !isRequired">
			<view class="inp_title key">客户名称</view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="customerinfo ? 'valueActive' : '' ">{{customerinfo ? customerinfo.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp" v-if="relation_type == 1">
			<view class="inp_title key">客户状态<span>*</span></view>
			<picker @change="changeStatus" :value="statusIndex" :range="statusList">
				<view class="form_right">
					<view :class="follow ? 'valueActive' : '' ">{{follow ? follow : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<examine-people :flag="false" title="提醒人" :list="remindPeople" @delItem="delItem"></examine-people>
		<view class="button" @click="$noMultipleClicks(saveFollow)">
			保存
		</view>
		<view class="botsec"></view>
		
	</view>
</template>

<script>
	import {
		netSelect,
		netPrevCustomer,
		netLianxiren,
		netAddFollowRecords,
	} from '@/api/api.js'
	import {
		BASE_IMG_URL
	} from '@/api/http.js'
	import {
		dateTimePicker,
		getMonthDay
	} from '@/utils/dateTimePicker.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	export default {
		mixins: [commonFun],
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				checked: true,
				uploadShow: false,
				// #ifdef MP-WEIXIN
				uploadActions: [
					{
						id: 1,
						text: '拍照',
						color: '#008EFF'
					},
					{
						id: 2,
						text: '从相册中选择',
						color: '#008EFF'
					},
					{
						id: 3,
						text: '上传文件',
						color: '#008EFF'
					}
				],
				// #endif
				// #ifdef H5 || APP-PLUS
				uploadActions: [
					{
						id: 1,
						text: '拍照',
						color: '#008EFF'
					},
					{
						id: 2,
						text: '从相册中选择',
						color: '#008EFF'
					}
				],
				// #endif
				followList: [], //跟进类型
				followIndex: null,
				statusList: [], //客户状态
				statusIndex: null,

				//上传附件
				imgList: [],
				fileList: [],
				follow_type: '', //跟进类型
				dateTime: null,
				dateTimeArray: null,
				dateArr: null,

				follow_time: '', //跟进时间
				next_time: '', //下次跟进时间
				content: '', //跟进内容
				relation_id: '', //关联id
				relation_type: '', //1客户 2联系人 3合同 4线索 5商机
				relationName: '',
				follow: '', //客户状态
				remindPeople: [], //提醒谁看
				examineType:'record',
				is_event: false, //是否创建 跟进任务
				start_time: '', //跟进时间
				title: '', //跟进内容
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
		}),
		onLoad(options) {
			this.relation_id = options.id
			this.relation_type = options.type
			this.initTime()
			//选择 列表
			this.getSelectList()
		},
		onShow() {
			this.getDefaultRemind()
		},
		methods: {
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			getSelectList() {
				netSelect().then(res => {
					this.followList = res.data.other['跟进类型']
					this.statusList = res.data.customer['客户状态']
				})
			},
			initTime() {
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let obj = dateTimePicker()
				// 精确到分的处理，将数组的秒去掉
				let lastArray = obj.dateTimeArray.pop();
				let lastTime = obj.dateTime.pop();
				let lastDate = obj.dateArray.pop()

				this.dateTimeArray = obj.dateTimeArray
				this.dateTime = obj.dateTime
				this.dateArr = obj.dateArray
			},
			setDefaultKehu() {
				let id = this.relation_id
				this.kehu.forEach((ele, index) => {
					if (ele.id == id) {
						this.relationName = ele.name
						this.kehuIndex = index
					}
				})
			},
			//跟进类型
			changeFollow(e) {
				this.followIndex = e.detail.value
				this.follow_type = this.followList[e.detail.value]
			},
			//跟进时间
			changeTime(e) {
				let arr = e.detail.value
				let str = this.handleTime(arr)
				this.next_time = str
			},
			changeAlipayTime(e) {
				this.next_time = e.detail.value
			},
			handleTime(arr) {
				let year = this.dateArr[0][arr[0]]
				let month = this.dateArr[1][arr[1]]
				let day = this.dateArr[2][arr[2]]
				let hour = this.dateArr[3][arr[3]]
				let minu = this.dateArr[4][arr[4]]
				let str = year + '-' + month + '-' + day +' '+hour+':'+minu
				return str
			},
			change() {
				this.checked = !this.checked;
			},
			//跟进内容
			changeContent(e) {
				this.content = e.detail.value
			},
			//客户状态
			changeStatus(e) {
				this.statusIndex = e.detail.value
				this.follow = this.statusList[e.detail.value]
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//上传附件
			uploadFile(data) {
				this.fileList.push(data)
			},
			delFile(data) {
				this.fileList.splice(index, 1)
			},
			saveFollow() {
				console.log('保存')
				let {
					imgList,
					fileList,
					follow_type, //跟进类型
					next_time, //跟进时间
					content, //跟进内容
					relation_type,
					relation_id,
					follow, //客户状态
					remindPeople, //提醒谁看
				} = this

				if (!follow_type) {
					uni.showToast({
						title: '请选择跟进类型',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (!content) {
					uni.showToast({
						title: '请填写跟进内容',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (relation_type == 1 && !this.customerinfo) {
					uni.showToast({
						title: '请选择客户名',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (relation_type == 1 && !follow) {
					uni.showToast({
						title: '请选择客户状态',
						icon: 'none',
						duration: 2000
					})
					return
				}
				
				let files = '' //上传附件
				let arr = []
				imgList.forEach(ele => {
					arr.push(ele.id)
				})
				fileList.forEach(ele => {
					arr.push(ele.id)
				})
				console.log(imgList, fileList, '文件')
				files = arr.join(',')
				let remindsid = '' //提醒谁看
				let remarr = []
				remindPeople.forEach(ele => {
					remarr.push(ele.id)
				})
				remindsid = remarr.join(',')
				let params = {}
				console.log(relation_type, '类型')
				if (relation_type == 1 || relation_type == 3) {
					//客户   合同
					params = {
						files,
						follow_type,
						next_time,
						content,
						relation_id,
						relation_type,
						follow,
						reminds_id: remindsid,
					}
				} else {
					//联系人
					params = {
						files,
						follow_type,
						next_time,
						content,
						relation_id,
						relation_type,
						reminds_id: remindsid,
					}
				}
				netAddFollowRecords(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})
			}
		}
	}
</script>

<style lang="scss">
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
		}
	
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
	.valueActive{
		color:#333;
	}
	.new_fllow {
		font-size: 28rpx;
		.fllow_area {
			background-color: #fff;
			padding:30rpx;
			margin-bottom: 30rpx;
			.area_head {
				height: 100rpx;
				line-height: 100rpx;
				text {
					color: #f00;
				}
			}
			textarea {
				width: 620rpx;
				height: 260rpx;
				margin:0 auto;
				background:rgba(202, 202, 202, 0.2);
				font-size:26rpx;
				color:#999999;
				border-radius: 20rpx;
				padding:24rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
