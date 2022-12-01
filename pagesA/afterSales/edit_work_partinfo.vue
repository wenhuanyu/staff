<template>
	<view>
		<view class="inp_warp">
			<view class="inp_title key">配件</view>
			<view class="add_in" @click="addParts">
				<view class="iconfont icon-jiahaocu"></view>
				添加配件
			</view>
		</view>
		<view class="prolist" v-if="partsList.length != 0">
			<view class="probox">
				<view class="proli" v-for="(item,index) in partsList" :key="index">
					<view class="iconfont icon-jian" @click="delParts(index)"></view>
					<view class="protext" style="text-align: center;width:160rpx">{{item.name}}</view>
					<view>
						<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changeNumber(e,index)}" />
					</view>
				</view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSubmit)">确定</view>
		<view class="botsec"></view>
		
		<select-work-parts
			ref="partsChild" 
			@selectList="selectParts"
		></select-work-parts>
	</view>
</template>

<script>
	import selectWorkParts from '@/components/selectWorkParts/index'
	import {commonFun} from '@/common/navigate.js'
	import { netEditWorkorderPart, netWorkOrderDetail } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		components:{
			selectWorkParts
		},
		data() {
			return{
				noClick:true,    //防止  重复点击
				partsList:[],
				relation_id:''
			}
		},
		onLoad(options) {
			this.relation_id = options.id
			//获取配件信息
			this.getWorkDetail()
		},
		methods:{
			getWorkDetail() {
				netWorkOrderDetail({id:this.relation_id}).then(res=>{
					this.partsList = res.data.parts
				})
			},
			//添加 配件
			addParts() {
				this.$refs.partsChild.init()
			},
			selectParts(arr) {
				arr.forEach(ele=>{
					ele.number = 1
				})
				let data = this.partsList.concat(arr)
				this.partsList = this.deWeight(data)
			},
			//删除 配件
			delParts(index) {
				this.partsList.splice(index,1)
			},
			//修改 配件 数量
			changeNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e
				this.$set(this.partsList,index,obj)
			},
			sureSubmit() {
				if(this.partsList.length == 0) {
					uni.showToast({
						title:'请添加配件',
						icon:'none'
					})
					return
				}
				
				let params = {
					id:this.relation_id,
					parts:this.partsList
				}
				netEditWorkorderPart(params).then(res=>{
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
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			
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
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			.icon-jiahaocu{
				font-size:28rpx;
				color:$uni-text-color;
				margin-right:5rpx;
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
				border-bottom:1rpx dashed #EDEDED;
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
</style>
