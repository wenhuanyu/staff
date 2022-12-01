<template>
	<view>
		<view class="work_li">
			<view class="li_left" v-if="info.staff">
				<image :src="info.staff.img ? info.staff.img : BASE_IMG_URL+'/headImg.png'" class="li_img" mode=""></image>
				<view class="">
					<view class="li_name">{{info.staff.name}} <text style="font-size:24rpx;color:#999;margin-left:15rpx">{{info.staff.post?info.staff.post:''}}</text> </view>
					<view class="li_post">{{info.createtime}}</view>
				</view>
			</view>
			<view class="li_right">
				<view class="tatus firbg" v-if="info.type == '日报'">日报</view>
				<view class="tatus secbg" v-if="info.type == '周报'">周报</view>
				<view class="tatus thrbg" v-if="info.type == '月报'">月报</view>
				<view class="tatus forbg" v-if="info.type == '季报'">季报</view>
				<view class="tatus fivbg" v-if="info.type == '年报'">年报</view>
			</view>
		</view>
		<!-- 导航栏 -->
		<view class="title_tit">工作内容</view>
		<formItem :listForm="listForm" v-if="listForm" :autoHeight="true"  :isEdit="false"></formItem>
		
		<view class="title_tit">评论列表</view>
		<view class="comment_list">
			<view class="item_content" v-for="(item,index) in commont_list" :key="index">
				<view class="con_img">
					<image :src="item.staff.img ? item.staff.img : BASE_IMG_URL+'/headImg.png'" mode=""></image>
				</view>
				<view class="con_main">
					<view class="main_first">
						<view class="first_left">
							<view>{{item.staff.name}}</view>
							<view class="fontColor">{{item.staff.post?item.staff.post:''}}</view>
						</view>
						<view class="iconfont"><text>{{item.createtime}}</text></view>
					</view>
					<view class="main_second">
						<view>{{item.content}}</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="commont_list.length == 0">暂无更多</view>
		</view>
		
		<view style="height:100rpx"></view>
		<view class="bottom_nav">
			<view class="bottom_item" @click="publishClick">
				发布评论
			</view>
			<view class="bott_text" @click="lookTip">已读({{readNum}})/<span>未读({{noReadNum}})</span></view>
		</view>
		
		<uni-popup ref="commonChild" type="bottom"  background-color="#fff">
			<view class="textArea">
				<textarea v-model="content" placeholder-style="font-size:24rpx;color:#999;" placeholder="请填写评论" />
				<view class="fabu" @click="$noMultipleClicks(btnPubClick)">
					发布
				</view>
			</view>
		</uni-popup>
		
		<read-or-noread 
			:showRead="showRead" 
			ref="readChild" 
			:readList="readList" 
			:noReadlist="noReadlist"
			:readNum="readNum"
			:noReadNum="noReadNum"
		></read-or-noread>
	</view>
</template>

<script>
	import { netGetCommentList, netAddComment, netWorkDetail, netSetForm, netWorkisRead } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import readOrNoread from './readOrnoread.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
			formItem,
			readOrNoread
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				autoHeight:true,
				info:{},
				listForm:null,
				commont_list:[],   //评论列表
				popupShow:false,
				noClick:true,  //防止重复点击
				content:'',
				active:'b',
				typeList:[
					{id:1,name:'日报',value:'daily'},
					{id:2,name:'周报',value:'weekly'},
					{id:3,name:'月报',value:'monthly'},
					{id:4,name:'季报',value:'quarterly'},
					{id:5,name:'年报',value:'yearly'}
				],
				typeValue:'daily',
				//已读  未读
				showRead:false,
				readNum:0,
				readList:[],
				noReadNum:0,
				noReadlist:[]
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
			// 获取  评论 列表
			 this.getCommont()
			//获取 已读  未读 
			this.getReadNum()
		},
		methods:{
			getReadNum() {
				netWorkisRead({id:this.id}).then(res=>{
					this.readList = res.data.read
					this.noReadlist = res.data.not_read
					
					this.readNum = res.data.read.length
					this.noReadNum = res.data.not_read.length
				})
			},
			getForm() {
				netSetForm({type:this.typeValue}).then(res=>{
					let arr = res.data.data
					this.listForm = this.handleFormDefaultValue(arr,this.info)
				})
			},
			getDetail() {
				netWorkDetail({id:this.id}).then(res=>{
					this.info = res.data
					this.handleType(res.data.type)
				})
			},
			handleType(str) {
				let arr = this.typeList
				arr.forEach(ele=>{
					if(ele.name == str){
						this.typeValue = ele.value
					}
				})
				this.getForm()
			},
			getCommont() {
				let params = {
					relation_type:5,
					record_id:this.id
				}
				netGetCommentList(params).then(res=>{
					this.commont_list = res.data
				})
			},
			publishClick() {
				this.$refs.commonChild.open()
			},
			//查看 消息列表
			lookTip() {
				this.$refs.readChild.open()
			},
			//发布 评论
			btnPubClick() {
				if(!this.content){
					uni.showToast({
						title:'请填写评论',
						icon:'none'
					})
					return
				}
				let params = {
					content:this.content,
					record_id: this.id,
					relation_type:5
				}
				netAddComment(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.content = ''
						this.$refs.commonChild.close()
						this.getCommont()
					},2000)
				})
			},
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.title_tit{
		padding-left:30rpx;
		margin:24rpx 0;
		font-size:30rpx;
		color:#333;
	}
	.textarea{
		font-size:30rpx;
	}
	.item_content {
		display: flex;
		background-color: #fff;
		padding: 24rpx;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
		.con_img {
			width: 100rpx;
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}
		}
		.con_main {
			flex: 1;
			.main_first {
				display: flex;
				justify-content: space-between;
				margin-bottom: 25rpx;
				.first_left {
					display: flex;
					:first-child {
						font-size: 32rpx;
						margin-right: 10rpx;
						margin-top: -3rpx;
					}
					:last-child {
						margin-top: 2rpx;
					}
				}
				text {
					font-size: 24rpx;
					color: #666;
					margin-left: 4rpx;
				}
				.main_type{
					padding:5rpx 20rpx;
					border-radius: 10rpx;
					color:#fff;
				}
			}
			.main_third {
				display: flex;
				justify-content: space-between;
				margin: 25rpx 0;
	
				.third_left {
					display: flex;
					align-items: center;
					.icon-setup {
						margin-right: 10rpx;
					}
				}
			}
			.main_fourth {
				padding-bottom: 10rpx;
			}
		}
	}
	.firbg{
		background:#AF99FE;
	}
	.secbg{
		background:#FBB545;
	}
	.thrbg{
		background:#4AD49D;
	}
	.forbg{
		background:#FF6E7F;
	}
	.fivbg{
		background:#54B1F7;
	}
	.work_li{
		width:750rpx;
		background:#fff;
		border-radius: 10rpx;
		padding:40rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		.li_key{
			position: absolute;
			right:5rpx;
			top:5rpx;
			width:10rpx;
			height:10rpx;
			border-radius: 50%;
			background:red;
		}
		.li_left{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size:26rpx;
			color:#333;
			.li_img{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				margin-right:15rpx;
			}
			.li_name{
				font-size:26rpx;
				color:#333;
				margin-bottom:15rpx;
			}
		}
		.li_right{
			.tatus{
				font-size:24rpx;
				color:#fff;
				width:110rpx;
				height:55rpx;
				border-radius: 10rpx;
				text-align: center;
				line-height: 55rpx;
			}
		}
	}
	.detail_tab {
		margin: 20rpx 0 150rpx;
	}
	.comment_list {
		padding: 0rpx 30rpx 30rpx;
	}
	.more_info {
		margin-top: 30rpx;
		width:100%;
		padding-bottom:30rpx;
	}
	.bottom_nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 24rpx;
		background-color: #fff;
		text-align: center;
		color: #999;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-sizing: border-box;
		z-index: 2;
		.bottom_item {
			width:380rpx;
			height:80rpx;
			border-radius: 40rpx;
			text-align: center;
			line-height: 80rpx;
			background:$uni-text-color;
			color:#fff;
			font-size:26rpx;
		}
		.bott_text{
			font-size:24rpx;
			color:$uni-text-color;
			span{
				color:#666;
			}
		}
	} 
	.textArea {
		padding: 30rpx;
		height: 500rpx;
		textarea {
			width:660rpx;
			height: 150rpx;
			padding: 15rpx;
			border-radius: 10rpx;
			font-size:24rpx;
			color:#333;
			border: 1rpx solid #EAEAEA;
			margin:0 auto;
		}
		.fabu {
			width:680rpx;
			height:80rpx;
			border-radius: 40rpx;
			text-align: center;
			line-height: 80rpx;
			background:$uni-text-color;
			color:#fff;
			font-size:26rpx;
			margin:30rpx auto;
		}
	}
</style>
