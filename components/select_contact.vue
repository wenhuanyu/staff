<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="tit_top">
				<view class="popup_title">选择联系人</view>
				<view class="addbtn" @click="addLianxiren">新增</view>
			</view>
			<view class="searbox">
				<image :src="BASE_IMG_URL+'/ss.png'" class="searimg" mode="scaleToFill"></image>
				<input @input="searchName" type="text" placeholder-style="color:#999;" 
					:class="name ? 'fontactive' : ''" v-model="name" placeholder="联系人姓名" class="li_box" />
			</view>
			<scroll-view scroll-y class="scrollbox" @scrolltolower="loadMoredata" lower-threshold="30">
				<view class="liwarp" v-for="(item,index) in list" :key="index" @click="selectPeo(index)">
					<view class="warpleft">
						<view class="name">名称:{{item.name}}</view>
					</view>
					<label class="radio">
						<radio value="r1" color="#008EFF" :checked="selectObj.id == item.id" />
					</label>
				</view>
				<view class="noData" v-if="list.length == 0">暂无更多</view>
			</scroll-view>
			<view class="btnlist" @tap.stop.prevent>
				<view class="btn secbtn" @click="closePopup">取消</view>
				<view class="btn firbtn" @click="sureSelectData">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netContact } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				name:'',
				list:[],
				customerid:'',
				selectObj:{},
			}
		},
		methods:{
			init(id) {
				this.$refs.popup.open()
				this.customerid = id
				this.list = []
				this.getContactList()
			},
			loadMoredata() {
				
			},
			searchName() {
				this.list = []
				this.getContactList()
			},
			getContactList() {
				let params = {
					customer_id:this.customerid,
					name:this.name
				}
				netContact(params).then(res => {
					this.list = res.data
				})
			},
			//选择
			selectPeo(index) {
				let obj = this.list[index]
				this.selectObj = obj
				this.$set(this.list,index,obj)
			},
			closePopup() {
				this.$emit('close')
			},
			//确定
			sureSelectData() {
				this.$refs.popup.close()
				this.$emit('sureContact',this.selectObj)
			},
			//新建 联系人
			addLianxiren() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/contact/createContact?id='+this.customerid,
					success:()=>{
						this.$refs.popup.close()
					}
				})
			},
		}
	}
</script>

<style>
	
</style>
<style lang="scss" scoped>
	.tit_top{
		color:#333;
		padding:24rpx;
		width:100%;
		position: relative;
		.popup_title{
			width:100%;
			text-align: center;
			font-size:34rpx;
		}
		.addbtn{
			font-size:30rpx;
			color:$uni-btn-bg-color;
			position: absolute;
			left:24rpx;
			top:24rpx;
		}
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
