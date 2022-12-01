<template>
	<view>
		<view class="know_warp">
			<view class="know_left">
				<scroll-view scroll-y class="leftscroll">
					<view class="listwarp">
						<view class="list_item" :class="parentid == item.id ? 'list_item_active' : ''" v-for="(item,index) in parentList" :key="index" @click="changeParent(item)">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
			<view class="know_right">
				<view class="right_title">问题分类</view>
				<scroll-view scroll-y class="rightscroll">
					<view class="tabwarp">
						<view class="tab_item" :class="item.select ? 'tab_item_active' : ''" v-for="(item,index) in typeList" :key="index" @click="changeType(index)">{{item.name}}</view>
						<view class="noData" v-if="typeList.length == 0">暂无更多</view>
					</view>
				</scroll-view>
				<view class="right_btn" @click="sureList">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { netKnowledgeList } from '@/api/api.js'
	
	export default{
		data() {
			return{
				pid:0,
				parentList:[],
				parentid:'',
				parentname:'',
				typeList:[],
				typeIndex:null
			}
		},
		onLoad() {
			this.getList()
		},
		methods:{
			getList() {
				netKnowledgeList({pid:this.pid}).then(res=>{
					this.parentList = res.data
					this.parentid = res.data[0].id
					this.parentname = res.data[0].name
					this.getChild()
				})
			},
			changeParent(item) {
				this.parentid = item.id
				this.parentname = item.name
				this.typeIndex = null
				this.getChild()
			},
			getChild() {
				netKnowledgeList({pid:this.parentid}).then(res=>{
					let data = res.data
					data.forEach(ele=>{
						ele.select = false
					})
					this.typeList = data
				})
			},
			changeType(index) {
				let obj = this.typeList[index]
				obj.select = !obj.select
				this.$set(this.typeList,index,obj)
			},
			sureList() {
				let data = this.typeList
				let arr = []
				data.forEach(ele=>{
					if(ele.select){
						arr.push(ele)
					}
				})
				if(arr.length == 0) {
					uni.showToast({
						title:'请选择问题分类',
						icon:'none'
					})
					return
				}
				this.$store.commit('SETPROBLEMPARENT',{id:this.parentid,name:this.parentname})
				this.$store.commit('SETPROBLEMLIST',arr)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.know_warp{
		width:750rpx;
		height:100vh;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.know_left{
			width:250rpx;
			height:100vh;
			.leftscroll{
				width:100%;
				height:100%;
				background:#f5f5f5;
				.listwarp{
					.list_item{
						font-size:32rpx;
						color:#999999;
						padding:30rpx 40rpx;
						background:#f5f5f5;
						border-bottom:1rpx solid rgba(153, 153, 153, 0.5);
						border-right:1rpx solid rgba(153, 153, 153, 0.5);
					}
					.list_item_active{
						background:#fff;
						color:$uni-text-color;
						border-right:0;
						position: relative;
						&::before{
							width:20rpx;
							height:100%;
							content:'';
							position: absolute;
							left:0;
							top:0;
							background:$uni-text-color;
						}
					}
				}
			}
		}
		.know_right{
			width:500rpx;
			height:100%;
			.right_title{
				font-size:30rpx;
				color:#666666;
				text-align: center;
				padding:30rpx 0;
			}
			.right_btn{
				width:415rpx;
				height:88rpx;
				border-radius: 10rpx;
				background:$uni-text-color;
				font-size:32rpx;
				color:#fff;
				text-align: center;
				line-height: 88rpx;
				margin:24rpx auto;
			}
			.rightscroll{
				width:100%;
				height:calc(100vh - 230rpx);
				.tabwarp{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;
					.tab_item{
						font-size:30rpx;
						padding:10rpx 34rpx;
						border-radius: 10rpx;
						border:1rpx solid $uni-text-color;
						color:$uni-text-color;
						margin-right:15rpx;
						margin-left:15rpx;
						margin-bottom:24rpx;
						flex-shrink: 0;
					}
					.tab_item_active{
						background:$uni-text-color;
						color:#fff;
					}
				}
			}
		}
	}
</style>
