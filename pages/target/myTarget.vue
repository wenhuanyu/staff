<template>
	<view>
		<view class="sales_head">
			<picker @change="changeTime" :value="valueTime" :range-key="'name'" :range="optionsTime">
				<view class="tablist">
					<view>{{optionsTime[valueTime] ? optionsTime[valueTime].name : '时间'}}</view>
					<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg"  mode="scaleToFill"></image>
				</view>
			</picker>
			<picker @change="changeTopMoney" :value="valueMoney" :range-key="'text'" :range="optionsMoney">
				<view class="tablist">
					<view>{{optionsMoney[valueMoney] ? optionsMoney[valueMoney].text : '金额'}}</view>
					<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg"  mode="scaleToFill"></image>
				</view>
			</picker>
		</view>
		<view class="btnwarp">
			<view class="history" @click="toHistory">历史修改记录</view>
		</view>
		<view class="sales_con">
			<!-- 年度目标模块 -->
			<view class="annual_tar">
				<view class="annual_item">
					<view>年度目标</view>
					<view v-if="!isSet">{{info ? info.yeartarget : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" v-model="info.yeartarget" @blur="handelMoney"
							@input="check" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>1月</view>
					<view v-if="!isSet">{{info ? info.january : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check1" v-model="info.january" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>2月</view>
					<view v-if="!isSet">{{info ? info.february : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check2" v-model="info.february" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>3月</view>
					<view v-if="!isSet">{{info ? info.march : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check3" v-model="info.march" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>4月</view>
					<view v-if="!isSet">{{info ? info.april : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check4" v-model="info.april" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>5月</view>
					<view v-if="!isSet">{{info ? info.may : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check5" v-model="info.may" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>6月</view>
					<view v-if="!isSet">{{info ? info.june : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check6" v-model="info.june" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>7月</view>
					<view v-if="!isSet">{{info ? info.july : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check7" v-model="info.july" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>8月</view>
					<view v-if="!isSet">{{info ? info.august : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check8" v-model="info.august" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>9月</view>
					<view v-if="!isSet">{{info ? info.september : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check9" v-model="info.september" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>10月</view>
					<view v-if="!isSet">{{info ? info.october : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check10" v-model="info.october" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>11月</view>
					<view v-if="!isSet">{{info ? info.november : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check11" v-model="info.november" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<view class="annual_item">
					<view>12月</view>
					<view v-if="!isSet">{{info ? info.december : '0'}}</view>
					<view v-if="isSet">
						<input type="digit" @input="check12" v-model="info.december" @confirm="changeMoney"
							@blur="changeMoney" placeholder="请填写目标金额" />
					</view>
				</view>
				<!-- 审核信息 -->
				<view class="" v-if="isSet">
					<!-- 固定审批 -->
					<fixed-approval v-if="approvalPro.status == 1" :list="approvalPro.stepList"></fixed-approval>
					<!-- 审核信息 -->
					<examine-people v-if="approvalPro.status == 0" :list="remindPeople" @delItem="delItem"></examine-people>
				</view>
			</view>
		</view>
		<view style="height:100rpx"></view>
		<view class="bot_btn">
			<view class="submit" v-if="isSet" @click="$noMultipleClicks(submitdata)">提交</view>
			<view class="btnself" :class="isSet?'bg':''" @click="isSet = !isSet">{{isSet?'取消修改':'修改目标'}}</view>
		</view>
	</view>
</template>

<script>
	import {
		netGetDefaultSelfDetail,
		netGetTargetSelect,
		netSetMymubiao,
		netApprovalProcess
	} from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate.js'
	export default {
		mixins:[commonFun],
		data() {
			return {
				optionsMoney: [
					{
						text: '销售金额',
						value: 1
					},
					{
						text: '回款金额',
						value: 2
					},
					{
						text: '获客目标',
						value: 3
					},
					{
						text: '拜访目标',
						value: 4
					}
				],
				noClick: true, //防止  重复点击
				optionsTime: [],
				valueTime: 0,
				valueMoney: 0,
				roleType: '',
				rules: '',
				info: null, //个人或团队  默认数据
				isSet: false, //是否设置  个人目标
				remindPeople: [], //提醒谁看\
				examineType:'achievement',
				BASE_IMG_URL: BASE_IMG_URL,
				approvalPro:{},   //审批流程
				type:3,  //3员工 2团队
			}
		},
		onLoad(options) {
			this.type = options.type
			if(this.type == 3){
				uni.setNavigationBarTitle({
					title:'个人目标'
				})
			}else if(this.type == 2) {
				uni.setNavigationBarTitle({
					title:'团队目标'
				})
			}
			this.roleType = uni.getStorageSync('roleType')
			this.rules = uni.getStorageSync('rules')
			this.getSelect()
			//审批流程
			this.getProcess()
		},
		onShow() {
			if(this.approvalPro.status == 0){
				this.getDefaultRemind()
			}
		},
		methods: {
			//审批流程
			getProcess() {
				netApprovalProcess({type:'achievement'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0) {
						this.getDefaultRemind()
					}
				})
			},
			//历史记录
			toHistory() {
				uni.navigateTo({
					url: '/pages/target/history_edit?type='+this.type
				})
			},
			getSelect() {
				netGetTargetSelect().then(res => {
					res = res.data.years
					res.forEach((ele, index) => {
						if (ele.selected) {
							this.valueTime = index
						}
					})
					this.optionsTime = res
					this.getMydetail()
				})
			},
			changeTime(e) {
				this.valueTime = e.detail.value
				this.getMydetail()
			},
			changeTopMoney(e) {
				this.valueMoney = e.detail.value
				this.getMydetail()
			},
			getMydetail() {
				let params = {
					year: this.optionsTime[this.valueTime].name,
					status: this.optionsMoney[this.valueMoney].value,
					type: this.type
				}
				netGetDefaultSelfDetail(params).then(res => {
					let resinfo = res.data
					if (resinfo) {
						this.info = resinfo
					} else {
						this.info = {
							january: 0,
							february: 0,
							march: 0,
							april: 0,
							may: 0,
							june: 0,
							july: 0,
							august: 0,
							september: 0,
							october: 0,
							november: 0,
							december: 0,
							yeartarget: 0
						}
					}
				})
			},
			//计算每个月份平均值
			handelMoney(e) {
				console.log('失去焦点')
				let totalnum = this.info.yeartarget
				let avernum = 0
				let status = this.optionsMoney[this.valueMoney].value
				if(status == 1 || status == 2){
					avernum = (Number(totalnum) / 12).toFixed(2)
				}else{
					avernum = Math.floor((Number(totalnum) / 12))
				}
				let obj = {
					january: avernum,//1月
					february: avernum, //2月
					march: avernum, //3
					april: avernum, //4月
					may: avernum, //5月
					june: avernum, //6月
					july: avernum, //7月
					august: avernum, //8月
					september: avernum, //9月
					october: avernum, //10月
					november: avernum, //11月
					december: avernum, //12月
				}
				this.info = Object.assign({},this.info,obj)
			},
			//正则控制小数点后只能输入两位
			check: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.yeartarget = e.target.value
				})
			},
			check1: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.january = e.target.value
				})
			},
			check2: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.february = e.target.value
				})
			},
			check3: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.march = e.target.value
				})
			},
			check4: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.april = e.target.value
				})
			},
			check5: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.may = e.target.value
				})
			},
			check6: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.june = e.target.value
				})
			},
			check7: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.july = e.target.value
				})
			},
			check8: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.august = e.target.value
				})
			},
			check9: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.september = e.target.value
				})
			},
			check10: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.october = e.target.value
				})
			},
			check11: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.november = e.target.value
				})
			},
			check12: function(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.info.december = e.target.value
				})
			},
			changeMoney() {
				let money = 
				Number(this.info.january)
				 + Number(this.info.february)
				  + Number(this.info.march)
				   + Number(this.info.april)
					+ Number(this.info.may)
					 + Number(this.info.june)
					  + Number(this.info.july)
					   + Number(this.info.august)
						+ Number(this.info.september)
						 + Number(this.info.october)
						  + Number(this.info.november)
						   + Number(this.info.december)
				this.info.yeartarget = money.toFixed(2)
			},
			submitdata() {
				let achievements = {
					january: this.info.january,
					february: this.info.february,
					march: this.info.march,
					april: this.info.april,
					may: this.info.may,
					june: this.info.june,
					july: this.info.july,
					august: this.info.august,
					september: this.info.september,
					october: this.info.october,
					november: this.info.november,
					december: this.info.december,
					yeartarget: this.info.yeartarget
				}
				let remindPeople = this.remindPeople //提醒谁看
				if (remindPeople.length == 0 && this.approvalPro.status == 0) {
					uni.showToast({
						title: '请选择审核人',
						icon: 'none'
					})
					return
				}
				let newArr = []
				remindPeople.forEach(ele => {
					newArr.push(ele.id)
				})
				let params = {
					year: this.optionsTime[this.valueTime].name,
					status: this.optionsMoney[this.valueMoney].value,
					achievements,
					flow_staff_ids:this.approvalPro.status == 0 ? newArr.join(',') : '',
					yeartarget:this.info.yeartarget,
					type:this.type
				}
				netSetMymubiao(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					this.isSet = false
					setTimeout(()=>{
						uni.navigateTo({
							url:'/pages/target/history_edit?type='+this.type
						})
					},2000)
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.btnwarp {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 20rpx 24rpx;

		.history {
			font-size: 28rpx;
			color: $uni-text-color;
		}
	}

	// 目标模块
	.submit {
		width: 200rpx;
		height: 70rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
		line-height: 70rpx;
		background: $uni-text-color;
		margin-right: 24rpx;
	}

	.annual_tar {
		.annual_item {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 100rpx;
			background-color: #fff;
			padding: 0 30rpx;
			border: 1rpx solid #EAEAEA;

			view:first-child {
				font-size: 28rpx;
				width: 200rpx;
				text-align: center;
			}

			view:last-child {
				width: 400rpx;
				text-align: center;

				input {
					width: 400rpx;
					border-radius: 40rpx;
					border: 1rpx solid #CCC;
					padding: 10rpx 15rpx;
					font-size: 24rpx;
					color: #333;
				}
			}
		}
	}

	.sales_head {
		border-top: 1rpx solid #CCC;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 20rpx 24rpx;
		background: #fff;

		.tablist {
			padding: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: #333;

			.bottomimg {
				width: 20rpx;
				height: 33rpx;
				margin-left: 20rpx;
			}
		}
	}

	.bot_btn {
		position: fixed;
		left: 0;
		bottom: 0;
		background: #fff;
		width: 750rpx;
		height: 100rpx;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1rpx solid #EAEAEA;
		z-index: 2;

		.btnself {
			width: 200rpx;
			height: 70rpx;
			border-radius: 40rpx;
			font-size: 24rpx;
			color: #fff;
			text-align: center;
			line-height: 70rpx;
			background: $uni-text-color;
		}

		.bg {
			background: #ff7800;
		}
	}

	.sales_con {
		padding: 0rpx 20rpx 20rpx;

		.sales_item {
			background-color: #fff;
			border-radius: 10rpx;
			display: flex;
			padding: 20rpx 35rpx 30rpx 24rpx;
			align-items: center;
			margin-bottom: 20rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);

			.item_check {
				width: 60rpx;
			}

			.item_img {
				width: 80rpx;

				image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}

			.item_name {
				flex: 1;
				line-height: 40rpx;

				:first-child {
					font-size: 28rpx;
				}

				:last-child {
					color: #999;
					font-size: 24rpx;
				}
			}

			.item_monery {
				width: 100rpx;
				color: #999;
			}
		}
	}

	.bottom_select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		height: 120rpx;
		padding: 0 24rpx;
		border-top: 1rpx solid #CCC;

		.select_num {
			width: 450rpx;

			.select_box {
				width: 450rpx;

				.selectlist {
					display: flex;
					justify-content: flex-start;
					align-items: center;
				}

				.select_item {
					flex-shrink: 0;
					width: 100rpx;
					font-size: 24rpx;
					color: #666;
					text-align: center;
					margin-right: 15rpx;

					image {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
					}
				}
			}
		}

		.rightbtn {
			width: 240rpx;
			height: 80rpx;
			border-radius: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.sure {
				width: 120rpx;
				height: 80rpx;
				border-top-left-radius: 40rpx;
				border-bottom-left-radius: 40rpx;
				background: $uni-text-color;
				font-size: 26rpx;
				color: #fff;
				text-align: center;
				line-height: 80rpx;
			}

			.selectall {
				width: 120rpx;
				height: 80rpx;
				border-top-right-radius: 40rpx;
				border-bottom-right-radius: 40rpx;
				background: #ff7800;
				font-size: 26rpx;
				color: #fff;
				text-align: center;
				line-height: 80rpx;
			}
		}
	}

	.affiliation {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding-bottom: 40rpx;

		.aff_head {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 30rpx;

			text {
				color: #f00;
				margin-left: 10rpx;
			}
		}

		.aff_con {
			display: flex;
			text-align: center;
			flex-wrap: wrap;
			padding:0 30rpx;
			.aff_item {
				width: 100rpx;
				margin-right: 15rpx;

				image {
					margin-bottom: 15rpx;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}

			.affbox {
				position: relative;

				.delremind {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					position: absolute;
					right: -16rpx;
					top: -16rpx;
					background: rgba(0, 0, 0, 0.5);
					z-index: 2;
				}
			}

			.aff_last {
				width: 48rpx;
				height: 48rpx;
				border-radius: 50%;
				text-align: center;
				image {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}
</style>
