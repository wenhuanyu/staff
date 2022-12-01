<template>
	<view>
		<view class="newwarp">
			<view class="new_title">工单进度</view>
			<view class="word_status">
				<view class="statustip" v-if="workorderInfo.check_status == 1" style="color:red">优惠费用待审核</view>
				<view v-else>
					<view class="statustip" v-if="workorderInfo.status == 0">待分配</view>
					<view class="statustip" v-if="workorderInfo.status == 1">待处理</view>
					<view class="statustip" v-if="workorderInfo.status == 2">处理中</view>
					<view class="statustip" v-if="workorderInfo.status == 3">已完成</view>
					<view class="statustip" v-if="workorderInfo.status == 9">已终止</view>
				</view>
			</view>
			<view class="stapbox">
				<uni-steps :options="shejiStepa" active-color="#008EFF" :active="workorderInfo.process - 1" />
			</view>
			<view class="new_info">
				<view class="new_li">关联客户：{{workorderInfo.customer && workorderInfo.customer.name}}</view>
				<view class="new_li">工单类型：{{workorderInfo.workorder_type}}</view>
			</view>
		</view>
		
		<view class="work_warp" v-if="false">
			<view class="statusbox">
				<view class="statustip" v-if="workorderInfo.check_status == 1" style="color:red">优惠费用待审核</view>
				<view v-else>
					<view class="statustip" v-if="workorderInfo.status == 0">待分配</view>
					<view class="statustip" v-if="workorderInfo.status == 1">待处理</view>
					<view class="statustip" v-if="workorderInfo.status == 2">处理中</view>
					<view class="statustip" v-if="workorderInfo.status == 3">已完成</view>
					<view class="statustip" v-if="workorderInfo.status == 9">已终止</view>
				</view>
				<view class="revokebtn" v-if="workorderInfo.status != 9 && workorderInfo.status != 3 && workorderInfo.is_revoke == 1" @click="toRevoke">终止工单</view>
			</view>
			<view class="stapbox">
				<uni-steps :options="shejiStepa" active-color="#008EFF" :active="workorderInfo.process - 1" />
			</view>	
			<view class="cus_info">
				<view class="cus_name">客户：{{workorderInfo.customer.name}}</view>
			</view>
		</view>
		<!-- 更多操作 -->
		<more-pop 
			relation_type="workorder" 
			v-if="false" 
			:relation_id="workOrderid" 
			:staffList="workorderInfo.show_staff_data"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		
		<!-- 标签 -->
		<view class="labelwarp">
			<view class="label_li" @click="changeLabel(4)" :class="tabid == 4 ? 'label_liactive' : ''" >工单进度</view>
			<view class="label_li" @click="changeLabel(1)" :class="tabid == 1 ? 'label_liactive' : ''" >工单信息</view>
			<view class="label_li" @click="changeLabel(2)" :class="tabid == 2 ? 'label_liactive' : ''" >产品信息</view>
			<view class="label_li" @click="changeLabel(3)" :class="tabid == 3 ? 'label_liactive' : ''" >协助任务</view>
		</view>
		
		<!-- 工单进度 任务状态-->
		<view class="process" v-if="tabid == 4">
			<scroll-view scroll-y class="planscroll" @scrolltolower="loadMorePlan">
				<view class="planwarp">
					<view class="new_plan_li" v-for="(item,index) in processList" :key="index">
						<view class="new_plan_top">
							<view class="new_pt_staff">
								<image :src="item.staff.img ? item.staff.img : '/static/index/header.png'" class="pt_staffimg" ></image>
								<view class="pt_staffname">{{item.staff.name}} -- {{item.staff.post}}</view>
							</view>
							<view class="new_pt_right">{{item.relation_process}}</view>
						</view>
						<view class="new_plan_info" @click="toSeeLocation(item)" v-if="item.location">
							<view class="new_p_ili">签到地点:{{item.location}}</view>
							<view class="new_p_ili">签到地点距离拜访对象:{{item.distance}}</view>
						</view>
						<view class="pl_remark" v-html="item.content"></view>
						<view class="imglist" v-if="item.file_ids.length != 0">
							<image :src="ele" v-for="(ele,fileindex) in item.file_ids" :key="fileindex" @click="previeImg(item.file_ids,fileindex)" class="planimg" ></image>
						</view>
						<view class="task_time">
							<image :src="BASE_IMG_URL+'/index/clock.png'" class="clockimg" ></image>
							{{item.createtime}}
						</view>
					</view>
					<view class="noData" v-if="processList.length == 0">暂无更多</view>
				</view>
			</scroll-view>
		</view>
		<!-- 工单信息/任务信息 -->
		<view class="newwarp" v-if="tabid == 1">
			<view class="new_title">工单信息</view>
			<view class="newbox">
				<view class="inp_warp">
					<view class="inp_title">创建人</view>
					<view class="form_right">
						<image :src="workorderInfo.create_staff.img" class="staffimg" ></image>
						<view>{{workorderInfo.create_staff.name ? workorderInfo.create_staff.name : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">归属人</view>
					<view class="form_right">
						<image :src="workorderInfo.owner_staff.img" class="staffimg" ></image>
						<view>{{workorderInfo.owner_staff.name ? workorderInfo.owner_staff.name : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">工单标题</view>
					<view class="form_right">
						<view>{{workorderInfo.title}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">工单类型</view>
					<view class="form_right">
						<view>{{workorderInfo.workorder_type}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">工单编号</view>
					<view class="form_right">
						<view>{{workorderInfo.workorder_number}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">交期变更</view>
					<view class="form_right">
						<view v-if="workorderInfo.is_replace == 0">不允许</view>
						<view v-if="workorderInfo.is_replace == 1">允许</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">但不得迟于</view>
					<view class="form_right">
						<view>{{workorderInfo.appointment_time?workorderInfo.appointment_time:''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">特殊要求</view>
					<view class="form_right">
						<view>{{workorderInfo.desc ? workorderInfo.desc : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">附件</view>
				</view>
				<view class="imglist" v-if="workorderInfo.file != 0">
					<image 
						:src="ele.file_path" 
						v-for="(ele,index) in workorderInfo.file" 
						:key="index"
						 @click="previeImgFile(index)" 
						 class="planimg" 
					 ></image>
				</view>
			</view>
		</view>
		<!-- 产品信息 -->
		<view class="newwarp" v-if="tabid == 2">
			<view class="new_title">工单信息</view>
			<view class="proli" v-for="(item,index) in workorderInfo.product" :key="index">
				<view class="protext">产品：{{item.name}}</view>
				<view class="protext">数量：{{item.number}}</view>
				<view class="protext">交期时间：{{item.end_date}}</view>
				<view class="protext">备注：{{item.desc}}</view>
			</view>
		</view>
		<!-- 协助任务列表 -->
		<view class="newwarp" v-if="tabid == 3">
			<scroll-view scroll-y class="planscroll">
				<view class="new_title" style="margin-bottom:24rpx;">协助任务</view>
				<view v-for="(elitem,elitemindex) in taskList" :key="elitemindex" style="margin-bottom:24rpx;">
					<view class="titlebox">{{elitem.department_name}}</view>
					<view class="task_li" v-for="(item,index) in elitem.data" :key="index">
						<view class="toeval" @click="toCommon(item)" v-if="item.status == '进行中'">
							回复
						</view>
						<view class="toeval" v-else style="color:red">
							{{item.status}}
						</view>
						<view class="task_time">
							邀请的协助人：
							<image :src="item.staff.img" class="staffimg" ></image>{{item.staff.name}}
						</view>
						<view class="task_remrk">备注：{{item.remark}}</view>
						<view class="task_time">
							<image :src="BASE_IMG_URL+'/index/clock.png'" class="clockimg" ></image>
							{{item.createtime}}
						</view>
						<view class="assist_list">
							<view class="assist_li" v-for="(ele,eleindex) in item.comments" :key="eleindex">
								<view class="ass_left">
									<image :src="ele.staff.img" class="staffimg" ></image>
								</view>
								<view class="ass_right">
									<view class="right_top">
										<view class="staffname">{{ele.staff.name}}</view>
										<view class="ass_content">{{ele.createtime}}</view>
									</view>
									<view class="ass_content" style="margin:15rpx 0">
										{{ele.content}}
									</view>
									<view class="ass_content" style="margin-bottom:15rpx;">
										附件：
									</view>
									<view class="imgbox">
										<image 
											v-for="(imgitem,imgindex) in ele.file_ids"
											:key="imgindex"
											:src="imgitem" 
											class="selfimg" 
											@click="toPreimg(ele.file_ids,imgindex)"
										></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="noData" v-if="taskList.length == 0">暂无更多</view>
			</scroll-view>
		</view>
		
		
		<view style="height:120rpx;"></view>
		<view class="newbot" v-if="workorderInfo.status != 9 && workorderInfo.status != 3" @click="moreOperation">
			<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="moreimg" ></image>
			更多
		</view>
		<more-operation
			ref="operationChild"
			:workorderInfo="workorderInfo"
		></more-operation>
		
		<view class="visib_bottom" v-if="false">
			<view></view>
			<view class="bot_right">
				<view class="ribhtbox" >
					<view class="botfir" @click="toEditWork" v-if="workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1">修改工单</view>
					<view class="botfir" v-if="workorderInfo.is_leader == 1  || workorderInfo.is_operation == 1" @click="toAssist">邀请协作</view>
					<view class="botfir" v-if="workorderInfo.is_leader == 1 || workorderInfo.is_operation == 1" @click="toComplete">设计成功</view>
					<view class="botfir" v-if="workorderInfo.is_leader == 1 || workorderInfo.is_operation == 1" @click="toTaskfailed">设计失败</view>
				</view>
			</view>
		</view>
		
		<!-- 评论回复 -->
		<common-pop
			@commonSuccess="commonSuccess" 
			ref="commentChild"
		></common-pop>
	</view>
</template>

<script>
	import { netWorkOrderDetail, netAcceptWorkOrder, netStartWorkOrder, netWorkorderStatusList, netProoingFail,
	netOtherAssistList, netCompleteWorkorder } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import commonPop from './common_pop.vue'
	import moreOperation from './more-operation.vue'
	
	export default {
		mixins:[commonFun],
		components:{
			commonPop,
			moreOperation
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				active:0,
				shejiStepa:[
					{text:'已开始'},
					{text:'已完成'}
				],
				workOrderid:'',
				workorderInfo:{},
				
				processList:[],   //进度 状态
				page:1,
				totalPage:1,
				isPriviimg:false,
				tabid:4,
				//费用 信息
				costList:[],   
				costPage:1,
				costTotalpage:1,
				//更多操作
				remindPeople:[],
				examineType:'',
				//协助任务列表
				taskList:[],
				taskPage:1,
				taskTotalpage:0,
				isLookImg:false,
			}
		},
		onLoad(options) {
			this.workOrderid = options.id
			if(options.tabid){
				this.tabid = options.tabid
			}
		},
		onShow() {
			this.getDefaultRemind()
			if(!this.isPriviimg){
				this.changeLabel(this.tabid)
				
				this.getDetail()
			}
		},
		onHide() {
		},
		methods:{
			//更多操作
			moreOperation() {
				this.$refs.operationChild.open()
			},
			//去评论
			toCommon(item) {
				this.isLookImg = false
				let obj = {
					id:item.id,
					type:'assist_event',
					commenid:''
				}
				this.$refs.commentChild.init(obj)
			},
			//评论成功
			commonSuccess() {
				this.getTasklist()
			},
			//查看评论图片
			toPreimg(arr,index) {
				this.isLookImg = true
				uni.previewImage({
					current:index,
					urls: arr
				})
			},
			////////////////////////////////////////////////////////////////////////
			//工单详情
			getDetail(){
				netWorkOrderDetail({id:this.workOrderid}).then(res=>{
					this.workorderInfo = res.data
				})
			},
			changeLabel(id) {
				this.tabid = id
				if(this.tabid == 3) {
					//协助任务
					this.getTasklist()
				}else if(this.tabid == 4){
					//进度状态
					this.page = 1
					this.processList = []
					this.getStatusList()
				}
			},
			//任务列表
			getTasklist(){
				let params = {
					relation_id: this.workOrderid,
					relation_type:'workorder',
					type:4,
					page:this.taskPage
				}
				netOtherAssistList(params).then(res=>{
					this.taskList = res.data
				})
			},
			loadMoreTask() {
				if(this.taskPage < this.taskTotalpage){
					this.taskPage ++
					this.getTasklist()
				}
			},
			//查看位置
			toSeeLocation(item) {
				uni.openLocation({
					latitude: Number(item.lat),
					longitude: Number(item.lng),
					address: item.location,
					name: item.location,
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			//指派
			toAssign(type) {
				this.isPriviimg = false
				uni.navigateTo({
					url:'/pagesA/afterSales/turn_staff?id='+this.workorderInfo.id+'&type='+type
				})
			},
			//工单 状态 列表
			getStatusList() {
				let params = {
					workorder_id:this.workOrderid,
					page: this.page,
				}
				netWorkorderStatusList(params).then(res=>{
					this.processList = this.processList.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			loadMorePlan() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getStatusList()
			},
			//产品发货 接受工单  type  1接受工单   2开始工单
			acceptWork(type) {
				let params = {
					id: this.workorderInfo.id,
				}
				if(type == 1){
					netAcceptWorkOrder(params).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							this.getDetail()
							this.page = 1
							this.processList = []
							this.getStatusList()
						},2000)
					})
				}else if(type == 2) {
					netStartWorkOrder(params).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							this.getDetail()
							this.page = 1
							this.processList = []
							this.getStatusList()
						},2000)
					})
				}
			},
			//撤销工单
			toChexiaoWork() {
				uni.navigateTo({
					url:'/pagesA/afterSales/chexiaoWork?id='+this.workOrderid
				})
			},
			//查看图片
			previeImg(arr,index) {
				uni.previewImage({
					current:index,
					urls:arr
				})
			},
			previeImgFile(index) {
				let arr = this.workorderInfo.file
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					current:index,
					urls:data
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.newwarp{
		margin-bottom:24rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		padding:30rpx;
		.new_title{
			font-size:26rpx;
			color:#666666;
			padding-left:40rpx;
			position: relative;
			&::before{
				content:'';
				width:10rpx;
				height:25rpx;
				background:$uni-text-color;
				border-radius: 5rpx;
				position: absolute;
				left:0;
				top:6rpx;
			}
		}
		.word_status{
			font-size:34rpx;
			color:$uni-text-color;
			margin:30rpx 0 0 0;
			.statustip{
				text-align: center;
			}
		}
		.stapbox{
			padding:0 30rpx;
			margin-bottom:10rpx;
		}
		.new_info{
			padding:0 30rpx;
			.new_li{
				font-size:26rpx;
				color:#999999;
				margin-bottom:20rpx;
			}
		}
	}
	.imglist{
		padding:24rpx 30rpx;
		border-bottom:1rpx solid #f5f5f5;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.planimg{
			width:150rpx;
			height:150rpx;
			border-radius: 20rpx;
			margin-right:47rpx;
			margin-bottom:24rpx;
		}
	}
	.ribhtbox{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-wrap: wrap;
	}
	
	.planscroll{
		width:100%;
		height:900rpx;
		background:#fff;
		padding:24rpx 0;
	}
	//任务列表
	.newwarp{
		margin-bottom:24rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		padding:30rpx;
		.planscroll{
			padding:0;
		}
		.titlebox{
			font-size:26rpx;
			background:#F6F6F6;
			padding:15rpx;
			color:#666666;
			margin:30rpx 0;
		}
		.task_li{
			width:670rpx;
			background:#fff;
			box-sizing: border-box;
			padding:24rpx;
			border-radius: 10rpx;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
			margin:0rpx auto 24rpx;
			// border-top:20rpx solid #007AFF;
			position: relative;
			.toeval{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size:26rpx;
				color:$uni-text-color;
				position: absolute;
				right:30rpx;
				top:30rpx;
			}
			.task_time{
				font-size:24rpx;
				margin-top:15rpx;
				color:#999;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.staffimg{
					width:50rpx;
					height:50rpx;
					border-radius: 50%;
					margin-right:15rpx;
				}
				.clockimg{
					width:30rpx;
					height:30rpx;
					margin-right:24rpx;
				}
			}
			.task_remrk{
				margin-top:15rpx;
				line-height: 40rpx;
				color:#999;
			}
			.assist_list{
				margin-top:24rpx;
				border-top:16rpx solid #f5f5f5;
				.assist_li{
					padding:20rpx 0;
					border-bottom:1rpx solid #f5f5f5;
					display: flex;
					justify-content: flex-start;
					.ass_left{
						.staffimg{
							width:50rpx;
							height:50rpx;
							border-radius: 50%;
						}
					}
					.ass_right{
						margin-left:24rpx;
						flex:1;
						.right_top{
							display: flex;
							justify-content: space-between;
							align-items: center;
							.staffname{
								font-size:24rpx;
								color:#999;
							}
							.ass_content{
								font-size:24rpx;
								color:#999;
								line-height: 38rpx;
								margin-bottom:15rpx;
							}
						}
						.ass_content{
							color:#999;
						}
					}
					.imgbox{
						display: flex;
						justify-content: flex-start;
						flex-wrap: wrap;
						.selfimg{
							width:120rpx;
							height:120rpx;
							margin-right:24rpx;
						}
					}
				}
			}
		}
	}
	.itemwarp{
		width:660rpx;
		background:#fff;
		border-radius: 10rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		margin:24rpx auto 0;
		padding:0 40rpx;
		.item_title{
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			font-size:30rpx;
			color:#333333;
		}
		.item_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0 0;
			.item_info_left{
				.item_text{
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
				}
			}
			.item_info_right{
				width:121rpx;
				height:93rpx;
				flex-shrink: 0;
				margin-left:24rpx;
				.itemstatusimg{
					width:121rpx;
					height:93rpx;
				}
			}
		}
		.item_text{
			font-size:26rpx;
			color:#999999;
			margin-bottom:15rpx;
		}
		.item_bot{
			padding:24rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top:1rpx solid #f5f5f5;
			.item_btn{
				width:284rpx;
				height:68rpx;
				border-radius: 34rpx;
				font-size:32rpx;
				text-align: center;
			}
			.refuse_btn{
				border:1rpx solid #0287FF;
				line-height: 66rpx;
				color:#0287FF;
			}
			.sure_btn{
				background:#0287FF;
				color:#fff;
				line-height: 68rpx;
			}
		}
	}
.work_warp{
	width:690rpx;
	box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
	border-radius: 10rpx;
	margin:24rpx auto 0;
	.statusbox{
		padding:24rpx;
		border-bottom:1rpx solid #f5f5f5;
		height:85rpx;
		position: relative;
		.revokebtn{
			position: absolute;
			right:30rpx;
			top:25rpx;
			font-size:26rpx;
			color:#0287FF;
		}
		.statustip{
			font-size:32rpx;
			color:#0287FF;
			text-align: center;
		}
	}
	.stapbox{
		padding:24rpx 30rpx;
		border-bottom:1rpx solid #f5f5f5;
	}
	.cus_info{
		padding:24rpx 0 24rpx 0;
		.cus_name{
			font-size:30rpx;
			color:#333333;
			text-align: center;
			padding:0 24rpx;
			margin-bottom:15rpx;
		}
		.cus_link{
			font-size:28rpx;
			color:#666666;
			margin-bottom:15rpx;
			padding:0 24rpx;
			text-align: center;
		}
		.cus_bot{
			margin-top:24rpx;
			padding:0 24rpx;
			border-top:1rpx solid #f5f5f5;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.cus_btn{
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:30rpx;
				color:#0287FF;
				padding:24rpx 0;
				.daohangimg{
					width:40rpx;
					height:48rpx;
					margin-right:15rpx;
				}
				.phoneimg{
					width:48rpx;
					height:48rpx;
					margin-right:15rpx;
				}
			}
		}
	}
}
// 工单进度
.planwarp{
	width:100%;
	.new_plan_li{
		width:690rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin:0 auto 24rpx;
		padding-bottom:24rpx;
		background:#fff;
		.new_plan_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 30rpx;
			border-bottom:1rpx solid #EDEDED;
			.new_pt_staff{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.pt_staffimg{
					width:70rpx;
					height:70rpx;
					border-radius: 50%;
					margin-right:15rpx;
				}
				.pt_staffname{
					font-size:22rpx;
					color:#666666;
				}
			}
			.new_pt_right{
				font-size:26rpx;
				color:#333333;
			}
		}
		.new_plan_info{
			padding:24rpx 30rpx 0;
			.new_p_ili{
				font-size:24rpx;
				color:#999999;
				margin-bottom:15rpx;
			}
		}
		.pl_remark{
			padding:24rpx 30rpx;
			font-size:24rpx;
			color:#999999;
		}
		.imglist{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			.planimg{
				width:110rpx;
				height:110rpx;
				border-radius: 10rpx;
				margin-right:24rpx;
			}
		}
		.task_time{
			padding:24rpx 30rpx 0 30rpx;
			border-top:1rpx solid #EDEDED;
			font-size:24rpx;
			margin-top:15rpx;
			color:#999;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.clockimg{
				width:30rpx;
				height:30rpx;
				margin-right:24rpx;
			}
		}
	}
}
//工单信息
.newbox{
	padding-left:70rpx;
	padding-top:20rpx;
	.inp_warp{
		padding:10rpx 0;
		display: flex;
		justify-content: flex-start;
		.inp_title{
			font-size:26rpx;
			color:#999999;
			margin-right:20rpx;
			flex-shrink: 0;
		}
		.form_right{
			font-size:26rpx;
			color:#999999;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.staffimg{
				width:40rpx;
				height:40rpx;
				border-radius: 50%;
				margin-right:15rpx;
			}
		}
	}
}
//产品信息  配件信息
.newwarp{
	.proli{
		padding:24rpx 30rpx 30rpx 60rpx;
		border-bottom:10rpx solid #EDEDED;
		&:last-child{
			border-bottom:0;
		}
		.protext{
			font-size:26rpx;
			color:#999999;
			white-space:normal;
			word-break:break-all;
			margin-bottom:15rpx;
		}
	}
}
.process{
	width:100%;
	.pro_top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#fff;
		padding:0 24rpx 24rpx;
		.top_name{
			font-size:26rpx;
			color:#333;
		}
		.top_beizhu{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:24rpx;
			color:#666;
			.beizhuimg{
				width:30rpx;
				height:30rpx;
				margin-right:15rpx;
			}
		}
	}
	.planscroll{
		width:100%;
		height:calc(100vh - 260rpx);
		background:#f5f5f5;
		padding:24rpx 0;
	}
}
.labelwarp{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap:wrap;
	padding:30rpx 30rpx 6rpx 30rpx;
	margin-bottom:24rpx;
	box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
	.label_li{
		width:198rpx;
		height:66rpx;
		border-radius: 10rpx;
		margin-right:49rpx;
		margin-bottom:24rpx;
		color:#999999;
		text-align: center;
		line-height: 66rpx;
		background:rgba(246, 246, 246, 1);
		&:nth-child(3n){
			margin-right:0;
		}
	}
	.label_liactive{
		background:#fff;
		line-height: 64rpx;
		color:$uni-text-color;
		border:1rpx solid $uni-text-color;
	}
}

.visib_bottom{
	position: fixed;
	left:0;
	bottom:0;
	width:100%;
	background:#fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	padding:10rpx 24rpx;
	border-top:1rpx solid #f5f5f5;
	.program{
		font-size:26rpx;
		color:#0287FF;
	}
	.bot_right{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-wrap: wrap;
		
		.botfir{
			// width:180rpx;
			padding:0 15rpx;
			height:80rpx;
			background:#0287FF;
			font-size:24rpx;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			border-radius: 10rpx;
			margin-right:24rpx;
			margin-bottom:10rpx;
		}
	}
	.botmore{
		.moreimg{
			width:40rpx;
			height:40rpx;
		}
		.moretext{
			font-size:26rpx;
			color:#666;
		}
	}
	
}
</style>
