<template>
	<view>
		<view class="newbox" v-if="!isEdit">
			<view class="newtitle">报价单信息</view>
			<view class="new_info">
				<view class="newli">
					<view class="newlabel">报价单编号:</view>
					<view class="newvalue">{{number}}</view>
				</view>
				<view class="newli">
					<view class="newlabel">报价单状态:</view>
					<view class="newvalue" style="color:#008EFF;" v-if="status == 0">待审核</view>
					<view class="newvalue" style="color:#008EFF;" v-if="status == 1">进行中</view>
					<view class="newvalue" style="color:#008EFF;" v-if="status == 2">已通过</view>
					<view class="newvalue" style="color:#008EFF;" v-if="status == 3">已拒绝</view>
					<view class="newvalue" style="color:#008EFF;" v-if="status == 9">已作废</view>
				</view>
				<view class="newli">
					<view class="newlabel">公司报价人:</view>
					<view class="newvalue">{{info.order_staff ? info.order_staff.name : ''}}</view>
				</view>
				<view class="newli">
					<view class="newlabel">客户:</view>
					<view class="newvalue">{{customerObj ? customerObj.name : ''}}</view>
				</view>
				<view class="newli">
					<view class="newlabel">客户联系人:</view>
					<view class="newvalue">{{contactList[contactIndex] ? contactList[contactIndex].name : ''}}</view>
				</view>
				<view class="newli">
					<view class="newlabel">报价时间:</view>
					<view class="newvalue">{{quote_date ? quote_date : ''}}</view>
				</view>
			</view>
		</view>
		<!-- 操作 -->
		<view class="newbox" v-if="info.is_examine == 1 && !isEdit">
			<view class="newtitle">操作</view>
			<view class="button_warp">
				<view class="btn jujue" @click="toExamine(2)">审核拒绝</view>
				<view class="btn tongyi" @click="toExamine(1)">审核通过</view>
			</view>
		</view>
		<!-- 更多操作  团队-->
		<more-pop 
			relation_type="quote" 
			:relation_id="id" 
			v-if="false" 
			:staffList="info.show_staff_data"
			:remindPeople="remindPeople"
			@delExamine="delExamine"
			@clearRemindlist="clearRemindlist"
		></more-pop>
		
		<!-- 相关附件 -->
		<view class="fileWarp" v-if="!isEdit && fileList.length != 0">
			<view class="newtitle">相关附件：</view>
			<view class="doc_item" v-for="(item,index) in fileList" :key="index">
				<image :src="BASE_IMG_URL+'/index/file-clip.png'" class="remarkimg"></image>
				<view class="doc_name" @click="toLookFile(item)">{{item.name}}</view>
				<image :src="BASE_IMG_URL+'/index/delete.png'" @click="delFile(item.id)" class="deleimg" ></image>
			</view>
		</view>
		<view class="tabwarp">
			<view class="infowarp" v-if="isEdit">
				<view class="inp_warp">
					<view class="inp_title key">报价单编号</view>
					<view class="form_right">
						<input type="text" v-model="number" disabled :class="number ? 'valueActive' : '' " placeholder="请输入报价单编号" class="rightinput">
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">客户</view>
					<view class="form_right" @click="toSelectCustomer">
						<view :class="customerObj ? 'valueActive' : '' ">
							{{customerObj ? customerObj.name : '点击选择'}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="inp_warp">
					<view class="inp_title key">客户联系人</view>
					<picker @change="changeLink" :range="contactList" :range-key="'name'" :value="contactIndex">
						<view class="form_right">
							<view :class="contactList[contactIndex] ? 'valueActive' : '' ">
								{{contactList[contactIndex] ? contactList[contactIndex].name : '点击选择'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
				<view class="inp_warp">
					<view  class="inp_title key">报价时间</view>
					<picker @change="changeTime" mode="date">
						<view class="form_right">
							<view :class="quote_date ? 'valueActive' : '' ">
								{{quote_date ? quote_date : '点击选择'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
			</view>
			<!-- 特约条款 -->
			<view class="newbox" v-if="info.clause || isEdit" :class="isEdit?'noShadow':''">
				<view class="newtitle">
					特约条款  
					<switch v-if="isEdit" :checked="isShowClause" style="transform: scale(0.7);" color="#008EFF" @change="isShowClause = !isShowClause" />
				</view>
				<view class="clusebox" v-if="isShowClause">
					<view class="richbox">
						<editor
							id="editor"  
							class="ql-container" 
							show-img-size 
							show-img-resize 
							show-img-toolbar 
							:read-only="!isEdit"
							:placeholder="placeholder"
							@ready="onEditorReady"
							@statuschange="onStatusChange"
						></editor>
					</view>
				</view>
			</view>
			<view class="newbox" v-if="!isEdit">
				<view class="newtitle">报价单明细</view>
				<view class="newmingxi">
					<view class="lxrtitle">
						<view class="lxrlabel">产品列表:</view>
					</view>
					<view class="lxrtitle">
						<uni-collapse v-model="activeNames" @change="changeCollapse" ref="collapse">
							<view class="pro_li_new" v-for="(item,index) in productList" :key="index">
								<uni-collapse-item title="配置" :name="index">
									<view slot="title">
										<view class="l_new_box">
											<image :src="item.img" class="l_proimg"></image>
											<view class="l_proinfo">
												<view class="l_name">{{item.name}}</view>
												<view class="l_text">报价：{{item.price}}</view>
												<view class="l_text">数量：{{item.number}}</view>
												<view class="l_text">报价小计：{{item.price * item.number}}</view>
											</view>
										</view>
									</view>
									<view>
										<view class="re_fir">
											<view class="fllow_area">
												<view class="area_head">配置说明:</view>
												<textarea v-model="item.config_desc" disabled :class="{'valueActive':item.config_desc}" placeholder="请填写备注"
													placeholder-style="color:#999" />
											</view>
											<view class="fllow_area">
												<view class="area_head">备注:</view>
												<textarea v-model="item.remarks" disabled :class="{'valueActive':item.remarks}" placeholder="请填写备注"
													placeholder-style="color:#999" />
											</view>
											<view class="fllow_area" v-if="item.product_config && item.product_config.length != 0">
												<view class="area_head">配置清单:</view>
												<view class="confbox">
													<view class="confli">
														<view class="confli_top">
															<view class="conf_name" style="width:200rpx">品名规格</view>
															<view class="conf_name" style="width:80rpx;">数量</view>
															<view class="conf_name" style="width:160rpx">规格</view>
															<view class="conf_name" style="width:150rpx">备注</view>
														</view>
													</view>
													<view class="confli" v-for="(proitem,proindex) in item.config" :key="proindex">
														<view v-if="!proitem.addObj">
															<view class="confli_top">
																<view class="conf_name" style="width:200rpx">{{proitem.name}}</view>
																<view class="conf_name" style="width:80rpx;">
																	<input type="digit" style="width:80rpx;" disabled placeholder="" v-model="proitem.num" class="conf_input">
																</view>
																<view class="conf_name" style="width:160rpx">{{proitem.unit}}</view>
																<view class="conf_name key" style="width:150rpx">
																	<span @click="toWriterRemark(item,proindex)">备注</span>
																</view>
															</view>
															<view class="confli_box" v-if="showRemark == item.id+'-'+proindex">
																<view class="cb_tit">备注</view>
																<textarea placeholder="填写备注" disabled v-model="proitem.remark" :class="{'valueActive':proitem.remark}" class="cb_text"></textarea>
															</view>
														</view>
														<view v-if="proitem.addObj">
															<view class="confli_top">
																<input type="text" disabled placeholder="品名规格" class="conf_name" style="width:200rpx" v-model="proitem.name">
																<view class="conf_name" style="width:80rpx;">
																	<input type="digit" disabled style="width:80rpx;" placeholder="数量" v-model="proitem.num" class="conf_input">
																</view>
																<input type="text" class="conf_name" placeholder="规格" v-model="proitem.unit">
																<view class="conf_name key" style="width:150rpx">
																	<span @click="toWriterRemark(item,proindex)">备注</span>
																</view>
															</view>
															<view class="confli_box" v-if="showRemark == item.id+'-'+proindex">
																<view class="cb_tit">备注</view>
																<textarea placeholder="填写备注" :disabled="!isEdit" v-model="proitem.remark" :class="{'valueActive':proitem.remark}" class="cb_text"></textarea>
															</view>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</uni-collapse-item>
							</view>
						</uni-collapse>
					</view>
					<view class="lxrtitle">
						<view class="lxrlabel">产品合计:</view>
						<view class="lxrvalue">{{quote_amount}}</view>
					</view>
					<view class="lxrtitle">
						<view class="lxrlabel">优惠金额:</view>
						<view class="lxrvalue">{{discount_amount}}</view>
					</view>
					<view class="lxrtitle">
						<view class="lxrlabel">报价凭证:</view>
						<view class="lxrvalue">
							<view class="imglist">
								<view class="imgbox" v-for="(item,index) in imgList" :key="index">
									<image :src="item.file_path" @click="toPriveImg(index)" class="selfimg"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="newbox" :class="isEdit?'noShadow':''" v-if="isEdit">
				<view class="newtitle">报价单明细</view>
				<!-- 产品列表 -->
				<view class="inp_warp" style="margin-top:0;">
					<view class="inp_title key">产品列表:<span>*</span></view>
					<image :src="BASE_IMG_URL+'/index/add.png'" @click="toSelectProduct" class="fileimg" style="width:35rpx;height:35rpx;"></image>
				</view>
				<view class="pro_warp">
					<uni-collapse v-model="activeNames" @change="changeCollapse" ref="collapse">
						<view class="pro_li" v-for="(item,index) in productList" :key="index">
							<uni-collapse-item title="配置" :name="index">
								<view slot="title" style="padding:15rpx 0;">
									<view class="pro_li_top" @tap.stop.prevent>
										<view class="pro_name">产品名称：{{item.name}}</view>
										<image :src="BASE_IMG_URL+'/index/delete.png'" v-if="isEdit" @tap.sotp="delProduct(index)" class="deleimg"></image>
									</view>
									<view class="pro_info">
										<view class="pro_info_left" @tap.stop.prevent>
											<view class="pro_info_text">报价：￥
												<input type="text" class="priceinput" v-model="item.price" :disabled="!isEdit" @blur="(e)=>{changeProductPrice(e,index)}" />
											</view>
											<view class="pro_info_text" @click.sotp.prevent>数量：
												<uni-number-box :min="1" :disabled="!isEdit" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
											</view>
											<!-- <view class="pro_info_text">规格：{{item.unit}}</view> -->
											<view class="pro_info_text">报价小计：{{item.price * item.number}}</view>
										</view>
										<view class="pro_info_img">
											<image :src="item.img" class="proimg" ></image>
										</view>
									</view>
								</view>
								<view>
									<view class="re_fir">
										<view class="fllow_area">
											<view class="area_head">配置说明:</view>
											<textarea v-model="item.config_desc" :disabled="!isEdit" :class="{'valueActive':item.config_desc}" placeholder="请填写备注"
												placeholder-style="color:#999" />
										</view>
										<view class="fllow_area">
											<view class="area_head">备注:</view>
											<textarea v-model="item.remarks" :disabled="!isEdit" :class="{'valueActive':item.remarks}" placeholder="请填写备注"
												placeholder-style="color:#999" />
										</view>
										<view class="fllow_area" v-if="item.product_config && item.product_config.length != 0">
											<view class="area_head">配置清单:</view>
											<view class="confbox">
												<view class="confli">
													<view class="confli_top">
														<view class="conf_name" style="width:200rpx">品名规格</view>
														<view class="conf_name" style="width:80rpx;">数量</view>
														<view class="conf_name" style="width:160rpx">规格</view>
														<view class="conf_name" style="width:150rpx">备注</view>
													</view>
												</view>
												<view class="confli" v-for="(proitem,proindex) in item.config" :key="proindex">
													<view v-if="!proitem.addObj">
														<view class="confli_top">
															<view class="conf_name" style="width:200rpx">{{proitem.name}}</view>
															<view class="conf_name" style="width:80rpx;">
																<input type="digit" style="width:80rpx;" :disabled="!isEdit" placeholder="" v-model="proitem.num" class="conf_input">
															</view>
															<view class="conf_name" style="width:160rpx">{{proitem.unit}}</view>
															<view class="conf_name key" style="width:150rpx" v-if="isEdit">
																<span @click="toWriterRemark(item,proindex)">备注</span>/
																<span @click="toDelConfig(index,proindex)">删除</span>
															</view>
															<view class="conf_name key" style="width:150rpx" v-else>
																<span @click="toWriterRemark(item,proindex)">备注</span>
															</view>
														</view>
														<view class="confli_box" v-if="showRemark == item.id+'-'+proindex">
															<view class="cb_tit">备注</view>
															<textarea placeholder="填写备注" :disabled="!isEdit" v-model="proitem.remark" :class="{'valueActive':proitem.remark}" class="cb_text"></textarea>
														</view>
													</view>
													<view v-if="proitem.addObj">
														<view class="confli_top">
															<input type="text" :disabled="!isEdit" placeholder="品名规格" class="conf_name" style="width:200rpx" v-model="proitem.name">
															<view class="conf_name" style="width:80rpx;">
																<input type="digit" :disabled="!isEdit" style="width:80rpx;" placeholder="数量" v-model="proitem.num" class="conf_input">
															</view>
															<input type="text" class="conf_name" placeholder="规格" v-model="proitem.unit">
															<view class="conf_name key" style="width:150rpx" v-if="isEdit">
																<span @click="toWriterRemark(item,proindex)">备注</span>/
																<span @click="toDelConfig(index,proindex)">删除</span>
															</view>
															<view class="conf_name key" style="width:150rpx" v-else>
																<span @click="toWriterRemark(item,proindex)">备注</span>
															</view>
														</view>
														<view class="confli_box" v-if="showRemark == item.id+'-'+proindex">
															<view class="cb_tit">备注</view>
															<textarea placeholder="填写备注" :disabled="!isEdit" v-model="proitem.remark" :class="{'valueActive':proitem.remark}" class="cb_text"></textarea>
														</view>
													</view>
												</view>
												<view class="addConfig" v-if="isEdit" @click="addProcuctConfig(index)">+</view>
											</view>
										</view>
									</view>
								</view>
							</uni-collapse-item>
						</view>
					</uni-collapse>
					<view class="noData" v-if="productList.length == 0">暂无更多</view>
				</view>
			</view>
			<view class="mx_totalwarp" v-if="isEdit">
				<view class="mx_totalmoney">产品合计: {{quote_amount}}</view>
				<view >
					<view class="mx_zhekou" @click="toInputdiscount">优惠金额({{discount_amount}})</view>
				</view>
			</view>
			<view class="inp_warp" style="margin-top:24rpx;" v-if="isEdit">
				<view class="inp_title">是否需要审核</view>
				<view class="form_right">
					<switch :checked="is_check" :disabled="!isEdit" color="#008EFF" @change="changeSwitch" />
				</view>
			</view>
			<!-- 审核信息 -->
			<examine-people v-if="is_check" :list="remindPeople" @delItem="delItem"></examine-people>
			<!-- 报价凭证 -->
			<upload-img v-if="isEdit" :flag="false" :imgList="imgList" title="报价凭证" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
			<!-- 本次修改备注 -->
			<view class="fllow_area" style="padding:30rpx" v-if="isEdit && editType == 1">
				<view class="fllo_list">
					<view class="area_head key" style="padding:10rpx 0">修改备注:<span>*</span></view>
				</view>
				<textarea v-model="edit_reason" :class="edit_reason ? 'valueActive' : '' " placeholder="请填写本次修改备注"
					placeholder-style="color:#999" />
			</view>
			<view class="newbox" v-if="!isEdit">
				<view class="newtitle">
					<view>操作记录</view>
				</view>
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
			
			<!-- 审批流程 -->
			<view class="newbox" v-if="!isEdit">
				<view class="newtitle">
					<view>审批流程</view>
				</view>
				<approval-status :process="payment_approval"></approval-status>
			</view>
			
		</view>
		
		
		<view style="height:calc(100rpx + env(safe-area-inset-bottom))"></view>
		<view class="quo_bottom" v-if="isEdit">
			<view class="button" @click="$noMultipleClicks(sureSubmit)">确定</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="quo_yulan" @click="lookPDF">预览</view>
			<!-- #endif -->
			<view class="quo_yulan" @click="isEdit = false">取消</view>
		</view>
		<view class="newbot" @click="moreOpera" v-if="!isEdit && info && info.status != 9">
			<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="moreimg"></image>
			更多
		</view>
		<more-operation
			ref="operationChild"
			:info="info"
			:status="status"
			@toCallP="toCall"
			@toEditquoteP="toEditquote"
			@toTurntoP="toTurnto"
			@downFileP="downFile"
			@toVoidP="toVoid"
			@toAddFileP="toAddFile"
		></more-operation>
		
		<!-- 添加产品 -->
		<popup-list ref="productChild" @selectList="selectList"></popup-list>
		<!-- 选择产品分类 -->
		<popup-type ref="productType" @selectType="selectType"></popup-type>
		<!-- 填写优惠金额 -->
		<uni-popup ref="inputDialog" type="dialog" @touchmove.stop.prevent>
			<uni-popup-dialog ref="inputClose"  mode="input" title="优惠金额" :value="discount_amount"
				placeholder="请输入优惠金额" @confirm="sureDiscount"></uni-popup-dialog>
		</uni-popup>
		<!-- 下载报价单 -->
		<uni-popup ref="downPopup" type="bottom" background-color="#fff">
			<view class="acbox">
				<view class="acli" @click="onSelect('word')">word</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netQuotationDetail, netLianxiren,  netApprovalDetail,
	netEditQuotation, netTovoidQuotation, netCreateContract, netQuotaFile, netPrevieQuotation, 
	netAddquotation, netQuoteAddFile, netQuoteFileList, netQuoteDelFile, netOfferAutoNumber, netSpecialTerm } from '@/api/api.js'
	import { netOperationRecord } from '@/api/template.js'
	import popupType from '@/components/selectProductType/index'
	import popupList from '@/components/selectProduct/index'
	import { BASE_IMG_URL, BASE_URL, SIGN_NO } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import moreOperation from './more-operation.vue'
	
	export default{
		mixins:[commonFun],
		components:{
			popupList,
			popupType,
			moreOperation
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj
		}),
		watch:{
			customerObj(obj,oldvalue){
				console.log(obj,'-----',oldvalue)
				if(obj){
					this.customer_id = obj.id
					//获取 客户联系人
					this.getCustomerLink()
				}else{
					
				}
			}
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				number:'',  //报价单编号
				customer_id:'',   //客户id
				contacts_id:'',   //客户联系人id
				contacts_mobile:'',  //客户联系人 电话
				quote_date:'',   //报价时间
				product_ids:'',   //产品id列表
				discount_amount:'',   //优惠金额
				quote_amount:0,    //报价金额
				contactList:[],   //联系人列表
				contactIndex:null,
				imgList:[],
				id:'',
				status:0,   //0 1进行中 待审核  2已通过  3已拒绝    9作废
				remindPeople:[],
				examineType:'',
				is_check:false,
				info:{},  //报价单 信息
				type:null,    //1我发起的    2我审核的
				//特约条款编辑器
				editorCtx:'',
				isEdit:false,
				placeholder: '开始输入...',
				activeNames:[],
				showType:false,
				productList:[],   //产品列表
				showRemark:'',
				showMore:false,
				//审批流程
				payment_approval:[],
				editType:1,   //1编辑   2复制
				//更多操作
				fileList:[],   //附件列表
				edit_reason:'',   //每次修改得备注
				operationList:[],   //操作记录
				//是否显示特约条款
				isShowClause:true,
			}
		},
		
		onLoad(options) {
			this.id = options.id
			if(options.type) {
				this.type = options.type
			}
			uni.removeStorageSync('quoteAddFollow')
			this.getDetail()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
			if(uni.getStorageSync('quoteAddFollow')){
				this.getDetail()
			}
			//获取相关附件
			this.getFileList()
			//操作记录
			this.getOperation()
			//审批流程详情
			this.getApprovalList()
		},
		onHide() {
		},
		methods:{
			getApprovalList() {
				let params = {
					type: 'quote',
					relation_id: this.id
				}
				netApprovalDetail(params).then(res=>{
					this.payment_approval = res.data
				})
			},
			//更多操作
			moreOpera() {
				this.$refs.operationChild.open()
			},
			getOperation() {
				let params = {
					relation_type: 7,
					relation_id: this.id
				}
				netOperationRecord(params).then(res=>{
					this.operationList = res.data
				})
			},
			/////////////////////////////////////////////
			//下载报价单
			downFile() {
				this.$refs.downPopup.open()
			},
			onSelect(type) {
				this.$refs.downPopup.close()
				let params = {
					id:this.id,
					type
				}
				netQuotaFile(params).then(res=>{
					this.openFile({file:res.data.file,filename:res.data.filename,type:'file'})
				})
			},
			/////////////////////////////////////////////
			//编辑报价单
			toEditquote(type) {
				this.editType = type
				this.isEdit = true
				this.examineType = 'quote'
				
				if(this.editType == 2){
					//编辑报价单的时候  报价单单号 重新获取
					this.number = ''
					//获取 报价单编号
					this.getNumber()
				}
			},
			getNumber() {
				netOfferAutoNumber().then(res=>{
					this.number = res.data.number
				})
			},
			//传阅
			toCirculate() {
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.id+'&type=quote'
				})
			},
			changeSwitch(e) {
				console.log(e,'------')
				this.is_check = e.detail.value
				if(this.is_check){
					this.examineType = 'quote'
					this.getDefaultRemind()
				}
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			/////////////////////////////////////////////////////////////////////////////////////////
			//编辑器
			onEditorReady(e) {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					if(this.info && this.info.clause){
						this.editorCtx.setContents({
							html:this.info.clause
						})
					}else{
						if(this.isEdit){
							this.getTiaokuan()
						}
					}
				}).exec()
			},
			//获取默认的特约条款
			getTiaokuan() {
				netSpecialTerm().then(res=>{
					this.editorCtx.setContents({
						html:res.data
					})
				})
			},
			onStatusChange(e) {
				this.formats = e.detail;
			},
			////////////////////////////////////////////////////////////////////////////////////////
			//配置备注
			toWriterRemark(item,index) {
				let str = item.id+'-'+index
				this.showRemark = str == this.showRemark ? '' : str
			},
			//展开产品编辑 配置
			changeCollapse(e) {
				this.activeNames = e
				this.init()
			},
			//修改产品价格
			changeProductPrice(e,index) {
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
				obj.config.push({name:'',num:'',unit:'',remark:'',addObj:true})
				this.$set(this.productList,index,obj)
			},
			//删除产品配置
			toDelConfig(index,conindex) {
				let obj = this.productList[index]
				obj.config.splice(conindex,1)
				this.$set(this.productList,index,obj)
			},
			///////////////////////////////////////////////////////////////////////////////////////
			toExamine(status) {
				uni.navigateTo({
					url:'/pages/template/examine?status='+status+'&id='+this.info.id+'&type=quote'
				})
			},
			getDetail() {
				netQuotationDetail({id:this.id}).then(res=>{
					res = res.data
					this.info = res
					this.number = res.number
					// this.customerObj = res.customer
					this.$store.commit('CUSTOMEROBJ',res.customer)
					this.quote_date = res.quote_date
					// this.productList = res.product
					//处理 产品信息
					this.handleProduct(res.product)
					this.discount_amount = res.discount_amount
					this.customer_id = res.customer.id
					this.contacts_id = res.contacts.id
					this.contacts_mobile = res.contacts.mobile
					this.status = res.check_status
					this.isShowClause = res.clause ? true : false
					let arr = res.files
					arr.forEach(ele=>{
						ele.url = ele.file_path
					})
					this.imgList = arr
					//特约条款
					if(this.editorCtx){
						this.editorCtx.setContents({
							html:res.clause
						})
					}
					//获取 客户联系人
					this.getCustomerLink()
					//计算总价
					this.handleTotalMoney()
				})
			},
			handleProduct(data) {
				let arr = []
				data.forEach(ele=>{
					arr.push({
						id: ele.product_id,
						name: ele.name,
						num: ele.num,
						number: ele.number,
						price: ele.price,
						quote_id: ele.quote_id,
						unit: ele.unit,
						img: ele.img,
						remarks: ele.remarks,
						config_desc: ele.config_desc,
						config: ele.config
					})
				})
				this.productList = arr
			},
			//获取联系人
			getCustomerLink() {
				let params = {
					customer_id: this.customer_id
				}
				netLianxiren(params).then(res=>{
					res = res.data
					res.forEach((ele,index)=>{
						if(this.contacts_id == ele.id){
							this.contactIndex = index
						}
					})
					this.contactList = res
				})
			},
			changeLink(e) {
				this.contactIndex = e.detail.value
				this.contacts_id = this.contactList[this.contactIndex].id
			},
			//报价时间
			changeTime(e) {
				this.quote_date = e.detail.value
			},
			/**产品 信息*/
			toSelectProduct(item) {
				this.$refs.productChild.init(item.id)
			},
			selectList(arr) {
				arr.forEach(ele=>{
					ele.remarks = ''
					ele.config_desc = ''
				})
				this.productList = this.deWeight(arr.concat(this.productList),true)
				this.handleTotalMoney()
			},
			deWeight(arr,flag) {
			    for (var i = 0; i < arr.length - 1; i++) {
			        for (var j = i + 1; j < arr.length; j++) {
			            if (arr[i].id == arr[j].id) {
							if(flag){
								arr[i].number += arr[j].number
							}
			                arr.splice(j, 1);
			                j--;
			            }
			        }
			    }
			    return arr;
			},
			delProduct(index) {
				this.productList.splice(index,1)
				this.handleTotalMoney()
			},
			handleTotalMoney() {
				let arr = this.productList
				let money = 0
				arr.forEach(ele=>{
					money += ele.number*Number(ele.price)
				})
				if(money <= 0) {
					this.quote_amount = 0
				}else{
					this.quote_amount = money - Number(this.discount_amount)
				}
			},
			//去优惠
			toInputdiscount() {
				if(this.productList.length == 0) {
					uni.showToast({
						title:'请先选择产品',
						icon:'none'
					})
					return
				}
				this.$refs.inputDialog.open()
			},
			sureDiscount(value) {
				this.discount_amount = value
				if(this.quote_amount < this.discount_amount){
					uni.showToast({
						title:'优惠金额不能大于产品金额',
						icon:'none'
					})
					this.discount_amount = 0
				}
				this.$refs.inputDialog.close()
				this.handleTotalMoney()
			},
			//拨打电话
			toCall() {
				uni.showModal({
					title:'拨打电话',
					content: '是否拨打'+this.contacts_mobile+'?',
					success:(res)=>{
						if(res.confirm){
							// #ifdef MP-ALIPAY
							dd.showCallMenu({
								phoneNumber: this.contacts_mobile,
								code: '+86',
								showDingCall: true
							})
							// #endif
							// #ifndef MP-ALIPAY || APP-PLUS
							uni.makePhoneCall({
								phoneNumber: this.contacts_mobile
							})
							// #endif
							// #ifdef APP-PLUS
							plus.device.dial(this.contacts_mobile, true);
							// #endif
							
						}
					}
				})
			},
			//转为合同 
			toTurnto() {
				this.isTurnto = true
				uni.setStorageSync('quoteAddFollow',true)
				uni.navigateTo({
					url:'/pagesA/customerInfo/order/createOrder?customerid='+this.customer_id+'&type=2'+'&quoteid='+this.id
				})
			},
			//查看图片
			toPriveImg(index) {
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.file_path)
				})
				uni.previewImage({
					urls: arr,
					current:index
				})
			},
			handleParams(res,callback) {
				let clause = res.html
				let {
					number,  //报价单编号
					customer_id,   //客户id
					contacts_id,   //客户联系人id
					quote_date,   //报价时间
					discount_amount,   //优惠金额
					quote_amount,    //报价金额
					productList
				} = this
				
				if(!contacts_id){
					uni.showToast({
						title:'请选择客户联系人',
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
				if(!clause && this.isShowClause){
					uni.showToast({
						title:'请补充特约条款',
						icon:'none'
					})
					return
				}
				if(productList.length == 0){
					uni.showToast({
						title:'请选择产品',
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
						remarks: ele.remarks,
						config_desc: ele.config_desc,
						config: ele.config
					})
				})
				if(this.is_check && this.remindPeople.length == 0) {
					uni.showToast({
						title:'请选择审核人',
						icon:'none'
					})
					return
				}
				///////提醒人
				let arr = []
				this.remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				let imgarr = []
				this.imgList.forEach(ele=>{
					imgarr.push(ele.id)
				})
				let params = {
					number,  //报价单编号
					customer_id,   //客户id
					contacts_id,   //客户联系人id
					quote_date,   //报价时间
					discount_amount,   //优惠金额
					quote_amount,    //报价金额
					product,
					clause,
					file_ids:imgarr.join(','),
					flow_staff_ids:arr.join(','),
					//0 不审核 1审核
					is_check: this.is_check?1:0,
					order_staff_id:this.info.order_staff_id,
				}
				callback(params)
			},
			//预览
			lookPDF() {
				if(this.isShowClause){
					this.editorCtx.getContents({
						success:(res)=>{
							let result = this.handleParams(res,(params)=>{
								netPrevieQuotation(params).then(res=>{
									this.openFile({file:res.data.file,filename:res.data.filename,type:'file'})
								})
							})
						}
					})
				}else{
					let result = this.handleParams({html:''},(params)=>{
						netPrevieQuotation(params).then(res=>{
							this.openFile({file:res.data.file,filename:res.data.filename,type:'file'})
						})
					})
				}
			},
			//获取附件列表
			getFileList() {
				netQuoteFileList({quote_id:this.id}).then(res=>{
					this.fileList = res.data
				})
			},
			//删除附件
			delFile(id) {
				uni.showModal({
					title:'提示',
					content:'请确认是否删除附件?',
					success:(conres)=>{
						if(conres.confirm){
							netQuoteDelFile({id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									//获取附件列表
									this.getFileList()
								},2000)
							})
						}
					}
				})
			},
			//查看附件
			toLookFile(item) {
				this.openFile({file:item.file_path,filename:item.name,type:item.types})
			},
			//上传附件
			toAddFile() {
				let fileUrl = this.toUploadFile((res)=>{
					let params = {
						quote_id:this.id,
						files:res.id
					}
					netQuoteAddFile(params).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							//获取附件列表
							this.getFileList()
						},2000)
					})
				})
			},
			//确定
			sureSubmit() {
				this.editorCtx.getContents({
					success:(res)=>{
						if(this.isShowClause){
							this.sureNext(res)
						}else{
							this.sureNext({html:''})
						}
					}
				})
			},
			sureNext(res) {
				let result = this.handleParams(res,(params)=>{
					if(this.editType == 1) {
						if(!this.edit_reason){
							uni.showToast({
								title:'请填写本次修改备注',
								icon:'none'
							})
							return
						}
						params.id = this.id
						params.edit_reason = this.edit_reason
						netEditQuotation(params).then(res=>{
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
					}else if(this.editType == 2) {
						netAddquotation(params).then(res=>{
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
					}
				})
			},
			toVoid(){
				uni.showModal({
					title:'提示',
					content:'请确认是否作废?',
					success:(res)=>{
						if(res.confirm){
							netTovoidQuotation({id:this.id}).then(res=>{
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
						}
					}
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import "@/pagesA/user/mailbox/editor/editor.css";
	.newmingxi{
		padding-left:70rpx;
		padding-right:24rpx;
		.lxrtitle{
			display: flex;
			justify-content: flex-start;
			margin-bottom:15rpx;
			.lxrlabel{
				font-size:26rpx;
				color:#999999;
				margin-right:15rpx;
			}
			.lxrvalue{
				font-size:26rpx;
				color:#666666;
			}
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
	.newbox{
		padding:24rpx 30rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		.newtitle{
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: #666;
			padding-left:30rpx;
			position: relative;
			margin-bottom:24rpx;
			&::before{
				content:'';
				position:absolute;
				left:0rpx;
				width:10rpx;
				height:25rpx;
				border-radius: 5rpx;
				background: $uni-btn-bg-color;
			}
		}
		.new_info{
			padding-left:50rpx;
			.newli{
				display: flex;
				justify-content: flex-start;
				margin-bottom:15rpx;
				.newlabel{
					font-size:26rpx;
					color:#999999;
					margin-right:15rpx;
				}
				.newvalue{
					font-size:26rpx;
					color:#999999;
				}
			}
		}
	}
	//特约条款
	.newbox{
		.clusebox{
			.richbox{
				width:690rpx;
				box-sizing: border-box;
				margin:24rpx auto;
				border:1rpx solid #f5f5f5;
				padding:15rpx;
				.toolbar{
					height:300rpx;
				}
				.ql-container{
					width:100%;
					height:500rpx;
				}
			}
		}
	}
	//附件列表
	.fileWarp{
		padding:24rpx 30rpx;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		margin-bottom:24rpx;
		.newtitle{
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: #666;
			padding-left:30rpx;
			position: relative;
			margin-bottom:24rpx;
			&::before{
				content:'';
				position:absolute;
				left:0rpx;
				width:10rpx;
				height:25rpx;
				border-radius: 5rpx;
				background: $uni-btn-bg-color;
			}
		}
		.doc_item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:15rpx 24rpx;
			background:#F6F6F6;
			width:500rpx;
			margin:0 auto 24rpx;
			.remarkimg{
				width:31rpx;
				height:33rpx;
				margin-right:15rpx;
			}
			.deleimg{
				width:44rpx;
				height:44rpx;
			}
			.doc_name{
				width:300rpx;
				word-wrap: break-word;
				word-break: break-all;
				font-size:24rpx;
				color:#333;
			}
		}
	}
	// 跟多操作
	.more_opera{
		padding:70rpx 40rpx;
		width:750rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.morebtn{
			text-align: center;
			color:#666;
			margin-right:60rpx;
			.botimg{
				width:40rpx;
				height:40rpx;
			}
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
			color:#007AFF;
			font-weight: bold;
			flex-shrink: 0;
		}
	}
	.addConfig{
		width:100%;
		padding:10rpx 0;
		font-size:30rpx;
		font-weight: bold;
		text-align: center;
	}
	.fllow_area {
		background-color: #fff;
		border-bottom:1rpx solid #f5f5f5;
		.area_head {
			line-height: 50rpx;
			font-size:26rpx;
		}
		.textarea{
			width: 585rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 10rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
		textarea {
			width: 585rpx;
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
			width:585rpx;
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
					padding-bottom:15rpx;
					.cb_tit{
						font-size:24rpx;
						padding:15rpx;
					}
					.cb_text{
						width:580rpx;
						margin:0 auto;
						background:rgba(202, 202, 202, 0.2);
						height:100rpx;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
	.equi_warp{
		padding:24rpx 30rpx;
		.equi_list{
			box-shadow: 1rpx 1rpx 10rpx 2rpx rgba(0,0,0,0.1);
			border-radius: 10rpx;
			background:#fff;
			display: flex;
			justify-content: space-between;
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
					width:35rpx;
					height:35rpx;
					margin-left:15rpx;
				}
			}
		}
	}
	.cluse_title{
		padding:0 50rpx;
		font-size:28rpx;
		color:#333;
		font-weight: bold;
	}
	
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.imgbox {
			width: 110rpx;
			height: 110rpx;
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
				width: 110rpx;
				height: 110rpx;
			}
		}
	}
	.inp_warp {
		padding:24rpx 30rpx;
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
			color: #999;
			min-width:450rpx;
			text-align: right;
			switch{
				transform: scale(0.7);
			}
			.iconfont{
				text-align: center;
				line-height: 60rpx;
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
				padding:24rpx 30rpx;
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
					color: #999;
					min-width:450rpx;
					text-align: right;
					image {
						width: 40rpx;
						height: 40rpx;
						margin: 28rpx 5rpx 0 0;
					}
					.iconfont{
						text-align: center;
						line-height: 60rpx;
					}
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
			color:#FE9440;
			padding:0 24rpx 0 40rpx;
			margin:24rpx 0;
			text-align: center;
		}
		.pro_warp{
			padding:24rpx;
			background:#fff;
			margin:24rpx 0;
		}
		.pro_li_new{
			.l_new_box{
				padding:15rpx 0;
				display: flex;
				justify-content: flex-start;
			}
			.l_proimg{
				width:188rpx;
				height:188rpx;
				border-radius: 10rpx;
				margin-right:15rpx;
			}
			.l_proinfo{
				.l_name{
					font-size:26rpx;
					color:#666666;
				}
				.l_text{
					margin-top:10rpx;
					font-size:24rpx;
					color:#999999;
				}
			}
		}
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
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
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
		padding:0 30rpx;
		height:calc(100rpx + env(safe-area-inset-bottom));
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 9;
		.button{
			width:460rpx;
			margin:0;
		}
		.quo_yulan{
			margin-left:24rpx;
			font-size:28rpx;
			color:$uni-text-color;
			font-weight: bold;
		}
	}
	.noShadow{
		box-shadow: none;
	}
</style>
