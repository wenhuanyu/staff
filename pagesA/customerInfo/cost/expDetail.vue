<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">费用明细</view>
		</view>
		<view class="inp_warp">
			<view class="cost_warp">
				<view class="cost_li" v-for="(item,index) in freeList" :key="index">
					<view class="li_left">
						<view class="iconfont icon-jian" @tap.stop="delCost(index)"></view>
					</view>
					<view class="cost_info" @tap.stop="toAgainedit(index)">
						<view class="info_title">
							<view class="name">{{item.consume_type}}</view>
							<view class="time">{{item.consume_date}}</view>
						</view>
						<view class="li_warp">
							<view class="li_warp_left">
							</view>
							<view class="li_warp_left">
								<span>金额:</span>{{item.consume_money}}
							</view>
						</view>
					</view>
				</view>
				<view class="total_warp">
					<view class="total_left">
						<view class="total_h">合计</view>
						<view class="total_p">金额：<span>￥{{totalMoney}}</span></view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="cost_li" style="display: flex;justify-content: flex-start;align-items: center;background:#fff;padding:24rpx 0 24rpx 30rpx;">
			<view class="key" style="font-size:26rpx;margin-right:24rpx">费用类型</view>
			<view class="cost_type">
				<picker @change="changeArray" :value="arrayIndex" :range="array">
					<view class="uni-input">
						{{array[arrayIndex] ? array[arrayIndex] : '请选择'}}
						<image :src="BASE_IMG_URL+'/index/green-small-cancel.png'" class="selexiaimg" ></image>
					</view>
				</picker>
			</view>
		</view>
		<view v-if="array[arrayIndex] == '交通费'">
			<view class="inp_warp">
				<view class="inp_title key">工具 <span>*</span></view>
				<picker @change="changeTool" :range="toolArray" :value="toolIndex">
					<view class="form_right">
						<view :class="toolArray[toolIndex] ? 'valueActive' : '' ">
							{{toolArray[toolIndex] ? toolArray[toolIndex] : '点击选择'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</picker>
			</view>
			<view v-if="toolArray[toolIndex] == '公司车' || toolArray[toolIndex] == '私家车'">
				<view class="inp_warp">
					<view class="inp_title">车牌号历史记录</view>
				</view>
				<view class="que_list" v-if="numberList.length != 0">
					<view class="que_li" v-for="(item,index) in numberList" :key="index" @click="selectNumber(item)">
						<radio value="item" color="#ff7800" :checked="car_number == item" />
						<view class="que_titq">{{item}}</view>
					</view>
				</view>
				
				<view class="inp_warp">
					<view class="inp_title key">车牌号<span>*</span></view>
					<view class="form_right">
						<input type="text" v-model="car_number" placeholder="请输入车牌号(需上传车牌照)" placeholder-style="color:#999;font-size:24rpx" class="rightinput" :class="car_number ? 'valueActive' : '' ">
						<image :src="BASE_IMG_URL+'/index/upload_car.png'" class="paizhaoimg"  @click="uploadChepai"></image>
					</view>
				</view>
				
				<view class="inp_warp">
					<view class="inp_title key">起始公里数<span>*</span></view>
					<view class="form_right">
						<input type="digit" v-model="start_mileage" @blur="handleMileage" placeholder-style="color:#999;font-size:24rpx" placeholder="请输入起始公里数" class="rightinput" :class="start_mileage ? 'valueActive' : '' ">
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">结束公里数<span>*</span></view>
					<view class="form_right">
						<input type="digit" v-model="end_mileage" @blur="handleMileage" placeholder-style="color:#999;font-size:24rpx" placeholder="请输入结束公里数" class="rightinput" :class="end_mileage ? 'valueActive' : '' ">
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">公里数<span>*</span></view>
					<view class="form_right">
						<input type="digit" v-model="mileage" @blur="changeNumber" placeholder-style="color:#999;font-size:24rpx" placeholder="请输入公里数" class="rightinput" :class="mileage ? 'valueActive' : '' ">
					</view>
				</view>
			</view>
			
		</view>
		<view class="inp_warp">
			<view class="inp_title key">发生日期<span>*</span></view>
			<picker @change="changeConsumeTime" mode="date">
				<view class="form_right">
					<view :class="consume_date ? 'valueActive' : '' ">
						{{consume_date ? consume_date : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">金额<span>*</span></view>
			<view class="form_right">
				<input type="digit" v-model="consume_money" placeholder="请输入报销金额" placeholder-style="color:#999;font-size:24rpx" class="rightinput" :class="consume_money ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="remark" maxlength="-1" :class="remark ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<!-- #ifndef H5 -->
		<view class="inp_warp" style="margin-top:0;">
			<view class="inp_title key">附件: </view>
			<view class="form_right" @click="uploadFile">
				<view>点击上传</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="doc_item" v-for="(item,index) in fileList" :key="index">
			<image :src="BASE_IMG_URL+'/index/file-clip.png'" class="remarkimg" ></image>
			<view class="doc_name" @click="toLookFile(item)">{{item.name}}</view>
			<image :src="BASE_IMG_URL+'/index/delete.png'" @click="delFile(item.id,index)" class="deleimg" ></image>
		</view>
		<!-- #endif -->
		
		<upload-img title="消费凭证" :imgList="imgList" @delImg="delImg" @uploadImg="uploadImg"></upload-img>
		
		<view class="bot_warp">
			<view class="botbtn" @click="$noMultipleClicks(saveCost)">继续添加</view>
			<view class="botbtn" @click="saveCost(true)">确定</view>
			<view class="botbtn" @click="toBack">返回</view>
		</view>
		<view style="height:50rpx"></view>
		
	</view>
</template>

<script>
	import { netComputedMoney, netOcrDistinguish, netEndKilometers, 
	netHistoryHumber, uploadUrl } from '@/api/api.js'
	import { BASE_IMG_URL, SIGN_NO, BASE_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,    //防止  重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				array:['交通费','差旅费','电话费','交际费','办公开销','采购费','广告宣传费','其他费用'],
				arrayIndex:0,
				imgList:[],   //消费凭证
				fileList:[],   //消费附件
				toolArray:['公司车','私家车','公交车','出租车','飞机','火车','其他'],  //工具
				toolIndex:0,
				consume_date:'',   //消费日期
				consume_type:'',    //报销类型
				consume_money:'',   //报销金额
				remark:'',   //备注
				file_ids:'',   //附件
				start_mileage:'',   //起始公里数
				end_mileage:'',   //结束公里数
				mileage:'',   //公里数 类型为 公家车或私家车需要
				car_number:'',  //车牌号
				number:'',   //票据张数
				
				freeList:[],   //费用列表
				totalMoney:0,   //总金额
				totalNumber:0,   //总票据
				
				isUpload:false,   //是否上传图片
				index:null    ,//需要编辑的费用
				isEdit:false,
				
				numberList:[],   //车牌号 列表
				ocrImg:{}
			}
		},
		computed:mapState({
			costlist: state => state.customer.costlist
		}),
		onLoad(options) {
			console.log(options,'页面加载',this.costlist)
			this.freeList = this.costlist
			if(this.freeList.length != 0) {
				this.handleMoney()
			}
			if(options.index) {
				// this.isEdit = true
				this.index = options.index
				this.toAgainedit(this.index)
			}else{
				this.isEdit = false
				let arr = getNewDateArry()
				this.consume_date = `${arr[0]}-${arr[1]}-${arr[2]}`
			}
			//获取历史车牌号记录
			this.handleHistoryCar()
		},
		onShow() {
			
		},
		methods:{
			changeArray(e) {
				this.arrayIndex = e.detail.value
			},
			//工具
			changeTool(e) {
				this.toolIndex = e.detail.value
			},
			changeConsumeTime(e) {
				this.consume_date = e.detail.value
			},
			//计算公里数
			handleMileage() {
				if(this.end_mileage && this.start_mileage){
					if(isNaN(Number(this.start_mileage))){
						uni.showToast({
							title:'开始公里数只能为数字/不能有空格',
							icon:'none'
						})
						this.start_mileage = ''
						return
					}
					if(isNaN(Number(this.end_mileage))){
						uni.showToast({
							title:'结束公里数只能为数字/不能有空格',
							icon:'none'
						})
						this.end_mileage = ''
						return
					}
					if(this.end_mileage <= Number(this.start_mileage)){
						uni.showToast({
							title:'结束公里数必须大于开始公里数',
							icon:'none'
						})
						return
					}
					let num = this.end_mileage - Number(this.start_mileage)
					this.mileage = num
					this.changeNumber()
				}
			},
			changeNumber() {
				if(this.mileage > 0) {
					let type = this.toolArray[this.toolIndex]
					let params = {
						number:this.mileage,
						car_type: type
					}
					netComputedMoney(params).then(res=>{
						this.consume_money = res.data.money
					})
				}
			},
			//上传车牌号
			uploadChepai() {
				uni.chooseImage({
					count:1,
					success:(res)=>{
						let data = res.tempFilePaths[0]
						uni.uploadFile({
							url:uploadUrl,
							name:'file',
							header:{
								'token':uni.getStorageSync('token'),
								'sign-no':SIGN_NO
							},
							filePath: data,
							success:(res)=>{
								let data = JSON.parse(res.data)
								this.ocrImg = data.data
								let params = {
									type_id:13,
									file_id:data.data.id
								}
								netOcrDistinguish(params).then(res=>{
									this.car_number = res.data.number
									//通过车牌号 查询开始公里数
									this.handleStart()
								})
							},
							fail:(err)=>{
								console.log(err)
							}
						})
						
					}
				})
			},
			//查看车牌号 图片
			toPreChepaihao() {
				let img = this.ocrImg.url
				uni.previewImage({
					urls: [img]
				})
			},
			//从历史记录 里边选择车牌号
			selectNumber(item) {
				this.car_number = item
				this.handleStart()
			},
			//通过车牌号 查询上次的 公里数
			handleStart() {
				netEndKilometers({car_number:this.car_number}).then(res=>{
					this.start_mileage = res.data.end_mileage
				})
			},
			//获取历史 车牌记录
			handleHistoryCar() {
				netHistoryHumber().then(res=>{
					this.numberList = res.data
				})
			},
			//上传附件
			uploadFile() {
				let fileUrl = this.toUploadFile((res)=>{
					this.fileList.push(res)
				})
			},
			//查看附件
			toLookFile(item) {
				this.openFile({file:item.url,filename:item.name,type:'file'})
			},
			//删除附件
			delFile(id,index) {
				this.fileList.splice(index,1)
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//删除 费用类型
			delCost(index) {
				this.freeList.splice(index,1)
				this.$store.commit('SETCOSTlIST',this.freeList)
				this.handleMoney()
			},
			//计算  费用
			handleMoney() {
				let arr = this.freeList
				let money = 0
				let num = 0
				arr.forEach(ele=>{
					money += Number(ele.consume_money)
					num += Number(ele.number)
				})
				this.totalMoney = money
				this.money = money
				this.totalNumber = num
			},
			
			toBack() {
				uni.navigateBack({
					delta:1
				})
			},
			saveCost(flag = false) {
				if(!this.consume_date){
					uni.showToast({
						title:'请选择发生日期',
						icon:'none'
					})
					return
				}
				if(!this.consume_money){
					uni.showToast({
						title:'请填写金额',
						icon:'none'
					})
					return
				}
				if(this.imgList.length == 0){
					uni.showToast({
						title:'请上传票据凭证',
						icon:'none'
					})
					return
				}
				if(this.arrayIndex == 0 && (this.toolArray[this.toolIndex] == '公司车' || this.toolArray[this.toolIndex] == '私家车') && !this.mileage) {
					uni.showToast({
						title:'请填写公里数',
						icon:'none'
					})
					return
				}
				if(this.arrayIndex == 0 && (this.toolArray[this.toolIndex] == '公司车' || this.toolArray[this.toolIndex] == '私家车') && !this.car_number) {
					uni.showToast({
						title:'请填写车牌号',
						icon:'none'
					})
					return
				}
				//消费凭证  图片
				let list = this.imgList
				let arr = []
				list.forEach((ele,index) => {
					arr.push(ele.id)
				})
				//消费凭证  文件
				let fileArr = []
				this.fileList.forEach(ele=>{
					fileArr.push(ele.id)
				})
				
				let params = {
					consume_date: this.consume_date,
					consume_type: this.array[this.arrayIndex],
					arrayIndex: this.arrayIndex,
					consume_money: this.consume_money,
					remark: this.remark,
					number: this.number,
					file_ids: arr.join(','),
					imgList: this.imgList,
					car_type: this.arrayIndex == 0 ? this.toolArray[this.toolIndex]: '',
					toolIndex: this.toolIndex,
					other_files:fileArr.join(','),
					fileList: this.fileList
				}
				if(this.arrayIndex == 0 && (this.toolArray[this.toolIndex] == '公司车' || this.toolArray[this.toolIndex] == '私家车')){
					params = Object.assign({},params,{
							mileage:this.mileage,
							car_number:this.car_number,
							start_mileage:this.start_mileage,
							end_mileage:this.end_mileage
						})
				}
				if(this.isEdit){
					this.$set(this.freeList,this.index,params)
				}else{
					this.freeList.push(params)
				}
				this.$store.commit('SETCOSTlIST',this.freeList)
				this.init()
				//计算费用
				this.handleMoney()
				if(flag){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},200)
				}
			},
			//重置
			init() {
				this.isEdit = false
				
				this.arrayIndex = 0
				this.toolIndex = 0
				this.imgList = []
				let arr = getNewDateArry()
				this.consume_date = `${arr[0]}-${arr[1]}-${arr[2]}`  //消费日期
				this.consume_type = ''    //报销类型
				this.consume_money = ''   //报销金额
				this.remark = ''   //备注
				this.file_ids = ''   //附件
				this.mileage = ''   //公里数 类型为 公家车或私家车需要
				this.start_mileage = '' //起始公里数
				this.end_mileage = ''   //结束公里数
				this.car_number = ''  //车牌号
				this.number = ''  //票据张数
				
				this.fileList = []   //消费附件  文件
			},
			//重新编辑
			toAgainedit(index) {
				this.isEdit = true
				this.index = index
				//把选中的重新赋值页面   进行编辑
				let obj = this.freeList[index]
				console.log(obj,'费用')
				//处理费用类型
				this.handleArray(obj.consume_type)
				//处理选择工具
				if(obj.consume_type == '交通费'){
					this.handleTool(obj.car_type)
				}
				
				this.car_number = obj.car_number ? obj.car_number : ''
				this.start_mileage = obj.start_mileage ? obj.start_mileage : ''
				this.end_mileage = obj.end_mileage ? obj.end_mileage : ''
				this.mileage = obj.mileage ?obj.mileage : ''
				this.consume_date = obj.consume_date   //发生日期
				
				this.consume_money = obj.consume_money    //金额
				this.remark = obj.remark   //备注
				this.imgList = obj.imgList
				
				this.fileList = obj.fileList
				//删除  需要编辑的
				
				// this.freeList.splice(index,1)
				this.handleMoney()
			},
			//处理交通费用
			handleArray(str) {
				this.array.forEach((ele,index)=>{
					if(ele == str){
						this.arrayIndex = index
					}
				})
			},
			//选择的是  交通费用的  时候  处理选择的工具
			handleTool(str) {
				this.toolArray.forEach((ele,index)=>{
					if(ele == str) {
						this.toolIndex = index
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.doc_item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:24rpx 35rpx;
		border-bottom:1rpx solid #EDEDED;
		.remarkimg{
			width:31rpx;
			height:33rpx;
			margin-right:15rpx;
		}
		.deleimg{
			width:44rpx;
			height:44rpx;
		}
		.doc_name{
			width:575rpx;
			font-size:24rpx;
			color:#333;
		}
	}
	.que_list{
		border-bottom: 1rpx solid #EDEDED;
		padding:0 45rpx 0 50rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		background:#fff;
		.que_li{
			background-color: #fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-right:15rpx;
			&:last-child{
				border-bottom:0;
			}
			radio{
				transform: scale(0.7);
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
	.bot_warp{
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin:120rpx 0 50rpx;
		.botbtn{
			width:220rpx;
			height:60rpx;
			border-radius: 10rpx;
			background:$uni-text-color;
			text-align: center;
			line-height: 60rpx;
			font-size:26rpx;
			color:#fff;
		}
	}
	.cost_warp{
		flex:1;
		.cost_li{
			padding:24rpx 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom:1rpx solid #EDEDED;
			.li_left{
				margin-right:24rpx;
				flex-shrink: 0;
				flex-shrink: 0;
				.icon-jian{
					font-size:35rpx;
					color:#ff7800;
				}
			}
			.cost_info{
				flex:1;
				.info_title{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name{
						font-size:26rpx;
						color:#333;
					}
					.time{
						font-size:24rpx;
						color:#666;
					}
				}
				.li_warp{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top:15rpx;
					.li_warp_left{
						font-size:26rpx;
						color:#333;
						margin-right:24rpx;
						span{
							font-size:24rpx;
							color:#666;
						}
					}
				}
			}
		}
		.total_warp{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top:24rpx;
			.total_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.total_h{
					font-size:28rpx;
					color:#000000;
				}
				.total_p{
					margin-left:20rpx;
					font-size:26rpx;
					color:#666;
					span{
						font-size:28rpx;
						color:#333;
					}
				}
			}
			.total_right{
				font-size:26rpx;
				color:#0287FF;
				width:120rpx;
				height:40rpx;
				border-radius: 20rpx;
				text-align: center;
				line-height: 38rpx;
				border:1rpx solid #0287FF;
			}
		}
	}
	.cost_li{
		padding:24rpx 50rpx;
		.cost_type{
			.uni-input{
				width:200rpx;
				height:45rpx;
				background:#fff;
				border-radius: 10rpx;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:26rpx;
				color:#333;
				.selexiaimg{
					width:30rpx;
					height:17rpx;
					margin-left:10rpx;
				}
			}
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
			color:#666;
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
				margin-left:24rpx;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#FFA205;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#FFA205;
				margin-right:5rpx;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		margin-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			color:#666;
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
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EDEDED;
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
			border: 1rpx solid #EDEDED;
			&:nth-child(4n){
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
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
</style>
