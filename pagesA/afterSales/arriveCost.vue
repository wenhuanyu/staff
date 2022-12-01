<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view>
			<view class="fllow_form">
				<view class="key">解决结果<span>*</span></view>
				<view class="form_right">
					<view class="radiowarp">
						<view class="radioli" @click="changeRadio(1)">
							<radio value="1" color="#008EFF" :checked="resolved_results == 1" />已解决
						</view>
						<view class="radioli" @click="changeRadio(9)">
							<radio value="9" color="#008EFF" :checked="resolved_results == 9" />未解决
						</view>
						<view class="radioli" @click="changeRadio(12)">
							<radio value="12" color="#008EFF" :checked="resolved_results == 12" />返厂维修
						</view>
					</view>
				</view>
			</view>
			<view v-if="resolved_results == 12">
				<view class="fllow_form">
					<view class="key">返厂方式<span>*</span></view>
					<view class="form_right">
						<input type="text" :class="logistics_type ? 'valueActive' : '' "  v-model="logistics_type" placeholder="填写返厂方式" />
					</view>
				</view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">客户确认人姓名<span>*</span></view>
			<view class="form_right">
				<input type="text" :class="complete_name ? 'valueActive' : '' "  v-model="complete_name" placeholder="客户确认人姓名" />
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">客户确认联系人电话<span>*</span></view>
			<view class="form_right">
				<input type="text" :class="complete_contact ? 'valueActive' : '' "  v-model="complete_contact" placeholder="客户确认联系人电话" />
			</view>
		</view>
		<view class="fllow_form" style="margin-top:24rpx;">
			<view class="key">使用配件</view>
			<view class="form_right">
			</view>
		</view>
		<view class="prolist" v-if="partsList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in partsList" :key="index">
					<view class="iconfont icon-jian" @click="delParts(index)"></view>
					<view class="protext">{{item.name}}</view>
					<view class="protext">
						<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changePartNumber(e,index)}" />
					</view>
				</view>
			</view>
		</view>
		<view class="add_in" @click="toAddPart">
			<view class="iconfont icon-jiahaocu"></view>
			添加配件
		</view>
		<view class="fllow_area">
			<view class="area_head key">情况说明<span>*</span></view>
			<textarea v-model="desc" :class="{'valueActive':desc}" class="textself" placeholder="情况说明" placeholder-style="color:#999" />
		</view>
		<view style="height:100rpx"></view>
		<view class="arrive_bot">
			<view class="arrbtn" @click="$noMultipleClicks(toComplate)">完成</view>
		</view>
		
		<select-work-parts ref="partChild"  @selectList="selectParts"></select-work-parts>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import selectWorkParts from '@/components/selectWorkParts/index'
	import { netCompleteWorkorder, netWorkOrderDetail, netLngTransAddress } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		components:{
			selectWorkParts
		},
		data(){
			return{
				noClick:true,    //防止  重复点击
				workorderid:'',
				serviceMoney:0,
				serviceList:[],
				partsMoney:0,
				partsList:[],
				lat:'',
				lng:'',
				location:'',
				desc:'',  //备注
				programid:'',
				resolved_results:1,   //1 已解决  12 返厂维修
				is_program:1,   //1推荐方案   2其他
				aftermarket_text:'',
				logistics_type:'',
				remindPeople:[],
				examineType:'approval',
				complete_contact:'',   //客户确认 联系人电话
				complete_name:'',   //客户确认 联系人姓名
			}
		},
		computed:mapState({
			serviceItem: state => state.template.service_cost,
			programList: state => state.customer.programList
		}),
		watch: {
			serviceItem(newValue, oldValue) {
				if(newValue){
					let obj = {
						name:newValue,
						money:50
					}
					this.serviceList.push(obj)
					this.handleServiceMoney()
				}
			}
		},
		onShow() {
			this.getDefaultRemind()
		},
		onLoad(options) {
			uni.setStorageSync('remindlist',[])
			
			this.workorderid = options.workorderid
			this.programid = options.proid
			//获取位置
			this.getAddressinfo()
			//获取出发时携带的配件
			this.getPartList()
		},
		methods:{
			getPartList() {
				netWorkOrderDetail({id:this.workorderid}).then(res=>{
					this.partsList = res.data.parts
				})
			},
			getAddressinfo() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.lng = res.longitude
						this.lat = res.latitude
						//地址逆解析
						let params = {
							lat: res.latitude,
							lng: res.longitude
						}
						netLngTransAddress(params).then(data=>{
							data = data.data.result
							this.location = data.address
						})
					},
					fail: (err) => {
						if(err.errMsg == 'getLocation:fail auth deny'){
							uni.navigateTo({
								title:'请允许使用位置信息',
								icon:'none'
							})
						}
					}
				})
			},
			//添加服务费用
			toAddservice() {
				this.$store.commit('SERVICE_COST','')
				uni.navigateTo({
					url:'/pages/template/visitTitle?type=服务费用'
				})
			},
			changeMoney(e,index) {
				let obj = this.serviceList[index]
				this.handleServiceMoney()
			},
			handleServiceMoney(){
				let money = 0
				let arr = this.serviceList
				arr.forEach(ele=>{
					money += Number(ele.money)
				})
				this.serviceMoney = money
			},
			//删除服务费用
			delService(index) {
				this.serviceList.splice(index,1)
				this.handleServiceMoney()
			},
			//配件
			toAddPart() {
				this.$refs.partChild.init(this.workorderid)
			},
			selectParts(arr) {
				arr.forEach(ele=>{
					ele.number = 1
				})
				let data = this.partsList.concat(arr)
				this.partsList = this.deWeight(data)
			},
			delParts(index) {
				this.partsList.splice(index,1)
			},
			changePartNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e
				this.$set(this.partsList,index,obj)
			},
			handlePartsMoney() {
				let money = 0
				let arr = this.partsList
				arr.forEach(ele=>{
					money += Number(ele.price) * ele.number
				})
				this.partsMoney = money
			},
			changeRadio(e) {
				this.resolved_results = e
			},
			changeFa(e) {
				this.is_program = e
			},
			toSelectProblem() {
				uni.navigateTo({
					url: '/pagesA/afterSales/program_list?id='+this.programid
				})
			},
			delProgram(index) {
				this.programList.splice(index,1)
				this.$store.commit('SETPROGRAMLIST',this.programList)
			},
			//优惠金额
			changeDismoney(e) {
				this.discount_money = e.detail.value
				if(this.partsMoney+this.serviceMoney-Number(this.discount_money) < 0) {
					uni.showToast({
						title:'优惠金额不能大于总计金额',
						icon:'none'
					})
					this.discount_money = 0
					return
				}
			},
			toComplate() {
				let {
					lng,
					lat,
					location,
					partsList,
					serviceList,
					serviceMoney,
					partsMoney,
					workorderid,
					desc
				} = this
				if(!this.complete_name){
					uni.showToast({
						title:'请填写客户确认人姓名',
						icon:'none'
					})
					return
				}
				if(!this.complete_contact) {
					uni.showToast({
						title:'请填写客户确认联系人电话',
						icon:'none'
					})
					return
				}
				if(!desc){
					uni.showToast({
						title:'请填写情况说明',
						icon:'none'
					})
					return
				}
				let arr = []
				this.programList.forEach(ele=>{
					arr.push(ele.id)
				})
				
				let params = {
					lng,lat,location,desc,
					use_parts: partsList,
					pay_service: serviceList,
					id:workorderid,
					resolved_results: this.resolved_results,
					complete_contact:this.complete_contact,
					complete_name:this.complete_name,
					logistics_type:this.logistics_type
				}
				netCompleteWorkorder(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta:1
						})
					}, 2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx;
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			.form_input {
				width:300rpx;
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
				.radioli{
					display: flex;
					justify-content: center;
					align-items: center;
					font-size:26rpx;
					radio{
						transform: scale(0.7);
					}
				}
			}
		}
	}
	.add_in{
		display: flex;
		justify-content: center;
		align-items: center;
		padding:15rpx 0;
		background:#fff;
		font-size:28rpx;
		color:$uni-text-color;
		.icon-jiahaocu{
			font-size:30rpx;
			color:$uni-text-color;
		}
	}
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom:0;
				}
				.icon-jian{
					font-size:42rpx;
					color:#ff7800;
				}
				.protext{
					font-size:24rpx;
					color:#333;
					width:200rpx;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					.priceinput{
						width:180rpx;
						font-size:24rpx;
						color:#333;
					}
				}
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
	.arrive_bot{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:100rpx;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		padding:0 24rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		z-index: 9;
		.arri_money{
			font-size:26rpx;
			color:#ff7800;
		}
		.arrbtn{
			width:120rpx;
			height:80rpx;
			background:$uni-btn-bg-color;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			font-size:26rpx;
			border-radius: 8rpx;
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
</style>
