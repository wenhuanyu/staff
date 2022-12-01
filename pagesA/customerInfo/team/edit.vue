<template>
	<view>
		<view class="cirinfo" v-for="(item,index) in arr" :key="index" v-if="item.roles == 2">
			<image :src="item.staff.img" class="staffimg" ></image>
			<view class="staffinfo">
				<view class="staffright">
					<view class="ri_left">
						<view class="name">{{item.staff.name}}</view>
						<view class="post">{{item.staff.post}}</view>
					</view>
					<image :src="BASE_IMG_URL+'/index/delete.png'" @click="delFollow(index)" class="deleimg" ></image>
				</view>
				<view class="staffli">
					<view class="statext">权限</view>
					<picker @change="(e)=>{changePre(e,index)}" :range="preArr" :value="preIndex">
						<view class="liright">
							{{preArr[item.is_edit]?preArr[item.is_edit]:'请选择'}}
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
			</view>
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSub)">确定</view>
	</view>
</template>

<script>
	import { BASE_IMG_URL} from '@/api/http.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				arr:[],
				preArr:['只读','读写']
			}
		},
		onLoad(options) {
			this.arr = uni.getStorageSync('teamList')
		},
		methods:{
			changePre(e,index) {
				let obj = this.arr[index]
				obj.is_edit = e.detail.value
				this.$set(this.arr,index,obj)
			},
			delFollow(index) {
				this.arr.splice(index,1)
			},
			sureSub() {
				uni.setStorageSync('teamList',this.arr)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cirinfo{
		padding:24rpx;
		border-bottom:8rpx solid #f5f5f5;
		display: flex;
		justify-content: flex-start;
		&:last-child{
			border-bottom:0;
		}
		.staffimg{
			width:80rpx;
			height:80rpx;
			border-radius: 50%;
			margin-right:24rpx;
		}
		.staffinfo{
			flex:1;
			.staffright{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom:24rpx;
				.ri_left{
					.name{
						font-size:26rpx;
						color:#333;
					}
					.post{
						font-size:24rpx;
						color:#666;
						margin-top:15rpx;
					}
				}
				.deleimg{
					width:44rpx;
					height:44rpx;
				}
			}
			.staffli{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:24rpx 0;
				border-top:1rpx solid #f5f5f5;
				.statext{
					font-size:26rpx;
					color:#666;
				}
				.liright{
					display: flex;
					justify-content: flex-end;
					align-items: center;
					font-size:26rpx;
					color:#666;
					.icon-you{
						font-size:28rpx;
					}
				}
			}
		}
	}
</style>
