<template>
	<view class="clockbox">
		<view class="top_warp">
			<view class="topli" @click="chanCur(0)" :class="{'topli_a':current == 0}">上下班打卡</view>
			<view class="topli"@click="chanCur(1)" :class="{'topli_a':current == 1}">外出打卡</view>
		</view>
		
		<normal-clock v-if="current == 0" :lat="lat" :lng="lng" ref="nomalChild"></normal-clock>
		<punch-out v-if="current == 1" :lat="lat" :lng="lng" ref="punchChild"></punch-out>
		<!-- <swiper class="swiper" :current="current" @change="changeCurrent">
			<swiper-item v-if="current == 0">
				
			</swiper-item>
			<swiper-item v-if="current == 1">
				
			</swiper-item>
		</swiper> -->
	</view>
</template>

<script>
	import normalClock from '@/pagesB/punchclock/normalClock.vue'
	import punchOut from '@/pagesB/punchclock/punchOut.vue'
	
	export default{
		components:{
			normalClock,
			punchOut
		},
		props:{
			lat:{
				type:String/Number,
				default:''
			},
			lng:{
				type:String/Number,
				default:''
			}
		},
		data() {
			return{
				current:0
			}
		},
		onUnload() {
		},
		methods:{
			changeCurrent(e) {
				this.current = e.detail.current
			},
			chanCur(current) {
				this.current = current
			},
			close() {
				this.$refs.nomalChild.clear()
				this.$refs.punchChild.clear()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.clockbox{
		background:#f5f5f5;
	}
	.top_warp{
		display: flex;
		justify-content: space-around;
		align-items: center;
		height:80rpx;
		margin-bottom:24rpx;
		background:#fff;
		.topli{
			font-size:24rpx;
			color:#666;
		}
		.topli_a{
			color:$uni-text-color;
		}
	}
	.swiper{
		width:750rpx;
		height:calc(100vh - 200rpx);
	}
</style>