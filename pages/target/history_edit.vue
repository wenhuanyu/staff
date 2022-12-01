<template>
	<view>
		<view class="sales_head">
			<picker @change="changeTime" :value="valueTime" :range-key="'name'" :range="optionsTime">
				<view class="tablist">
					<view>{{optionsTime[valueTime] ? optionsTime[valueTime].name : '时间'}}</view>
					<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg"  mode="scaleToFill"></image>
				</view>
			</picker>
			<picker @change="changeMoney" :value="valueMoney" :range-key="'text'" :range="optionsMoney">
				<view class="tablist">
					<view>{{optionsMoney[valueMoney] ? optionsMoney[valueMoney].text : '金额'}}</view>
					<image :src="BASE_IMG_URL+'/xia.png'" class="bottomimg"  mode="scaleToFill"></image>
				</view>
			</picker>
		</view>
		<view class="his_warp">
			<!-- 时间  状态  审核人  金额  查看详情 -->
			<view class="his_li" @click="jumpDetail(item)" v-for="(item,index) in list" :key="index">
				<view class="his_top">
					<image :src="item.staff.img ? item.staff.img : BASE_IMG_URL+'/headImg.png'" class="headerimg"  mode="scaleToFill"></image>
					<view class="name">
						<view>{{item.staff.name}}</view>
						<view class="post">职位</view>
					</view>
				</view>
				<view class="his_bot">
					<view class="his_status">{{statusArr[item.check_status]}}</view>
					<view class="his_right">{{item.yeartarget}}</view>
				</view>
			</view>
			<view style="height: 200rpx;"></view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
	</view>
</template>

<script>
	import { netGetTargetSelect, netGetRecordList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	export default{
		data() {
			return{
				optionsMoney: [{
						text: '销售金额',
						value: 1
					},
					{
						text: '回款金额',
						value: 2
					},
					{
						text: '获客目标',
						value: 3
					},
					{
						text: '拜访目标',
						value: 4
					}
				],
				statusArr:['待审核','审核中','审核通过','审核未通过','撤销'],
				optionsTime:[],
				valueTime:0,
				valueMoney: 0,
				list:[],
				page:1,
				totalPage:1,
				size:10,
				BASE_IMG_URL:BASE_IMG_URL,
				type:3,  //3员工 2团队
			}
		},
		onLoad(options) {
			this.type = options.type
		},
		onShow() {
			this.list = []
			this.page = 1
			this.getSelect()
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getRList()
		},
		methods:{
			getSelect() {
				netGetTargetSelect().then(res=>{
					res = res.data.years
					res.forEach((ele,index)=>{
						if(ele.selected){
							this.valueTime = index
						}
					})
					this.optionsTime = res
					//获取记录
					this.getRList()
				})
			},
			getRList() {
				let params = {
					year:this.optionsTime[this.valueTime].name,
					status: this.optionsMoney[this.valueMoney].value,
					page:this.page,
					type:this.type
				}
				netGetRecordList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			jumpDetail(item) {
				uni.navigateTo({
					url:'/pages/target/history_detail?id='+item.id
				})
			},
			changeTime(e) {
				this.valueTime = e.detail.value
				this.list = []
				this.page = 1
				this.getRList()
			},
			changeMoney(e) {
				this.valueMoney = e.detail.value
				this.list = []
				this.page = 1
				this.getRList()
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
	.his_warp{
		padding:20rpx 0;
	}
	.his_li{
		box-sizing: border-box;
		width:702rpx;
		background:#fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 10rpx;
		margin:0 auto 24rpx;
		padding:20rpx 30rpx;
		.his_top{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size:28rpx;
			color:#333;
			.headerimg{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				margin-right:24rpx;
			}
			.name{
				font-size:26rpx;
				color:#333;
				.post{
					font-size:24rpx;
					margin-top:24rpx;
				}
			}
		}
		.his_bot{
			margin-top:24rpx;
			text-align: right;
			.his_status{
				color:$uni-text-color;
			}
			.his_right{
				font-size:26rpx;
				color:#666;
				margin-top:24rpx;
			}
		}
	}
	.sales_head{
		border-top:1rpx solid #CCC;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding:20rpx 24rpx;
		background:#fff;
		.tablist{
			padding:20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:28rpx;
			color:#333;
			.bottomimg{
				width:20rpx;
				height:33rpx;
				margin-left:20rpx;
			}
		}
	}
</style>
