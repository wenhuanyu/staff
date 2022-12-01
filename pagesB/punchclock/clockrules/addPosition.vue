<template>
	<view class="">
		<view class="fllow_form">
			<view><text>*</text>打卡位置</view>
			<view class="form_right" @click="changePosition">
				<view :class="address ? 'valueActive' : '' ">{{address ? address : '打卡位置'}}</view>
				<view class="iconfont icon-arrows_right"></view>
			</view>
		</view>
		<view class="fllow_form">
			<view><text>*</text>打卡范围</view>
			<picker @change="changeDistance" :value="distanceIndex" :range="distanceArr" :range-key="'name'">
				<view class="form_right">
					<view :class="distanceArr[distanceIndex] ? 'valueActive' : '' ">{{distanceArr[distanceIndex] ? distanceArr[distanceIndex].name : '打卡范围'}}</view>
					<view class="iconfont icon-arrows_right"></view>
				</view>
			</picker>
		</view>
		
		<view class="botwarp" v-if="position_id">
			<view class="b_bot remove" @click="$noMultipleClicks(sureDel)">删除</view>
			<view class="b_bot" @click="$noMultipleClicks(toSave)">确认修改</view>
		</view>
		<view v-else class="button" @click="$noMultipleClicks(toSave)">
			保存
		</view>
		
	</view>
</template>

<script>
	import { netAddAddress, netAddressDetail, netEditAddress, netDelAddress } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick: true, //防止  重复点击
				address:'',
				address_detail:'',
				lat:'',
				lng:'',
				distance:0,
				distanceArr:[
					{name:'100米',distance:100},
					{name:'200米',distance:200},
					{name:'300米',distance:300},
					{name:'400米',distance:400},
					{name:'500米',distance:500},
					{name:'600米',distance:600},
					{name:'700米',distance:700},
					{name:'800米',distance:800},
					{name:'900米',distance:900},
					{name:'1000米',distance:1000},
					{name:'1500米',distance:1500},
					{name:'2000米',distance:2000},
					{name:'2500米',distance:2500},
					{name:'3000米',distance:3000},
					{name:'3500米',distance:3500},
				],
				distanceIndex:2,
				position_id:'',  //地址id
			}
		},
		onLoad(options) {
			if(options.id){
				this.position_id = options.id
				//获取地址详情
				this.getDetail()
			}
		},
		methods:{
			getDetail() {
				netAddressDetail({id:this.position_id}).then(res=>{
					res = res.data
					this.address = res.address
					this.address_detail = res.address_detail
					this.lat = res.lat
					this.lng = res.lng
					this.distanceArr.forEach((ele,index)=>{
						if(ele.distance == res.distance){
							this.distanceIndex = index
						}
					})
				})
			},
			changePosition() {
				uni.chooseLocation({
					success:(res)=>{
						this.lat = res.latitude
						this.lng = res.longitude
						this.address = res.name
						this.address_detail = res.address
					}
				})
			},
			changeDistance(e) {
				this.distanceIndex = e.detail.value
			},
			toSave() {
				if(!this.address){
					uni.showToast({
						title:'请选择打卡位置',
						icon:'none'
					})
					return
				}
				let params = {
					address:this.address,
					address_detail:this.address_detail,
					distance:this.distanceArr[this.distanceIndex].distance,
					lng:this.lng,
					lat:this.lat,
				}
				if(this.position_id){
					params.id = this.position_id
					netEditAddress(params).then(res=>{
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
					netAddAddress(params).then(res=>{
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
			},
			sureDel() {
				uni.showModal({
					title:'提示',
					content:'请确认是否删除?',
					complete:(data)=>{
						if(data.confirm){
							netDelAddress({id:this.position_id}).then(res=>{
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
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 20rpx;
		color: #999;
		font-size: 32rpx;
		.form_right {
			display: flex;
			align-items: center;
			color: #999;
			:first-child {
				width: 450rpx;
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
		.form_input {
			input {
				text-align: right;
				margin-right: 10rpx;
			}
		}
	}
	.botwarp{
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top:100rpx;
		.b_bot{
			width:300rpx;
			height:80rpx;
			border-radius: 40rpx;
			font-size:24rpx;
			text-align: center;
			line-height: 80rpx;
			background:$uni-text-color;
			color:#fff;
		}
		.remove{
			background:#ff7800;
		}
	}
</style>