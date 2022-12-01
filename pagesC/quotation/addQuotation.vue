<template>
	<view>
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="tabwarp">
			<view class="infowarp">
				<view class="inp_warp">
					<view class="inp_title key">报价单编号<span>*</span></view>
					<view class="form_right">
						<input type="text" v-model="number" disabled :class="number ? 'valueActive' : '' " placeholder="请输入报价单编号" class="rightinput">
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">客户<span>*</span></view>
					<view class="form_right" @click="toSelectCustomer" v-if="isSelect">
						<view :class="customerObj ? 'valueActive' : '' ">
							{{customerObj ? customerObj.name : '点击选择'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
					<view class="form_right" v-else>
						<view :class="customerObj ? 'valueActive' : '' ">
							{{customerObj ? customerObj.name : '点击选择'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">客户联系人<span>*</span></view>
					<picker @change="changeLink" :range="contactList" :range-key="'name'" :value="contactIndex">
						<view class="form_right">
							<view :class="contactList[contactIndex] ? 'valueActive' : '' ">
								{{contactList[contactIndex] ? contactList[contactIndex].name : '点击选择'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">公司报价人<span>*</span></view>
					<view class="form_right" @click="toSelectStaff">
						<view :class="staffObj ? 'valueActive' : '' ">
							{{staffObj ? staffObj.name : '点击选择'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">报价时间<span>*</span></view>
					<picker @change="changeTime" mode="date">
						<view class="form_right">
							<view :class="quote_date ? 'valueActive' : '' ">
								{{quote_date ? quote_date : '点击选择'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
				<view class="inp_warp" v-if="!isRequired">
					<view class="inp_title">特约条款</view>
					<view class="form_right">
						<switch :checked="isShowClause" color="#008EFF" @change="isShowClause = !isShowClause" />
					</view>
				</view>
				<view class="inp_cluse" v-if="isShowClause && !isRequired">
					<!-- <view class="cluse_title key">特约条款<span>*</span></view> -->
					<view class="clusebox">
						<view class="richbox">
							<editor
								id="editor"  
								class="ql-container" 
								show-img-size 
								show-img-resize 
								show-img-toolbar 
								:read-only="isEdit"
								:placeholder="placeholder"
								@ready="onEditorReady"
								@statuschange="onStatusChange"
							></editor>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 产品列表 -->
			<view class="inp_warp" style="margin-top:0;">
				<view class="inp_title key">产品列表:<span>*</span></view>
				<image :src="BASE_IMG_URL+'/index/add.png'" @click="toSelectProduct" class="fileimg" style="width:35rpx;height:35rpx;"></image>
			</view>
			<view class="pro_warp">
				<uni-collapse v-model="activeNames" @change="changeCollapse" ref="collapse">
					<view class="pro_li" v-for="(item,index) in productList" :key="index">
						<uni-collapse-item accordion title="配置" :name="index">
							<view slot="title">
								<view class="pro_li_top" @tap.stop.prevent>
									<view class="pro_name">产品名称：{{item.name}}</view>
									<image :src="BASE_IMG_URL+'/index/delete.png'" @tap.sotp="delProduct(index)" class="deleimg" ></image>
								</view>
								<view class="pro_info">
									<view class="pro_info_left" @tap.stop.prevent>
										<view class="pro_info_text">报价：￥ <input type="text" class="priceinput" v-model="item.price" @blur="(e)=>{changeProductPrice(e,index)}" /> </view>
										<view class="pro_info_text">数量：
											<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
										</view>
										<view class="pro_info_text">报价小计：{{item.price * item.number}}</view>
									</view>
									<view class="pro_info_img">
										<image :src="item.img ? item.img : '/static/img/index-4.png'" class="proimg" ></image>
									</view>
								</view>
							</view>
							<view>
								<view class="re_fir">
									<view class="fllow_area">
										<view class="area_head">配置说明:</view>
										<textarea v-model="item.config_desc" :class="{'valueActive':item.config_desc}" placeholder="请填写备注"
											placeholder-style="color:#999" />
									</view>
									<view class="fllow_area">
										<view class="area_head">备注:</view>
										<textarea v-model="item.remarks" :class="{'valueActive':item.remarks}" placeholder="请填写备注"
											placeholder-style="color:#999" />
									</view>
								</view>
							</view>
						</uni-collapse-item>
					</view>
				</uni-collapse>
				<view class="noData" v-if="productList.length == 0">暂无更多</view>
			</view>
			<view class="mx_totalwarp">
				<view class="mx_totalmoney">产品合计: {{quote_amount}}</view>
				<view class="mx_zhekou" @click="toInputdiscount">优惠金额({{discount_amount}})</view>
			</view>
			<view class="inp_warp" v-if="!isRequired">
				<view class="inp_title">是否需要审核</view>
				<view class="form_right">
					<switch :checked="is_check" color="#008EFF" @change="changeSwitch" />
				</view>
			</view>
			<!-- 固定审批 -->
			<fixed-approval v-if="approvalPro.status == 1 && is_check" title="提醒人" :list="approvalPro.stepList"></fixed-approval>
			<!-- 审核信息 -->
			<examine-people v-if="approvalPro.status == 0 && is_check" :list="remindPeople" @delItem="delItem"></examine-people>
			<!-- 报价凭证 -->
			<upload-img title="报价凭证" v-if="!isRequired" :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		</view>
		<view style="height:calc(100rpx + env(safe-area-inset-bottom));"></view>
		<view class="quo_bottom">
			<view class="quobtn" @click="$noMultipleClicks(sureSubmit)">确定</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="quo_yulan" @click="$noMultipleClicks(lookPDF)">预览</view>
			<!-- #endif -->
		</view>
		
		<!-- 添加产品 -->
		<popup-list ref="productChild" @selectList="selectList"></popup-list>
		<!-- 选择产品分类 -->
		<popup-type ref="productType" @selectType="selectType"></popup-type>
		<!-- 填写优惠金额 -->
		<uni-popup ref="inputDialog" type="dialog" @touchmove.stop.prevent>
			<uni-popup-dialog ref="inputClose"  mode="input" title="优惠金额" :value="discount_amount"
				placeholder="请输入优惠金额" @confirm="sureDiscount"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import { netOfferAutoNumber, netLianxiren, netAddquotation, netPrevieQuotation, netPrevCustomer, 
	netSpecialTerm, netSetStorage, netGetStorage, netApprovalProcess  } from '@/api/api.js'
	import popupList from '@/components/selectProduct/index'
	import popupType from '@/components/selectProductType/index'
	import { getNowTime } from '@/utils/util.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	import { BASE_IMG_URL, SIGN_NO, BASE_URL } from '@/api/http.js'
	let T;
	
	export default{
		mixins:[commonFun],
		components:{
			popupList,
			popupType
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				number:'',  //报价单编号
				isSelect:true,
				customer_id:'',   //客户id
				quote_date:'',   //报价时间
				product_ids:'',   //产品id列表
				discount_amount:0,   //优惠金额
				quote_amount:0,    //报价金额
				
				contactList:[],   //联系人列表
				contactIndex:0,
				
				remindPeople:[],
				examineType:'quote',
				is_check:false,
				flow_staff_id:'',
				imgList:[],  //凭证
				//特约条款编辑器
				formats:{},
				editorCtx:'',
				isEdit:false,
				placeholder: '开始输入...',
				activeNames:[],
				proType:[],   //产品分类
				productList:[],   //产品列表
				showRemark:'',
				isShowClause:true,  //是否显示 特约条款
				oldInfo:{},  //上一次保存的数据
				approvalPro:{},   //审批流程
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,   //关联客户
			staffObj: state => state.customer.staffObj
		}),
		watch:{
			customerObj(obj,oldvalue){
				if(obj){
					this.customer_id = obj.id
					//获取 客户联系人
					this.getCustomerLink()
				}
			}
		},
		onUnload() {
			this.$store.commit('CUSTOMEROBJ',null)
			clearInterval(T)
		},
		onLoad(options) {
			this.$store.commit('CUSTOMEROBJ',null)
			this.customer_id = options.customerid
			if(this.customer_id){
				this.isSelect = false
				//获取 客户信息
				this.getCusobj()
				//获取 当前 客户的联系人
				this.getCustomerLink()
			}
			//报价单 时间
			this.quote_date = getNowTime()
			//获取 报价单编号
			this.getNumber()
			//获取 上次保存的数据
			this.getData()
			//获取 审批流程
			this.getProcess()
			//10s保存一次
			T = setInterval(()=>{
				this.saveInfo()
			},10000)
		},
		onShow() {
			if(this.approvalPro.status == 0){
				//获取  默认需要提醒的人
				this.getDefaultRemind()
			}
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			//审批流程
			getProcess() {
				netApprovalProcess({type:'quote'}).then(res=>{
					this.approvalPro = res.data
					if(this.approvalPro.status == 0){
						//获取  默认需要提醒的人
						this.getDefaultRemind()
					}
				})
			},
			////////////////////////////////////////////////////////////////////////////////////
			//10s保存
			saveInfo() {
				if(this.isShowClause){
					this.editorCtx.getContents({
						success:(con)=>{
							let params = {
								type:'quote',
								content:con.html,
								number:this.number,  //报价单编号
								customer:this.customerObj,
								contactIndex:this.contactIndex,
								quote_date:this.quote_date,   //报价时间
								proType:this.proType,
								productList:this.productList,
								discount_amount:this.discount_amount,   //优惠金额
								quote_amount:this.quote_amount,    //报价金额
								is_check:this.is_check,
								imgList:this.imgList,
								staffObj:this.staffObj,
								isShowClause:this.isShowClause,   //是否显示 特约条款
							}
							netSetStorage(params).then(res=>{})
						}
					})
				}else{
					let params = {
						type:'quote',
						content:'',
						number:this.number,  //报价单编号
						customer:this.customerObj,
						contactIndex:this.contactIndex,
						quote_date:this.quote_date,   //报价时间
						proType:this.proType,
						productList:this.productList,
						discount_amount:this.discount_amount,   //优惠金额
						quote_amount:this.quote_amount,    //报价金额
						is_check:this.is_check,
						imgList:this.imgList,
						staffObj:this.staffObj,
						isShowClause:this.isShowClause,   //是否显示 特约条款
					}
					netSetStorage(params).then(res=>{})
				}
			},
			//获取上次保存的数据
			getData() {
				netGetStorage({type:'quote'}).then(res=>{
					res = res.data
					if(res){
						this.oldInfo = res
						this.number = res.number
						if(!this.customer_id) {
							this.$store.commit('CUSTOMEROBJ',res.customer)
							this.contactIndex = res.contactIndex
						}
						this.$store.commit('STAFFOBJ',res.staffObj)
						
						this.quote_date = res.quote_date
						this.proType = res.proType
						this.productList = res.productList
						this.discount_amount = res.discount_amount
						this.quote_amount = res.quote_amount
						this.is_check = res.is_check
						this.imgList = res.imgList
						this.isShowClause = res.content ? true : false
						
						if(this.editorCtx && res.content){
							this.editorCtx.setContents({
								html:res.content
							})
						}else{
							this.getTiaokuan()
						}
					}
				})
			},
			/////////////////////////////////////////////////////////////////////////////////////////
			//编辑器
			onEditorReady(e) {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					
					if(this.oldInfo.content){
						this.editorCtx.setContents({
							html:res.content
						})
					}else{
						this.getTiaokuan()
					}
				}).exec()
			},
			onStatusChange(e) {
				this.formats = e.detail;
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset;
				if (!name) return; 
				this.editorCtx.format(name, value);
			},
			//获取默认的特约条款
			getTiaokuan() {
				netSpecialTerm().then(res=>{
					this.editorCtx.setContents({
						html:res.data
					})
				})
			},
			////////////////////////////////////////////////////////////////////////////////////////
			//产品分类
			toSelectProductType() {
				this.$refs.productType.init()
			},
			selectType(arr) {
				this.proType = this.deWeight(arr.concat(this.proType))
			},
			delProType(index) {
				this.proType.splice(index,1)
			},
			//配置备注
			toWriterRemark(item,index) {
				let str = item.id+'-'+index
				this.showRemark = str == this.showRemark ? '' : str
			},
			///////////////////////////////////////////////////////////////////////////////////////
			//修改产品价格
			changeProductPrice(e,index) {
				console.log(e,index,'-----')
				let money = e.detail.value
				let obj = this.productList[index]
				obj.price = money
				this.$set(this.productList,index,obj)
				this.handleTotalMoney()
			},
			// 编辑产品数量
			changeNumber(e,index) {
				let obj = this.productList[index]
				obj.number = e
				this.$set(this.productList,index,obj)
				this.handleTotalMoney()
			},
			/**产品 信息*/
			toSelectProduct() {
				this.$refs.productChild.init()
			},
			//选择的产品
			selectList(arr) {
				console.log(arr)
				arr.forEach(ele=>{
					ele.remarks = ''
					ele.config_desc = ''
				})
				this.productList = this.$deWeight(this.productList.concat(arr))
				this.handleTotalMoney()
			},
			//删除产品
			delProduct(index) {
				this.productList.splice(index,1)
				this.handleTotalMoney()
			},
			//计算产品 金额
			handleTotalMoney() {
				let arr = this.productList
				let money = 0
				arr.forEach(ele=>{
					money += ele.number*Number(ele.price)
				})
				if(money <= 0) {
					this.quote_amount = 0
				}else if(Number(this.discount_amount) > money) {
					this.discount_amount = 0
					uni.showToast({
						title:'优惠金额不能大于产品合计金额',
						icon:'none'
					})
				}else{
					this.quote_amount = money - Number(this.discount_amount)
				}
			},
			//展开产品编辑 配置
			changeCollapse(e) {
				this.activeNames = e
				this.init()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			//添加产品配置
			addProcuctConfig(index) {
				let obj = this.productList[index]
				obj.product_config.push({name:'',num:'',unit:'',remark:'',addObj:true})
				this.$set(this.productList,index,obj)
			},
			//删除产品配置
			toDelConfig(index,conindex) {
				let obj = this.productList[index]
				obj.product_config.splice(conindex,1)
				this.$set(this.productList,index,obj)
			},
			///////////////////////////////////////////////////////////////////////////////////////
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			getCusobj() {
				netPrevCustomer({id:this.customer_id}).then(res=>{
					// this.customerObj = res.data.data[0]
					this.$store.commit('CUSTOMEROBJ',res.data.data[0])
				})
			},
			getNumber() {
				netOfferAutoNumber().then(res=>{
					this.number = res.data.number
				})
			},
			getCustomerLink() {
				let params = {
					customer_id: this.customer_id
				}
				netLianxiren(params).then(res=>{
					if(res.data.length == 0) {
						uni.showToast({
							title:'此客户暂无联系人，请先添加联系人',
							icon:'none'
						})
						return
					}
					this.contactList = res.data
				})
			},
			changeLink(e) {
				this.contactIndex = e.detail.value
			},
			//报价时间
			changeTime(e) {
				this.quote_date = e.detail.value
			},
			
			//去优惠
			toInputdiscount() {
				if(this.productList.length == 0) {
					uni.showToast({
						title:'请先添加产品',
						icon:'none'
					})
					return
				}
				this.$refs.inputDialog.open()
			},
			sureDiscount(value) {
				this.discount_amount = value
				this.$refs.inputDialog.close()
				this.handleTotalMoney()
			},
			changeSwitch(e) {
				this.is_check = e.detail.value
			},
			getParams(con,callback) {
				let clause = con.html
				let {
					number,  //报价单编号
					customer_id,   //客户id
					quote_date,   //报价时间
					contactList,   //联系人列表
					contactIndex,
					discount_amount,   //优惠金额
					quote_amount,    //报价金额
					productList,
					remindPeople,
					is_check
				} = this
				
				if(!customer_id){
					uni.showToast({
						title:'请选择客户',
						icon:'none'
					})
					return
				}
				if(!contactList[contactIndex]){
					uni.showToast({
						title:'请选择客户联系人',
						icon:'none'
					})
					return
				}
				if(!this.staffObj){
					uni.showToast({
						title:'请选择公司签约人',
						icon:'none'
					})
					return
				}
				if(!quote_date){
					uni.showToast({
						title:'请选择报价时间',
						icon:'none'
					})
					return
				}
				if(!clause && this.isShowClause) {
					uni.showToast({
						title:'请补充特约条款',
						icon:'none'
					})
					return
				}
				if(productList.length == 0){
					uni.showToast({
						title:'请选择产品列表',
						icon:'none'
					})
					return
				}
				if(is_check && this.remindPeople.length == 0) {
					uni.showToast({
						title:'请选择审核人',
						icon:'none'
					})
					return
				}
				let product = []
				productList.forEach(ele=>{
					product.push({
						product_id:ele.id,
						price: ele.price,
						number:ele.number,
						config_desc:ele.config_desc,
						remarks:ele.remarks,
						config:ele.product_config
					})
				})
				///////提醒人
				let arr = []
				if (remindPeople.length == 0 && this.approvalPro.status == 0) {
					uni.showToast({
						title: '请选择审核人',
						icon: 'none'
					})
					return
				}
				remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				//附件
				let imgarr = []
				this.imgList.forEach(ele=>{
					imgarr.push(ele.id)
				})
				let params = {
					number,  //报价单编号
					customer_id,   //客户id
					contacts_id:contactList[contactIndex].id,   //客户联系人id
					quote_date,   //报价时间
					discount_amount,   //优惠金额
					quote_amount,    //报价金额
					product,
					flow_staff_ids:this.approvalPro.status == 0 ? arr.join(',') : '',
					//0 不审核 1审核
					is_check: is_check?1:0,
					file_ids:imgarr.join(','),
					clause,
					order_staff_id:this.staffObj.id,
				}
				console.log(params,'参数')
				callback(params)
			},
			//预览
			lookPDF() {
				if(this.isShowClause){
					this.editorCtx.getContents({
						success:(con)=>{
							let params = this.getParams(con,(params)=>{
								netPrevieQuotation(params).then(res=>{
									this.openFile({file:res.data.file,filename:res.data.filename,type:'file'})
								})
							})
						}
					})
				}else{
					let params = this.getParams({html:''},(params)=>{
						netPrevieQuotation(params).then(res=>{
							this.openFile({file:res.data.file,filename:res.data.filename,type:'file'})
						})
					})
				}
			},
			//确定 
			sureSubmit() {
				if(this.isShowClause){
					this.editorCtx.getContents({
						success:(con)=>{
							let params = this.getParams(con,(params)=>{
								netAddquotation(params).then(res=>{
									//清空缓存数据
									netSetStorage({type:'quote'}).then(res=>{})
									uni.showToast({
										title: res.msg,
										icon:'none',
										duration: 2000
									})
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},2000)
								})
							})
						}
					})
				}else{
					let params = this.getParams({html:''},(params)=>{
						netAddquotation(params).then(res=>{
							//清空缓存数据
							netSetStorage({type:'quote'}).then(res=>{})
							uni.showToast({
								title: res.msg,
								icon:'none',
								duration: 2000
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},2000)
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.defaultTab{
		background:#F7F7F7;
	}
	.activeTab{
		background:#fff;
	}
	.collapseitem{
		width:500rpx;
	}
	.collbox{
		padding:none;
		.van-collapse-item__wrapper{
			.van-collapse-item__content{
				width:100%;
				box-sizing: border-box;
			}
		}
		.van-cell__value{
			flex:none;
			font-size:28rpx;
			color:$uni-text-color;
			width:80rpx;
			font-weight: bold;
		}
	}
</style>
<style lang="scss" scoped>
	@import "@/pagesA/user/mailbox/editor/editor.css";
	.fllow_area {
		background-color: #fff;
		padding:15rpx 0;
		border-bottom:1rpx solid #f5f5f5;
		.area_head {
			line-height: 50rpx;
			text {
				color: #f00;
			}
		}
		textarea {
			width: 600rpx;
			height: 200rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 20rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
		.confbox{
			width:640rpx;
			margin:0 auto;
			border:1rpx solid #666;
			.confli{
				&:last-child{
					.confli_top{
						border-bottom:0;
					}
				}
				.confli_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom:1rpx solid #666;
					.conf_name{
						width:160rpx;
						height:60rpx;
						border-right:1rpx solid #666;
						font-size:24rpx;
						text-align: center;
						color:#333;
						display: flex;
						justify-content: center;
						align-items: center;
						&:last-child{
							border-right:0;
						}
						.conf_input{
							width:150rpx;
							height:60rpx;
							padding:0;
							margin:0;
							text-align: center;
							background:rgba(202, 202, 202, 0.2);
						}
					}
				}
				.confli_box{
					.cb_tit{
						font-size:24rpx;
						padding:15rpx;
					}
					.cb_text{
						width:600rpx;
						margin:0 auto;
						background:rgba(202, 202, 202, 0.2);
						height:100rpx;
						border-radius: 10rpx;
					}
				}
			}
			.addConfig{
				width:100%;
				padding:10rpx 0;
				font-size:30rpx;
				font-weight: bold;
				text-align: center;
			}
		}
	}
	.equi_warp{
		padding:24rpx 30rpx;
		.equi_list{
			box-shadow: 1rpx 1rpx 10rpx 2rpx rgba(0,0,0,0.1);
			border-radius: 10rpx;
			background:#fff;
			width:690rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding:24rpx;
			margin-bottom:24rpx;
			.icon-jian{
				font-size:45rpx;
				color:#ff7800;
			}
			.equi_name{
				width:300rpx;
				font-size:28rpx;
				color:#333;
			}
			.equi_add{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size:26rpx;
				.fileimg{
					width:28rpx;
					height:35rpx;
					margin-left:15rpx;
				}
			}
		}
	}
	.inp_cluse{
		padding:24rpx 0;
		
		.clusebox{
			.richbox{
				width:690rpx;
				box-sizing: border-box;
				margin:24rpx auto;
				border:1rpx solid #f5f5f5;
				padding:15rpx;
				.toolbar{
					height:100rpx;
				}
				.ql-container{
					width:100%;
					height:500rpx;
				}
			}
		}
	}
	.cluse_title{
		padding:0 30rpx;
		font-size:28rpx;
		color:#666;
		font-weight: bold;
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
			border: 1rpx solid #EAEAEA;
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
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color:#666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
			text-align: right;
			switch{
				transform: scale(0.7);
			}
			.icon-you{
				width:40rpx;
				height:42rpx;
			}
		}
	}
	.li_warp{
		background:#fff;
		margin-bottom:24rpx;
		border-bottom:1rpx solid #f5f5f5;
		.cell_con{
			padding:24rpx 40rpx;
			.contitle{
				font-size:28rpx;
				color:#333;
			}
			.context{
				font-size:26rpx;
				color:#666;
				margin-top:10rpx;
			}
			.conbot{
				margin-top:10rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.conmoney{
					font-size:26rpx;
					color:#333;
				}
				
			}
		}
		.right_del_btn{
			width:90rpx;
			height:218rpx;
			background:#F00;
			color:#fff;
			text-align: center;
			line-height: 218rpx;
		}
	}
	.inputbox{
		margin-top:24rpx;
		height:100rpx;
		width:100%;
		padding:24rpx 30rpx;
		box-sizing: border-box;
		border-top:1rpx solid #EDEDED;
		text-align: center;
		.dialoginput{
			font-size:24rpx;
			color:#333;
		}
	}
		.infowarp{
			width:100%;
			.inp_warp {
				padding:30rpx;
				background: #fff;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #EDEDED;
				.inp_title {
					font-size: 26rpx;
					color:#666;
				}
			
				.form_right {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					color: #999;
					min-width:450rpx;
					text-align: right;
					.rightinput{
						width:100%;
						text-align: right;
					}
				}
			}
		}
		.detail_title{
			font-size:30rpx;
			font-weight: bold;
			color:$uni-text-color;
			padding:0 24rpx 0 40rpx;
			margin:24rpx 0;
			text-align: center;
		}
		.mx_warp{
			width:690rpx;
			background:#fff;
			padding:20rpx 45rpx 20rpx 20rpx;
			border-radius: 10rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			margin:0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.mx_tit_h{
				font-size:34rpx;
				font-weight: bold;
				color:$uni-text-color;
				padding:0 24rpx;
				position: relative;
				&::after{
					content:'';
					width:10rpx;
					height:32rpx;
					border-radius: 8rpx;
					background:$uni-text-color;
					position: absolute;
					left:0;
					top:7rpx;
				}
			}
			.fileimg{
				width:28rpx;
				height:35rpx;
			}
		}
		.pro_warp{
			padding:24rpx;
			background:#fff;
			margin:24rpx 0;
			.pro_li{
				background:#fff;
				box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
				margin-bottom:24rpx;
				padding:15rpx;
				.pro_li_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom:24rpx;
					.pro_name{
						font-size:30rpx;
						color:#333333;
					}
					.deleimg{
						width:44rpx;
						height:44rpx;
						flex-shrink: 0;
					}
				}
				.pro_info{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.pro_info_left{
						.pro_info_text{
							font-size:28rpx;
							color:#999999;
							margin-bottom:15rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							&:last-child{
								margin-bottom:0;
							}
							.priceinput{
								width:180rpx;
								height:60rpx;
								background:rgba(202, 202, 202, 0.2);
								text-align: center;
							}
						}
					}
					.pro_info_img{
						width:140rpx;
						height:140rpx;
						border-radius: 20rpx;
						.proimg{
							width:140rpx;
							height:140rpx;
							border-radius: 20rpx;
						}
					}
				}
			}
		}
		.mx_list{
			padding:24rpx;
			margin-bottom:24rpx;
			background:#fff;
			.mx_li{
				padding-bottom:24rpx;
				border-bottom:1rpx solid #f5f5f5;
				margin-bottom:24rpx;
				&:last-child{
					border-bottom:0;
				}
				.mx_number{
					font-size:26rpx;
					color:#333;
					margin-bottom:15rpx;
				}
				.mx_text{
					font-size:26rpx;
					color:#666;
					margin-bottom:15rpx;
				}
			}
		}
	.mx_totalwarp{
		width:690rpx;
		box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
		padding:20rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#fff;
		margin:0 auto 24rpx;
		border-radius: 10rpx;
		.mx_totalmoney{
			font-size:30rpx;
			color:#333;
		}
		.mx_zhekou{
			font-size:30rpx;
			color:$uni-text-color;
		}
		
	}
	.quo_bottom{
		position: fixed;
		left:0;
		bottom:0;
		background:#fff;
		box-shadow: 1rpx 1rpx 5rpx 3rpx rgba(0,0,0,0.1);
		width:750rpx;
		height:calc(100rpx + env(safe-area-inset-bottom));
		padding:0 35rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.quobtn{
			width:400rpx;
			height:80rpx;
			border-radius: 40rpx;
			font-size:26rpx;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			background:$uni-text-color;
		}
		.quo_yulan{
			font-size:28rpx;
			color:$uni-text-color;
			font-weight: bold;
		}
	}
</style>
