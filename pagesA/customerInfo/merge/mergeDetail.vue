<template>
	<view>
		<view class="care">
			带<span>*</span>号为必填项
		</view>
		<view class="inp_warp">
			<view class="inp_title key">首联系人<span>*</span></view>
			<picker @change="changeLink" :range="contacts" :value="contactIndex" :range-key="'name'">
				<view class="form_right">
					<view :class="contacts[contactIndex] ? 'valueActive' : '' ">
						{{contacts[contactIndex] ? contacts[contactIndex].name : '请选择首联系人'}}</view>
					<view class="iconfont icon-you"></view>
				</view>
			</picker>
		</view>
		<block v-for="(item,index) in listForm" :key="index">
			<upload-img
				v-if="item.component == 'uploadImage'" 
				:title="item.config.label" 
				:imgList="item.value"
				@uploadImg="(obj)=>{uploadImg(index,obj)}"
				@delImg="(imgIndex)=>{delImg(index,imgIndex)}"
			></upload-img>
			<upload-file
				v-else-if="item.component == 'uploadFile'" 
				:title="item.config.label" 
				:fileList="item.value"
				@uploadFile="(obj)=>{uploadImg(index,obj)}"
				@delFile="(fileIndex)=>{delImg(index,fileIndex)}"
			></upload-file>
			<view class="" v-else-if="item.component == 'editor'">
				<view class="inp_warp">
					<view class="key">{{item.config.label}}<span v-if="item.config.required">*</span></view>
					<view class="form_right" @click="openEditor(index)">
						<view class="">去编辑</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				<view class="fllow_form_edit">
					<view class="editcontent" v-html="item.value"></view>
				</view>
				<!-- 编辑器 -->
				<robin-editor v-if="showEditor" class="editor" @cancel="hideEditor" @save="saveEditor" v-model="item.value_t"
					:imageUploader="uploadEditImg" :muiltImage="true"></robin-editor>
			</view>
			<view class="" v-else-if="item.component == 'label'">
				<view class="inp_warp">
					<view class="key">{{item.config.label}}<span v-if="item.config.required">*</span></view>
					<view class="form_right" @click="toSelectLabel(index)">
						<view class="" v-if="item.value_arr">
							<span 
								class="label_style" 
								v-for="(laItem,laIndex) in item.value" 
								:key="laIndex" 
								:style="{color:laItem.color,border:'1rpx solid ' + laItem.color}"
							>{{laItem.label}}</span>
						</view>
						<view class="" v-else>
							{{item.config.placeholder}}
						</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
			</view>
			<view class="" v-else>
				<view class="inp_warp" v-if="item.arrType">
					<view class="inp_title key">{{item.config.label}}<span v-if="item.config.required">*</span></view>
					<picker @change="(e)=>{changeValue(index,e)}" :range="item.content" :value="item.valueIndex" :range-key="'name'">
						<view class="form_right">
							<view :class="item.value ? 'valueActive' : '' ">
								{{item.value ? item.value.name : item.config.placeholder}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
				<view class="inp_warp" v-else>
					<view class="inp_title key">{{item.config.label}}<span v-if="item.config.required">*</span></view>
					<picker @change="(e)=>{changeValue(index,e)}" :range="item.content" :value="item.valueIndex">
						<view class="form_right">
							<view :class="item.value ? 'valueActive' : '' ">
								{{item.value ? item.value : item.config.placeholder}}</view>
							<view class="iconfont icon-you"></view>
						</view>
					</picker>
				</view>
			</view>
		</block>
		<tki-tree ref="tkitree"
			:range="treeList" 
			:rangeKey="rangeKey"
			:idKey="idKey"
			:selectParent="selectParent"
			:multiple="multiple"
			confirmColor="#008EFF"
			@confirm="selectTree"
		/>
		
		<view class="button" @click="$noMultipleClicks(subSave)">
			保存
		</view>
	</view>
</template>

<script>
	import { netKehuMergeInfo, netSetForm, netAreaList, netKehuSubMerge } from '@/api/api.js'
	import formItem from '@/components/form/formitem.vue'
	import { uploadUrl } from '@/api/api.js'
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	
	export default{
		components:{
			formItem,
			tkiTree
		},
		data() {
			return{
				noClick:true,    //防止  重复点击
				ids:'',
				listForm:null,
				info:{},
				name:[],    //客户名称
				showEditor:false,  //编辑器
				currentIndex:null,   //当前编辑器
				id:'',
				old_id:'',
				contacts_id:'',
				contacts:[],
				contactIndex:null,
				data:{},
				//标签
				changeLabelIndex:null,  //修改的第几个
				rangeKey:'label',
				idKey:'value',
				selectParent:false,
				multiple:true,   //是否可以多选
				treeList:[]
			}
		},
		onLoad(options) {
			this.ids = options.ids
			
			//客户区域
			this.getInfo()
		},
		methods:{
			getForm() {
				netSetForm({type:'customer'}).then(res=>{
					res = res.data.data
					res.forEach(ele=>{
						if(ele.component == 'uploadFile' || ele.component == 'uploadImage'){
							ele.value = this.handleType(ele)
						}else if(ele.component == 'editor'){
							let text = this.info[ele.id]?this.info[ele.id].join():''
							ele.value_t = text
							text = text.replaceAll('<img','<img style="max-width:100%;height:auto"')
							ele.value = text
						}else if(ele.component == 'label'){
							let o_arr = this.info[ele.id]?this.info[ele.id]:[]
							let s_arr = []
							o_arr.forEach(oele=>{
								s_arr.push(...oele.split(','))
							})
							s_arr = this.noRepeat9(s_arr)
							console.log(s_arr,'====')
							let v_arr = ele.config.content
							let f_arr = []
							s_arr.forEach(sele=>{
								v_arr.forEach(vitem=>{
									vitem.children.forEach(cele=>{
										if(sele == cele.la_va){
											f_arr.push(cele)
											cele.checked = true
										}
									})
								})
							})
							ele.value_arr = s_arr.join(',')
							ele.value = f_arr
							ele.config.content = v_arr
							this.treeList = v_arr
						}else{
							ele.value = ele.value?ele.value:''
							ele.content = this.handleType(ele)
						}
						ele.valueIndex = null
						ele.arrType = this.handleArray(this.info[ele.id])
					})
					this.listForm = res
				})
			},
			//判断表单是否是上传图片或者上传文件
			handleType(ele){
				if(ele.component == 'uploadFile' || ele.component == 'uploadImage'){
					let arr = this.info[ele.id]
					let nArr = []
					arr.forEach(item=>{
						nArr.push(...item)
					})
					return nArr
				}else{
					return this.info[ele.id]
				}
			},
			//判断类型
			handleArray(arr){
				let flag = false   
				arr.forEach((ele)=>{
					if(typeof ele == 'object'){
						flag = true
						return
					}
				})
				return flag
			},
			//数组去重
			noRepeat9(arr){
				for (var i = 0; i < arr.length; i++) {
					for (var j = 0; j < arr.length; j++) {
						if (arr[i] == arr[j] && i != j) {//将后面重复的数删掉
							arr.splice(j, 1);
						}
					}
				}
				return arr;
			},
			getInfo(){
				netKehuMergeInfo({ids:this.ids}).then(res=>{
					res = res.data
					this.info = res
					this.contacts = res.contacts
					//获取表单
					this.getForm()
				})
			},
			changeValue(index,e){
				let obj = this.listForm[index]
				let arr = obj.content
				obj.value = arr[e.detail.value]
				obj.valueIndex = e.detail.value
				this.$set(this.listForm,obj,index)
				//获取id
				if(obj.id == 'name'){
					let customerArr = obj.content
					this.id = customerArr[e.detail.value].id
					customerArr.splice(e.detail.value,1)
					this.old_id = customerArr[0].id
				}
			},
			changeLink(e) {
				this.contactIndex = e.detail.value
			},
			//处理图片
			uploadImg(index,obj) {
				let formObj = this.listForm[index]
				formObj.value.push(obj)
				this.$set(this.listForm,formObj,index)
			},
			delImg(index,imgIndex) {
				let formObj = this.listForm[index]
				formObj.value.splice(imgIndex,1)
				this.$set(this.listForm,formObj,index)
			},
			//富文本编辑器
			openEditor(index) {
				this.currentIndex = index
			    this.showEditor = true
			},
			hideEditor() {
			    this.showEditor = false
			},
			uploadEditImg(img, callback) {
			    //上传图片逻辑,将图片链接传给回调函数
				uni.uploadFile({
					url: uploadUrl,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token')
					},
					filePath: img,
					success: (res) => {
						let data = JSON.parse(res.data)
						if (data.code == 1) {
							callback(data.data.url)
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			saveEditor(res) {
				let obj = this.listForm[this.currentIndex]
				obj.value = res.html.replace(/<img/g,'<img style="width:100%;height:auto"')
				obj.value_t = res.html
				this.$set(this.listForm,obj,this.currentIndex)
				this.hideEditor()
			},
			toSelectLabel(index) {
				this.changeLabelIndex = index
				this.$refs.tkitree._show()
			},
			selectTree(arr) {
				let a = []   //值
				arr.forEach(ele=>{
					a.push(ele.label)
				})
				let obj = this.listForm[this.changeLabelIndex]
				obj.value_arr = a.join(',')
				obj.value = arr
				this.$set(this.listForm,obj,this.changeLabelIndex)
			},
			//提交
			subSave() {
				if(!this.contacts[this.contactIndex]){
					uni.showToast({
						title:'请选择首要联系人',
						icon:'none'
					})
					return
				}
				if(!this.id){
					uni.showToast({
						title:'请选择客户名称',
						icon:'none'
					})
					return
				}
				let data = {}
				this.listForm.forEach(ele=>{
					if(!ele.value && ele.config.required){
						uni.showToast({
							title:ele.config.placeholder,
							icon:'none'
						})
						return
					}else{
						if(typeof ele.value == 'string'){
							data[ele.id] = ele.value
						}else if(ele.component == 'uploadFile' || ele.component == 'uploadImage'){
							let arr = []
							ele.value.forEach(item=>{
								arr.push(item.id)
							})
							data[ele.id] = arr.join(',')
						}else if(ele.component == 'label'){
							let a = []
							ele.value.forEach(vele=>{
								a.push(vele.la_va)
							})
							data[ele.id] = a.join(',')
						}else{
							data[ele.id] = ele.value.id
						}
					}
				})
				delete data.name
				let params = {
					id:this.id,
					old_id:this.old_id,
					contacts_id:this.contacts[this.contactIndex].id,
					data
				}
				console.log(params,'提交的数据')
				netKehuSubMerge(params).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					setTimeout(()=>{
						uni.setStorageSync('removeSeas',true) 
						uni.navigateBack({
							delta:2
						})
					},2000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fllow_form_edit{
		background-color: #fff;
		border-bottom: 1rpx solid #EAEAEA;
		padding:30rpx;
		.key{
			font-size:24rpx;
			color:#333;
		}
		.editcontent{
			width:100%;
			overflow: hidden;
			img{
				max-width:100%;
			}
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
			color:#666;
			flex-shrink: 0;
			margin-right:15rpx;
		}
		.form_right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #999;
			min-width:450rpx;
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
			.right_btn{
				font-size:24rpx;
				color:$uni-text-color;
			}
			.label_style{
				margin:0 8rpx;
				border-radius: 8rpx;
				padding:5rpx;
			}
		}
	}
	.fllow_area {
		background-color: #fff;
		padding:30rpx;
		border-bottom:1rpx solid #EDEDED;
		margin-bottom: 30rpx;
		.area_head {
			margin-bottom:24rpx;
		}
		textarea {
			width: 620rpx;
			height: 260rpx;
			margin:0 auto;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 10rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
	.popmask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 2;
	
		.popboxs {
			position: absolute;
			left: 0;
			bottom: 0;
			background: #fff;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			padding: 20rpx 24rpx;
			width: 750rpx;
	
			.popsearch {}
	
			.listwarp {
				width: 702rpx;
				height: 700rpx;
	
				.listscroll {
					width: 100%;
					height: 700rpx;
					background: #f5f5f5;
	
					.liwarp {
						width: 650rpx;
						padding: 20rpx 30rpx;
						margin: 20rpx auto;
						background: #fff;
						border-radius: 10rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
	
						.warpleft {
							flex: 1;
							display: flex;
							justify-content: flex-start;
							align-items: center;
	
							.headerimg {
								width: 50rpx;
								height: 50rpx;
								border-radius: 50%;
								margin-right: 15rpx;
							}
	
							.name {
								font-size: 24rpx;
								color: #333;
							}
	
							.number {
								font-size: 24rpx;
								color: #999;
								margin: 15rpx 0;
							}
	
							.guishu {
								font-size: 24rpx;
								color: #666;
							}
						}
					}
	
					.noData {
						font-size: 26rpx;
						color: #666;
						text-align: center;
						padding-top: 100rpx;
					}
				}
			}
	
			.btnlist {
				width: 750rpx;
				display: flex;
				justify-content: space-around;
				padding: 30rpx 0;
				.btn {
					width: 200rpx;
					height: 60rpx;
					border-radius: 30rpx;
					font-size: 24rpx;
					color: #fff;
					text-align: center;
				}
	
				.firbtn {
					background: $uni-btn-bg-color;
					line-height: 60rpx;
				}
	
				.secbtn {
					background: #fff;
					border:1rpx solid $uni-btn-bg-color;
					line-height: 58rpx;
					color:$uni-text-color;
				}
			}
		}
	}
</style>
