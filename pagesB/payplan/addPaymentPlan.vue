<template>
	<view class="new_fllow">
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联客户<span>*</span></view>
			<view class="form_right" @click="toSelectCustomer">
				<view class="ri_label" :class="customerObj ? 'valueActive' : '' ">{{customerObj ? customerObj.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联合同<span>*</span></view>
			<view class="form_right" @click="changeContract">
				<view class="ri_label" :class="contractObj.id ? 'valueActive' : '' ">{{contractObj.name ? contractObj.name: '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">合同编号<span>*</span></view>
			<view class="form_right" >
				<view class="ri_label" :class="contractObj.id ? 'valueActive' : '' ">{{contractObj.id ? contractObj.num: '点击选择'}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">计划回款金额<span>*</span></view>
			<view class="form_right" >
				<input type="number" :class="money ? 'valueActive' : '' " v-model="money" placeholder-class="inputPla"  placeholder="请输入计划回款金额" class="">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">计划回款期数<span>*</span></view>
			<view class="form_right" >
				<input type="number" :class="num ? 'valueActive' : '' " v-model="num" placeholder-class="inputPla"  placeholder="请输入计划回款期数" class="">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">计划回款日期<span>*</span></view>
			<picker mode="date" @change="changeTime">
				<view class="form_right">
					<view class="ri_label" :class="return_date ? 'valueActive' : '' ">{{return_date ? return_date : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">计划回款方式<span>*</span></view>
			<picker :value="index" @change="changeType" :range="type">
				<view class="form_right">
					<view class="ri_label" :class="return_type ? 'valueActive' : '' ">{{return_type ? return_type : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">提前几天提醒<span>*</span></view>
			<view class="form_right" >
				<input type="number" :class="remind ? 'valueActive' : '' " v-model="remind" placeholder-class="inputPla"  placeholder="请输入提前几天提醒" class="">
			</view>
		</view>
		
		<view class="fllow_area" v-if="!isRequired">
			<view class="area_head">备注</view>
			<textarea v-model="remarks" :class="remarks ? 'valueActive' : '' "  placeholder="请输入备注" placeholder-class="textPlac" />
		</view>
		<view class="button" @click="$noMultipleClicks(saveFollow)">
			保存
		</view>
		<view class="botsec"></view>
		<!-- 选择合同 -->
		<select-contract ref="contractChild" @contractInfo="sureContract"></select-contract>
	</view>
</template>

<script>
	import { netSelect, netContractList, netAddPlan, netCustomerDetail } from '@/api/api.js'
	import selectContract from '@/components/selectContract.vue'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	export default {
		mixins:[commonFun],
		components:{
			selectContract
		},
		data() {
			return {
				noClick:true,    //防止  重复点击
				type:[],   //回款方式 
				index:null,
				info:null,   //合同信息
				customer_id:'',   //客户id
				contract_id:'',  //合同id
				num:'',
				money:'',   //计划 回款  金额
				return_date:'',   //计划  回款  日期
				return_type:'',   //计划 回款  方式
				remind:'',   //提前几天  提醒
				remarks:'',   //备注
				//客户列表
				customerList:[],
				//合同列表
				contractList:[],
				contractIndex:null,
				contractObj:{},
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,   //关联 客户
		}),
		onLoad(options) {
			if(options.kehuid){
				this.customer_id = options.kehuid
				this.contract_id = options.id
				this.getKehu()
			}
		},
		onShow() {
			//获取 回款方式 
			this.getType()
		},
		//监听  页面 卸载
		onUnload() {
			
		},
		methods: {	
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			//客户列表
			getKehu() {
				netCustomerDetail({id:this.customer_id}).then(res=>{
					res = res.data
					this.$store.commit('CUSTOMEROBJ',{id:res.id,name:res.name})
					//获取合同列表
					this.getContract()
				})
			},
			//选择客户
			changeCustomer(e) {
				this.$refs.customerChild.init()
			},
			sureCustomer(obj) {
				this.customerObj = obj
				this.contractObj = {}
			},
			getContract() {
				let params = {
					customer_id:this.customerObj.id?this.customerObj.id:this.customer_id
				}
				netContractList(params).then(res=>{
					this.contractList = res.data
					if(this.contract_id){
						this.contractList.forEach((item,index)=>{
							if(item.id == this.contract_id){
								this.contractObj = item
							}
						})
					}
				})
			},
			// 选择合同
			changeContract() {
				this.$refs.contractChild.init(this.customerObj.id)
			},
			sureContract(obj) {
				this.contractObj = obj
			},
			getType() {
				netSelect().then(res=>{
					this.type = res.data.examine['回款方式']
				})
			},
			//改变 回款  方式
			changeType(e) {
				this.return_type = this.type[e.detail.value]
			},
			//计划 回款  日期
			changeTime(e) {
				this.return_date = e.detail.value
			},
			saveFollow() {
				let {
					money,   //计划 回款  金额
					return_date,   //计划  回款  日期
					return_type,   //计划 回款  方式
					remind,   //提前几天  提醒
					remarks,   //备注
					info,
					num,   //计划 回款  期数
				} = this
				if(!this.customerObj.id){
					uni.showToast({
						title:'请选择关联客户',
						icon:'none'
					})
					return
				}
				if(!this.contractObj.id){
					uni.showToast({
						title:'请选择关联合同',
						icon:'none'
					})
					return
				}
				if(!money) {
					uni.showToast({
						title:'请输入计划回款金额',
						icon:'none'
					})
					return
				}
				if(!num) {
					uni.showToast({
						title:'请输入计划回款期数',
						icon:'none'
					})
					return
				}
				if(!return_date) {
					uni.showToast({
						title:'请选择计划回款日期',
						icon:'none'
					})
					return
				}
				if(!return_type) {
					uni.showToast({
						title:'请选择计划回款方式',
						icon:'none'
					})
					return
				}
				if(!remind) {
					uni.showToast({
						title:'请填写提前几天提醒',
						icon:'none'
					})
					return
				}
				let params = {
					customer_id: this.customerObj.id?this.customerObj.id:'',
					contract_id: this.contractObj.id?this.contractObj.id:'',
					money,   //计划 回款  金额
					return_date,   //计划  回款  日期
					return_type,   //计划 回款  方式
					remind,   //提前几天  提醒
					remarks,
					num
				}
				netAddPlan(params).then(res=>{
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

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
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
			color:#666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			.rightinput{
				font-size:24rpx;
				width:100%;
				text-align: right;
			}
			.inputPla{
				font-size:24rpx;
				color:#999;
			}
			.right_btn{
				font-size:24rpx;
				color:$uni-text-color;
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
.valueActive{
	color:#333;
}
.fllow_area {
	background-color: #fff;
	margin-bottom: 30rpx;
	padding-bottom: 30rpx;
	color: #999;
	.area_head {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 32rpx;
		padding: 0 30rpx;
		text {
			color: #f00;
		}
	}
	.textPlac{
		font-size: 24rpx;
	}
	textarea {
		width: 80%;
		height: 300rpx;
		padding: 30rpx;
		background: #f8f8f8;
		margin: 0 auto;
	}
}
</style>
