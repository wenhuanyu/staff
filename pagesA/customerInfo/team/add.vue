<template>
	<view>
		<!-- 添加成员 -->
		<examine-people title="添加成员" :list="remindPeople" @delItem="delItem" :type="2"></examine-people>
		
		<view class="staffli">
			<view class="statext">权限</view>
			<picker @change="changePre" :range="preArr" :value="preIndex">
				<view class="liright">
					{{preArr[preIndex]?preArr[preIndex]:'请选择'}}
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,    //防止  重复点击
				remindPeople:[],
				examineType:'',
				preArr:['只读','读写'],
				preIndex:0,
				isAddTeam:true
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.remindPeople = uni.getStorageSync('team')
		},
		methods:{
			changePre(e) {
				this.preIndex = e.detail.value
			},
			sureSub() {
				if(this.remindPeople.length == 0) {
					uni.showToast({
						title:'请选择要添加的成员',
						icon:'none'
					})
					return
				}
				let arr = uni.getStorageSync('teamList')
				this.remindPeople.forEach(ele=>{
					arr.push({
						roles:2,
						is_edit:this.preIndex,
						staff:{...ele}
					})
				})
				uni.setStorageSync('teamList',arr)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.staffli{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:24rpx 35rpx;
		border-top:1rpx solid #f5f5f5;
		border-bottom:1rpx solid #f5f5f5;
		.statext{
			font-size:26rpx;
			color:#666;
		}
		.liright{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:#666;
			.icon-you{
				font-size:28rpx;
			}
		}
	}
</style>
