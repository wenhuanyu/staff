<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title">所属客户</view>
			<view class="form_right">
				<view class="valueActive">{{name}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">添加产品<span>*</span></view>
			<view class="form_right" @click="toSelectProduct">
				<view :class="productInfo ? 'valueActive' : ''">{{productInfo ? productInfo.name : '请选择产品'}}</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">产品编号</view>
			<view class="form_right">
				<input type="text" placeholder="产品编号" placeholder-style="color:#999;font-size:24rpx;" v-model="productNumber" :class="productNumber ? 'valueActive' : ''">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">产品状态<span>*</span></view>
			<picker @change="changeStatus" :range="statusList" :value="statusIndex">
				<view class="form_right">
					<view :class="statusList[statusIndex] ? 'valueActive' : '' ">
						{{statusList[statusIndex] ? statusList[statusIndex] : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<!-- 上传图片 -->
		<upload-img :imgList="imgList"  @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="button" @click="$noMultipleClicks(sureSubmit)">提交</view>
		<!-- 添加产品 -->
		<popup-list :isSingle="true" ref="productChild" @selectList="selectList"></popup-list>
	</view>
</template>

<script>
	import popupList from '@/components/selectProduct/index'
	import { netAddProductinList } from '@/api/api.js'
	import { BASE_URL, SIGN_NO, BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			popupList
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				id:'',
				name:'',
				statusList:['待发货','发货中','待安装','安装成功','旧机维修'],
				statusIndex:0,
				number:'',   //产品编号
				customer_id:'',  //所属客户
				customerName:'',
				product_id:'',   //产品id
				productInfo:null,
				productNumber:'',  //产品编号
				imgList:[],  //附件
			}
		},
		onLoad(options) {
			this.id = options.id
			this.name = options.name
			this.statusIndex = options.status
		},
		methods:{
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			///////////////////////////////////////////////////////////////////////////////
			changeStatus(e) {
				this.statusIndex = e.detail.value
			},
			toSelectProduct() {
				this.$refs.productChild.init()
			},
			selectList(arr) {
				this.productInfo = arr[0]
			},
			sureSubmit() {
				if(!this.productInfo){
					uni.showToast({
						title:'请选择产品',
						icon:'none'
					})
					return
				}
				// if(!this.productNumber){
				// 	uni.showToast({
				// 		title:'请填写产品编号',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				if(this.imgList.length == 0) {
					uni.showToast({
						title:'请上传附件',
						icon:'none'
					})
					return
				}
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				
				let params = {
					customer_id:this.id,
					product_id:this.productInfo.id,
					number: this.productNumber,
					status: this.statusIndex,
					file_ids: arr.join(',')
				}
				netAddProductinList(params).then(res=>{
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
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EDEDED;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 160rpx;
			height: 160rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EDEDED;
			&:nth-child(4n){
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
				width: 160rpx;
				height: 160rpx;
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
			color:#666;
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
