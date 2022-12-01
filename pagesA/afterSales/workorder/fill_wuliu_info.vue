<template>
	<view>
		<view class="inp_warp">
			<view class="key">配送方式<span>*</span></view>
			<view class="form_right">
				<radio-group class="radiowarp" >
					<view class="" style="margin-right:24rpx" @click="changeRadio(1)">
						<radio value="1" color="#008EFF" :checked="disMode == 1" />物流配送
					</view>
					<view class="" @click="changeRadio(2)">
						<radio value="2" color="#008EFF" :checked="disMode == 2" />送货上门
					</view>
				</radio-group>
			</view>
		</view>
		
		<view v-if="disMode == 1">
			<view class="inp_warp">
				<view class="inp_title key">物流单号<span>*</span></view>
				<view class="form_right">
					<input type="text" v-model="number" placeholder="请填写物流单号" class="rightinput" :class="number ? 'valueActive' : '' ">
				</view>
			</view>
			<view class="inp_tip">注：填写发货人/收货人手机尾号(后四位)二选一即可</view>
			<view class="inp_warp">
				<view class="inp_title key">发货人手机尾号<span>*</span></view>
				<view class="form_right">
					<input type="number" v-model="sender_phone" placeholder="请填写发货人手机尾号" class="rightinput" :class="sender_phone ? 'valueActive' : '' ">
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title key">收货人手机尾号<span>*</span></view>
				<view class="form_right">
					<input type="number" v-model="receiver_phone" placeholder="请填写收货人手机尾号" class="rightinput" :class="receiver_phone ? 'valueActive' : '' ">
				</view>
			</view>
		</view>
		<view v-if="disMode == 2">
			<view class="inp_warp">
				<view class="inp_title key">送货方式<span>*</span></view>
				<view class="form_right">
					<input type="text" v-model="company" placeholder="请填写送货方式" class="rightinput" :class="company ? 'valueActive' : '' ">
				</view>
			</view>
			<view class="inp_warp">
				<view class="inp_title key">送货费用<span>*</span></view>
				<view class="form_right">
					<input type="digit" v-model="money" placeholder="请填写送货费用" class="rightinput" :class="money ? 'valueActive' : '' ">
				</view>
			</view>
		</view>
		
		<!-- 上传图片 -->
		<upload-img :flag="disMode == 2" title="凭证" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		
		<view class="inp_warp" v-if="type != '配件配送'">
			<view class="inp_title key">产品<span>*</span></view>
		</view>
		<view class="prolist" v-if="productList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in productList" :key="index">
					<view class="proli_top">
						<view class="iconfont icon-jian" @click="delProduct(index)"></view>
						<view class="protext" style="text-align: center;width:240rpx">{{item.product.name}}</view>
						<view class="protext">{{item.number}}</view>
						<view class="protext">{{item.product.num}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(submit)">提交</view>
		
		<select-product ref="workProduct" @selectList="selectProduct"></select-product>
	</view>
</template>

<script>
	import {commonFun} from '@/common/navigate.js'
	import { netAddLogisticsInfomation, netWorkWuliuProduct } from '@/api/api.js'
	import selectProduct from './select_order_product.vue'   //选择工单关联的 产品
	import { BASE_IMG_URL, BASE_URL, SIGN_NO } from '@/api/http.js'
	import { mapState } from 'vuex'
	
	export default{
		mixins:[commonFun],
		components:{
			selectProduct
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,   //防止重复点击
				workorderid:'',   //工单id
				imgList:[],
				productList:[],
				number:'',
				sender_phone:'',    //发货人
				receiver_phone:'',   //收货人
				type:'',   //工单类型
				//配送方式
				disMode:1,    //1物流配送   2送货上门
				company:'',   //配送方式
				money:'',   //配送费用
			}
		},
		computed:mapState({
			costlist: state => state.customer.costlist
		}),
		watch:{
			costlist(list) {
				if(list.length >2 ) {
					this.allList = list.slice(0,2)
				}else{
					this.allList = list
				}
				this.handleMoney()
			},
		},
		onLoad(options) {
			this.workorderid = options.id
			this.type = options.type
			if(this.type == '产品发货'){
				//获取产品信息
				this.getProductList()
			}
			
			this.$store.commit('SETCOSTlIST',[])     //费用信息
		},
		methods:{
			//添加费用
			addCost() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/expDetail'
				})
			},
			//计算  费用
			handleMoney() {
				let arr = this.costlist
				let money = 0
				let num = 0
				arr.forEach(ele=>{
					money += Number(ele.consume_money)
					num += Number(ele.number)
				})
				this.totalMoney = money
				this.money = money
			},
			//删除 费用类型
			delCost(index) {
				this.costlist.splice(index,1)
				this.$store.commit('SETCOSTlIST',this.costlist)
				this.handleMoney()
			},
			//编辑费用
			toEditfree(index) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/cost/expDetail?index='+index
				})
			},
			//配送方式
			changeRadio(mode) {
				this.disMode = mode
			},
			getProductList() {
				let params = {
					workorder_id:this.workorderid
				}
				netWorkWuliuProduct(params).then(res=>{
					if(res.data.length == 0){
						uni.showModal({
							title:'提示',
							content:'产品已全部发货',
							showCancel:false,
							success:(modalres)=>{
								if(modalres.confirm){
									uni.navigateBack({
										delta:1
									})
								}
							}
						})
					}else{
						this.productList = res.data
					}
				})
			},
			submit() {
				if(this.disMode == 1) {
					if(!this.number) {
						uni.showToast({
							title:'请填写物流单号',
							icon:'none'
						})
						return
					}
					if(this.productList.length == 0 && this.type != '配件配送') {
						uni.showToast({
							title:'请选择产品',
							icon:'none'
						})
						return
					}
					if(!this.receiver_phone && !this.sender_phone) {
						uni.showToast({
							title:'请填写手机尾号(二选一)',
							icon:'none'
						})
						return
					}
				}
				if(this.disMode == 2) {
					if(!this.company) {
						uni.showToast({
							title:'请填写送货方式',
							icon:'none'
						})
						return
					}
					if(!this.money) {
						uni.showToast({
							title:'请填写送货费用',
							icon:'none'
						})
						return
					}
				}
				
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				if(this.disMode == 2 && arr.length == 0){
					uni.showToast({
						title:'请上传送货凭证',
						icon:'none'
					})
					return
				}
				
				let proarr = []
				this.productList.forEach(ele=>{
					proarr.push(ele.id)
				})
				let params = {}
				if(this.disMode == 1) {
					params = {
						number:this.number,
						workorder_id:this.workorderid,
						sender_phone:this.sender_phone,
						receiver_phone:this.receiver_phone,
						file_ids:arr.join(','),
						product_ids:proarr.join(','),
						type:'物流配送'
					}
				}
				if(this.disMode == 2) {
					params = {
						workorder_id:this.workorderid,
						file_ids:arr.join(','),
						product_ids:proarr.join(','),
						company:this.company,
						money:this.money,
						type:'送货上门'
					}
				}
				netAddLogisticsInfomation(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			},
			//选择 产品
			seProduct() {
				this.$refs.workProduct.init(this.workorderid)
			},
			selectProduct(arr) {
				let data = arr.concat(this.productList)
				this.productList = this.deWeight(data)
			},
			delProduct(index) {
				this.productList.splice(index,1)
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cost_warp{
		flex:1;
		.cost_li{
			padding:24rpx 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom:1rpx solid #EDEDED;
			.li_left{
				margin-right:24rpx;
				flex-shrink: 0;
				flex-shrink: 0;
				.icon-jian{
					font-size:35rpx;
					color:#ff7800;
				}
			}
			.cost_info{
				flex:1;
				.info_title{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name{
						font-size:26rpx;
						color:#333;
					}
					.time{
						font-size:24rpx;
						color:#666;
					}
				}
				.li_warp{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top:15rpx;
					.li_warp_left{
						font-size:26rpx;
						color:#333;
						margin-right:24rpx;
						span{
							font-size:24rpx;
							color:#666;
						}
					}
				}
			}
		}
		.total_warp{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top:24rpx;
			.total_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.total_h{
					font-size:28rpx;
					color:#000000;
				}
				.total_p{
					margin-left:20rpx;
					font-size:26rpx;
					color:#666;
					span{
						font-size:28rpx;
						color:#333;
					}
				}
			}
		}
	}
	.radiowarp{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		radio{
			transform: scale(0.7);
		}
	}
	.add_in{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size:26rpx;
		color:#FFA205;
		.icon-jiahaocu{
			font-size:28rpx;
			color:#FFA205;
			margin-right:5rpx;
		}
	}
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #EDEDED;
				&:last-child{
					border-bottom:0;
				}
				.proli_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.icon-jian{
						font-size:42rpx;
						color:#ff7800;
					}
					.protext{
						font-size:24rpx;
						color:#333;
						margin-bottom:15rpx;
					}
				}
			}
		}
	}
	.inp_tip{
		font-size:24rpx;
		color:#666;
		padding:15rpx 40rpx;
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
			color: #333;
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
</style>
