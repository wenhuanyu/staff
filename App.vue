<script>
	
	export default {
		onLaunch: function() {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
			    // 请求完新版本信息的回调
			    if(res.hasUpdate){
				    updateManager.onUpdateReady(function (res) {
					    uni.showModal({
					        title: '更新提示',
						    content: '新版本已经准备好，是否重启应用？',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						})
				    })
			    }
			})
		},
		onShow: function() {
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "/static/font/iconfont.css";
	
	view{
		box-sizing: border-box;
		font-size:24rpx;
	}
	// 表单只展示必填字段
	.top_required{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size:28rpx;
		color:#666;
		padding:10rpx 0;
		background:#f5f5f5;
		switch{
			transform: scale(0.7);
		}
	}
	//下载
	.acbox{
		width:750rpx;
		padding:30rpx 0;
		.acli{
			font-size:30rpx;
			padding:24rpx 0;
			text-align: center;
			border-bottom:1rpx solid #f5f5f5;
			font-weight: bold;
			&:last-child{
				border-bottom:0;
			}
		}
	}
	//暂无数据
	.noData{
		font-size:24rpx;
		color:#999;
		text-align: center;
		margin:120rpx 0;
	}
	//tab栏
	.tablist_new{
		width:100%;
		padding:24rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom:1rpx solid #f5f5f5;
		.tabtn{
			width:150rpx;
			text-align: center;
			font-size:26rpx;
			color:#999;
			padding-bottom:20rpx;
			position: relative;
			&::after{
				content:'';
				position: absolute;
				left:0;
				bottom:0;
				width:100rpx;
				height:10rpx;
				background:#fff;
				border-radius: 10rpx;
			}
		}
		.tabtn_active{
			width:150rpx;
			text-align: center;
			font-size:26rpx;
			color:#333;
			padding-bottom:20rpx;
			position: relative;
			&::after{
				content:'';
				position: absolute;
				left:25rpx;
				bottom:0;
				width:100rpx;
				height:10rpx;
				background:$uni-btn-bg-color;
				border-radius: 10rpx;
			}
		}
	}
	//更多操作 标题
	.popuptitle{
		font-size:28rpx;
		color:#666;
		text-align: center;
		padding:25rpx 0 35rpx;
	}
	// 审核按钮
	.button_warp{
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding-bottom:30rpx;
		margin-top:30rpx;
		.btn{
			width:220rpx;
			height:70rpx;
			border-radius: 10rpx;
			font-size:24rpx;
			text-align: center;
		}
		.tongyi{
			background:$uni-btn-bg-color;
			line-height: 70rpx;
			color:#fff;
		}
		.jujue{
			background: #FFFFFF;
			border: 1px solid #999999;
			color:#999;
			line-height: 68rpx;
		}
	}
	//更多操作
	.newbot{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		text-align: center;
		color: #999;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
		border-top:1rpx solid #f5f5f5;
		font-size:26rpx;
		color:$uni-text-color;
		height:calc(90rpx + env(safe-area-inset-bottom));
		width:750rpx;
		padding-bottom:env(safe-area-inset-bottom);
		border-top:1rpx solid #f5f5f5;
		.moreimg{
			width:28rpx;
			height:28rpx;
			margin-right:15rpx;
		}
	}
	//更多操作  多个
	.bot_more_operation{
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		border-top:1rpx solid #f5f5f5;
		height:calc(90rpx + env(safe-area-inset-bottom));
		width:750rpx;
		padding-bottom:env(safe-area-inset-bottom);
		.bot_more_li{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.li_img{
				width:28rpx;
				height:28rpx;
				margin-bottom:15rpx;
			}
			.li_img_img{
				width:28rpx;
				height:38rpx;
				margin-bottom:5rpx;
			}
			.li_text{
				color: #999;
				font-size:26rpx;
			}
		}
	}
	.key{
		color:#666666;
		span{
			color:#FD6B6B;
		}
	}
	.care{
		display: flex;
		justify-content: center;
		align-items: center;
		width:750rpx;
		height:40rpx;
		font-size:22rpx;
		color:#333333;
		background:#EDEDED;
		span{
			color:#FD6B6B;
		}
	}
	.color_bg{
		color:$uni-text-color !important;
	}
	.button{
		width: 590rpx;
		height: 80rpx;
		background: $uni-text-color;
		border: 1px solid $uni-text-color;
		border-radius: 40rpx;
		font-size: 26rpx;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		margin:50rpx auto  env(safe-area-inset-bottom);
	}
	.botsec{
		width:100%;
		height:env(safe-area-inset-bottom);
	}
	.small_button{
		width:370rpx;
		height:80rpx;
		border-radius: 10rpx;
		background:$uni-text-color;
		color:#fff;
		font-size:26rpx;
		text-align: center;
		line-height: 80rpx;
		margin:0 auto;
	}
	.space_button{
		margin: 20rpx auto;
		width: 200rpx;
		height: 60rpx;
		background: #FFFFFF;
		border: 1px solid $uni-text-color;
		border-radius: 10rpx;
		font-size: 26rpx;
		color: $uni-text-color;
		text-align: center;
		line-height: 60rpx;
	}
	.valueActive{
		color:#333 !important;
		font-size:24rpx;
	}
</style>
