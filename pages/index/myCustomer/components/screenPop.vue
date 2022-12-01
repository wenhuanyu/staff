<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<!-- #ifdef MP-WEIXIN -->
			<view class="" :style="{height:topHeight+'px',width:'100%'}"></view>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY || APP-PLUS || H5 -->
			<view class="statusHeight"></view>
			<!-- #endif -->
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse v-model="activeNames" @change="onChange" ref="collapse">
						<uni-collapse-item title="归属" name="key6">
							<view class="listwarp">
								<view class="li" :class="item.id == tab ?'liactive':''" @click="changeTab(item)"
									v-for="(item,index) in tabList" :key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="附近" name="key45" v-if="isMap">
							<view class="listwarp">
								<view class="li" :class="item.id == nearIndex ?'liactive':''" @click="changeNear(index)"
									v-for="(item,index) in nearList" :key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="员工" name="key0" v-if="suborStaff.length != 0 && role_type != 0">
							<view class="listwarp" v-if="popType == 1">
								<view class="li" :class="staffObj ?'liactive':''" @click.stop="toSelectStaff(2)">
									{{staffObj ? staffObj.name : '选择员工'}}
									<view class="clearStaff" v-if="staffObj" @click.stop="clearStaff">×</view>
								</view>
							</view>
							<view class="listwarp" v-if="popType == 2">
								<view class="li" :class="staffTwo ?'liactive':''" @click.stop="toSelectStaffTwo">
									{{staffTwo ? staffTwo.name : '选择员工'}}
									<view class="clearStaff" v-if="staffTwo" @click.stop="clearStaffTwo">×</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="成交状态" name="key5">
							<view class="listwarp">
								<view class="li" :class="index == statusIndex ?'liactive':''" @click="changeStatus(index)"
									v-for="(item,index) in statusList" :key="index">{{item}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="客户来源" name="key1">
							<view class="listwarp">
								<view class="li" :class="item == sourtIndex ?'liactive':''" @click="changeSourt(item)"
									v-for="(item,index) in sourtList" :key="index">{{item}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="客户星级" name="key3">
							<view class="listwarp">
								<uni-rate :size="18" @change="changeRate" v-model="level" />
							</view>
						</uni-collapse-item>
						<!-- <uni-collapse-item title="所属区域" name="key7">
							<view class="listwarp">
								<view class="li" :class="item.id == management_id ?'liactive':''"
									@click="changeRegion(item)" v-for="(item,index) in region" :key="index">
									{{item.name}}</view>
							</view>
						</uni-collapse-item> -->
						<!-- #ifdef MP-WEIXIN -->
						<uni-collapse-item title="客户所在地区" name="key4">
							<picker @change="changeAddress" mode="region">
								<view class="address_warp">
									<view class="address_li">{{address[0] ? address[0] : '请选择'}}</view>
									<view class="address_li">{{address[1] ? address[1] : '请选择'}}</view>
									<view class="address_li">{{address[2] ? address[2] : '请选择'}}</view>
								</view>
							</picker>
						</uni-collapse-item>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
							<uni-collapse-item title="客户所在地区" name="key4">
								<view class="address_warp" @click="getAddress">
									<view class="address_li">{{address[0] ? address[0] : '请选择'}}</view>
									<view class="address_li">{{address[1] ? address[1] : '请选择'}}</view>
									<view class="address_li">{{address[2] ? address[2] : '请选择'}}</view>
								</view>
							</uni-collapse-item>
						<!-- #endif -->
						<!-- #ifdef H5 || APP-PLUS -->
						<uni-collapse-item title="客户所在地区" name="key4">
							<view class="address_warp" @click="changeAddressData">
								<view class="address_li">{{address[0] ? address[0] : '请选择'}}</view>
								<view class="address_li">{{address[1] ? address[1] : '请选择'}}</view>
								<view class="address_li">{{address[2] ? address[2] : '请选择'}}</view>
							</view>
							<lotus-address @choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
						</uni-collapse-item>
						<!-- #endif -->
						<uni-collapse-item title="新增客户时间" name="c">
								<view class="listwarp">
									<view 
										class="li" 
										:class="index == timeIndex ?'liactive':''" 
										@click="changeTime(index)" 
										v-for="(item,index) in timeList" 
										:key="index">{{item.name}}</view>
								</view>
								<view class="time_warp" v-if="timeList[timeIndex] && timeList[timeIndex].value == 'zidingyi'">
									<picker @change="changeStartTime" mode="date">
										<view class="timebox">
											{{start_time ? start_time : '开始时间'}}
										</view>
									</picker>
									<view class="xian"></view>
									<picker @change="changeEndTime" mode="date">
										<view class="timebox">
											{{end_time ? end_time : '结束时间'}}
										</view>
									</picker>
								</view>
						</uni-collapse-item>
						<search-item :searchForm="searchForm" v-if="searchForm" @changeSearchData="changeSearchData" @chageResize="chageResize"></search-item>
					</uni-collapse>
				</view>
			</scroll-view>
			<view class="screenbot">
				<view class="screenbtn" @click="reset">重置</view>
				<view class="screenbtn surebtn" @click="sure">确认</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import {
		netSelect,
		netEareList
	} from '@/api/api.js'
	import {
		mapState
	} from 'vuex'
	import {
		commonFun
	} from '@/common/navigate.js'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	const citysJSONTwo = require('@/utils/address2.js');
	import searchItem from '@/components/searchScreen/searchitem.vue'
	import lotusAddress from '@/components/lotusAddress/lotusAddress.vue'
	
	export default {
		mixins: [commonFun],
		components: {
			selectTimePicker,
			searchItem,
			lotusAddress
		},
		props: {
			showScreen: {
				type: Boolean,
				default: false
			},
			suborStaff: {
				type: Array,
				default: () => {
					return []
				}
			},
			popType: {
				type: Number,
				default: 1 //1客户列表  2批量操作选择客户列表
			},
			role_type:{
				type:Number,
				default:0
			},
			searchForm:{
				type:Array,
				default:null
			},
			topHeight:{
				type:Number,
				default:0,
			},
			isMap:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				drWidth: uni.upx2px(660),
				activeNames: [],
				//客户tab 筛选
				tabList:[
					{id:0,name:'全部'},
					{id:1,name:'我负责的'},
					{id:11,name:'我下属负责的'},
					{id:2,name:'我参与的'}
				],
				tab:0,
				//客户来源
				sourtList: [],
				sourtIndex: null,
				address: [], //客户所在 地区
				//新增客户时间
				timeList:[
					{value:'today',name:'今天'},
					{value:'yesterday',name:'昨天'},
					{value:'thisweek',name:'本周'},
					{value:'lastweek',name:'上周'},
					{value:'thismonth',name:'本月'},
					{value:'lastmonth',name:'上月'},
					{value:'thisquarter',name:'本季'},
					{value:'lastquarter',name:'上季'},
					{value:'thisyear',name:'今年'},
					{value:'lastyear',name:'去年'},
					{value:'zidingyi',name:'自定义'}
				],
				timeIndex:null,
				start_time: '',
				end_time: '',
				level: null, //客户星级
				region: [],
				management_id: '', //区域id
				nearList:[       //附近
					{id:0,name:'附近1KM',num:1},
					{id:1,name:'附近3KM',num:3},
					{id:2,name:'附近5KM',num:5},
					{id:3,name:'附近10KM',num:10},
					{id:4,name:'附近30KM',num:30},
					{id:5,name:'附近200KM',num:200},
					{id:6,name:'附近400KM',num:400},
					{id:7,name:'附近600KM',num:600},
					{id:8,name:'附近800KM',num:800},
					{id:9,name:'全部',num:1000000},
				],
				nearIndex:2,  
				//客户成交状态
				statusList:['未成交','已成交'],
				statusIndex:null,
				lotusAddressData:{
					visible:false,
					provinceName:'',
					cityName:'',
					townName:'',
				}
			}
		},
		computed: mapState({
			staffObj: state => state.customer.staffObj,
			staffTwo: state => state.customer.staffTwo
		}),
		created() {
			//筛选条件
			this.getSelect()
			//区域
			// this.getEare()
		},
		methods: {
			open(obj) {
				if(obj && obj.times){
					//处理默认的参数
					this.handleParams(obj)
				}
				this.$refs['showRight'].open()
			},
			handleParams(obj){
				//客户成交状态
				this.statusIndex = obj.status
				//时间
				this.timeList.forEach((item,index) =>{
					if(item.value == obj.times){
						this.timeIndex = index
					}
				})
				if(this.timeIndex != 0 && !this.timeIndex){
					this.timeIndex = 15
					let time = obj.times.split(',')
					this.start_time = time[0]
					this.end_time = time[1]
					this.init()
				}
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			changeTab(item) {
				this.tab = item.id
			},
			changeSearchData(type,key,value){
				console.log(type,key,value,'====')
				this.$emit('changeSearchData',type,key,value)
			},
			chageResize() {
				this.init()
			},
			//所属区域
			getEare() {
				netEareList().then(res => {
					this.region = res.data
				})
			},
			changeRegion(item) {
				this.management_id = item.id
			},
			getSelect() {
				netSelect().then(res => {
					this.sourtList = res.data.customer['客户来源']
				})
			},
			//客户成交状态
			changeStatus(index) {
				this.statusIndex = index
			},
			changeSourt(item) {
				this.sourtIndex = item
			},
			changeAddress(e) {
				this.address = e.detail.value
			},
			//支付宝选择省市区
			getAddress() {
				dd.multiLevelSelect({
					title: '选择省市区', //级联选择标题
					list: citysJSONTwo.citys, //引入的js
					success: (res) => {
						res = res.result
						this.address = [res[0].name,res[1].name,res[2].name[0]]
					}
				});
			},
			changeAddressData() {
				this.lotusAddressData = {
					visible:true,
					provinceName:'',
					cityName:'',
					townName:'',
				}
			},
			//选择省市区
			choseValue(e) {
				this.lotusAddressData = Object.assign({},this.lotusAddressData,e)
				if(e.province){
					this.address = [e.province,e.city,e.town]
				}
			},
			changeTime(index) {
				this.timeIndex = index
				this.init()
			},
			changeStartTime(e) {
				this.start_time = e.detail.value
			},
			changeEndTime(e) {
				this.end_time = e.detail.value
			},
			changeRate(e) {
				this.level = e.value
			},
			changeNear(index) {
				this.nearIndex = index
			},
			reset() {
				this.sourtIndex = ''
				this.address = []
				this.start_time = ''
				this.end_time = ''
				this.management_id = ''
				this.timeIndex = null
				this.level = null
				this.statusIndex = null
				this.tab = 0
				this.$store.commit('STAFFOBJ', null)
				this.$emit('resetForm')
			},
			sure() {
				let times = ''
				if(this.timeList[this.timeIndex] && (this.timeList[this.timeIndex].value != 'zidingyi')){
					times = this.timeList[this.timeIndex].value
				}else{
					times = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
				}
				let params = {
					source: this.sourtIndex,
					prov: this.address ? this.address[0] : '',
					city: this.address ? this.address[1] : '',
					area: this.address ? this.address[2] : '',
					level: this.level,
					management_id: this.management_id,
					staff_id: this.popType == 1 ? (this.staffObj ? this.staffObj.id : '') : (this.staffTwo ? this.staffTwo.id : ''),
					createtime: times,
					contract_status:this.statusIndex,
					type:this.tab,
					distance:this.nearList[this.nearIndex] ? this.nearList[this.nearIndex].num : '',
					
				}
				this.$emit('sureQuery', params)
				this.$refs['showRight'].close()
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			close() {
				this.$emit('close')
			},
			//选择员工
			toSelectStaffTwo() {
				uni.navigateTo({
					url: '/pagesA/customerInfo/allOperation/selectStaff'
				})
			},
			clearStaff() {
				this.$store.commit('STAFFOBJ', null)
			},
			clearStaffTwo() {
				this.$store.commit('STAFFTWO', null)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.statusHeight{
		width:100%;
		height:var(--status-bar-height);
		background:$uni-text-color;
	}
	.title {
		font-size: 30rpx;
		color: #333333;
		padding: 25rpx 34rpx;
	}

	.scrollbox {
		width: 660rpx;
		height: calc(100vh - 410rpx);
		background: #fff;
		.scr_warp {
			width: 660rpx;
			background: #fff;
			.listwarp {
				width:600rpx;
				margin:0 auto;
				padding:24rpx 0;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.li {
					position: relative;
					width: 190rpx;
					height: 60rpx;
					border-radius: 10rpx;
					font-size: 30rpx;
					color: #999;
					background-color: #ededed;
					border: 1rpx solid #ededed;
					text-align: center;
					line-height: 58rpx;
					margin-right: 15rpx;
					margin-bottom: 20rpx;
					&:nth-child(3n) {
						margin-right: 0;
					}

					.clearStaff {
						position: absolute;
						right: -20rpx;
						top: -20rpx;
						font-size: 28rpx;
						width: 40rpx;
						height: 40rpx;
						background: rgba(0, 0, 0, 0.5);
						border-radius: 50%;
						text-align: center;
						line-height: 38rpx;
						color: #fff;
					}
				}

				.liactive {
					color: #666;
					background: #fff;
					border: 1rpx solid $uni-text-color;
				}
			}

			.address_warp {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx;
				border-bottom: 1rpx solid #ededed;
				.address_li {
					color: #999;
				}
			}

			.time_warp{
				width:600rpx;
				margin:0 auto;
				display: flex;
				justify-content: center;
				align-items: center;
				.timebox{
					width: 172rpx;
					height: 54rpx;
					border-radius: 10rpx;
					text-align: center;
					line-height: 50rpx;
					font-size:27rpx;
					color:#666;
					border:1rpx solid $uni-btn-bg-color;
				}
				.xian{
					width:85rpx;
					height:7rpx;
					background:#ededed;
					margin:0 20rpx;
				}
				.timeactive{
					background:#0287FF;
					color:#fff;
				}
			}
		}
	}

	.screenbot {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 120rpx;
		padding-bottom: 30rpx;

		.screenbtn {
			width: 229rpx;
			height: 60rpx;
			border-radius: 10rpx;
			text-align: center;
			line-height: 58rpx;
			font-size: 26rpx;
			color: #999;
			border: 1rpx solid #999;
		}

		.surebtn {
			background: #fff;
			color: $uni-text-color;
			border: 1rpx solid $uni-text-color;
		}
	}
</style>
