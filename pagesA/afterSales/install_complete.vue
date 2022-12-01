<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="fllow_form">
			<view class="key">安装进度<span>*</span></view>
			<view class="form_right">
				<view class="radiowarp" >
					<view class="" @click="changeOver(1)">
						<radio value="1" color="#008EFF" :checked="resolved_results == 1" />安装完成
					</view>
					<view class="" @click="changeOver(9)">
						<radio value="9" color="#008EFF" :checked="resolved_results == 9" />未完成
					</view>
				</view>
			</view>
		</view>
		<view class="fllow_area">
			<view class="fllo_list">
				<view class="area_head key">情况说明:<span v-if="resolved_results == 9">*</span></view>
				<view class="list_text" v-if="resolved_results == 9" @click="toRemarksTemp">选择模板</view>
			</view>
			<textarea v-model="desc" maxlength="-1" :class="desc ? 'valueActive' : '' " placeholder="请填写情况说明"
				placeholder-style="color:#999" />
		</view>
		<view class="fllow_form" style="margin-top:24rpx;">
			<view class="key">配件费用</view>
		</view>
		<view class="prolist">
			<view class="probox">
				<view class="proli" v-for="(item,index) in partsList" :key="index">
					<view class="iconfont icon-jian" @click="delParts(index)"></view>
					<view class="protext">{{item.name}}</view>
					<view class="protext">
						<uni-number-box :min="1" v-model="item.number" @change="(e)=>{changePartNumber(e,index)}" />
					</view>
				</view>
			</view>
		</view>
		<view class="add_in" @click="toAddPart">
			<view class="iconfont icon-jiahaocu"></view>
			添加配件
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户确认人姓名<span>*</span></view>
			<view class="form_right">
				<input type="text" :class="complete_name ? 'valueActive' : '' "  v-model="complete_name" placeholder-style="font-size:24rpx;" placeholder="客户确认人姓名" />
			</view>
		</view>
		<view class="inp_warp">
			<view class="inp_title key">客户确认人联系电话<span>*</span></view>
			<view class="form_right">
				<input type="text" :class="complete_contact ? 'valueActive' : '' "  v-model="complete_contact" placeholder-style="font-size:24rpx;" placeholder="客户确认联系人电话" />
			</view>
		</view>
		<view class="inp_warp" style="border-top:1rpx solid #f5f5f5">
			<view class="inp_title key">培训内容<span>*</span></view>
		</view>
		<uni-collapse v-model="activeNames" @change="changeVan" ref="collapse">
			<uni-collapse-item :name="index" v-for="(item,index) in selectTrain" :key="index">
				<view slot="title">
					<view class="train_fir">
						<view class="iconfont icon-jian" @click.stop="delTrain(index)"></view>
						<view class="train_tit" v-if="item.id != 6">{{item.name}}</view>
						<view class="train_tit" v-if="item.id == 6">其他培训内容</view>
					</view>
				</view>
				<view class="train_li" v-if="item.id != 6">
					<view class="tr_tit_li" v-for="(ele,eleindex) in item.content" :key="eleindex">
						<view class="tr_tit_li_t">({{eleindex + 1}}){{ele.type}}</view>
						<view class="fllow_area">
							<view class="fllo_list">
								<view class="area_head key">培训结果:</view>
							</view>
							<textarea v-model="ele.result" style="height:150rpx" maxlength="-1" :class="ele.result ? 'valueActive' : '' " placeholder="请填写培训结果"
								placeholder-style="color:#999" />
						</view>
						<view class="fllow_area">
							<view class="fllo_list">
								<view class="area_head key">参加培训人员:</view>
							</view>
							<view class="imglist">
								<view class="imgbox" v-for="(imgele,imgindex) in ele.autograph" :key="index">
									<image :src="BASE_IMG_URL+'/index/close.png'" class="delimg" @click="delImg(index,eleindex,imgindex)" ></image>
									<image :src="imgele.url" class="selfimg" ></image>
								</view>
								<view class="imgbox" style="border:none" @click="toQianming(index,eleindex)">
									<view class="signbtn">签名</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="tr_tit_li" v-if="item.id == 6">
					<view v-for="(ele,eleindex) in item.content" :key="eleindex">
						<view class="fllow_area">
							<view class="fllo_list">
								<view class="area_head key">其他培训内容:<span>*</span></view>
							</view>
							<textarea v-model="ele.type" style="height:150rpx" maxlength="-1" :class="ele.type ? 'valueActive' : '' " placeholder="请填写其他培训内容"
								placeholder-style="color:#999" />
						</view>
						<view class="fllow_area">
							<view class="fllo_list">
								<view class="area_head key">培训结果:<span>*</span></view>
							</view>
							<textarea v-model="ele.result" style="height:150rpx" maxlength="-1" :class="ele.result ? 'valueActive' : '' " placeholder="请填写培训结果"
								placeholder-style="color:#999" />
						</view>
						<view class="fllow_area">
							<view class="fllo_list">
								<view class="area_head key">参加培训人员:<span>*</span></view>
							</view>
							<view class="imglist">
								<view class="imgbox" v-for="(imgele,imgindex) in ele.autograph" :key="index">
									<image :src="BASE_IMG_URL+'/index/close.png'" class="delimg" @click="delImg(index,eleindex,imgindex)" ></image>
									<image :src="imgele.url" class="selfimg" ></image>
								</view>
								<view class="imgbox" style="border:none" @click="toQianming(index,eleindex)">
									<view class="signbtn">签名</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<view class="button" @click="$noMultipleClicks(toComplate)">确定</view>
		
		<select-work-parts ref="partChild"  @selectList="selectParts"></select-work-parts>
		
		<!-- 培训列表 弹窗 -->
		<uni-popup ref="popup" type="bottom" background-color="#fff" @touchmove.stop.prevent>
			<view class="popbox">
				<view class="poptit">培训内容</view>
				<scroll-view scroll-y="true" style="width:100%;height:650rpx">
					<view style="padding:24rpx 0">
						<view class="pop_li" v-for="(item,index) in trainList" :key="index" @click="toSelectTrain(index)">
							<radio value="1" color="#ff7800" :checked="item.select"></radio> {{item.name}}
						</view>
					</view>
				</scroll-view>
				<view class="pop_btn">
					<view class="bttn" style="background:#ff7800" @click="quxiao">取消</view>
					<view class="bttn"  @click="handleTrain">确定</view>
				</view>
				<view style="height:env(safe-area-inset-bottom)"></view>
			</view>
		</uni-popup>
		
		<hand-written-sign ref="signChild"  @signDone="signDone"></hand-written-sign>
		
	</view>
</template>

<script>
	import { netWorkOrderDetail, netCompleteWorkorder, netTrainContent, netLngTransAddress } from '@/api/api'
	import selectWorkParts from '@/components/selectWorkParts/index'
	import { commonFun } from '@/common/navigate.js'
	import { mapState } from 'vuex'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		mixins:[commonFun],
		components:{
			selectWorkParts
		},
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				id:'',   //工单id
				partsList:[],   //配件列表
				lng:'',
				lat:'',
				location:'',
				resolved_results:'1',  //1 已解决     9 未解决
				desc:'',    //备注
				//培训内容
				activeNames:[0],
				showTrain:false,
				selectTrain:[],
				complete_contact:'',   //客户确认联系人  电话
				complete_name:'',   //客户确认人 姓名
				trainList:[
					{
						id:1,
						name:'喷胶机培训内容',
						select:false,
						data:[
							{type:'控制器操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'喷枪操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'抽胶泵操作及使用、保养',result:'',people:'',autograph:[]}
						],
					},
					{
						id:2,
						name:'等离子培训内容',
						select:false,
						data:[
							{type:'等离子操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'等离子使用注意事项',result:'',people:'',autograph:[]}
						],
					},
					{
						id:3,
						name:'热熔胶机培训内容',
						select:false,
						data:[
							{type:'控制器操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'热胶枪操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'胶缸操作及使用、保养',result:'',people:'',autograph:[]}
						],
					},
					{
						id:4,
						name:'贴头培训内容',
						select:false,
						data:[
							{type:'贴头操作及使用、保养',result:'',people:'',autograph:[]}
						],
					},
					{
						id:5,
						name:'贴胶平台培训内容',
						select:false,
						data:[
							{type:'给纸部操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'纠偏部操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'贴胶部操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'控制器操作及使用、保养',result:'',people:'',autograph:[]},
							{type:'收纸部操作及使用、保养',result:'',people:'',autograph:[]}
						],
					},
					{
						id:6,
						name:'其他类设备培训内容',
						select:false,
						data:[
							{type:'',result:'',people:'',autograph:[]},
						],
					}
				],
				otherObj:{
					id:6,
					name:'其他类设备培训内容',
					select:false,
					content:[
						{type:'',result:'',people:'',autograph:[]},
					],
				},
				firIndex:null,
				secIndex:null,
			}
		},
		computed:mapState({
			uninstall_reason: state => state.template.uninstall_reason
		}),
		onShow() {
			if(this.uninstall_reason){
				this.desc += ','+this.uninstall_reason
			}
		},
		onHide() {
			this.$store.commit('UNINSTALL_REASON','')
		},
		onLoad(options) {
			this.id = options.workorderid
			//获取配件列表
			this.getPart()
			//获取培训内容
			this.getTrain()
			//获取位置
			this.getAddressinfo()
		},
		methods:{
			//获取培训内容
			getTrain() {
				netTrainContent({id:this.id}).then(res=>{
					let data = this.deWeight(res.data)
					data.forEach(ele=>{
						let arr = []
						ele.data.forEach(item=>{
							let obj = {
								type: item,
								result: '',
								autograph: []
							}
							arr.push(obj)
						})
						ele.content = arr
					})
					data.push(this.otherObj)
					this.selectTrain = data
				})
			},
			moveHandle() {},
			//培训人员签名
			toQianming(index,eleindex) {
				this.firIndex = index
				this.secIndex = eleindex
				this.$refs.signChild.open()
			},
			//完成签名
			signDone(img) {
				let obj = this.selectTrain[this.firIndex]
				obj.content[this.secIndex].autograph.push(img)
				this.$set(this.trainList,this.firIndex,obj)
			},
			//删除签名
			delImg(firindex,secindex,thrindex) {
				let obj = this.selectTrain[firindex]
				obj.content[secindex].autograph.splice(thrindex,1)
				this.$set(this.trainList,firindex,obj)
			},
			//////////////////////////////////////////////////////////
			closePop() {
				this.showTrain = false
			},
			//选择
			toSelectTrain(index){
				let obj = this.trainList[index]
				obj.select = !obj.select
				this.$set(this.trainList,index,obj)
			},
			//处理选择的培训
			handleTrain() {
				let arr = []
				this.trainList.forEach(ele=>{
					if(ele.select){
						arr.push(ele)
					}
				})
				this.selectTrain = this.deWeight(this.selectTrain.concat(arr))
				this.quxiao()
			},
			quxiao() {
				this.showTrain = false
				let arr = this.trainList
				arr.forEach(ele=>{
					ele.select = false
				})
				this.trainList = arr
			},
			//删除选中的内容
			delTrain(index) {
				this.selectTrain.splice(index,1)
			},
			changeVan(e) {
				this.activeNames = e
				this.init()
			},
			init() {
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			},
			getAddressinfo() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.lng = res.longitude
						this.lat = res.latitude
						//地址逆解析
						let params = {
							lat: res.latitude,
							lng: res.longitude
						}
						netLngTransAddress(params).then(data=>{
							data = data.data.result
							this.location = data.address
						})
					},
					fail: (err) => {
						if(err.errMsg == 'getLocation:fail auth deny'){
							uni.navigateTo({
								title:'请允许使用位置信息',
								icon:'none'
							})
						}
					}
				})
			},
			changeOver(e){
				this.resolved_results = e
			},
			getPart() {
				netWorkOrderDetail({id:this.id}).then(res=>{
					this.partsList = res.data.parts
				})
			},
			//配件
			toAddPart() {
				this.$refs.partChild.init(this.id)
			},
			selectParts(arr) {
				arr.forEach(ele=>{
					ele.number = 1
				})
				let data = this.partsList.concat(arr)
				this.partsList = this.deWeight(data)
			},
			delParts(index) {
				this.partsList.splice(index,1)
			},
			changePartNumber(e,index) {
				let obj = this.partsList[index]
				obj.number = e
				this.$set(this.partsList,index,obj)
			},
			//选择客户需求 模板
			toRemarksTemp() {
				uni.navigateTo({
					url:'/pagesA/customerInfo/visit/needTemplate?type=安装未完成原因'
				})
			},
			toComplate() {
				if(!this.resolved_results){
					uni.showToast({
						title:'请选择安装进度',
						icon:'none'
					})
					return
				}
				if(!this.complete_name) {
					uni.showToast({
						title:'请填写客户确认人姓名',
						icon:'none'
					})
					return
				}
				if(!this.complete_contact) {
					uni.showToast({
						title:'请填写客户确认人电话',
						icon:'none'
					})
					return
				}
				if(this.resolved_results == 9 && !this.desc){
					uni.showToast({
						title:'请填写情况说明',
						icon:'none'
					})
					return
				}
				//处理培训数据
				let arr = this.selectTrain
				
				arr.forEach(ele=>{
					ele.content.forEach(item=>{
						let d = []
						item.autograph.forEach(im=>{
							d.push(im.id)
						})
						item.autograph_url = d.join(',')
						delete item.autograph
					})
				})
				this.selectTrain = arr
				
				let params = {
					id:this.id,
					lng:this.lng,
					lat:this.lat,
					location:this.location,
					resolved_results:this.resolved_results,
					desc:this.desc,
					use_parts: this.partsList,
					train_content:this.selectTrain,
					complete_contact:this.complete_contact,
					complete_name:this.complete_name,
				}
				console.log(params)
				netCompleteWorkorder(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta:1
						})
					}, 2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.imglist {
		background: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	
		.imgbox {
			width: 145rpx;
			height: 145rpx;
			margin-right: 14rpx;
			position: relative;
			margin-bottom: 24rpx;
			border: 1rpx solid #EAEAEA;
			&:nth-child(4n){
				margin-right:0;
			}
			.delimg {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				position: absolute;
				right: -16rpx;
				top: -16rpx;
				background: rgba(0, 0, 0, 0.5);
				z-index: 2;
			}
	
			.selfimg {
				width: 145rpx;
				height: 145rpx;
			}
			.signbtn{
				width:120rpx;
				height:60rpx;
				background: $uni-text-color;
				font-size:24rpx;
				color:#fff;
				text-align: center;
				line-height: 60rpx;
			}
		}
	}
	.tr_tit_li{
		border-bottom:1rpx solid #f5f5f5;
		.tr_tit_li_t{
			padding-left:24rpx;
			font-size:26rpx;
			color:#333;
		}
	}
	.train_fir{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding:24rpx;
		.icon-jian{
			font-size:35rpx;
			color:#ff7800;
		}
		.train_tit{
			font-size:32rpx;
			margin-left:24rpx;
			color:#000;
		}
	}
	.inp_warp {
		padding:30rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #EDEDED;
		.inp_title {
			font-size: 26rpx;
			color: #666;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:440rpx;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.rightinput{
				width:100%;
				text-align: right;
			}
		}
		.add_in{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size:26rpx;
			color:$uni-text-color;
			.icon-jiahaocu{
				font-size:28rpx;
				color:$uni-text-color;
				margin-right:5rpx;
			}
		}
	}
	.fllo_list{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom:15rpx;
		margin-top:15rpx;
		.area_head {
			margin-bottom: 20rpx;
			font-size:26rpx;
		}
		.list_text{
			font-size:26rpx;
			color:$uni-text-color;
		}
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid #EDEDED;
		padding: 30rpx;
		.form_right {
			display: flex;
			color: #999;
			text-align: right;
			.form_input {
				width:300rpx;
				text-align: right;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
			.radiowarp{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding: 0 30rpx 0rpx;
		margin-bottom: 30rpx;
		.area_head {
			color:#666;
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 20rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
	.prolist{
		background-color: #fff;
		// border-bottom: 1rpx solid #EAEAEA;
		padding: 30rpx 24rpx;
		.ptotitle{
			font-size:26rpx;
			color:#333;
		}
		.probox{
			padding:0 24rpx;
			.proli{
				padding:24rpx 0;
				border-bottom:1rpx dashed #EDEDED;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:last-child{
					border-bottom:0;
				}
				.icon-jian{
					font-size:42rpx;
					color:#ff7800;
				}
				.protext{
					font-size:24rpx;
					color:#333;
					width:200rpx;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					.priceinput{
						width:180rpx;
						font-size:24rpx;
						color:#333;
					}
				}
			}
		}
	}
	.add_in{
		display: flex;
		justify-content: center;
		align-items: center;
		padding:15rpx 0;
		background:#fff;
		font-size:28rpx;
		color:$uni-text-color;
		.icon-jiahaocu{
			font-size:30rpx;
			color:$uni-text-color;
		}
	}
	.popbox{
		padding:30rpx;
		.poptit{
			font-size:30rpx;
			text-align: center;
			color:#333;
			margin-bottom:24rpx;
		}
		.pop_li{
			width:620rpx;
			padding:24rpx 30rpx;
			border-radius: 10rpx;
			box-shadow: 1rpx 6rpx 8rpx 2rpx rgba(0,0,0,0.1);
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin:0 auto 24rpx;
			font-size:24rpx;
			color:#333;
			radio{
				transform: scale(0.7);
			}
		}
		.pop_btn{
			margin:0 auto;
			width:650rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.bttn{
				width:220rpx;
				height:70rpx;
				border-radius: 40rpx;
				font-size:26rpx;
				color:#fff;
				background:#007AFF;
				text-align: center;
				line-height: 70rpx;
			}
		}
	}
</style>
