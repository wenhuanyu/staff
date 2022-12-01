<template>
	<view>
		<view class="mapbox">
			<map name="" style="width:750rpx;height:400rpx;" id="mapself" :latitude="latitude" :longitude="longitude" :markers="markers"></map>
		</view>
		<view class="locainfo">
			<view class="localeft">
				<image :src="BASE_IMG_URL+'/index/local.png'" class="dingwei" ></image>
				<view class="text">{{address}}</view>
			</view>
		</view>
		<view style="background:#fff;">
			<view class="addcost" @click="toAddCost">添加费用</view>
			<view class="costlist" v-if="costList.length != 0">
				<view class="costli" v-for="(item,index) in costList" :key="index">
					<view class="costtop">
						<view class="costleft" @tap.stop="delCost(index)">
							<view class="iconfont icon-jian"></view>
							{{item.submit_date}}
						</view>
						<view class="cost_status">{{item.check_status_text}}</view>
					</view>
					<view class="cost_rema">备注：{{item.remark?item.remark:''}}</view>
					<view class="cost_child" @tap.stop="lookDetail(index)">
						<view class="child" v-for="(eleitem,eleindex) in item.consume_detail" :key="eleindex" >
							<view class="child_fir">
								<view class="ch_num">({{Number(eleindex) + 1}})</view>
								<view class="ch_name">{{eleitem.consume_type}}</view>
								<view class="ch_time">{{eleitem.consume_date}}</view>
							</view>
							<view class="child_fir">
								<view class="ch_num"></view>
								<view class="ch_name">金额：{{eleitem.consume_money}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="totalwarp">合计：{{totalMoney}}</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">客户:</view>
				<view class="form_right">
					<view :class="customer_name ? 'valueActive' : '' " >
						{{customer_name ? customer_name : '点击选择'}}</view>
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</view>
			<view class="fllow_area">
				<view class="fllo_list">
					<view class="area_head">客户需求:</view>
					<view class="list_text" @click="toRemarksTemp">选择模板</view>
				</view>
				<textarea v-model="needs" maxlength="-1" :class="needs ? 'valueActive' : '' " placeholder="请填写客户需求"
					placeholder-style="color:#999" />
			</view>
			<view class="fllow_form">
				<view class="key">达到目的<span>*</span></view>
				<view class="form_right" @click="toSelectAchieve">
					<view>请选择</view>
					<view class="iconfont icon-you"></view>
				</view>
			</view>
			<view class="que_list" v-if="achievegoal.length != 0">
				<view class="que_li" v-for="(item,index) in achievegoal" :key="index">
					<view class="iconfont icon-jian" @click="delAchieve(index)"></view>
					<view class="que_titq">{{item.field}}</view>
				</view>
			</view>
			<view class="fllow_area">
				<view class="area_head" style="margin:20rpx 0;">备注:</view>
				<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="备注"
					placeholder-style="color:#999" />
			</view>
			<view class="fllow_form">
				<view class="key">下一行程<span>*</span></view>
				<picker @change="changeTrip" :range="triplist" :value="tripIndex">
					<view class="form_right">
						<view :class="{'valueActive':triplist[tripIndex]}">{{triplist[tripIndex] ? triplist[tripIndex] : '请选择下一行程'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</picker>
			</view>
			<!-- 上传图片 -->
			<upload-img :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
			
		</view>
		<view style="height:120rpx"></view>
		<view class="savebox">
			<view class="button" @click="$noMultipleClicks(toAdd)">保存</view>
		</view>
	</view>
</template>

<script>
	import { SIGN_NO, BASE_URL, BASE_IMG_URL } from '@/api/http.js'
	import { netAddSignin, netCostList, netDelcost, netLngTransAddress } from '@/api/api.js'
	import { mapState } from 'vuex'
	
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				noClick: true, //防止  重复点击
				longitude: null,
				latitude: null,
				markers: [],
				address: '',
				imgList: [],
				customer_name:'',  //客户名称
				customer_id:'',   //客户id

				location: '', //地址 
				lng: '',
				lat: '',
				files: '',
				content: '',
				event_id:'',   //任务id
				event_process:3,    //1 开始 2 到达 3 拜访完成  4 返程签到
				resultType:[
					{id:1,name:'是'},
					{id:2,name:'否'}
				],
				resultIndex:0,
				//行程
				triplist:['返程','拜访下一家'],
				tripIndex:0,
				//出行方式
				toolArray:['公司车','私家车','公交车','出租车','飞机','火车','其他'],  //工具
				toolIndex:0,
				name:'',   //任务 预期目的
				car_type:'',   //出行方式
				start_mileage:'',   //起始公里数
				
				costid:'',    //新建的费用
				costList:[],
				needs:'',   //客户需求
				totalMoney:0
			}
		},
		onLoad(options) {
			uni.setStorageSync('costid',[])    //清空费用
			this.$store.commit('SETACHIEVEGOAL',[])   //清空达到目标
			
			this.event_process = options.type
			this.event_id = options.eventid
			this.customer_name = options.cusname
			this.customer_id = options.customerid
			
			if(this.event_process == 3) {
				uni.setNavigationBarTitle({
					title:'完成任务'
				})
			}else if(this.event_process == 4) {
				uni.setNavigationBarTitle({
					title:'返程签到'
				})
			}
			
			this.name = options.name
			//获取位置
			this.getAddressinfo()
			
		},
		onShow() {
			this.costid = uni.getStorageSync('costid') ? uni.getStorageSync('costid') : null
			if(this.costid && this.costid.length != 0){
				//获取费用明细
				this.getCostDetail()
			}
			if(this.event_need) {
				this.needs = this.needs+this.event_need
			}
			
		},
		onUnload() {
			this.$store.commit('EVENT_NEED','')
			uni.removeStorageSync('costid')
		},
		computed:mapState({
			achievegoal: state => state.customer.achievegoal,
			event_need: state => state.template.event_need
		}),
		methods: {
			//选择客户需求 模板
			toRemarksTemp() {
				this.$store.commit('EVENT_NEED','')
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/needTemplate'
				})
			},
			//获取费用明细
			getCostDetail(){
				netCostList({ids:this.costid.join(','),type:3}).then(res=>{
					this.costList = res.data.data
					//计算费用合计
					this.handleMoney()
				})
			},
			//删除费用
			delCost(index) {
				let obj = this.costList[index]
				let id = obj.id
				//删除数组中的某一个元素
				this.handleDelarr(id)
				netDelcost({id:obj.id}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				})
				//计算费用合计
				this.handleMoney()
			},
			handleDelarr(id) {
				let arr = []
				let index
				this.costList.forEach((ele,index)=>{
					if(ele.id == id){
						index = index
					}
				})
				this.costList.splice(index,1)
				this.costList.forEach(ele=>{
					arr.push(ele.id)
				})
				uni.setStorageSync('costid',arr)
			},
			handleMoney() {
				let money = 0
				this.costList.forEach(ele=>{
					money += Number(ele.money)
				})
				this.totalMoney = money
			},
			//查看费详情
			lookDetail(index) {
				this.$store.commit('EVENT_NEED','')
				let obj = this.costList[index]
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost?id='+obj.id+'&customerid='+this.customer_id+'&relationid='+this.event_id
				})
			},
			toSelectAchieve() {
				this.$store.commit('EVENT_NEED','')
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/achieve_goal'
				})
			},
			//删除 达到目的
			delAchieve(index) {
				this.achievegoal.splice(index,1)
			},
			//下一行程
			changeTrip(e) {
				this.tripIndex = e.detail.value
			},
			//选择出行方式
			changeTool(e) {
				this.toolIndex = e.detail.value
			},
			getAddressinfo() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						console.log(res, '获取位置')
						this.longitude = res.longitude
						this.latitude = res.latitude
						this.markers = [{
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../../static/index/weizhi.png',
							width: 30,
							height: 30
						}]
						//地址逆解析
						let params = {
							lat: res.latitude,
							lng: res.longitude
						}
						netLngTransAddress(params).then(data=>{
							data = data.data.result
							this.address = data.address
						})
					},
					fail: (err) => {
						console.log(err, '错误')
						uni.showToast({
							title:'请允许使用位置信息',
							icon:'none'
						})
					}
				})
			},
			againRepos() {
				this.address = ''
				this.getAddressinfo()
			},
			radioChange(e) {
				this.resultIndex = e.detail.value
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//保存
			toAdd() {
				let {
					longitude,
					latitude,
					address,
					imgList,
					content,
					event_id,
					event_process,
				} = this
				if(imgList.length == 0) {
					uni.showToast({
						title: '请上传附件',
						icon: 'none'
					})
					return
				}
				if(event_process == 3 && this.achievegoal.length == 0) {
					uni.showToast({
						title:'请选择达到目的',
						icon:'none'
					})
					return
				}
				let visitarr = []
				this.achievegoal.forEach(ele=>{
					visitarr.push(ele.field)
				})
				
				let files = ''
				let arr = []
				imgList.forEach(item => {
					arr.push(item.id)
				})
				files = arr.join(',')
				let params = {
					location: address,
					lng: longitude,
					lat: latitude,
					file_ids:files,
					content,
					event_id,
					event_process,
					last_event:this.triplist[this.tripIndex],
					achieve_purpose:visitarr.join(','),
					needs:this.needs
				}
				netAddSignin(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})
			},
			//添加费用
			toAddCost() {
				this.$store.commit('EVENT_NEED','')
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost?customerid='+this.customer_id+'&relationid='+this.event_id+'&event_type=event'
				})
			}
		}
	}
</script>
<style>
	radio{
		transform: scale(0.6);
	}
</style>

<style lang="scss" scoped>
	.fllo_list{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom:15rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
			color:#666;
		}
		.list_text{
			font-size:26rpx;
			color:$uni-text-color;
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
	}
	.que_list{
		border-bottom: 1rpx solid #EAEAEA;
		padding:0 45rpx 0 50rpx;
		.que_li{
			background-color: #fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:24rpx 0;
			border-bottom: 1rpx solid #EAEAEA;
			&:last-child{
				border-bottom:0;
			}
			.icon-jian{
				font-size:40rpx;
				color:#ff7800;
				margin-right:30rpx;
			}
			.que_title{
				font-size:24rpx;
				color:#333;
			}
		}
	}
	.valueActive {
		color: #333;
	}
	.mapbox {
		width: 750rpx;
		height: 400rpx;
	}

	.locainfo {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;

		.localeft {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.dingwei {
				width: 30rpx;
				height: 30rpx;
				margin-right: 15rpx;
			}

			.text {
				font-size: 26rpx;
				color: #333;
			}
		}

		.locaright {
			font-size: 26rpx;
			color: $uni-text-color;
		}
	}
	
	.addcost{
		width:200rpx;
		height:60rpx;
		background:#bcbcbc;
		border-radius: 10rpx;
		font-size:26rpx;
		color:#fff;
		line-height: 60rpx;
		text-align: center;
		margin-bottom:24rpx;
		margin-left:34rpx;
	}
	//费用明细
	.costlist{
		padding:24rpx 40rpx 24rpx 50rpx;
		border-bottom: 1rpx solid #CCC;
		.costli{
			border-bottom:10rpx solid #f5f5f5;
			padding-top:15rpx;
			&:last-child{
				border-bottom:0;
			}
			.costtop{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.costleft{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:24rpx;
					color:#666;
					.iconfont{
						font-size:35rpx;
						color:#ff7800;
						margin-right:24rpx;
					}
				}
				.cost_time{
					font-size:24rpx;
					color:#666;
				}
				.cost_status{
					font-size:26rpx;
					color:$uni-text-color;
				}
			}
			.cost_rema{
				margin-top:24rpx;
				font-size:24rpx;
				padding:0 24rpx 0 30rpx;
				color:#333;
			}
			.cost_child{
				padding:24rpx;
				.child{
					border-bottom:1rpx solid #f5f5f5;
					padding-bottom:15rpx;
					padding-top:15rpx;
					&:last-child{
						border-bottom:0;
					}
					.child_fir{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.ch_num{
							width:50rpx;
						}
						.ch_name{
							width:200rpx;
							text-align: left;
							font-size:26rpx;
							color:#333;
						}
						.ch_time{
							width:200rpx;
							text-align: left;
							font-size:26rpx;
							color:#666;
						}
					}
					
				}
			}
		}
		.totalwarp{
			text-align: right;
			font-size:26rpx;
			color:$uni-text-color;
			margin:24rpx 0;
			padding:0 45rpx;
		}
	}
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #CCC;

		.inp_title {
			font-size: 26rpx;
			color: #666;
		}

		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			input{
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.radiobox{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}

	.fllow_area {
		background: #fff;
		box-sizing: border-box;
		padding:30rpx;
		border-bottom:1rpx solid #f5f5f5;
		.area_head {
			margin-bottom: 10rpx;
			color:#666;
		}
		textarea {
			width: 590rpx;
			background: #f5f5f5;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 0 auto;
		}
	}

	.savebox {
		width: 750rpx;
		height: 120rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1rpx solid #CCC;
		z-index: 2;
	}

	.imglist {
		padding: 24rpx 50rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		.imgbox {
			width: 180rpx;
			height: 180rpx;
			margin-right: 50rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EAEAEA;
			&:nth-child(3n){
				margin-right:0;
			}
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
				width: 180rpx;
				height: 180rpx;
			}
		}
	}
</style>
