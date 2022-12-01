<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">产品名称</view>
			<view class="form_right">
				<input type="text" v-model="name" placeholder-style="color:#999;font-size:24rpx" :disabled="!isEdit" :class="name ? 'valueActive' : '' " placeholder="请输入产品名称" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">产品编码</view>
			<view class="form_right">
				<input type="text" v-model="num" placeholder-style="color:#999;font-size:24rpx" :disabled="!isEdit" :class="num ? 'valueActive' : '' " placeholder="请输入产品编号" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">产品单位</view>
			<view class="form_right">
				<input type="text" v-model="unit" placeholder-style="color:#999;font-size:24rpx" :disabled="!isEdit" :class="unit ? 'valueActive' : '' " placeholder="请输入产品单位" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">零售价</view>
			<view class="form_right">
				<input type="text" v-model="price" placeholder-style="color:#999;font-size:24rpx" :disabled="!isEdit" :class="price ? 'valueActive' : '' " placeholder="请填写标准价格" class="rightinput">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">批发价</view>
			<view class="form_right">
				<input type="text" v-model="wholesale" placeholder-style="color:#999;font-size:24rpx" :disabled="!isEdit" :class="wholesale ? 'valueActive' : '' " placeholder="请填写含税价格" class="rightinput">
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head">产品描述:</view>
			<view class="content" v-html="description" v-if="!isEdit"></view>
			<textarea v-model="description" v-else :disabled="!isEdit" :class="description ? 'valueActive' : '' " placeholder="请填写产品描述"
				placeholder-style="color:#999" />
		</view>
	</view>
</template>

<script>
	import { netAddProduct, netProductDetail, netEditProduct } from '@/api/api.js'
	
	export default{
		data(){
			return{
				noClick:true,    //防止  重复点击
				description:'',
				tax_price:'',
				price:'',
				wholesale:'',
				unit:'',
				num:'',
				stock:'',
				name:'',
				
				id:'',
				type:1,  //1新增   2查看详情
				isEdit:true,
			}
		},
		onLoad(options) {
			this.type = options.type
			if(this.type == 2) {
				this.isEdit = false
				this.id = options.id
				this.getDetail()
				uni.setNavigationBarTitle({
					title: '产品详情'
				})
			}
		},
		methods:{
			//获取详情
			getDetail() {
				netProductDetail({id:this.id}).then(res=>{
					this.name = res.data.name
					this.num = res.data.num
					this.stock = res.data.stock
					this.unit = res.data.unit
					this.price = res.data.price
					this.tax_price = res.data.tax_price
					this.wholesale = res.data.wholesale
					this.description = res.data.description
				})
			},
			submitPro() {
				if(!this.name) {
					uni.showToast({
						title:'请输入产品名称',
						icon:'none'
					})
					return
				}
				if(!this.num) {
					uni.showToast({
						title:'请输入产品编号',
						icon:'none'
					})
					return
				}
				if(!this.unit) {
					uni.showToast({
						title:'请填写产品单位',
						icon:'none'
					})
					return
				}
				if(!this.stock) {
					uni.showToast({
						title:'请输入产品库存',
						icon:'none'
					})
					return
				}
				if(!this.price) {
					uni.showToast({
						title:'请输入产品价格',
						icon:'none'
					})
					return
				}
				let params = {
					description:this.description,
					tax_price: this.tax_price,
					price: this.price,
					unit: this.unit,
					num: this.num,
					stock: this.stock,
					name: this.name
				}
				if(this.type == 1) {
					//新增
					this.add(params)
				}else if(this.type == 2){
					//修改
					params = Object.assign({},params,{id:this.id})
					this.edit(params)
				}
				
			},
			edit(params) {
				netEditProduct(params).then(res=>{
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
			},
			add(params) {
				netAddProduct(params).then(res=>{
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
	.content{
		width:660rpx;
		margin:0 auto;
		height:auto;
		overflow-x: hidden;
	}
	.fllow_area {
		background-color: #fff;
		padding: 0 30rpx 30rpx;
		margin-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
			color:#666;
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
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
		}
	}
</style>
