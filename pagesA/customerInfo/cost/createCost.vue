<template>
	<view class="warp">
		<view class="care">
			<image :src="BASE_IMG_URL+'/customer/care.png'" class="careimg" ></image>
			注意：蓝色字体为必填项！
		</view>
		<view class="inp_warp">
			<view class="inp_title">关联客户</view>
			<view class="form_right">
				<view>{{customer_name}}</view>
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">消费日期</view>
			<picker @change="changeTime" mode="date">
				<view class="form_right">
					<view :class="consume_time ? 'valueActive' : '' ">
						{{consume_time ? consume_time : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">消费方式</view>
			<picker @change="changeType" :range="typeList" :value="typeIndex">
				<view class="form_right">
					<view :class="typeList[typeIndex] ? 'valueActive' : '' ">
						{{typeList[typeIndex] ? typeList[typeIndex] : '点击选择'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">消费金额</view>
			<view class="form_right">
				<input type="text" v-model="money" placeholder="请输入消费金额" class="rightinput" :class="money ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="inp_warp" style="margin:24rpx 0 0;">
			<view class="inp_title key">上传凭证</view>
			<view class="form_right" @click="uploadClick">
				<view>点击上传</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
		<view class="imglist" v-if="imgList.length != 0">
			<view class="imgbox" v-for="(item,index) in imgList" :key="index">
				<image :src="BASE_IMG_URL+'/index/close.png'" class="delimg" @click="delImg(index)" ></image>
				<image :src="item.url" class="selfimg" ></image>
			</view>
		</view>
		
		<view class="fllow_area">
			<view class="area_head">备注:</view>
			<textarea v-model="remark" :class="remark ? 'valueActive' : '' " placeholder="请填写备注"
				placeholder-style="color:#999" />
		</view>
		
		<!-- 审核信息 -->
		<examine-people :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(toSave)">提交</view>
		<view class="botsec"></view>
		<!-- 下载报价单 -->
		<uni-popup ref="downPopup" type="bottom" background-color="#fff">
			<view class="acbox">
				<view class="acli" @click="uploadType(1)">拍照</view>
				<view class="acli" @click="uploadType(2)">从相册中选择</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netAddCost, netSelect, uploadUrl } from '@/api/api.js'
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
			}
		},
		onLoad(options) {
			this.customer_id = options.customerid
			this.customer_name = options.name
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
			// 上传附件
			uploadClick() {
				this.$refs.downPopup.open()
			},
			uploadType(e) {
				this.$refs.downPopup.close()
				if(e == 1) {
					//拍照
					uni.chooseImage({
						count:1,
						sourceType:['camera'],
						sizeType:['compressed'],
						success:(res)=>{
							let file = res.tempFilePaths[0]
							this.uploadFile(file,1)
						}
					})
				}else if(e == 2){
					//相册 选择
					uni.chooseImage({
						count:1,
						sourceType:['album'],
						sizeType:['compressed'],
						success:(res)=>{
							let file = res.tempFilePaths[0]
							this.uploadFile(file,1)
						}
					})
				}
			},
			//type  上传图片1  或  文件2
			uploadFile(file,type) {
				uni.uploadFile({
					url:uploadUrl,
					name:'file',
					header:{
						'token':uni.getStorageSync('token'),
						'sign-no':SIGN_NO
					},
					filePath: type == 1 ? file : file.path,
					success:(res)=>{
						let data = JSON.parse(res.data)
						if(data.code == 1) {
							if(type == 1) {
								this.imgList.push(data.data)
							}
						}else{
							uni.showToast({
								title:'上传失败',
								icon:'none'
							})
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			//删除 图片
			delImg(index) {
				this.imgList.splice(index,1)
			},
			//保存
			toSave() {
				let {
					customer_id,   //客户id
					consume_time,   //消费日期
					consume_type,   //消费方式
					money,   //消费金额
					remark,   //备注
					imgList,
					remindPeople,   //提醒谁看
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
				let flow_staff_ids = remarr.join(',')
				let params = {
					customer_id,   //客户id
					consume_time,   //消费日期
					consume_type,   //消费方式
					money,   //消费金额
					remark,   //备注
					file_ids,
					flow_staff_ids
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
	.care{
		display: flex;
		justify-content: center;
		align-items: center;
		width:750rpx;
		height:40rpx;
		font-size:22rpx;
		color:#F2533E;
		background:#EDEDED;
		.careimg{
			width:27rpx;
			height:27rpx;
			margin-right:15rpx;
		}
	}
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
		background: #fff;
		padding:30rpx 40rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
		}
		textarea {
			width: 660rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			font-size:26rpx;
			background:rgba(202, 202, 202, 0.2);
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
