<template>
	<view>
		<view class="map_select" @click="toQuery">
			<view class="sele_time">{{queryObj.startTime}}至{{queryObj.endTime}}</view>
			<image :src="BASE_IMG_URL+'/index/green-shaixuan.png'" class="selectimg" ></image>
		</view>
		<view class="box">
			<map 
				name="map" 
				id="mapid" 
				:latitude="latitude" 
				:longitude="longitude" 
				scale="5" 
				class="mapbox" 
				show-compass 
				:polyline="polyline"
			></map>
		</view>
		
	</view>
</template>

<script>
	import { netStaffTraill } from '@/api/user.js'
	import { BASE_IMG_URL } from '@/api/http.js'
	
	export default{
		components:{
		},
		data() {
			return{
				BASE_IMG_URL:BASE_IMG_URL,
				latitude:39.96491,
				longitude:116.31604,
				polyline:[],
				staffid:'',
				showScreen:false,
				dottedLine:true,
				queryObj:{},
			}
		},
		methods:{
			toQuery() {
				this.$emit('queryThr')
			},
			init(id) {
				this.staffid = id
				let date = new Date()
				let year = date.getFullYear()
				let month = this.withData(date.getMonth() + 1)
				this.queryObj = {
					startTime: year+'-'+month,
					endTime: year+'-'+month,
					times:year+'-'+month+','+year+'-'+month
				}
				this.getData()
			},
			withData(param) {
			  return param < 10 ? '0' + param : '' + param;
			},
			getData() {
				let params = {
					id:this.staffid,
					times: this.queryObj.times
				}
				netStaffTraill(params).then(res=>{
					let data = res.data
					let arr = []
					data.forEach(ele=>{
						arr.push({
							latitude: Number(ele.lat),
							longitude: Number(ele.lng)
						})
					})
					if(arr.length == 1){
						arr.push(arr[0])
						this.polyline = [
							{
								points:arr,
								color:'#ff7800',
								width: 4,
								arrowLine: true
							}
						]
					}else{
						this.polyline = [
							{
								points:arr,
								color:'#ff7800',
								width: 4,
								arrowLine: true
							}
						]
					}
				})
			},
			sureQuery(params) {
				this.queryObj = params
				this.getData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.map_select{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding:24rpx;
		.sele_time{
			font-size:30rpx;
			color:#999999;
		}
		.selectimg{
			width:35rpx;
			height:27rpx;
			margin-left:15rpx;
		}
	}
	.box{
		width:690rpx;
		height:700rpx;
		margin:24rpx auto;
		.mapbox{
			width:690rpx;
			height:700rpx;
		}
	}
	
</style>
