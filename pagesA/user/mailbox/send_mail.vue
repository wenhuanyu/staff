<template>
	<view>
		<view class="item_warp">
			<view class="item_right">
				<view class="label key">收件人：</view>
				<textarea v-model="receiver" placeholder="收件人" auto-height class="selftext"></textarea>
			</view>
			<image :src="BASE_IMG_URL+'/index/add.png'" @click="toSelectSend(1)" class="addimg" ></image>
		</view>
		<view class="item_warp">
			<view class="item_right">
				<view class="label key">抄送：</view>
				<textarea v-model="copyor" placeholder="抄送人" auto-height class="selftext"></textarea>
			</view>
			<image :src="BASE_IMG_URL+'/index/add.png'" @click="toSelectSend(2)" class="addimg" ></image>
		</view>
		<view class="item_warp">
			<view class="item_right">
				<view class="label key">主题：</view>
				<input type="text" v-model="theme" placeholder="主题" class="selfinput">
			</view>
		</view>
		<view class="item_warp">
			<view class="label">附件</view>
			<image :src="BASE_IMG_URL+'/index/file-clip.png'" @click="uploadClick" class="fujianimg" ></image>
		</view>
		<view class="imglist" v-if="imgList.length != 0">
			<view class="imgbox" v-for="(item,index) in imgList" :key="index">
				<image :src="BASE_IMG_URL+'/index/close.png'" class="delimg" @click="delImg(index)" ></image>
				<image :src="item.url" v-if="type == 1" class="selfimg" ></image>
				<image :src="item" v-if="type == 2" class="selfimg" ></image>
			</view>
		</view>
		<view class="fllow_file_li" v-if="fileList.length != 0">
			<view class="fil_li" v-for="(item,index) in fileList" :key="index">
				<image :src="BASE_IMG_URL+'/index/fujian.png'" class="fileimg" ></image>
				<view class="filename">{{item.name}}</view>
				<image :src="BASE_IMG_URL+'/index/delete_bg.png'" class="closeimg" @click="delFile(index)" ></image>
			</view>
		</view>
		
		<view class="richbox">
			<view class="toolbar" @touchend.stop="format">
				<i class="iconfont icon-charutupian" @touchend.stop="insertImage"></i>
				<i :class="'iconfont icon-format-header-1 ' + (formats.header === 1 ? 'ql-active' : '')" data-name="header"
				 :data-value="1"></i>
				<i :class="'iconfont icon-format-header-2 ' + (formats.header === 2 ? 'ql-active' : '')" data-name="header"
				 :data-value="2"></i>
				<i :class="'iconfont icon-format-header-3 ' + (formats.header === 3 ? 'ql-active' : '')" data-name="header"
				 :data-value="3"></i>
				<i :class="'iconfont icon-format-header-4 ' + (formats.header === 4 ? 'ql-active' : '')" data-name="header"
				 :data-value="4"></i>
				<i :class="'iconfont icon-format-header-5 ' + (formats.header === 5 ? 'ql-active' : '')" data-name="header"
				 :data-value="5"></i>
				<i :class="'iconfont icon-format-header-6 ' + (formats.header === 6 ? 'ql-active' : '')" data-name="header"
				 :data-value="6"></i>
				<i :class="'iconfont icon-zitijiacu ' + (formats.bold ? 'ql-active' : '')" data-name="bold"></i>
				<i :class="'iconfont icon-zitishanchuxian ' + (formats.strike ? 'ql-active' : '')" data-name="strike"></i>
				<i :class="'iconfont icon-zitixieti ' + (formats.italic ? 'ql-active' : '')" data-name="italic"></i>
				<i :class="'iconfont icon-zuoduiqi ' + (formats.align === 'left' ? 'ql-active' : '')" data-name="align" data-value="left"></i>
				<i :class="'iconfont icon-juzhongduiqi ' + (formats.align === 'center' ? 'ql-active' : '')" data-name="align"
				 data-value="center"></i>
				<i :class="'iconfont icon-youduiqi ' + (formats.align === 'right' ? 'ql-active' : '')" data-name="align" data-value="right"></i>
				<i :class="'iconfont icon-zuoyouduiqi ' + (formats.align === 'justify' ? 'ql-active' : '')" data-name="align"
				 data-value="justify"></i>
				<i :class="'iconfont icon-line-height ' + (formats.lineHeight ? 'ql-active' : '')" data-name="lineHeight" data-value="2"></i>
				<i :class="'iconfont icon-Character-Spacing ' + (formats.letterSpacing ? 'ql-active' : '')" data-name="letterSpacing"
				 data-value="2em"></i>
				<i :class="'iconfont icon-722bianjiqi_duanqianju ' + (formats.marginTop ? 'ql-active' : '')" data-name="marginTop"
				 data-value="20px"></i>
				<i class="iconfont icon-clearedformat" @tap="removeFormat"></i>
				<i :class="'iconfont icon-font ' + (formats.fontFamily ? 'ql-active' : '')" data-name="fontFamily" data-value="Pacifico"></i>
				<i :class="'iconfont icon-fontsize ' + (formats.fontSize === '24px' ? 'ql-active' : '')" data-name="fontSize"
				 data-value="24px"></i>
				<i class="iconfont icon-date" @tap="insertDate"></i>
				<i class="iconfont icon-undo" @tap="undo"></i>
				<i class="iconfont icon-redo" @tap="redo"></i>
				<i :class="'iconfont icon-zitixiahuaxian ' + (formats.underline ? 'ql-active' : '')" data-name="underline"></i>
				<i class="iconfont icon--checklist" data-name="list" data-value="check"></i>
				<i :class="'iconfont icon-youxupailie ' + (formats.list === 'ordered' ? 'ql-active' : '')" data-name="list"
				 data-value="ordered"></i>
				<i :class="'iconfont icon-wuxupailie ' + (formats.list === 'bullet' ? 'ql-active' : '')" data-name="list" data-value="bullet"></i>
				<i class="iconfont icon-outdent" data-name="indent" data-value="-1"></i>
				<i class="iconfont icon-indent" data-name="indent" data-value="+1"></i>
				<i class="iconfont icon-fengexian" @tap="insertDivider"></i>
				<i :class="'iconfont icon-zitixiabiao ' + (formats.script === 'sub' ? 'ql-active' : '')" data-name="script"
				 data-value="sub"></i>
				<i :class="'iconfont icon-zitishangbiao ' + (formats.script === 'super' ? 'ql-active' : '')" data-name="script"
				 data-value="super"></i>
				<i class="iconfont icon-shanchu" @tap="clear"></i>
				<i :class="'iconfont icon-direction-rtl ' + (formats.direction === 'rtl' ? 'ql-active' : '')" data-name="direction"
				 data-value="rtl"></i>
			</view>
			<editor 
				id="editor"  
				class="ql-container" 
				show-img-size 
				show-img-resize 
				show-img-toolbar 
				:placeholder="placeholder"
				@ready="onEditorReady"
				@statuschange="onStatusChange"
			></editor>
		</view>
		
		<view class="button" @click="$noMultipleClicks(sureSend)">提交</view>
		
		<uni-popup ref="Filepopup" type="bottom" background-color="#fff">
			<view class="popuptitle">上传附件</view>
			<view class="ope_warp">
				<view class="ope_li">
					<image :src="BASE_IMG_URL+'/index/emailthr.png'" @click="uploadType(1)" class="opeimg" ></image>
					<view class="litext">拍照</view>
				</view>
				<view class="ope_li">
					<image :src="BASE_IMG_URL+'/index/emailtwo.png'" @click="uploadType(2)" class="opeimg" ></image>
					<view class="litext">从相册中选择</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="ope_li">
					<image :src="BASE_IMG_URL+'/index/emailone.png'" @click="uploadType(3)" class="opeimg" ></image>
					<view class="litext">选择本地文件</view>
				</view>
				<!-- #endif -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_URL, SIGN_NO, BASE_IMG_URL } from '@/api/http.js'
	import { mapState } from 'vuex'
	import { netSendEmail, netEmailDetail } from '@/api/user.js'
	import { uploadUrl } from '@/api/api.js'
	
	export default{
		data(){
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				noClick:true,    //防止  重复点击
				imgList:[],
				fileList:[],
				uploadShow: false,
				uploadActions: [
					{id:1,name:'拍照',color:'#008EFF'},
					{id:2,name:'从相册中选择',color:'#008EFF'},
					{id:3,name:'选择本地文件',color:'#008EFF'}
				],
				placeholder: '开始输入...',
				formats:{},
				editorCtx:'',
				theme:'',
				receiver:'',   //收件账号多个用 , 隔开
				receiverList:[],
				content:'',   //邮件内容
				copyor:'',   //抄送者，多个账号用,隔开
				copyorList:[],
				id:'',   //需要转发的 邮件id
				type:1,   //1发送    2转发
			}
		},
		computed:mapState({
			sendEmailList: state => state.customer.sendEmailList,
			ccList: state => state.customer.ccList
		}),
		onLoad(options) {
			if(options.num){
				this.receiver = options.num
			}
			if(options.type) {
				this.type = options.type
				this.id = options.id
			}
		},
		onShow() {
			//处理 收件账号 重复账号
			this.handleSendAccount()
			//处理  抄送人  重复账号
			this.handleCopyAccount()
		},
		methods:{
			//获取  需要转发的邮件内容
			getEmailDetail() {
				netEmailDetail({id:this.id}).then(res=>{
					this.editorCtx.setContents({
						html:res.data.content
					})
					this.fileList = res.data.attach
					this.imgList = res.data.imgs
				})
			},
			handleSendAccount() {
				let arr  = this.deWeight(this.receiverList.concat(this.sendEmailList))
				this.receiverList = arr
				let newArr = []
				arr.forEach(ele=>{
					newArr.push(ele.email)
				})
				let reArr = this.receiver ? this.receiver.split(',') : []
				this.receiver = this.deRemove(reArr.concat(newArr)).join(',')
				// this.receiver = newArr.join(',')
			},
			handleCopyAccount() {
				let arr  = this.deWeight(this.copyorList.concat(this.ccList))
				this.receiverList = arr
				let newArr = []
				arr.forEach(ele=>{
					newArr.push(ele.email)
				})
				this.copyor = newArr.join(',')
			},
			deWeight(arr) {
			    for (var i = 0; i < arr.length - 1; i++) {
			        for (var j = i + 1; j < arr.length; j++) {
			            if (arr[i].email == arr[j].email) {
			                arr.splice(j, 1);
			                j--;
			            }
			        }
			    }
			    return arr;
			},
			deRemove(arr) {
				for (var i = 0; i < arr.length - 1; i++) {
				    for (var j = i + 1; j < arr.length; j++) {
				        if (arr[i] == arr[j]) {
				            arr.splice(j, 1);
				            j--;
				        }
				    }
				}
				return arr;
			},
			onEditorReady(e) {
				console.log('初始化',e)
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					if(this.type == 2) {
						//获取  需要转发的邮件内容
						this.getEmailDetail()
					}
				}).exec()
			},
			onStatusChange(e) {
				this.formats = e.detail;
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset;
				if (!name) return; 
				this.editorCtx.format(name, value);
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					sizeType:['compressed'],
					success: (res) => {
						var tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '正在上传中...'
						})
						for (let temp of tempFilePaths) {
							// 图片上传服务器
							uni.uploadFile({
								url: uploadUrl,
								filePath: temp,
								name: 'file',
								header: {
									'token': uni.getStorageSync('token'),
									'sign-no': SIGN_NO
								},
								success: res => {
									res = JSON.parse(res.data)
									// 上传完成后处理
									this.editorCtx.insertImage({
										src: res.data.url,  // 此处需要将图片地址切换成服务器返回的真实图片地址
										alt: '图片',
										success: function(e) {}
									});
									uni.hideLoading()
								},
								
							})
						}
					}
				});
			},
			insertDate() {
				const date = new Date();
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
				this.editorCtx.insertText({
					text: formatDate
				});
			},
			removeFormat() {
				this.editorCtx.removeFormat();
			},
			undo() {
				this.editorCtx.undo();
			},
			redo() {
				this.editorCtx.redo();
			},
			blur() {
				this.editorCtx.blur();
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success");
					}
				});
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success');
					}
				});
			},
			//选择 收件人
			toSelectSend(type) {
				uni.navigateTo({
					url:'/pages/template/selectEmail?type='+type
				})
			},
			// 上传附件
			uploadClick() {
				this.$refs.Filepopup.open()
			},
			uploadType(type) {
				this.$refs.Filepopup.close()
				if(type == 1) {
					//拍照
					uni.chooseImage({
						count:1,
						sourceType:['camera'],
						sizeType:['compressed'],
						success:(res)=>{
							let file = res.tempFilePaths[0]
							this.uploadFile(file,1)
						}
					})
				}else if(type == 2){
					//相册 选择
					uni.chooseImage({
						count:1,
						sourceType:['album'],
						sizeType:['compressed'],
						success:(res)=>{
							let file = res.tempFilePaths[0]
							this.uploadFile(file,1)
						}
					})
				}else{
					//选择文件
					wx.chooseMessageFile({
						count:1,
						type:'file',
						success:(res)=>{
							let file = res.tempFiles[0]
							this.uploadFile(file,2)
						},
						fail:(err)=>{
							console.log(err)
						}
					})
				}
			},
			//type  上传图片1  或  文件2
			uploadFile(file,type) {
				uni.uploadFile({
					url:uploadUrl,
					name:'file',
					header:{
						'token':uni.getStorageSync('token'),
						'sign-no':SIGN_NO
					},
					filePath: type == 1 ? file : file.path,
					success:(res)=>{
						let data = JSON.parse(res.data)
						this.uploadShow = false
						if(data.code == 1) {
							if(type == 1) {
								this.imgList.push(data.data)
							}else{
								file = Object.assign({},file,data.data)
								this.fileList.push(file)
							}
						}else{
							uni.showToast({
								title:'上传失败',
								icon:'none'
							})
						}
					},
					fail:(err)=>{
						console.log(err)
					}
				})
			},
			//删除 图片
			delImg(index) {
				this.imgList.splice(index,1)
			},
			//删除  文件
			delFile(index) {
				this.fileList.splice(index,1)
			},
			sureSend() {
				this.editorCtx.getContents({
					success:(res)=>{
						let content = res.html
						if(!this.receiver){
							uni.showToast({
								title:'请选择收件人',
								icon:'none'
							})
							return
						}
						if(!this.theme){
							uni.showToast({
								title:'请填写主题',
								icon:'none'
							})
							return
						}
						let arr = this.imgList.concat(this.fileList)
						let newArr = []
						arr.forEach(ele=>{
							newArr.push(ele.id)
						})
						let params = {
							theme:this.theme,
							receiver:this.receiver,
							content,
							copyor:this.copyor,
							ids:newArr.join(',')
						}
						netSendEmail(params).then(res=>{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
							if(res.code == 1){
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},2000)
							}
							
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./editor/editor.css";
	.ope_warp{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding:30rpx 0;
		.ope_li{
			width:33.33%;
			margin-bottom:24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.opeimg{
				width:42rpx;
				height:42rpx;
				margin-bottom:10rpx;
			}
			.litext{
				font-size:26rpx;
				color:#999999;
				text-align: center;
			}
		}
	}
	.item_warp{
		padding:30rpx 45rpx;
		border-bottom:1rpx solid #f5f5f5;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.item_right{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.label{
				font-size:28rpx;
			}
			.selftext{
				width:400rpx;
				
			}
			.selfinput{
				width:400rpx;
				font-size:28rpx;
			}
		}
		.addimg{
			width:48rpx;
			height:48rpx;
		}
		.fujianimg{
			width:48rpx;
			height:48rpx;
		}
	}
	.imglist{
		padding:24rpx 34rpx;
		background:#fff;
		border-bottom:1rpx solid #EAEAEA;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.imgbox{
			width:160rpx;
			height:160rpx;
			margin-right:14rpx;
			position: relative;
			margin-bottom:24rpx;
			border:1rpx solid #EAEAEA;
			.delimg{
				width:32rpx;
				height:32rpx;
				border-radius:50%;
				position: absolute;
				right:-16rpx;
				top:-16rpx;
				background:rgba(0,0,0,0.5);
				z-index: 2;
			}
			.selfimg{
				width:160rpx;
				height:160rpx;
			}
		}
	}
	.fllow_file_li{
		padding:24rpx 34rpx;
		background:#fff;
		border-bottom:1rpx solid #EAEAEA;
		.fil_li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:24rpx 0;
			border-bottom:1rpx solid #f5f5f5;
			.fileimg{
				width:40rpx;
				height:40rpx;
			}
			.filename{
				font-size:24rpx;
				color:#999999;
			}
			.closeimg{
				width:32rpx;
				height:32rpx;
			}
		}
	}
	.richbox{
		width:720rpx;
		margin:24rpx auto;
		border:1rpx solid #f5f5f5;
		.ql-container{
			width:100%;
			height:700rpx;
		}
	}
</style>
