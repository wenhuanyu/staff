<template>
	<view>
		<view class="l_search">
			<view class="l_selfsearch" @click="jumpSearch">
				<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg" ></image>
				<input type="text" disabled placeholder="请输入关键词搜索" class="lself" placeholder-style="color:#999">
			</view>
			<!-- #ifndef H5 -->
				<view class="l_saoma" @click="toScanCode">
					<image :src="BASE_IMG_URL+'/index/saoma.png'" class="saomaimg" ></image>
				</view>
			<!-- #endif -->
		</view>
		<!-- 今日计划 -->
		<view class="lxr_tab_warp">
			<view class="lxr_tab" @click="toClues" v-if="permission.menu && permission.menu.leads.is_show == 1">
				<image :src="BASE_IMG_URL+'/index_new_2.png'" class="tabimg" style="width:60rpx;height:60rpx;margin-bottom:12rpx;margin-top:8rpx;"></image>
				<view class="tabtext">线索</view>
			</view>
			<view class="lxr_tab" @click="toBusiness" v-if="permission.menu && permission.menu.business.is_show == 1">
				<image :src="BASE_IMG_URL+'/business.png'" class="tabimg" style="width:60rpx;height:60rpx;margin-bottom:12rpx;margin-top:8rpx;"></image>
				<view class="tabtext">商机</view>
			</view>
			
			<view class="lxr_tab" @click="toAdd" v-if="permission.menu && permission.menu.event.is_show == 1">
				<image :src="BASE_IMG_URL+'/index/lxr_renwu.png'" class="tabimg" ></image>
				<view class="tabtext">任务</view>
			</view>
			<view class="lxr_tab" @click="toRecord" v-if="permission.menu && permission.menu.sign_in.is_show == 1">
				<image :src="BASE_IMG_URL+'/index_new_12.png'" class="tabimg" mode="scaleToFill" style="width:60rpx;height:60rpx;margin-bottom:13rpx;margin-top:8rpx;"></image>
				<view class="tabtext">跟进记录</view>
			</view>
		</view>
		<!-- 常用功能 -->
		<view class="newbox">
			<view class="new_title">常用功能</view>
			<view class="newtabbox">
				<view class="lxr_tab" @click="toWaterCustomer" v-if="permission.menu && permission.menu.seas.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_gonghai.png'" class="tabimg"></image>
					<view class="tabtext">公海</view>
				</view>
				
				<view class="lxr_tab" @click="toCluesPool" v-if="permission.menu && permission.menu.leadspool.is_show == 1">
					<image :src="BASE_IMG_URL+'/clue_chi.png'" class="tabimg" style="width:60rpx;height:60rpx;margin-bottom:12rpx;margin-top:8rpx;"></image>
					<view class="tabtext">线索池</view>
				</view>
				<view class="lxr_tab" @click="toQuotation" v-if="permission.menu && permission.menu.quote.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_baojiadan.png'" class="tabimg" ></image>
					<view class="tabtext">报价单</view>
				</view>
				<view class="lxr_tab" @click="toContract" v-if="permission.menu && permission.menu.contract.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_hetong.png'" class="tabimg" ></image>
					<view class="tabtext">合同</view>
				</view>
				<view class="lxr_tab" @click="toOrder" v-if="permission.menu && permission.menu.order.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_dingdan.png'" class="tabimg"></image>
					<view class="tabtext">订单</view>
				</view>
				<!-- <view class="lxr_tab" @click="toAftersales" v-if="permission.menu && permission.menu.workorder.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_gongdan.png'" class="tabimg" ></image>
					<view class="tabtext">工单</view>
				</view>
				
				<view class="lxr_tab" @click="toReturnVisit" v-if="permission.menu && permission.menu.visit.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_huifang.png'" class="tabimg" ></image>
					<view class="tabtext">回访</view>
				</view> -->
				<view class="lxr_tab" @click="toProductManage" v-if="permission.menu && permission.menu.product.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_changpin.png'" class="tabimg"></image>
					<view class="tabtext">产品</view>
				</view>
				<view class="lxr_tab" v-if="permission.menu && permission.menu.achievement.is_show == 1" @click="toTarget">
					<image :src="BASE_IMG_URL+'/index/lxr_mubiao.png'" class="tabimg" ></image>
					<view class="tabtext">业绩目标</view>
				</view>
				<view class="lxr_tab" @click="toCostlist" v-if="permission.menu && permission.menu.consume.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_feiyong.png'" class="tabimg" ></image>
					<view class="tabtext">费用</view>
				</view>
				<view class="lxr_tab" @click="toCashier" v-if="permission.menu && permission.menu.cashier.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_chuna.png'" class="tabimg"></image>
					<view class="tabtext">出纳</view>
				</view>
				<view class="lxr_tab" @click="toCollection" v-if="permission.menu && permission.menu.receivables.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_huikuan.png'" class="tabimg" ></image>
					<view class="tabtext">收款</view>
				</view>
				<view class="lxr_tab" @click="toMap" v-if="permission.menu && permission.menu.map.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_ditu.png'" class="tabimg"></image>
					<view class="tabtext">附近客户</view>
				</view>
				
				<view class="lxr_tab" @click="toStafflist" v-if="permission.menu && permission.menu.staff_list.is_show == 1">
					<image :src="BASE_IMG_URL+'/index/lxr_stafflist.png'" class="tabimg" mode="scaleToFill" ></image>
					<view class="tabtext">团队成员</view>
				</view>
			</view>
		</view>
		<!-- 筛选 -->
		<view class="pre-right">
			<picker @change="changeBrietype" :range="brieType" :value="brieTypeindex" :range-key="'name'">
				<view class="form_right">
					<view style="margin-right:15rpx">{{brieType[brieTypeindex] ? brieType[brieTypeindex].name : '请选择'}}</view>
					<image :src="BASE_IMG_URL+'/newxia.png'" class="bottomimg" mode="scaleToFill"></image>
				</view>
			</picker>
			<view class="form_right" style="margin-right:0" @click="showQuery">
				<view style="margin-right:15rpx">{{queryObj.name}}</view>
				<image :src="BASE_IMG_URL+'/newxia.png'" class="bottomimg" mode="scaleToFill"></image>
			</view>
		</view>
		
		<!-- 销售数据简报 -->
		<view class="jianbao-zy">
			<view class="title" style="padding-bottom:24rpx;">数据简报</view>
			<view class="brie_li_box">
				<view class="pre_content">
					<view class="content_item" @click="toTask">
						<view>{{briefInfo.baifang ? briefInfo.baifang : '0'}}</view>
						<view>拜访次数</view>
					</view>
					<view class="content_item" @click="toBaojia">
						<view>{{briefInfo.quote ? briefInfo.quote : '0'}}</view>
						<view>报价次数</view>
					</view>
					<view class="content_item" @click="toShangji">
						<view>{{briefInfo.business ? briefInfo.business : '0'}}</view>
						<view>新增商机</view>
					</view>
					<view class="content_item" @click="toXiansuo">
						<view>{{briefInfo.leads ? briefInfo.leads : '0'}}</view>
						<view>新增线索</view>
					</view>
					<view class="content_item" @click="toKehu">
						<view>{{briefInfo.customer ? briefInfo.customer : '0'}}</view>
						<view>新增客户</view>
					</view>
					<view class="content_item" @click="toGenjin">
						<view>{{briefInfo.record ? briefInfo.record : '0'}}</view>
						<view>新建跟进</view>
					</view>
					<view class="content_item" @click="toHetong">
						<view>{{briefInfo.contract ? briefInfo.contract : '0'}}</view>
						<view>新增合同</view>
					</view>
					<view class="content_item" @click="toHetong">
						<view>{{briefInfo.contract_money ? briefInfo.contract_money :'0'}}</view>
						<view>合同金额</view>
					</view>
					<view class="content_item" @click="toPayment">
						<view>{{briefInfo.receivables ? briefInfo.receivables : '0'}}</view>
						<view>回款金额</view>
					</view>
					<view class="content_item" @click="toKehuTwo(1)">
						<view>{{briefInfo.customer_complate ? briefInfo.customer_complate : '0'}}</view>
						<view>客户成交量</view>
					</view>
					<view class="content_item" @click="toKehuTwo(0)">
						<view>{{briefInfo.customer_nocomplate ? briefInfo.customer_nocomplate : '0'}}</view>
						<view>客户未成交量</view>
					</view>
					<view class="content_item" @click="toShangjiTwo(2)">
						<view>{{briefInfo.business_complate ? briefInfo.business_complate : '0'}}</view>
						<view>商机成交量</view>
					</view>
					<view class="content_item" @click="toShangjiTwo(1)">
						<view>{{briefInfo.business_nocomplate ? briefInfo.business_nocomplate : '0'}}</view>
						<view>商机未成交量</view>
					</view>
					<view class="content_item" @click="toShangjiTwo(2)">
						<view>{{briefInfo.business_complate_money ? briefInfo.business_complate_money : '0'}}</view>
						<view>商机成交金额</view>
					</view>
					<view class="content_item" @click="toShangjiTwo(1)">
						<view>{{briefInfo.business_nocomplate_money ? briefInfo.business_nocomplate_money : '0'}}</view>
						<view>商机未成交金额</view>
					</view>
				</view>
			</view>
			<view class="lxr_work_warp">
				<view class="brie_box">
					<view class="brie_conbox">
						<view class="brie_box_item">
							<view class="brie_top">
								<view class="brie_data">
									{{achieveInfo.customer?achieveInfo.customer.achievement:0}}
								</view>
								<view class="brie_title">
									获客目标
								</view>
							</view>
							<view class="brie_bot">
								<view class="left_number">已完成:{{achieveInfo.customer?achieveInfo.customer.count:0}}</view>
								<view class="left_number">完成率:{{achieveInfo.customer?achieveInfo.customer.ratio:0}}%</view>
							</view>
						</view>
						<view class="brie_box_item">
							<view class="brie_top">
								<view class="brie_data">
									{{achieveInfo.event?achieveInfo.event.achievement:0}}
								</view>
								<view class="brie_title">
									拜访目标
								</view>
							</view>
							<view class="brie_bot">
								<view class="left_number">已完成:{{achieveInfo.event?achieveInfo.event.count:0}}</view>
								<view class="left_number">完成率:{{achieveInfo.event?achieveInfo.event.ratio:0}}%</view>
							</view>
						</view>
						<view class="brie_box_item">
							<view class="brie_top">
								<view class="brie_data">
									{{achieveInfo.contract?achieveInfo.contract.achievement:0}}
								</view>
								<view class="brie_title">
									业绩目标
								</view>
							</view>
							<view class="brie_bot">
								<view class="left_number">已完成:{{achieveInfo.contract?achieveInfo.contract.count:0}}</view>
								<view class="left_number">完成率:{{achieveInfo.contract?achieveInfo.contract.ratio:0}}%</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 排行榜 -->
		<view class="paihang-zy">
			<view class="lxr_title">
				<view class="title_warp">
					<view class="title">
						排行榜
					</view>
				</view>
			</view>
			<view class="lxr_work_warp">
				<view class="rankingbox">
					<view class="rank_tab_box">
						<view class="rank_tab" @click="changeRankTab(index)" :class="rankIndex == index ? 'color_bg' : ''" v-for="(item,index) in rankTab" :key="index">{{item.name}}</view>
					</view>
					<view class="rank_list">
						<view class="rank_li" 
						:class="item.ranking == 1 ? 'rank_li_fir' : item.ranking == 2 ? 'rank_li_sec' : item.ranking == 3 ? 'rank_li_thr' : '' " 
						v-for="(item,index) in rankList" :key="index" >
							<view class="rank_li_left" v-if="item.staff">
								<view class="rank_num">{{item.ranking}}</view>
								<image :src="item.staff && item.staff.img?item.staff.img:BASE_IMG_URL+'/headImg.png'" class="saleimg" ></image>
								<view class="salename">{{item.staff.name}}</view>
							</view>
							<view class="rank_li_right">
								已完成：{{item.number}}单
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<screen-pop ref="screenChild" @sureQuery="sureQuery"></screen-pop>
		<tab-bar v-if="tipNumber || tipNumber==0" :tipNumber="tipNumber"></tab-bar>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import tabBar from '@/components/tabbar/tabbar'
	import screenPop from './screenPop.vue'
	import {netBriefingData, netAchievedata, netIndexRankingdata, netJurisdiction, netFinanceData, netAfterData, netAfterAchieve } from '@/api/api.js'
	import { netMesList, netGetUserInfo } from '@/api/user.js'
	import { makeDate } from '@/utils/util.js'
	import { indexFun } from './index.js'
	import { mapState } from 'vuex'
	
	export default {
		mixins:[indexFun],
		components:{
			tabBar,
			screenPop,
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				tipNumber:null,
				currentRate:30,
				//拨打电话
				showCall:true,
				//任务
				sche_timetab:[],
				sche_timeIndex:0,
				nowDate:'',
				//数据简报
				briefInfo:{},
				queryObj:{
					name:'本月',
					times:'thismonth'
				},
				brieType:[
					{id:0,name:'本人及下属'},
					{id:1,name:'仅本人'},
					{id:2,name:'仅下属'},
				],
				brieTypeindex:0,
				achieveInfo:{},
				financeData:{},   //首页 财务 数据简报
				afterData:{},   //售后  数据简报
				afterAchieve:{},   //售后  目标
				//排行榜
				rankTab:[
					{id:1,name:'获客'},
					{id:2,name:'拜访'},
					{id:3,name:'业绩'},
					{id:4,name:'回款'},
					{id:5,name:'工单'}
				],
				rankIndex:0,
				rankList:[],
				menuList:[],   //显示icon
				//当前登录者的 身份
				identity:'sales',   //sales 销售部， finance 财务部，  after 售后部， else 其他
				permission:{},  //权限
			}
		},
 		onLoad() {
			var date = new Date();
			this.nowDate = date.getDate();
			this.sche_timetab = makeDate()
		},
		onShow() {
			//提示消息
			this.getTipNumber()
			this.showPicker = true
		},
		methods: {
			/////////////////////////////////////////////////////////////////////////////
			showQuery() {
				this.$refs['screenChild'].open()
			},
			/////////////////////////////////////////////////////////////////////////////
			//报价单 tab
			changeQuotation(item,index) {
				this.quotationIndex = index
				this.quotationList = []
				this.getQuotationList()
			},
			//报价单列表
			getQuotationList() {
				let params = {
					type:1,
					page:1,
					limit:3,
					check_status:this.quotationTab[this.quotationIndex].id
				}
				netQuotationList(params).then(res=>{
					this.quotationList = res.data.data
				})
			},
			//报价单 tab数量
			getQuotationNumber() {
				netQuotationTabNumber().then(res=>{
					res = res.data
					this.quotationTab = [
						{id:1,name:'待审核',num:res.daishenhe},
						{id:2,name:'通过',num:res.shenhetongguo},
						{id:3,name:'拒绝',num:res.shenhejujue},
						{id:4,name:'作废',num:res.zuofei}
					]
					//报价单  列表
					this.getQuotationList()
				})
			},
			//新建报价单
			toAddQuotation() {
				uni.navigateTo({
					url:'/pagesC/quotation/addQuotation'
				})
			},
			//报价单  查看更多
			toMoreQuotation() {
				uni.navigateTo({
					url:'/pagesC/quotation/index'
				})
			},
			/////////////////////////////////////////////////////////////////////////////
			changeContract(item,index) {
				this.contractIndex = index
				this.getContractList()
			},
			//合同列表
			getContractList() {
				let params = {
					page:1,
					limit:3,
					check_status:this.contractTab[this.contractIndex].id
				}
				netOutContractList(params).then(res=>{
					this.contractList = res.data.data
				})
			},
			//合同 tab  数量
			getContractNumber() {
				netContractTabNumber().then(res=>{
					res = res.data
					this.contractTab = [
						{id:1,name:'待审核',num:res.daishenhe},
						{id:2,name:'通过',num:res.shenhetongguo},
						{id:3,name:'拒绝',num:res.shenhejujue},
						{id:4,name:'撤销',num:res.zuofei},
						{id:9,name:'终止',num:res.zongzhi},
					]
				})
				//合同 列表
				this.getContractList()
			},
			//新建合同
			toAddContract(){
				uni.navigateTo({
					url:'/pagesA/customerInfo/order/createOrder'
				})
			},
			//查看更多  合同
			toMoreContract() {
				uni.navigateTo({
					url:'/pages/index/contractManagements/index'
				})
			},
			/////////////////////////////////////////////////////////////////////////////
			//财务 数据简报
			getFinanceData() {
				netFinanceData().then(res=>{
					this.financeData = res.data
				})
			},
			//售后 数据简报
			getAfterData() {
				netAfterData().then(res=>{
					this.afterData = res.data
				})
			},
			//售后 目标
			getAfterAchieve() {
				let params = {
					type: this.brieType[this.brieTypeindex].id,
					times: this.queryObj.times
				}
				netAfterAchieve(params).then(res=>{
					this.afterAchieve = res.data
				})
			},
			//目标
			toTarget() {
				uni.navigateTo({
					url:'/pages/target/achieveStatis'
				})
			},
			//扫码
			toScanCode() {
				uni.scanCode({
					success:(res)=>{
						let code = res.result
						uni.navigateTo({
							url:'/pages/index/product_info?code='+code
						})
					}
				})
			},
			//数据简报
			getBriedata() {
				let params = {
					type: this.brieType[this.brieTypeindex].id,
					times: this.queryObj.times
				}
				netBriefingData(params).then(res=>{
					this.briefInfo = res.data
				})
			},
			changeBrietype(e) {
				this.brieTypeindex = e.detail.value
				this.init()
			},
			sureQuery(params) {
				this.queryObj = params
				if(this.identity == 'sales'){
					//目标完成 情况
					this.getAchieve()
					//数据简报
					this.getBriedata()
				}else if(this.identity == 'after'){
					//目标  售后
					this.getAfterAchieve()
				}
				//排行榜
				this.getRanking()
			},
			getAchieve() {
				let params = {
					type: this.brieType[this.brieTypeindex].id,
					times: this.queryObj.times
				}
				netAchievedata(params).then(res=>{
					this.achieveInfo = res.data
				})
			},
			//数据权限
			getJurisdiction() {
				netJurisdiction().then(res=>{
					uni.setStorageSync('permission',res.data)
					this.permission = res.data
					// this.$store.commit('SETPERMISSION',res.data)
				})
			},
			//消息 提示
			getTipNumber() {
				netMesList().then(res=>{
					this.tipNumber = res.data.total
					uni.setStorageSync('roleType',res.data.userinfo.role_type)
					netGetUserInfo().then(ress=>{
						this.userInfo = ress.data
						uni.setStorageSync('userinfo',ress.data)
					})
					this.init()
				})
			},
			init() {
				//数据权限
				this.getJurisdiction()
				//排行榜
				this.getRanking()
				//数据简报
				this.getBriedata()
				//目标完成 情况
				this.getAchieve()
			},
			handleScheTime() {
				let arr = this.sche_timetab
				arr.forEach((ele,index)=>{
					if(ele.day == this.nowDate){
						this.sche_timeIndex = index
					}
				})
				
			},
			//排行榜
			changeRankTab(index) {
				this.rankIndex = index
				this.getRanking()
			},
			getRanking() {
				let params = {
					ranking:this.rankTab[this.rankIndex].id,
					type:this.brieType[this.brieTypeindex].id,
					times: this.queryObj.times
				}
				netIndexRankingdata(params).then(res=>{
					this.rankList = res.data
				})
			},
			//去搜索
			jumpSearch() {
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			//地图
			toMap() {
				uni.navigateTo({
					url:'/pages/map/index'
				})
			},
			//回访
			toReturnVisit() {
				uni.navigateTo({
					url:'/pagesA/afterSales/returnVisit/index'
				})
			},
			//收款
			toCollection() {
				uni.navigateTo({
					url:'/pagesB/collection/index'
				})
			},
			//团队
			toTeam() {
				uni.navigateTo({
					url:'/pagesA/user/team/index'
				})
			},
			//跟进记录
			toRecord() {
				uni.navigateTo({
					url:'/pagesB/followRecord/followRecord'
				})
			},
			//员工列表
			toStafflist() {
				uni.navigateTo({
					url:'/pagesA/user/stafflist/index'
				})
			},
			//数据统计下的跳转
			//拜访 --- 任务
			toTask() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/visitList?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times
				})
			},
			//报价单
			toBaojia() {
				uni.navigateTo({
					url:'/pagesC/quotation/index?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times
				})
			},
			//商机
			toShangji() {
				uni.navigateTo({
					url:'/pagesB/business/index?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times
				})
			},
			toShangjiTwo(status) {
				uni.navigateTo({
					url:'/pagesB/business/index?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times+'&status='+status
				})
			},
			
			//线索
			toXiansuo() {
				uni.navigateTo({
					url:'/pagesB/cluesManagement/cluesManagement?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times
				})
			},
			//客户
			toKehu() {
				uni.navigateTo({
					url:'/pages/index/myCustomer/index?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times
				})
			},
			toKehuTwo(status){
				uni.navigateTo({
					url:'/pages/index/myCustomer/index?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times+'&status='+status
				})
			},
			//合同
			toHetong() {
				uni.navigateTo({
					url:'/pages/index/contractManagements/index?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times+'&check_status=2'
				})
			},
			//跟进
			toGenjin(){
				uni.navigateTo({
					url:'/pagesB/followRecord/followRecord?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times
				})
			},
			//回款金额
			toPayment() {
				uni.navigateTo({
					url:'/pagesB/collection/index?type='+this.brieType[this.brieTypeindex].id+'&times='+this.queryObj.times+'&tabid=2'+'&check_status=2'
				})
			}
		}
	}
</script>


<style>	
page{
	background:#F4F4F4;
}
</style>
<style lang="scss" scoped>
	.pre-right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0 30rpx;
		margin: 20rpx 0 30rpx 0;
		.form_right {
			min-width: 180rpx;
			height: 50rpx;
			line-height: 48rpx;
			border-radius: 8rpx;
			background: #fff;
			margin-right: 15rpx;
			font-size: 22rpx;
			color: #666;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);
			.bottomimg {
				width: 30rpx;
				height: 33rpx;
			}
		}
	}
	// 常用功能
	.newbox{
		width:690rpx;
		padding: 25rpx 24rpx 0;
		margin: 0 30rpx 30rpx;
		border: 1px solid #EDEDED;
		box-shadow: 0px 0px 16rpx 2rpx rgba(220, 220, 220, 0.3);
		border-radius: 20rpx;
		background:#fff;
		.new_title{
			font-size:26rpx;
			font-weight: bold;
			color:#333;
			margin-bottom:25rpx;
		}
		.newtabbox{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			.lxr_tab{
				text-align: center;
				margin-right:33rpx;
				margin-bottom:45rpx;
				width:100rpx;
				&:nth-child(5n){
					margin-right:0;
				}
				.tabimg{
					width:80rpx;
					height:80rpx;
				}
				.tabtext{
					margin-top:8rpx;
					font-size:24rpx;
					color:#333333;
				}
			}
		}
	}
	
	.title{
		margin-left: 52rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
		&::before{
			margin-left: 20rpx;
			content:'';
			position:absolute;
			left:30rpx;
			width:16rpx;
			height:30rpx;
			border-radius: 8rpx;
			background: $uni-text-color;
		}
	}
	.l_search{
		padding:10rpx 50rpx 20rpx;
		background:#cfe8fe;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.l_selfsearch{
			width:580rpx;
			height:68rpx;
			border-radius: 34rpx;
			background:#FFFFFF;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 24rpx;
			.searimg{
				width:48rpx;
				height:47rpx;
				margin-right:24rpx;
			}
			.lself{
				font-size:26rpx;
				color:rgba(2, 135, 255, 0.5);
			}
		}
		.l_tip{
			width:48rpx;
			height:50rpx;
			position: relative;
			.new_tip{
				position: absolute;
				right:-9rpx;
				top:-20rpx;
				border-radius: 50%;
				background:#F13E27;
				color:#fff;
				font-size:26rpx;
				width:40rpx;
				height:40rpx;
				text-align: center;
				line-height: 40rpx;
				z-index:2;
			}
			.tipimg{
				width:48rpx;
				height:50rpx;
			}
		}
		.l_saoma{
			width:40rpx;
			height:40rpx;
			.saomaimg{
				width:40rpx;
				height:40rpx;
			}
		}
	}
	.lxr_tab_warp{
		padding:0 50rpx;
		background: linear-gradient(180deg, #cfe8fe 0%, #F1F4F6 48%, #F4F4F4 100%);
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.lxr_tab{
			text-align: center;
			margin-right:83rpx;
			margin-bottom:35rpx;
			width:100rpx;
			&:nth-child(4n){
				margin-right:0;
			}
			.tabimg{
				width:80rpx;
				height:80rpx;
			}
			.tabtext{
				font-size:24rpx;
				color:#333333;
			}
		}
	}
	.lxr_title{
		border-bottom:1rpx solid #EDEDED;
		.title_warp{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:15rpx 20rpx 20rpx 0;
			.title_name{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size:30rpx;
				color:#333333;
				font-weight: bold;
				.cirimg{
					width:11rpx;
					height:33rpx;
					margin-right:15rpx;
				}
			}
			.title_right{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size:24rpx;
				color:#4E80F5;
				.sche_more{
					display: flex;
					align-items: center;
					font-size:24rpx;
					color:$uni-text-color;
					.sanimg{
						width:18rpx;
						height:26rpx;
						margin-left:10rpx;
					}
				}
				.sche_add{
					margin-right: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size:24rpx;
					color:$uni-text-color;
					.addimg{
						width:38rpx;
						height:38rpx;
						margin-right:10rpx;
					}
				}
			}
		}
	}
	.wk_tab_warp{
		padding:20rpx 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.wk_tab{
			.tab_num{
				font-size:28rpx;
				color:#999;
			}
			.tab_text{
				font-size:24rpx;
				color:#999;
				margin-bottom: 20rpx;
			}
		}
		.wk_tabactive{
			.tab_num{
				text-align: left;
				color:#333;
			}
			.tab_text{
				color:#333;
				margin-bottom: 12rpx;
			}
			.tab_ac{
				width: 70rpx;
				height: 8rpx;
				background: $uni-btn-bg-color;
				border-radius: 4rpx;
				margin:0 auto;
			}
		}
	}
	.warp_list{
		padding:24rpx;
	}
	.jianbao-zy{
		padding: 25rpx 0 50rpx 0;
		margin: 0 30rpx 30rpx;
		border: 1px solid #EDEDED;
		box-shadow: 0px 0px 16rpx 2rpx rgba(220, 220, 220, 0.3);
		border-radius: 20rpx;
		background:#fff;
	}
	//数据简报
	.brie_li_box{
		border-top:1rpx solid #ededed;
		border-bottom:1rpx solid #ededed;
		padding: 15rpx 24rpx;
		.pre_content {
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;
			.content_item {
				width: 33.33%;
				text-align: center;
				:first-child {
					font-size: 32rpx;
					font-weight: 600;
					margin-top: 26rpx;
					margin-bottom: 10rpx;
					color:#333;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				:last-child {
					font-size: 24rpx;
					padding: 0 20rpx;
					color: #999;
				}
			}
		}
	}
	.brie_box{
		.brie_conbox{
			display: flex;
			justify-content: space-evenly;
			align-items: center;
		}
		.brie_box_item{
			padding:10rpx 8rpx 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background: #f8f8f8;
			flex-shrink: 0;
			width:190rpx;
			.brie_top{
				margin-bottom: 15rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.brie_data,.brie_title{
					font-size:28rpx;
					color:#666;
				}
			}
			.brie_bot{
				display: flex;
				flex-direction: column;
				align-items: center;
				.left_number{
					font-size:24rpx;
					color:#666;
					white-space:normal; 
					word-break:break-all;
					margin-bottom:8rpx;
				}
			}
		}
	}
	// 排行榜
	.paihang-zy{
		padding: 25rpx 0 50rpx 0;
		margin: 0 30rpx 30rpx;
		border: 1px solid #EDEDED;
		box-shadow: 0px 0px 16rpx 2rpx rgba(220, 220, 220, 0.3);
		border-radius: 20rpx;
		background:#fff;
	}
	.rankingbox{
		width:690rpx;
		background:#fff;
		margin:24rpx auto;
		padding:0 30rpx 30rpx;
		border-radius: 20rpx;
		.rank_tab_box{
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-bottom:20rpx;
			border-top:1rpx solid #EDEDED;
			border-bottom:1rpx solid #EDEDED;
			.rank_tab{
				font-size:30rpx;
				padding: 0 32rpx;
				margin: 24rpx 0;
				border-right:1rpx solid #EDEDED;
				&:last-child{
					border-right:0;
				}
			}
		}
	}
	.rank_list{
		.rank_li{
			width:620rpx;
			margin:0 auto 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:15rpx 35rpx;
			border-radius: 20rpx;
			background:rgba(153, 153, 153, 0.2);
			.rank_li_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.rank_num{
					font-size:24rpx;
					color:#666666;
					margin-right:10rpx;
					width:40rpx;
					height:40rpx;
					text-align: center;
					line-height: 38rpx;
				}
				.saleimg{
					width:60rpx;
					height:60rpx;
					border-radius: 50%;
					margin-right:10rpx;
				}
				.salename{
					font-size:30rpx;
					color:#333333;
				}
			}
			.rank_li_right{
				font-size:30rpx;
				color:#666666;
			}
		}
		.rank_li_fir{
			background:rgba(255, 155, 38, 0.2);
			.rank_li_left{
				.rank_num{
					color:rgba(255, 155, 38, 1);
					border:1rpx solid rgba(255, 155, 38, 1);
					border-radius: 50%;
				}
				.salename{
					color:rgba(51, 51, 51, 1);
				}
			}
			.rank_li_right{
				color:rgba(255, 155, 38, 1);
			}
		}
		.rank_li_sec{
			background:rgba(0, 202, 141, 0.2);
			.rank_li_left{
				.rank_num{
					color:rgba(0, 202, 141, 1);
					border:1rpx solid rgba(0, 202, 141, 1);
					border-radius: 50%;
				}
				.salename{
					color:rgba(51, 51, 51, 1);
				}
			}
			.rank_li_right{
				color:rgba(0, 202, 141, 1);
			}
		}
		.rank_li_thr{
			background:rgba(78, 128, 245, 0.2);
			.rank_li_left{
				.rank_num{
					color:rgba(78, 128, 245, 1);
					border:1rpx solid rgba(78, 128, 245, 1);
					border-radius: 50%;
				}
				.salename{
					color:rgba(78, 128, 245, 1)
				}
			}
			.rank_li_right{
				color:rgba(78, 128, 245, 1);
			}
		}
	}
</style>
