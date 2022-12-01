<template>
	<view>
		<!-- 顶部导航栏 -->
		<view class="select_warp">
			<view class="manage_tab">
				<view class="tab_array">
					<image :src="BASE_IMG_URL+'/index/search.png'" mode="scaleToFill"></image>
					<input type="text" :class="name ? 'valueactive' : '' " @input="searchName" v-model="name"
						placeholder="线索名称" class="li_box" />
				</view>
				<view class="tab_screen" @click="toSearch">
					<image :src="BASE_IMG_URL+'/index/shaixuan.png'" mode="scaleToFill"></image>
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" style="width:750rpx;padding:0 24rpx;box-sizing: border-box;background:#fff">
			<view class="tabbox">
				<view class="tabli" v-for="(item,index) in tabList" :key="index" :class="{'tabactive': status == index}"
					@click="changeTab(index)">
					<view class="tabname">{{item}}</view>
					<view class="tabot"></view>
				</view>
			</view>
		</scroll-view>
		<!-- 内容模块 -->
		<view class="clues_content">
			<view class="clues_item" v-for="(item,index) in list" :key="index">
				<view class="info_head">
					<view style="width: #333333; font-size: 34rpx;">{{item.name ? item.name : '--'}}</view>
				</view>
				<view class="info_main" @click="moreClick(item)">
					<view class="main_left">
						<view class="left_followUp">
							<view>下次跟进时间：{{item.next_time ? item.next_time : '--'}}</view>
						</view>
						<view class="left_foot">
							<view class="l_box">
								<span>{{item.source ? item.source : '--'}}</span>
							</view>
						</view>
					</view>
					<view class="main_right">
						<image :src="item.owner_staff.img ? item.owner_staff.img : BASE_IMG_URL+'/headImg.png'"
							mode="scaleToFill"></image>
						<view>{{item.owner_staff ? item.owner_staff.name : '--'}}</view>
					</view>
				</view>
				<view class="info_footer">
					<view class="footer_content" @click="newFollowClick(item.id,4)">
						<image :src="BASE_IMG_URL+'/index/add.png'" mode="scaleToFill"></image>
						<view>跟进</view>
					</view>
					<view class="footer_content" @click="getaddCustomer(item.id)">
						<image :src="BASE_IMG_URL+'/index/move-kehu.png'" mode="scaleToFill"></image>
						<view>转客</view>
					</view>
					<view class="footer_content" @click="toCall(item.mobile)">
						<image :src="BASE_IMG_URL+'/index/phone-call.png'" mode="scaleToFill"></image>
						<view>电话</view>
					</view>

				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
		<view class="btn_fix" @click="newCluesClick">
			<image :src="BASE_IMG_URL+'/index/add-btn.png'" mode="scaleToFill"></image>
		</view>
		
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
	import screenPop from './screen.vue'
	import {netCluesList, netSearchStaffList, netAddkehu, netLeadsTransCustomer} from '@/api/api.js'
	import {BASE_IMG_URL} from '@/api/http.js'
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
				tabList: ['全部', '我负责的', '下属负责的', '今日待跟进', '今日已联系', '从未跟进的'],
				status: 0,
				queryParams:{},
				searchForm:null,  //搜索表单
				defaultObj:{times:''},   //默认筛选
			}
		},
		onLoad(options) {
			if(options.type){
				this.status = options.type
				this.defaultObj = {
					times: options.times
				}
			}
			this.handleSearchForm('leads',(data)=>{
				this.searchForm = data
			})
		},
		onShow() {
			this.init()
		},
		onReachBottom() {
			if (this.page >= this.totalPage) {
				return
			}
			this.page++
			this.getList()
		},
		methods: {
			changeSearchData(type,key,value){
				let obj = this.handleChangeSearchValue(this.searchForm,type,key,value)
				this.$set(this.searchForm, obj.v_index, obj.v_obj)
			},
			resetForm() {
				let arr = JSON.parse(JSON.stringify(this.handleResetSearch(this.searchForm)))
				this.searchForm = arr
			},
			toSearch() {
				this.$refs.screenChild.open(this.defaultObj)
			},
			sureParams(params){
				this.queryParams = params
				this.defaultObj = {
					times: params.createtime
				}
				this.init()
			},
			changeTab(status) {
				this.status = status
				this.init()
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
			searchName(e) {
				this.name = e.detail.value
				this.init()
			},
			//线索 列表 
			getList() {
				let params = {
					page: this.page,
					limit: this.limit,
					name: this.name,
					createtime: this.defaultObj.times,
					staff_id: this.staffObj?this.staffObj.id:'',
					type: this.status,
					...this.queryParams,
					...this.handleSureSearch(this.searchForm)
				}
				netCluesList(params).then(res => {
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			// 跟进
			newFollowClick(id, type) {
				uni.navigateTo({
					url: '/pagesB/cluesManagement/newFllow?id=' + id + '&type=' + type
				})
			},
			//转客
			getaddCustomer(id) {
				uni.showModal({
					title:'提示',
					content:'请确认是否转客户?',
					complete:(data)=>{
						if(data.confirm){
							netLeadsTransCustomer({id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									uni.navigateTo({
										url:'/pages/index/myCustomer/index'
									})
								},2000)
							})
						}
					}
				})
			},
			// 更多
			moreClick(item) {
				uni.navigateTo({
					url: '/pagesB/cluesManagement/cluesMore/cluesMore?id=' + item.id
				})
			},
			// 新建线索
			newCluesClick() {
				uni.navigateTo({
					url: '/pagesB/cluesManagement/newClues/newClues'
				})
			},
			
			// 电话
			toCall(phone) {
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

		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.tabbox {
		height: 80rpx;
		display: flex;
		justify-content: flex-start;
		background: #fff;

		.tabli {
			padding-top: 20rpx;
			flex-shrink: 0;
			margin-right: 35rpx;
			position: relative;

			.tabname {
				font-size: 26rpx;
				color: #666;
				text-align: center;
				margin-bottom: 15rpx;
			}

			.tabot {
				width: 80rpx;
				height: 8rpx;
				border-radius: 4rpx;
				background: #fff;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 0;
			}
		}

		.tabactive {
			.tabot {
				background: $uni-text-color;
			}
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

	.manage_tab {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: $uni-text-color;
		display: flex;
		justify-content: space-around;
		z-index: 1;

		.tab_array {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			background: #fff;
			border-radius: 34rpx;
			height: 60rpx;
			width: 467rpx;
			overflow: hidden;
			padding:0 15rpx;
			image {
				width: 40rpx;
				height: 37rpx;
				margin-right:15rpx;
			}
			input {
				width:350rpx;
				line-height: 60rpx;
				height: 60rpx;
			}
		}
		.tab_screen {
			display: flex;
			image {
				width: 37rpx;
				height: 30rpx;
				margin-top: 10rpx;
			}
		}
	}

	.clues_content {

		// margin: 0 24rpx;
		// margin-top: 100rpx;
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
				justify-content: space-between;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #ededed;

				.main_left {
					.left_followUp {
						display: flex;
						padding: 20rpx 0;
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
						width: 80rpx;
						height: 80rpx;
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

					.icon-iconmore-copy,
					.icon-follow {
						font-size: 22rpx;
					}

					.icon-follow,
					.icon-task,
					.icon-tel {
						margin-right: 5rpx;
					}

					.icon-iconmore-copy {
						margin-left: 5rpx;
						margin-top: 2rpx;
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
