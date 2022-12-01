<template>
	<view>
		<uni-drawer ref="showRight" mode="right" :width="drWidth">
			<view class="sortwarp">
				<view class="sortbox" @tap.stop.prevent>
					<view class="sortlist">
						<view class="sortli" :class="index == sortid ? 'sortli_active' : ''" @click="chageSort(index)" v-for="(item,index) in sortList" :key="index">
							{{item.name}}
							<image  :src="BASE_IMG_URL + '/index/yes.png'" ></image>
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
			show:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return{
				drWidth:uni.upx2px(660),
				BASE_IMG_URL:BASE_IMG_URL,
				sortList:[
					{id:0,name:'名称正序'},
					{id:1,name:'名称倒序'},
					{id:2,name:'创建时间正序'},
					{id:3,name:'创建时间倒序'},
				],
				sortid:null
			}
		},
		created() {
		},
		methods:{
			open() {
				this.$refs['showRight'].open()
			},
			reset() {
				this.sortid = null
			},
			close() {
				this.$emit('close')
			},
			chageSort(index) {
				this.sortid = index
				this.sure()
			},
			sure() {
				this.$emit('sortQuery',this.sortid+1)
				this.$refs['showRight'].close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sortwarp{
		// position: fixed;
		// left:0;
		// top:92rpx;
		width:660rpx;
		height:calc(100vh - 0rpx);
		// background:rgba(0,0,0,0.5);
		z-index: 9;
		.sortbox{
			width:690rpx;
			// padding:0rpx 0 30rpx;
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
