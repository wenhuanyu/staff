<template>
	<view class="">
		<uni-popup ref="popup" type="bottom" background-color="#f5f5f5" @touchmove.stop.prevent>
			<view class="title">请选择规则类型</view>
			<view class="listwarp">
				<view class="list_o" @click="selectItem(index)" v-for="(item,index) in arr" :key="index">
					<view class="list_left">
						<view class="li_t">
							<view class="li_f">{{item.title}}</view> <view class="li_p">{{item.label}}</view>
						</view>
						<view class="li_c">{{item.p}}</view>
						<view class="li_b">{{item.text}}</view>
					</view>
					<view class="list_right">
						<radio value="" color="#008EFF" :checked="arrIndex == index" />
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	
	export default{
		data() {
			return{
				selectType:false,
				arr:[
					{id:0,title:'固定上下班',label:'支持弹性打卡',p:'所有人按照相同时间打卡',text:'适用于办公室坐班，例如朝九晚五'}
				],
				arrIndex:null
			}
		},
		methods:{
			init() {
				this.$refs.popup.open()
			},
			selectItem(index) {
				this.arrIndex = index
				if(this.arr[this.arrIndex]){
					this.$emit('selectType',this.arr[this.arrIndex])
					setTimeout(()=>{
						this.$refs.popup.close()
					},1000)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		font-size:30rpx;
		color:#333;
		text-align: center;
		padding:24rpx 0;
	}
	.listwarp{
		width:750rpx;
		height:700rpx;
		.list_o{
			width:690rpx;
			border-radius: 10rpx;
			background:#fff;
			padding:30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin:24rpx auto 0;
			.list_left{
				flex:1;
				.li_t{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:30rpx;
					color:#333;
					margin-bottom:8rpx;
					.li_p{
						font-size:22rpx;
						color:$uni-text-color;
						margin-left:10rpx;
					}
				}
				.li_c{
					font-size:24rpx;
					color:#666;
					margin-bottom:15rpx;
				}
				.li_b{
					font-size:22rpx;
					color:#333;
				}
			}
			.list_right{
				flex-shrink: 0;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
</style>