<template>
	<view>
		<view class="fllow_form">
			<view class="key">解决结果</view>
			<view class="form_right">
				<radio-group class="radiowarp" @change="changeRadio">
					<view class="">
						<radio value="1" color="#0287FF" :checked="is_complete == 1" />已解决
					</view>
					<view class="">
						<radio value="0" color="#0287FF" :checked="is_complete == 0" />未解决
					</view>
				</radio-group>
			</view>
		</view>
		<view v-if="is_complete == 1">
			<view class="fllow_form">
				<view class="key">解决方案</view>
				<view class="form_right">
					<radio-group class="radiowarp" @change="changeFa">
						<view class="">
							<radio value="1" color="#0287FF" :checked="is_program == 1" />推荐方案
						</view>
						<view class="">
							<radio value="2" color="#0287FF" :checked="is_program == 2" />其他
						</view>
					</radio-group>
				</view>
			</view>
			<view v-if="is_program == 1">
				<view class="fllow_form">
					<view class="key">使用方案</view>
					<view class="form_right" @click="toSelectProblem">
						<view>请选择使用方案</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="que_list" v-if="programList.length != 0">
					<view class="que_li" v-for="(item,index) in programList" :key="index">
						<view class="iconfont icon-jian" @click="delProgram(index)"></view>
						<view class="que_titq">{{item.title}}</view>
					</view>
				</view>
			</view>
			<view class="fllow_area" v-if="is_program == 2">
				<view class="area_head">其他方案</view>
				<textarea :value="aftermarket_text" class="textself" placeholder="其他方案" placeholder-style="color:#999" />
			</view>
		</view>
		
		<view v-if="is_complete == 0">
			<view class="fllow_form">
				<view class="key">服务方式</view>
				<view class="form_right">
					<radio-group class="radiowarp" @change="changeType">
						<view class="">
							<radio value="11" color="#0287FF" :checked="mobile_result == 11" />上门服务
						</view>
						<view class="">
							<radio value="12" color="#0287FF" :checked="mobile_result == 12" />返厂维修
						</view>
					</radio-group>
				</view>
			</view>
			<view class="fllow_form" v-if="mobile_result == 12">
				<view class="key">返厂方式</view>
				<view class="form_right">
					<input type="text" :class="logistics_type ? 'valueActive' : '' "  v-model="logistics_type" placeholder="填写返厂方式" />
				</view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(submit)">提交</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { netPhoneProblem } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				is_complete:1,   //1 已解决  0 未解决
				is_program:1,   //1推荐方案   2其他
				aftermarket_ids:'',
				aftermarket_text:'',
				mobile_result:11,   //11 上门服务 12 返厂维修
				logistics_type:'',
				id:'',
				programid:''
			}
		},
		computed:mapState({
			programList: state => state.customer.programList
		}),
		onLoad(options) {
			this.id = options.orderid
			this.programid = options.proid
		},
		methods:{
			changeRadio(e) {
				this.is_complete = e.detail.value
			},
			changeFa(e) {
				this.is_program = e.detail.value
			},
			changeType(e) {
				this.mobile_result = e.detail.value
			},
			toSelectProblem() {
				uni.navigateTo({
					url: '/pagesA/afterSales/program_list?id='+this.programid
				})
			},
			delProgram(index) {
				this.programList.splice(index,1)
				this.$store.commit('SETPROGRAMLIST',this.programList)
			},
			submit() {
				if(this.is_complete == 1 && this.is_program == 1 && this.programList.length == 0){
					uni.showToast({
						title:'请选择使用方案',
						icon:'none'
					})
					return
				}
				if(this.is_complete == 0 && this.mobile_result == 12 && !this.logistics_type){
					uni.showToast({
						title:'请填写返厂方式',
						icon:'none'
					})
					return
				}
				let arr = []
				this.programList.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					id:this.id,
					is_complete:this.is_complete,
					mobile_result:this.mobile_result,
					logistics_type:this.logistics_type,
					aftermarket_text:this.aftermarket_text,
					aftermarket_ids:arr.join(',')
				}
				netPhoneProblem(params).then(res=>{
					uni.showToast({
						title: res.msg,
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
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:24rpx 45rpx 24rpx 50rpx;
		.form_right {
			display: flex;
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
	.que_list{
		border-bottom: 1rpx solid #EAEAEA;
		padding:0 45rpx 0 50rpx;
		.que_li{
			background-color: #fff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:24rpx 0;
			border-bottom: 1rpx solid #EAEAEA;
			&:last-child{
				border-bottom:0;
			}
			.icon-jian{
				font-size:40rpx;
				color:#ff7800;
				margin-right:30rpx;
			}
			.que_title{
				font-size:24rpx;
				color:#333;
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx 40rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
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
