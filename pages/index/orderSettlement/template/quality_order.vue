<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">异常单编号</view>
			<view class="form_right">
				<input type="text" v-model="number" placeholder="请填写数量" disabled class="rightinput" :class="number ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">异常单标题</view>
			<view class="form_right">
				<input type="text" v-model="title" placeholder="异常单标题" class="rightinput" :class="title ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">产品名称</view>
			<view class="form_right">
				<input type="text" v-model="product_name" placeholder-style="color:#999;font-size:24rpx;" placeholder="产品名称" class="rightinput" :class="product_name ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">时间</view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view :class="delivery_time ? 'valueActive' : '' ">
						{{delivery_time ? delivery_time : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">数量</view>
			<view class="form_right">
				<input type="text" v-model="total" placeholder-style="color:#999;font-size:24rpx;" placeholder="请填写数量" class="rightinput" :class="total ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">抽检数</view>
			<view class="form_right">
				<input type="text" v-model="spot_check" placeholder-style="color:#999;font-size:24rpx;" placeholder="请填写抽检数" class="rightinput" :class="spot_check ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">不良数</view>
			<view class="form_right">
				<input type="text" v-model="bad_number" placeholder-style="color:#999;font-size:24rpx;" placeholder="请填写不良数" class="rightinput" :class="bad_number ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">检验员</view>
			<view class="form_right">
				<input type="text" v-model="checker_name" placeholder-style="color:#999;font-size:24rpx;" placeholder="请填写检验员" class="rightinput" :class="checker_name ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">发现地点</view>
			<picker @change="changeFind" :range="findArr" :value="findIndex">
				<view class="form_right">
					<view :class="findArr[findIndex] ? 'valueActive' : '' ">
						{{findArr[findIndex] ? findArr[findIndex] : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<!-- 附件 -->
		<upload-img :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="fllow_area">
			<view class="area_head">品质异常描述:</view>
			<textarea v-model="remarks" :class="remarks ? 'valueActive' : '' " placeholder="请填写品质异常描述"
				placeholder-style="color:#999" />
		</view>
		<!-- 分析人 -->
		<examine-people title="分析人" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(submit)">提交</view>
		<view class="botsec"></view>
		
		
	</view>
</template>

<script>
	import { netAddWorkOrder, netAbnormalNumber, uploadUrl } from '@/api/api.js'
	import { BASE_URL, BASE_IMG_URL, SIGN_NO } from '@/api/http.js'
	import {commonFun} from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	export default{
		mixins:[commonFun],
		components:{
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				findArr:['进料检验','制程检验','出货检验','其它'],
				findIndex:0,
				imgList:[],
				total:'',  //数量
				delivery_time:'',   //时间
				spot_check:'',   //抽检数
				bad_number:'',  //不良数
				checkpoint:'',  //发现地点
				remarks:'',   //备注
				title:'异常单',
				number:'',  //单号
				remindPeople:[],
				examineType:'approval',
				product_name:'',
				checker_name:''
			}
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		onLoad() {
			//获取单号
			this.getBadNumber()
		},
		onShow() {
			this.getDefaultRemind()
		},
		onUnload() {
			this.$store.commit('STAFFOBJ',null)
		},
		methods:{
			getBadNumber() {
				netAbnormalNumber().then(res=>{
					this.number = res.data.number
				})
			},
			//上传图片
			uploadImg(obj) {
				this.imgList.push(obj)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			//发现地点
			changeFind(e){
				this.findIndex = e.detail.value
			},
			//时间
			changeTime(e) {
				this.delivery_time = e.detail.value
			},
			//去选择 指派员工
			toSelectStaff() {
				uni.navigateTo({
					url:'/pages/template/relation_staff'
				})
			},
			submit() {
				if(!this.product_name){
					uni.showToast({
						title:'请填写产品',
						icon:'none'
					})
					return
				}
				if(!this.delivery_time){
					uni.showToast({
						title:'请选择时间',
						icon:'none'
					})
					return
				}
				if(!this.total){
					uni.showToast({
						title:'请填写损坏数量',
						icon:'none'
					})
					return
				}
				if(!this.spot_check){
					uni.showToast({
						title:'请填写抽检数',
						icon:'none'
					})
					return
				}
				if(!this.bad_number){
					uni.showToast({
						title:'请填写不良数',
						icon:'none'
					})
					return
				}
				if(!this.checker_name){
					uni.showToast({
						title:'请填写检验员',
						icon:'none'
					})
					return
				}
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				if(this.remindPeople.length == 0) {
					uni.showToast({
						title:'请请选择审批人',
						icon:'none'
					})
					return
				}
				let a = []
				this.remindPeople.forEach(ele=>{
					a.push(ele.id)
				})
				let params = {
					product_name:this.product_name,
					total:this.total,
					spot_check:this.spot_check,
					bad_number:this.bad_number,
					checkpoint:this.findArr[this.findIndex],
					remarks:this.remarks,
					delivery_time:this.delivery_time,
					file_ids:arr.join(','),
					workorder_type:'品质异常单',
					checker_name:this.checker_name,
					workorder_number:this.number,
					title:this.title,
					flow_staff_ids:a.join(',')
				}
				netAddWorkOrder(params).then(res=>{
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
	.imglist {
		padding: 24rpx 34rpx;
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
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
			border: 1rpx solid #EAEAEA;
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
	.prolist{
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom:0;
				}
				.icon-jian{
					font-size:42rpx;
					color:#ff7800;
				}
				.protext{
					font-size:24rpx;
					color:#333;
					margin-bottom:15rpx;
				}
			}
		}
	}
	.inp_warp {
		padding:20rpx 30rpx;
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
			color: #999;
			min-width:450rpx;
			text-align: right;
			.rightinput{
				width:100%;
				text-align: right;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:24rpx 30rpx;
		margin-bottom: 30rpx;
		.area_head {
			margin-bottom:15rpx;
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
</style>
