<template>
	<view>
		<view class="appwarp">
			<view class="title">加签</view>
			<view class="appro_list">
				<view class="appro_li" v-for="(item,index) in approverList" :key="index">
					<view class="appro_warp">
						<view class="iconfont icon-jian" @click="delApprover(index)"></view>
						<view class="appcenter">
							<view class="staffinfo">
								<image :src="item.img" class="staffimg" ></image>
								<view class="name">{{item.name}}</view>
							</view>
							<view class="btnwarp">
								<view class="appro_btn" @click="beforeOrafter(index,false)">前加签</view>
								<view class="appro_btn" @click="beforeOrafter(index,true)">后加签</view>
							</view>
						</view>
					</view>
					<textarea v-model="item.desc" class="textself" placeholder="请填写备注" placeholder-style="color:#999" />
				</view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(submit)">确定</view>
	</view>
</template>

<script>
	import { netAddapprovalAll, netApprovalPeople } from '@/api/api.js'

	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				relation_id:'',
				relation_type:'',
				approverList:[],
				editIndex:null,
				isAfter:true,   //false前    true后
			}
		},
		onLoad(options) {
			this.relation_id = options.id
			this.relation_type = options.type
			//获取审批人
			this.getApprovalList()
			// this.approverList = uni.getStorageSync('defaultApprover')
			uni.setStorageSync('remindlist', [])
		},
		onShow() {
			this.getSeledApprover()
		},
		methods:{
			getApprovalList() {
				let params = {
					relation_type:this.relation_type,
					relation_id:this.relation_id
				}
				netApprovalPeople(params).then(res=>{
					this.approverList = res.data
				})
			},
			getSeledApprover() {
				if(this.editIndex == null) {
					return
				}
				let arr = uni.getStorageSync('remindlist')
				arr = this.quChong(arr)
				if(this.isAfter){
					this.approverList.splice(this.editIndex + 1,0,...arr)
				}else{
					this.approverList.splice(this.editIndex,0,...arr)
				}
			},
			quChong(arr){
				let array = []
				arr.forEach(ele=>{
					let flag = true
					this.approverList.forEach(data=>{
						if(ele.id == data.id) {
							flag = false
						}
					})
					if(flag) {
						array.push(ele)
					}
				})
				return array
			},
			//前加签
			beforeOrafter(index,flag) {
				this.editIndex = index
				this.isAfter = flag
				uni.setStorageSync('remindlist', [])
				uni.navigateTo({
					url: '/pages/selectMember/selectMember'
				})
			},
			//删除
			delApprover(index) {
				this.approverList.splice(index,1)
			},
			submit() {
				if(this.approverList.length == 0) {
					uni.showToast({
						title:'请选择审核人',
						icon:'none'
					})
					return
				}
				let arr = []
				let data = []
				this.approverList.forEach(ele=>{
					arr.push(ele.id)
					data.push({id:ele.id,desc:ele.desc})
				})
				let params = {
					relation_id:this.relation_id,
					relation_type:this.relation_type,
					staff_id:arr.join(','),
					remark: data
				}
				netAddapprovalAll(params).then(res=>{
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
	.appwarp{
		padding:24rpx 30rpx;
		.title{
			font-size:28rpx;
			color:#333;
			margin-bottom:24rpx;
		}
		.appro_list{
			.appro_li{
				padding:24rpx 0;
				border-bottom:1rpx solid #f5f5f5;
				.appro_warp{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					
				}
				.icon-jian{
					font-size:40rpx;
					color:#ff7800;
					margin-right:45rpx;
				}
				.appcenter{
					flex:1;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.staffinfo{
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right:50rpx;
					.staffimg{
						width:60rpx;
						height:60rpx;
						border-radius: 50%;
						margin-right:15rpx;
					}
					.name{
						font-size:26rpx;
						color:#333;
					}
				}
				.btnwarp{
					display: flex;
					justify-content: flex-end;
					align-items: center;
				}
				.appro_btn{
					width:100rpx;
					height:50rpx;
					border-radius: 10rpx;
					font-size:26rpx;
					text-align: center;
					line-height: 50rpx;
					margin-right:30rpx;
					background:$uni-btn-bg-color;
					color:#fff;
				}
				.textself{
					width: 600rpx;
					height:150rpx;
					padding: 20rpx;
					border-radius: 10rpx;
					margin: 24rpx auto;
					box-sizing: border-box;
					font-size:26rpx;
					background:rgba(202, 202, 202, 0.2);
				}
			}
		}
	}
</style>
