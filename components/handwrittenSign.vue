<template>
	<view>
		<uni-popup ref="popup" type="center" background-color="#fff" @touchmove.stop.prevent="moveHandle">
			<view class="signbox" @touchmove.stop.prevent="moveHandle">
				<canvas disable-scroll class="mycanvas" canvas-id="mycanvas" @touchstart="touchstart" @touchmove="touchmove"
					@touchend="touchend"></canvas>
				<view class="footer">
					<view class="right" @click="closePop">取消</view>
					<view class="right" @click="clear">清空</view>
					<view class="left" @click="$noMultipleClicks(finish)">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { BASE_URL, SIGN_NO } from '@/api/http.js'
	import { uploadUrl } from '@/api/api.js'
	var x = 20;
	var y = 20;
	
	export default {
		props: {
			showSign: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				noClick:true,    //防止  重复点击
				ctx: '', //绘图图像
				ctxWidth:0,
				ctxHeight:0,  //宽度 高度
				points: [], //路径点集合 
				isEnd: false, // 是否结束签名
			}
		},
		created() {
			this.ctx = uni.createCanvasContext("mycanvas", this); //创建绘图对象
			uni.getSystemInfo({
				success:(res)=>{
					console.log(res,'设备信息')
					this.ctxWidth = res.windowWidth
					this.ctxHeight = res.windowHeight - (150/res.devicePixelRatio)
				}
			})
		},
		methods: {
			open() {
				this.$refs.popup.open()
				this.ctx.setFillStyle('#fff')
				this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
				//设置画笔样式
				this.ctx.lineWidth = 4;
				this.ctx.lineCap = "round"
				this.ctx.lineJoin = "round"
			},
			moveHandle() {},
			closePop() {
				this.clear()
				this.$refs.popup.close()
			},
			//触摸开始，获取到起点
			touchstart(e) {
				let startX = e.changedTouches[0].x;
				let startY = e.changedTouches[0].y;
				let startPoint = {
					X: startX,
					Y: startY
				};
				this.points.push(startPoint);
				//每次触摸开始，开启新的路径
				this.ctx.beginPath();
			},

			//触摸移动，获取到路径点
			touchmove(e) {
				let moveX = e.changedTouches[0].x;
				let moveY = e.changedTouches[0].y;
				let movePoint = {
					X: moveX,
					Y: moveY
				};
				this.points.push(movePoint); //存点
				let len = this.points.length;
				if (len >= 2) {
					this.draw(); //绘制路径
				}

			},

			// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
			touchend() {
				this.points = [];
				this.isEnd = true
			},

			/* ***********************************************
			#   绘制笔迹
			#	1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#	2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#	3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
			draw() {
				let point1 = this.points[0]
				let point2 = this.points[1]
				this.points.shift()
				this.ctx.moveTo(point1.X, point1.Y)
				this.ctx.lineTo(point2.X, point2.Y)
				this.ctx.stroke()
				this.ctx.draw(true)
			},

			//清空画布
			clear() {
				let that = this;
				uni.getSystemInfo({
					success: function(res) {
						let canvasw = res.windowWidth;
						let canvash = res.windowHeight;
						that.ctx.clearRect(0, 0, canvasw, canvash);
						that.ctx.draw(true);
					},
				})
			},

			//完成绘画并保存到本地
			finish() {
				this.$refs.popup.close()
				console.log('字体')
				if (!this.isEnd) {
					uni.showToast({
						title: '请先完成签名',
						icon: "none",
						mask: true
					})
					return
				}
				uni.canvasToTempFilePath({
					canvasId: 'mycanvas',
					width: this.ctxWidth,
					height: this.ctxHeight,
					destWidth: 375,
					destHeight: 425,
					success: (res) => {
						//上传图片
						this.toUpload(res.tempFilePath)
					},
					fail:(err)=>{
						console.log(err,'错误')
					}
				},this)
			},
			toUpload(file) {
				uni.uploadFile({
					url: uploadUrl,
					name: 'file',
					header: {
						'token': uni.getStorageSync('token'),
						'sign-no': SIGN_NO
					},
					filePath: file,
					success: (res) => {
						let data = JSON.parse(res.data)
						if (data.code == 1) {
							console.log(data.data)
							this.$emit('signDone',data.data)
							this.clear()
						} else {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
		},
	}
</script>

<style>
	.signbox {
		width: 750rpx;
		height:100vh;
	}

	.mycanvas {
		width: 750rpx;
		height:calc(100vh - 150rpx);
		background-color: #EDEDED;
	}

	.footer {
		font-size: 16px;
		height: 150rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top:2rpx solid #f5f5f5;
	}

	.right {
		line-height: 80upx;
		height: 80upx;
		width: 180upx;
		text-align: center;
		font-weight: bold;
		color: #fff;
		border-radius: 5upx;
		background:#ff7800;
	}
	.right {
		background: #FFFFFF;
		border: 1px solid #999999;
		color:#999;
	}
	.left {
		line-height: 80upx;
		height: 80upx;
		width: 180upx;
		text-align: center;
		font-weight: bold;
		color: #fff;
		border-radius: 5upx;
		background: #008EFF;
	}
</style>
