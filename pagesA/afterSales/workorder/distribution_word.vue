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
				</view>
			</view>
			<view class="stapbox">
				<uni-steps :options="steps" active-color="#008EFF" :active="workorderInfo.process - 1" />
			</view>
			<view class="new_info">
				<view class="new_li">关联客户：{{workorderInfo.customer && workorderInfo.customer.name}}</view>
				<view class="new_li">工单类型：{{workorderInfo.workorder_type}}</view>
			</view>
		</view>
		
		<!-- 更多操作 -->
		<more-pop 
			relation_type="workorder" 
			:relation_id="workorderInfo.id" 
			v-if="false" 
			:staffList="workorderInfo.show_staff_data"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		
		<!-- 标签 -->
		<view class="labelwarp">
			<view class="label_li" @click="changeLabel(1)" :class="tabid == 1 ? 'label_liactive' : ''" >{{demoType == 8 ? '任务进度' : '工单进度'}}</view>
			<view class="label_li" @click="changeLabel(2)" :class="tabid == 2 ? 'label_liactive' : ''" >{{demoType == 8 ? '任务信息' : '工单信息'}}</view>
			<view class="label_li" @click="changeLabel(3)" :class="tabid == 3 ? 'label_liactive' : ''" >产品/配件信息</view>
			<view class="label_li" @click="changeLabel(4)" :class="tabid == 4 ? 'label_liactive' : ''" >费用信息</view>
			<view class="label_li" @click="changeLabel(5)" :class="tabid == 5 ? 'label_liactive' : ''" >物流信息</view>
			<view class="label_li" @click="changeLabel(6)" :class="tabid == 6 ? 'label_liactive' : ''" >操作记录</view>
		</view>
		<!-- 工单状态 -->
		<view class="newwarp" v-if="tabid == 2">
			<view class="new_title" style="margin-bottom:24rpx;">工单信息</view>
			<view class="newbox">
				<view class="inp_warp">
					<view class="inp_title">工单标题:</view>
					<view class="form_right">
						<view>{{workorderInfo.title}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">工单类型:</view>
					<view class="form_right">
						<view>{{workorderInfo.workorder_type}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">工单编号:</view>
					<view class="form_right">
						<view>{{workorderInfo.workorder_number}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">创建人:</view>
					<view class="form_right">
						<image :src="workorderInfo.create_staff.img" class="staffimg" ></image>
						<view>{{workorderInfo.create_staff.name ? workorderInfo.create_staff.name : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">所属人:</view>
					<view class="form_right">
						<image :src="workorderInfo.owner_staff.img" class="staffimg" ></image>
						<view>{{workorderInfo.owner_staff.name ? workorderInfo.owner_staff.name : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">附件:</view>
					<view class="form_right" v-if="workorderInfo.file.length != 0">
						<view class="imglist">
							<image :src="ele.file_path" v-for="(ele,fileindex) in workorderInfo.file" :key="fileindex" @click="previeImgFile(workorderInfo.file,fileindex)" class="planimg" ></image>
						</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">接受工单时间:</view>
					<view class="form_right">
						<view>{{workorderInfo.accept_time ? workorderInfo.accept_time : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">配送信息:</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">收货人:</view>
					<view class="form_right">
						<view>{{workorderInfo.consignee ? workorderInfo.consignee : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">联系方式:</view>
					<view class="form_right">
						<view>{{workorderInfo.consignee_mobile ? workorderInfo.consignee_mobile : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">收货地址:</view>
					<view class="form_right">
						<view v-if="workorderInfo.delivery_address_detail && workorderInfo.delivery_address">{{workorderInfo.delivery_address+workorderInfo.delivery_address_detail}}</view>
						<view v-else>{{workorderInfo.delivery_address?workorderInfo.delivery_address:''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">要求交货时间:</view>
					<view class="form_right">
						<view>{{workorderInfo.delivery_time ? workorderInfo.delivery_time : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">实际交货时间:</view>
					<view class="form_right">
						<view>{{workorderInfo.actual_delivery_time ? workorderInfo.actual_delivery_time : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">是否需要安装:</view>
					<view class="form_right">
						<view v-if="workorderInfo.is_install == 1">是</view>
						<view v-if="workorderInfo.is_install == 0">否</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">回执时间:</view>
					<view class="form_right">
						<view>{{workorderInfo.receipt_date ? workorderInfo.receipt_date : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">回执单:</view>
					<view class="form_right">
						<view class="imglist" v-if="workorderInfo.receipt_file_ids && workorderInfo.receipt_file_ids.length != 0">
							<image :src="ele" v-for="(ele,fileindex) in workorderInfo.receipt_file_ids" :key="fileindex" @click="previeImg(workorderInfo.receipt_file_ids,fileindex)" class="planimg" ></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="process" v-if="tabid == 1">
			<view class="pro_top">
				<view class="top_name"></view>
				<view class="top_beizhu" @click="toAddSign">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg" ></image>
					添加跟进
				</view>
			</view>
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
		
		<view class="newwarp" v-if="tabid == 3">
			<view class="new_title" style="margin-bottom:24rpx;">产品/配件信息</view>
			<view v-if="workorderInfo.workorder_type == '配件配送'">
				<view class="proli">
					<view class="proli_top">
						<view class="protext">名称</view>
						<view class="protext">编号</view>
						<view class="protext">数量</view>
					</view>
				</view>
				<view class="proli" v-for="(item,index) in workorderInfo.parts" :key="index">
					<view class="proli_top">
						<view class="protext">{{item.name}}</view>
						<view class="protext">{{item.num}}</view>
						<view class="protext">{{item.number}}</view>
					</view>
				</view>
			</view>
			<view v-if="workorderInfo.workorder_type == '产品发货'">
				<view class="new_pro" v-for="(item,index) in workorderInfo.customer_product" :key="index">
					<view class="new_pro_li">产品：{{item.product.name}}</view>
					<view class="new_pro_li">产品编号：{{item.number?item.number:0}}</view>
					<view class="product_img">
						<view class="img_title">附件：</view>
						<view class="imglist" v-if="item.file_ids.length != 0">
							<view class="imgbox" v-for="(imgitem,imgindex) in item.file_ids" :key="imgindex">
								<image :src="imgitem" class="selfimg"  @click="toPriveImg(item.file_ids,imgindex)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="opretion_warp" v-if="tabid == 6">
			<view class="opretion_li" v-for="(item,index) in operationList" :key="index">
				<view class="opreinfo">
					<image :src="item.staff.img ? item.staff.img : '/static/index/header.png'" class="opreimg" ></image>
					<view class="oprename">{{item.staff.name}}</view>
				</view>
				<view class="opreright">
					<view class="righttop">
						操作内容：<span v-html="item.content"></span>
					</view>
					<view class="righttop">
						操作时间：{{item.createtime}}
					</view>
				</view>
			</view>
		</view>
		<!-- 物流信息 -->
		<view class="logi_warp" v-if="tabid == 5">
			<view class="editRepair" v-if="workorderInfo.process == 3">
				<view class="editbtn" @click="toEditLog">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg" ></image>
					修改物流信息
				</view>
			</view>
			<view class="logi_li" v-for="(item,index) in logisticsList" :key="index" >
				<view class="" v-if="item.type == '物流配送'">
					<view class="logi_top">
						<view class="log_num">单号：{{item.number}}</view>
						<view class="logi_f" @click="toCopy(item.number)">复制</view>
					</view>
					<view class="logi_info">
						<view>时间：</view>
						<view>{{item.createtime}}</view>
					</view>
					<view class="logi_img">
						<view>附件：</view>
						<view class="imgbox">
							<image :src="ele.url" @click="previeImgLog(item.file_ids,indexele)" v-for="(ele,indexele) in item.file_ids" :key="indexele" class="selflogi" ></image>
						</view>
					</view>
					<view class="logi_img" style="margin-top:0;">
						<view>物流信息：</view>
						<uni-steps direction="column" :options="item.content" :active="item.content.length" />
					</view>
				</view>
				<view v-if="item.type == '送货上门'">
					<view class="logi_info">
						<view>送货方式：</view>
						<view>{{item.company}}</view>
					</view>
					<view class="logi_img">
						<view>附件：</view>
						<view class="imgbox">
							<image :src="ele.url" @click="previeImgLog(item.file_ids,indexele)" v-for="(ele,indexele) in item.file_ids" :key="indexele" class="selflogi" ></image>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<!-- 添加费用 -->
		<view class="process" v-if="tabid == 4">
			<view class="pro_top">
				<view class="top_name"></view>
				<view class="top_beizhu" @click="toAddcost">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg" ></image>
					添加费用
				</view>
			</view>
			<scroll-view scroll-y class="planscroll" @scrolltolower="loadMoreCost">
				<view class="planwarp">
					<view class="itemwarp"  v-for="(item,index) in costList" :key="index" @tap.stop="toFreeDetail(item)">
						<view class="newitem">
							<view class="itemnum">报销单号：{{item.number}}</view>
						</view>
						<view class="newiteminfo">
							<view class="neleft">
								<view class="neli">消费金额：{{item.money}}</view>
								<view class="neli">
									<image :src="BASE_IMG_URL + '/index/clock.png'" class="neclock" ></image>
									<view class="nelitext">{{item.submit_date}}</view>
								</view>
							</view>
							<view class="neright">
								<image :src="BASE_IMG_URL+'/index/check.png'" v-if="item.check_status == 1" class="itemstatusimg" ></image>
								<image :src="BASE_IMG_URL+'/index/passed.png'" v-if="item.check_status == 2" class="itemstatusimg" ></image>
								<image :src="BASE_IMG_URL+'/index/refused.png'" v-if="item.check_status == 3" class="itemstatusimg" ></image>
								<image :src="BASE_IMG_URL+'/index/stoped.png'" v-if="item.check_status == 9" class="itemstatusimg" ></image>
							</view>
						</view>
					</view>
					<view class="noData" v-if="costList.length == 0">暂无更多</view>
				</view>
			</scroll-view>
		</view>
		
		<view style="height:110rpx;"></view>
		
		<view class="bot_more_operation"   v-if="workorderInfo.status != 3 && workorderInfo.status != 9">
			<view class="bot_more_li" v-if="workorderInfo.status == 1 && workorderInfo.is_operation == 1" @click="acceptWork(1)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">接受工单</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.status != 1 && workorderInfo.is_operation == 1" @click="toWritePeisong">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">填写配送信息</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.is_operation_logistics == 1 && workorderInfo.workorder_type == '产品发货' && workorderInfo.is_operation == 1" @click="toWriteWuliu">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">填写物流信息</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.workorder_type == '配件配送' && workorderInfo.process == 2 && workorderInfo.is_operation == 1" @click="toWriteWuliu">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">填写物流信息</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.process == 3 && workorderInfo.is_operation == 1" @click="toComplete">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">已到货</view>
			</view>
			<view class="bot_more_li" @click="moreOperation">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="li_img" ></image>
				<view class="li_text">更多操作</view>
			</view>
		</view>
		<view v-if="workorderInfo.status == 3 && workorderInfo.is_operation == 1 && !workorderInfo.receipt_date" class="bot_more_operation">
			<view class="bot_more_li" @click="toFillreceipt">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">填写回执单</view>
			</view>
		</view>
		
		<more-disoperation
			ref="operationChild"
			:lng="lng"
			:lat="lat"
			:location="location"
			:workorderInfo="workorderInfo"
			@toQuerylat="getLocationInfo"
			@successFul="successFul"
		></more-disoperation>
		
		
	</view>
</template>

<script>
	import { netWorkOrderDetail, netWorkorderStatusList, netRevokeWorkorder, netAcceptWorkOrder, netCostList, 
	netStartWorkOrder, netLogisticsList, netProductInstallArrive, netCompleteWorkorder, netLngTransAddress } from '@/api/api.js'
	import { netOperationRecord } from '@/api/template.js'
	import { commonFun } from '@/common/navigate.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import moreDisoperation from './more-disoperation.vue'
	export default {
		mixins:[commonFun],
		components:{
			moreDisoperation
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				active:0,
				steps: [{
						text: '待开始',
					},
					{
						text: '备货中',
					},
					{
						text: '运输中',
					},
					{
						text: '已送达',
					},
				],
				installSteps:[
					{text:'已出发'},
					{text:'已到达'},
					{text:'已完成'}
				],
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
				tabList:[
					{id:1,name:'工单进度'},
					{id:2,name:'工单信息'},
					{id:3,name:'产品信息'},
					{id:4,name:'费用信息'},
					{id:5,name:'物流信息'},
					{id:6,name:'操作记录'}
				],
				tabid:1,
				//接受工单 信息
				lng:'',
				lat:'',
				location:'',
				
				operationList:[],   //操作记录
				logisticsList:[],  //物流信息
				costList:[],   //费用 信息
				costPage:1,
				costTotalpage:1,
				//8 任务详情   1工单详情
				demoType:1,
				remindPeople:[],
				examineType:'',
			}
		},
		onLoad(options) {
			this.workOrderid = options.workorderid
			if(options.type){
				this.demoType = options.type
				uni.setNavigationBarTitle({
					title:'任务详情'
				})
			}
			//获取定位信息
			this.getLocationInfo()
		},
		onShow() {
			this.getDefaultRemind()
			if(!this.isPriviimg){
				this.queryData()
				
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
			//填写回执单
			toFillreceipt() {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorder/fill_receipt?id='+this.workorderInfo.id
				})
			},
			//产品发货 接受工单  type  1接受工单   2开始工单
			acceptWork(type) {
				if(!this.location){
					uni.showToast({
						title:'请允许使用位置信息',
						icon:'none'
					})
					this.getLocationInfo()
					return
				}
				let params = {
					id: this.workorderInfo.id,
					lng: this.lng,
					lat: this.lat,
					location: this.location
				}
				if(type == 1){
					netAcceptWorkOrder(params).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							this.getDetail()
							this.queryData()
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
							this.queryData()
						},2000)
					})
				}
			},
			//填写配送信息
			toWritePeisong() {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorder/fill_peisong_info?id='+this.workorderInfo.id+'&customerid='+this.workorderInfo.customer.id
				})
			},
			//填写物流信息
			toWriteWuliu() {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorder/fill_wuliu_info?id='+this.workorderInfo.id+'&type='+this.workorderInfo.workorder_type
				})
			},
			//已完成
			toComplete() {
				netCompleteWorkorder({id:this.workorderInfo.id}).then(res=>{
					if(this.workorderInfo.is_install == 1) {
						uni.showToast({
							title:'配送完成，已生成安装工单',
							icon:'none'
						})
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
					setTimeout(()=>{
						this.getDetail()
						this.queryData()
					},2000)
				})
			},
			successFul() {
				this.getDetail()
				this.queryData()
			},
			//查看图片
			toPriveImg(arr,index) {
				this.isPriviimg = true
				uni.previewImage({
					current:index,
					urls:arr
				})
			},
			//通过
			toPass() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.workOrderid+'&type=workorder&status=1'
				})
			},
			//拒绝
			toRefuse() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.workOrderid+'&type=workorder&status=2'
				})
			},
			//去支付
			toPay() {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorder_payment?workorderid='+this.workOrderid+'&money='+this.workorderInfo.money
				})
			},
			//每日签到
			toAddSign() {
				uni.navigateTo({
					url:'/pagesA/afterSales/everyDay_sign?workorderid='+this.workOrderid
				})
			},
			getLocationInfo() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.lng = res.longitude
						this.lat = res.latitude
						//地址逆解析
						let params = {
							lat: res.latitude,
							lng: res.longitude
						}
						netLngTransAddress(params).then(data=>{
							data = data.data.result
							this.location = data.address
						})
					},
					fail: (err) => {
						console.log(err, '错误')
						if(err.errMsg == "getLocation:fail auth deny"){
							uni.showToast({
								title:'请允许使用位置信息',
								icon:'none'
							})
						}
					},
					complete:(udata)=>{
						console.log(udata,'456')
					}
				})
			},
			getDetail(){
				netWorkOrderDetail({id:this.workOrderid}).then(res=>{
					this.workorderInfo = res.data
				})
			},
			//添加 费用
			toAddcost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost?customerid='+this.workorderInfo.customer.id+'&relationid='+this.workOrderid+'&event_type=workorder'
				})
			},
			//费用详情
			toFreeDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/detail?id='+item.id
				})
			},
			//加载更多   费用
			loadMoreCost() {
				if(this.costPage >= this.costTotalpage){
					return
				}
				this.costPage ++
				this.getCostlist()
			},
			//费用列表
			getCostlist() {
				let params = {
					relation_type: 'workorder',
					relation_id: this.workOrderid,
					customer_id: this.workorderInfo.customer.id,
					page: this.costPage,
				}
				netCostList(params).then(res=>{
					this.costList = this.costList.concat(res.data.data)
					this.costTotalpage = res.data.last_page
				})
			},
			//电话 远程知道
			toPhoneGuid() {
				uni.showModal({
					content:'请确认是否电话联系客户?',
					cancelText:'未联系',
					confirmText:'已联系',
					success:(res)=>{
						if(res.confirm) {
							uni.navigateTo({
								url:'/pagesA/afterSales/phone_guidance?orderid='+this.workorderInfo.id+'&proid='+this.workorderInfo.aftermarket_type_ids
							})
						}
					}
				})
			},
			//添加 工单备注
			toAddremark(type) {
				//type   1添加跟进   2完成工单   3出发   4开始工单（设计工单）
				if(type == 3 && (this.workorderInfo.workorder_type == '上门安装' || this.workorderInfo.workorder_type == '上门维修')){
					//上门安装出发  上门维修出发
					uni.navigateTo({
						url:'/pagesA/afterSales/toDoorSign?workorderid='+this.workorderInfo.id
					})
				}else{
					uni.navigateTo({
						url:'/pagesA/afterSales/toSign?workorderid='+this.workorderInfo.id+'&type='+type
					})
				}
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
			previeImg(urlarr,index) {
				uni.previewImage({
					urls: urlarr,
					current: index,
					success:(res)=>{
						this.isPriviimg = true
					}
				})
			},
			previeImgLog(imgarr,index) {
				let arr = []
				imgarr.forEach(ele=>{
					arr.push(ele.url)
				})
				uni.previewImage({
					urls: arr,
					current: index,
					success:(res)=>{
						this.isPriviimg = true
					}
				})
			},
			previeImgFile(files,index){
				let arr = []
				files.forEach(ele=>{
					arr.push(ele.file_path)
				})
				uni.previewImage({
					urls: arr,
					current: index,
					success:(res)=>{
						this.isPriviimg = true
					}
				})
			},
			//查看位置
			toSeeLocation(item) {
				uni.openLocation({
					latitude: Number(item.lat),
					longitude: Number(item.lng),
					address:item.location,
					name:item.location,
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			queryData() {
				if(this.tabid == 6) {
					//操作记录
					this.getOperationList()
				}else if(this.tabid == 5) {
					//物流信息
					this.getLogisList()
				}else if(this.tabid == 4) {
					//费用列表
					this.costPage = 1
					this.costList = []
					this.getCostlist()
				}else if(this.tabid == 1) {
					//工单状态 列表
					this.page = 1
					this.processList = []
					this.getStatusList()
				}
			},
			changeLabel(id) {
				this.tabid = id
				this.queryData()
			},
			//操作记录
			getOperationList() {
				let params = {
					relation_type: 8,
					relation_id: this.workOrderid
				}
				netOperationRecord(params).then(res=>{
					this.operationList = res.data
				})
			},
			//修改物流信息
			toEditLog() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/editLogistics?id='+this.workOrderid
				})
			},
			//物流信息
			getLogisList() {
				netLogisticsList({workorder_id:this.workOrderid}).then(res=>{
					this.logisticsList = res.data
				})
			},
			//复制 物流单号
			toCopy(number) {
				uni.setClipboardData({
					data: number,
					success:(res)=>{
						uni.showToast({
							title:'复制成功',
							icon:'none'
						})
					}
				})
			},
			
			//查看 解决方案
			toLookProgram() {
				uni.navigateTo({
					url:'/pagesA/user/knowledge_base/list?id='+this.workorderInfo.aftermarket_type_ids
				})
			},
			
			//添加 物流信息
			toAddlogistics() {
				uni.navigateTo({
					url:'/pagesA/afterSales/addLogisticsInfo?workorderid='+this.workOrderid
				})
			},
			//录入 产品编号1   编辑产品编号2
			toInputNumber(type) {
				uni.navigateTo({
					url:'/pagesA/afterSales/productNumber?type='+type+'&workorderid='+this.workOrderid
				})
			},
			//上门 产品安装 上门维修 到达 签到
			arriveSign() {
				uni.navigateTo({
					url:'/pagesA/afterSales/arriveSign?eventid='+this.workOrderid+'&cusname='+this.workorderInfo.customer.name+'&customerid='+this.workorderInfo.customer.id+'&carType='+this.workorderInfo.car_type
				})
			},
			//安装完成  完成工单
			toInstallComplate() {
				if(this.workorderInfo.workorder_type == '上门维修'){
					uni.navigateTo({
						url:'/pagesA/afterSales/arriveCost?workorderid='+this.workOrderid+'&proid='+this.workorderInfo.aftermarket_type_ids
					})
				}else if(this.workorderInfo.workorder_type == '上门安装'){
					uni.navigateTo({
						url:'/pagesA/afterSales/install_complete?workorderid='+this.workOrderid
					})
				}
			},
			//录入费用
			toInputFee() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/inputExpense?id='+this.workOrderid+'&type='+this.workorderInfo.workorder_type
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
	// 工单信息
	.newbox{
		padding-left:70rpx;
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
				.imglist{
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					.planimg{
						width:100rpx;
						height:100rpx;
						border-radius: 5rpx;
					}
				}
			}
		}
	}
	
	
	.editRepair{
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom:20rpx;
		padding:15rpx 30rpx;
		.editbtn{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			text-align: center;
			line-height: 60rpx;
			.beizhuimg{
				width:30rpx;
				height:30rpx;
				margin-right:10rpx;
			}
		}
	}
	.imglist {
		padding: 24rpx 20rpx;
		background: #fff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.imgbox {
			width: 140rpx;
			height: 140rpx;
			margin-right: 50rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EAEAEA;
			&:nth-child(3n){
				margin-right:0;
			}
			.selfimg {
				width: 140rpx;
				height: 140rpx;
			}
		}
	}
	.itemwarp{
		width:690rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin:24rpx auto 0;
		padding:0 40rpx;
		.newitem{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0;
			border-bottom:1rpx solid #EDEDED;
			.item_radio{
				radio{
					transform: scale(0.7);
				}
			}
			.itemnum{
				font-size:26rpx;
				color:#666666;
			}
			.itemstaff{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size:22rpx;
				color:#999999;
				.staffimg{
					width:45rpx;
					height:45rpx;
					border-radius: 50%;
					margin-left:20rpx;
				}
			}
		}
		.newiteminfo{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 35rpx 24rpx 0;
			.neleft{
				.neli{
					font-size:26rpx;
					color:#999999;
					margin-bottom:15rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.neclock{
						width:30rpx;
						height:30rpx;
						margin-right:15rpx;
					}
				}
			}
		}
		.neright{
			width:122rpx;
			height:96rpx;
			.itemstatusimg{
				width:122rpx;
				height:96rpx;
			}
		}
	}
// 工单状态
.planwarp{
	width:100%;
	padding-top:20rpx;
	.new_plan_li{
		width:690rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin:0 auto 24rpx;
		padding-bottom:24rpx;
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
				&:last-child{
					margin-bottom:0;
				}
			}
		}
		.pl_remark{
			padding:20rpx 30rpx;
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
//产品信息  配件信息
.proli{
	padding:24rpx 30rpx;
	border-bottom:1rpx solid #f5f5f5;
	&:last-child{
		border-bottom:0;
	}
	.proli_top{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.icon-jian{
		font-size:42rpx;
		color:#ff7800;
	}
	.protext{
		width:200rpx;
		font-size:26rpx;
		color:#999999;
		white-space:normal;
		word-break:break-all;
		margin-bottom:15rpx;
	}
}
.new_pro{
	padding-left:70rpx;
	border-bottom: 10rpx solid #EDEDED;
	padding-bottom:24rpx;
	margin-bottom:24rpx;
	&:last-child{
		border-bottom: 0;
	}
	.new_pro_li{
		font-size:26rpx;
		color:#999999;
		margin-bottom:15rpx;
	}
	.product_img{
		.img_title{
			font-size:26rpx;
			color:#999999;
			margin-bottom:15rpx;
		}
		.imglist{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.imgbox{
				width:110rpx;
				height:110rpx;
				border-radius: 10rpx;
				.selfimg{
					width:110rpx;
					height:110rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
}

.probox{
	width:690rpx;
	background:#fff;
	margin:0 auto 24rpx;
	border-radius: 20rpx;
	box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
	.protitle{
		font-size:26rpx;
		color:#000;
		font-weight: bold;
		padding:24rpx;
		margin-top:24rpx;
	}
}
//操作内容
.opretion_warp{
	background:#fff;
	width:690rpx;
	margin:0 auto 24rpx;
	box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
	border-radius: 20rpx;
	.opretion_li{
		display: flex;
		justify-content: flex-start;
		margin-bottom:24rpx;
		padding-bottom:20rpx;
		border-bottom:1rpx solid #f5f5f5;
		padding:24rpx 30rpx;
		.opreinfo{
			flex-shrink: 0;
			text-align: center;
			margin-right:24rpx;
			.opreimg{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				margin-bottom:10rpx;
			}
			.oprename{
				font-size:26rpx;
				color:#333;
			}
		}
		.opreright{
			.righttop{
				font-size:24rpx;
				color:#666;
				margin-bottom:10rpx;
				display: flex;
				justify-content: flex-start;
			}
		}
	}
}
//物流信息
.logi_warp{
	padding:24rpx;
	.logi_li{
		width:690rpx;
		background:#fff;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		padding:0 30rpx;
		.logi_top{
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.log_num{
				font-size:28rpx;
				color:#333333;
			}
			.logi_f{
				font-size:28rpx;
				color:$uni-text-color;
				margin-left:24rpx;
			}
		}
		.logi_info{
			display: flex;
			justify-content: flex-start;
			padding-top:24rpx;
			font-size:28rpx;
			color:#666666;
			margin-bottom:15rpx;
		}
		.logi_img{
			font-size:28rpx;
			color:#666666;
			margin-top:24rpx;
			.imgbox{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-top:24rpx;
				.selflogi{
					width:150rpx;
					height:150rpx;
					margin-right:20rpx;
					margin-bottom:20rpx;
					&:nth-child(3n){
						margin-right:0;
					}
				}
			}
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
		padding:24rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
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
		padding:24rpx 0;
	}
}
.labelwarp{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap:wrap;
	padding:30rpx;
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
	height:100rpx;
	background:#fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding:0 24rpx;
	border-top:1rpx solid #f5f5f5;
	z-index:99;
	.program{
		font-size:26rpx;
		color:#0287FF;
	}
	.bot_right{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.ribhtbox{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			flex-wrap: wrap;
		}
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
