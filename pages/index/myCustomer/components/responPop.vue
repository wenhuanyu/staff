<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="sortwarp">
				<view class="sortbox" @tap.stop.prevent>
					<view class="sortlist">
						<view 
							class="sortli" 
							:class="item.id == respon.id ? 'sortli_active' : ''" 
							@click="chageSort(item)" 
							v-for="(item,index) in sortList" 
							:key="index">
							{{item.name}}
							<image  :src="BASE_IMG_URL + '/index/yes.png'"></image>
						</view>
					</view>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
import { BASE_IMG_URL } from '@/api/http.js'
	export default{
		props:{
			sortList:{
				type:Array,
				default:[
					{id:0,name:'全部'},
					{id:1,name:'我负责的'},
					{id:2,name:'我参与的'},
					{id:11,name:'我下属负责的'},
					{id:12,name:'我下属参与的'},
				],
			}
		},
		data() {
			return{
				drWidth:uni.upx2px(660),
				BASE_IMG_URL:BASE_IMG_URL,
				respon:{}
			}
		},
		created() {
		},
		methods:{
			open() {
				this.$refs.showRight.open()
			},
			reset() {
				this.respon = {}
			},
			chageSort(item) {
				this.respon = item
				this.$refs.showRight.close()
				this.$emit('responQuery',item)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sortwarp{
		width:660rpx;
		height:calc(100vh - 0rpx);
		z-index: 9;
		.sortbox{
			width:690rpx;
			background:#fff;
			.sortlist{
				.sortli{
					padding:25rpx 70rpx 25rpx 25px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size:30rpx;
					color:#999999;
					border-bottom:1rpx solid #EDEDED;
					.sorcir{
						width:23rpx;
						height:23rpx;
						border-radius: 50%;
						margin-right:60rpx;
						background:#fff;
					}
					image{
						display: none;
						width: 36rpx;
						height: 42rpx;
					}
				}
				.sortli_active{
					// color:#118EFF;
					image{
						display: block;
						width: 36rpx;
						height: 42rpx;
					}
					// .sorcir{
					// 	background:#118EFF;
					// }
				}
			}
			.sort_bot{
				padding:0 47rpx;
				margin-top:45rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.sortbtn{
					width:329rpx;
					height:90rpx;
					border-radius: 28rpx;
					border:1rpx solid #0287FF;
					color:#0287FF;
					text-align: center;
					line-height: 88rpx;
				}
				.surebtn{
					color:#fff;
					background:#0287FF;
				}
			}
		}
	}
</style>
