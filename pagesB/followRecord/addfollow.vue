<template>
	<view class="">
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="fllow_form_a">
			<view style="color:#333">关联类型</view>
			<view class="form_right">
				<radio-group @change="changeRelation" class="labellist">
					<label class="" v-for="(item, index) in relation_List" :key="index" class="labelbox">
						<radio color="#008EFF" :value="item.id" :checked="item.id == relation_type" />{{item.name}}
					</label>
				</radio-group>
			</view>
		</view>
		<view class="inp_warp" v-if="relationName">
			<view class="inp_title key">{{relationName}}<span>*</span></view>
			<view class="form_right" @click="toSelectGuanglian">
				<view :class="guanlianName ? 'valueActive' : '' ">{{guanlianName ? guanlianName : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp" v-if="relation_type == 1">
			<view class="inp_title key">客户状态<span>*</span></view>
			<picker @change="changeStatus" :value="statusIndex" :range="statusList">
				<view class="form_right">
					<view :class="statusList[statusIndex] ? 'valueActive' : '' ">{{statusList[statusIndex] ? statusList[statusIndex] : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">跟进类型<span>*</span></view>
			<picker @change="changeFollow" :value="followIndex" :range="followList">
				<view class="form_right">
					<view :class="followList[followIndex] ? 'valueActive' : '' ">{{followList[followIndex] ? followList[followIndex] : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title key">下次跟进时间</view>
			<!-- #ifdef MP-WEIXIN || H5 || APP-PLUS-->
			<picker @change="changeTime" mode="multiSelector" :range="dateTimeArray" :value="dateTime">
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
		<!-- 图片 -->
		<upload-img :flag="false" v-if="!isRequired" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<!-- 附件 -->
		<upload-file :fileList="fileList" v-if="!isRequired" @delFile="delFile" @uploadFile="uploadFile"></upload-file>
		
		<view class="fllow_area">
			<view class="area_head key">跟进内容<span>*</span></view>
			<textarea v-model="content" :class="content ? 'valueActive' : '' "placeholder="勤跟进,多签单" placeholder-style="color:#999" />
		</view>
		<!-- 审核信息 -->
		<examine-people title="提醒谁看" :flag="false" :list="remindPeople" @delItem="delItem"></examine-people>
		<view class="button" @click="$noMultipleClicks(toAdd)">
			保存
		</view>
		<view class="botsec"></view>
		<!-- 选择联系人 -->
		<select-link ref="linkChild" @sureContact="linkInfo"></select-link>
		<!-- 选择合同 -->
		<select-contract ref="contractChild" @contractInfo="contractInfo"></select-contract>
		<!-- 选择线索 -->
		<select-clue ref="clueChild" @clueInfo="clueInfo"></select-clue>
		<!-- 关联商机 -->
		<select-business ref="businessChild" @sureBusiness="sureBusiness"></select-business>
	</view>
</template>
<script>
	import {
		netSelect,
		netAddFollowRecords,
		uploadUrl,
		netLngTransAddress
	} from '@/api/api.js'
	import {
		dateTimePicker,
		getMonthDay
	} from '@/utils/dateTimePicker.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate'
	import selectLink from '@/components/select_contact.vue'
	import selectContract from '@/components/selectContract.vue'
	import selectClue from '@/components/selectClue.vue'
	import selectBusiness from '@/components/selectBusiness.vue'
	
	export default{
		mixins: [commonFun],
		components:{
			selectLink,
			selectContract,
			selectClue,
			selectBusiness
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				relation_List:[
					{ id:'1', name:'客户'},
					{ id:'5', name:'商机'},
					{ id:'2', name:'联系人'},
					{ id:'3', name:'合同'},
					{ id:'4', name:'线索'}
				],   //关联类型
				relation_type:'',
				relationName:'',
				relation_id:'',
				guanlianName:'',
				//跟进类型
				followList: [], 
				followIndex: null,
				next_time:'',  //下次跟进时间
				//上传附件
				imgList: [],
				fileList: [],
				content:'',  //跟进内容
				remindPeople: [], //提醒谁看
				examineType:'record',
				dateTime: null,
				dateTimeArray: null,
				dateArr: null,
				statusList: [], //客户状态
				statusIndex: null,
				//用户位置
				lng:'',
				lat:'',
				address:'',
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
		}),
		watch:{
			customerObj(newval,oldval){
				if(newval){
					this.guanlianName = newval.name
					this.relation_id = newval.id
				}
			}
		},
		onLoad() {
			this.getSelectList()
			this.initTime()
			//获取位置
			this.getLocation()
		},
		onShow() {
			this.getDefaultRemind()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					altitude: true,
					isHighAccuracy: true,
					success:(data)=>{
						this.lng = data.longitude
						this.lat = data.latitude
						this.getKey()
					},
					fail: (err) => {
						uni.showToast({
							title:'次数频繁，请稍后再试',
							icon:'none'
						})
					}
				})
			},
			//地址逆解析
			getKey() {
				let params = {
					lat: this.lat,
					lng: this.lng
				}
				netLngTransAddress(params).then(data=>{
					data = data.data.result
					this.address = data.address
				})
			},
			getSelectList() {
				netSelect().then(res => {
					this.followList = res.data.other['跟进类型']
					this.statusList = res.data.customer['客户状态']
				})
			},
			changeRelation(e){
				this.relation_type = e.detail.value
				this.guanlianName = ''
				this.relation_id = ''
				if(this.relation_type == 1) {
					//客户
					this.relationName = '关联客户'
				}else if(this.relation_type == 2) {
					//联系人
					this.relationName = '关联联系人'
				}else if(this.relation_type == 3) {
					//合同
					this.relationName = '关联合同'
				}else if(this.relation_type == 4){
					//线索
					this.relationName = '关联线索'
				}else if(this.relation_type == 5){
					//线索
					this.relationName = '关联商机'
				}
			},
			toSelectGuanglian() {
				if(this.relation_type == 1) {
					this.toSelectCustomer()
				}else if(this.relation_type == 2){
					this.toSelectLink()
				}else if(this.relation_type == 3){
					this.toSelectContract()
				}else if(this.relation_type == 4){
					this.toSelectClue()
				}else {
					this.toSelectBusiness()
				}
			},
			getCustomerinfo(obj) {
				this.relation_id = obj.id
				this.guanlianName = obj.name
			},
			//选择关联联系人
			toSelectLink() {
				this.$refs.linkChild.init()
			},
			linkInfo(obj) {
				this.relation_id = obj.id
				this.guanlianName = obj.name
			},
			//选择合同
			toSelectContract() {
				this.$refs.contractChild.init()
			},
			contractInfo(obj) {
				this.relation_id = obj.id
				this.guanlianName = obj.name
			},
			//选择关联线索
			toSelectClue() {
				this.$refs.clueChild.init()
			},
			clueInfo(obj) {
				this.relation_id = obj.id
				this.guanlianName = obj.name
			},
			//选择关联 商机
			toSelectBusiness() {
				this.$refs.businessChild.init()
			},
			sureBusiness(obj) {
				this.relation_id = obj.id
				this.guanlianName = obj.name
			},
			//跟进类型
			changeFollow(e) {
				this.followIndex = e.detail.value
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
			//客户状态
			changeStatus(e) {
				this.statusIndex = e.detail.value
			},
			toAdd() {
				if(!this.relation_type){
					uni.showToast({
						title:'请选择关联类型',
						icon:'none'
					})
					return
				}
				if(!this.relation_id){
					uni.showToast({
						title:'请选择'+this.relationName,
						icon:'none'
					})
					return
				}
				if(this.relation_type == 1 && !this.statusList[this.statusIndex]){
					uni.showToast({
						title:'请选择客户状态',
						icon:'none'
					})
					return
				}
				if(!this.followList[this.followIndex]){
					uni.showToast({
						title:'请选择跟进类型',
						icon:'none'
					})
					return
				}
				if(!this.content){
					uni.showToast({
						title:'请填写跟进内容',
						icon:'none'
					})
					return
				}
				let files = '' //上传附件
				let arr = []
				this.imgList.forEach(ele => {
					arr.push(ele.id)
				})
				this.fileList.forEach(ele => {
					arr.push(ele.id)
				})
				let remarr = []
				this.remindPeople.forEach(ele => {
					remarr.push(ele.id)
				})
				let params = {
					files:arr.join(','),
					reminds_id:remarr.join(','),
					follow_type:this.followList[this.followIndex],
					next_time:this.next_time,
					content:this.content,
					relation_id:this.relation_id,
					relation_type:this.relation_type,
					lng:this.lng,
					lat:this.lat,
					location:this.address
				}
				if(this.relation_type == 1) {
					params.follow = this.statusList[this.statusIndex]
				}
				netAddFollowRecords(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none',
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
	.labellist{
		display: flex;
		justify-content: flex-start;
		.labelbox{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-shrink: 0;
			font-size:24rpx;
		}
	}
</style>
<style lang="scss" scoped>
	radio{
		transform: scale(0.6);
	}
	.fllow_form_a{
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 40rpx 30rpx 47rpx;
		font-size: 32rpx;
		color: #999999;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			margin-top:24rpx;
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
	}
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
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EAEAEA;
	
			.delimg {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				position: absolute;
				right: -16rpx;
				top: -16rpx;
				background: rgba(0, 0, 0, 0.5);
				z-index: 2;
			}
	
			.selfimg {
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
	.fllow_file_li {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		.fil_li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 14rpx;
			padding-top:15rpx;
			border-bottom:1rpx solid #f5f5f5;
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
	.fllow_area {
		background-color: #fff;
		padding: 0 30rpx 30rpx;
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
</style>