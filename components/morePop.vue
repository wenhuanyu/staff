<template>
	<view class="container">
		<view class="team_warp">
			<view class="team_left">
				<view class="teamtit title" >团队:</view>
				<scroll-view scroll-x class="teambox">
					<view class="staffheader">
						<view class="people" v-for="(item,index) in staffList" :key="index" >
							<image :src="item.img" class="staffimg"></image>
							<text class="team_name">{{item.name}}</text>
						</view>
					</view>
				</scroll-view>
				<view style="display: inline-block; margin: 0 30rpx;" @click="toCirculate">
					<image :src="BASE_IMG_URL + '/index/double-cancel.png'" style="display: inline-block; width: 20rpx; height: 24rpx;"></image>
				</view>
			</view>
			<view class="team_right" @click="toChuanyue">传阅</view>
			<view class="team_right" @click="toDiscuss">讨论</view>
		</view>
		
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="chuanyuebox">
				<examine-people title="传阅人员" :list="remindPeople" @delItem="delItem" :childType="true"></examine-people>
				<view class="cy_btn" @click="$noMultipleClicks(sureSub)">确认</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netAllCirculateData } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			showMore:{
				type:Boolean,
				default:false
			},
			staffList:{
				type:Array,
				default:()=>{
					return []
				}
			},
			relation_type:{
				type:String,
				default:''
			},
			relation_id:{
				type:Number/String,
				default:null
			},
			remindPeople:{
				type:Array,
				default:()=>[]
			}
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				btnIndex:null,
			}
		},
		created() {
		},
		methods:{
			//传阅
			closePop() {
				this.$refs.popup.close()
				this.$emit('clearRemindlist')
			},
			delItem(index) {
				this.$emit('delExamine',index)
			},
			sureSub() {
				if(this.remindPeople.length == 0) {
					uni.showToast({
						title:'请选择需要传阅的人员',
						icon:'none'
					})
					return
				}
				let arr = []
				this.remindPeople.forEach(ele=>{
					arr.push(ele.id)
				})
				
				let params = {
					relation_type:this.relation_type,
					relation_id:this.relation_id,
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
			//讨论
			toDiscuss() {
				this.btnIndex = 1
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/discuss?id='+this.relation_id+'&type='+this.relation_type
				})
			},
			//团队
			toCirculate() {
				this.btnIndex = 2
				uni.navigateTo({
					url:'/pagesA/afterSales/moreOperation/circulate/index?id='+this.relation_id+'&type='+this.relation_type
				})
			},
			//传阅
			toChuanyue() {
				this.$refs.popup.open()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		width: 750rpx;
		height: 146rpx;
		background: #FFFFFF;
		border: 1px solid #FFFFFF;
		box-shadow: 0px 0px 7rpx 0px rgba(0, 0, 0, 0.15);
	}
	.chuanyuebox{
		width:750rpx;
		padding:30rpx 0;
		.cy_btn{
			width:660rpx;
			height:80rpx;
			border-radius: 40rpx;
			font-size:30rpx;
			color:#fff;
			text-align: center;
			line-height: 80rpx;
			background: $uni-btn-bg-color;
			font-weight: bold;
			margin:35rpx auto;
		}
	}
	.title{
		font-size:26rpx;
		color:#666666;
		padding:24rpx 0 24rpx 70rpx;
		position: relative;
		&::before{
			position: absolute;
			left:36rpx;
			top:30rpx;
			content:'';
			width: 10rpx;
			height: 25rpx;
			background: $uni-text-color;
			border-radius: 5rpx;
		}
	}
	.team_warp{
		width: 750rpx;
		height: 146rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.team_left{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.teamtit{
				font-size:26rpx;
				color:#666;
				margin-right:24rpx;
				margin-left: -8rpx;
			}
			.teambox{
				display: flex;
				align-items: center;
				width:300rpx;
				height: 100rpx;
				.staffheader{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.people{
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						margin-right:15rpx;
						flex-shrink: 0;
						.staffimg{
							width:70rpx;
							height:70rpx;
							border-radius: 50%;
						}
						.text{
							size: 22rpx;
							color: #999;
						}
					}
				}
			}
		}
		.team_right{
			margin-right: 30rpx;
			font-size: 26rpx;
			color: $uni-text-color;
			flex-shrink: 0;
		}
	}
	.morebox{
		width:476rpx;
		height:300rpx;
		padding:35rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.more_btn{
			width:120rpx;
			height:60rpx;
			border-radius: 10rpx;
			font-size:24rpx;
			text-align: center;
			line-height: 60rpx;
			border:1rpx solid #007AFF;
			color:#007AFF;
			margin-right:24rpx;
			margin-bottom:24rpx;
			&:nth-child(3n){
				margin-right:0;
			}
		}
		.btn_active{
			background:#007AFF;
			color:#fff;
		}
	}
</style>
