<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">收货人姓名<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="consignee" placeholder="请填写联系人姓名" class="rightinput" :class="consignee ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">联系方式<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="consignee_mobile" placeholder="请填写联系方式" class="rightinput" :class="consignee_mobile ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="key inp_title">收货地址<span>*</span></view>
			<view class="form_right" @click="detailAddClick">
				<view class="location" :class="delivery_address ? 'valueActive' : '' ">{{delivery_address ? delivery_address : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="key area_head">详细地址<span>*</span></view>
			<view class="form_right">
				<textarea 
					:class="delivery_address_detail ? 'valueActive' : '' " 
					style="height:150rpx;"
					placeholder="填写详细地址"  
					v-model="delivery_address_detail" 
				/>
			</view>
		</view>
		
		<view class="fllow_area">
			<view class="key area_head">修改原因<span>*</span></view>
			<view class="form_right">
				<textarea 
					:class="edit_reason ? 'valueActive' : '' " 
					style="height:150rpx;"
					placeholder="填写修改原因"  
					v-model="edit_reason" 
				/>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(subSave)">确认</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import { netAddContractAddress, netContractDetail } from '@/api/api.js'
	const citysJSON = require('@/utils/address2.js');
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				delivery_address_detail:'',
				delivery_address:'',
				consignee:'',
				consignee_mobile:'',
				id:'',
				edit_reason:''
			}
		},
		onLoad(options) {
			this.id = options.id
			//获取收货地址
			this.getDetail()
		},
		methods:{
			getDetail() {
				netContractDetail({id:this.id}).then(res=>{
					res = res.data
					this.delivery_address_detail = res.delivery_address_detail
					this.delivery_address = res.delivery_address
					this.consignee = res.consignee
					this.consignee_mobile = res.consignee_mobile
				})
			},
			// 详细地址
			detailAddClick() {
				// #ifdef MP-ALIPAY
				dd.multiLevelSelect({
					title: '选择省市区', //级联选择标题
					list: citysJSON.citys, //引入的js
					success: (res) => {
						console.log(res,'--=')
						res = res.result
						this.delivery_address = res[0].name+res[1].name+res[2].name[0]
					}
				});
				// #endif
				// #ifndef MP-ALIPAY
				uni.chooseLocation({
					success: res => {
						this.delivery_address = res.address
						this.delivery_address_detail = res.name
					},
					fail: err => {
						if(err.errMsg == 'chooseLocation:fail auth deny'){
							uni.showToast({
								title:'请允许使用位置信息',
								icon:'none'
							})
						}
					}
				})
				// #endif
			},
			subSave() {
				if(!this.consignee){
					uni.showToast({
						title:'请填写收货人姓名',
						icon:'none'
					})
					return
				}
				if(!this.consignee_mobile){
					uni.showToast({
						title:'请填写联系方式',
						icon:'none'
					})
					return
				}
				if(!this.delivery_address){
					uni.showToast({
						title:'请选择收货地址',
						icon:'none'
					})
					return
				}
				if(!this.delivery_address_detail){
					uni.showToast({
						title:'请填写收货详细地址',
						icon:'none'
					})
					return
				}
				if(!this.edit_reason){
					uni.showToast({
						title:'请填写修改原因',
						icon:'none'
					})
					return
				}
				let params = {
					id:this.id,
					consignee:this.consignee,
					consignee_mobile:this.consignee_mobile,
					delivery_address:this.delivery_address,
					delivery_address_detail:this.delivery_address_detail,
					edit_reason:this.edit_reason
				}
				netAddContractAddress(params).then(res=>{
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
	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #f5f5f5;
		margin-bottom: 30rpx;
		.area_head {
			margin-bottom:24rpx;
			font-size:26rpx;
			color:#666;
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 10rpx;
			padding:24rpx;
			box-sizing: border-box;
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
			color: #666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.rightinput{
				text-align: right;
			}
		}
	}
</style>
