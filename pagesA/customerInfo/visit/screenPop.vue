<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse v-model="activeNames" @change="onChange" ref="collapse">
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
						<uni-collapse-item title="任务状态" name="a">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == taskStatus ?'liactive':''" 
									@click="changeStatus(index)" 
									v-for="(item,index) in taskList" 
									:key="index"
									>{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="类型" name="b">
							<view class="listwarptype">
								<view 
									class="li" 
									:class="item.field == typeName ?'liactive':''" 
									@click="changeFollow(item)" 
									v-for="(item,index) in visitType" 
									:key="index"
									>{{item.field}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="时间" name="c">
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
	import { netSelect } from '@/api/api.js'
	import { netTemplateList } from '@/api/template.js'
	
	export default {
		props: {
			showScreen: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				activeNames:[],
				//任务状态
				taskList:[
					{id:0,name:'未开始'},
					{id:1,name:'进行中'},
					{id:2,name:'已结束'},
					{id:3,name:'任务失败'}
				],
				taskStatus:null,
				typeList:[
					{id:0,name:'本人及下属'},
					{id:1,name:'仅本人'},
					{id:2,name:'仅下属'},
				],
				typeIndex:null,
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
				visitType:[],
				typeName:'',
			}
		},
		created() {
			//获取 任务类型
			this.getType()
		},
		methods: {
			open(obj) {
				if(obj.type){
					//处理默认的参数
					this.handleParams(obj)
				}
				this.$refs.showRight.open()
			},
			handleParams(obj) {
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
			getType() {
				netTemplateList({type:'任务内容'}).then(res=>{
					this.visitType = res.data.template
				})
			},
			changeFollow(item) {
				this.typeName = item.field
			},
			changeType(index) {
				this.typeIndex = index
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
			//任务状态
			changeStatus(e) {
				this.taskStatus = e
			},
			reset() {
				this.start_time = ''
				this.end_time = ''
				this.typeIndex = null
				this.timeIndex = null
				this.typeName = ''
				this.taskStatus = null
			},
			sure() {
				let times = ''
				if(this.timeList[this.timeIndex] && (this.timeList[this.timeIndex].value != 'zidingyi')){
					times = this.timeList[this.timeIndex].value
				}else{
					times = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
				}
				let params = {
					times,
					event_type:this.typeName,
					type:this.typeList[this.typeIndex]?this.typeList[this.typeIndex].id:'',
					status:this.taskList[this.taskStatus]?this.taskList[this.taskStatus].id:''
				}
				this.close()
				this.$emit('sureQuery',params)
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			close() {
				this.$refs.showRight.close()
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
					border: 1px solid $uni-btn-bg-color;
				}
			}
			.listwarptype{
				width:600rpx;
				margin:auto;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.li{
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0 10rpx;
					height: 54rpx;
					background: #ededed;
					border: 1rpx solid #ededed;
					border-radius: 10rpx;
					font-size:28rpx;
					color:#999;
					margin-right:20rpx;
					margin-bottom:20rpx;
				}
				.liactive{
					color:#666;
					background:#fff;
					border: 1px solid $uni-btn-bg-color;
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
