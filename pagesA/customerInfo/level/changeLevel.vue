<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">归属人<span>*</span></view>
			<view class="form_right">
				<view class="valueActive">{{info && info.create_staff.name}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联客户<span>*</span></view>
			<view class="form_right">
				<view class="valueActive">{{info && info.name}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户级别<span>*</span></view>
			<picker @change="changeType" :range="levelType" :value="levelIndex">
				<view class="form_right">
					<view :class="type ? 'valueActive' : '' ">
						{{type ? type : '请选择客户级别'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">成交状态<span>*</span></view>
			<view class="form_right">
				<view class="valueActive" v-if="info && info.contract_status == 1">已成交</view>
				<view class="valueActive" v-if="info && info.contract_status == 0">未成交</view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head key">变更原因:<span>*</span></view>
				<view class="list_text" @click="toSelect">选择原因</view>
			</view>
			<textarea v-model="reason" @input="changeRemark" :class="reason ? 'valueActive' : '' " placeholder="请填写变更原因"
				placeholder-style="color:#999" />
		</view>
		<!-- 审核信息 -->
		<!-- <examine-people :list="remindPeople" @delItem="delItem"></examine-people> -->
		
		<view class="button" @click="$noMultipleClicks(submit)">提交</view>
		
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	import { netCustomerDetail, netChangeCustomerLevel } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,    //防止  重复点击
				//审核人
				remindPeople:[],
				examineType:'contract',
				customer_id:'',
				BASE_IMG_URL:BASE_IMG_URL,
				levelType:['A','B','C','D'],
				levelIndex:0,
				type:'A',
				oldType:'',
				info:null,
				reason:''
			}
		},
		computed:mapState({
			remark: state => state.template.level_remarks
		}),
		watch:{
			remark(val){
				this.reason = val
			}
		},
		onUnload() {
			this.$store.commit('LEVEL_REMARKS','')
		},
		onLoad(options) {
			this.customer_id = options.id
			//获取 详情
			this.getDetail()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
		},
		methods:{
			getDetail() {
				netCustomerDetail({id:this.customer_id}).then(res=>{
					this.info = res.data
					this.type = res.data.type
					this.oldType = res.data.type
				})
			},
			changeType(e) {
				let index = e.detail.value
				this.type = this.levelType[index]
			},
			changeRemark(e) {
				this.$store.commit('LEVEL_REMARKS',e.detail.value)
			},
			submit() {
				if(this.type == this.oldType){
					uni.showToast({
						title:'请修改客户级别',
						icon:'none'
					})
					return
				}
				if(!this.remark){
					uni.showToast({
						title:'请填写变更原因',
						icon:'none'
					})
					return
				}
				if(!this.type) {
					uni.showToast({
						title:'请选择客户级别',
						icon:'none'
					})
					return
				}
				// if(this.remindPeople.length == 0) {
				// 	uni.showToast({
				// 		title:'请选择审批人',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				// let arr = []
				// this.remindPeople.forEach(ele=>{
				// 	arr.push(ele.id)
				// })
				
				let params = {
					customer_id: this.customer_id,
					type:this.type,
					remark: this.remark,
				}
				uni.showModal({
					title:'提示',
					content:this.info.name+'的级别从'+this.oldType+'变更为'+this.type,
					success:(res)=>{
						if(res.confirm){
							netChangeCustomerLevel(params).then(ress=>{
								uni.showToast({
									title:ress.msg,
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
			},
			toSelect() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/level/level_template'
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
		}
	}
	
	.fllow_area {
		background: #fff;
		padding:30rpx;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
			}
			.list_text{
				font-size:26rpx;
				color:$uni-text-color;
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
</style>
