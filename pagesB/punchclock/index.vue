<template>
	<view class="profile_fun">
		<punch-clock v-if="tabType == 1 && lat && lng" :lat="lat" :lng="lng" ref="clockChild"></punch-clock>
		<punch-statis v-show="tabType == 2" ref="statisChild"></punch-statis>
		<card-list v-show="tabType == 3" @changeType="changeType" ref="cardChild"></card-list>
		<leave-list v-show="tabType == 4" ref="leaveChild"></leave-list>
		<punch-rules v-show="tabType == 5" ref="rulesChild"></punch-rules>
		
		<view class="tabbox_out">
			<view class="tabbox">
				<view class="tab_li" @click="changeTab(item.type)" v-for="(item,index) in tabList" :key="index">
					<image :src="tabType == item.type?item.icon_active:item.icon" class="tabimg" mode=""></image>
					<view class="tab_text">{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import punchClock from './punchClock.vue'
	import punchStatis from './punchstatis/index.vue'
	import cardList from './card/index.vue'
	import leaveList from './leave/index'
	import punchRules from './clockrules/index'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { netGetUserInfo } from '@/api/user.js'
	
	export default{
		components:{
			punchClock,
			punchStatis,
			cardList,
			leaveList,
			punchRules
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				tabList:[
					{
						type:1,
						name:'打卡',
						icon:BASE_IMG_URL+'/c_daka.png',
						icon_active:BASE_IMG_URL+'/c_daka_a.png'
					},
					{
						type:2,
						name:'统计',
						icon:BASE_IMG_URL+'/c_tongji.png',
						icon_active:BASE_IMG_URL+'/c_tongji_a.png'
					},
					{
						type:3,
						name:'补卡',
						icon:BASE_IMG_URL+'/c_buka.png',
						icon_active:BASE_IMG_URL+'/c_buka_a.png'
					},
					{
						type:4,
						name:'请假',
						icon:BASE_IMG_URL+'/c_qingjia.png',
						icon_active:BASE_IMG_URL+'/c_qingjia_a.png'
					},
					{
						type:5,
						name:'规则',
						icon:BASE_IMG_URL+'/c_guize.png',
						icon_active:BASE_IMG_URL+'/c_guize_a.png'
					},
				],
				tabType:1,
				role_type:1,  //9是 管理员   可以改打卡退则
				lng:'',
				lat:'',
			}
		},
		onLoad() {
			//获取登录者 权限
			this.getUserInfo()
			//获取位置信息
			this.getPunch()
		},
		onUnload() {
			// #ifdef MP-WEIXIN
			// wx.offLocationChange()
			// #endif
			// this.$refs.clockChild.close()
		},
		onShow() {
			this.changeTab(this.tabType)
		},
		methods:{
			getPunch() {
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					altitude: true,
					success:(data)=>{
						console.log(data,'经纬度')
						this.lng = data.longitude
						this.lat = data.latitude
					},
					fail: (err) => {
						console.log(err,'====')
						uni.showToast({
							title:'次数频繁，请稍后再试',
							icon:'none'
						})
					}
				})
			},
			getUserInfo() {
				netGetUserInfo().then(res=>{
					this.role_type = res.data.role_type
				})
			},
			changeType() {
				this.changeTab(2)
			},
			changeTab(type) {
				this.tabType = type
				if(type == 1) {
					uni.setNavigationBarTitle({
						title:'打卡'
					})
				}else if(type == 2){
					this.$refs.statisChild.getNowTime()
					uni.setNavigationBarTitle({
						title:'统计'
					})
				}else if(type == 3){
					this.$refs.cardChild.init()
					uni.setNavigationBarTitle({
						title:'补卡'
					})
				}else if(type==4){
					this.$refs.leaveChild.init()
					uni.setNavigationBarTitle({
						title:'请假'
					})
				}else{
					this.$refs.rulesChild.getList()
					uni.setNavigationBarTitle({
						title:'规则'
					})
				}
			},
			//正常打卡
			toNormal() {
				uni.navigateTo({
					url:'/pagesB/punchclock/normalClock'
				})
			},
			//外出打卡
			toOutClock() {
				uni.navigateTo({
					url:'/pagesB/punchclock/punchOut'
				})
			},
			//打卡统计
			toStatis() {
				uni.navigateTo({
					url:'/pagesB/punchclock/punchstatis/index'
				})
			},
			//打卡规则
			toRules() {
				uni.navigateTo({
					url:'/pagesB/punchclock/clockrules/index'
				})
			},
			//补卡
			toCard() {
				uni.navigateTo({
					url:'/pagesB/punchclock/card/index'
				})
			},
			//请假
			toLeave() {
				uni.navigateTo({
					url:'/pagesB/punchclock/leave/index'
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.profile_fun {
		background-color: #fff;
		.profile_item {
			display: flex;
			background:#fff;
			color:#666;
			padding: 0 30rpx;
			justify-content: space-between;
			border-bottom:1rpx solid #f5f5f5;
			height: 110rpx;
			line-height: 110rpx;
			font-size: 28rpx;
			.itemleft{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.leftimg{
					height:25px;
					width:25px;
					margin-right:25rpx;
				}
			}
		}
	}
	.tabbox_out{
		width:750rpx;
		height: calc(100rpx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);
		background:#fff;
		border-top: 1rpx solid #eeeeee;
		position: fixed;
		left:0; 
		bottom:0;
		.tabbox{
			width: 100%;
			height: calc(100rpx + env(safe-area-inset-bottom) / 2);
			display: flex;
			align-items: center;
			justify-content: space-around;
			.tab_li {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				flex: 1;
				position: relative;
				.tabimg {
					width: 50rpx;
					height: 50rpx;
				}
				.tab_text {
					font-size: 20rpx;
				}
			}
		}
	}
</style>