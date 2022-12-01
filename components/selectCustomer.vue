<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popup_title">选择客户</view>
			<view class="searbox">
				<image :src="BASE_IMG_URL+'/ss.png'" class="searimg" mode="scaleToFill"></image>
				<input @input="searchName" type="text" placeholder-style="color:#999;" 
					:class="keyword ? 'fontactive' : ''" v-model="keyword" placeholder="客户名称" class="li_box" />
			</view>
			<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMoredata" lower-threshold="30">
				<view class="liwarp" v-for="(item,index) in customerlist" :key="index" @click="selectItem(item,index)">
					<view class="warpleft">
						<view class="name">名称:{{item.name}}</view>
					</view>
					<label class="radio">
						<radio value="r1" color="#008EFF" :checked="preseCustomerObj.id == item.id" />
					</label>
				</view>
				<view class="noData" v-if="customerlist.length == 0">暂无更多</view>
			</scroll-view>
			<view class="btnlist" @tap.stop.prevent>
				<view class="btn secbtn" @click="hideSelect">取消</view>
				<view class="btn firbtn" @click="sureSelect">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netKehuList } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			
		},
		data(){
			return{
				keyword:'',
				customerlist:[],
				page:1,
				totalPage:1,
				preseCustomerObj:{},
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			init() {
				this.$refs.popup.open()
				this.page = 1
				this.customerlist = []
				this.getList()
			},
			getList() {
				let params = {page:this.page,name:this.keyword}
				netKehuList(params).then(res=>{
					this.customerlist = this.customerlist.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			loadMoredata() {
				if(this.page >= this.totalPage){
					return
				}
				this.page ++
				this.getList()
			},
			searchName(e) {
				this.page = 1
				this.customerlist = []
				this.getList()
			},
			selectItem(item,index) {
				this.preseCustomerObj = item
			},
			closePopup() {
				this.$refs.popup.close()
			},
			sureSelect() {
				if(!this.preseCustomerObj){
					this.$refs.popup.close()
					return
				}
				this.$refs.popup.close()
				this.$emit('getCustomerinfo',this.preseCustomerObj)
			},
			hideSelect() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style>
	radio{
		transform: scale(0.7);
	}
</style>
<style lang="scss" scoped>
	.popup_title{
		text-align: center;
		font-size:34rpx;
		color:#333;
		padding:24rpx;
	}
	.searbox{
		width:690rpx;
		height:60rpx;
		margin:0 24rpx 15rpx;
		border-radius: 30rpx;
		padding:0 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background:#f5f5f5;
		.searimg{
			width: 50rpx;
			height: 50rpx;
			margin-right:10rpx;
		}
		.li_box{
			width:630rpx;
		}
	}
	.scrollbox{
		width:100%;
		height:600rpx;
		background:#f5f5f5;
		.liwarp {
			width:90%;
			padding: 20rpx 30rpx;
			margin: 20rpx auto;
			background: #fff;
			border-radius: 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.warpleft {
				flex: 1;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			
				.headerimg {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			
				.name {
					font-size: 24rpx;
					color: #333;
				}
			
				.number {
					font-size: 24rpx;
					color: #999;
					margin: 15rpx 0;
				}
			
				.guishu {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}
	.btnlist {
		width: 100%;
		display: flex;
		justify-content: space-around;
		padding: 30rpx 0;
		border-top:1rpx solid #f5f5f5;
		.btn {
			width: 200rpx;
			height: 60rpx;
			border-radius: 30rpx;
			font-size: 24rpx;
			color: #fff;
			text-align: center;
			line-height: 60rpx;
		}
		
		.firbtn {
			background: $uni-btn-bg-color;
		}
		
		.secbtn {
			background: #ff7800;
		}
	}
</style>
