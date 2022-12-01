<template>
	<view class="create_customer">
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<view class="fllow_form">
			<view class="key">客户名称<span>*</span></view>
			<view class="form_right">
				<input type="text" class="nameinput" :class="name ? 'valueActive' : ''" v-model="name" placeholder="输入客户名称"/>
				<view class="theme" @click="checkName">查重</view>
			</view>
		</view>
		<form-item v-if="listForm" :listForm="listForm" :isNotRequired="isRequired"  @changeData="changeData"></form-item>
		<view class="button" @click="$noMultipleClicks(sureEdit)">提交</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import formItem from '@/components/form/formitem.vue'
	import { mapState } from 'vuex'
	import { netCustomerDetail, netSetForm, netEditKehu, netCheckName, netPrevCustomer, netAddressTransLng } from '@/api/api.js'
	import { checkPhone } from '@/utils/util.js'
	import quhaoPop from '@/components/quhaoPop/index'
	
	export default{
		components:{
			formItem,
			quhaoPop
		},
		data() {
			return{
				id:'',
				noClick:true,    //防止  重复点击
				listForm:null,
				name:'',
				info:{},
				isRequired:false,  //是否只展示必填字段
			}
		},
		onShow() {
			//获取附加信息 form
		},
		onLoad(options) {
			this.id = options.customerid
			this.getInfo()
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			getInfo() {
				netCustomerDetail({id:this.id}).then(res=>{
					res = res.data
					this.info = res
					this.name = res.name
					this.getForm()
				})
			},
			getForm() {
				netSetForm({type:'customer'}).then(res=>{
					res = res.data.data
					let delindex = null
					res.forEach((item,index)=>{
						if(item.id == 'name'){
							delindex = index
						}
					})
					res.splice(delindex,1)
					this.listForm = this.handleFormDefaultValue(res,this.info)
				})
				
			},
			changeData(name,value,obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			//姓名查重
			checkName() {
				let name = this.name
				console.log(name)
				if(!name){
					uni.showToast({
					    title: '请填写客户姓名',
						icon:'none'
					})
					return
				}
				netCheckName({name}).then(res=>{
					uni.showToast({
					    title: res.msg,
						icon:'none'
					})
				})
			},
			sureEdit() {
				if(!this.name) {
					uni.showToast({
					    title: '请填写客户名称',
						icon:'none',
					    duration: 2000
					})
					return
				}
				// 附加信息
				let customer = this.checkCommonForm(this.listForm)
				if(!customer){
					return
				}
				let params = Object.assign({},customer,{
					id:this.id,
					name:this.name,
				})
				netEditKehu(params).then(res=>{
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		.nameinput{
			width:400rpx;
		}
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			align-items: center;
			.location{
				width:300rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
		.theme {
			color: $uni-text-color;
			margin-left:15rpx;
		}
		.busibox{
			width:42rpx;
			height:48rpx;
			margin-left:15rpx;
			.busiimg{
				width:42rpx;
				height:48rpx;
			}
		}
		.form_input {
			input {
				width:300rpx;
				text-align: right;
				height: 100rpx;
				line-height: 100rpx;
				text-align: right;
				margin-right: 10rpx;
			}
		}
	}
	.fllow_form_text{
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		.form_right{
			margin-top:24rpx;
			.addressText{
				width: 620rpx;
				height:150rpx;
				margin:0 auto;
				background:rgba(202, 202, 202, 0.2);
				font-size:26rpx;
				color:#999999;
				border-radius: 10rpx;
				padding:24rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
