<template>
	<view>
		<view class="spart_info">
			<view class="spart_left">
				<view class="sp_text">名称：{{info.name}}</view>
				<view class="sp_text">编号：{{info.num}}</view>
				<view class="sp_text">单价：￥<span>{{info.price}}</span></view>
			</view>
			<view class="spart_right">
				<view class="spart_num">{{info.stock ? info.stock : 0}}</view>
				<view class="spartp">库存</view>
			</view>
		</view>
		<view class="part_title">
			<view class="title">库存变更记录</view>
			<view class="rightbox" @click="shaiXuan">
				{{tablist[btnindex] && tablist[btnindex].name}}
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="shaixuan"></image>
			</view>
		</view>
		<view class="table">
			<view class="table_header">
				<view class="table_td" style="width:180rpx;">编号</view>
				<view class="table_td">操作人</view>
				<view class="table_td" style="width:60rpx;">数量</view>
				<view class="table_td">类型</view>
				<view class="table_td" style="width:222rpx">时间</view>
			</view>
			<view class="table_body" v-for="(item,index) in partData" :key="index">
				<view class="table_th" style="width:180rpx;">{{item.odd_numbers}}</view>
				<view class="table_th">{{item.create_staff.name}}</view>
				<view class="table_th" style="width:60rpx;">{{item.number}}</view>
				<view class="table_th">{{item.type == 1 ? '入库' : '出库'}}</view>
				<view class="table_th" style="width:222rpx">{{item.storage_time}}</view>
			</view>
		</view>
		
		<uni-popup ref="Screenpopup" type="center" background-color="#fff" @touchmove.stop.prevent>
			<view style="border-radius: 20rpx;">
				<view class="popuptitle">筛选项</view>
				<view class="list_warp">
					<view class="list_li" :class="btnindex == index ? 'li_active' : ''" v-for="(item,index) in tablist" :key="index" @click="changeSelect(index)">
						<view class="li_cir"></view>
						<view class="li_text">{{item.name}}</view>
					</view>
					<view class="list_bot">
						<view class="bot_btn btnfir" @click="reset">重置</view>
						<view class="bot_btn btnsec" @click="sure">确定</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<view style="height:100rpx"></view>
		<view class="newbot" @click="lookMore">
			<image :src="BASE_IMG_URL+'/index/more-operation.png'" class="moreimg" mode=""></image>
			更多
		</view>
		<more-operation
			ref="moreChild"
			:info="info"
		></more-operation>
		<uni-popup ref="Botpopup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="chuanyuebox">
				<examine-people title="传阅人员" :list="remindPeople" @delItem="delItem" :childType="true"></examine-people>
				<view class="cy_btn" @click="$noMultipleClicks(sureSub)">确认</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netPartDetail, netPartEditRecord, netAllCirculateData } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { commonFun } from '@/common/navigate.js'
	import moreOperation from './more-operation.vue'
	
	export default{
		mixins:[commonFun],
		components:{
			moreOperation
		},
		data(){
			return{
				noClick:true,    //防止  重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				info:{},
				partData:[],
				btnindex:0,
				show:false,
				tablist:[
					{id:0,name:'全部'},
					{id:1,name:'入库'},
					{id:2,name:'出库'}
				],
				tabIndex:0,
				remindPeople:[],
				examineType:'',
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getPartDetail()
			this.getRecord()
		},
		onShow() {
			this.getDefaultRemind()
		},
		methods:{
			lookMore() {
				this.$refs.moreChild.open()
			},
			closePop() {
				this.$refs.Botpopup.close()
			},
			sureSub() {
				let arr = []
				this.remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				let params = {
					relation_type:'parts',
					relation_id:this.id,
					staff_id:arr.join(',')
				}
				netAllCirculateData(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						this.closePop()
					},2000)
				})
			},
			changeSelect(index) {
				this.btnindex = index
			},
			//筛选
			shaiXuan() {
				this.$refs.Screenpopup.open()
			},
			reset() {
				this.btnindex = 0
				this.$refs.Screenpopup.close()
				this.getRecord()
			},
			sure() {
				this.$refs.Screenpopup.close()
				this.getRecord()
			},
			getRecord() {
				let params = {
					parts_id: this.id,
					type: this.btnindex
				}
				netPartEditRecord(params).then(res=>{
					this.partData = res.data
				})
			},
			getPartDetail() {
				netPartDetail({id:this.id}).then(res=>{
					this.info = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chuanyuebox{
		width:750rpx;
		padding:30rpx 0;
		.cy_btn{
			width:400rpx;
			height:80rpx;
			border-radius: 40rpx;
			font-size:30rpx;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			background:$uni-text-color;
			font-weight: bold;
			margin:35rpx auto;
		}
	}
	.spart_info{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:24rpx 55rpx;
		.spart_left{
			flex:1;
			.sp_text{
				font-size:28rpx;
				color:#666666;
				margin-bottom:15rpx;
				span{
					font-size:26rpx;
					color:#F25340;
				}
			}
		}
		.spart_right{
			flex-shrink: 0;
			.spart_num{
				width:120rpx;
				height:120rpx;
				border-radius: 10rpx;
				font-size:30rpx;
				color:$uni-text-color;
				background:$uni-bg-opacity;
				text-align: center;
				line-height: 120rpx;
			}
			.spartp{
				font-size:26rpx;
				color:#999999;
				text-align: center;
			}
		}
	}
	.part_title{
		padding:24rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top:1rpx solid #f5f5f5;
		.title{
			font-size:34rpx;
			color:#333333;
		}
		.rightbox{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:28rpx;
			color:#666666;
			.shaixuan{
				width:42rpx;
				height:35rpx;
			}
		}
	}
	.table{
		width:700rpx;
		margin:0 auto;
		border-top:1rpx solid #eaeaea;
		border-left:1rpx solid #eaeaea;
		.table_header{
			display: flex;
			background:$uni-bg-opacity;
			.table_td{
				width:120rpx;
				height:60rpx;
				font-size:24rpx;
				color:$uni-text-color;
				text-align: center;
				line-height: 59rpx;
				border-right:1rpx solid #eaeaea;
				border-bottom:1rpx solid #eaeaea;
			}
		}
		.table_body{
			display: flex;
			.table_th{
				width:120rpx;
				font-size:24rpx;
				color:#333;
				text-align: center;
				padding:15rpx 0;
				border-right:1rpx solid #eaeaea;
				border-bottom:1rpx solid #eaeaea;
				word-wrap:break-word;
			}
		}
	}
	.list_warp{
		padding:0 30rpx 30rpx;
		border-top:1rpx solid #f5f5f5;
		.list_li{
			padding:20rpx 45rpx;
			border-bottom:1rpx solid #f5f5f5;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.li_cir{
				width:23rpx;
				height:23rpx;
				border-radius: 50%;
				background:#fff;
				margin-right:35rpx;
			}
			.li_text{
				font-size:30rpx;
				color:#999999;
			}
		}
		.li_active{
			.li_cir{
				background:$uni-text-color;
			}
			.li_text{
				color:$uni-text-color;
			}
		}
		.list_bot{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top:30rpx;
			.bot_btn{
				width:300rpx;
				height:68rpx;
				border-radius: 28rpx;
				font-size:30rpx;
				text-align: center;
				color:$uni-text-color;
				border:1rpx solid $uni-text-color;
			}
			.btnfir{
				line-height: 66rpx;
			}
			.btnsec{
				background:$uni-text-color;
				color:#fff;
				line-height: 68rpx;
			}
		}
	}
	
	.spare_bot{
		width:750rpx;
		background:#fff;
		height:100rpx;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		left:0;
		bottom:0;
		.spare_btn{
			width:160rpx;
			height:60rpx;
			font-size:26rpx;
			text-align: center;
			line-height: 60rpx;
			border-radius: 20rpx;
		}
		.sparebtnfir{
			background:$uni-text-color;
			color:#fff;
		}
		.sharebtnsec{
			background:#F2533E;
			color:#fff;
		}
	}
</style>
