<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title">收货人</view>
			<view class="form_right">
				<input type="text" v-model="consignee" placeholder="请填写收货人" class="rightinput" :class="consignee ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">联系方式</view>
			<view class="form_right">
				<input type="text" v-model="consignee_mobile" placeholder="请输入联系方式" class="rightinput" :class="consignee_mobile ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">收货地址</view>
			<!-- #ifdef MP-WEIXIN -->
			<picker @change="changeAddress" mode="region">
				<view class="form_right">
					<view :class="address ? 'valueActive' : '' ">
						{{address ? address : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="form_right" @click="changeAddressData">
				<view :class="address ? 'valueActive' : '' ">
					{{address ? address : '点击选择'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
			<lotus-address @choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
			<!-- #endif -->
		</view>
		<view class="fllow_area">
			<view class="area_head">详细地址:</view>
			<textarea v-model="address_detail" adjust-position :class="address_detail ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		<view class="inp_warp">
			<view class="inp_title">要求交货时间</view>
			<view class="form_right">
				<select-time-picker
					placeholder="要求交货时间" 
					:defaultValue="delivery_time"
					fields="day"
					@change="changeDtime"
				></select-time-picker>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">实际交货时间</view>
			<view class="form_right">
				<select-time-picker
					placeholder="实际交货时间" 
					:defaultValue="actual_delivery_time"
					fields="day"
					@change="changeADtime"
				></select-time-picker>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">是否需要安装</view>
			<view class="form_right">
				<radio-group class="radiowarp" @change="changeRadio">
					<view class="">
						<radio value="1" color="#008EFF" :checked="is_install == 1" />是
					</view>
					<view class="">
						<radio value="0" color="#008EFF" :checked="is_install == 0" />否
					</view>
				</radio-group>
			</view>
		</view>
		<view class="fllow_area" v-if="workorder_type != '配件配送'">
			<view class="area_head ">产品信息:</view>
			<view class="product_warp">
				<view class="product_li" v-for="(item,index) in product" :key="index">
					<view class="product_name">产品名称：{{item.name}}</view>
					<view class="product_in" >
						<view class="key">产品编号：<text style="color:#FD6B6B">*</text></view>
						<textarea v-model="item.number" class="product_num" :class="item.number ? 'valueActive' : '' " placeholder="请填写产品编号,用逗号分隔"
							placeholder-style="color:#999" />
					</view>
					<view class="product_img">
						<view class="img_title">附件：</view>
						<view class="imglist" >
							<view class="imgbox" v-for="(imgitem,imgindex) in item.file_ids_data" :key="index">
								<image :src="BASE_IMG_URL+'/index/close.png'" class="delimg" @click="delImg(index,imgindex)" ></image>
								<image :src="imgitem.url" class="selfimg" ></image>
							</view>
							<view class="imgbox" @click="uploadFiles(index)">
								<image :src="BASE_IMG_URL+'/index/addfile.png'" class="selfimg" ></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fllow_area">
			<view class="area_head">备注(特殊要求):</view>
			<textarea v-model="remarks" adjust-position :class="remarks ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(toSubmit)">确定</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import selectTimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	import { BASE_IMG_URL, BASE_URL, SIGN_NO } from '@/api/http.js'
	import { netInputProductNumber, netWorkOrderDetail, netInputPartInfo, 
	netCustomerDetail, uploadUrl } from '@/api/api.js'
	import lotusAddress from '@/components/lotusAddress/lotusAddress.vue'
	
	export default{
		components:{
			selectTimePicker,
			lotusAddress
		},
		data() {
			return{
				noClick:true,   //防止重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				actual_delivery_time:'',   //实际交货时间
				workorder_id:'',   //工单id
				customerid:'',   //客户id
				delivery_time:'',   //要求交期时间
				delivery_address:'',  //交货地址
				address:'',
				address_detail:'',  //详细地址
				remarks:'',
				consignee:'',   //consignee收货人
				consignee_mobile:'',  //收货人联系方式
				is_install:0,  //是否安装  0 否 1是
				product:[],   //产品列表
				workorder_type:'',   //工单类型
				lotusAddressData:{
					visible:false,
					provinceName:'',
					cityName:'',
					townName:'',
				}
			}
		},
		onLoad(options) {
			this.workorder_id = options.id
			this.customerid = options.customerid
			this.getDetail()
		},
		methods:{
			changeAddressData() {
				this.lotusAddressData = {
					visible:true,
					provinceName:'',
					cityName:'',
					townName:'',
				}
			},
			//选择省市区
			choseValue(e) {
				this.lotusAddressData = Object.assign({},this.lotusAddressData,e)
				if(e.province){
					this.address = e.province+e.city+e.town
				}
			},
			getDetail() {
				netWorkOrderDetail({id:this.workorder_id}).then(res=>{
					this.address = res.data.delivery_address?res.data.delivery_address:res.data.address
					this.address_detail = res.data.delivery_address_detail?res.data.delivery_address_detail:res.data.address_detail
					
					//收货人
					this.consignee = res.data.consignee?res.data.consignee:res.data.contacts.name
					this.consignee_mobile = res.data.consignee_mobile?res.data.consignee_mobile:res.data.contacts.mobile
					
					//要求交期
					this.delivery_time = res.data.delivery_time
					this.actual_delivery_time = res.data.actual_delivery_time
					//是否需要安装
					this.is_install = res.data.is_install
					this.remarks = res.data.remarks
					this.workorder_type = res.data.workorder_type
					if(res.data.workorder_type != '配件配送'){
						let data = res.data.customer_product
						let arr = []
						data.forEach(ele=>{
							arr.push({
								id: ele.id,
								number: ele.number,
								name: ele.product.name,
								file_ids_data:ele.file_ids_data
							})
						})
						this.product = arr
					}
				})
			},
			//收货地址
			changeAddress(e) {
				let arr = e.detail.value
				this.address = `${arr[0]}${arr[1]}${arr[2]}`
			},
			//是否安装
			changeRadio(e) {
				this.is_install = e.detail.value
			},
			//要求交货时间
			changeDtime(e) {
				this.delivery_time = e.f1
			},
			//实际交货时间
			changeADtime(e) {
				this.actual_delivery_time = e.f1
			},
			//上传图片
			uploadFiles(index) {
				uni.chooseImage({
					count: 9,
					sizeType:['compressed'],
					success: (res) => {
						let file = res.tempFilePaths
						file.forEach(ele=>{
							this.toUpload(ele,index)
						})
					}
				})
			},
			toUpload(file,index) {
				uni.uploadFile({
					url: uploadUrl,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token'),
						'sign-no': SIGN_NO
					},
					filePath: file,
					success: (res) => {
						let data = JSON.parse(res.data)
						console.log(data,'上传图片')
						if (data.code == 1) {
							let obj = this.product[index]
							obj.file_ids_data.push(data.data)
							this.$set(this.product,index,obj)
						} else {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			delImg(index,imgindex) {
				let obj = this.product[index]
				obj.file_ids_data.splice(imgindex,1)
				this.$set(this.product,obj,index)
			},
			
			toSubmit() {
				let arr = this.product
				arr.forEach(ele=>{
					let img = []
					ele.file_ids_data.forEach(imgele=>{
						img.push(imgele.id)
					})
					ele.file_ids = img.join(',')
				})
				let params = {
					workorder_id:this.workorder_id,
					delivery_time:this.delivery_time,
					actual_delivery_time:this.actual_delivery_time,
					delivery_address:this.address,
					delivery_address_detail:this.address_detail,
					remarks:this.remarks,
					consignee:this.consignee,
					consignee_mobile:this.consignee_mobile,
					is_install:this.is_install,
					product:arr,
				}
				if(this.workorder_type == '配件配送'){
					netInputPartInfo(params).then(res=>{
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
				}else{
					netInputProductNumber(params).then(res=>{
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
	}
</script>

<style lang="scss" scoped>
	.product_warp{
		.product_li{
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			border-radius: 10rpx;
			padding:24rpx;
			.product_name{
				font-size:24rpx;
				color:#333;
			}
			.product_in{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size:24rpx;
				color:#333;
				margin:15rpx 0;
				.product_num{
					width:460rpx;
					height:120rpx;
					background:rgba(202, 202, 202, 0.2);
					border-radius: 10rpx;
					box-sizing: border-box;
					padding:15rpx;
				}
			}
			.product_img{
				.img_title{
					font-size:24rpx;
					color:#333;
				}
			}
		}
	}
	.imglist {
		padding: 24rpx 20rpx;
		background: #fff;
		border-bottom: 1rpx solid #EDEDED;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 140rpx;
			height: 140rpx;
			margin-right: 50rpx;
			position: relative;
			margin-bottom: 24rpx;
			&:nth-child(3n){
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
				width: 140rpx;
				height: 140rpx;
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
			color: #666;
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
	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		.area_head {
			font-size: 26rpx;
			color: #666;
			margin-bottom:15rpx;
		}
		textarea {
			width: 620rpx;
			height: 140rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 20rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
</style>
