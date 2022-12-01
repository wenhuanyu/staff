<template>
	<view>
		<view class="fllow_form">
			<view class="key">解决结果<span>*</span></view>
			<view class="form_right">
				<view class="radiowarp">
					<view class="radioli" @click="changeRadio(1)">
						<radio value="1" color="#008EFF" :checked="mobile_result == 1" />已解决
					</view>
					<view class="radioli" @click="changeRadio(2)">
						<radio value="2" color="#008EFF" :checked="mobile_result == 2" />未解决
					</view>
				</view>
			</view>
		</view>
		<view class="fllow_form">
			<view class="key">是否发送配件<span>*</span></view>
			<view class="form_right">
				<view class="radiowarp">
					<view class="radioli" @click="changeSend(1)">
						<radio value="1" color="#008EFF" :checked="isSend == 1" />是
					</view>
					<view class="radioli" @click="changeSend(2)">
						<radio value="2" color="#008EFF" :checked="isSend == 2" />否
					</view>
				</view>
			</view>
		</view>
		<view v-if="isSend == 1">
			<view class="fllow_form" style="margin-top:24rpx;">
				<view class="key">选择配件<span>*</span></view>
			</view>
			<view class="prolist" v-if="partsList.length != 0">
				<view class="probox">
					<view class="proli" v-for="(item,index) in partsList" :key="index">
						<view class="iconfont icon-jian" @click="delParts(index)"></view>
						<view class="protext">{{item.name}}</view>
						<view class="protext">
							<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changePartNumber(e,index)}" />
						</view>
					</view>
				</view>
			</view>
			<view class="add_in" @click="toAddPart">
				<view class="iconfont icon-jiahaocu"></view>
				添加配件
			</view>
		</view>
		
		<view class="fllow_area">
			<view class="area_head key">情况说明</view>
			<textarea v-model="desc" :class="{'valueActive':desc}" class="textself" placeholder="情况说明" placeholder-style="color:#999" />
		</view>
		
		<view class="button" @click="$noMultipleClicks(toComplate)">确定</view>
		<view class="botsec"></view>
		<!-- 选择任务失败  弹框提醒 是否去创建工单 -->
		<uni-popup ref="Orderpopup" type="center" background-color="#fff" @touchmove.stop.prevent>
			<view class="popbox">
				<view class="poptit">创建工单</view>
				<view class="list">
					<view class="li" :class="{'liactive':tabid == 12}" @click="changeTab(12)">返厂维修</view>
					<view class="li" :class="{'liactive':tabid == 11}" @click="changeTab(11)">上门维修</view>
				</view>
				<view class="popbot">
					<view class="popbtn remove" @click="toRemove">取消</view>
					<view class="popbtn" @click="toSure">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<select-work-parts ref="partChild"  @selectList="selectParts"></select-work-parts>
	</view>
</template>

<script>
	import selectWorkParts from '@/components/selectWorkParts/index'
	import { commonFun } from '@/common/navigate.js'
	import { netCompleteWorkorder } from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		components:{
			selectWorkParts
		},
		data() {
			return{
				id:'',
				noClick:true,    //防止  重复点击
				mobile_result:1,  //1成功  2失败
				isSend:1,   //1是  2否
				partsList:[],
				desc:'',
				
				tabid:null,
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods:{
			changeRadio(result) {
				this.mobile_result = result
			},
			changeSend(send) {
				this.isSend = send
			},
			//配件
			toAddPart() {
				this.$refs.partChild.init(this.workorderid)
			},
			selectParts(arr) {
				arr.forEach(ele=>{
					ele.number = 1
				})
				let data = this.partsList.concat(arr)
				this.partsList = this.deWeight(data)
			},
			delParts(index) {
				this.partsList.splice(index,1)
			},
			changePartNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e
				this.$set(this.partsList,index,obj)
			},
			toComplate() {
				if(this.mobile_result == 2) {
					if(this.isSend == 1 && this.partsList.length == 0) {
						uni.showToast({
							title:'请选择需要配送的配件',
							icon:'none'
						})
						return
					}
					this.$refs.Orderpopup.open()
				}else{
					this.toSubmit()
				}
			},
			//任务失败 选择需要创建的工单
			changeTab(id) {
				this.tabid = id
			},
			toRemove() {
				uni.navigateBack({
					delta:1
				})
			},
			toSure() {
				if(this.isSend == 1 && this.partsList.length == 0) {
					uni.showToast({
						title:'请选择需要配送的配件',
						icon:'none'
					})
					return
				}
				if(!this.tabid){
					uni.showToast({
						title:'请选择需要创建的工单',
						icon:'none'
					})
					return
				}
				this.toSubmit()
			},
			toSubmit() {
				if(this.isSend == 1 && this.partsList.length == 0){
					uni.showToast({
						title:'请添加需要配送的配件',
						icon:'none'
					})
					return
				}
				let result = this.mobile_result == 1?1:this.tabid
				let params = {
					id:this.id,
					use_parts:this.isSend == 1 ? this.partsList : [],
					mobile_result:result,
					desc:this.desc,
				}
				netCompleteWorkorder(params).then(res=>{
					if(this.mobile_result != 1) {
						if(this.tabid == 12){
							//返厂维修工单
							uni.redirectTo({
								url:'/pagesA/customerInfo/workorder/repotRepair?id='+this.id
							})
						}else if(this.tabid == 11) {
							//上门维修工单
							uni.redirectTo({
								url:'/pagesA/customerInfo/workorder/ondoorRepair?id='+this.id
							})
						}
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popbox{
		padding:50rpx 30rpx;
		width:650rpx;
		.poptit{
			font-size:28rpx;
			font-weight: bold;
			text-align: center;
			padding-bottom:24rpx;
			border-bottom:1rpx solid #f5f5f5;
		}
		.list{
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin:45rpx 0 50rpx 0;
			.li{
				padding:15rpx 20rpx;
				border:1rpx solid $uni-text-color;
				color:$uni-text-color;
				border-radius: 8rpx;
			}
			.liactive{
				background:$uni-text-color;
				color:#fff;
			}
		}
		.popbot{
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding-top:24rpx;
			.popbtn{
				width:140rpx;
				height:70rpx;
				border-radius: 10rpx;
				text-align: center;
				line-height: 70rpx;
				background:$uni-text-color;
				color:#fff;
			}
			.remove{
				background:#fff;
				border: 1px solid #999999;
				color:#999;
				line-height: 68rpx;
			}
		}
	}
	.add_in{
		display: flex;
		justify-content: center;
		align-items: center;
		padding:15rpx 0;
		background:#fff;
		font-size:28rpx;
		color:$uni-text-color;
		.icon-jiahaocu{
			font-size:30rpx;
			color:$uni-text-color;
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
					width:200rpx;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					.priceinput{
						width:180rpx;
						font-size:24rpx;
						color:#333;
					}
				}
			}
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx;
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			.form_input {
				width:300rpx;
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.radioli{
					display: flex;
					justify-content: center;
					align-items: center;
					font-size:26rpx;
					radio{
						transform: scale(0.7);
					}
				}
			}
			
		}
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
</style>
