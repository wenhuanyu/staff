<template>
	<view class="collect">
		<view class="time_collect">
			<!-- 筛选条件 -->
			<view class="collect-tab">
				<view class="pre_list">
					<picker @change="changePeople" :range="peopleArr" :value="peopleIndex">
						<view class="form_right">
							<view style="margin-right:15rpx">{{peopleArr[peopleIndex] ? peopleArr[peopleIndex] : '点击选择'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
					<picker mode="date" fields="year" @change="changeYear" v-if="peopleIndex == 0">
						<view class="form_right">
							<view style="margin-right:15rpx">{{dateyear ? dateyear+'年' : '点击选择'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
					
					<view v-if="peopleIndex == 1" class="rightlist">
						<view class="libox">
							<picker :range="typeList" :value="typeIndex" @change="changeType" >
								<view class="form_right">
									<view style="margin-right:15rpx">{{typeList[typeIndex] ? typeList[typeIndex] : '点击选择'}}</view>
									<view class="iconfont icon-you"></view>
								</view>
							</picker>
						</view>
						<view class="libox">
							<picker mode="date" fields="year" @change="changeTypeyear" v-if="typeIndex == 0">
								<view class="form_right">
									<view style="margin-right:15rpx">{{typeYear ? typeYear+'年' : '点击选择'}}</view>
									<view class="iconfont icon-you"></view>
								</view>
							</picker>
						</view>
						<view class="libox">
							<picker mode="date" fields="month" @change="changeDataTime" v-if="typeIndex == 1">
								<view class="form_right">
									<view style="margin-right:15rpx">{{dataTime ? dataTime : '点击选择'}}</view>
									<view class="iconfont icon-you"></view>
								</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 数据 -->
			<view class="achievement_footer" v-if="peopleIndex == 0">
				<view class="footer_table">
					<view class="table_time">
						<view class="item_title">时间</view>
						<view class="time_item" v-for="(item,index) in list" :key="index">
							<view>{{item.month}}</view>
						</view>
					</view>
					<scroll-view scroll-x="true" class="scroll">
						<view class="con_title">
							<view class="title_head">新增线索</view>
							<view class="title_head">新增客户</view>
							<view class="title_head">新增合同</view>
						</view>
						<view class="con_content">
							<view class="content_item" v-for="(item,index) in list" :key="index">
								<view class="con_data" @click="jumpClues(index)">{{item.leads}}</view>
								<view class="con_data" @click="jumpCustomerList(index)">{{item.customers}}</view>
								<view class="con_data" @click="jumpContract(index)">{{item.contracts}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="achievement_footer" v-if="peopleIndex == 1">
				<view class="footer_table">
					<view class="table_time">
						<view class="item_title">姓名</view>
						<view class="time_item" v-for="(item,index) in list" :key="index">
							<view>{{item.name}}</view>
						</view>
					</view>
					<scroll-view scroll-x="true" class="scroll">
						<view class="con_title">
							<view class="title_head">新增线索</view>
							<view class="title_head">新增客户</view>
							<view class="title_head">新增合同</view>
						</view>
						<view class="con_content">
							<view class="content_item" v-for="(item,index) in list" :key="index">
								<view class="con_data" @click="jumpTeamClues(item)">{{item.leads}}</view>
								<view class="con_data" @click="JumpTeam(item)">{{item.customers}}</view>
								<view class="con_data" @click="jumpTeamContract(item)">{{item.contracts}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netAddDataRank, netPersonalData, netTeamData } from '@/api/api.js'
	import { getNowData } from '@/utils/weekTime.js'
	import { getCurrentMonthDay } from '@/utils/util.js'
	export default {
		data() {
			return {
				people_show: false,
				time_show: false,
				peopleArr:['仅本人','本人及下属'],
				peopleIndex:0,
				dateyear:'',  //年
				dataTime:'',
				
				list:[],
				//本人及下属   按年还是按月 筛选
				typeList:['按年','按月'],
				typeIndex:0,
				typeYear:''
			}
		},
		onShow() {
			let date = new Date()
			let year = date.getFullYear()
			this.dateyear = year
			this.typeYear = year
			
			this.dataTime = getNowData().substr(0,7)
			if(this.peopleIndex == 0) {
				this.getData()
			}else{
				this.getTeamData()
			}
		},
		methods: {
			changeYear(e) {
				this.dateyear = e.detail.value
				this.getData()
			},
			getData() {
				netPersonalData({date:this.dateyear}).then(res=>{
					this.list = res.data
				})
			},
			getTeamData() {
				let params = {
					date: this.typeIndex == 0 ? this.typeYear : this.dataTime
				}
				netTeamData(params).then(res=>{
					this.list = res.data
				})
			},
			changePeople(e) {
				this.peopleIndex = e.detail.value
				if(this.peopleIndex == 0) {
					this.getData()
				}else{
					this.getTeamData()
				}
			},
			changeDataTime(e) {
				this.dataTime = e.detail.value
				this.getTeamData()
			},
			handleTime(time) {
				let year = time.slice(0,time.indexOf('-'))
				let month = time.slice(time.indexOf('-')+1)
				let obj = getCurrentMonthDay(year,month)
				return obj
			},
			//本人及  下属  按年 还是按月  筛选
			changeType(e) {
				this.typeIndex = e.detail.value
				this.getTeamData()
			},
			changeTypeyear(e) {
				this.typeYear = e.detail.value
				this.getTeamData()
			},
			//客户  列表  个人
			jumpCustomerList(index) {
				let time = this.list[index].month
				let obj = this.handleTime(time)
				uni.navigateTo({
					url:'/pagesA/crm/customerManagement/customerManagement?type='+this.peopleIndex+'&startTime='+obj.startTime+'&endTime='+obj.endTime
				})
			},
			// 客户  列表   团队
			JumpTeam(item) {
				let obj = {}
				if(this.typeIndex == 0) {
					obj = {
						startTime: this.typeYear+'-01-01',
						endTime: this.typeYear+'-12-31'
					}
				}else{
					let time = this.dataTime
					obj = this.handleTime(time)
				}
				let staffid = item.id
				uni.navigateTo({
					url:'/pagesA/crm/customerManagement/customerManagement?type='+this.peopleIndex+'&startTime='+obj.startTime+'&endTime='+obj.endTime+'&staffid='+staffid
				})
			},
			//线索 列表  个人
			jumpClues(index) {
				let time = this.list[index].month
				let obj = this.handleTime(time)
				uni.navigateTo({
					url:'/pagesA/crm/cluesManagement/cluesManagement?type='+this.peopleIndex+'&startTime='+obj.startTime+'&endTime='+obj.endTime
				})
			},
			//线索  列表  团队
			jumpTeamClues(item) {
				let obj = {}
				if(this.typeIndex == 0) {
					obj = {
						startTime: this.typeYear+'-01-01',
						endTime: this.typeYear+'-12-31'
					}
				}else{
					let time = this.dataTime
					obj = this.handleTime(time)
				}
				let staffid = item.id
				uni.navigateTo({
					url:'/pagesA/crm/cluesManagement/cluesManagement?type='+this.peopleIndex+'&startTime='+obj.startTime+'&endTime='+obj.endTime+'&staffid='+staffid
				})
			},
			//合同  列表  个人
			jumpContract(index) {
				let time = this.list[index].month
				let obj = this.handleTime(time)
				uni.navigateTo({
					url:'/pages/index/contract/contract?type='+this.peopleIndex+'&startTime='+obj.startTime+'&endTime='+obj.endTime
				})
			},
			jumpTeamContract(item) {
				let obj = {}
				if(this.typeIndex == 0) {
					obj = {
						startTime: this.typeYear+'-01-01',
						endTime: this.typeYear+'-12-31'
					}
				}else{
					let time = this.dataTime
					obj = this.handleTime(time)
				}
				let staffid = item.id
				uni.navigateTo({
					url:'/pages/index/contract/contract?type='+this.peopleIndex+'&startTime='+obj.startTime+'&endTime='+obj.endTime+'&staffid='+staffid
				})
			}
		},
		onReady() {
			
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style scoped lang="scss">
	.collect-tab{
		background:#fff;
		.pre_list{
			display:flex;
			justify-content: space-between;
			align-items: center;
			padding:20rpx 30rpx;
			.pre_title {
				font-size: 28rpx;
				font-weight: 700;
			}
			.form_right{
				// width:220rpx;
				height:40rpx;
				font-size:24rpx;
				color:#333;
				text-align: center;
				line-height: 38rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.rightlist{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.libox{
					margin-left:24rpx;
				}
			}
		}
	}
	
	.collect {
		.time_collect,
		.people_collect {
			.line_header {
				background-color: #fff;

				.scroll {
					white-space: nowrap;
					width: 750rpx;
					overflow: hidden;

					.line_chart {
						height: 600rpx;
						width: 2000rpx;
					}
				}
			}

			.achievement_body {
				margin: 30rpx;

				.achievement_title {
					border-radius: 10rpx;
					padding: 20rpx 0 40rpx;
					background-color: #fff;
					display: flex;
					text-align: center;

					.title_item {
						width: 33.33%;

						:first-child {
							padding: 20rpx;
							color: #ccc;
						}
					}
				}
			}

			.achievement_footer {
				margin:20rpx 0 30rpx;
				overflow: hidden;
				.footer_table {
					display: flex;

					.table_time {
						width: 150rpx;
						white-space: nowrap;
						.item_title {
							padding-left: 20rpx;
							font-weight: 700;
							height: 90rpx;
							line-height: 90rpx;
							border: 1rpx solid #f2f2f2;
							border-right: 0;
						}
						.time_item {
							padding-left: 20rpx;
							height: 90rpx;
							line-height: 90rpx;
							background-color: #fff;
							border-bottom: 1rpx solid #EAEAEA;

						}
					}
					.scroll {
						white-space: nowrap;
						width: 600rpx;
						overflow: hidden;
						.con_title {
							.title_head {
								display: inline-block;
								width: 200rpx;
								height: 90rpx;
								line-height: 90rpx;
								text-align: center;
								border-top: 1rpx solid #f2f2f2;
								border-bottom: 1rpx solid #f2f2f2;
							}

							:last-child {
								border-right: 1rpx solid #f2f2f2;
							}
						}

						.con_content {
							.content_item {
								.con_data {
									display: inline-block;
									width: 200rpx;
									height: 90rpx;
									line-height: 90rpx;
									text-align: center;
									background-color: #fff;
									border-bottom: 1rpx solid #EAEAEA;
								}
							}
						}
					}
				}
			}
		}

		.pagination_demo {
			background-color: #fff;
			padding: 30rpx 60rpx;
			margin: 0 30rpx;
		}

		.van_po {
			position: absolute;
			.screen_con {
				z-index: 9999;
				background-color: #fff;

				.screen_title {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 20rpx 20rpx 24rpx;
					border-bottom: 1rpx solid #EAEAEA;

					:first-child {
						font-size: 28rpx;
						font-weight: 700;
					}
				}

				.screen_style {
					.style_title {
						padding-left: 24rpx;
						padding-top: 30rpx;
					}

					.style_con {
						display: flex;
						width: 560rpx;
						flex-wrap: wrap;
						text-align: center;
						padding-left: 9rpx;

						.style_item {
							width: 150rpx;
							height: 60rpx;
							line-height: 60rpx;
							border: 1rpx solid #f4f4f4;
							margin: 15rpx 15rpx;
							color: #b6b6b6;
						}

						.type_active,
						.time_active {
							border: 1rpx solid #52c1f5;
							color: #52c1f5;
						}
					}

					

					.aff_con {
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						padding-top: 30rpx;

						.aff_item {
							width: 25%;

							.aff_img {
								margin-bottom: 15rpx;
								margin-left: 44rpx;
								width: 50rpx;
								height: 50rpx;
							}
						}

						.aff_last {
							.aff_img {
								margin-bottom: 15rpx;
								margin-left: 30rpx;
								width: 80rpx;
								height: 50rpx;
							}
						}
					}
				}
				
				.style_input {
					margin: 20rpx;
					border: 1rpx solid #EAEAEA;
					padding-left: 24rpx;
					width: 600rpx;
				
					input {
						display: inline-block;
						height: 80rpx;
					}
				}
			}
		}

		.button_bottom {
			display: flex;
			position: fixed;
			width: 100%;
			bottom: 0;
			right: 0;
			left: 0;
			font-size: 32rpx;
			height: 90rpx;
			text-align: center;

			.reset {
				flex: 1;
				line-height: 90rpx;
				color: #1e89fe;
			}

			.sure {
				flex: 1;
				line-height: 90rpx;
				background-color: $uni-text-color;
				color: #fff;
			}

		}
	}
</style>
