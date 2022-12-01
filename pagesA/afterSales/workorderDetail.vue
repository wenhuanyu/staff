<template>
	<view style="background-color: #ededed;">
		<view class="work_warp">
			<view class="title">工单进度</view>
			<view class="statusbox">
				<view class="statustip" v-if="workorderInfo.check_status == 1 && workorderInfo.status != 9" >优惠费用待审核</view>
				<view v-else>
					<view class="statustip" v-if="workorderInfo.status == 0">待分配</view>
					<view class="statustip" v-if="workorderInfo.status == 1">待处理</view>
					<view class="statustip" v-if="workorderInfo.status == 2">处理中</view>
					<view class="statustip" v-if="workorderInfo.status == 3">已完成</view>
					<view class="statustip" v-if="workorderInfo.status == 9">已终止</view>
				</view>
			</view>
			<view class="stapbox">
				<uni-steps :options="steps" active-color="#008EFF" :active="workorderInfo.process" v-if="workorderInfo.workorder_type == '产品发货'" />
				<uni-steps :options="installSteps" active-color="#008EFF" :active="workorderInfo.process - 1" v-if="workorderInfo.workorder_type == '上门安装' || workorderInfo.workorder_type == '上门维修' || workorderInfo.workorder_type == '定期检修'" />
				<uni-steps :options="shejiStepa" active-color="#008EFF" :active="workorderInfo.process - 1" v-if="workorderInfo.workorder_type == '设计工单'" />
			</view>	
			<view class="cus_info">
				<view class="cus_name">客户：{{workorderInfo.customer && workorderInfo.customer.name}}</view>
				<view class="cus_name">地址：<span style="color:#008EFF" v-if="workorderInfo.address" @click="toNavigation">{{workorderInfo.address}}{{workorderInfo.address_detail?workorderInfo.address_detail:''}}</span> </view>
				<view class="cus_name" v-if="workorderInfo.contacts">客户联系人：{{workorderInfo.contacts.name}}-- <span style="color:#008EFF" @click="toCall(workorderInfo.contacts.mobile)">{{workorderInfo.contacts.mobile}}</span> </view>
				<view class="cus_name">工单类型：{{workorderInfo.workorder_type}}</view>
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
			<view class="label_li" @click="changeLabel(1)" :class="tabid == 1 ? 'label_liactive' : ''" >{{demoType == 8 ? '任务进度' : '工单进度'}}</view>
			<view class="label_li" @click="changeLabel(2)" :class="tabid == 2 ? 'label_liactive' : ''" >{{demoType == 8 ? '任务信息' : '工单信息'}}</view>
			<view class="label_li" @click="changeLabel(3)" :class="tabid == 3 ? 'label_liactive' : ''" >产品信息</view>
			<view class="label_li" v-if="workorderInfo.workorder_type != '设计工单' && workorderInfo.workorder_type != '产品发货' && workorderInfo.workorder_type != '配件安装' && workorderInfo.workorder_type != '生产工单'" @click="changeLabel(7)" :class="tabid == 7 ? 'label_liactive' : ''" >配件信息</view>
			<view class="label_li" v-if="workorderInfo.workorder_type != '生产工单'" @click="changeLabel(4)" :class="tabid == 4 ? 'label_liactive' : ''" >费用信息</view>
			<view class="label_li" v-if="workorderInfo.workorder_type == '产品发货'" @click="changeLabel(5)" :class="tabid == 5 ? 'label_liactive' : ''" >物流信息</view>
			<view
				class="label_li" 
				v-if="workorderInfo.workorder_type == '上门维修'" 
				@click="changeLabel(6)" 
				:class="tabid == 6 ? 'label_liactive' : ''" 
			>回访/评价</view>
			<view 
				class="label_li" 
				v-if="workorderInfo.workorder_type != '生产工单' && workorderInfo.workorder_type != '上门维修'" 
				@click="changeLabel(6)" 
				:class="tabid == 6 ? 'label_liactive' : ''" 
			>回访内容</view>
		</view>
		
		<!-- 工单信息/任务信息 -->
		<view class="listwarp" v-if="tabid == 2">
			<view class="title">工单信息</view>
			<view class="editRepair">
				<view class="editbtn" v-if="(workorderInfo.process == 4 || workorderInfo.process == 7) && workorderInfo.status != 3 && workorderInfo.status != 9 && workorderInfo.is_leader == 1" @click="toEditCost">
					<image :src="BASE_IMG_URL+'/index/edit-address.png'" class="beizhuimg" ></image>
					修改费用
				</view>
			</view>
			<view v-if="(workorderInfo.workorder_type == '上门维修' || workorderInfo.workorder_type == '返厂维修') && (workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1)">
				<view class="inp_warp">
					<view class="inp_title">配件配送工单</view>
					<view class="form_right" @click="toAddPartDis">
						<view class="color_bg" style="font-weight: bold;margin-left:24rpx">+添加</view>
					</view>
				</view>
				<view class="order_warp">
					<view 
						class="order_warp_li" 
						v-for="(item,index) in workorderInfo.peisong" 
						:key="index"
						@click="toRelationWork(item)"
					>
						{{item.title}}--{{item.workorder_number}}
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">配件安装工单</view>
					<view class="form_right" @click="toAddPartInstall">
						<view class="color_bg" style="font-weight: bold;margin-left:24rpx">+添加</view>
					</view>
				</view>
				<view class="order_warp">
					<view 
						class="order_warp_li" 
						v-for="(item,index) in workorderInfo.anzhuang" 
						:key="index"
						@click="toAnzhuangWork(item)"
					>{{item.title}}--{{item.workorder_number}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">创建人：</view>
				<view class="form_right">
					<image :src="workorderInfo.create_staff.img" class="staffimg" ></image>
					<view>{{workorderInfo.create_staff.name ? workorderInfo.create_staff.name : ''}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">归属人：</view>
				<view class="form_right">
					<image :src="workorderInfo.owner_staff.img" class="staffimg" ></image>
					<view>{{workorderInfo.owner_staff.name ? workorderInfo.owner_staff.name : ''}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">工单标题：</view>
				<view class="form_right">
					<view>{{workorderInfo.title}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">工单类型：</view>
				<view class="form_right">
					<view>{{workorderInfo.workorder_type}}</view>
				</view>
			</view>
			<view class="inp_warp" v-if="workorderInfo.workorder_type == '上门维修'">
				<view class="inp_title">附件：</view>
				<view class="form_right" v-if="workorderInfo.file.length != 0">
					<view class="imglist">
						<image 
							:src="ele.file_path" v-for="(ele,eleindex) in workorderInfo.file" 
							@click="toPriveObjImg(workorderInfo.file,eleindex)" 
							:key="eleindex" 
							class="planimg" 
						></image>
					</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">工单编号：</view>
				<view class="form_right">
					<view>{{workorderInfo.workorder_number}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">接受工单时间：</view>
				<view class="form_right">
					<view>{{workorderInfo.accept_time ? workorderInfo.accept_time : ''}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">开始处理时间：</view>
				<view class="form_right">
					<view>{{workorderInfo.start_time ? workorderInfo.start_time : ''}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">结束时间：</view>
				<view class="form_right">
					<view>{{workorderInfo.end_time ? workorderInfo.end_time : ''}}</view>
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title">备注：</view>
				<view class="form_right">
					<view>{{workorderInfo.remarks ? workorderInfo.remarks : ''}}</view>
				</view>
			</view>
			<view class="inp_warp" v-if="workorderInfo.workorder_type == '上门安装' || workorderInfo.workorder_type == '上门维修'">
				<view class="inp_title">处理结果：</view>
				<view class="form_right" v-if="workorderInfo.workorder_type == '上门安装'">
					<view v-if="workorderInfo.resolved_results == 1">安装成功</view>
					<view v-if="workorderInfo.resolved_results == 9">安装失败</view>
				</view>
				<view class="form_right" v-if="workorderInfo.workorder_type == '上门维修'">
					<view v-if="workorderInfo.resolved_results == 1">维修成功</view>
					<view v-if="workorderInfo.resolved_results == 9">维修失败</view>
					<view v-if="workorderInfo.resolved_results == 12">返厂维修</view>
				</view>
			</view>
			<view v-if="workorderInfo.workorder_type == '上门维修'">
				<view class="inp_warp">
					<view class="inp_title">是否过保：</view>
					<view class="form_right">
						<view v-if="workorderInfo.is_over == 1">过保</view>
						<view v-if="workorderInfo.is_over == 2">未过保</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.resolved_results == 12">
					<view class="inp_title">返厂方式：</view>
					<view class="form_right">
						<view>{{workorderInfo.logistics_type?workorderInfo.logistics_type:''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title">情况说明：</view>
					<view class="form_right">
						<view>{{workorderInfo.desc?workorderInfo.desc:''}}</view>
					</view>
				</view>
			</view>
			<view v-if="workorderInfo.workorder_type == '上门安装'">
				<view class="inp_warp">
					<view class="inp_title">情况说明：</view>
					<view class="form_right">
						<view style="color:#666">{{workorderInfo.results?workorderInfo.results:''}}</view>
					</view>
				</view>
			</view>
			
			<view v-if="workorderInfo.workorder_type == '上门维修' || workorderInfo.workorder_type == '上门安装'">
				<view class="inp_warp" >
					<view class="inp_title" v-if="workorderInfo.workorder_type == '上门维修'">维修完成确认人姓名：</view>
					<view class="inp_title" v-else>安装完成确认人姓名：</view>
					<view class="form_right">
						<view>{{workorderInfo.complete_name?workorderInfo.complete_name:''}}</view>
					</view>
				</view>
				<view class="inp_warp" >
					<view class="inp_title" v-if="workorderInfo.workorder_type == '上门维修'">维修完成确认人联系方式：</view>
					<view class="inp_title" v-else>安装完成确认人联系方式：</view>
					<view class="form_right">
						<view>{{workorderInfo.complete_contact?workorderInfo.complete_contact:''}}</view>
					</view>
				</view>
			</view>
			<view v-if="workorderInfo.train_content.length != 0" style="padding:24rpx 40rpx 24rpx 50rpx;">
				<view class="traintit" style="font-size:32rpx;margin-bottom:24rpx;">培训内容</view>
				<view class="trainli" v-for="(item,index) in workorderInfo.train_content" :key="index">
					<view class="train_name">({{index + 1}}){{item.name}}</view>
					<view class="train_con" v-for="(ele,eleindex) in item.content" :key="eleindex">
						<view class="min_name">({{index + 1}}.{{eleindex + 1}}){{ele.type}}</view>
						<view class="min_box">
							<view class="min_tit">培训结果:</view>
							<view class="min_con">{{ele.result}}</view>
						</view>
						<view class="min_box">
							<view class="min_tit">培训人员:</view>
							<view class="imglist" style="padding:0" v-if="ele.autograph">
								<view class="imgbox" v-for="(imgele,imgindex) in ele.autograph" :key="index" @click="toPreIme(ele.autograph,imgindex)">
									<image :src="imgele.url" class="selfimg"  ></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="inp_warp" v-if="workorderInfo.is_autograph == 1 && workorderInfo.workorder_type == '上门安装'">
				<view class="inp_title">客户签名</view>
				<view class="form_right">
					<image :src="workorderInfo.autograph_url" class="signImg" @click="toPrevieImg(workorderInfo.autograph_url)" ></image>
				</view>
			</view>
			<view v-if="workorderInfo.workorder_type == '上门维修' || workorderInfo.workorder_type == '配件安装'">
				<view v-if="workorderInfo.is_pay != 1 || (workorderInfo.is_pay == 1 && workorderInfo.is_revoke == 1)">
				<view class="inp_warp">
					<view class="inp_title">含税方式：</view>
					<view class="form_right">
						<view>{{workorderInfo.tax ? workorderInfo.tax : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >服务费用：</view>
				</view>
				<view class="inp_warp" v-for="(item,index) in workorderInfo.pay_service" :key="index">
					<view class="inp_title">{{item.name}}:</view>
					<view class="form_right">
						<view>{{item.money}}元</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >配件费用：</view>
				</view>
				<view class="proowarp" v-if="workorderInfo.workorder_type == '上门维修' && workorderInfo.use_parts.length != 0">
					<view class="prali" v-for="(item,index) in workorderInfo.use_parts" :key="index">
						<view class="partli">{{item.name}}</view>
						<view class="partli" style="text-align: center;">{{item.number}}</view>
						<view class="partli" style="text-align: center;">￥{{item.price}}</view>
						<view class="partli" v-if="item.is_charge == 1">收费</view>
						<view class="partli" v-if="item.is_charge == 0">不收费</view>
					</view>
				</view>
				<view class="proowarp" v-if="workorderInfo.workorder_type == '配件安装' && workorderInfo.use_parts.length != 0">
					<view class="prali" v-for="(item,index) in workorderInfo.use_parts" :key="index">
						<view class="partli">{{item.name}}</view>
						<view class="partli" style="text-align: center;">{{item.number}}</view>
						<view class="partli" style="text-align: center;">￥{{item.price}}</view>
						<view class="partli" v-if="item.is_charge == 1">收费</view>
						<view class="partli" v-if="item.is_charge == 0">不收费</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >总价格：</view>
					<view class="form_right">
						<view>{{workorderInfo.total_money ? workorderInfo.total_money : ''}}元</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >是否收费：</view>
					<view class="form_right">
						<view v-if="workorderInfo.is_charge == 1">收费</view>
						<view v-if="workorderInfo.is_charge == 2">不收费</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_charge == 1">
					<view class="inp_title" >优惠价格：</view>
					<view class="form_right">
						<view>{{workorderInfo.discount_money ? workorderInfo.discount_money : ''}}元</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.discount_desc">
					<view class="inp_title" >备注：</view>
					<view class="form_right">
						<view>{{workorderInfo.discount_desc ? workorderInfo.discount_desc : ''}}元</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_charge == 1">
					<view class="inp_title" >实际支付价格：</view>
					<view class="form_right">
						<view>{{workorderInfo.money ? workorderInfo.money : ''}}元</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >收款账号：</view>
					<view class="form_right" v-if="workorderInfo.collection_account">
						<view>{{workorderInfo.collection_account ? workorderInfo.collection_account : ''}}</view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title" >收款账号(图)：</view>
					<view class="form_right">
						<view style="width:120rpx;height:120rpx">
							<image 
								:src="workorderInfo.collection_img[0] && workorderInfo.collection_img[0].url"
								style="width:120rpx;height:120rpx"
								
								@click="toPriimg"
							></image>
						</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_charge == 1">
					<view class="inp_title" >是否已经收取费用：</view>
					<view class="form_right">
						<view v-if="workorderInfo.is_pay == 1">是</view>
						<view v-else>否</view>
					</view>
				</view>
				<view v-if="workorderInfo.is_pay == 1 && workorderInfo.is_charge == 1">
					<view class="inp_warp">
						<view class="inp_title">支付金额：</view>
						<view class="form_right">
							<view>{{workorderInfo.money}}</view>
						</view>
					</view>
					<view class="inp_warp">
						<view class="inp_title">支付方式：</view>
						<view class="form_right">
							<view>{{workorderInfo.pay_type}}</view>
						</view>
					</view>
					<view class="inp_warp">
						<view class="inp_title">支付时间：</view>
						<view class="form_right">
							<view>{{workorderInfo.pay_time}}</view>
						</view>
					</view>
					<view class="proo_li_text">
						<view class="label">附件：</view>
						<view class="value">
							<view class="imgbox" v-for="(item,index) in workorderInfo.pay_files" :key="index">
								<image :src="item" class="selfimg"  @click="toPriveimg(index)"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="inp_warp" v-if="workorderInfo.is_autograph == 1">
					<view class="inp_title">客户签名</view>
					<view class="form_right">
						<image :src="workorderInfo.autograph_url" class="signImg" @click="toPrevieImg(workorderInfo.autograph_url)" ></image>
					</view>
				</view>
				<view class="info_item">
					<view class="title">审批流程</view>
					<!-- 审批流程 -->
					<approval-status :process="payment_approval"></approval-status>
				</view>
				</view>
			</view>
			
		</view>
		<!--  任务状态  -->
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
							<view class="new_p_ili">签到地点:{{item.location?item.location:''}}</view>
							<view class="new_p_ili">签到地点距离拜访对象:{{item.distance?item.distance:0}}</view>
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
		<!-- 产品信息 -->
		<view class="process" v-if="tabid == 3">
			<scroll-view scroll-y class="planscroll">
				<view v-if="workorderInfo.workorder_type == '上门维修'" class="probox">
					<view class="proo_li_product">
						<view class="productli">
							<view class="label">产品名称</view>
							<view class="label">产品编号</view>
							<view class="label">产品编码</view>
						</view>
					</view>
					<view class="proo_li_product" v-for="(item,index) in workorderInfo.product_part" :key="index">
						<view class="productli">
							<view class="label">{{item.product.name}}</view>
							<view class="label">{{item.number?item.number:'暂无编号'}}</view>
							<view class="value">{{item.product.num}}</view>
						</view>
						<view class="partli" v-if="item.parts.length != 0">
							维修配件：<view class="partname" v-for="(ele,eleindex) in item.parts" :key="eleindex" v-if="ele.is_select == 1">{{ele.name}}</view>
						</view>
					</view>
				</view>
				<view v-else class="probox">
					<view v-if="workorderInfo.workorder_type == '配件安装'">
						<view class="proli">
							<view class="protext">配件名称</view>
							<view class="protext">配件数量</view>
						</view>
						<view class="proli" v-for="(item,index) in workorderInfo.parts" :key="index">
							<view class="protext">{{item.name}}</view>
							<view class="protext">{{item.number}}</view>
							<!-- <view class="protext">{{item.price}}元</view> -->
						</view>
					</view>
					<view v-else>
						<view class="proli">
							<view class="protext">产品名称</view>
							<view class="protext">产品编号</view>
							<view class="protext">产品编码</view>
						</view>
						<view class="proli" v-for="(item,index) in workorderInfo.customer_product" :key="index">
							<view class="protext">{{item.product.name}}</view>
							<view class="protext">{{item.number?item.number:''}}</view>
							<view class="protext">{{item.product.num}}</view>
							<!-- <view class="protext">{{item.product.price}}元</view> -->
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 配件信息 -->
		<view class="probox" v-if="tabid == 7">
			<view style="display: flex;justify-content: space-between;align-items: center;">
				<view class="protitle">携带的配件</view>
				<view class="protitle color_bg" @click="toAddPart" v-if="workorderInfo.is_revoke == 1 || workorderInfo.is_leader == 1">修改配件</view>
			</view>
			<view class="proli" v-if="!workorderInfo.parts || workorderInfo.parts.length == 0">无</view>
			<view class="proli" v-for="(item,index1) in workorderInfo.parts" :key="index1">
				<view class="protext">{{item.name}}</view>
				<view class="protext">{{item.number}}</view>
				<view class="protext" v-if="workorderInfo.is_operation != 1">{{item.price}}元</view>
				<view class="protext">{{item.unit}}</view>
			</view>
			<view class="protitle">消耗配件</view>
			<view class="proli" v-if="!workorderInfo.use_parts || workorderInfo.use_parts.length == 0">无</view>
			<view class="proli" v-for="(item,index2) in workorderInfo.use_parts" :key="index2">
				<view class="protext">{{item.name}}</view>
				<view class="protext">{{item.number}}</view>
				<view class="protext" v-if="workorderInfo.is_operation != 1">{{item.price}}元</view>
				<view class="protext">{{item.unit}}</view>
			</view>
			<view class="protitle">剩余配件</view>
			<view class="proli" v-for="(item,index3) in workorderInfo.surplus_parts" :key="index3">
				<view class="protext">{{item.name}}</view>
				<view class="protext">{{item.number}}</view>
				<view class="protext" v-if="workorderInfo.is_operation != 1">{{item.price}}元</view>
				<view class="protext">{{item.unit}}</view>
			</view>
		</view>
		<!-- 回访内容 -->
		<view class="listwarp" v-if="tabid == 6">
			<view class="title">回访内容</view>
			<view class="newbox" style="padding-top:20rpx;">
				<view class="visit_li">
					<view class="n_t">回访时间:</view>
					<view class="n_r">{{workorderInfo.visit && workorderInfo.visit.visit_time?workorderInfo.visit.visit_time:''}}</view>
				</view>
				<view class="visit_li">
					<view class="n_t">客户满意度:</view>
					<view class="n_r">
						<uni-rate :size="18" readonly :value="workorderInfo.visit && workorderInfo.visit.satisfaction" />
					</view>
				</view>
				<view class="visit_li">
					<view class="n_t">服务态度评分:</view>
					<view class="n_r">
						<uni-rate :size="18" readonly :value="workorderInfo.visit && workorderInfo.visit.service_score" />
					</view>
				</view>
				<view class="visit_li">
					<view class="n_t">服务态度:</view>
					<view class="n_r">{{workorderInfo.visit && workorderInfo.visit.visit_service?workorderInfo.visit.visit_service:''}}</view>
				</view>
				<view class="visit_li">
					<view class="n_t">技术水平评分:</view>
					<view class="n_r">
						<uni-rate :size="18" readonly :value="workorderInfo.visit && workorderInfo.visit.skill_score" />
					</view>
				</view>
				<view class="visit_li">
					<view class="n_t">技术水平:</view>
					<view class="n_r">{{workorderInfo.visit && workorderInfo.visit.visit_skill?workorderInfo.visit.visit_skill:''}}</view>
				</view>
				<view class="visit_li">
					<view class="n_t">回访意见评分:</view>
					<view class="n_r">
						<uni-rate :size="18" readonly :value="workorderInfo.visit && workorderInfo.visit.opinion_score" />
					</view>
				</view>
				<view class="visit_li">
					<view class="n_t">回访意见:</view>
					<view class="n_r">{{workorderInfo.visit && workorderInfo.visit.visit_opinion?workorderInfo.visit.visit_opinion:''}}</view>
				</view>
				<view class="visit_li">
					<view class="n_t">备注:</view>
					<view class="n_r">{{workorderInfo.visit && workorderInfo.visit.visit_desc?workorderInfo.visit.visit_desc:''}}</view>
				</view>
			</view>
			<view class="" v-if="workorderInfo.workorder_type == '上门维修'">
				<view class="title">客户评价</view>
				<view class="newbox" style="padding-top:20rpx;">
					<view class="visit_li">
						<view class="n_t">是否解决问题:</view>
						<view class="n_r">{{workorderInfo.is_resolved ? workorderInfo.is_resolved == 1 ? '是':'否':''}}</view>
					</view>
					<view class="visit_li">
						<view class="n_t">手机号:</view>
						<view class="n_r">{{workorderInfo.linkfun ? workorderInfo.linkfun : ''}}</view>
					</view>
					<view class="visit_li">
						<view class="n_t">评分:</view>
						<view class="n_r">
							<uni-rate :size="18" readonly :value="workorderInfo.comment_score" />
						</view>
					</view>
					<view class="inp_warp" style="padding:15rpx 0;">
						<view class="inp_title">附件：</view>
						<view class="form_right" v-if="workorderInfo.comment_files && workorderInfo.comment_files.length != 0">
							<view class="imglist">
								<image 
									:src="ele" v-for="(ele,eleindex) in workorderInfo.comment_files" 
									@click="preCommentImg(workorderInfo.comment_files,eleindex)" 
									:key="eleindex" 
									class="planimg" 
								></image>
							</view>
						</view>
					</view>
					<view class="visit_li">
						<view class="n_t">情况说明:</view>
						<view class="n_r">{{workorderInfo.comment_content ? workorderInfo.comment_content : ''}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 物流信息 -->
		<view class="logi_warp" v-if="tabid == 5">
			<view class="logi_li" v-for="(item,index) in logisticsList" :key="index">
				<view class="logi_top">
					<view class="log_num">单号：{{item.number}}</view>
					<view class="logi_f" @click="toCopy(item.number)">复制</view>
				</view>
				<view class="logi_info">
					<view>内容：</view>
					<view>{{item.title}}</view>
				</view>
				<view class="logi_info">
					<view>时间：</view>
					<view>{{item.createtime}}</view>
				</view>
				<view class="logi_img">
					<view>附件：</view>
					<view class="imgbox">
						<image :src="ele" @click="previeImg(item.file_ids,indexele)" v-for="(ele,indexele) in item.file_ids" :key="indexele" class="selflogi" ></image>
					</view>
				</view>
			</view>
			
		</view>
		<!-- 费用信息 -->
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
		
		<view style="height:100rpx;"></view>
		<view class="bot_more_operation" v-if="workorderInfo.workorder_type == '生产工单'">
			<view class="bot_more_li" v-if="workorderInfo.status == 1 && workorderInfo.is_operation == 1" @click="acceptWork(1)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">接受工单</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.status == 2 && workorderInfo.process == 0 && workorderInfo.is_operation == 1" @click="toAddremark(4)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">开始工单</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.status == 2 && workorderInfo.process == 1 && workorderInfo.is_operation == 1" @click="toAddremark(2)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">生产完成</view>
			</view>
			<view class="bot_more_li" @click="moreOperation">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="li_img" ></image>
				<view class="li_text">更多</view>
			</view>
		</view>
		<view v-else class="bot_more_operation">
			<view class="bot_more_li" v-if="workorderInfo.status == 1 && workorderInfo.is_operation == 1" @click="acceptWork(1)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">接受工单</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.status == 2 && workorderInfo.process == 0 && workorderInfo.is_operation == 1" @click="toAddremark(3)">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">出发</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.status == 2 && workorderInfo.process == 1 && workorderInfo.is_operation == 1" @click="arriveSign">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">到达签到</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.status == 2 && workorderInfo.process == 2 && workorderInfo.is_operation == 1" @click="toInstallComplate">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">完成工单</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.status == 2 && workorderInfo.process ==2 && workorderInfo.is_operation == 1" @click="toAddSign">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="li_img li_img_img" ></image>
				<view class="li_text">签到</view>
			</view>
			<view class="bot_more_li" v-if="!workorderInfo.is_pay && workorderInfo.process == 4 && (workorderInfo.is_leader == 1 || workorderInfo.is_revoke == 1 || workorderInfo.is_operation == 1)" @click="toPay">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">去结算</view>
			</view>
			<view class="bot_more_li" @click="toAuto" v-if="workorderInfo.is_autograph == 0 && workorderInfo.status >= 2 && workorderInfo.process > 2 && workorderInfo.is_operation == 1 && workorderInfo.status != 3">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img " ></image>
				<view class="li_text">客户签名</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.status == 2 && workorderInfo.process == 3 && workorderInfo.is_leader == 1" @click="toInputFee">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">录入费用</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.is_examine == 1 && workorderInfo.is_revoke == 1" @click="toPass">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">审核通过</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.is_examine == 1 && workorderInfo.is_revoke == 1" @click="toRefuse">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">审核拒绝</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.is_examine == 1 && workorderInfo.is_revoke == 1" @click="toWriteDiscount">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">填写优惠</view>
			</view>
			<view class="bot_more_li" v-if="workorderInfo.is_visit != 1 && workorderInfo.is_operation_visit == 1" @click="toCallVisit">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">拨打回访电话</view>
			</view>
			<view class="bot_more_li"  v-if="workorderInfo.is_visit != 1 && workorderInfo.is_operation_visit == 1" @click="toWriteVisit">
				<image :src="BASE_IMG_URL+'/index/tongyong.png'" class="li_img li_img_img" ></image>
				<view class="li_text">填写回访信息</view>
			</view>
			
			<view class="bot_more_li" @click="moreOperation">
				<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="li_img" ></image>
				<view class="li_text">更多</view>
			</view>
		</view>
		
		<more-operation
			ref="operationChild"
			:workorderInfo="workorderInfo"
			@toAssignP="toAssignP"
			@acceptWorkP="acceptWork"
			@toInputNumberP="toInputNumber"
			@toAddlogisticsP="toAddlogistics"
			@toAddremarkP="toAddremark"
			@toRevokeP="toRevoke"
			@toEditWorkP="toEditWork"
			@toChexiaoWorkP="toChexiaoWork"
			@toLookProgramP="toLookProgram"
			@arriveSignP="arriveSign"
			@toAddSignP="toAddSign"
			@toInstallComplateP="toInstallComplate"
			@toPayP="toPay"
			@toDownP="toDown"
			@toAddapproverP="toAddapprover"
			@toAutoP="toAuto"
			@toWriteDiscountP="toWriteDiscount"
		></more-operation>
		<!-- 签名 -->
		<hand-written-sign ref="signChild" @signDone="signDone"></hand-written-sign>
		<!-- 下载报价单 -->
		<uni-popup ref="downPopup" type="bottom" background-color="#fff">
			<view class="acbox">
				<view class="acli" @click="onSelect('word')">word</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netWorkOrderDetail, netWorkorderStatusList, netRevokeWorkorder, netPartQuoteData,
	netAcceptWorkOrder, netCostList, netStartWorkOrder, netLogisticsList, netProductInstallArrive,
	netApprovalDetail, netSignWorkorder, netToconfirm, netLngTransAddress} from '@/api/api.js'
	import { netOperationRecord } from '@/api/template.js'
	import { commonFun } from '@/common/navigate.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import moreOperation from './more-operation.vue'
	
	export default {
		mixins:[commonFun],
		components:{
			moreOperation
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
				isPriviimg:false,    //查看图片
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
				//更多操作
				showMore:false,
				signImg:'',   //签名图片
				remindPeople:[],
				examineType:'',
				payment_approval:{},
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
			this.getApprovalList()
			if(!this.isPriviimg){
				this.queryData()
				
				this.getDetail()
			}
		},
		onHide() {
		},
		methods:{
			//拨打电话
			toCall(phone) {
				uni.makePhoneCall({
					phoneNumber:phone
				})
			},
			//签名
			toCustomerSign() {
				this.$refs.signChild.open()
			},
			//更多操作
			moreOperation() {
				this.$refs.operationChild.open()
			},
			//下载报价单
			toDown() {
				this.$refs.downPopup.open()
			},
			onSelect(type) {
				this.$refs.downPopup.close()
				let params = {
					id:this.workOrderid,
					type
				}
				netPartQuoteData(params).then(res=>{
					this.openFile({file:res.data.file,filename:res.data.filename,type:'file'})
				})
			},
			//查看 签名图片
			toPreIme(data,index) {
				this.isPriviimg = true
				let arr = []
				data.forEach(ele=>{
					arr.push(ele.url)
				})
				uni.previewImage({
					current:index,
					urls:arr
				})
			},
			//如果选择了 收款账号图片  查看图片
			toPriimg() {
				this.isPriviimg = true
				let img = this.workorderInfo.collection_img[0].url
				uni.previewImage({
					urls:[img]
				})
			},
			
			//查看签名
			toPrevieImg(url) {
				this.isPriviimg = true
				uni.previewImage({
					urls: [ url ]
				})
			},
			//客户签名
			toAuto() {
				this.$refs.signChild.open()
			},
			signDone(obj) {
				this.signImg = obj.url
				
				let params = {
					id:this.workOrderid,
					autograph_url:obj.url
				}
				netSignWorkorder(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getDetail()
					},2000)
				})
			},
			//审批流程
			getApprovalList() {
				let params = {
					type: 'workorder',
					relation_id: this.workOrderid
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//添加审批人
			toAddapprover() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/approver?id='+this.workOrderid+'&type=workorder'
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
							this.location = data?data.address:''
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
					}
				})
			},
			getDetail(){
				netWorkOrderDetail({id:this.workOrderid}).then(res=>{
					this.workorderInfo = res.data
				})
			},
			//录入费用
			toInputFee() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/inputExpense?id='+this.workorderInfo.id
				})
			},
			//通过
			toPass() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.workorderInfo.id+'&type=workorder&status=1'
				})
			},
			//拒绝
			toRefuse() {
				uni.navigateTo({    //status   1成功   2失败
					url:'/pages/template/examine?id='+this.workorderInfo.id+'&type=workorder&status=2'
				})
			},
			//添加 费用
			toAddcost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost?customerid='+this.workorderInfo.customer.id+'&relationid='+this.workOrderid+'&event_type=workorder'
				})
				// uni.navigateTo({
				// 	url:'/pages/template/addCost?type=workorder&id='+this.workOrderid
				// })
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
				if(type == 3 && (this.workorderInfo.workorder_type == '上门安装' || this.workorderInfo.workorder_type == '上门维修' || this.workorderInfo.workorder_type == '配件安装')){
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
			//指派
			toAssignP(type) {
				this.isPriviimg = false
				uni.navigateTo({
					url:'/pagesA/afterSales/turn_staff?id='+this.workorderInfo.id+'&type='+type
				})
			},
			//查看 解决方案
			toLookProgram() {
				uni.navigateTo({
					url:'/pagesA/user/knowledge_base/list?id='+this.workorderInfo.aftermarket_type_ids
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
							this.page = 1
							this.processList = []
							this.getStatusList()
							this.showMore = false
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
							this.showMore = false
						},2000)
					})
				}
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
				let start = this.workorderInfo.start_mileage ? this.workorderInfo.start_mileage : 0
				uni.navigateTo({
					url:'/pagesA/afterSales/arriveSign?eventid='+this.workOrderid+'&cusname='+this.workorderInfo.customer.name+'&customerid='+this.workorderInfo.customer.id+'&carType='+this.workorderInfo.car_type+'&arriveSign='+start
				})
			},
			//安装完成  完成工单
			toInstallComplate() {
				if(this.workorderInfo.workorder_type == '上门维修'){
					uni.navigateTo({
						url:'/pagesA/afterSales/arriveCost?workorderid='+this.workOrderid+'&proid='+this.workorderInfo.aftermarket_type_ids
					})
				}else if(this.workorderInfo.workorder_type == '上门安装' || this.workorderInfo.workorder_type == '配件安装'){
					uni.navigateTo({
						url:'/pagesA/afterSales/install_complete?workorderid='+this.workOrderid
					})
				}
			},
			//修改录入的费用
			toEditCost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/editExpense?id='+this.workOrderid
				})
			},
			//终止工单
			toRevoke() {
				uni.navigateTo({
					url:'/pagesA/afterSales/revokeWork?id='+this.workOrderid
				})
			},
			//修改工单
			toEditWork() {
				if(this.workorderInfo.workorder_type == '上门安装' || this.workorderInfo.workorder_type == '上门维修'){
					uni.navigateTo({
						url:'/pagesA/afterSales/editWorkorder?id='+this.workOrderid
					})
				}else if(this.workorderInfo.workorder_type == '生产工单'){
					uni.navigateTo({
						url:'/pages/index/orderSettlement/template/product_delivery?id='+this.workOrderid+'&type=生产工单'
					})
				}else{
					uni.navigateTo({
						url:'/pagesA/afterSales/editOtherWork?id='+this.workOrderid
					})
				}
			},
			//撤销工单
			toChexiaoWork() {
				uni.navigateTo({
					url:'/pagesA/afterSales/chexiaoWork?id='+this.workOrderid
				})
			},
			//更多操作
			toOperation() {
				this.showMore = true
			},
			closeMore() {
				this.showMore = false
			},
			//传阅
			toCirculate() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.workOrderid+'&type=workorder'
				})
			},
			//配件安装工单
			toAddPartInstall(){
				uni.navigateTo({
					url:'/pagesA/afterSales/partsWorkorder/parts_install?relationid='+this.workOrderid+'&customerid='+this.workorderInfo.customer.id
				})
			},
			//配件安装 工单详情
			toAnzhuangWork(item) {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorderDetail?workorderid='+item.id
				})
			},
			//配件配送工单
			toAddPartDis() {
				this.$store.commit('CUSTOMEROBJ',this.workorderInfo.customer)
				uni.navigateTo({
					url:'/pagesA/afterSales/partsWorkorder/parts_distribution?relationid='+this.workOrderid
				})
			},
			//关联的配送工单 详情
			toRelationWork(item) {
				uni.navigateTo({
					url:'/pagesA/afterSales/workorder/distribution_word?workorderid='+item.id
				})
			},
			//创建人去添加配件  修改配件信息
			toAddPart() {
				uni.navigateTo({
					url:'/pagesA/afterSales/edit_work_partinfo?id='+this.workOrderid
				})
			},
			//填写优惠金额
			toWriteDiscount() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/depotrepart/discountMoney?id='+this.workOrderid+'&money='+this.workorderInfo.discount_money
				})
			},
			//去确认是否 收款
			toConfirmReceipt() {
				netToconfirm({workorder_id:this.workOrderid}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getDetail()
					},2000)
				})
			},
			//查看图片
			toPriveimg(index){
				this.isPriviimg = true
				uni.previewImage({
					current:index,
					urls:this.workorderInfo.pay_files
				})
			},
			toPriveObjImg(arr,index) {
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					urls:data,
					current: index
				})
			},
			//上门维修  拨打回访电话
			toCallVisit() {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: this.workorderInfo.complete_contact,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: this.workorderInfo.complete_contact,
					fail:(err)=>{
						uni.showToast({
							title:'手机号不正确',
							icon:'none'
						})
					}
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(this.workorderInfo.complete_contact, true);
				// #endif
			},
			//上门维修  填写回访内容
			toWriteVisit() {
				uni.navigateTo({
					url:'/pagesA/afterSales/toWriterVisit?id='+this.workorderInfo.id
				})
			},
			//查看客户评价的图片
			preCommentImg(arr,index) {
				uni.previewImage({
					current:index,
					urls:arr
				})
			},
			//导航客户地址
			toNavigation() {
				uni.openLocation({
					latitude:this.workorderInfo.lat,
					longitude:this.workorderInfo.lng,
					name:this.workorderInfo.address
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		margin-left: 22rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
		&::before{
			content:'';
			position:absolute;
			left:30rpx;
			// top:26rpx;
			width:10rpx;
			height:25rpx;
			border-radius: 5rpx;
			background: $uni-btn-bg-color;
		}
	}
	.proo_li_text{
		padding:24rpx 0;
		border-bottom:1rpx solid #f5f5f5;
		.label{
			padding:0 30rpx;
			font-size:26rpx;
			color:#333;
		}
		.value{
			width: 630rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size:26rpx;
			background:rgba(202, 202, 202, 0.2);
		}
	}
	.imgbox {
		width: 160rpx;
		height: 160rpx;
		margin-right: 14rpx;
		position: relative;
		margin-bottom: 24rpx;
		display: initial;
		&:nth-child(4n){
			margin-right:0;
		}
		.selfimg {
			width: 160rpx;
			height: 160rpx;
		}
	}
	.acbox{
		width:750rpx;
		padding:30rpx 0;
		.acli{
			font-size:30rpx;
			padding:24rpx 0;
			text-align: center;
			border-bottom:1rpx solid #f5f5f5;
			font-weight: bold;
			&:last-child{
				border-bottom:0;
			}
		}
	}
	.order_warp{
		padding:24rpx;
		.order_warp_li{
			padding:24rpx;
			color:$uni-text-color;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			font-size:28rpx;
			border-radius: 10rpx;
			margin-bottom:15rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
	}
	.imglist {
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 145rpx;
			height: 145rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			.selfimg {
				width: 145rpx;
				height: 145rpx;
			}
			.signbtn{
				width:120rpx;
				height:60rpx;
				background: $uni-text-color;
				font-size:24rpx;
				color:#fff;
				text-align: center;
				line-height: 60rpx;
			}
		}
	}
	
	.trainli{
		padding:0 24rpx;
		.train_name{
			font-size:28rpx;
			margin-bottom:24rpx;
		}
		.min_name{
			font-size:26rpx;
			color:$uni-text-color;
			margin-bottom:24rpx;
		}
		.min_box{
			margin-bottom:24rpx;
			.min_tit{
				font-size:26rpx;
				margin-bottom:15rpx;
			}
			.min_con{
				background:rgba(202, 202, 202, 0.2);
				padding:10rpx;
				font-size:24rpx;
			}
		}
	}
	.proowarp{
		padding:15rpx 24rpx;
		.prali{
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 50rpx;
			border-bottom:1rpx solid #f5f5f5;
			.partli{
				width:150rpx;
				text-align: center;
			}
		}
	}
	.editRepair{
		padding:0 30rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom:20rpx;
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
	.proo_li_product{
		padding:24rpx;
		border-bottom:1rpx solid #f5f5f5;
		.productli{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.label{
				width:200rpx;
				text-align: center;
				font-size:26rpx;
				color:#999999;
			}
			.value{
				width:200rpx;
				text-align: center;
				font-size:26rpx;
				color:#666666;
			}
		}
		.partli{
			padding:24rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.partname{
				margin-right:15rpx;
			}
		}
	}
	.info_item{
		.title{
			font-size:26rpx;
			color: #666;
		}
	}
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
	.team_warp{
		padding:24rpx 35rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.team_left{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.teamtit{
				font-size:26rpx;
				color:#666;
				margin-right:24rpx;
			}
			.teambox{
				width:430rpx;
				height:60rpx;
				.staffheader{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.staffimg{
						width:60rpx;
						height:60rpx;
						border-radius: 50%;
						margin-right:20rpx;
						flex-shrink: 0;
					}
				}
			}
		}
		.team_right{
			font-size:28rpx;
			color:$uni-text-color;
			font-weight: bold;
			flex-shrink: 0;
		}
	}
	.itemwarp{
		width:690rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin:24rpx auto 0;
		padding:0 40rpx;
		background:#fff;
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
.work_warp{
	padding: 25rpx 30rpx;
	margin-bottom: 20rpx;
	background-color: #fff;
	box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
	.statusbox{
		padding:24rpx;
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
			font-size:34rpx;
			color: $uni-text-color;
			text-align: center;
		}
	}
	.stapbox{
		padding: 0 30rpx 24rpx 30rpx;
	}
	.cus_info{
		.cus_name{
			font-size:26rpx;
			color:#333333;
			text-align: left;
			margin-bottom:15rpx;
		}
		.cus_link{
			font-size:28rpx;
			color:#666666;
			margin-bottom:15rpx;
			padding:0 24rpx;
			text-align: center;
		}
	}
}
// 工单状态
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
				&:last-child{
					margin-bottom:0;
				}
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
			padding:24rpx 30rpx;
			border-bottom:0;
			.planimg{
				width:110rpx;
				height:110rpx;
				border-radius: 10rpx;
				margin-right:24rpx;
				margin-bottom:24rpx;
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
.listwarp{
	padding: 30rpx;
	background:#fff;
	box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
	.inp_warp {
		padding:15rpx 40rpx 15rpx 50rpx;
		background: #fff;
		display: flex;
		justify-content: flex-start;
		.inp_title {
			font-size: 26rpx;
			color: #999;
			flex-shrink: 0;
			margin-right:10rpx;
		}
		.form_right {
			display: flex;
			align-items: center;
			color: #666666;
			font-size:26rpx;
			// width:400rpx;
			.signImg{
				width:120rpx;
				height:120rpx;
			}
			.staffimg{
				width:60rpx;
				height:60rpx;
				border-radius: 50%;
				margin-right:15rpx;
			}
			.imglist{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				padding:24rpx 30rpx;
				border-bottom:0;
				.planimg{
					width:110rpx;
					height:110rpx;
					border-radius: 10rpx;
					margin-right:24rpx;
					margin-bottom:24rpx;
				}
			}
		}
	}
}
//产品信息  配件信息
.probox{
	width:690rpx;
	background:#fff;
	margin:0 auto 24rpx;
	border-radius: 20rpx;
	box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
	.protitle{
		font-size:26rpx;
		font-weight: bold;
		padding:24rpx;
		margin-top:24rpx;
	}
}
.proli{
		padding:24rpx 30rpx;
		border-bottom:1rpx solid #f5f5f5;
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
			font-size:26rpx;
			color:#999999;
			width:200rpx;
			text-align: center;
			white-space:normal;
			word-break:break-all;
		}
	}
//操作内容
.listwarp{
	background:#fff;
	box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
	.newbox{
		padding-left:60rpx;
	}
	.visit_li{
		display: flex;
		justify-content: flex-start;
		padding:10rpx 0;
		.n_t{
			font-size:26rpx;
			color:#999999;
			margin-right:15rpx;
			flex-shrink: 0;
		}
		.n_r{
			font-size:26rpx;
			color:#999999;
		}
	}
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
			margin-top:24rpx;
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
		padding:24rpx 24rpx;
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
	border-bottom:1rpx solid #f5f5f5;
	margin-bottom:20rpx;
	background-color: #fff;
	box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
	.label_li{
		width: 198rpx;
		height: 66rpx;
		background: #F6F6F6;
		border: 1px solid #EDEDED;
		border-radius: 10rpx;
		margin-right:49rpx;
		margin-bottom:24rpx;
		color:#999;
		text-align: center;
		line-height: 64rpx;
		&:nth-child(3n){
			margin-right:0;
		}
	}
	.label_liactive{
		background:#fff;
		color:$uni-text-color;
		border: 1px solid $uni-btn-bg-color;
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
			margin-right:20rpx;
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
