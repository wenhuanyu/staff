<template>
	<view>
		<view class="test_top">
			<view class="tip">协助</view>
		</view>
		<view class="select_btn" @click="toSeStaff">
			添加协助人
		</view>
		
		<view v-for="(item,index) in assistList" :key="index">
			<view class="warpli">
				<view class="iconfont icon-jian" @click="delAssist(index)"></view>协助任务{{typeArr[index]}}
			</view>
			<view class="inp_warp">
				<view class="inp_title key">任务协助人</view>
				<view class="form_right">
					<image :src="item.img" class="staffimg" ></image>
					<view class="staffname">{{item.name}}</view>
				</view>
			</view>
			<view class="fllow_area">
				<view class="area_head key">任务备注:</view>
				<textarea v-model="item.remark" maxlength="-1" :class="item.remark ? 'valueActive' : '' " placeholder="请填写任务备注"
					placeholder-style="color:#999" />
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(subSave)">确定</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import { netRepairxiezhu, netWorkorderDepart } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				assistList:[],
				id:'',   //工单id
				typeArr:['一','二','三','四','五','六','七','八','九','十'],
			}
		},
		onLoad(options) {
			this.id = options.id
			uni.setStorageSync('remindlist',[])
		},
		onShow() {
			//处理选中的  协助人
			this.handleAssist()
		},
		methods:{
			//去选择 指派员工
			toSeStaff() {
				uni.setStorageSync('remindlist',[])
				uni.navigateTo({
					url:'/pages/selectMember/selectMember'
				})
			},
			//处理选择的协助员工
			handleAssist() {
				let arr = uni.getStorageSync('remindlist')
				arr = this.quChong(arr)
				this.assistList.push(...arr)
			},
			//删除协助人
			delAssist(index,dataindex) {
				this.assistList.splice(index,1)
			},
			quChong(arr){
				let array = []
				arr.forEach(ele=>{
					let flag = true
					ele.remark = ''
					ele.staff_id = ele.id
					ele.id = this.id
					this.assistList.forEach(data=>{
						if(ele.staff_id == data.staff_id) {
							flag = false
						}
					})
					if(flag) {
						array.push(ele)
					}
				})
				return array
			},
			//确定
			subSave() {
				let arr = []
				let flag = false
				this.assistList.forEach(ele=>{
					if(!ele.remark){
						flag = true
					}
					arr.push({
						id:ele.id,
						staff_id:ele.staff_id,
						remark:ele.remark
					})
				})
				if(flag){
					uni.showToast({
						title:'请完善任务备注',
						icon:'none'
					})
					return
				}
				netRepairxiezhu({data:arr}).then(res=>{
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
	.select_btn{
		width:200rpx;
		height:80rpx;
		border-radius: 10rpx;
		background:$uni-text-color;
		font-size:26rpx;
		text-align: center;
		line-height: 80rpx;
		color:#fff;
		margin:24rpx 35rpx;
	}
	.list_warp{
		.depart_li{
			padding:24rpx 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom:1rpx solid #EDEDED;
			
		}
		.depart_name{
			font-size:26rpx;
			color:#333;
		}
		.depart_assist{
			font-size:24rpx;
			color:$uni-text-color;
		}
	}
	.test_top{
		width:100%;
		height:60rpx;
		background:rgba(0, 142, 255, 0.2);
		.tip{
			font-size:26rpx;
			color:$uni-text-color;
			padding-left:60rpx;
			line-height: 60rpx;
			position: relative;
			&::before{
				content:'';
				width:20rpx;
				height:35rpx;
				border-radius: 10rpx;
				background:$uni-text-color;
				position: absolute;
				left:30rpx;
				top:15rpx;
			}
		}
	}
	.warpli{
		padding:24rpx 35rpx;
		border-bottom:1rpx solid #EDEDED;
		border-top:1rpx solid #EDEDED;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size:26rpx;
		color:#333;
		.icon-jian{
			font-size:35rpx;
			color:#ff7800;
			margin-right:15rpx;
		}
	}
	.inp_warp {
		padding:24rpx 50rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size: 26rpx;
			color: #333;
			.icon-jian{
				font-size:35rpx;
				color:#ff7800;
				margin-right:15rpx;
			}
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.rightinput{
				text-align: right;
			}
			.staffimg{
				width:60rpx;
				height:60rpx;
				border-radius: 50%;
				margin-right:15rpx;
			}
		}
	}
	.fllow_area {
		background: #fff;
		padding:30rpx 50rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
		}
		textarea {
			width: 660rpx;
			height:200rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size:26rpx;
			background:rgba(202, 202, 202, 0.2);
		}
	}
</style>
