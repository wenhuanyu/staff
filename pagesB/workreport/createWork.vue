<template>
	<view>
		<view class="fllow_form">
			<view class="reportTitle">
				<view class="title" style="background-color: #AF99FE;" v-if="typename == '日报'">
					<text>{{typename}}</text>
				</view>
				<view class="title" style="background-color: #FBB545;" v-if="typename == '周报'">
					<text>{{typename}}</text>
				</view>
				<view class="title" style="background-color: #4AD49D;" v-if="typename == '月报'">
					<text>{{typename}}</text>
				</view>
				<view class="title" style="background-color: #FF6E7F;" v-if="typename == '季报'">
					<text>{{typename}}</text>
				</view>
				<view class="title" style="background-color: #54B1F7;" v-if="typename == '年报'">
					<text>{{typename}}</text>
				</view>
			</view>
		</view>
		<view class="top_required">
			只展示<span style="color:#f00">必填</span>字段<switch :checked="isRequired" color="#008EFF" @change="changeRequired" />
		</view>
		<form-item v-if="listForm" :listForm="listForm" :isNotRequired="isRequired" :height="200" @changeData="changeData"></form-item>
		<!-- 审核信息 -->
		<examine-people title="提醒谁看" :flag="false" :list="remindPeople" @delItem="delRemind"></examine-people>
		
		<view class="button" @click="$noMultipleClicks(subSave)">
			保存
		</view>
		<view class="botsec"></view>
	</view>
</template>

<script>
	import { netSetForm, netCreateWork, netSetStorage, netWorkDraftDetail } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import { BASE_IMG_URL } from '@/api/http.js'
	import { commonFun } from '@/common/navigate'
	let T;
	export default {
		mixins:[commonFun],
		components:{
			formItem
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				info:{},
				listForm:null,
				remindPeople: [], //提醒谁看
				examineType:'approval',
				typeList:[
					{id:1,name:'日报',value:'daily'},
					{id:2,name:'周报',value:'weekly'},
					{id:3,name:'月报',value:'monthly'},
					{id:4,name:'季报',value:'quarterly'},
					{id:5,name:'年报',value:'yearly'}
				],
				typeIndex:0,
				typename:'日报',
				isRequired:false,  //是否只展示必填字段
			}
		},
		onLoad(param) {
			if(param.type ==1){
				this.typename = '日报';
				this.typeIndex= 0;
			}else if(param.type ==2){
				this.typename = '周报';
				this.typeIndex= 1;
			}else if(param.type ==3){
				this.typename = '月报';
				this.typeIndex= 2;
			}else if(param.type ==4){
				this.typename = '季报';
				this.typeIndex= 3;
			}else if(param.type ==5){
				this.typename = '年报';
				this.typeIndex= 4;
			}
			//表单
			this.getForm()
			T= setInterval(()=>{
				this.subSaveDraft()
			},30000)
		},
		onShow() {
			if(!uni.getStorageInfoSync('isJumpPage')){
				this.getDetail();
			}
			this.getDefaultRemind()
		},
		onUnload() {
			clearInterval(T)
			uni.removeStorageSync('remindlist')
		},
		methods:{
			//切换是否只展示必填字段
			changeRequired(e) {
				this.isRequired = e.detail.value
			},
			changeType(e) {
				this.typeIndex = e.detail.value
				this.getForm()
			},
			// 选择成员
			moreClick() {
				this.subSaveDraft()
				uni.navigateTo({
					url: '/pagesA/crm/selectMember/selectMember'
				})
			},
			getForm() {
				let params = {
					type: this.typeList[this.typeIndex].value
				}
				netSetForm(params).then(res=>{
					let arr = res.data.data
					arr.forEach(ele=>{
						ele.value = ele.value?ele.value:''
					})
					this.listForm = arr
				})
			},
			changeData(name,value,obj) {
				let arr = this.listForm
				let item = this.changeFormData(name,value,obj)
				arr.forEach((ele, index) => {
					if (ele.id == obj.id) {
						this.$set(this.listForm, index, item)
					}
				})
			},
			subSave() {
				let arr = []
				let params = this.checkCommonForm(this.listForm)
				if(!params){
					return
				}
				//提醒谁看
				let remarr = []
				this.remindPeople.forEach(ele => {
					remarr.push(ele.id)
				})
				params.reminds_id = remarr.join(',')
				params.type = this.typename
				netCreateWork(params).then(res=>{
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				})
			},
			//保存草稿
			subSaveDraft() {
				let params = this.checkCommonForm(this.listForm)
				if(!params){
					return
				}
				//提醒谁看
				let remarr = []
				this.remindPeople.forEach(ele => {
					remarr.push(ele.id)
				})
				params.reminds_id = remarr.join(',')
				params.type = this.typename
				netSetStorage(params).then(res=>{})
			},
			//草稿详情
			getDetail() {
				netWorkDraftDetail({type:this.typename}).then(res=>{
					if(res.data){
						this.info = res.data
						if(res.data.type_index){
							this.typeIndex =res.data.type_index
						}
						// if(res.data.staff_info){
						// 	this.remindPeople = [];
						// 	uni.removeStorageSync('remindlist')
						// 	let staff_info = res.data.staff_info
						// 	staff_info.forEach((ele,index) => {
						// 		if(index >0){
						// 			ele.isDel = true
						// 		}else{
						// 			ele.isDel = false
						// 		}
								
						// 	})
						// 	this.remindPeople =staff_info;
						// 	uni.setStorageSync('remindlist', this.remindPeople)
						// }
						this.getForminfo()
						
					}
					
					
				})
			},
			getForminfo() {
				let params = {
					type: this.typeList[this.typeIndex].value
				}
				netSetForm(params).then(res=>{
					res = res.data.data
					this.listForm = this.handleFormDefaultValue(res,this.info)
				})
			},
		}
	}
</script>


<style lang="scss" scoped>
	.valueActive{
		color:#333;
	}
	.fllow_form {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx 24rpx;
		:first-child{
			flex-shrink: 0;
		}
		.reportTitle{
			
			.title{
				width: 690rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 16rpx;
				text{
					font-size: 28rpx;
					font-weight: bold;
					color: #fff;
				}
			}
		}
		.form_right {
			display: flex;
			flex-wrap: wrap;
			color: #999;
			text-align: right;
			image {
				width: 40rpx;
				height: 40rpx;
				margin: 28rpx 5rpx 0 0;
			}
		}
		.theme {
			color: #5ca9fe;
		}
		text {
			color: #f00;
			margin-left: 10rpx;
		}
		.form_input {
			input {
				text-align: right;
				margin-right: 10rpx;
			}
		}
	}
	.affiliation {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding-bottom: 40rpx;
	
		.aff_head {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 30rpx;
		}
	
		.aff_con {
			display: flex;
			text-align: center;
			flex-wrap: wrap;
	
			.aff_item {
				width: 100rpx;
				margin-right: 15rpx;
				margin-bottom:15rpx;
				image {
					margin-bottom: 15rpx;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}
	
			.affbox {
				position: relative;
	
				.delremind {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					position: absolute;
					right: -16rpx;
					top: -16rpx;
					background: rgba(0, 0, 0, 0.5);
					z-index: 2;
				}
			}
	
			.aff_last {
				image {
					margin-bottom: 15rpx;
					width: 50rpx;
					height: 50rpx;
				}
			}
		}
	}
</style>
