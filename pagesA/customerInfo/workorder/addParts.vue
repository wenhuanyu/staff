<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">关联的产品<span>*</span></view>
			<view class="add_in" @click="seProduct">
				选择产品
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="pro_warp" v-if="productObj">
			<image :src="productObj.img" class="proimg" ></image>
			<view class="rightbox">
				<view class="protit">{{productObj.name}}</view>
				<view class="protit">{{productObj.num}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="key inp_title">配件名称<span>*</span></view>
			<view class="form_right">
				<input type="text" :class="name ? 'valueActive' : '' "  v-model="name" placeholder="填写配件名称" />
			</view>
		</view>
		<view class="inp_warp">
			<view class="key inp_title">配件型号<span>*</span></view>
			<view class="form_right">
				<input type="text" :class="num ? 'valueActive' : '' "  v-model="num" placeholder="填写配件型号" />
			</view>
		</view>
		<upload-img title="配件图片" :imgList="imgList" :single="true" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="inp_warp">
			<view class="key inp_title">配件单位<span>*</span></view>
			<view class="form_right">
				<input type="text" :class="unit ? 'valueActive' : '' "  v-model="unit" placeholder="填写配件单位" />
			</view>
		</view>
		<view class="inp_warp">
			<view class="key inp_title">配件价格<span>*</span></view>
			<view class="form_right">
				<input type="text" :class="price ? 'valueActive' : '' "  v-model="price" placeholder="填写配件价格" />
			</view>
		</view>
		<view class="fllow_area">
			<view class="area_head">配件描述</view>
			<textarea v-model="description" :class="description ? 'valueActive' : '' " class="textself" placeholder="配件描述" placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(submitSure)">确定</view>
		
		<select-product ref="productChild" :isSingle="true" @selectList="selectParts" ></select-product>
	</view>
</template>

<script>
	import selectProduct from '@/components/selectProduct/index.vue'
	import { netAddPartdata } from '@/api/api.js'
	
	export default{
		components:{
			selectProduct
		},
		data() {
			return{
				noClick:true,    //防止  重复点击
				productObj:null,
				name:'',
				num:'',
				imgList:[],
				price:'',
				unit:'',
				description:'',
				
			}
		},
		methods:{
			seProduct() {
				this.$refs.productChild.init()
			},
			selectParts(arr) {
				this.productObj = arr[0]
			},
			uploadImg(obj){
				this.imgList.push(obj)
			},
			delImg(index) {
				this.imgList.splice(index,1)
			},
			submitSure() {
				if(!this.productObj){
					uni.showToast({
						title:'请选择关联产品',
						icon:'none'
					})
					return
				}
				if(!this.name){
					uni.showToast({
						title:'请填写配件名称',
						icon:'none'
					})
					return
				}
				if(this.imgList.length == 0){
					uni.showToast({
						title:'请上传配件图片',
						icon:'none'
					})
					return
				}
				if(!this.num){
					uni.showToast({
						title:'请填写配件型号',
						icon:'none'
					})
					return
				}
				if(!this.unit){
					uni.showToast({
						title:'请填写配件单位',
						icon:'none'
					})
					return
				}
				if(!this.price){
					uni.showToast({
						title:'请填写配件价格',
						icon:'none'
					})
					return
				}
				let params = {
					product_id:this.productObj.id,
					name:this.name,
					num:this.num,
					price:this.price,
					unit:this.unit,
					description:this.description,
					img:this.imgList[0].id
				}
				netAddPartdata(params).then(res=>{
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
		padding: 0 30rpx 30rpx 30rpx;
		margin-bottom: 30rpx;
		.area_head {
			height: 100rpx;
			line-height: 100rpx;
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
	.pro_warp{
		padding:24rpx 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom:1rpx solid #EDEDED;
		.proimg{
			width:160rpx;
			height:160rpx;
			border-radius: 10rpx;
			margin-right:24rpx;
		}
		.rightbox{
			.protit{
				font-size:24rpx;
				color:#333;
				margin-bottom:15rpx;
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
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
			.right_btn{
				font-size:24rpx;
				color:#007AFF;
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
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#14C2C1;
			.icon-jiahaocu{
				font-size:28rpx;
				color:#14c2c1;
				margin-right:5rpx;
			}
		}
	}
</style>
