<template>
	
</template>

<script>
	export default{
		props:{
			list:{
				type:Array,
				default:[]
			},
			number:{
				type:Number,
				default:0
			}
		},
		data() {
			return{
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.stafflist{
		padding:0 0 0 30rpx;
		.staffli{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.staffimg{
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				margin-right:35rpx;
				flex-shrink: 0;
			}
			.staffinfo{
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex:1;
				padding-bottom:20rpx;
				padding-top:20rpx;
				border-bottom:1rpx solid #f5f5f5;
				.staff_name{
					font-size:34rpx;
					color:#333333;
				}
				.staff_post{
					font-size:30rpx;
					color:#999999;
				}
				.staffcall{
					width:44rpx;
					height:45rpx;
				}
			}
		}
	}
</style>
