<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title"></view>
			<view class="form_right">
				<view class="change_btn" :class="type == 1 ? 'activebtn' : ''" @click="changeContry(1)">国内</view>
				<view class="change_btn" :class="type == 2 ? 'activebtn' : ''" @click="changeContry(2)">国外</view>
			</view>
		</view>
		<view class="inp_warp" v-if="type == 2">
			<view class="inp_title key">区号<span>*</span></view>
			<view class="form_right">
				<view class="selebox" @click="toSeleQuhao">
					<view class="sele_quhao">{{quhao ? quhao.number : '区号'}}</view>
					<image :src="BASE_IMG_URL+'/index/green-small-cancel.png'" class="xiaimg" ></image>
				</view>
			</view>
		</view>
		<form-item :listForm="listForm" v-if="listForm" @changeData="changeContactData"></form-item>
		<view class="button" @click="submit">提交</view>
		<view class="botsec"></view>
		<quhao-pop :show="show" ref="quhaoChild" @sureQuhao="sureQuhao" @close="closePop"></quhao-pop>
	</view>
</template>

<script>
	import { netSetForm, netAddContact, netCheckNameRepeat } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import quhaoPop from '@/components/quhaoPop/index'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { checkPhone } from '@/utils/util.js'
	
	export default{
		components:{
			quhaoPop,
			formItem
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				customerid:'',
				money:'',
				show:false,
				quhao:{id:229,name:'中国大陆',number:86},
				listForm:null,
				pageType:1,   //1直接添加联系人   2从添加客户中过来添加联系人
				type:1,   //1国内  2国外
				is_major:true,  //true  1是  false 0否
			}
		},
		onLoad(options) {
			this.customerid = options.id
			if(options.pageType){
				this.pageType = options.pageType
			}
			this.getForm()
		},
		methods:{
			//是否首联系人
			changeSwitch(e) {
				this.is_major = e.detail.value
			},
			changeContry(type) {
				this.type = type
			},
			handleEmail() {
				let obj = {}
				let index = null
				this.listForm.forEach((ele,index)=>{
					if(ele.id == 'email'){
						obj = ele
						index
					}
				})
				if(this.type == 1) {
					//国内
					obj.config.required = false
				}else{
					//国外
					obj.config.required = true
				}
				this.$set(this.listForm,index,obj)
			},
			toSeleQuhao() {
				this.show = true
				this.$refs.quhaoChild.getMobileCode()
			},
			closePop() {
				this.show = false
			},
			sureQuhao(item) {
				this.show = false
				this.quhao = item
			},
			getForm() {
				netSetForm({type:'contacts'}).then(res=>{
					let form = res.data.data
					form.forEach((ele)=>{
						ele.value = ''
					})
					this.listForm = form
				})
			},
			changeContactData(name,value,obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			submit() {
				if(this.type == 2 && !this.quhao) {
					uni.showToast({
						title:'请选择区号',
						icon:'none'
					})
					return
				}
				//首联系人信息
				let contacts = this.checkCommonForm(this.listForm)
				if(!contacts){
					return
				}
				contacts = Object.assign({},contacts,{
					customer_id:this.customerid,
					region:this.type,
					mobilecode:this.quhao?this.quhao.number:''})
					netAddContact({contacts:contacts}).then(res=>{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						if(this.pageType == 1){
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},2000)
						}else{
							setTimeout(()=>{
								uni.navigateBack({
									delta:2
								})
							},2000)
						}
					})
			}
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
		color: #333;
	}
	.form_right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.rightinput{
			text-align: right;
		}
		.change_btn{
			width:94rpx;
			height:44rpx;
			border-radius: 22rpx;
			font-size:26rpx;
			text-align: center;
			color:$uni-text-color;
			border:1rpx solid $uni-text-color;
			line-height: 42rpx;
			margin-right:15rpx;
		}
		.activebtn{
			background:$uni-text-color;
			color:#fff;
		}
		.selebox{
			display: flex;
			justify-content: center;
			align-items: center;
			flex-shrink: 0;
			.sele_quhao{
				font-size:34rpx;
				color:$uni-text-color;
			}
			.xiaimg{
				width:24rpx;
				height:14rpx;
				margin-left:10rpx;
			}
		}
		
	}
}
</style>
