<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">工单标题</view>
			<view class="form_right">
				<view>{{workorderInfo.title}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户</view>
			<view class="form_right">
				<view>{{workorderInfo.customer.name}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户联系人</view>
			<view class="form_right">
				<view>{{workorderInfo.contacts.name}}</view>
			</view>
		</view>
		<view class="product_list">
			<view class="product_tit">产品列表</view>
			<view class="probox">
				<view class="pro_h">
					<view class="p_h">产品名称</view>
					<view class="p_h_n">设备编号</view>
					<view class="p_c"></view>
				</view>
				<view class="pro_h" v-for="(item,index) in product" :key="index">
					<view class="p_h">{{item.name}}</view>
					<view class="p_h_n">
						<input type="text" v-model="item.number" placeholder="请填写产品编号" class="p_h_input">
					</view>
					<view class="p_c" @click="toScan(index)">
						<image :src="BASE_IMG_URL+'/user/sm.png'" class="smcodeimg"></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(subData)">提交</view>
	</view>
</template>

<script>
	import { netWorkOrderDetail, netInputProductNumber } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				type:1,  //1填写产品编号    2修改产品编号
				workorderid:'',
				workorderInfo:null,
				product:[]
			}
		},
		onLoad(options) {
			this.type = options.type
			if(this.type == 1){
				uni.setNavigationBarTitle({
					title: '填写产品编号'
				})
			}else{
				uni.setNavigationBarTitle({
					title: '修改产品编号'
				})
			}
			this.workorderid = options.workorderid
			//获取详情
			this.getDetail()
		},
		methods:{
			//扫码
			toScan(index) {
				let obj = this.product[index]
				uni.scanCode({
					success:(res)=>{
						console.log(res,'扫码信息')
						let number = res.result
						if(!this.handleRepead(number)){
							uni.showToast({
								title:'产品编号切勿重复使用',
								icon:'none'
							})
							return
						}
						obj.number = number
						this.$set(this.product,index,obj)
					}
				})
			},
			handleRepead(num) {
				let data = this.product
				let flag = true
				data.forEach(ele=>{
					if(num == ele.number){
						flag = false
					}
				})
				return flag
			},
			getDetail() {
				netWorkOrderDetail({id:this.workorderid}).then(res=>{
					this.workorderInfo = res.data
					this.handleProduct(res.data.customer_product)
				})
			},
			handleProduct(data) {
				let arr = []
				data.forEach(ele=>{
					arr.push({
						id: ele.id,
						number: ele.number,
						name: ele.product.name
					})
				})
				this.product = arr
			},
			subData() {
				let arr = this.product
				let flag = false
				arr.forEach(ele=>{
					if(!ele.number){
						flag = true
					}
				})
				if(flag){
					uni.showToast({
						title:'请填写产品编号',
						icon:'none'
					})
					return
				}
				let params = {
					workorder_id: this.workorderid,
					product: this.product
				}
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
</script>

<style lang="scss" scoped>
	.inp_warp {
		padding:24rpx 40rpx 24rpx 50rpx;
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
			color: #333;
			min-width:450rpx;
			text-align: right;
			font-size:26rpx;
		}
	}
	.product_list{
		padding:24rpx;
		background:#fff;
		.product_tit{
			font-size:30rpx;
			color:#333;
			margin-bottom:24rpx;
			font-weight: bold;
		}
		.probox{
			.pro_h{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:24rpx 0;
				border-bottom:1rpx solid #EDEDED;
				.p_h{
					width:200rpx;
					font-size:26rpx;
					color:#333;
					text-align: center;
				}
				.p_h_n{
					width:300rpx;
					font-size:26rpx;
					color:#333;
					text-align: center;
					.p_h_input{
						width:100%;
						font-size:26rpx;
						color:#333;
						text-align: center;
					}
				}
				.p_c{
					width:80rpx;
					.smcodeimg{
						width:30rpx;
						height:30rpx;
					}
				}
			}
		}
	}
</style>
