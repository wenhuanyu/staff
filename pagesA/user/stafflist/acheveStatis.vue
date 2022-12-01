<template>
	<view>
		<view class="acheve_warp">
			<view class="acheve_top">
				<view class="ach_tit">业绩统计</view>
				<view class="ach_time" @click="toQuery">
					{{queryData.startTime}}至{{queryData.endTime}}
					<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="shaixuan" ></image>
				</view>
			</view>
			<view class="ach_list">
				<view class="ach_li">
					<view class="ach_tip">新增客户</view>
					<view class="ach_num">{{statisInfo.customer}}</view>
				</view>
				<view class="ach_li">
					<view class="ach_tip">拜访次数</view>
					<view class="ach_num">{{statisInfo.baifang}}</view>
				</view>
				<view class="ach_li">
					<view class="ach_tip">订单数量</view>
					<view class="ach_num">{{statisInfo.contract}}</view>
				</view>
				<view class="ach_li">
					<view class="ach_tip">回款次数</view>
					<view class="ach_num">{{statisInfo.receivables}}</view>
				</view>
				<view class="ach_li">
					<view class="ach_tip">业绩目标</view>
					<view class="ach_num">{{statisInfo.contractAchievement}}</view>
				</view>
				<view class="ach_li">
					<view class="ach_tip">订单金额</view>
					<view class="ach_num">{{statisInfo.contract_money}}</view>
				</view>
				<view class="ach_li">
					<view class="ach_tip">回款目标</view>
					<view class="ach_num">{{statisInfo.receivablesAchievement}}</view>
				</view>
				<view class="ach_li">
					<view class="ach_tip">回款金额</view>
					<view class="ach_num">{{statisInfo.receivables_money}}</view>
				</view>
			</view>
		</view>
		
		<view class="acheve_warp">
			<view class="ach_list">
				<view class="ach_li">
					<image :src="BASE_IMG_URL+'/index/staff9.png'" class="ach_img" ></image>
					<view class="ach_tip">完成工单</view>
					<view class="ach_num">{{statisInfo.completeWorkorder}}</view>
				</view>
				<view class="ach_li">
					<image :src="BASE_IMG_URL+'/index/staff2.png'" class="ach_img" ></image>
					<view class="ach_tip">好评工单</view>
					<view class="ach_num">{{statisInfo.goodWorkorder}}</view>
				</view>
				<view class="ach_li">
					<image :src="BASE_IMG_URL+'/index/staff10.png'" class="ach_img" ></image>
					<view class="ach_tip">工单营收</view>
					<view class="ach_num">{{statisInfo.workorderMoney}}</view>
				</view>
				<view class="ach_li">
					<image :src="BASE_IMG_URL+'/index/staff12.png'" class="ach_img" ></image>
					<view class="ach_tip">新建工单</view>
					<view class="ach_num">{{statisInfo.workorder}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import selectPop from './components/selectPop.vue'
	import { netStaffStatis } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			selectPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				showSelect:false,
				queryData:{
					times:'',
					startTime:'',
					endTime:''
				},
				staffid:'',
				statisInfo:{}
			}
		},
		methods:{
			toQuery() {
				this.$emit('queryYeji')
			},
			init(id){
				this.staffid = id
				let date = new Date()
				let year = date.getFullYear()
				let month = this.withData(date.getMonth() + 1)
				this.queryData = {
					times: year+'-'+month+','+ year+'-'+month,
					startTime:year+'-'+month,
					endTime:year+'-'+month
				}
				this.getDetail()
			},
			withData(param) {
			  return param < 10 ? '0' + param : '' + param;
			},
			sureQuery(params) {
				this.showSelect = false
				this.queryData = params
				this.getDetail()
			},
			getDetail(){
				let params = {
					id:this.staffid,
					...this.queryData
				}
				netStaffStatis(params).then(res=>{
					this.statisInfo = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.acheve_warp{
		width:690rpx;
		background:#fff;
		border-radius: 20rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		margin:24rpx auto;
		.acheve_top{
			padding:24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.ach_tit{
				font-size:34rpx;
				color:#666666;
			}
			.ach_time{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				color:#999999;
				font-size:30rpx;
				.shaixuan{
					width:35rpx;
					height:27rpx;
				}
			}
		}
		.ach_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			.ach_li{
				padding:24rpx 15rpx 24rpx 20rpx;
				border-top:1rpx solid #f5f5f5;
				border-right:1rpx solid #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width:50%;
				.ach_tip{
					font-size:30rpx;
					color:$uni-text-color;
				}
				.ach_num{
					font-size:26rpx;
					color:#999999;
				}
				.ach_img{
					width:48rpx;
					height:48rpx;
				}
			}
		}
	}
</style>
