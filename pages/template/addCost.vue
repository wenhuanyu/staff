<template>
	<view class="warp">
		<view class="inp_warp">
			<view class="inp_title">关联客户</view>
			<view class="form_right">
				<view>{{relation_customer.name}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title">消费日期<text>*</text></view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view :class="consume_time ? 'valueActive' : '' ">
						{{consume_time ? consume_time : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title">消费方式<text>*</text></view>
			<picker @change="changeType" :range="typeList" :value="typeIndex">
				<view class="form_right">
					<view :class="typeList[typeIndex] ? 'valueActive' : '' ">
						{{typeList[typeIndex] ? typeList[typeIndex] : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title">消费金额<text>*</text></view>
			<view class="form_right">
				<input type="text" v-model="money" placeholder="请输入消费金额" class="rightinput" :class="money ? 'valueActive' : '' ">
			</view>
		</view>
		<!-- 附件 -->
		<upload-img title="上传凭证" :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="remark" :class="remark ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<!-- 审核信息 -->
		<examine-people :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(toSave)">提交</view>
		<view class="botsec"></view>
		
	</view>
</template>

<script>
	import { netAddCost, netSelect, netWorkOrderDetail, uploadUrl } from '@/api/api.js'
	import { BASE_URL, SIGN_NO, BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				customer_id:'',   //客户id
				customer_name:'',
				consume_time:'',   //消费日期
				consume_type:'',   //消费方式
				money:'',   //消费金额
				remark:'',   //备注
				file_ids:'',   //附件id
				
				remindPeople:[],
				examineType:'consume',
				imgList:[],
				typeList:[],   //消费方式 列表
				typeIndex:null,
				uploadShow: false,
				uploadActions: [
					{id:1,name:'拍照',color:'#3478f7'},
					{id:2,name:'从相册中选择',color:'#3478f7'}
				],
				
				relation_type:'',   //关联业务
				relation_id:'',    //关联 id
				relation_customer:null
			}
		},
		onLoad(options) {
			this.relation_type = options.type
			this.relation_id = options.id
			if(this.relation_type == 'workorder'){
				//获取 工单详情
				this.getWorkorderDetail()
			}
			this.getType()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
		},
		//监听  页面 卸载
		onUnload() {
			uni.removeStorageSync('remindlist')
		},
		methods:{
			//获取工单详情
			getWorkorderDetail() {
				netWorkOrderDetail({id:this.relation_id}).then(res=>{
					this.relation_customer = res.data.customer
				})
			},
			//消费方式
			getType() {
				netSelect().then(res=>{
					this.typeList = res.data['消费方式']
				})
			},
			//消费日期
			changeTime(e) {
				this.consume_time = e.detail.value
			},
			//消费方式
			changeType(e) {
				this.typeIndex = e.detail.value
				this.consume_type = this.typeList[this.typeIndex]
			},
			//上传图片
			uploadImg(obj) {
				this.imgList.push(obj)
			},
			//删除 图片
			delImg(index) {
				this.imgList.splice(index,1)
			},
			//保存
			toSave() {
				let {
					consume_time,   //消费日期
					consume_type,   //消费方式
					money,   //消费金额
					remark,   //备注
					imgList,
					remindPeople,   //提醒谁看
					relation_type,
					relation_id,
					relation_customer
				} = this
				if(!consume_time){
					uni.showToast({
						title:'请选择消费日期',
						icon:'none'
					})
					return
				}
				if(!consume_type){
					uni.showToast({
						title:'请选择消费方式',
						icon:'none'
					})
					return
				}
				if(!money){
					uni.showToast({
						title:'请填写消费金额',
						icon:'none'
					})
					return
				}
				if(!remindPeople || remindPeople.length == 0) {
					uni.showToast({
						title:'请选择流程审批人',
						icon:'none'
					})
					return
				}
				let arr = []
				imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				let file_ids = arr.join(',')
				//流程审批人
				let remarr = []
				remindPeople.forEach(ele=>{
					remarr.push(ele.id)
				})
				let flow_staff_id = remarr.join(',')
				let params = {
					customer_id:relation_customer.id,   //客户id
					consume_time,   //消费日期
					consume_type,   //消费方式
					money,   //消费金额
					remark,   //备注
					file_ids,
					flow_staff_ids:flow_staff_id,
					relation_id,
					relation_type
				}
				netAddCost(params).then(res=>{
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
.warp{
	border-top:1rpx solid #EDEDED;
	.cost_fir{
		width:100%;
		padding:30rpx 24rpx;
		background:#fff;
		border-bottom:1rpx solid #EDEDED;
		margin-bottom:24rpx;
		.selfinput{
			width:100%;
			height:30rpx;
			font-size:24rpx;
			color:#333;
		}
	}
}
.inp_warp {
	padding:24rpx 40rpx 24rpx 50rpx;
	background: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1rpx solid #EDEDED;
	.inp_title {
		font-size: 26rpx;
		color: #333;
		text{
			color:#f00;
		}
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
.fllow_area {
	background-color: #fff;
	padding:24rpx 40rpx 24rpx 50rpx;
	border-bottom:1rpx solid #EDEDED;
	margin-bottom: 30rpx;
	.area_head {
		height: 100rpx;
		line-height: 100rpx;
		text {
			color: #f00;
		}
	}
	textarea {
		width: 620rpx;
		height: 260rpx;
		margin:0 auto;
		background:rgba(202, 202, 202, 0.2);
		font-size:26rpx;
		color:#999999;
		border-radius: 50rpx;
		padding:24rpx;
		box-sizing: border-box;
	}
}
.affiliation {
	background-color: #fff;
	margin-bottom: 20rpx;
	margin-top:24rpx;
	padding-bottom: 40rpx;
	.aff_head {
		height: 100rpx;
		line-height: 100rpx;
		padding-left: 30rpx;
		font-size:26rpx;
		text {
			color: #f00;
			margin-left: 10rpx;
		}
	}
	.aff_con {
		display: flex;
		text-align: center;
		flex-wrap: wrap;
	
		.aff_item {
			width: 100rpx;
			margin-right: 15rpx;
			margin-bottom:15rpx;
			image {
				margin-bottom: 15rpx;
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}
		}
	
		.affbox {
			position: relative;
	
			.delremind {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				position: absolute;
				right: -16rpx;
				top: -16rpx;
				background: rgba(0, 0, 0, 0.5);
				z-index: 2;
			}
		}
	
		.aff_last {
			image {
				margin-bottom: 15rpx;
				width: 80rpx;
				height: 50rpx;
			}
		}
	}
}
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
</style>
