<template>
	<view class="">
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse ref="collapse" v-model="activeNames" @change="onChange">
						<uni-collapse-item title="是否已读状态" name="a">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == readIndex ?'liactive':''" 
									@click="changeRead(index)"
									v-for="(item,index) in readList" 
									:key="index">{{item}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="跟进类型" name="c">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == typeIndex ?'liactive':''" 
									@click="changeType(index)"
									v-for="(item,index) in typeList" 
									:key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="客户" name="b" v-if="typeList[typeIndex] && typeList[typeIndex].id == 1">
							<view class="listwarp">
								<view class="li" :class="customerObj ?'liactive':''" @click.stop="toSelectCustomer">
									{{customerObj?customerObj.name:'选择客户'}}
									<view class="clearStaff" v-if="customerObj" @click.stop="clearCustomer">×</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="联系人" name="b" v-if="typeList[typeIndex] && typeList[typeIndex].id == 2">
							<view class="listwarp">
								<view class="li" :class="linkObj ?'liactive':''" @click.stop="toSelectLink">
									{{linkObj?linkObj.name:'选择联系人'}}
									<view class="clearStaff" v-if="linkObj" @click.stop="linkObj = null">×</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="合同" name="b" v-if="typeList[typeIndex] && typeList[typeIndex].id == 3">
							<view class="listwarp">
								<view class="li" :class="contractObj ?'liactive':''" @click.stop="toSelectContract">
									{{contractObj?contractObj.name:'选择合同'}}
									<view class="clearStaff" v-if="contractObj" @click.stop="contractObj = null">×</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="线索" name="b" v-if="typeList[typeIndex] && typeList[typeIndex].id == 4">
							<view class="listwarp">
								<view class="li" :class="clueObj ?'liactive':''" @click.stop="toSelectClue">
									{{clueObj?clueObj.name:'选择线索'}}
									<view class="clearStaff" v-if="clueObj" @click.stop="clueObj = null">×</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="商机" name="b" v-if="typeList[typeIndex] && typeList[typeIndex].id == 5">
							<view class="listwarp">
								<view class="li" :class="busObj ?'liactive':''" @click.stop="toSelectBus">
									{{busObj?busObj.name:'选择商机'}}
									<view class="clearStaff" v-if="busObj" @click.stop="busObj = null">×</view>
								</view>
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
			<!-- 选择联系人 -->
			<select-link ref="linkChild" @sureContact="linkInfo"></select-link>
			<!-- 选择合同 -->
			<select-contract ref="contractChild" @contractInfo="contractInfo"></select-contract>
			<!-- 选择线索 -->
			<select-clue ref="clueChild" @clueInfo="clueInfo"></select-clue>
			<!-- 关联商机 -->
			<select-business ref="businessChild" @sureBusiness="sureBusiness"></select-business>
		</uni-drawer>
	</view>
</template>

<script>
	import selectLink from '@/components/select_contact.vue'
	import selectContract from '@/components/selectContract.vue'
	import selectClue from '@/components/selectClue.vue'
	import { netContact } from '@/api/api.js'
	import selectBusiness from '@/components/selectBusiness.vue'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	
	export default{
		mixins:[commonFun],
		components:{
			selectLink,
			selectContract,
			selectClue,
			selectBusiness
		},
		props:{
			
		},
		data() {
			return{
				drWidth:uni.upx2px(660),
				readList:['全部','已读','未读'],
				readIndex:0,   //是否已读
				linkObj:null,   //联系人
				contractObj:null,   //合同
				clueObj:null,   //线索
				busObj:null,   //商机
				typeList:[
					{ id:'1', name:'客户'},
					{ id:'5', name:'商机'},
					{ id:'2', name:'联系人'},
					{ id:'3', name:'合同'},
					{ id:'4', name:'线索'}
				],
				typeIndex:null,
				start_time:'',  //开始时间
				end_time:'',  //结束时间
				showIndex:1,
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
				activeNames:[]
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
		}),
		methods:{
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			open(obj) {
				this.$refs.showRight.open()
				if(obj.times){
					this.handleParams(obj)
				}
			},
			handleParams(obj) {
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
			close() {
				this.$refs.showRight.close()
			},
			changeRead(index) {
				this.readIndex = index
			},
			changeType(index) {
				this.typeIndex = index
			},
			//选择关联联系人
			toSelectLink() {
				this.$refs.linkChild.init()
			},
			linkInfo(obj) {
				console.log(obj,'123')
				this.linkObj = obj
			},
			//选择合同
			toSelectContract() {
				this.$refs.contractChild.init()
			},
			contractInfo(obj) {
				this.contractObj = obj
			},
			//选择关联线索
			toSelectClue() {
				this.$refs.clueChild.init()
			},
			clueInfo(obj) {
				this.clueObj = obj
			},
			//选择关联 商机
			toSelectBus() {
				this.$refs.businessChild.init()
			},
			sureBusiness(obj) {
				this.busObj = obj
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
			clearCustomer() {
				this.$store.commit('CUSTOMEROBJ',null)
			},
			reset() {
				this.start_time = ''
				this.end_time = ''
				this.timeIndex = null
				this.$store.commit('CUSTOMEROBJ',null)
				this.typeIndex = null
				this.linkObj = null
				this.contractObj = null
				this.clueObj = null
				this.busObj = null
				this.readIndex = 0
			},
			sure() {
				let linkid = ''
				if(this.typeList[this.typeIndex]){
					if(this.typeList[this.typeIndex].id == 1){
						linkid = this.customerObj?this.customerObj.id:''
					}else if(this.typeList[this.typeIndex].id == 2){
						linkid = this.linkObj?this.linkObj.id:''
					}else if(this.typeList[this.typeIndex].id == 3){
						linkid = this.contractObj?this.contractObj.id:''
					}else if(this.typeList[this.typeIndex].id == 4){
						linkid = this.clueObj?this.clueObj.id:''
					}else if(this.typeList[this.typeIndex].id == 5){
						linkid = this.busObj?this.busObj.id:''
					}
				}
				let times = ''
				if(this.timeList[this.timeIndex] && (this.timeList[this.timeIndex].value != 'zidingyi')){
					times = this.timeList[this.timeIndex].value
				}else{
					times = (this.start_time && this.end_time) ?  this.start_time+','+this.end_time : ''
				}
				let params = {
					times,
					is_read: this.readIndex,
					relation_type:this.typeList[this.typeIndex]?this.typeList[this.typeIndex].id:'',
					relation_id:linkid
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