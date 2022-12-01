<template>
	<view>
		<view style="background:#fff;">
			<view class="inp_warp">
				<view class="inp_title key">跟进类型:</view>
				<view class="form_right">
					<picker disabled @change="changeType" :range="typeList" :value="typeIndex">
						<view class="form_right">
							<view :class="typeList[typeIndex] ? 'valueActive' : '' ">
								{{typeList[typeIndex] ? typeList[typeIndex] : '选择计划类型'}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
			</view>
			<view class="fllow_area">
				<view class="area_head key">跟进内容:</view>
				<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="跟进内容"
					placeholder-style="color:#999" />
			</view>
			<!-- 附件 -->
			<upload-img :flag="false" :imgList="imgList" @uploadImg="uploadImg" @delImg="delImg"></upload-img>
			<!-- 审核信息 -->
			<examine-people title="提醒人" :list="remindPeople" @delItem="delItem"></examine-people>
		</view>
		<view style="height:100rpx"></view>
		<view class="savebox">
			<view class="button" @click="$noMultipleClicks(toAdd)">保存</view>
		</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netCreateFollowup,netSelect } from '@/api/api.js'
	import { getNewDateArry } from '@/utils/dateTimePicker'
	import { commonFun } from '@/common/navigate.js'
	
	export default {
		mixins:[commonFun],
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				noClick: true, //防止  重复点击
				imgList: [],
				remindPeople: [], //提醒谁看
				examineType:'record',
				files: '',
				content: '',
				typeList:['微信','邮件','电话'],
				typeIndex:2,
				customerid:'',   //客户id
				linkName:'',  //联系人姓名
				nowDate:'',   //当前时间
			}
		},
		onLoad(options) {
			this.customerid = options.id
			this.linkName = options.name
			//获取跟进类型
			this.getOption()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
			
			//当前时间
			let arr = getNewDateArry()
			this.nowDate = `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}`
			this.content = `我于${this.nowDate}给联系人${this.linkName}拨打了一个电话`
		},
		onUnload() {
			uni.removeStorageSync('remindlist')
		},
		methods: {
			//获取跟进类型
			getOption() {
				netSelect().then(res=>{
					this.typeList = res.data.other['跟进类型']
				})
			},
			//上传图片
			uploadImg(data) {
				this.imgList.push(data)
			},
			delImg(index) {
				this.imgList.splice(index, 1)
			},
			changeType(e) {
				this.typeIndex = e.detail.value
			},
			//保存
			toAdd() {
				if (!this.content) {
					uni.showToast({
						title: '请填写跟进内容',
						icon: 'none'
					})
					return
				}
				let files = ''
				let arr = []
				this.imgList.forEach(item => {
					arr.push(item.id)
				})
				files = arr.join(',')
				
				let remindsid = '' //提醒谁看
				let remarr = []
				this.remindPeople.forEach(ele => {
					remarr.push(ele.id)
				})
				remindsid = remarr.join(',')
				let params = {
					relation_type:'customer',
					relation_id:this.customerid,
					file_ids:files,
					content:this.content,
					reminds_id:remindsid,
					customer_id:this.customerid,
					relation_process:this.typeList[this.typeIndex]
				}
				netCreateFollowup(params).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})
			}
		}
	}
</script>
<style>
	radio{
		transform: scale(0.6);
	}
</style>

<style lang="scss" scoped>
	.valueActive {
		color: #333;
	}
	.mapbox {
		width: 100%;
		height: 400rpx;

		#mapself {
			width: 100%;
			height: 400rpx;
		}
	}

	.locainfo {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-bottom:1rpx solid #f5f5f5;
		.localeft {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.dingwei {
				width: 30rpx;
				height: 30rpx;
				margin-right: 15rpx;
			}

			.text {
				font-size: 26rpx;
				color: #333;
			}
		}

		.locaright {
			font-size: 26rpx;
			color: #007AFF;
		}
	}

	.inp_warp {
		padding: 30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #CCC;
		.inp_title {
			font-size: 26rpx;
			color: #333;
		}

		.form_right {
			display: flex;
			color: #999;

			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.radiobox{
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}

	.fllow_area {
		background: #fff;
		padding: 20rpx 30rpx;
		.area_head {
			margin:15rpx 0 35rpx;
		}
		textarea {
			width: 670rpx;
			background: #f5f5f5;
			padding: 20rpx;
			border-radius: 10rpx;
			margin: 0 auto;
			box-sizing: border-box;
		}
	}

	.savebox {
		width: 750rpx;
		height: 120rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1rpx solid #CCC;
		z-index: 2;
	}

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
			&:nth-child(3n){
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
</style>
