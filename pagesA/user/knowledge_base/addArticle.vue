<template>
	<view>
		<view class="form_warp">
			<view class="label key">文章标题</view>
			<input type="text" v-model="title" placeholder="文章标题" class="selfinput">
		</view>
		<view class="form_desc">
			<view class="label key">文章简介</view>
			<textarea name="" v-model="desc" id="" placeholder="文章简介" class="selfText" :class="{valueActive:desc}"></textarea>
		</view>
		<view class="form_warp">
			<view class="label key">文章缩略图</view>
			<view @click="toUpload">上传图片</view>
		</view>
		<view class="imgbox" v-if="imgurl">
			<image :src="imgurl" @click="toPreveImg" class="imgself" ></image>
		</view>
		
		<view class="form_warp">
			<view class="label key">文章内容</view>
		</view>
		<view class="richbox">
			<view class="toolbar" @touchend.stop="format" :style="'bottom: ' + (isIOS ? keyboardHeight : 0) + 'px'">
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
				<i :class="'iconfont icon-723bianjiqi_duanhouju ' + (formats.micon-previewarginBottom ? 'ql-active' : '')" data-name="marginBottom"
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
				:read-only="isEdit"
				:placeholder="placeholder"
				@ready="onEditorReady"
				@statuschange="onStatusChange"
			></editor>
		</view>
		
		<view class="button"  @click="$noMultipleClicks(sureAdd)">提交</view>
	</view>
</template>

<script>
	import { BASE_URL, SIGN_NO } from '@/api/http.js'
	import { netAddArticle, netArticleDetail, netEditArticle, uploadUrl } from '@/api/api.js'
	
	export default{
		data() {
			return{
				noClick:true,    //防止  重复点击
				placeholder: '开始输入...',
				formats:{},
				editorCtx:'',
				title:'',
				content:'',
				img:'',
				imgurl:'',
				desc:'',   //文章简介
				tid:'',
				pid:''
			}
		},
		onLoad(options) {
			this.tid = options.tid
			this.pid = options.pid
			if(options.sid){
				this.sid = options.sid
				uni.setNavigationBarTitle({
					title:'编辑文章'
				})
			}
		},
		methods:{
			onEditorReady(e) {
				console.log(e,'初始化')
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					if(this.sid){
						this.getDetail()
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
			getDetail() {
				netArticleDetail({id:this.sid}).then(res=>{
					res = res.data
					this.title = res.title
					this.desc = res.desc
					this.imgurl = res.img
					this.editorCtx.setContents({
						html:res.content
					})
				})
			},
			//上传 图片
			toUpload() {
				uni.chooseImage({
					count:1,
					sizeType:['compressed'],
					success:(res)=>{
						let url = res.tempFilePaths[0]
						this.uploadImg(url)
					}
				})
			},
			uploadImg(url) {
				uni.uploadFile({
					url: uploadUrl,
					filePath: url,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token'),
						'sign-no': SIGN_NO
					},
					success: res => {
						res = JSON.parse(res.data)
						console.log(res)
						this.img = res.data.id
						this.imgurl = res.data.url
					}
				})
			},
			
			//查看图片
			toPreveImg() {
				uni.previewImage({
					urls: [ this.imgurl ]
				})
			},
			//提交
			sureAdd() {
				this.editorCtx.getContents({
					success:(res)=>{
						let content = res.html
						if(!this.title){
							uni.showToast({
								title:'请填写标题',
								icon:'none'
							})
							return
						}
						if(!this.desc){
							uni.showToast({
								title:'请输入文章简介',
								icon:'none'
							})
							return
						}
						if(!this.imgurl){
							uni.showToast({
								title:'请上传图片',
								icon:'none'
							})
							return
						}
						if(!content){
							uni.showToast({
								title:'请填写内容',
								icon:'none'
							})
							return
						}
						let params = {}
						if(this.sid){
							params = {
								title: this.title,
								type_ids: this.tid,
								product_ids: this.pid,
								content,
								desc:this.desc,
								img: this.img,
								id:this.sid
							}
							netEditArticle(params).then(res=>{
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
						}else{
							params = {
								title: this.title,
								type_ids: this.tid,
								product_ids: this.pid,
								content,
								desc:this.desc,
								img: this.img
							}
							netAddArticle(params).then(res=>{
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
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/pagesA/user/mailbox/editor/editor.css";
	.form_warp{
		padding:30rpx 45rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.label{
			font-size:30rpx;
		}
		.selfinput{
			width:400rpx;
			text-align: right;
		}
	}
	.form_desc{
		padding:30rpx 45rpx;
		border-bottom:1rpx solid #f5f5f5;
		.selfText{
			width: 620rpx;
			height: 260rpx;
			margin:24rpx auto 0;
			background:rgba(202, 202, 202, 0.2);
			font-size:26rpx;
			color:#999999;
			border-radius: 50rpx;
			padding:24rpx;
			box-sizing: border-box;
		}
	}
	.richbox{
		width:690rpx;
		margin:24rpx auto;
		border:1rpx solid #f5f5f5;
		.toolbar{
			height:300rpx;
		}
		.ql-container{
			width:100%;
			height:700rpx;
		}
	}
	.imgbox{
		width:150rpx;
		height:150rpx;
		margin:24rpx 35rpx;
		.imgself{
			width:150rpx;
			height:150rpx;
		}
	}
</style>
