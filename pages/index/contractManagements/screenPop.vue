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
					<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
						<uni-collapse-item title="合同状态" name="a">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == tabIndex ?'liactive':''" 
									@click="changeStatus(index)" 
									v-for="(item,index) in tablist" 
									:key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="客户" name="b">
							<view class="listwarp">
								<view class="li" :class="customerObj ?'liactive':''" @click.stop="toSelectCustomer">
									{{customerObj?customerObj.name:'选择客户'}}
									<view class="clearStaff" v-if="customerObj" @click.stop="clearCustomer">×</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="员工" name="c">
								<view class="listwarp">
									<view class="li" :class="staffObj ?'liactive':''" @click.stop="toSelectStaff" >
										{{staffObj ? staffObj.name : '选择员工'}}
										<view class="clearStaff" v-if="staffObj" @click.stop="clearStaff">×</view>
									</view>
								</view>
						</uni-collapse-item>
						<uni-collapse-item title="所属" name="p">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == typeIndex ?'liactive':''" 
									@click="changeType(index)" 
									v-for="(item,index) in typeList" 
									:key="index"
									>{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="时间" name="d">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == timeIndex ?'liactive':''" 
									@click="changeTime(index)" 
									v-for="(item,index) in timeList" :key="index">{{item.name}}</view>
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
						<uni-collapse-item title="是否已开发票" name="d" v-if="tabIndex == 1">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == invoiceIndex ?'liactive':''" 
									@click="changeInvoice(index)" 
									v-for="(item,index) in invoice" 
									:key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<search-item 
							:searchForm="searchForm"
							v-if="searchForm"
							@changeSearchData="changeSearchData" 
							@chageResize="chageResize"
						></search-item>
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
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	import searchItem from '@/components/searchScreen/searchitem.vue'
	
	export default {
		mixins:[commonFun],
		props: {
			searchForm:{
				type:Array,
				default:null
			}
		},
		components:{
			searchItem
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				//合同状态
				tablist:[
					{id:1,name:'审核中'},
					{id:2,name:'通过'},
					{id:3,name:'拒绝'},
					{id:4,name:'撤销'},
					{id:9,name:'终止'}
				],
				tabIndex:null,
				invoice:[
					{id:1,name:'已开'},
					{id:2,name:'未开'}
				],
				invoiceIndex:null,
				activeNames:['1','2','3'],
				timeList:[
					{value:'today',name:'今天'},
					{value:'yesterday',name:'昨天'},
					{value:'tomorrow',name:'明天'},
					{value:'thisweek',name:'本周'},
					{value:'lastweek',name:'上周'},
					{value:'nextweek',name:'下周'},
					{value:'thismonth',name:'本月'},
					{value:'lastmonth',name:'上月'},
					{value:'nextmonth',name:'下月'},
					{value:'thisquarter',name:'本季'},
					{value:'lastquarter',name:'上季'},
					{value:'nextquarter',name:'下季'},
					{value:'thisyear',name:'今年'},
					{value:'lastyear',name:'去年'},
					{value:'nextyear',name:'下一年'},
					{value:'zidingyi',name:'自定义'}
				],
				timeIndex:null,
				start_time:'',
				end_time:'',
				typeList:[
					{id:0,name:'本人及下属'},
					{id:1,name:'仅本人'},
					{id:2,name:'仅下属'},
				],
				typeIndex:null,
				topHeight:0,
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
			staffObj: state => state.customer.staffObj
		}),
		created() {
		},
		methods: {
			open(obj) {
				if(obj.type){
					//处理默认的参数
					this.handleParams(obj)
				}
				this.$refs.showRight.open()
				// #ifdef MP-WEIXIN
				uni.getSystemInfo({
					success: (res) => {
						let rect = wx.getMenuButtonBoundingClientRect();
						this.topHeight = rect.bottom + 5
					}
				})
				// #endif
			},
			handleParams(obj) {
				//合同状态
				this.tablist.forEach((ele,index)=>{
					if(ele.id == obj.check_status){
						this.tabIndex = index
					}
				})
				//所属
				this.typeList.forEach((ele,index)=>{
					if(ele.id == obj.type){
						this.typeIndex = index
					}
				})
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
			changeSearchData(type,key,value){
				this.$emit('changeSearchData',type,key,value)
			},
			chageResize() {
				this.init()
			},
			changeInvoice(index) {
				this.invoiceIndex = index
			},
			reset() {
				this.$store.commit('CUSTOMEROBJ',null)
				this.$store.commit('STAFFOBJ',null)
				this.timeIndex = null
				this.invoiceIndex = null
				this.start_time = ''
				this.end_time = ''
				this.tabIndex = null
				this.typeIndex = null
			},
			changeType(index) {
				this.typeIndex = index
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
			//合同状态
			changeStatus(index) {
				this.tabIndex = index
			},
			sure() {
				let createtime = ''
				if(this.timeList[this.timeIndex] && (this.timeList[this.timeIndex].value != 'zidingyi')){
					createtime = this.timeList[this.timeIndex].value
				}else{
					createtime = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
				}
				let params = {
					customer_id: this.customerObj ? this.customerObj.id : '',
					createtime,
					is_invoice:this.invoice[this.invoiceIndex]?this.invoice[this.invoiceIndex].id:'',
					staff_id: this.staffObj?this.staffObj.id:'',
					check_status:this.tablist[this.tabIndex]?this.tablist[this.tabIndex].id:'',
					type:this.typeList[this.typeIndex]?this.typeList[this.typeIndex].id:''
				}
				this.$refs.showRight.close()
				this.$emit('sureQuery',params)
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			clearCustomer() {
				this.$store.commit('CUSTOMEROBJ',null)
			},
			clearStaff() {
				this.$store.commit('STAFFOBJ',null)
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.title{
		font-size:28rpx;
		color:#999;
		padding:25rpx 34rpx;
	}
	.scrollbox{
		width:660rpx;
		height:calc(100vh - 410rpx);
		background:#fff;
		.scr_warp{
			width:660rpx;
			background:#fff;
			.listwarp{
				width:600rpx;
				margin:0 auto;
				padding:25rpx 0;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.li{
					display: flex;
					align-items: center;
					justify-content: center;
					min-width:172rpx;
					max-width:500rpx;
					min-height: 54rpx;
					padding:0 5rpx;
					background: #ededed;
					border: 1rpx solid #ededed;
					border-radius: 10rpx;
					font-size:28rpx;
					color:#999;
					margin-right:20rpx;
					margin-bottom:20rpx;
					position: relative;
					&:nth-child(3n){
						margin-right:0;
					}
					.clearStaff{
						position: absolute;
						right:-20rpx;
						top:-20rpx;
						font-size:28rpx;
						width:40rpx;
						height:40rpx;
						background:rgba(0,0,0,0.5);
						border-radius: 50%;
						text-align: center;
						line-height: 38rpx;
						color:#fff;
					}
				}
				.liactive{
					color:#666;
					background:#fff;
					border: 1px solid $uni-text-color;
				}
			}
			.time_warp{
				width:600rpx;
				margin:0 auto;
				padding:24rpx 0;
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
					border:1rpx solid $uni-text-color;
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
	.screenbot{
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		height:120rpx;
		padding-bottom:30rpx;
		.screenbtn{
			width: 229rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1px solid #999999;
			border-radius: 10rpx;
			text-align: center;
			line-height: 60rpx;
			font-size:26rpx;
			color:#999;
		}
		.surebtn{
			border: 1px solid $uni-text-color;
			background:#fff;
			color:$uni-text-color;
		}
	}
</style>
