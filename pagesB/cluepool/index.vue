<template>
	<view>
		<!-- 顶部导航栏 -->
		<view class="select_warp">
			<view class="manage_tab">
				<view class="tab_array">
					<image :src="BASE_IMG_URL+'/index/search.png'" mode="scaleToFill"></image>
					<input type="text" :class="name ? 'valueactive' : '' " @confirm="doSearch" v-model="name"
						placeholder="线索名称" class="li_box" />
				</view>
				<view class="tab_screen" @click="toQuery">
					<image :src="BASE_IMG_URL+'/index/shaixuan.png'" mode="scaleToFill"></image>
				</view>
				<view class="tab_screen" @click="showSelect = !showSelect">分配</view>
			</view>
		</view>
		<!-- 内容模块 -->
		<view class="clues_content">
			<view class="clues_item" v-for="(item,index) in list" :key="index">
				<view class="info_main" @click="moreClick(item,index)">
					<radio :value="String(item.id)" :checked="item.isSelect" v-if="showSelect" color="#008EFF" />
					<view class="main_left" >
						<view class="left_followUp">
							<view style="color: #333333; font-size: 34rpx;">{{item.name ? item.name : '--'}}</view>
						</view>
						<view class="left_followUp">
							<view>下次跟进时间：{{item.next_time ? item.next_time : '--'}}</view>
						</view>
						<view class="left_star">
							<view>客户星级：</view>
							<view>
								<uni-rate :size="18" readonly :value="item.level" />
							</view>
						</view>
						<view class="left_foot">
							<view class="l_box">
								<span>{{item.source ? item.source : '--'}}</span>
							</view>
						</view>
					</view>
				</view>
				<view class="info_footer">
					<view class="footer_content" @click="newFollowClick(item.id,4)">
						<image :src="BASE_IMG_URL+'/index/add.png'" mode="scaleToFill"></image>
						<view>跟进</view>
					</view>
					<view class="footer_content" @click="toReceive(item)">
						<image :src="BASE_IMG_URL+'/index/get.png'" style="width:45rpx;height:45rpx;" mode="scaleToFill"></image>
						<view>领取</view>
					</view>
					<view class="footer_content" @click="toCall(item.mobile)">
						<image :src="BASE_IMG_URL+'/index/phone-call.png'" mode="scaleToFill"></image>
						<view>电话</view>
					</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
		<view style="height: 200rpx;"></view>
		<!-- 全选 -->
		<view class="bottomli" v-if="showSelect">
			<view class="botselect">
				<view class="se_text" v-if="!allSelect" @click="selectAll">全选</view>
				<view class="se_text" v-else @click="removeSelect">取消全选</view>
			</view>
			<view class="remove btn" @click="showSelect = false">取消</view>
			<view class="sure btn" @click="queding">确定</view>
		</view>
		
		<view class="btn_fix" @click="newCluesClick">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'" mode="scaleToFill"></image>
		</view>
		
		<!-- 筛选 -->
		<screen-pop 
			ref="screenChild" 
			@sureParams="sureParams"
			:searchForm="searchForm"
			@changeSearchData="changeSearchData"
			@resetForm="resetForm"
		></screen-pop>
	</view>
</template>

<script>
	import {netCluesPoolList, netReceiveCluesPool, netAllDistriCluesPool } from '@/api/api.js'
	import {BASE_IMG_URL} from '@/api/http.js'
	import screenPop from './screen.vue'
	
	export default {
		components:{
			screenPop
		},
		data() {
			return {
				page: 1,
				limit: 10,
				totalPage: 1,
				list: [],
				BASE_IMG_URL: BASE_IMG_URL,
				name: '',
				queryParams:{},
				searchForm:null,
				//是否全选
				allSelect:false,
				showSelect:false,
			}
		},
		onLoad(options) {
			this.handleSearchForm('business',(data)=>{
				this.searchForm = data
			})
		},
		onShow() {
			this.init()
		},
		onHide() {
			this.showSelect = false
			this.allSelect = false
		},
		onReachBottom() {
			if (this.page >= this.totalPage) {
				return
			}
			this.page++
			this.getList()
		},
		methods: {
			toQuery() {
				this.$refs.screenChild.open()
			},
			sureParams(params) {
				this.queryParams = params
				this.init()
			},
			changeSearchData(type,key,value){
				let obj = this.handleChangeSearchValue(this.searchForm,type,key,value)
				this.$set(this.searchForm, obj.v_index, obj.v_obj)
			},
			resetForm() {
				let arr = JSON.parse(JSON.stringify(this.handleResetSearch(this.searchForm)))
				this.searchForm = arr
			},
			//全选
			selectAll() {
				this.allSelect = true
				let arr = this.list
				arr.forEach(ele=>{
					ele.isSelect = true
				})
				this.list = arr
			},
			//取消全选
			removeSelect() {
				this.allSelect = false
				let arr = this.list
				arr.forEach(ele=>{
					ele.isSelect = false
				})
				this.list = arr
			},
			//确定分配
			queding() {
				let arr = []
				this.list.forEach(ele=>{
					if(ele.isSelect){
						arr.push(ele.id)
					}
				})
				if(arr.length == 0) {
					uni.showToast({
						title:'请选择需要分配的线索',
						icon:'none'
					})
					return
				}
				uni.navigateTo({
					url:'/pagesB/cluepool/transfer?ids='+arr
				})
			},
			init() {
				this.page = 1
				this.totalPage = 1
				this.list = []
				setTimeout(()=>{
					this.getList()
				},200)
			},
			//搜索
			doSearch() {
				this.init()
			},
			// 跟进
			newFollowClick(id, type) {
				uni.navigateTo({
					url: '/pagesB/cluesManagement/newFllow?id=' + id + '&type=' + type
				})
			},
			// 查看详情
			moreClick(item,index) {
				if(this.showSelect){
					let obj = this.list[index]
					obj.isSelect = true
					this.$set(this.list,index,obj)
					return
				}
				uni.navigateTo({
					url: '/pagesB/cluepool/clueDetail?id=' + item.id
				})
			},
			// 新建线索
			newCluesClick() {
				uni.navigateTo({
					url: '/pagesB/cluepool/addCluePool'
				})
			},
			//线索 列表 
			getList() {
				let params = {
					page: this.page,
					limit: this.limit,
					name: this.name,
					createtime: (this.start_time && this.end_time) ? (this.start_time + ',' + this.end_time) : '',
					...this.handleSureSearch(this.searchForm),
					...this.queryParams,
				}
				netCluesPoolList(params).then(res => {
					let arr = res.data.data
					arr.forEach(ele=>{
						ele.isSelect = false
					})
					this.list = this.list.concat(arr)
					this.totalPage = res.data.last_page
				})
			},
			// 电话
			toCall(phone) {
				if(!phone){
					uni.showToast({
						title:'暂无联系方式',
						icon:'none'
					})
					return
				}
				// #ifdef MP-ALIPAY
				dd.showCallMenu({
					phoneNumber: phone, // 期望拨打的电话号码
					code: '+86', // 国家代号，中国是+86
				})
				// #endif
				// #ifndef MP-ALIPAY || APP-PLUS
				uni.makePhoneCall({
					phoneNumber: phone
				})
				// #endif
				// #ifdef APP-PLUS
				plus.device.dial(phone, true);
				// #endif
			},
			//领取
			toReceive(item) {
				uni.showModal({
					title:'提示',
					content:'请确认是否领取?',
					complete:(data)=>{
						if(data.confirm){
							netReceiveCluesPool({id:item.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									this.init()
								},2000)
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.bottomli {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 750rpx;
		height: 120rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background: #fff;
		border-top: 1rpx solid #EAEAEA;
		.botselect{
			display: flex;
			justify-content: center;
			align-items: center;
			.se_text{
				font-size:26rpx;
				color:$uni-text-color;
			}
		}
		.btn {
			width: 240rpx;
			height: 80rpx;
			font-size: 24rpx;
			color: #666666;
			text-align: center;
			line-height: 80rpx;
			border-radius: 40rpx;
		}
	
		.sure {
			background: $uni-text-color;
			color: #fff;
		}
	
		.remove {
			border: 1rpx solid $uni-text-color;
			color: $uni-text-color;
			line-height: 78rpx;
		}
	}
	.left_foot {
		padding-bottom: 20rpx;
		margin: 20rpx 0;

		.l_box {
			margin-right: 35rpx;
			float: left;

			span {
				background: $uni-bg-opacity;
				padding: 5rpx 12rpx;
				font-size: 26rpx;
				color: $uni-text-color;
				border-radius: 5rpx;
			}
		}
	}

	.valueactive {
		color: #333;
	}

	.select_warp {
		z-index: 9;
		position: relative;
	}

	.searchbox {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: $uni-text-color;
		display: flex;
		justify-content: space-around;
		margin-bottom: 40rpx;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 1;

		.tab_array {
			display: flex;
			justify-content: flex-start;
			padding:0 15rpx;
			background: #fff;
			border-radius: 34rpx;
			height: 68rpx;
			width: 467rpx;
			image {
				width: 48rpx;
				height: 47rpx;
			}
			input {
				line-height: 68rpx;
				height: 68rpx;
				width:380rpx;
			}
		}
		.searchtext {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			color: #999;
			margin-right: 55rpx;
		}
	}

	.manage_tab {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: $uni-text-color;
		display: flex;
		justify-content: space-around;
		align-items: center;
		z-index: 1;

		.tab_array {
			display: flex;
			background: #fff;
			border-radius: 34rpx;
			height: 68rpx;
			width: 467rpx;
			overflow: hidden;

			image {
				width: 50rpx;
				height: 50rpx;
				margin: 8rpx 15rpx 0 28rpx;
			}

			input {
				line-height: 68rpx;
				height: 68rpx;
			}
		}

		.tab_screen {
			display: flex;
			color:#fff;
			image {
				width: 37rpx;
				height: 30rpx;
			}
		}
	}
	.clues_content {
		.clues_item {
			background-color: #fff;
			border-radius: 10rpx;
			margin-top: 20rpx;
			padding: 20rpx 24rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0, 0, 0, 0.1);

			.info_head {
				display: flex;
				justify-content: space-between;

				:first-child {
					font-size: 28rpx;
					font-weight: 700;
					color: #333;
				}

			}

			.info_main {
				display: flex;
				justify-content: flex-start;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #ededed;

				.main_left {
					margin-left:24rpx;
					.left_followUp {
						display: flex;
						font-size: 30rpx;
						color: #666;
						margin: 20rpx 0;
					}

					.left_star {
						display: flex;
						padding-bottom: 20rpx;
						font-size: 30rpx;
						color: #666;
					}
				}

				.main_right {
					text-align: center;
					padding: 20rpx 20rpx 0 0;

					image {
						width: 129rpx;
						height: 129rpx;
						margin-bottom: 5rpx;
						border-radius: 50%;
					}
				}
			}

			.info_footer {
				display: flex;
				justify-content: space-around;
				padding-top: 30rpx;
				height: 80rpx;

				.footer_content {
					line-height: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 48rpx;
						height: 48rpx;
						margin-right: 15rpx;
					}
				}
			}
		}
	}

	.btn_fix {
		position: fixed;
		bottom: 100rpx;
		right: 80rpx;

		image {
			width: 80rpx;
			height: 80rpx;

			background-color: #fff;
			border-radius: 40rpx;
		}
	}
</style>
