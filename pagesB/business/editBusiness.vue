<template>
	<view class="">
		<view class="fllow_form">
			<view><text>*</text>客户名称</view>
			<view class="form_right" @click="changeCus">
				<view :class="customerinfo ? 'valueActive' : '' ">{{customerinfo ? customerinfo.name : '点击选择'}}</view>
				<view class="iconfont icon-arrows_right"></view>
			</view>
		</view>
		<form-item v-if="listForm" :listForm="listForm" @changeData="changeOtherData">
		</form-item>
		<!-- 添加产品 -->
		<view class="fllow_form">
			<view style="padding-left:15rpx;">购买产品</view>
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
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	import { netSetForm, netBusinessDetail, netEditBusiness } from '@/api/api.js'
	
	export default{
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
				id:'',  //商机id
				info:{},  //详情
			}
		},
		computed:mapState({
			customerinfo: state => state.customer.customerobj,   //关联 客户
		}),
		onLoad(options) {
			this.id = options.id
			this.getDetail()
		},
		methods:{
			getDetail(){
				netBusinessDetail({id:this.id}).then(res=>{
					this.info = res.data
					this.productList = res.data.product
					this.$store.commit('CUSTOMEROBJ',res.data.customer)
					this.getForm()
				})
			},
			getForm() {
				netSetForm({type:'business'}).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
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
				this.$refs.productChild.init()
			},
			selectList(arr) {
				arr.forEach(ele=>{
					ele.minprice = ele.price
					ele.product_id = ele.id
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
				this.$refs.productConfig.init(item.product_id)
			},
			configList(arr) {
				let obj = this.productList[this.configIndex]
				obj.parts = obj.parts?obj.parts:[]
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
							product_id:ele.product_id,
							price: ele.price,
							number: ele.number,
							wholesale: ele.wholesale
						})
					})
				}
				params = Object.assign({},params,{customer_id:this.customerinfo.id,product,id:this.id})
				netEditBusiness(params).then(res=>{
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
	.add_in{
		background-color: $uni-text-color;
		color:#fff;
		height:60rpx;
		line-height: 60rpx;
		padding:0 15rpx;
		font-size: 24rpx;
		border-radius: 10rpx;
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 20rpx;
		color: #999;
		font-size: 32rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			:first-child {
				width: 450rpx;
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
		.theme {
			color: #5ca9fe;
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
		.form_input {
			input {
				text-align: right;
				margin-right: 10rpx;
			}
		}
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