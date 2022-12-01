<template>
	<view class="warp follow_warp">
		<view class="cust_detail">
			<!-- 联系人 -->
			<view class="cust_item">
				<view class="cust_item_head">
					<view class="head_info">
						<view class="title-border"></view>
						<view>联系人</view>
					</view>
					<view class="head_new" @click="addLianxiren" v-if="customerType == 1 && operation == 1">
						<image :src="BASE_IMG_URL+'/index/add.png'" class="addimg" ></image>
					</view>
				</view>
				<view class="cust_item_con" v-for="(item,index) in contact_list.slice(0,2)" :key="index">
					<view class="contact_info" @click="jumpDetail(item.id)">
						<view class="con-name">{{item.name}}</view>
						<view class="con-mobile">{{item.new_mobile}}</view>
					</view>
					<view class="contact_phone" @click="selectPhone(item.mobile)">
						<image :src="BASE_IMG_URL+'/index/phone-call.png'" class="phoneimg"  ></image>
					</view>
				</view>
				<view class="moretext" v-if="contact_list.length > 2" @click="toMoreContact">
					<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="dcancel" ></image>
					更多
				</view>
			</view>
			<!-- 报价记录 -->
			<view class="cust_item">
				<view class="cust_item_head">
					<view class="head_info">
						<view class="title-border"></view>
						<view>报价记录</view>
					</view>
					<view class="head_new" @click="toOffer" v-if="customerType == 1 && operation == 1">
						<image :src="BASE_IMG_URL+'/index/add.png'" class="addimg" ></image>
					</view>
				</view>
				
				<view class="quolist" v-for="(item,index) in quotaList.slice(0,2)" :key="index" @click="toQuoteDetail(item)">
					<view class="quo_info_right">
						<view class="quo_text">编号：{{item.number}}</view>
						<view class="quo_text">报价单金额：￥{{item.quote_amount}}</view>
						<view class="quo_text">甲方：{{item.customer.name}}</view>
						<view class="quo_text"><image :src="BASE_IMG_URL + '/index/clock.png'" ></image> {{item.quote_date}}</view>
					</view>
					<view class="quo_staff_info">
						<view class="q_in_ri_fir">
							<view class="q_status" v-if="item.check_status == 0 || item.check_status == 1">待审核</view>
							<view class="q_status" v-if="item.check_status == 2">已通过</view>
							<view class="q_status" v-if="item.check_status == 3">已拒绝</view>
							<view class="q_status" v-if="item.check_status == 9">已作废</view>
						</view>
						<image :src="item.owner_staff.img ? item.owner_staff.img : '/static/index/header.png'" class="staffimg" ></image>
						<view class="staffname">{{item.owner_staff.name}}</view>
					</view>
				</view>
				<view class="moretext" v-if="quotaList.length > 2" @click="toMoreQuatail">
					<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="dcancel" ></image>
					更多
				</view>
			</view>
			<!-- 合同列表 -->
			<view class="cust_item">
				<view class="cust_item_head">
					<view class="head_info">
						<view class="title-border"></view>
						<view>合同列表</view>
					</view>
					<view class="head_new" @click="toOrder" v-if="customerType == 1 && operation == 1">
						<image :src="BASE_IMG_URL+'/index/add.png'" class="addimg" ></image>
					</view>
				</view>
				
				<view class="lxr_con_list" v-for="(item,index) in contract_list.slice(0,2)" :key="index" @click="toContractDetail(item.id)">
					<view class="lxr_li">
						<view class="lxr_li_text">编号：{{item.num}}</view>
						<view class="con_status" v-if="item.check_status == 0">
							待审核
						</view>
						<view class="con_status" v-if="item.check_status == 1">
							审核中
						</view>
						<view class="con_status" v-if="item.check_status == 2">
							审核通过
						</view>
						<view class="con_status" style="color:#ec7f51" v-if="item.check_status == 3">
							审核未通过
						</view>
						<view class="con_status" style="color:#ec7f51" v-if="item.check_status == 4">
							已撤回
						</view>
						<view class="con_status" style="color:#ec7f51" v-if="item.check_status == 9">
							合同终止
						</view>
					</view>
					<view class="lxr_li">
						<view class="lxr_li_left">
							<view class="lxr_text">已回款：￥{{item.receivables.repayment_money}}</view>
							<view class="lxr_text">待回款：￥{{item.receivables.be_money}}</view>
						</view>
						<view class="lxr_li_right">￥{{item.money}}</view>
					</view>
					<view class="proce_li">
						<view class="pro_li_left">
							<view class="protext">回款进度</view>
							<view class="probox">
								<view class="proin"
									:style="{width:(item.receivables.ratio >= 100 ? 100 : item.receivables.ratio) +'%'}">
								</view>
							</view>
							<view class="pronum">{{item.receivables.ratio}}%</view>
						</view>
					</view>
				</view>
				<view class="moretext" v-if="contract_list.length > 2" @click="toMoreContract">
					<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="dcancel" ></image>
					更多
				</view>
			</view>
			<!-- 产品列表 -->
			<view class="cust_item">
				<view class="cust_item_head">
					<view class="head_info">
						<view class="title-border"></view>
						<view>购买的产品列表</view>
					</view>
					<view class="head_new" @click="toAddProduct" v-if="customerType == 1 && operation == 1">
						<image :src="BASE_IMG_URL+'/index/add.png'" class="addimg" ></image>
					</view>
				</view>
				<view class="prod_cell">
					<view class="cell_con" v-for="(item,index) in product_list.slice(0,2)" :key="index" >
						<view class="cellLeft">
							<view class="procenter">
								<view class="proname">{{item.product.name}}</view>
								<view class="context">单位：{{item.product.unit}}</view>
								<view class="context">编码：{{item.product.num}}</view>
								<view class="context">设备编号：{{item.number?item.number:'暂无'}}</view>
							</view>
						</view>
						<view class="proright">
							<view class="probox">{{item.status}}</view>
							<image :src="item.product.img" class="proimg" ></image>
						</view>
					</view>
				</view>
				<view class="moretext" v-if="product_list.length > 2" @click="toMoreProduct">
					<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="dcancel" ></image>
					更多
				</view>
			</view>
			<!-- 回款记录 -->
			<view class="cust_item">
				<view class="cust_item_head">
					<view class="head_info">
						<view class="title-border"></view>
						<view>回款记录</view>
					</view>
					<view class="head_new" @click="toPayment" v-if="customerType == 1 && operation == 1">
						<image :src="BASE_IMG_URL+'/index/add.png'" class="addimg" ></image>
					</view>
				</view>
				<view class="collection_item" v-for="(item,index) in payment_list.slice(0,2)" :key="index" @click="istoPaymentDetail(item)">
					<view class="collention_left">
						<view class="collection_li">
							<view class="collec_text">回款编号：{{item.number}}</view>
						</view>
						<view class="collection_li">
							<view class="collec_text">关联客户： {{item.customer.name}}</view>
						</view>
						<view class="collection_li">
							<view class="collec_text">关联合同： {{item.contract.num}}</view>
						</view>
						<view class="collection_li">
							<view class="collec_text"><image class="clockImg" :src="BASE_IMG_URL + '/index/clock.png'" ></image>{{item.return_time}}</view>
						</view>
					</view>
					<view class="collention_right">
						<view class="collention_status">
							<view class="recostatus" v-if="item.check_status == 0">待审核</view>
							<view class="recostatus" v-if="item.check_status == 1">审核中</view>
							<view class="recostatus" v-if="item.check_status == 2">审核通过</view>
							<view class="recostatus" v-if="item.check_status == 3" style="color:red">审核未通过</view>
							<view class="recostatus" v-if="item.check_status == 4" style="color:red">已撤回</view>
						</view>
						<view class="collection_money">￥{{item.money}}</view>
					</view>
				</view>
				<view class="moretext" v-if="payment_list.length > 2" @click="toMorePayment">
					<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="dcancel" ></image>
					更多
				</view>
			</view>
			<!-- 费用支出 -->
			<view class="cust_item">
				<view class="cust_item_head">
					<view class="head_info">
						<view class="title-border"></view>
						<view>费用支出</view>
					</view>
					<view class="head_new" @click="toCost" v-if="customerType == 1 && operation == 1">
						<image :src="BASE_IMG_URL+'/index/add.png'" class="addimg" ></image>
					</view>
				</view>
				<view class="seconded" v-for="(item,index) in cost_list.slice(0,2)" :key="index" @tap.stop="toCostDetail(item)">
					<view class="cost_left">
						<view class="cost_li">
							<view class="cost_text">消费金额：￥{{item.money}}</view>
						</view>
						<view class="cost_li">
							<view class="cost_text">报销编号：报销编号</view>
						</view>
						<view class="cost_li">
							<view class="cost_text">消费类型：消费类型</view>
						</view>
						<view class="cost_li">
							<view class="cost_text"><image class="clockImg" :src="BASE_IMG_URL + '/index/clock.png'" ></image> {{item.submit_date}}</view>
						</view>
					</view>
					<view class="cost_right">
						<view class="cost_li">
							<view class="cost_status" v-if="item.check_status == 0">待审核</view>
							<view class="cost_status" v-if="item.check_status == 1">审核中</view>
							<view class="cost_status" v-if="item.check_status == 2">审核通过</view>
							<view class="cost_status" v-if="item.check_status == 3" style="color:red">审核未通过</view>
							<view class="cost_status" v-if="item.check_status == 4" style="color:red">撤销</view>
						</view>
						<view class="cost_money"> &yen; {{item.money}}</view>
					</view>
					
				</view>
				<view class="moretext" v-if="cost_list.length > 2" @click="toMoreCost">
					<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="dcancel" ></image>
					更多
				</view>
			</view>
			<!-- 售后记录 -->
			<view class="cust_item">
				<view class="cust_item_head">
					<view class="head_info">
						<view class="title-border"></view>
						<view>售后记录</view>
					</view>
					<view class="head_new" @click="toAddAftersale" v-if="customerType == 1 && operation == 1">
						<image :src="BASE_IMG_URL+'/index/add.png'" class="addimg" ></image>
					</view>
				</view>
				<view class="cost_item" v-for="(item,index) in afterSale_list.slice(0,2)" :key="index"  @tap.stop="toSaleDetail(item)">
					<view class="cost_li_con">
						工单编号：{{item.workorder_number}}
					</view>
					<view class="cost_li_con">
						任务：{{item.title}}
					</view>
					<view class="cost_li_con">
						关联客户：{{item.customer.name}}
					</view>
				</view>
				<view class="moretext" v-if="afterSale_list.length > 2" @click="toMoreAftersale">
					<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="dcancel" ></image>
					更多
				</view>
			</view>
			<!-- 出差签到 -->
			<view class="cust_item">
				<view class="cust_item_head">
					<view class="head_info">
						<view class="title-border"></view>
						<view>出差签到</view>
					</view>
					<view class="head_new" @click="toSign" v-if="customerType == 1 && operation == 1">
						<image :src="BASE_IMG_URL+'/index/add.png'" class="addimg" ></image>
					</view>
				</view>
				<view class="signwarp">
					<view class="signli" v-for="(item,index) in signList.slice(0,2)" :key="index" @click="toSigndetail(item)">
						<view class="sign_staff">
							<image :src="item.staff.img" class="sta_img" mode=""></image>
							<view class="sta_name">{{item.staff.name}}</view>
						</view>
						<view class="sign_address">{{item.createtime}}</view>
						<view class="sign_address">{{item.location}}</view>
					</view>
				</view>
				<view class="moretext" v-if="signList.length > 2" @click="toMoreSign">
					<image :src="BASE_IMG_URL+'/index/double-cancel.png'" class="dcancel" ></image>
					更多
				</view>
			</view>
			
			<!-- 附件列表 -->
			<view class="cust_item" v-if="false">
				<view class="cust_item_head">
					<view class="head_info">
						<image :src="BASE_IMG_URL+'/customer/shouhou.png'" class="seximg"></image>
						<view class="title-border"></view>
						<view>附件</view>
					</view>
					
				</view>
				<view class="item_doc">
					<view class="doc_item" v-for="(item,index) in file_list" :key="index" @click.stop="lookDetail(item)">
						<image :src="BASE_IMG_URL+'/customer/edit.png'" class="remarkimg" ></image>
						<input type="text" :disabled="item.disabled" :focus="item.focus" :data-index="index"
							v-model="item.name" @confirm="changeName" class="doc_name" />
						<view class="doc_size">{{item.size}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netContact, netQuotationList, netContractList, 
	netCustomerProductList, netPaymentList, netCostList, 
	netWorkOrderList, netCustomerFileList, netAddCustomerFile, uploadUrl, netGetSignList } from '@/api/api.js'
	import { BASE_IMG_URL, BASE_URL, SIGN_NO } from '@/api/http.js'
	import { mapState } from 'vuex'
	
	export default{
		components:{
		},
		props:{
			customerType:{
				type:Number,
				default:1   ////1我的客户   2公海客户
			},
			operation:{
				type:Number,
				default:1
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				contact_list:[],  //联系人
				quotaList:[],  //报价单
				contract_list:[],   //合同 列表
				product_list:[],   //产品  列表
				payment_list:[],   //回款  列表
				cost_list:[],   //费用 列表
				afterSale_list:[],   //售后 列表
				file_list:[],   //附件列表
				signList:[],   //出差签到列表
				customerid:'',
				info:null,
			}
		},
		created() {
		},
		methods:{
			init(id,info) {
				this.customerid = id
				this.info = info
				//联系人
				this.getContactList()
				//报价单 列表
				this.getQuotaList()
				//获取 合同 列表
				this.getContractsList()
				//回款 记录
				this.getPaymentList()
				//费用列表
				this.getCostlist()
				//售后 记录
				this.getSaleafterList()
				//产品  列表
				this.getProductList()
				//附件列表
				this.getFile()
				//出差签到列表
				this.getSignList()
			},
			//出差签到
			getSignList() {
				let params = {
					customer_id:this.customerid,
					limit: 1000
				}
				netGetSignList(params).then(res=>{
					this.signList = res.data.data
				})
			},
			//出差签到
			toSign() {
				uni.navigateTo({
					url:'/pagesB/signin/busSign?customerid='+this.customerid
				})
			},
			//签到详情
			toSigndetail(item) {
				uni.navigateTo({
					url:'/pagesB/signin/signDetail?id='+item.id
				})
			},
			//查看更多签到记录
			toMoreSign() {
				uni.navigateTo({
					url:'/pagesB/signin/signin?customerid='+this.customerid
				})
			},
			//附件 列表
			getFile() {
				let params = {
					customer_id: this.customerid
				}
				netCustomerFileList(params).then(res => {
					res.data.forEach(item => {
						item.disabled = true
						item.focus = false
					})
					this.file_list = res.data
				})
			},
			delFile(item) {
				let params = {
					
				}
			},
			//添加附件
			toUploadFile() {
				wx.chooseMessageFile({
					success:(res)=>{
						console.log(res)
						let data = res.tempFiles
						data.forEach(ele=>{
							this.toUpload(ele.path,ele.name)
						})
					}
				})
			},
			toUpload(file,name) {
				uni.uploadFile({
					url: uploadUrl,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token'),
						'sign-no': SIGN_NO
					},
					filePath: file,
					formData:{name},
					success: (res) => {
						let data = JSON.parse(res.data)
						if (data.code == 1) {
							this.addFile(data.data)
						} else {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//添加附件
			addFile(data) {
				netAddCustomerFile({files:data.id,customer_id:this.customerid}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.getFile()
					},2000)
				})
			},
			//点击 附件  查看
			lookDetail(item) {
				if(item.types == 'image'){
					uni.previewImage({
						urls: [ item.file_path ]
					})
				}else{
					this.openFile({file:item.file_path,filename:item.name,type:'file'})
				}
			},
			//产品  列表
			getProductList() {
				let params = {
					customer_id: this.customerid,
					limit: 1000
				}
				netCustomerProductList(params).then(res=>{
					this.product_list = res.data.data
				})
			},
			//查看更多产品
			toMoreProduct() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/otherList/product?id='+this.customerid
				})
			},
			//产品  工单 详情
			toWordorderDetail(item) {
				if(item.last_workorder_id > 0){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorderDetail?workorderid='+item.last_workorder_id
					})
				}
			},
			//查看更多联系人
			toMoreContact() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/otherList/contact?id='+this.customerid
				})
			},
			//联系人列表
			getContactList() {
				let params = {
					customer_id: this.customerid,
					limit: 1000
				}
				netContact(params).then(res => {
					this.contact_list = res.data
				})
			},
			//查看更多报价单
			toMoreQuatail() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/otherList/quotail?id='+this.customerid
				})
			},
			//报价单  列表
			getQuotaList() {
				netQuotationList({customer_id:this.customerid}).then(res=>{
					this.quotaList = res.data.data
				})
			},
			//查看更多合同
			toMoreContract() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/otherList/contract?id='+this.customerid
				})
			},
			//合同列表
			getContractsList() {
				let params = {
					customer_id: this.customerid
				}
				netContractList(params).then(res => {
					this.contract_list = res.data
				})
			},
			//回款记录  列表
			getPaymentList() {
				let params = {
					customer_id: this.customerid,
					limit: 1000
				}
				netPaymentList(params).then(res => {
					this.payment_list = res.data.data
				})
			},
			//查看更多  回款
			toMorePayment() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/otherList/payment?id='+this.customerid
				})
			},
			//费用 列表
			getCostlist() {
				netCostList({customer_id:this.customerid}).then(res=>{
					this.cost_list = res.data.data
				})
			},
			//查看更多费用
			toMoreCost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/otherList/cost?id='+this.customerid
				})
			},
			//售后 列表
			getSaleafterList() {
				netWorkOrderList({customer_id:this.customerid}).then(res=>{
					this.afterSale_list = res.data.data
				})
			},
			toMoreAftersale() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/otherList/afterSale?id='+this.customerid
				})
			},
			//新建 联系人
			addLianxiren() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contact/createContact?id='+this.customerid
				})
			},
			//联系人 详情
			jumpDetail(id) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contact/contactDetail?id='+id
				})
			},
			//呼叫 联系人
			selectPhone(mobile) {
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: mobile,
					code: '+86',
					showDingCall: true
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: mobile
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(mobile, true);
				// #endif
			},
			//费用
			toCost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/createNewCost?customerid='+this.customerid
				})
			},
			//费用详情
			toCostDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/detail?id='+item.id
				})
			},
			//合同
			toOrder() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/order/createOrder?customerid='+this.customerid+'&type=1'
				})
			},
			//回款
			toPayment() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/payment/createPayment?customerid='+this.customerid+'&name='+this.info.name
				})
			},
			//回款 详情
			istoPaymentDetail(item) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/payment/paymentDetail?paymentid='+item.id
				})
			},
			//报价
			toOffer() {
				uni.navigateTo({
					url:'/pagesC/quotation/addQuotation?customerid='+this.customerid
				})
			},
			//报价  详情
			toQuoteDetail(item) {
				uni.navigateTo({
					url:'/pagesC/quotation/detail?id='+item.id,
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			//添加 产品 
			toAddProduct() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/product/add_contract_product?id='+this.customerid+'&name='+this.info.name+'&status=0'
				})
			},
			//合同 详情
			toContractDetail(id) {
				uni.navigateTo({
					url:'/pages/index/contractManagements/contractDetail?id='+id
				})
			},
			//售后
			toSales() {
				uni.navigateTo({
					url:'/pages/index/customerInfo/sales/createSale'
				})
			},
			//新建 售后
			toAddAftersale() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/createVisit?customerid='+this.customerid
				})
				// uni.navigateTo({
				// 	url:'/pages/index/orderSettlement/template/product_install?customerid='+this.customerid+'&type=上门维修'
				// })
			},
			//售后  工单 详情
			toSaleDetail(item) {
				if(item.workorder_type == '产品发货' || item.workorder_type == '配件配送'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorder/distribution_word?workorderid='+item.id
					})
					return
				}
				if(item.workorder_type == '品质异常单'){
					uni.navigateTo({
						url:'/pagesA/afterSales/workorder/quality_order_detail?workorderid='+item.id
					})
					return
				}
				if(item.workorder_type == '返厂维修'){
					uni.navigateTo({
						url:'/pagesA/customerInfo/visit/depotrepart/detail?id='+item.id
					})
					return
				}
				if(item.workorder_type == '设计工单'){
					uni.navigateTo({
						url:'/pagesA/afterSales/designWorkOrder/designDetail?id='+item.id
					})
					return
				}
				if(item.workorder_type == '电话售后'){
					uni.navigateTo({
						url:'/pagesA/afterSales/phoneAftersale/detail?id='+item.id
					})
					return
				}
				uni.navigateTo({
					url:'/pagesA/afterSales/workorderDetail?workorderid='+item.id
				})
			},
			//查看  售后 图片
			toPriveSaleimg(arr,index) {
				let data = []
				arr.forEach(ele=>{
					data.push(ele.file_path)
				})
				uni.previewImage({
					urls:data,
					current:index,
					success:(res)=>{
						this.$emit('seePicture')
					}
				})
			},
			//查看图片
			toPriveimg(arr,index){
				uni.previewImage({
					urls:arr,
					current:index,
					success:(res)=>{
						this.$emit('seePicture')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	//出差签到
	.signwarp{
		padding:0 30rpx;
		.signli{
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			.sign_staff{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.sta_img{
					width:60rpx;
					height:60rpx;
					border-radius: 50%;
				}
				.sta_name{
					font-size:26rpx;
					color:#333;
					margin-left:24rpx;
				}
			}
			.sign_address{
				font-size:26rpx;
				color:#666;
				margin-top:15rpx;
			}
		}
	}
	.clockImg{
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	.item_doc {
		padding: 0 24rpx;
		background:#fff;
		.doc_item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #f7faff;
			line-height: 60rpx;
			margin-bottom: 20rpx;
			.remarkimg{
				width:31rpx;
				height:33rpx;
			}
			.icon--task {
				width: 50rpx;
				padding-left: 10rpx;
			}
	
			.doc_name {
				flex: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
	
			.doc_size {
				width: 130rpx;
			}
	
			.editimg {
				width: 40rpx;
				height: 40rpx;
			}
	
			.icon-clear {
				width: 50rpx;
			}
		}
	}
	.cust_item {
		width:690rpx;
		margin:24rpx auto 24rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.18);
		border-radius: 10px;
		.moretext{
			padding:24rpx 24rpx 24rpx;
			font-size: 26rpx;
			color: $uni-text-color;
			text-align: center;
			image{
				margin-right: 10rpx;
				width: 25rpx;
				height: 25rpx;
			}
		}
		.cust_item_head {
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #EAEAEA;
			padding: 24rpx 0 24rpx;
			margin: 0 36rpx 0;
			.head_info {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				font-size: 28rpx;
				color: #666666;
				.title-border{
					margin-right: 15rpx;
					width: 10rpx;
					height: 25rpx;
					background: $uni-btn-bg-color;
					border-radius: 5rpx;
				}
				.firimg{
					width:46rpx;
					height:46rpx;
					margin-right:15rpx;
				}
				.secimg{
					width:38rpx;
					height:42rpx;
					margin-right:15rpx;
				}
				.thrimg{
					width:36rpx;
					height:38rpx;
					margin-right:15rpx;
				}
				.forimg{
					width:38rpx;
					height:34rpx;
					margin-right:15rpx;
				}
				.fivimg{
					width:40rpx;
					height:36rpx;
					margin-right:15rpx;
				}
				.seximg{
					width:37rpx;
					height:38rpx;
					margin-right:15rpx;
				}
			}
	
			.head_new {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				font-size:26rpx;
				color:#0287FF;
				.addimg {
					width: 52rpx;
					height: 52rpx;
				}
				:nth-child(even){
					margin-left:15rpx;
				}
				.dcancel{
					width: 26rpx;
					height: 31rpx;
				}
				
			}
		}
		.prod_cell{
			padding:0 40rpx;
			background:#fff;
			.cell_con{
				margin:0 0 24rpx;
				background:#fff;
				padding:10rpx 0 10rpx;
				border-bottom:1rpx solid #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.cellLeft{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.procenter{
						.proname{
							font-size:24rpx;
							color:#666666;
						}
						.context{
							font-size:24rpx;
							color:#999999;
							margin-top:23rpx;
						}
					}
				}
				
				.proright{
					text-align: right;
					.probox{
						font-size:26rpx;
						color: #333333;
					}
					.proimg{
						margin-top: 10rpx;
						width:126rpx;
						height:126rpx;
						border-radius: 10rpx;
					}
				}
			}
		}
		.cust_item_con {
			padding: 15rpx 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background:#fff;
			margin-bottom:20rpx;
			border-bottom:1rpx solid #f5f5f5;
			.contact_info {
				display: flex;
				// flex: 1;
				padding: 10rpx 0;
				.con-name{
					margin-right: 15rpx;
					font-size:26rpx;
					color:#999;
				}
				.con-mobile{
					font-size:26rpx;
					color:#999;
				}
			}
			.contact_phone{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size:26rpx;
				color:#0287FF;
				.phoneimg {
					width:42rpx;
					height:42rpx;
					margin-right:24rpx;
				}
			}
			
		}
		.quolist{
			background:#fff;
			border-radius: 20rpx;
			padding: 24rpx 36rpx 24rpx;
			display: flex;
			justify-content: flex-start;
			border-bottom:1rpx solid #f5f5f5;
			.quo_staff_info{
				margin-left:auto;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.staffimg{
					width:70rpx;
					height:70rpx;
					border-radius: 50%;
					margin:20rpx 0 20rpx;
				}
				.staffname{
					font-size:26rpx;
					color:#999999;
				}
			}
			.quo_info_right{
				flex:1;
				.q_in_ri_fir{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.q_name{
						font-size:26rpx;
						color:#999999;
					}
					.q_status{
						font-size:24rpx;
						color: #333;
					}
				}
				.quo_text{
					font-size:26rpx;
					color:#999999;
					margin-top:15rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					image{
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
		
		.lxr_con_list {
			padding: 20rpx 30rpx;
			background:#fff;
			border-bottom:1rpx solid #f5f5f5;
			.lxr_li{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom:15rpx;
				&:last-child{
					margin-bottom:15rpx;
				}
				.lxr_li_text{
					font-size:26rpx;
					color:#999999;
				}
				.con_status {
					font-size: 24rpx;
					color: #333333;
				}
				.lxr_li_left{
					.lxr_text{
						font-size:26rpx;
						color:#999999;
						margin-bottom:15rpx;
						&:last-child{
							margin-bottom:0;
						}
					}
				}
				.lxr_li_right{
					font-size:28rpx;
					color:#333;
				}
			}
		
			.proce_li {
				display: flex;
				justify-content: space-between;
				align-items: center;
		
				.pro_li_left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
		
					.protext {
						font-size: 24rpx;
						color: #999999;
					}
		
					.probox {
						width: 120rpx;
						height: 15rpx;
						border-radius: 8rpx;
						background: #C0C0C0;
						margin: 0 15rpx;
		
						.proin {
							width: 20%;
							height: 15rpx;
							border-radius: 8rpx;
							background: $uni-btn-bg-color;
						}
					}
		
					.pronum {
						font-size: 24rpx;
						color: #999999;
					}
				}
		
				.pro_li_right {
					color: #ec7f51;
					font-size: 28rpx;
					font-weight: 500;
				}
			}
		
			
		}
		.collection_item{
			display: flex;
			justify-content: space-between;
			padding:24rpx 30rpx;
			border-bottom:1rpx solid #f5f5f5;
			.collection_li{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom:15rpx;
				&:last-child{
					margin-bottom:0;
				}
				.collec_text{
					display: flex;
					align-items: center;
					font-size:26rxp;
					color:#999999;
				}
			}
			.collention_right{
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				justify-content: space-around;
				.collection_money{
					flex-shrink: 0;
					font-size: 28rpx;
				}
				.collection_status{
					flex-shrink: 0;
					font-size: 24rpx;
				}
			}
		}
		.seconded{
			display: flex;
			justify-content: space-between;
			padding:24rpx 30rpx;
			border-bottom:1rpx solid #f5f5f5;
			
			.cost_left{
				
				// .cost_text{
				// 	display: flex;
				// 	align-items: center;
				// 	}
				.cost_li{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.cost_text{
						font-size:26rpx;
						color:#999999;
						margin-bottom:15rpx;
						display: flex;
						align-items: center;
					}
					.cost_status{
						font-size: 24rpx;
						color: #00B954;
						padding:5rpx 8rpx;
						background:rgba(0, 185, 84, 0.2);
					}
				}
			}
			.cost_right{
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				justify-content: space-evenly;
				.cost_money{
					font-size:28rpx;
					color:#333;
				}	
				.cost_li_img{
					.cost_img_tit{
						font-size:26rpx;
						color:#999999;
						margin-bottom:15rpx;
					}
					.cost_img_list{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						flex-wrap: wrap;
						.cost_img_box{
							width:100rpx;
							height:100rpx;
							border-radius: 20rpx;
							margin-right:45rpx;
							.costimg{
								width:100rpx;
								height:100rpx;
								border-radius: 20rpx;
							}
						}
					}
				}
			}
		}
		.cost_item{
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			padding:24rpx 30rpx;
			border-bottom:1rpx solid #f5f5f5;
			
			.cost_li_con{
				font-size:26rpx;
				color:#999999;
				margin-bottom:15rpx;
			}
		}
	}
</style>
