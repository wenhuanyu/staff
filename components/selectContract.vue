<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popup_title">选择合同</view>
			<view class="searbox">
				<image :src="BASE_IMG_URL+'/ss.png'" class="searimg" mode="scaleToFill"></image>
				<input @input="searchName" type="text" placeholder-style="color:#999;" 
					:class="keyword ? 'fontactive' : ''" v-model="keyword" placeholder="合同名称" class="li_box" />
			</view>
			<scroll-view scroll-y class="scrollbox" lower-threshold="30" @scrolltolower="loodMore">
				<view class="liwarp" v-for="(item,index) in contractList" :key="index" @click="selectItem(item,index)">
					<view class="warpleft">
						<view class="name">名称:{{item.name}}</view>
					</view>
					<label class="radio">
						<radio value="r1" color="#008EFF" :checked="contractObj.id == item.id" />
					</label>
				</view>
				<view class="noData" v-if="contractList.length == 0">暂无更多</view>
			</scroll-view>
			<view class="btnlist" @tap.stop.prevent>
				<view class="btn secbtn" @click="hideSelect">取消</view>
				<view class="btn firbtn" @click="sureSelect">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { netCustomerContractInfo } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		props:{
			
		},
		data(){
			return{
				customer_id:'',  //客户id
				keyword:'',
				contractList:[],
				page:1,
				totalPage:1,
				contractObj:{},
				BASE_IMG_URL:BASE_IMG_URL
			}
		},
		methods:{
			init(id) {
				if(id){
					this.customer_id = id
				}
				this.$refs.popup.open()
				this.contractList = []
				this.getContract()
			},
			loodMore() {
				if(this.page < this.totalPage){
					this.page ++
					this.getContract()
				}
			},
			//合同
			getContract() {
				let params = {
					name:this.keyword,
					customer_id:this.customer_id,
					page:this.page
				}
				netCustomerContractInfo(params).then(res=>{
					this.contractList = this.contractList.concat(res.data.data)
					this.totalPage = res.data.last_page
				})
			},
			searchName(e) {
				this.contractList = []
				this.getContract()
			},
			selectItem(item,index) {
				this.contractObj = item
			},
			closePopup() {
				this.$refs.popup.close()
			},
			sureSelect() {
				if(!this.contractObj){
					this.$refs.popup.close()
					return
				}
				this.$refs.popup.close()
				this.$emit('contractInfo',this.contractObj)
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
		width:620rpx;
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
			width: 90%;
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
