<template>
	<view class="">
		<view class="rule_tip">修改打卡规则后第二天生效</view>
		<view class="inp_warp">
			<view class="inp_title key">打卡人员<span>*</span></view>
			<view class="form_right" @click="selectStaff">
				<view :class="staffArr.length != 0 ? 'valueActive' : '' " v-if="staffArr.length != 0">
					<span v-for="(item,index) in staffArr" :key="index">{{item.name}},</span>
				</view>
				<view class="" v-else>
					打卡人员
				</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">规则名称<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="name" :class="name ? 'valueActive' : '' " placeholder="规则名称" placeholder-style="color:#999;font-size:24rpx;">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">规则类型<span>*</span></view>
			<view class="form_right" @click="changeRulesType">
				<view :class="typeObj.title ? 'valueActive' : '' ">{{typeObj.title ? typeObj.title : '规则类型'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp" @click="toSetTime">
			<view class="inp_title key">打卡时间<span>*</span></view>
			<view class="form_right">
				<view :class="timeArr.length != 0 ? 'valueActive' : '' ">
					<view class="timebox" v-if="timeArr.length != 0">
						{{timeArr[0].week}};<span v-if="timeArr.length > 1">等{{timeArr.length}}组</span>
					</view>
					<view class="" v-else>打卡时间</view>
				</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp" @click="selectPosition">
			<view class="inp_title key">打卡位置<span>*</span></view>
			<view class="form_right">
				<view :class="positionArr.length != 0 ? 'valueActive' : '' ">
					<view class="timebox" v-if="positionArr.length != 0">
						{{positionArr[0].address}};<view v-if="positionArr.length > 1">等{{positionArr.length}}个</view>
					</view>
					<view class="" v-else>打卡位置</view>
				</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		
		<!-- <view class="botwarp" v-if="rule_id">
			<view class="b_bot remove" @click="$noMultipleClicks(sureDel)">删除</view>
			<view class="b_bot" @click="$noMultipleClicks(toSave)">确认修改</view>
		</view> -->
		<view class="button" @click="$noMultipleClicks(toSave)">
			保存
		</view>
		
		<!-- 选择规则类型 -->
		<select-rule-type ref="ruleTypeChild" @selectType="selectType"></select-rule-type>
	</view>
</template>

<script>
	import selectRuleType from './ruleType.vue'
	import { netTimeSlotList, netAddressList, netAddRules, netRulesDetail, netEditRules, netDelRules } from '@/api/api.js'
	
	export default{
		components:{
			selectRuleType
		},
		data() {
			return{
				noClick: true, //防止  重复点击
				time_id:'',  //打卡规则id
				timeArr:[],   //打卡时间
				positionArr:[],  //打卡地址
				typeObj:{},  //0固定上下班 
				typeArr:[
					{id:0,title:'固定上下班',label:'支持弹性打卡',p:'所有人按照相同时间打卡',text:'适用于办公室坐班，例如朝九晚五'}
				],
				staffArr:[],
				name:'',
				rule_id:'',   //规则id
			}
		},
		onLoad(options) {
			if(options.id){
				this.rule_id = options.id
				this.getDetail()
			}
			uni.removeStorageSync('remindlist');
		},
		onShow() {
			//获取 选择好的打卡人员
			let arr = uni.getStorageSync('remindlist') ? uni.getStorageSync('remindlist') : []
			this.staffArr = this.$deWeight(arr)
			
			//获取打卡时间
			this.getClockTime()
			//获取打卡位置
			this.getPosition()
		},
		methods:{
			//获取详情
			getDetail() {
				netRulesDetail({id:this.rule_id}).then(res=>{
					res = res.data
					this.name = res.name
					uni.setStorageSync('remindlist',res.staff_info)
					this.staffArr = res.staff_info
					this.typeArr.forEach(ele=>{
						if(ele.id == res.type){
							this.typeObj = ele
						}
					})
				})
			},
			//获取打卡时间
			getClockTime() {
				netTimeSlotList({time_id:this.time_id}).then(res=>{
					this.timeArr = res.data
				})
			},
			//获取打卡位置
			getPosition() {
				netAddressList().then(res=>{
					this.positionArr = res.data
				})
			},
			//选择打卡人员
			selectStaff() {
				uni.navigateTo({
					url: '/pages/selectMember/selectMember?status=1'
				})
			},
			//选择规则类型
			changeRulesType() {
				this.$refs.ruleTypeChild.init()
			},
			selectType(obj) {
				this.typeObj = obj
			},
			//打卡时间
			toSetTime() {
				uni.navigateTo({
					url:'/pagesB/punchclock/clockrules/clockTime'
				})
			},
			//打卡位置
			selectPosition() {
				uni.navigateTo({
					url:'/pagesB/punchclock/clockrules/punchPosition'
				})
			},
			toSave() {
				if(this.staffArr.length == 0) {
					uni.showToast({
						title:'请选择打卡人员',
						icon:'none'
					})
					return
				}
				if(!this.name){
					uni.showToast({
						title:'请填写规则名称',
						icon:'none'
					})
					return
				}
				if(!this.typeObj.title){
					uni.showToast({
						title:'请选择规则类型',
						icon:'none'
					})
					return
				}
				if(this.timeArr.length == 0){
					uni.showToast({
						title:'请添加打卡时间',
						icon:'none'
					})
					return
				}
				if(this.positionArr.length == 0) {
					uni.showToast({
						title:'请添加打卡位置',
						icon:'none'
					})
					return
				}
				let staffarr = []
				this.staffArr.forEach(ele=>{
					staffarr.push(ele.id)
				})
				let params = {
					name:this.name,
					type:this.typeObj.id,
					staff_id:staffarr.join(','),
				}
				if(this.rule_id){
					params.id = this.rule_id
					netEditRules(params).then(res=>{
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
				}else{
					netAddRules(params).then(res=>{
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
			},
			sureDel() {
				uni.showModal({
					title:'提示',
					content:'请确认是否删除?',
					complete:(data)=>{
						if(data.confirm){
							netDelRules({id:this.rule_id}).then(res=>{
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
	.rule_tip{
		padding:24rpx;
		font-size:24rpx;
		color:red;
		text-align: center;
		background:#f5f5f5;
	}
	.botwarp{
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top:100rpx;
		.b_bot{
			width:300rpx;
			height:80rpx;
			border-radius: 40rpx;
			font-size:24rpx;
			text-align: center;
			line-height: 80rpx;
			background:$uni-text-color;
			color:#fff;
		}
		.remove{
			background:#ff7800;
		}
	}
</style>