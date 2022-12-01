<template>
	<view class="nearby">
		<!-- <view class="select_box">
			<picker @change="changeType" :value="typeIndex" :range="typeList">
				<view class="sel_left">
					{{typeList[typeIndex] ? typeList[typeIndex] : '全部'}}
					<image :src="BASE_IMG_URL+'/index/xiangxia.png'" class="xiaimg"  mode="scaleToFill"></image>
				</view>
			</picker>
			<picker @change="changeNear" :value="nearIndex" :range="nearList" :range-key="'name'">
				<view class="sel_left">
					{{nearList[nearIndex] ? nearList[nearIndex].name : '附近'}}
					<image :src="BASE_IMG_URL+'/index/xiangxia.png'" class="xiaimg"  mode="scaleToFill"></image>
				</view>
			</picker>
		</view> -->
		<!-- 搜索条件 -->
		<search-box @queryData="queryData" @showModal="showSc"></search-box>
		
		<view class="map_show" :style="{height:isFullScreen ? mapHeight : '400rpx'}">
			<map style="width: 100%; " :style="{height:isFullScreen ? mapHeight : '400rpx'}" :latitude="latitude" :longitude="longitude"
				:markers="covers" @markertap="changeLiInfo"></map>
		</view>
		<view class="kehu-btn" v-show="isFullScreen" @click="isFullScreen = false">
			查看详情
		</view>
		<view v-show="!isFullScreen">
			<view class="xiawarp" @click="isFullScreen = true">
				<image :src="BASE_IMG_URL+'/index/xiangxia.png'" class="xiaimg" ></image>
			</view>
			<view class="map_rim">
				<view>当前位置：{{address}}</view>
			</view>
			<!-- <uni-search-bar v-model="name" @input="changeSearchName"  placeholder="请输入搜索关键词"  @cancel="changeSearchName" @clear="changeSearchName"></uni-search-bar> -->
			<scroll-view scroll-y="true" class="scroll" :style="{height:height}">
				<view v-if="showList" style="padding-bottom:calc(env(safe-area-inset-bottom) / 2)">
					<view class="map_group" v-for="(item,index) in kehulist"  :key="item.id">
						<view class="name_li">
							<view class="name">{{item.name}} <span style="color:#008EFF;font-size:24rpx" v-if="item.owner_staff_id > 0">（归属人:{{item.owner_staff.name}}）</span> </view>
							<view class="status" style="color: #999;" v-if="item.owner_staff_id > 0">已分配</view>
							<view class="status"  v-else>未分配</view>
						</view>
						<view class="text">距离：{{item.juli}}</view>
						<view class="text">跟进时间：{{item.next_time}}</view>
						<view class="bntlist">
							<view class="anniu luxian" @click="lookMap(item)">查看路线</view>
							<view class="anniu" v-if="item.owner_staff_id > 0" @click="toMore(item.id)">查看详情</view>
							<view class="anniu lingqu" v-else @click="toGroupCompany(item)">领取</view>
						</view>
					</view>
					<view class="noData" v-if="list.length == 0">暂无更多</view>
				</view>
				<view v-else>
					<view class="backlist" @click="backList">返回列表</view>
					<view class="map_group">
						<view class="name_li">
							<view class="name">{{liInfo.name}} <span style="color:#008EFF;font-size:24rpx" v-if="liInfo.owner_staff_id > 0">（归属人:{{liInfo.owner_staff.name}}）</span> </view>
							<view class="status" style="color: #999;" v-if="liInfo.owner_staff_id > 0">已分配</view>
							<view class="status"  v-else>未分配</view>
						</view>
						<view class="text">距离：{{liInfo.juli}} </view>
						<view class="text">跟进时间：{{liInfo.next_time}}</view>
						<view class="bntlist">
							<view class="anniu luxian" @click="lookMap(liInfo)">查看路线</view>
							<view class="anniu" v-if="liInfo.owner_staff_id > 0" @click="toMore(liInfo.id)">查看详情</view>
							<view class="anniu lingqu" v-else @click="toGroupCompany(liInfo)">领取</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 筛选 -->
		<screen-pop 
			ref="screenChild" 
			@sureQuery="sureFormQuery" 
			:searchForm="searchForm" 
			@changeSearchData="changeSearchData"
			@resetForm="resetForm"
			:isMap="true"
		></screen-pop>
	</view>
</template>

<script>
	import { netAroundCustomer, netAroundStaffList, netLngTransAddress, netReceiveKehu } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from '@/pages/index/myCustomer/components/screenPop.vue'
	
	
	export default {
		components:{
			screenPop
		},
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				latitude: '',
				longitude: '',
				covers: [],
				myselfLocation:{},
				typeList:['全部客户','我的客户','下属负责的客户','已成交客户'],
				typeIndex:null,
				
				showMask:false,
				maskType:1,   //1 全部   2附近
				address:'',
				
				list:[],
				kehulist:[],
				showList:true,
				liInfo:{},
				liId:'',
				isFullScreen:true,
				name:'',  //搜索
				otherArr:[],   //其他人
				mapHeight:'400rpx',   //地图高度
				height:'100rpx',  //scroll  高度
				searchForm:null,  //搜索表单
				queryParams:{},
				searchName:'',  //关键字搜索
				queryName:''
			}
		},
		onLoad() {
			//获取设备信息
			uni.getSystemInfo({
				success: (res) => {
					let ratio = 750/res.screenWidth
					let height = res.windowHeight * ratio - 200
					this.mapHeight = height+'rpx'
					let scrollH = res.windowHeight * ratio - 650
					this.height = scrollH+'rpx'
				}
			})
			//获取搜索表单
			this.getSearchForm()
		},
		onShow() {
			this.getAddressinfo()
		},
		methods: {
			//搜索表单
			getSearchForm() {
				this.handleSearchForm('customer',(data)=>{
					this.searchForm = data
				})
			},
			changeSearchData(type,key,value){
				let obj = this.handleChangeSearchValue(this.searchForm,type,key,value)
				this.$set(this.searchForm, obj.v_index, obj.v_obj)
			},
			resetForm() {
				let arr = JSON.parse(JSON.stringify(this.handleResetSearch(this.searchForm)))
				this.searchForm = arr
			},
			sureFormQuery(params) {
				this.queryParams = params
				this.getKehuList()
			},
			showSc() {
				this.$refs.screenChild.open()
			},
			//搜索
			changeSearchName(e) {
				this.getKehuList()
			},
			getAddressinfo() {
				uni.getLocation({
					type: 'gcj02',
					success:(res)=>{
						this.longitude = res.longitude
						this.latitude = res.latitude
						this.myselfLocation = {
							id:0,
							latitude:res.latitude,
							longitude:res.longitude,
							iconPath:'../../static/index/selfweizhi.png',
							width:24,
							height:24,
						}
						//地址逆解析
						let params = {
							lat: res.latitude,
							lng: res.longitude
						}
						netLngTransAddress(params).then(data=>{
							data = data.data.result
							this.address = data.address
						})
						this.getKehuList()
					},
					fail:(err)=>{
						console.log(err,'定位失败')
						if(err.errMsg == 'getLocation:fail auth deny'){
							uni.showToast({
								title:'请允许使用位置信息',
								icon:'none'
							})
						}
					}
				})
			},
			//名称搜索
			queryData(e) {
				this.queryName = e
				this.getKehuList()
			},
			//获取 列表
			getKehuList() {
				let params = {
					lng: this.longitude,
					lat: this.latitude,
					type: this.typeIndex,
					name: this.queryName,
					...this.queryParams,
				}
				netAroundCustomer(params).then(res=>{
					let arr = res.data
					
					this.list = arr
					this.kehulist = arr
					this.getStafflist()
				})
			},
			handleCover() {
				let data = this.list
				let coversArr = []
				coversArr.push(this.myselfLocation)
				if(data.length == 0){
					return
				}
				data.forEach((ele,index)=>{
					let obj = {}
					if(ele.type == 3 || ele.type == 4) {
						this.otherArr.push(ele.id)
					}
					obj = {
						id: Number(ele.id+Math.random()),
						mid:ele.id,
						latitude:ele.lat,
						longitude:ele.lng,
						iconPath:ele.type == 0 ? '../../static/index/selfweizhi.png' : ele.type == 1 ? '../../static/index/weizhi.png' : ele.type == 2 ? '../../static/index/greenweizhi.png' : ele.type == 4 ? '../../static/index/mapStaff.png' : '../../static/index/otherweizhi.png',
						width:24,
						height:24,
						type:ele.type,
						label:{
							content: ele.name,
							color:'#0287FF'
						}
					}
					coversArr.push(obj)
				})
				this.covers = coversArr
			},
			getStafflist() {
				netAroundStaffList().then(res=>{
					this.handleStaff(res.data)
				})
			},
			handleStaff(data) {
				data.forEach(ele=>{
					ele.type = 4
					ele.id = ele.staff_id
					ele.name = ele.staff.name
				})
				this.list = this.list.concat(data)
				this.handleCover()
			},
			//点击标记点 触发
			changeLiInfo(e) {
				let id = e.detail.markerId
				if(id == 0 || (this.otherArr.indexOf(id) != -1)) {
					return
				}
				let customer_id = ''
				this.covers.forEach(ele=>{
					if(ele.id == id && (ele.type == 0 || ele.type == 1)) {
						this.isFullScreen = false
						this.showList = false
						customer_id = ele.mid
						this.list.forEach(item=>{
							if(item.id == customer_id && (item.type == 0 || item.type == 1)){
								this.liInfo = item
							}
						})
					}
				})
				
			},
			backList () {
				this.showList = true
			},
			//全部 搜索条件
			showAll() {
				this.showMask = true
				this.maskType = 1
			},
			changeType(e) {
				this.typeIndex = e.detail.value
				this.getKehuList()
			},
			//附近 搜索 条件
			showFujin() {
				this.showMask = true
				this.maskType = 2
			},
			changeNear(e) {
				this.nearIndex = e.detail.value
				this.getKehuList()
			},
			//重置
			resetQuery() {
				if(this.maskType == 1) {
					this.typeIndex = null
				}else{
					this.nearIndex = null
				}
			},
			//确定
			sureQuery() {
				this.showMask = false
				this.covers = []
				this.getKehuList()
			},
			//查看 路线
			lookMap(item) {
				console.log(item)
				uni.openLocation({
					latitude: Number(item.lat),
					longitude: Number(item.lng),
					address: item.address_detail,
					name: item.address_detail,
					success:(res)=>{
						console.log(res)
					},
					fail:(err)=>{
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				})
			},
			//查看 详情
			toMore(id) {
				uni.navigateTo({
					url:'/pagesA/customerInfo/myCustomer/customerDetail?customerid='+id
				})
			},
			toGroupCompany(item) {
				uni.showModal({
					title:'是否确定领取公池客户',
					content:'领取后长时间未跟进，客户将自动转为公共客户',
					success:(res)=>{
						if(res.confirm){
							netReceiveKehu({customer_id:item.id}).then(res=>{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								setTimeout(()=>{
									this.getKehuList()
									let id = item.id
									let arr = this.list
									arr.forEach(ele=>{
										if(ele.id == id){
											this.liInfo = ele
										}
									})
								},2000)
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.select_box{
		display: flex;
		justify-content: space-around;
		align-items: center;
		height:100rpx;
		background:#fff;
		padding:0 20rpx;
		position: relative;
		.sel_left{
			display: flex;
			justify-content: center;
			align-items: center;
			padding:0 20rpx;
			width:300rpx;
			height:60rpx;
			border-radius: 30rpx;
			font-size:26rpx;
			color:$uni-text-color;
			background:#f5f5f5;
			.xiaimg{
				margin-left: 10rpx;
				width:42rpx;
				height:42rpx;
			}
		}
	}
	.mask{
		position: absolute;
		left:0;
		top:100rpx;
		right:0;
		bottom:0;
		background:rgba(0,0,0,0.5);
		z-index: 9;
		.maskbox{
			position: absolute;
			left:0;
			top:0;
			width:750rpx;
			background:#fff;
			.leftbox{
				padding:30rpx;
				.leftli{
					padding:20rpx;
					border-bottom:1rpx solid #ededed;
					font-size:24rpx;
					color:#666;
				}
				.leftli_active{
					color:$uni-text-color;
					border-bottom:1rpx solid $uni-text-color;
				}
			}
			.maskbtnli{
				width:750rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				padding:20rpx 0 30rpx;
				.maskbtn{
					width:300rpx;
					height:80rpx;
					border-radius: 28rpx;
					line-height: 80rpx;
					text-align: center;
					font-size:26rpx;
					color:#fff;
				}
				.sure{
					background:$uni-text-color;
				}
				.reset{
					color: $uni-text-color;
					border: 1px solid $uni-text-color;
					background: #fff;
				}
			}
		}
	}
	.nearby {
		.map_show {
			width: 750rpx;
			height: 400rpx;
		}
		.kehu-btn{
			width:750rpx;
			height:100rpx;
			background:#fff;
			font-size:26rpx;
			text-align: center;
			line-height: 100rpx;
			color:$uni-text-color;
		}
		.scroll {
			background:#fff;
			.backlist{
				font-size:24rpx;
				color:#007AFF;
				padding:20rpx;
			}
			.map_group {
				background-color: #fff;
				padding:30rpx;
				border-bottom:1rpx solid #ededed;
				.name_li{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name{
						font-size:32rpx;
						color:#333;
					}
					.status{
						font-size:26rpx;
						color:$uni-text-color;
						padding:5rpx 8rpx;
					}
				}
				.text{
					font-size:26rpx;
					color:#999;
					margin:15rpx 0;
				}
				.bntlist{
					display: flex;
					justify-content: space-around;
					align-items: center;
					.anniu{
						width:190rpx;
						height:60rpx;
						border-radius: 10rpx;
						font-size:26rpx;
						color:$uni-text-color;
						text-align: center;
						line-height: 60rpx;
						background:#fff;
						border: 1px solid $uni-btn-bg-color;
					}
					.luxian{
						background:#fff;
						border: 1px solid $uni-btn-bg-color;
					}
					.lingqu{
						background: #fff;
						border: 1px solid $uni-btn-bg-color;
					}
				}
			}
		}
		.xiawarp{
			background:#fff;
			padding:10rpx 0;
			text-align: center;
			.xiaimg{
				width:42rpx;
				height:42rpx;
			}
		}
		.map_rim {
			display: flex;
			padding: 0 20rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #fff;
			justify-content: space-between;
			align-items: center;
			font-size:26rpx;
			color:#666;
			border: 1rpx solid #EAEAEA;
			.weizhiimg{
				width:30rpx;
				height:30rpx;
			}
		}


	}
</style>
