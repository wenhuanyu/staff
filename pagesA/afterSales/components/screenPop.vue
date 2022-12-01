<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="title">筛选</view>
			<scroll-view scroll-y class="scrollbox">
				<view class="scr_warp">
					<uni-collapse @change="onChange" ref="collapse" v-model="activeNames">
						<uni-collapse-item title="工单进度" name="key0">
							<view class="listwarp">
								<view 
									class="li" 
									:class="index == tabIndex ?'liactive':''" 
									@click="changeStatus(index)" 
									v-for="(item,index) in tabList" 
									:key="index">{{item.name}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="客户" name="key1">
							<view class="listwarp_thr">
								<view class="li" :class="customerObj ?'liactive':''" @click="toSelectCustomer">
									{{customerObj ? customerObj.name : '选择客户'}}
									<view class="clearStaff" v-if="customerObj" @click.stop="clearCustomer">×</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="所属员工" name="key2">
								<view class="listwarp">
									<view class="li" :class="staffObj ?'liactive':''" @click="toSelectStaff" >
										{{staffObj ? staffObj.name : '选择员工'}}
										<view class="clearStaff" v-if="staffObj" @click.stop="clearStaff">×</view>
									</view>
								</view>
						</uni-collapse-item>
						<uni-collapse-item title="工单所属" name="key4">
							<view class="listwarp">
								<view 
									class="li" 
									:class="type == index ?'liactive':''" 
									@click="changeType(index)" 
									v-for="(item,index) in typeList" 
									:key="index">{{item}}</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="工单类型" name="key5">
							<view class="listwarp_two">
								<view 
									class="li" 
									:class="item.field == typeName ?'liactive':''" 
									@click="changeFollow(item)" 
									v-for="(item,index) in visitType" 
									:key="index">{{item.field}}</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</scroll-view>
			<view class="screenbot">
				<view class="screenbtn" @click="reset">重置</view>
				<view class="screenbtn surebtn" @click="sure">确认</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import { netSelect } from '@/api/api.js'
	import { netTemplateList } from '@/api/template.js'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	
	export default {
		mixins:[commonFun],
		props: {
			typeName:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				drWidth:uni.upx2px(660),
				activeNames:[],
				address:[],   //客户所在 地区
				//工单所属
				typeList:['全部','我的客户','下属的客户'],
				type:null,
				visitType:[],   //工单类型
				tabList:[
					{id:1,name:'待处理'},
					{id:2,name:'处理中'},
					{id:3,name:'已完成'}
				],  //状态列表
				tabIndex:null
			}
		},
		computed:mapState({
			customerObj: state => state.customer.customerobj,
			staffObj: state => state.customer.staffObj
		}),
		created() {
			//类型
			this.getType()
		},
		methods: {
			open() {
				this.$refs.showRight.open()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			onchangeAddress(e) {
				let arr = e.detail.value
				if(arr.length){
					this.address = [arr[0].text,arr[1].text,arr[2].text]
				}
			},
			getType() {
				netTemplateList({type:'工单类型'}).then(res=>{
					this.visitType = res.data.template
				})
			},
			changeFollow(item) {
				this.$emit('changeTypeName',item.field)
			},
			changeAddress(e) {
				this.address = e.detail.value
			},
			changeType(e) {
				this.type = e
			},
			changeStatus(index) {
				this.tabIndex = index
			},
			reset() {
				this.address = []
				this.type = null
				this.$store.commit('CUSTOMEROBJ',null)
				this.$store.commit('STAFFOBJ',null)
				this.$emit('changeTypeName','')
				this.tabIndex = null
			},
			sure() {
				let params = {
					prov:this.address ? this.address[0] : '',
					city:this.address ? this.address[1] : '',
					area:this.address ? this.address[2] : '',
					type:this.type,
					customer_id: this.customerObj ? this.customerObj.id : null,
					staff_id: this.staffObj ? this.staffObj.id : null,
					workorder_type:this.typeName,
					status: this.tabList[this.tabIndex]?this.tabList[this.tabIndex].id:'',
				}
				this.$refs.showRight.close()
				this.$emit('sureQuery',params)
			},
			onChange(e) {
				this.activeNames = e
				this.init()
			},
			clearStaff() {
				this.$store.commit('STAFFOBJ',null)
			},
			clearCustomer() {
				this.$store.commit('CUSTOMEROBJ',null)
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.listwarp_two{
		width:600rpx;
		margin:0 auto;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		.li{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 172rpx;
			height: 54rpx;
			background: #ededed;
			border: 1rpx solid #ededed;
			border-radius: 10rpx;
			font-size:28rpx;
			color:#999;
			margin-right:20rpx;
			margin-bottom:20rpx;
		}
		.liactive{
			color:#666;
			background:#fff;
			border: 1px solid $uni-btn-bg-color;
		}
	}
	.listwarp_thr{
		width:600rpx;
		margin:0 auto;
		padding:25rpx 0;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		.li{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 54rpx;
			background: #ededed;
			border: 1rpx solid #ededed;
			border-radius: 10rpx;
			font-size:28rpx;
			color:#999;
			padding:0 15rpx;
			margin-right:20rpx;
			margin-bottom:20rpx;
			position: relative;
			.clearStaff{
				position: absolute;
				right:-20rpx;
				top:-20rpx;
				font-size:28rpx;
				width:40rpx;
				height:40rpx;
				background:rgba(0,0,0,0.5);
				border-radius: 50%;
				text-align: center;
				line-height: 38rpx;
				color:#fff;
			}
		}
		.liactive{
			color:#666;
			background:#fff;
			border: 1px solid $uni-btn-bg-color;
		}
	}
	.title{
		font-size:28rpx;
		color:#999;
		padding:25rpx 34rpx;
	}
	.scrollbox{
		width:660rpx;
		height:calc(100vh - 210rpx);
		background:#fff;
		.scr_warp{
			width:660rpx;
			background:#fff;
			.listwarp{
				width:600rpx;
				margin:0 auto;
				padding:25rpx 0;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.li{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 172rpx;
					height: 54rpx;
					background: #ededed;
					border: 1rpx solid #ededed;
					border-radius: 10rpx;
					font-size:28rpx;
					color:#999;
					margin-right:20rpx;
					margin-bottom:20rpx;
					position: relative;
					&:nth-child(3n){
						margin-right:0;
					}
					.clearStaff{
						position: absolute;
						right:-20rpx;
						top:-20rpx;
						font-size:28rpx;
						width:40rpx;
						height:40rpx;
						background:rgba(0,0,0,0.5);
						border-radius: 50%;
						text-align: center;
						line-height: 38rpx;
						color:#fff;
					}
				}
				.liactive{
					color:#666;
					background:#fff;
					border: 1px solid $uni-btn-bg-color;
				}
			}
			.address_warp{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:24rpx;
				border-top:1rpx solid #ededed;
				border-bottom:1rpx solid #ededed;
				.address_li{
					color:#999;
				}
			}
			.time_warp{
				display: flex;
				justify-content: center;
				align-items: center;
				.timebox{
					width: 172rpx;
					height: 54rpx;
					border-radius: 10rpx;
					text-align: center;
					line-height: 50rpx;
					font-size:27rpx;
					color:#666;
					border:1rpx solid $uni-btn-bg-color;
				}
				.xian{
					width:85rpx;
					height:7rpx;
					background:#ededed;
					margin:0 20rpx;
				}
				.timeactive{
					background:#0287FF;
					color:#fff;
				}
			}
		}
	}
	.screenbot{
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		height:120rpx;
		padding-bottom:30rpx;
		.screenbtn{
			width: 229rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1px solid #999999;
			border-radius: 10rpx;
			text-align: center;
			line-height: 60rpx;
			font-size:26rpx;
			color:#999;
		}
		.surebtn{
			border: 1px solid $uni-btn-bg-color;
			background:#fff;
			color:$uni-text-color;
		}
	}
</style>
