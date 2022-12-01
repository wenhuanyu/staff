<template>
	<view>
		<view class="cirtit">负责人</view>
		<view class="cirinfo" v-for="(item,index) in arr" :key="index" v-if="item.roles == 1">
			<image :src="item.img" class="staffimg"></image>
			<view class="staffinfo">
				<!-- @click="toSelectStaff" -->
				<view class="staffright" >
					<view class="ri_left">
						<view class="name">{{item.name}}</view>
						<view class="post">{{item.post}}</view>
					</view>
					<view class="iconfont icon-you"></view>
				</view>
				<view class="staffli">
					<view class="statext">权限</view>
					<view class="liright">
						负责人
						<view class="iconfont icon-you"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="cirtit">团队成员</view>
		<view class="cirinfo" v-for="(item,index) in arr" :key="index" v-if="item.roles == 2">
			<image :src="item.img" class="staffimg"></image>
			<view class="staffinfo">
				<view class="staffright">
					<view class="ri_left">
						<view class="name">{{item.name}}</view>
						<view class="post">{{item.post}}</view>
					</view>
					<image :src="BASE_IMG_URL+'/index/delete.png'" @click="delFollow(index)" class="deleimg"></image>
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
	import { commonFun } from '@/common/navigate.js'
	import { BASE_IMG_URL} from '@/api/http.js'
	import { mapState } from 'vuex'
	import { netFollowPerson, netEditFollowperson, netQuoteFollowList, netEditQuoteFollow, netEditEventFollow,
			netEventFollowList, netProoFollowList, netEditProofingFollow, netContractFollowList, netEditContractFollow, netOrderFollowList, netEditOrderFollow, netConsumeFollowList,
			netAddConsumeFollow, netApprovalFollowList, netEditApprovalFollow,netTeamEdit,netTeamList} from '@/api/api.js'
	
	export default{
		mixins:[commonFun],
		data() {
			return{
				noClick:true,    //防止  重复点击
				BASE_IMG_URL:BASE_IMG_URL,
				id:'',
				type:'',
				arr:[],
				preArr:['只读','读写']
			}
		},
		computed:mapState({
			staffObj: state => state.customer.staffObj
		}),
		watch:{
			staffObj(newvalue,oldvalue) {
				if(newvalue){
					let num = null
					let obj = {}
					this.arr.forEach((ele,index)=>{
						if(ele.roles == 1){
							obj = Object.assign({},ele,newvalue)
							num = index
							obj.staff = newvalue
							obj.staff_id = newvalue.id
						}
					})
					this.$set(this.arr,num,obj)
				}
			}
		},
		onLoad(options) {
			this.id = options.id
			this.type = options.type
			this.$store.commit('STAFFOBJ',null)
			this.getList()
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
			getList() {
				if(this.type == 'workorder'){
					//获取工单 联合跟进人
					netFollowPerson({id:this.id}).then(res=>{
						this.arr = this.handleData(res.data)
					})
				}else if(this.type == 'quote'){
					//报价
					netQuoteFollowList({id:this.id}).then(res=>{
						uni.setStorageSync('quoteAddFollow',true)
						this.arr = this.handleData(res.data)
					})
				}else if(this.type == 'event'){
					//任务
					netEventFollowList({id:this.id}).then(res=>{
						this.arr = this.handleData(res.data)
					})
				}else if(this.type == 'proofing'){
					//打样
					netProoFollowList({id:this.id}).then(res=>{
						this.arr = this.handleData(res.data)
					})
				}else if(this.type == 'customer'){
					//客户
					netTeamList({id:this.id}).then(res=>{
						this.arr = this.handleData(res.data)
					})
				}else if(this.type == 'contract'){
					//合同
					netContractFollowList({id:this.id}).then(res=>{
						this.arr = this.handleData(res.data)
					})
				}else if(this.type == 'order'){
					//订单
					netOrderFollowList({id:this.id}).then(res=>{
						this.arr = this.handleData(res.data)
					})
				}else if(this.type == 'consume'){
					//费用
					netConsumeFollowList({id:this.id}).then(res=>{
						this.arr = this.handleData(res.data)
					})
				}else if(this.type == 'approval'){
					//审批
					netApprovalFollowList({id:this.id}).then(res=>{
						this.arr = this.handleData(res.data)
					})
				}
			},
			handleData(data) {
				let arr = []
				data.forEach(ele=>{
					arr.push(ele)
				})
				return arr
			},
			handleResult(res) {
				uni.showToast({
					title:res.msg,
					icon:'none'
				})
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					})
				},2000)
			},
			sureSub() {
				let params = {
					id:this.id,
					staff:this.arr
				}
				if(this.type == 'workorder'){
					//工单 
					netEditFollowperson(params).then(res=>{
						this.handleResult(res)
					})
				}else if(this.type == 'quote'){
					//报价
					netEditQuoteFollow(params).then(res=>{
						this.handleResult(res)
					})
				}else if(this.type == 'event'){
					//任务
					netEditEventFollow(params).then(res=>{
						this.handleResult(res)
					})
				}else if(this.type == 'proofing'){
					//打样
					netEditProofingFollow(params).then(res=>{
						this.handleResult(res)
					})
				}else if(this.type == 'customer'){
					//客户
					netTeamEdit(params).then(res=>{
						this.handleResult(res)
					})
				}else if(this.type == 'contract'){
					//合同
					netEditContractFollow(params).then(res=>{
						this.handleResult(res)
					})
				}else if(this.type == 'order'){
					//订单
					netEditOrderFollow(params).then(res=>{
						this.handleResult(res)
					})
				}else if(this.type == 'consume'){
					//费用
					netEditConsumeFollow(params).then(res=>{
						this.handleResult(res)
					})
				}else if(this.type == 'approval'){
					//审批
					netEditApprovalFollow(params).then(res=>{
						this.handleResult(res)
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cirtit{
		padding:24rpx 30rpx;
		font-size:28rpx;
		border-bottom:1rpx solid #f5f5f5;
	}
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
