<template>
	<view>
		<view class="scr_warp">
			<view class="scr_box" @click="toScreenPop">
				<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="scr_img" ></image>
			</view>
		</view>
		
		<!-- 合同汇总表 -->
		<view class="fir_data_box">
			<view class="data_box_title">合同汇总表</view>
			<scroll-view scroll-x class="firbox">
				<view class="rankingbox">
					<view class="rank_tab_box">
						<view 
							class="rank_tab" 
							@click="changeRankTab(index)" 
							:class="rankIndex == index ? 'tab_active' : ''" 
							v-for="(item,index) in rankTab" 
							:key="index">{{item.name}}</view>
					</view>
					<view class="rank_list">
						<view class="rank_li" 
						:class="item.ranking == 1 ? 'rank_li_fir' : item.ranking == 2 ? 'rank_li_sec' : item.ranking == 3 ? 'rank_li_thr' : '' " 
						v-for="(item,index) in rankList" :key="index" >
							<view class="rank_li_left">
								<view class="rank_num">{{item.ranking}}</view>
								<image :src="item.staff.img" class="saleimg" ></image>
								<view class="salename">{{item.staff.name}}</view>
							</view>
							<view class="rank_li_right">
								已完成：{{item.number}}单
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<screen-pop ref="screenChild" :type="2" @sureQuery="sureQuery"></screen-pop>
	</view>
</template>

<script>
	import { BASE_IMG_URL } from '@/api/http.js'
	import screenPop from './screenPop.vue'
	import { netIndexRankingdata } from '@/api/api.js'
	
	export default{
		components:{
			screenPop
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				//排行榜
				rankTab:[
					{id:1,name:'获客'},
					{id:2,name:'拜访'},
					{id:3,name:'业绩'},
					{id:4,name:'回款'},
					{id:5,name:'工单'}
				],
				rankIndex:0,
				rankList:[],
				queryObj:{
					times:'thisweek'
				}
			}
		},
		methods:{
			toScreenPop() {
				this.$refs.screenChild.open()
			},
			changeRankTab(index) {
				this.rankIndex = index
				this.getRanking()
			},
			getRanking() {
				let params = {
					ranking:this.rankTab[this.rankIndex].id,
					...this.queryObj
				}
				netIndexRankingdata(params).then(res=>{
					this.rankList = res.data
				})
			},
			sureQuery(params) {
				this.queryObj = params
				this.getRanking()
			}
		}
	}
</script>

<style scoped lang="scss">
	.scr_warp{
		display: flex;
		justify-content: flex-end;
		padding:24rpx;
		.scr_box{
			padding:10rpx 30rpx;
			background:#fff;
			border-radius: 5rpx;
			box-shadow: 1rpx 1rpx 8rpx 2rpx rgba(0,0,0,0.1);
			.scr_img{
				width:35rpx;
				height:27rpx;
			}
		}
	}
	.fir_data_box{
		width:690rpx;
		margin:0 auto 30rpx;
		background:#fff;
		.data_box_title{
			width:100%;
			height:80rpx;
			background:$uni-bg-opacity;
			font-size:30rpx;
			color:$uni-text-color;
			text-align: center;
			line-height: 80rpx;
		}
	}
	.rankingbox{
		width:690rpx;
		background:#fff;
		padding:30rpx 0;
		.rank_tab_box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-bottom:20rpx;
			border-bottom:1rpx solid #EDEDED;
			padding-bottom:15rpx;
			.rank_tab{
				font-size:30rpx;
				color:#666666;
				padding:15rpx 24rpx;
				border-right:1rpx solid #EDEDED;
				&:last-child{
					border-right:0;
				}
			}
			.tab_active{
				color:#008EFF;
			}
		}
	}
	.rank_list{
		.rank_li{
			width:620rpx;
			margin:0 auto 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:15rpx 35rpx;
			border-radius: 20rpx;
			background:rgba(153, 153, 153, 0.2);
			.rank_li_left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.rank_num{
					font-size:24rpx;
					color:#666666;
					margin-right:10rpx;
					width:40rpx;
					height:40rpx;
					text-align: center;
					line-height: 38rpx;
				}
				.saleimg{
					width:60rpx;
					height:60rpx;
					border-radius: 50%;
					margin-right:10rpx;
				}
				.salename{
					font-size:30rpx;
					color:#333333;
				}
			}
			.rank_li_right{
				font-size:30rpx;
				color:#666666;
			}
		}
		.rank_li_fir{
			background:rgba(255, 155, 38, 0.2);
			.rank_li_left{
				.rank_num{
					color:rgba(255, 155, 38, 1);
					border:1rpx solid rgba(255, 155, 38, 1);
					border-radius: 50%;
				}
				.salename{
					color:rgba(51, 51, 51, 1);
				}
			}
			.rank_li_right{
				color:rgba(255, 155, 38, 1);
			}
		}
		.rank_li_sec{
			background:rgba(0, 202, 141, 0.2);
			.rank_li_left{
				.rank_num{
					color:rgba(0, 202, 141, 1);
					border:1rpx solid rgba(0, 202, 141, 1);
					border-radius: 50%;
				}
				.salename{
					color:rgba(51, 51, 51, 1);
				}
			}
			.rank_li_right{
				color:rgba(0, 202, 141, 1);
			}
		}
		.rank_li_thr{
			background:rgba(78, 128, 245, 0.2);
			.rank_li_left{
				.rank_num{
					color:rgba(78, 128, 245, 1);
					border:1rpx solid rgba(78, 128, 245, 1);
					border-radius: 50%;
				}
				.salename{
					color:rgba(78, 128, 245, 1)
				}
			}
			.rank_li_right{
				color:rgba(78, 128, 245, 1);
			}
		}
	}
</style>
