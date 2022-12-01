<template>
	<view class="">
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户名称<span>*</span></view>
			<view class="form_right" @click="toSelectCustomer">
				<view :class="customerinfo ? 'valueActive' : '' ">{{customerinfo ? customerinfo.name : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<form-item v-if="listForm" :listForm="listForm" :isNotRequired="isRequired"  @changeData="changeOtherData">
		</form-item>
		<!-- 添加产品 -->
		<view class="inp_warp" v-if="!isRequired">
			<view class="inp_title key">购买产品</view>
			<view class="add_in" @click="addPart">
				+添加产品
			</view>
		</view>
		<view class="pro_warp" v-if="productList.length != 0">
			<view class="li_warp" v-for="(item,index) in productList" :key="index">
				<view class="cell_con">
					<view class="cell_con_top">
						<view class="contitle">{{item.name}}</view>
						<image :src="BASE_IMG_URL+'/delete1.png'" @click="delProduct(index)" class="deleimg" mode=""></image>
					</view>
					<view class="pro_con_box">
						<view class="boxleft">
							<view class="context">编码：{{item.num}}</view>
							<view class="context">单位：{{item.unit}}</view>
							<view class="conmoney">
								零售价：￥ <input type="digit" class="priceinput" v-model="item.price" placeholder="请输入零售价">
							</view>
							<view class="conmoney">
								批发价：￥ <input type="digit" class="priceinput" v-model="item.wholesale" placeholder="请输入批发价">
							</view>
						</view>
						<view class="conbot">
							<view class="conright">
								<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}"></uni-number-box>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="button" @click="$noMultipleClicks(toSave)">
			保存
		</view>
		<view class="botsec"></view>
		<!-- 添加产品 -->
		<popup-list ref="productChild" @selectList="selectList"></popup-list>
	</view>
</template>

<script>
	import popupList from '@/components/selectProduct/index'
	// import popupProductConfig from '@/components/selectProductConfig/index'
	import formItem from '@/components/form/formitem.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netSetForm, netAddBusiness, netKehuDetail } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	export default{
		mixins:[commonFun],
		components:{
			popupList,
			formItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick: true, //防止  重复点击
				listForm:null,
				productList:[],
				isRequired:false,  //是否只展示必填字段
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
		}),
		onLoad(options) {
			if(options.id){
				//客户id
				this.getCustomerInfo(options.id)
			}
			this.getForm()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			//获取客户信息
			getCustomerInfo(id) {
				netKehuDetail({id}).then(res=>{
					res = res.data
					this.$store.commit('CUSTOMEROBJ',res)
				})
			},
			getForm() {
				netSetForm({type:'business'}).then(res=>{
					let arr = res.data.data
					arr.forEach(ele=>{
						ele.value = ele.value?ele.value:''
					})
					this.listForm = arr
				})
			},
			changeOtherData(name, value, obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			//选择购买的产品
			addPart() {
				console.log('选择产品',this.$refs)
				this.$refs.productChild.init()
			},
			selectList(arr) {
				arr.forEach(ele=>{
					ele.minprice = ele.price
				})
				this.productList = this.deWeight(arr.concat(this.productList))
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
			//修改产品数量
			changeNumber(e,index){
				let obj = this.productList[index]
				obj.number = e
				this.$set(this.productList,index,obj)
			},
			delProduct(index) {
				this.productList.splice(index,1)
			},
			//选择产品 配置
			toSelectConfig(item,index) {
				this.configIndex = index
				this.$refs.productConfig.init(item.id)
			},
			configList(arr) {
				let obj = this.productList[this.configIndex]
				obj.parts = this.deWeight(obj.parts.concat(arr))
				this.$set(this.productList,this.configIndex,obj)
			},
			//修改配置数量
			changeConfigNumber(e,conindex,index) {
				let obj = this.productList[index]
				obj.parts[conindex].number = e
				this.$set(this.productList,index,obj)
			},
			//删除产品配置
			delPeizhi(index,conindex) {
				let obj = this.productList[index]
				obj.parts.splice(conindex,1)
				this.$set(this.productList,index,obj)
			},
			toSave() {
				if(!this.customerinfo.id){
					uni.showToast({
						title:'请选择客户名称',
						icon:'none'
					})
					return
				}
				let params = this.checkCommonForm(this.listForm)
				if(!params){
					return
				}
				//产品列表
				let product = []
				if(this.productList.length > 0){
					this.productList.forEach(ele=>{
						product.push({
							product_id:ele.id,
							price: ele.price,
							number: ele.number,
							wholesale: ele.wholesale
						})
					})
				}
				params = Object.assign({},params,{customer_id:this.customerinfo.id,product})
				netAddBusiness(params).then(res=>{
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
		}
	}
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
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
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
	.add_in{
		background-color: $uni-text-color;
		color:#fff;
		height:60rpx;
		line-height: 60rpx;
		padding:0 15rpx;
		font-size: 24rpx;
		border-radius: 10rpx;
	}
	.pro_warp{
		padding:30rpx 24rpx 0 24rpx;
		background:#fff;
		border-bottom:1rpx solid #f5f5f5;
		.li_warp{
			padding-bottom:24rpx;
			margin-bottom:24rpx;
			border-bottom:2rpx solid #f5f5f5;
			&:last-child{
				border-bottom:0;
			}
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
				.pro_con_box{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.context{
						font-size:26rpx;
						color:#666;
						margin-top:10rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}
					.conmoney{
						font-size:26rpx;
						color:#333;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin-bottom:15rpx;
						.priceinput{
							width:180rpx;
							height:60rpx;
							background:rgba(202, 202, 202, 0.2);
							text-align: center;
						}
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
				.config_set{
					margin-top:24rpx;
					.config_title{
						font-size:24rpx;
						color:#333;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.addConimg{
							width:100rpx;
							height:40rpx;
							margin-left:10rpx;
						}
					}
					.config_list{
						margin-top:24rpx;
						.config_li{
							display: flex;
							justify-content: flex-start;
							align-items: center;
							margin-top:24rpx;
							border-bottom:1rpx solid #f5f5f5;
							padding-bottom:24rpx;
							.conimg{
								width:100rpx;
								height:100rpx;
								border-radius: 10rpx;
								margin-right:20rpx;
							}
							.config_name{
								width:290rpx;
								font-size:24rpx;
								color:#333;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
							.config_step{
								
								margin-left:24rpx;
							}
						}
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
		
	}
	.del{
		width:40rpx;
		height:40rpx;
		border-radius: 50%;
		border:1rpx solid #ff7800;
		font-size:28rpx;
		color:#ff7800;
		flex-shrink: 0;
		margin-right:24rpx;
		text-align: center;
		line-height: 38rpx;
	}
</style>