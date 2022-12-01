<template>
	<view class="select_member">
		<view class="member">
			<view class="searchbox">
				<view class="searbox" style="width:480rpx">
					<view class="censear">
						<image :src="BASE_IMG_URL+'/index/search.png'" class="searimg"></image>
						<input type="text" placeholder="请输入关键词搜索" @input="queryList" class="lself" placeholder-style="color:#4E80F5">
					</view>
				</view>
				<view class="querylist">
					<view class="queryfir">
						<picker  @change="changeData" :range="dataArr" :value="dataIndex" :range-key="'name'">
							<view class="form_right">
								<image :src="BASE_IMG_URL+'/index/shaixuan.png'" class="bottomimg"></image>
								<view>{{dataArr[dataIndex] ? dataArr[dataIndex].name : '请选择'}}</view>
							</view>
						</picker>
					</view>
					<view class="querysec" @click="changeAll">
						{{isSelectAll ? '取消' : '全选'}}
					</view>
				</view>
			</view>
			<view class="list">
				<view class="li" v-for="(item,index) in list" :key="index">
					<label class="radio">
						<view class="li_name"  @click="selectItem(item,index)">
							<radio color="#0081ff" value="r1" :checked="item.isSelect" />
							<image :src="item.img" class="li_img"></image>
							<view class="name">{{item.name}}</view>
							<view class="post">{{item.post}}</view>
						</view>
					</label>
				</view>
				<view class="noData" v-if="list.length == 0">暂无更多</view>
			</view>
			<view style="height:110rpx"></view>
			<view class="bottom_warp">
				<view class="removebtn bot_btn" @click="quxiao">取消</view>
				<view class="bot_btn" @click="queding">确定</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { netStaffList, netGetTargetSelect, netAddapprovalAll } from '@/api/api.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default {
		data() {
			return {
				BASE_IMG_URL:BASE_IMG_URL,
				list:[],
				value:'',
				selectInfo:{},
				type:null,   //选择上级
				isSelectAll:false,   //是否全选
				dataArr:[],  //筛选部门
				dataIndex:0,
				
				relation_type:'',   //关联类型
				relation_id:'',  //关联id
			}
		},
		onLoad(options) {
			this.relation_id = options.id
			this.relation_type = options.type
		},
		onShow() {
			this.getList()
			 // 获取 筛选条件
			this.getSelect()
		},
		methods: {
			getList() {
				let params = {
					name:this.value,
					department_id:this.dataArr[this.dataIndex] ? this.dataArr[this.dataIndex].id: ''
				}
				netStaffList(params).then(res=>{
					res = res.data
					res.forEach(ele=>{
						ele.isDel = true,
						ele.isSelect = false
					})
					this.list = res
				})
			},
			getSelect() {
				netGetTargetSelect().then(res=>{
					this.dataArr = res.data.department
				})
			},
			//是否全选
			changeAll() {
				if(this.list.length == 0) {
					return
				}
				this.isSelectAll = !this.isSelectAll
				let arr = this.list
				if(this.isSelectAll){
					arr.forEach(ele=>{
						ele.isSelect = true
					})
				}else{
					arr.forEach(ele=>{
						ele.isSelect = false
					})
				}
				this.list = arr
			},
			selectItem(item,index) {
				this.selectInfo = item
				let arr = this.list
				arr[index].isSelect = !arr[index].isSelect
				this.list = arr
			},
			queding() {
				let arr = []   //内存 数据
				this.list.forEach(ele=>{
					if(ele.isSelect){
						arr.push(ele.id)
					}
				})
				if(arr.length == 0) {
					uni.showToast({
						title:'请选择指派人',
						icon:'none'
					})
					return
				}
				
				
			},
			quxiao() {
				uni.navigateBack({
					delta:1
				})
			},
			//搜索
			queryList(e) {
				this.value = e.detail.value
				this.getList()
			},
			//
			changeData(e) {
				this.dataIndex = e.detail.value
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bottom_warp{
		position: fixed;
		left:0;
		bottom:0;
		width:750rpx;
		height:100rpx;
		background:#fff;
		border-top:1rpx solid #f5f5f5;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.bot_btn{
			width:260rpx;
			height:80rpx;
			border-radius: 40rpx;
			font-size:26rpx;
			text-align: center;
			line-height: 80rpx;
			color:#fff;
			background:#007AFF;
		}
		.removebtn{
			background:#ff7800;
		}
	}
	.searbox{
		padding:10rpx 0 20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background:$uni-btn-bg-color;
		.censear{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:0 24rpx;
			border-radius: 34rpx;
			background:#FFFFFF;
			width:480rpx;
			height:68rpx;
			.searimg{
				width:48rpx;
				height:48rpx;
			}
			.lself{
				.lself{
					font-size:26rpx;
					color:rgba(2, 135, 255, 1);
				}
			}
		}
	}
.list{
	padding:20rpx 24rpx 150rpx;
	background:#fff;
	.li{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding:20rpx 0;
		border-bottom:1rpx solid #EAEAEA;
		.li_img{
			width:60rpx;
			height:60rpx;
			border-radius: 50%;
			margin:0 30rpx;
		}
		.li_name{
			display: flex;
		}
		.radio{
			width:100%;
		}
		.name{
			width: 30%;
			font-size:24rpx;
			color:#333333;
			margin-left:24rpx;
			line-height: 60rpx;
		}
		.post{
			font-size:24rpx;
			color:#666666;
			margin-left:24rpx;
			line-height: 60rpx;
		}
	}
}
.radio{
	radio{
		transform: scale(0.6);
	}
}
.searchbox{
	display: flex;
	justify-content: space-between;
	align-items: center;
	background:#0287FF;
	padding-right:24rpx;
	margin-bottom:24rpx;
	padding:0 30rpx;
}
.querylist{
	height:100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	.queryfir{
		padding:15rpx 0;
		width:120rpx;
		flex-shrink: 0;
	}
	.querysec{
		padding:15rpx;
		color:#fff;
	}
}
// 数据看板
.form_right{
	height:50rpx;
	font-size:22rpx;
	color:#fff;
	text-align: center;
	line-height: 48rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	.bottomimg{
		width:43rpx;
		height:44rpx;
		margin-left:15rpx;
	}
}

</style>

