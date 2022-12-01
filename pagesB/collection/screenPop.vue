<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
						<uni-collapse-item title="收款状态" v-if="type == 1" name="a">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == tabIndex ?'liactive':''" 
									@click="changeStatus(index)" 
									v-for="(item,index) in tablist" 
									:key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="回款状态" v-if="type == 2" name="b">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == tabIndexTwo ?'liactive':''" 
									@click="changeStatusTwo(index)" 
									v-for="(item,index) in tablistTwo" 
									:key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="所属" name="c">
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
	
	export default {
		props:{
			type:{
				type:Number/String,
				default:1
			}
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				//状态
				tablist:[
					{id:0,name:'未收款'},
					{id:1,name:'已收款'}
				],
				tabIndex:null,
				tablistTwo:[
					{id:1,name:'待审核'},
					{id:2,name:'审核通过'},
					{id:3,name:'审核拒绝'}
				],
				tabIndexTwo:null,
				activeNames:[],
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
			}
		},
		created() {
		},
		methods: {
			open(obj) {
				this.$refs.showRight.open()
				if(obj.type){
					this.handleParams(obj)
				}
			},
			handleParams(obj) {
				//审核状态
				this.tablistTwo.forEach((ele,index)=>{
					if(ele.id == obj.check_status){
						this.tabIndexTwo = index
					}
				})
				//成交状态
				this.typeIndex = obj.type
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
			reset() {
				this.tabIndex = null
				this.tabIndexTwo = null
				this.timeIndex = null
				this.start_time = ''
				this.end_time = ''
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
			//状态
			changeStatus(index) {
				this.tabIndex = index
			},
			changeStatusTwo(index) {
				this.tabIndexTwo = index
			},
			sure() {
				let params = {}
				let times = ''
				if(this.timeList[this.timeIndex] && (this.timeList[this.timeIndex].value != 'zidingyi')){
					times = this.timeList[this.timeIndex].value
				}else{
					times = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
				}
				if(this.type == 1){
					params = {
						is_financial_audit:this.tablist[this.tabIndex]?this.tablist[this.tabIndex].id:'',
						type:this.typeList[this.typeIndex]?this.typeList[this.typeIndex].id:'',
						times
					}
				}else{
					params = {
						check_status:this.tablistTwo[this.tabIndexTwo]?this.tablistTwo[this.tabIndexTwo].id:'',
						type:this.typeList[this.typeIndex]?this.typeList[this.typeIndex].id:'',
						times
					}
				}
				this.$refs.showRight.close()
				this.$emit('sureQuery',params)
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
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
