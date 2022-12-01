<template>
	<view>
		<more-pop
			relation_type="workorder" 
			:relation_id="workorderid" 
			v-if="false" 
			:staffList="workorderInfo.show_staff_data"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		
		<view class="inp_warp">
			<view class="inp_title">异常单号</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.workorder_number : ''}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">工单标题</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.title : ''}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">产品名称</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.product_name : ''}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">时间</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.delivery_time : ''}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">异常数量</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.total : ''}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">抽检数</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.spot_check : ''}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">不良数</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.bad_number : ''}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">发现地点</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.checkpoint : ''}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">检验员</view>
			<view class="form_right">
				<view>{{workorderInfo ? workorderInfo.checker_name : ''}}</view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head">品质异常描述:</view>
			<textarea v-model="workorderInfo.remarks" disabled class="valueActive" placeholder="请填写品质异常描述"
				placeholder-style="color:#999" />
		</view>
		<view class="inp_warp">
			<view class="inp_title">附件</view>
		</view>
		<view class="imglist">
			<view class="imgbox" v-for="(item,index) in workorderInfo.file" :key="index">
				<image :src="item.file_path" class="selfimg"  @click="toPriveImg(workorderInfo.file,index)"></image>
			</view>
		</view>
		<view class="optionstit">操作流程</view>
		<view class="listwarp" v-for="(item,eleindex) in logList" :key="eleindex">
			<view class="inp_warp" style="border-bottom:0;">
				<view class="inp_title">分析人：{{item.name}}</view>
				<view class="inp_title" v-if="item.is_check == 1">已填写分析原因</view>
				<view class="inp_title" v-if="item.is_check == 0">未填写分析原因</view>
			</view>	
			<view class="inp_warp" style="margin-bottom:24rpx;padding:0 0 30rpx 30rpx;">
				<view class="inp_title">{{item.progress ? item.progress.createtime : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">原因分析</view>
				<view class="te_teare">{{item.progress && item.progress.data1 ? item.progress.data1 : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">改善结果</view>
				<view class="te_teare">{{item.progress && item.progress.data2 ? item.progress.data2 : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">完成时间</view>
				<view class="te_teare">{{item.progress && item.progress.data3 ? item.progress.data3 : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">评估改善结果</view>
				<view class="te_teare">{{item.progress && item.progress.data4 ? item.progress.data4 : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">完善制度工艺流程</view>
				<view class="te_teare">{{item.progress && item.progress.data5 ? item.progress.data5 : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">责任人</view>
				<view class="te_teare">{{item.progress && item.progress.duty_staff ? item.progress.duty_staff : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">分析人</view>
				<view class="te_teare">{{item.progress && item.progress.analyst_staff ? item.progress.analyst_staff : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">实施人</view>
				<view class="te_teare">{{item.progress && item.progress.implementer_staff ? item.progress.implementer_staff : ''}}</view>
			</view>
			<view class="li_text">
				<view class="te_tit">主管</view>
				<view class="te_teare">{{item.progress && item.progress.director_staff ? item.progress.director_staff : ''}}</view>
			</view>
		</view>
		
		<view style="height:100rpx;"></view>
		<view class="bot_warp" v-if="workorderInfo.is_operation == 1 && workorderInfo.status != 3">
			<view class="bot_btn" @click="toWrite">填写异常分析</view>
		</view>
	</view>
</template>

<script>
	import { netWorkOrderDetail, netAbnormalLog, netPaymentApproval } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				workorderid:'',
				workorderInfo:{},
				logList:[],
				remindPeople:[],
				examineType:'',
			}
		},
		onLoad(options) {
			this.workorderid = options.workorderid
		},
		onShow() {
			//获取详情
			this.getDetail()
			//获取操作记录
			this.getLog()
			this.getDefaultRemind()
		},
		methods:{
			getDetail(){
				netWorkOrderDetail({id:this.workorderid}).then(res=>{
					this.workorderInfo = res.data
				})
			},
			getLog() {
				netAbnormalLog({workorder_id:this.workorderid}).then(res=>{
					this.logList = res.data
				})
			},
			toWrite() {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorder/write_quality_cause?workorderid='+this.workorderid
				})
			},
			//查看附件
			toPriveImg(arr,index){
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					urls: data,
					current:index
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.operation_record {
		background:#fff;
		padding: 20rpx 30rpx;
		.record_item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			padding-bottom:20rpx;
			border-bottom:1rpx solid #EAEAEA;
			margin-bottom:20rpx;
			&:last-child{
				border-bottom:none;
			}
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}
			.record_info {
				flex: 1;
				margin-left: 25rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				.info_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom:10rpx;
				}
				.shenhetext{
					font-size:26rpx;
					color:#666;
					line-height: 34rpx;
				}
			}
			.record_line {
				position: absolute;
				top: -102rpx;
				left: -26rpx;
				height: 105rpx;
				border-left: 4rpx dotted #dedede;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:24rpx 40rpx 24rpx 50rpx;
		border-bottom:1rpx solid #f5f5f5;
		margin-bottom: 30rpx;
		.area_head {
			margin-bottom:15rpx;
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 20rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			&:nth-child(4n){
				margin-right:0;
			}
			.delimg {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				position: absolute;
				right: -16rpx;
				top: -16rpx;
				background: rgba(0, 0, 0, 0.5);
				z-index: 2;
			}
	
			.selfimg {
				width: 160rpx;
				height: 160rpx;
			}
		}
	}
	.bot_warp{
		width:750rpx;
		height:100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left:0;
		bottom:0;
		background:#fff;
		border-top:1rpx solid #EDEDED;
		z-index: 9;
		.bot_btn{
			width:580rpx;
			height:80rpx;
			border-radius: 10rpx;
			background:$uni-text-color;
			font-size:26rpx;
			text-align: center;
			line-height: 80rpx;
			color:#fff;
		}
	}
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
			color: #666666;
			font-size:26rpx;
			width:400rpx;
			text-align: right;
		}
	}
	.optionstit{
		font-size:26rpx;
		color:$uni-text-color;
		font-weight: bold;
		margin-bottom:24rpx;
		padding:24rpx 40rpx;
	}
	.listwarp{
		width:690rpx;
		margin:0 auto 24rpx;
		background:#fff;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		border-radius: 20rpx;
		padding:24rpx;
		.li_text{
			margin-bottom:24rpx;
			.te_tit{
				font-size:26rpx;
				margin-bottom:15rpx;
				color:#666;
			}
			.te_teare{
				width: 620rpx;
				height:auto;
				margin:0 auto;
				background:rgba(202, 202, 202, 0.2);
				font-size:26rpx;
				color:#999999;
				border-radius: 20rpx;
				padding:24rpx;
				box-sizing: border-box;
			}
		}
	}
</style>