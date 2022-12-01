<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">开始工作时间<span>*</span></view>
			<view class="form_right" >
				<select-time-picker
					fields="minute" 
					placeholder="开始工作时间" 
					:defaultValue="start_time"
					@change="changeStarttime"
				></select-time-picker>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">维修结果<span>*</span></view>
			<view class="form_right">
				<radio-group class="radiowarp" @change="changeResolved">
					<view class="">
						<radio value="1" color="#008EFF" :checked="resolved_results == 1" />已解决
					</view>
					<view class="">
						<radio value="12" color="#008EFF" :checked="resolved_results == 12" />维修失败
					</view>
				</radio-group>
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head">检查/故障判断:</view>
			</view>
			<textarea v-model="results" maxlength="-1" :class="results ? 'valueActive' : '' " placeholder="请填写检查/故障判断"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_form">
			<view class="inp_title key">是否更换配件<span>*</span></view>
			<view class="form_right">
				<radio-group class="radiowarp" @change="changeReplace">
					<view class="">
						<radio value="1" color="#008EFF" :disabled="domeType == 2" :checked="is_replace == 1" />是
					</view>
					<view class="">
						<radio value="0" color="#008EFF" :disabled="domeType == 2" :checked="is_replace == 0" />否
					</view>
				</radio-group>
			</view>
		</view>
		<view class="fllow_form">
			<view class="inp_title key">是否回收配件<span>*</span></view>
			<view class="form_right">
				<radio-group class="radiowarp" @change="changeRecovery">
					<view class="">
						<radio value="1" color="#008EFF" :disabled="domeType == 2" :checked="is_recovery == 1" />是
					</view>
					<view class="">
						<radio value="0" color="#008EFF" :disabled="domeType == 2" :checked="is_recovery == 0" />否
					</view>
				</radio-group>
			</view>
		</view>
		<!-- 配件费用 -->
		<view >
			<view class="fllow_form" style="margin-top:24rpx;">
				<view class="inp_title">配件费用</view>
			</view>
			<view class="prolist" v-if="surplus_parts.length != 0">
				<view class="probox">
					<view class="proli" v-for="(item,index) in surplus_parts" :key="index">
						<view class="iconfont icon-jian" @click="delParts(index)"></view>
						<view class="protext">{{item.name}}</view>
						<view class="protext">
							<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changePartNumber(e,index)}" />
						</view>
					</view>
				</view>
			</view>
			<view class="add_in" @click="toAddPart">
				<view class="iconfont icon-jiahaocu"></view>
				添加配件
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head">保养注意事项:</view>
			</view>
			<textarea 
				v-model="maintain" 
				maxlength="-1" 
				:class="maintain ? 'valueActive' : '' " 
				placeholder="请填写保养注意事项"
				placeholder-style="color:#999" 
			/>
		</view>
		
		<view style="height:100rpx"></view>
		<view class="arrive_bot" v-if="info.is_examine != 1">
			<view class="arrbtn" @click="$noMultipleClicks(toComplate)">完成</view>
		</view>
		
		<select-work-parts ref="partChild" @selectList="selectParts"></select-work-parts>
	</view>
</template>

<script>
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	import { dateTimePicker, getMonthDay } from '@/utils/dateTimePicker.js'
	import selectWorkParts from '@/components/selectWorkParts/index'
	import { netWriteRepairResult, netWorkOrderDetail, netExaminerEditMoney } from '@/api/api.js'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	
	export default{
		mixins:[commonFun],
		components:{
			selectWorkParts,
			selectTimePicker
		},
		data() {
			return{
				noClick:true,   //防止重复点击
				id:'',  //任务id
				start_time:'',  //开始工作时间
				pay_service:[],   //name  money
				surplus_parts:[],   //id  money  name
				resolved_results:1,   //上门结果 ，  1 已解决     12 维修失败
				results:'',   //处理结果
				is_replace:1,
				is_recovery:1,
				maintain:''
			}
		},
		computed:mapState({
			programList: state => state.customer.programList
		}),
		onShow() {
			
		},
		onLoad(options) {
			this.id = options.id
			this.getResultInfo()
		},
		methods:{
			///////////////////////////////////////////////////////////////////////////////
			//开始时间
			changeStarttime(e) {
				this.start_time = e.f3
			},
			////////////////////////////////////////////////////////////////////////////////
			//审批人 进来的  流程
			getResultInfo() {
				netWorkOrderDetail({id:this.id}).then(res=>{
					this.pay_service = res.data.pay_service
					this.start_time = res.data.start_time
					this.surplus_parts = res.data.use_parts?res.data.use_parts:[]
					this.resolved_results = res.data.resolved_results
					this.results = res.data.results
					this.is_replace = res.data.is_replace
					this.is_recovery = res.data.is_recovery
					this.maintain = res.data.maintain
				})
			},
			///////////////////////////////////////////////////////////////////////////////////////////
			// 是否更换配件
			changeReplace(e) {
				this.is_replace = e.detail.value
			},
			//是否回收配件
			changeRecovery(e) {
				this.is_recovery = e.detail.value
			},
			//维修结果
			changeResolved(e) {
				this.resolved_results = e.detail.value
			},
			//添加配件
			toAddPart() {
				this.$refs.partChild.init(this.id)
			},
			selectParts(arr) {
				arr.forEach(ele=>{
					ele.number = 1
				})
				let data = this.surplus_parts.concat(arr)
				this.surplus_parts = this.deWeight(data)
			},
			delParts(index) {
				this.surplus_parts.splice(index,1)
			},
			changePartNumber(e,index) {
				let obj = this.surplus_parts[index]
				obj.number = e
				this.$set(this.surplus_parts,index,obj)
			},
			toComplate() {
				if(!this.start_time){
					uni.showToast({
						title:'请选择开始工作时间',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					resolved_results:this.resolved_results,
					results:this.results,
					use_parts:this.surplus_parts,
					start_time:this.start_time,
					is_replace:this.is_replace,
					is_recovery:this.is_recovery,
					maintain:this.maintain
				}
				netWriteRepairResult(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			.icon-jiahaocu{
				font-size:28rpx;
				color:$uni-text-color;
				margin-right:5rpx;
			}
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding:30rpx;
		font-size:26rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
				color:#666;
			}
		}
		textarea {
			width: 660rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size:26rpx;
			background:rgba(202, 202, 202, 0.2);
		}
	}
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #EDEDED;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom:0;
				}
				.icon-jian{
					font-size:42rpx;
					color:#ff7800;
				}
				.protext{
					font-size:24rpx;
					color:#333;
					width:200rpx;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					.priceinput{
						width:180rpx;
						font-size:24rpx;
						color:#333;
					}
				}
			}
		}
	}
	.add_in{
		display: flex;
		justify-content: center;
		align-items: center;
		padding:15rpx 0;
		background:#fff;
		font-size:28rpx;
		color:$uni-text-color;
		.icon-jiahaocu{
			font-size:30rpx;
			color:$uni-text-color;
		}
	}
	.arrive_bot{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:100rpx;
		background:#fff;
		border-top:1rpx solid #EDEDED;
		padding:0 24rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		z-index: 9;
		.arri_money{
			font-size:26rpx;
			color:#ff7800;
		}
		.arrbtn{
			width:120rpx;
			height:80rpx;
			background:#0287FF;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			font-size:26rpx;
			border-radius: 8rpx;
		}
	}
</style>
