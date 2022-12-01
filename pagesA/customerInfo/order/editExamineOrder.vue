<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title">合同编号</view>
			<view class="form_right">
				<input type="text" disabled v-model="num" disabled placeholder="请输入订单编号" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">客户名称</view>
			<view class="form_right" >
				<view :class="customerinfo ? 'valueActive' : '' ">{{customerinfo ? customerinfo.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">客户签约人</view>
			<picker @change="changeContact" disabled :range="contactList" :value="contactIndex" :range-key="'name'">
				<view class="form_right">
					<view :class="contactList[contactIndex] ? 'valueActive' : '' ">
						{{contactList[contactIndex] ? contactList[contactIndex].name : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">签定地点</view>
			<picker @change="changeAddress" disabled mode="region">
				<view class="form_right">
					<view :class="signed_at ? 'valueActive' : '' ">
						{{signed_at ? signed_at : '点击选择签定地点'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">下单时间</view>
			<select-time-picker
				fields="day" 
				:start="nowTimeDate"
				placeholder="下单时间" 
				:defaultValue="order_date"
				disabled
			></select-time-picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">合同开始时间</view>
			<select-time-picker
				fields="day" 
				disabled
				placeholder="合同开始时间" 
				:defaultValue="start_time"
				@change="changeStarttime"
			></select-time-picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">合同结束时间</view>
			<select-time-picker
				fields="day" 
				disabled
				:start="limit_time"
				placeholder="合同结束时间" 
				:defaultValue="end_time"
				v-if="limit_time"
				@change="changeEndtime"
			></select-time-picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title">产品列表</view>
		</view>
		<view class="pro_warp" v-if="productList.length != 0">
			<view class="li_warp" v-for="(item,index) in productList" :key="index">
				<view class="cell_con">
					<view class="cell_con_top">
						<view class="contitle">{{item.product.name}}</view>
						<view style="color:#007AFF" v-if="item.is_delete" @click="delProduct(index)">取消删除</view>
						<image v-else :src="BASE_IMG_URL+'/customer/delete.png'" @click="delProduct(index)" class="deleimg"></image>
					</view>
					<view class="context">编号: {{item.number?item.number:'暂无'}}</view>
					<view class="context">编码：{{item.product.num}}</view>
					<view class="context">单位：{{item.product.unit}}</view>
					<view class="conbot">
						<view class="conmoney">￥{{item.product.price}}</view>
					</view>
				</view>
			</view>
			<view class="total_money">
				合计：<span>￥{{total_price}}</span>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="remarks" disabled :class="remarks ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key">优惠金额</view>
			<view class="form_right">
				<input type="text"  v-model="discount_rate" @blur="changeDiscountmoney" placeholder="请填写优惠金额" class="rightinput" :class="discount_rate ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">订单金额</view>
			<view class="form_right">
				<input type="text"  disabled v-model="money" placeholder="请填写订单金额" class="rightinput" :class="money ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">保修时长</view>
			<view class="form_right">
				<input type="text" disabled v-model="guarantee" placeholder="请填写保修时长" class="rightinput" :class="guarantee ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">支付方式</view>
			<picker @change="changePaytype" disabled :range="payTypelist" :value="payTypeIndex">
				<view class="form_right">
					<view :class="payTypelist[payTypeIndex] ? 'valueActive' : '' ">
						{{payTypelist[payTypeIndex] ? payTypelist[payTypeIndex] : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">收款账号</view>
			<picker @change="changeAccount" disabled :range="accountList" :value="accountIndex" :range-key="'account'">
				<view class="form_right">
					<view :class="accountList[accountIndex] ? 'valueActive' : '' ">
						{{accountList[accountIndex] ? accountList[accountIndex].account : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="fllow_area">
			<view class="area_head key">交货时间:</view>
			<view class="area_text">
				<view>合同生效后，</view>
				<input type="text" disabled :class="{'valueActive':delivery_time}" v-model="delivery_time" placeholder="请填写">
				<view>免费将货物及其配件、随机工具送达乙方指定地点，</view>
				<view>（注：不含物流时间）</view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head key">安装调试:</view>
			<textarea v-model="be_overdue" disabled :class="be_overdue ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_area">
			<view class="area_head key">合同生效:</view>
			<view class="area_text">
				<view>本合同自甲方收到乙方盖章回签合同后，</view>
				<view>并收到</view>
				<input type="text" disabled :class="effective ? 'valueActive' : '' " v-model="effective" placeholder="请填写">
				<view>货款到甲方指定帐号之日起生效。</view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head key">本次修改原因:</view>
			<textarea v-model="edit_reason" :class="edit_reason ? 'valueActive' : '' " placeholder="请填写本次修改原因"
				placeholder-style="color:#999" />
		</view>
		<form-item v-if="listForm" :listForm="listForm" @changeData="changeOtherData"></form-item>
		
		<!-- 审核信息 -->
		<examine-people :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(createOrder)">提交</view>
		<view class="botsec"></view>
		<!-- 添加产品 -->
		<popup-list ref="productChild" @selectList="selectList"></popup-list>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem'
	import popupList from '@/components/selectProduct/index'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { checkStartEnd } from '@/utils/util.js'
	import { getNewDateArry } from '@/utils/dateTimePicker.js'
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	import { netSetForm, netPrevCustomer, netLianxiren, netContractpassDetail, netContractPassSubmitedit, netAccountList } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		components:{
			formItem,
			popupList,
			selectTimePicker
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				remindPeople:[],
				examineType:'contract',
				imgList:[],
				listForm:null,
				customer_id:'',   //客户id
				contactList:[],  //客户签约人
				contactIndex:0,
				productList:[],
				total_price:0,   //总金额
				discount_rate:'',  //优惠金额
				money:0,   //优惠之后的  金额
				num:'',   //订单编号
				remarks:'',
				
				start_time:'',   //合同开始时间
				limit_time:'',   //合同结束的限制时间
				end_time:'',   //合同结束时间
				order_date:'',   //下单时间
				signed_at:'',   //签定地址
				guarantee:'一年',   //免费保修期限
				delivery_time:'5',   //交货时间
				be_overdue:'安装调试后，乙方必须在1个工作日内付清货款；逾期付款按合同总价的0.5%/天向甲方支付违约金。',   //逾期付款
				effective:'定金',   //生效方式
				remark:'',   //备注
				//当前时间
				nowTimeDate:'',
				//乙方信息
				handler:'',   //经办人
				legal:'',   //法定代表人
				entrust:'',   //委托代理人
				mobile:'',   //电话
				fax:'',   //传真
				account:'',   //帐号
				deposit:'',   //开户行
				//支付方式
				payment:'',   //支付方式
				payTypelist:['全款发货','五五','三六一','三七'],
				payTypeIndex:0,
				edit_reason:'',   //本次修改原因
				//账号
				accountList:[],
				accountIndex:0,
				
				contract_id:'',   //合同 id
				info:null,
			}
		},
		onLoad(options) {
			this.contract_id = options.contractid
			this.listForm = null
			//收款帐号
			this.getAcc()
			//获取 合同 详情
			this.getDetail()
			//当前时间
			let arr = getNewDateArry()
			this.nowTimeDate = `${arr[0]}-${arr[1]}-${arr[2]}`
			
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
		}),
		watch:{
			customerinfo(info){
				this.customer_id = info.id
				this.getLianxiren()
			}
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
		},
		methods:{
			changeOtherData(name,value,obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			//获取 表单
			getForm() {
				netSetForm({type:'contract'}).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
				})
			},
			getDetail() {
				netContractpassDetail({id:this.contract_id}).then(res=>{
					res = res.data
					this.info = res
					this.num = res.num
					this.customer_id = res.customer.id
					//获取默认的客户
					this.getDefaultCustomer()
					this.remarks = res.remarks
					this.discount_rate = res.discount_rate
					this.money = res.money
					this.order_date = res.order_date
					this.start_time = res.start_time
					this.limit_time = res.start_time
					this.end_time = res.end_time
					this.signed_at = res.signed_at
					this.guarantee = res.guarantee
					this.payment = res.payment
					this.delivery_time = res.delivery_time
					this.be_overdue = res.be_overdue
					this.effective = res.effective
					//处理收款 帐号
					this.handleAccount(res.collection_account)
					//处理 产品信息
					this.handleProduct(res.customer_product)
					//计算价格
					this.handleTotalMoney()
					//表单
					this.getForm()
					
				})
			},
			handleProduct(data) {
				let arr = []
				data.forEach(ele=>{
					arr.push({
						id: ele.id,
						number:ele.number,
						product:ele.product,
						is_delete:false
					})
				})
				this.productList = arr
			},
			getDefaultCustomer () {
				netPrevCustomer({id:this.customer_id}).then(res=>{
					this.customerlist = res.data.data
					this.$store.commit('CUSTOMEROBJ',res.data.data[0])
					// this.getLianxiren()
				})
			},
			//获取客户 签约 人
			getLianxiren() {
				let params = {
					customer_id: this.customer_id
				}
				netLianxiren(params).then(res=>{
					if(res.data.length == 0) {
						uni.showToast({
							title:'请先添加联系人',
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
						return
					}
					this.contactList = res.data
				})
			},
			//收款帐号
			getAcc() {
				netAccountList().then(res=>{
					this.accountList = res.data
				})
			},
			handleAccount(data) {
				this.accountList.forEach((ele,index)=>{
					if(ele.acount == data) {
						this.accountIndex = index
					}
				})
			},
			//签定地点
			changeAddress(e) {
				let arr = e.detail.value
				this.signed_at = `${arr[0]}${arr[1]}${arr[2]}`
			},
			//合同开始时间
			changeStarttime(dt) {
				let Y = dt.YYYY
				let M = dt.M
				let D = dt.D
				this.start_time = `${Y}-${M}-${D}`
				this.limit_time = ''
				this.end_time = ''
				setTimeout(()=>{
					this.limit_time = `${Y}-${M}-${D}`
				},200)
			},
			//合同结束时间
			changeEndtime(dt) {
				let Y = dt.YYYY
				let M = dt.M
				let D = dt.D
				this.end_time = `${Y}-${M}-${D}`
			},
			//支付方式
			changePaytype(e) {
				this.payTypeIndex = e.detail.value
			},
			//收款账号
			changeAccount(e) {
				this.accountIndex = e.detail.value
			},
			//客户签约人
			changeContact(e) {
				this.contactIndex = e.detail.value
			},
			//选择客户
			toSelectCustomer(){
				uni.navigateTo({
					url:'/pages/template/relation_customer'
				})
			},
			//添加产品
			addPart() {
				this.$refs.productChild.init()
			},
			//选择产品
			selectList(arr) {
				this.productList = this.deWeight(this.productList.concat(arr))
				this.handleTotalMoney()
			},
			deWeight(arr) {
			    for (var i = 0; i < arr.length - 1; i++) {
			        for (var j = i + 1; j < arr.length; j++) {
			            if (arr[i].id == arr[j].id) {
			                arr.splice(j, 1);
			                j--;
			            }
			        }
			    }
			    return arr;
			},
			handleTotalMoney() {
				let arr = this.productList
				let money = 0
				arr.forEach(ele=>{
					if(!ele.is_delete){
						money += Number(ele.product.price)
					}
				})
				this.total_price = money
				if(this.discount_rate > 0){
					this.money = Number(this.total_price) - this.discount_rate
				}else{
					this.money = this.total_price
				}
			},
			changeNumber(e,index){
				let obj = this.productList[index]
				obj.number = e.detail
				this.$set(this.productList,index,obj)
				this.handleTotalMoney()
			},
			delProduct(index) {
				let obj = this.productList[index]
				obj.is_delete = !obj.is_delete
				this.$set(this.productList,index,obj)
				this.handleTotalMoney()
			},
			//修改优惠金额
			changeDiscountmoney(e) {
				console.log(this.discount_rate)
				if(this.total_price < this.discount_rate){
					uni.showToast({
						title:'优惠金额不能大于产品金额',
						icon:'none'
					})
					this.money = this.total_price
					this.discount_rate = 0
					return
				}
				if(this.productList.length != 0){
					this.money = Number(this.total_price) - this.discount_rate
				}
			},
			//提交
			createOrder() {
				let {
					customer_id,
					remindPeople,
					imgList,
					listForm,
					customerinfo,  //默认的客户信息
					contactList,  //客户签约人
					contactIndex,
					productList,
					total_price,   //总金额
					discount_rate,  //优惠金额
					money,   //优惠之后的  金额
					num,   //订单编号
					contract_id,
				} = this
				if(!customer_id){
					uni.showToast({
						title:'客户名称不能为空',
						icon:'none'
					})
					return
				}
				if(!contactList[contactIndex]){
					uni.showToast({
						title:'客户签约人不能为空',
						icon:'none'
					})
					return
				}
				if(!this.signed_at){
					uni.showToast({
						title:'请选择签定地点',
						icon:'none'
					})
					return
				}
				if(!this.start_time){
					uni.showToast({
						title:'请选择合同开始时间',
						icon:'none'
					})
					return
				}
				if(!this.end_time){
					uni.showToast({
						title:'请选择合同结束时间',
						icon:'none'
					})
					return
				}
				if(productList.length == 0) {
					uni.showToast({
						title:'请选择购买产品',
						icon:'none'
					})
					return
				}
				let product = []
				productList.forEach(ele=>{
					product.push({
						id:ele.id,
						number:ele.number,
						is_delete:ele.is_delete
					})
				})
				
				
				if(remindPeople.length == 0) {
					uni.showToast({
						title:'请选择审核人',
						icon:'none'
					})
					return
				}
				let arr = []
				remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				let flow_staff_ids = arr.join(',')
				
				let arrlist = []
				let params = this.checkCommonForm(this.listForm)
				if(!params){
					return
				}
				if(!this.edit_reason){
					uni.showToast({
						title:'请填写本次修改原因',
						icon:'none'
					})
					return
				}
				params = Object.assign({},params,{
					id:contract_id,
					customer_id,
					contacts_id:contactList[contactIndex].id,
					flow_staff_ids,
					product,
					remarks:this.remarks,
					discount_rate,
					total_price,
					money,
					num,
					order_date:this.order_date,
					start_time:this.start_time,
					end_time:this.end_time,
					signed_at:this.signed_at,
					guarantee:this.guarantee,
					payment:this.payTypelist[this.payTypeIndex],
					delivery_time:this.delivery_time,
					be_overdue:this.be_overdue,
					effective:this.effective,
					collection_account:this.accountList[this.accountIndex].account,
					collection_deposit:this.accountList[this.accountIndex].deposit,
					collection_name:this.accountList[this.accountIndex].name,
					edit_reason:this.edit_reason
				})
				netContractPassSubmitedit(params).then(res=>{
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
	}
</script>

<style lang="scss" scoped>
	.test_top{
		width:100%;
		height:60rpx;
		background:rgba(2, 135, 255, 0.2);
		.tip{
			font-size:26rpx;
			color:#0287FF;
			padding-left:60rpx;
			line-height: 60rpx;
			position: relative;
			&::before{
				content:'';
				width:20rpx;
				height:35rpx;
				border-radius: 10rpx;
				background:#0287FF;
				position: absolute;
				left:30rpx;
				top:15rpx;
			}
		}
	}
	.inp_warp {
		padding: 30rpx 24rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #333;
			text{
				color:#F00;
			}
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
			.rightinput{
				width:100%;
				text-align: right;
			}
			.right_btn{
				font-size:24rpx;
				color:#007AFF;
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#14C2C1;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#14c2c1;
				margin-right:5rpx;
			}
		}
	}
	.pro_warp{
		padding:30rpx 24rpx;
		background:#fff;
		margin-bottom:24rpx;
		.li_warp{
			padding-bottom:24rpx;
			margin-bottom:24rpx;
			border-bottom:1rpx solid #EDEDED;
			.cell_con{
				padding:0 40rpx;
				.cell_con_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.contitle{
						font-size:28rpx;
						color:#333;
					}
					.deleimg{
						width:44rpx;
						height:44rpx;
					}
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
				height:240rpx;
				background:#F00;
				color:#fff;
				text-align: center;
				line-height: 224rpx;
			}
		}
		.total_money{
			text-align: right;
			font-size:26rpx;
			span{
				font-size:26rpx;
				color:#F00;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:24rpx 45rpx 24rpx 50rpx;
		border-bottom:1rpx solid #EDEDED;
		.area_head {
			font-size: 26rpx;
			color: #333;
			margin-bottom:15rpx;
		}
		.area_text{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			font-size:24rpx;
			color:#333;
			input{
				width:200rpx;
				height:60rpx;
				font-size:24rpx;
				color:#333;
				text-align: center;
				background:rgba(202, 202, 202, 0.2);
			}
			>view{
				flex-shrink: 0;
			}
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
		border-bottom: 1rpx solid #EDEDED;
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
			border: 1rpx solid #EDEDED;
	
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
	.affiliation {
		background-color: #fff;
		margin-bottom: 20rpx;
		margin-top:24rpx;
		padding-bottom: 40rpx;
		.aff_head {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 30rpx;
			font-size:26rpx;
			text {
				color: #f00;
				margin-left: 10rpx;
			}
		}
		.aff_con {
			display: flex;
			text-align: center;
			flex-wrap: wrap;
		
			.aff_item {
				width: 100rpx;
				margin-right: 15rpx;
				margin-bottom:15rpx;
				image {
					margin-bottom: 15rpx;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}
		
			.affbox {
				position: relative;
		
				.delremind {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					position: absolute;
					right: -16rpx;
					top: -16rpx;
					background: rgba(0, 0, 0, 0.5);
					z-index: 2;
				}
			}
		
			.aff_last {
				image {
					margin-bottom: 15rpx;
					width: 80rpx;
					height: 50rpx;
				}
			}
		}
	}
</style>
