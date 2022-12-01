<template>
	<uni-drawer ref="showRight" mode="right" :width="drWidth">
		<view class="title">筛选</view>
		<scroll-view scroll-y class="scrollbox">
			<view class="scr_warp">
				<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
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
					<search-item :searchForm="searchForm" v-if="searchForm" @changeSearchData="changeSearchData" @chageResize="chageResize"></search-item>
				</uni-collapse>
			</view>
		</scroll-view>
		<view class="screenbot">
			<view class="screenbtn" @click="reset">重置</view>
			<view class="screenbtn surebtn" @click="sure">确认</view>
		</view>
	</uni-drawer>
</template>

<script>
	import searchItem from '@/components/searchScreen/searchitem.vue'
	
	export default{
		components:{
			searchItem
		},
		props:{
			searchForm:{
				type:Array,
				default:null
			}
		},
		data() {
			return{
				start_time:'',
				end_time:'',
				drWidth:uni.upx2px(660),
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
				activeNames:[],
			}
		},
		methods:{
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			open(obj) {
				this.$refs.showRight.open()
			},
			close() {
				this.$refs.showRight.close()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
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
			changeSearchData(type,key,value){
				this.$emit('changeSearchData',type,key,value)
			},
			chageResize() {
				this.init()
			},
			reset() {
				this.start_time = ''
				this.end_time = ''
				this.timeIndex = null
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
					createtime:times,
				}
				this.close()
				this.$emit('sureParams',params)
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