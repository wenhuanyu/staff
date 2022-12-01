<template>
	<view>
		<view class="select_warp">
			<view class="topbox">
				<view class="tab_list">
					<view 
						class="tab_li"
						v-for="(item,index) in readList"
						:key="index"
						:class="{'tab_li_active': item.id == readIndex}"
						@click="changeTab(item)"
					>{{item.name}}</view>
				</view>
			</view>
			<view class="searchbox">
				<view class="searchtext" @click="toQuery">筛选<view class="iconfont icon-shaixuan"></view></view>
			</view>
		</view>
		<view>
			<view class="work_li" v-for="(item,index) in list" :key="index" @click="jumpDetail(item)">
				<view class="li_key" v-if="item.is_read != 1"></view>
				<view class="li_left">
					<image :src="item.staff.img ? item.staff.img : BASE_IMG_URL+'img/headImg.png'" class="li_img" mode=""></image>
					<view class="">
						<view class="li_name">{{item.staff.name}} <text style="font-size:24rpx;color:#999;margin-left:15rpx">{{item.staff.post?item.staff.post:''}}</text> </view>
						<view class="li_post">{{item.createtime}}</view>
					</view>
				</view>
				<view class="li_right">
					<view class="tatus firbg" v-if="item.type == '日报'">日报</view>
					<view class="tatus secbg" v-if="item.type == '周报'">周报</view>
					<view class="tatus thrbg" v-if="item.type == '月报'">月报</view>
					<view class="tatus forbg" v-if="item.type == '季报'">季报</view>
					<view class="tatus fivbg" v-if="item.type == '年报'">年报</view>
				</view>
			</view>
			<view class="noData" v-if="list.length == 0">暂无更多</view>
		</view>
		
		<!-- 创建用户图标 -->
		<view class="icon_creat" @click="createWork">
			<image :src="BASE_IMG_URL+'/1.png'"></image>
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
	import { netWorkreportList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screenPop.vue'
	
	export default{
		components:{
			screenPop
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				page:1,
				totalPage:1,
				readList:[{id:0,name:'全部'},{id:1,name:'已读'},{id:2,name:'未读'}],
				readIndex:0,
				queryParams:{},   //搜索条件
				searchForm:null,  //搜索表单
			}
		},
		onShow() {
			this.list = []
			this.page = 1
			this.getList()
			//获取搜索表单
			// this.getSearchForm()
		},
		onReachBottom() {
			if(this.page >= this.totalPage){
				return
			}
			this.page ++
			this.getList()
		},
		methods:{
			//搜索表单
			getSearchForm() {
				this.handleSearchForm('leads',(data)=>{
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
			toQuery() {
				this.$refs.screenChild.open()
			},
			init(){
				this.page = 1
				this.list = []
				setTimeout(()=>{
					this.getList()
				},200)
			},
			changeTab(item) {
				this.readIndex = item.id
				this.init()
			},
			sureParams(params) {
				this.queryParams = params
				this.init()
			},
			getList() {
				let params = {
					page:this.page,
					is_read:this.readIndex,
					staff_id:this.staffObj?this.staffObj.id:'',
					type:(this.workList && this.workList[this.workIndex])?this.workList[this.workIndex]:'',
					times:(this.start_time && this.end_time) ? (this.start_time + ',' + this.end_time) : '',
					...this.queryParams,
					...this.handleSureSearch(this.searchForm)
				}
				netWorkreportList(params).then(res=>{
					this.list = this.list.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			jumpDetail(item) {
				uni.navigateTo({
					url:'/pagesB/workreport/workDetail?id='+item.id
				})
			},
			//创建  工作报告
			createWork() {
				uni.navigateTo({
					url:'/pagesB/workreport/addReports'
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
	.topbox{
		width:750rpx;
		height:80rpx;
		background:#fff;
		.tab_list{
			padding:0 24rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.tab_li{
				width:120rpx;
				font-size:30rpx;
				color:#666;
				height:80rpx;
				margin-right:40rpx;
				line-height: 80rpx;
				flex-shrink: 0;
				text-align: center;
			}
			.tab_li_active{
				color:#000;
				position: relative;
				&::after{
					content:'';
					width:60rpx;
					height:6rpx;
					background:$uni-text-color;
					position: absolute;
					bottom:0;
					left:50%;
					transform: translateX(-50%);
				}
			}
		}
	}
	.icon_creat {
		position: fixed;
		z-index: 1;
		bottom: 100rpx;
		right: 100rpx;
	
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
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
	
	.valueactive{
		color:#333;
	}
	.rediowarp{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		label{
			display: flex;
			justify-content: flex-start;
			margin-right:24rpx;
			align-items: center;
		}
		radio{
			transform: scale(0.7);
		}
	}
	.work_li{
		width:702rpx;
		background:#fff;
		border-radius: 10rpx;
		padding:30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin:0 auto 24rpx;
		position: relative;
		.li_key{
			position: absolute;
			right:5rpx;
			top:5rpx;
			width:20rpx;
			height:20rpx;
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
	.select_warp{
		z-index: 9;
	}
	.searchbox{
		display: flex;
		justify-content: flex-end;
		margin:24rpx;
		.searchtext{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:24rpx;
			color:$uni-text-color;
			padding:5rpx 23rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 2rpx 2rpx 50rpx rgba(0,0,0,0.1);
		}
	}
	.warpbox{
		width:750rpx;
		z-index: 2;
		background:rgba(0,0,0,0.7);
		.screen_content {
			width:702rpx;
			z-index: 2;
			border-top:1rpx solid #CCCCCC;
			background-color: #fff;
			padding:24rpx;
			.fir_li{
				margin-bottom:20rpx;
				.li_label{
					font-size:28rpx;
					color:#333333;
					margin-bottom:15rpx;
				}
				.li_box{
					border-radius: 15rpx;
					border:1rpx solid #CCCCCC;
					height:60rpx;
					padding:0 35rpx;
					line-height: 60rpx;
				}
				.form_right {
					display: flex;
					color: #999;
					justify-content: space-between;
					image {
						width: 40rpx;
						height: 40rpx;
						margin: 28rpx 5rpx 0 0;
					}
					
				}
			}
		}
		.button_bottom {
			display: flex;
			width: 100%;
			height: 90rpx;
			background-color: #fff;
			line-height: 90rpx;
			text-align: center;
			font-size: 32rpx;
			:first-child {
				flex: 1;
				color: $uni-text-color;
				border-top:1rpx solid #CCCCCC;
			}
			:last-child {
				flex: 1;
				background-color: $uni-text-color;
				color: #fff;
			}
		}
	}
</style>
