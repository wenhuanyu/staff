<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
						<uni-collapse-item title="发起人" name="1">
							<view class="listwarp">
								<view 
									class="li" 
									:class="staffObj ?'liactive':''" 
									@click="toSelectStaff" >{{staffObj ? staffObj.name : '选择员工'}}
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="类型" name="2">
								<view class="listwarp">
									<view 
										class="li" 
										:class="{'liactive':index == typeIndex}" 
										v-for="(item,index) in typeList" 
										:key="index"
										@click="changeType(index)"
									>{{item.name}}</view>
								</view>
						</uni-collapse-item>
						<uni-collapse-item  title="时间" name="3">
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
	
	export default {
		mixins:[commonFun],
		props: {
			showScreen: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				activeNames:['1'],
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
				typeList:[
					{id:0,name:'讨论',value:'discuss'},
					{id:1,name:'协助任务',value:'assist_event'},
					{id:2,name:'打样',value:'proofing'},
					{id:3,name:'费用',value:'consume'},
					{id:4,name:'跟进',value:'record'},
					{id:5,name:'合同',value:'contract'},
					{id:6,name:'回款',value:'receivables'},
					{id:7,name:'任务',value:'event'},
					{id:8,name:'客户',value:'customer'},
					{id:9,name:'文章',value:'article'},
					{id:10,name:'工单',value:'workorder'},
					{id:11,name:'备件',value:'parts'},
					{id:12,name:'审批',value:'approval'},
					{id:13,name:'工作报告',value:'work_report'},
					{id:15,name:'未成交反馈',value:'customer_feedback'},
					{id:16,name:'未成交提醒',value:'customer_nodeal'},
					{id:17,name:'业绩目标',value:'achievement'},
					{id:18,name:'报价单',value:'quote'}
				],
				typeIndex:null,
				start_time:'',
				end_time:''
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
			staffObj: state => state.customer.staffObj
		}),
		created() {
		},
		methods: {
			open() {
				this.$refs.showRight.open()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			reset() {
				this.$store.commit('CUSTOMEROBJ',null)
				this.$store.commit('STAFFOBJ',null)
				this.timeIndex = null
				this.start_time = ''
				this.end_time = ''
				this.typeIndex = null
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
			changeType(index) {
				this.typeIndex = index
			},
			sure() {
				let times = ''
				if(this.timeList[this.timeIndex] && (this.timeList[this.timeIndex].value != 'zidingyi')){
					times = this.timeList[this.timeIndex].value
				}else{
					times = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
				}
				
				let params = {
					from_staff_id: this.staffObj ? this.staffObj.id : '',
					relation_type: this.typeList[this.typeIndex] ? this.typeList[this.typeIndex].value : '',
					times
				}
				this.$refs.showRight.close()
				this.$emit('sureQuery',params)
			},
			
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			close() {
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.title{
		font-size:30rpx;
		color:#333333;
		padding:25rpx 34rpx;
	}
	.scrollbox{
		width:660rpx;
		height:calc(100vh - 210rpx);
		background:#fff;
		.scr_warp{
			width:660rpx;
			background:#fff;
			.listwarp{
				width:600rpx;
				margin:0 auto;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.li{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 172rpx;
					height: 54rpx;
					background: #ededed;
					border: 1rpx solid #ededed;
					border-radius: 10rpx;
					font-size:28rpx;
					color:#999;
					margin-right:40rpx;
					margin-bottom:20rpx;
					&:nth-child(3n){
						margin-right:0;
					}
				}
				.liactive{
					color:#666;
					background:#fff;
					border: 1px solid $uni-text-color;
				}
			}
			.address_warp{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:24rpx;
				border-top:1rpx solid #999999;
				border-bottom:1rpx solid #999999;
				.address_li{
					color:$uni-text-color;
				}
			}
			.time_warp{
				width:600rpx;
				margin:0 auto;
				padding:24rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.timebox{
					width:216rpx;
					height:60rpx;
					border-radius: 30rpx;
					text-align: center;
					line-height: 58rpx;
					font-size:30rpx;
					color:$uni-text-color;
					border:1rpx solid $uni-text-color;
				}
				.xian{
					width:85rpx;
					height:7rpx;
					background:#999999;
					margin:0 20rpx;
				}
				.timeactive{
					background:$uni-text-color;
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
