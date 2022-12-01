<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">讨论主题:<span>*</span></view>
			<view class="form_right">
				<input type="text" v-model="title" placeholder="请输入讨论主题" class="rightinput" :class="title ? 'valueActive' : '' ">
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head key">讨论内容:<span>*</span></view>
			</view>
			<textarea v-model="content" :class="content ? 'valueActive' : '' " placeholder="请填写讨论内容"
				placeholder-style="color:#999" />
		</view>
		
		<upload-img :flag="false" :imgList="imgList" @delImg="delImg" @uploadImg="uploadImg"></upload-img>
		<!-- 审核信息 -->
		<examine-people title="邀请人" :list="remindPeople" @delItem="delItem"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
	</view>
</template>

<script>
	import { netDiscussDetail, netEditDiscuss } from '@/api/api.js'
	import { commonFun } from '@/common/navigate.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,   //防止重复点击
				imgList:[],
				id:'',
				title:'',
				content:'',
				file_ids:'',
				show_staff_id:'',   //邀请人
				remindPeople:[],
				examineType:'discuss'
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
		},
		onShow() {
			//获取  默认需要提醒的人
			this.getDefaultRemind()
		},
		methods:{
			getDetail() {
				netDiscussDetail({id:this.id}).then(res=>{
					res = res.data
					this.title = res.title
					this.content = res.content
					let imgarr = res.file_ids
					imgarr.forEach(ele=>{
						ele.file_path = ele.url
					})
					this.imgList = imgarr
					let arr = res.show_staff_id
				})
			},
			delImg(index) {
				this.imgList.splice(index,1)
			},
			uploadImg(data) {
				this.imgList.push(data)
			},
			sureSub() {
				if(!this.title){
					uni.showToast({
						title:'请输入讨论主题',
						icon:'none'
					})
					return
				}
				if(!this.content){
					uni.showToast({
						title:'请填写讨论内容',
						icon:'none'
					})
					return
				}
				let arr = []
				this.imgList.forEach(ele=>{
					arr.push(ele.id)
				})
				if(this.remindPeople.length == 0){
					uni.showToast({
						title:'请选择邀请人',
						icon:'none'
					})
					return
				}
				let rearr = []
				this.remindPeople.forEach(ele=>{
					rearr.push(ele.id)
				})
				let params = {
					id:this.id,
					title:this.title,
					content:this.content,
					file_ids:arr.join(','),
					show_staff_id:rearr.join(',')
				}
				netEditDiscuss(params).then(res=>{
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
			color: #666;
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
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		.fllo_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area_head {
				margin-bottom: 20rpx;
				font-size:26rpx;
				color:#666;
			}
			.list_text{
				font-size:26rpx;
				color:#007AFF;
			}
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
</style>
