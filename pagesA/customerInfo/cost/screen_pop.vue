<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse v-model="activeNames" @change="onChange" ref="collapse">
						<uni-collapse-item title="费用状态" name="a" v-if="type == 1">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == litabIndex ?'liactive':''" 
									@click="changeStatus(index)" 
									v-for="(item,index) in litabList" 
									:key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="费用单号" name="b">
							<view class="search">
								<input type="text" class="searchInput" v-model="name" placeholder-style="color:#999;font-size:24rpx;" placeholder="请输入费用单号" />
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="员工" name="c">
								<view class="listwarp">
									<view class="li" :class="staffObj ?'liactive':''" @click="toSelectStaff" >
										{{staffObj ? staffObj.name : '选择员工'}}
										<view class="clearStaff" v-if="staffObj" @click.stop="clearStaff">×</view>
									</view>
								</view>
						</uni-collapse-item>
						<uni-collapse-item title="客户" name="d">
							<view class="listwarp_thr">
								<view class="li" :class="customerObj ?'liactive':''" @click="toSelectCustomer">
									{{customerObj ?customerObj.name:'选择客户'}}
									<view class="clearStaff" v-if="customerObj" @click.stop="clearCustomer">×</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="时间" name="e">
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
			type: {
				type: Number,
				default: 1   //1费用列表筛选   2出纳列表筛选
			}
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				activeNames:[],
				litabList:[
					{id:1,name:'待审核'},
					{id:2,name:'通过'},
					{id:3,name:'拒绝'},
					{id:9,name:'终止'}
				],
				litabIndex:null,
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
				name:''
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
				this.name = ''
			},
			changeTime(index) {
				this.init()
				this.timeIndex = index
			},
			changeStartTime(e) {
				this.start_time = e.detail.value
			},
			changeEndTime(e) {
				this.end_time = e.detail.value
			},
			changeStatus(e) {
				this.litabIndex = e
			},
			sure() {
				let times = ''
				if(this.timeList[this.timeIndex] && (this.timeList[this.timeIndex].value != 'zidingyi')){
					times = this.timeList[this.timeIndex].value
				}else{
					times = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
				}
				let params = {
					customer_id: this.customerObj ? this.customerObj.id : '',
					staff_id: this.staffObj ? this.staffObj.id : '',
					times,
					name:this.name,
				}
				if(this.type == 1) {
					//费用筛选
					params.check_status = this.litabList[this.litabIndex]?this.litabList[this.litabIndex].id:''
				}
				this.$refs.showRight.close()
				this.$emit('sureQuery',params)
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			clearStaff() {
				this.$store.commit('STAFFOBJ',null)
			},
			clearCustomer() {
				this.$store.commit('CUSTOMEROBJ',null)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.listwarp_thr{
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
			height: 54rpx;
			background: #ededed;
			border: 1rpx solid #ededed;
			border-radius: 10rpx;
			font-size:28rpx;
			color:#999;
			padding:0 15rpx;
			margin-right:20rpx;
			margin-bottom:20rpx;
			position: relative;
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
			border: 1px solid $uni-btn-bg-color;
		}
	}
	.search{
		display: flex;
		align-items: center;
		width:400rpx;
		height:60rpx;
		margin:25rpx 0 25rpx 40rpx;
		border-radius: 10rpx;
		border:1rpx solid $uni-btn-bg-color;
		padding:0 24rpx;
		.searchInput{
			width:350rpx;
			font-size:24rpx;
			color:#666;
		}
	}
	.title{
		font-size:28rpx;
		color:#999;
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
				padding:25rpx 0;
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
					font-size:27rpx;
					color:#999;
					margin-right:40rpx;
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
					border: 1rpx solid $uni-btn-bg-color;
					background:#fff;
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
					color:#0287FF;
				}
			}
			.time_warp{
				margin:0 auto;
				width:600rpx;
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
			border: 1px solid $uni-btn-bg-color;
			background:#fff;
			color:$uni-text-color;
		}
	}
</style>
