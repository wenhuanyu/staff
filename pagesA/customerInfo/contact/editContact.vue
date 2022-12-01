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
				<view class="selebox" @click="toSeleQuhao" >
					<view class="sele_quhao">{{quhao ? quhao.number : '请选择区号'}}</view>
					<image :src="BASE_IMG_URL+'/index/green-small-cancel.png'" class="xiaimg" ></image>
				</view>
			</view>
		</view>
		<form-item v-if="listForm" :listForm="listForm" @changeData="changeContactData"></form-item>
		<view class="button" @click="toSubmit">确认</view>
		<view class="botsec"></view>
		<quhao-pop :show="show" ref="quhaoChild" @sureQuhao="sureQuhao" @close="closePop"></quhao-pop>
	</view>
</template>

<script>
	import { netConcatDetailInfo, netEditConcatInfo, netSetForm } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import formItem from '@/components/form/formitem.vue'
	import quhaoPop from '@/components/quhaoPop/index'
	import { checkPhone } from '@/utils/util.js'
	
	export default{
		components:{
			formItem,
			quhaoPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				name:'',
				mobile:'',
				listForm:null,
				info:{},
				show:false,
				quhao:{},
				type:1
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
		},
		methods:{
			changeContry(type) {
				this.type = type
			},
			getDetail() {
				netConcatDetailInfo({id:this.id}).then(res=>{
					this.name = res.data.name
					this.mobile = res.data.mobile
					this.quhao = res.data.mobilecode_detail
					this.type = res.data.region
					this.info = res.data
					this.getForm()
				})
			},
			getForm() {
				let params = {
					type: 'contacts'
				}
				netSetForm(params).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
					//处理 邮箱
					// this.handleEmail()
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
			toSubmit() {
				if(!this.name){
					uni.showToast({
						title:'请填写联系人姓名',
						icon:'none'
					})
					return
				}
				if(!this.mobile){
					uni.showToast({
						title:'请填写联系人手机号',
						icon:'none'
					})
					return
				}
				//首联系人信息
				let contacts = this.checkCommonForm(this.listForm)
				if(!contacts){
					return
				}
				let params = {
					name:this.name,
					mobile:this.mobile,
					id:this.id,
					mobilecode:this.quhao ?this.quhao.number: '',
					region:this.type,
					...contacts
				}
				netEditConcatInfo(params).then(res=>{
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
	
	
	.inp_warp {
		padding:30rpx;
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
					font-size:26rpx;
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

