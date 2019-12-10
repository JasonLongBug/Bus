<template>
	<view class="container">
		<view class="bus-head">
			<view>{{line.startSn}}→{{line.endSn}}</view>
			<view class='time'>首 {{line.firstTime}} 末 {{line.lastTime}}</view>
		</view>
		<view class='next-time'>
			<scroll-view scroll-x="true" class="time-block scroll-view_H">
				<block v-for="(item,index) in buseTimes" :key="index">
					<view class='list' v-if="item.travels.length>0">
						<view class='time'>
							<image src="../../static/image/icon-wifi.png"></image>
							<view class='number'>{{getMinute(item.travels[0].travelTime)}}</view>
							<view class='minute'>分</view>
						</view>
						<view class='distance'>{{item.travels[0].order-item.order}}站 / 1.2km</view>
					</view>
				</block>
			</scroll-view>
			<view class='next-bottom'>
				<view class='left'>同站线路</view>
				<view class='right'>时刻表</view>
			</view>
		</view>
		<view class='plate-block'>
			<!-- 第一个站牌前的一段 -->
			<view class='plate-list-first'>
			</view>
			<block v-for="(item,index) in roads" :key="index">
				<view class='plate-list'>
					<view v-for="(plate,j) in item" :key="j" class="color" v-bind:class="'color-'+plate.TVL" v-bind:style="{width:plate.TPC*100+'%'}"></view>
					<block v-for="(bus, i) in buses" :key="i">
						<!-- {{bus.order}} -->
						<image v-if="bus.order==index+1" class='car' :class="bus.state==1?'car-arrive':''" src='../../static/image/icon-car.png'></image>
					</block>
				</view>
			</block>
			<!-- 最后一个站牌后的一段 -->
			<view class='plate-list-last'>
			</view>
			<view class='plate-name-block'>
				<!-- class 加入selected,选中效果 -->
				<view v-for="(item,index) in stations" :key="index" class='plate-name' :class="[targetOrder==index+1?'selected':'']"
				 :data-name='item.sn' :data-index="index+1" @tap='btnStations_Click'>
					<image src='../../static/image/icon-jiantou.png'></image>
					<view class='number'>{{index+1}}
					</view>
					<view class='name'>{{item.sn}}</view>
				</view>
			</view>
		</view>
		<view class='bus-bottom'>
			<view class="bottom-btn" @tap='btnExchange_Click'>
				<image src='../../static/image/icon-exchange.png'></image>
				<view>换向</view>
			</view>
			<view class="bottom-btn" @tap='btnRefresh_Click'>
				<image src='../../static/image/icon-refresh.png'></image>
				<view>刷新</view>
			</view>
			<view v-if='collectionInfo.length>0' class="bottom-btn" :data-id='collectionInfo[0]._id' @tap='btnCancel_Click'>
				<image src='../../static/image/icon-keeped.png'></image>
				<view>已收藏</view>
			</view>
			<view v-else class="bottom-btn" @tap='btnCollection_Click'>
				<image src='../../static/image/icon-keep.png'></image>
				<view>收藏</view>
			</view>
			<view class='masklayer' :class="showCollection==true?'show':''"></view>
			<view class='collection' :class="showCollection==true?'show':''">
				<view class='head'>
					<text class='btn' @tap='btnClose_Click'>关闭</text>
					<text class='title'>请选择收藏标签</text>
				</view>
				<view class='list'>
					<view class='btn' @tap='btnTab_Click' v-for="item in tabItem" :key="item._id" :data-id='item._id'>{{item.TypeName}}</view>
					<view class='btn'>➕添加</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lineID: "", // 路线编号
				line: {}, // 路线基本信息
				stations: {}, // 站点列表
				roads: [], // 路况列表
				buseTimes: [], // 到达时间
				buses: [], // 实时公交车
				targetOrder: 0, // 等待站点ID
				stationName: "", // 等待站点名称
				otherlines: [{
					lineId: ""
				}], // 换向线路
				collectionInfo: [], // 收藏站点
				tabItem: [], //标签类型
				showCollection: false, //显示收藏层
			}
		},
		onLoad(options) {
			this.lineID = options.lid;
			this.QueryBus();
		},
		methods: {
			// 查询公交
			QueryBus: function() {
				//console.log("fuck")
				var that = this;
				uni.request({
					url: that.$BusServerUrl + "favproxy",
					method: 'GET',
					data: {
						returnFavs: 1,
						action: "/bus/line!lineDetail.action",
						lineId: that.lineID,
						targetOrder: that.targetOrder,
						stationName: that.stationName,
						nextStationName: "",
						favs: "",
						s: that.$s,
						v: that.$v,
						src: that.$src,
						userId: that.$userId,
						cityId: that.$city.id,
						sign: that.$sign
					},
					success: res => {
						var rst = JSON.parse(that.$JsonSubString(res.data));
						//console.log(rst);
						that.line = rst.jsonr.data.line; // 路线基本信息
						that.stations = rst.jsonr.data.stations; // 路线站点列表
						that.roads = rst.jsonr.data.roads; // 路况信息
						that.otherlines = rst.jsonr.data.otherlines; // 换向线路
						// 实时公交车
						var busList = rst.jsonr.data.buses;
						that.buses = busList;
						
						// 查询即将到达本站的公交
						var arriveList = [];
						for (var i = 0; i < busList.length; i++) {
							if (busList[i].travels.length > 0) {
								arriveList.push(busList[i]);
							}
						}
						that.buseTimes = arriveList.reverse();


						// 设置标题
						uni.setNavigationBarTitle({
							title: that.line.lineNo + '路'
						})
					},
					fail: () => {},
					complete: () => {}
				});
			},
			// 点击站点
			btnStations_Click: function(e) {
				this.targetOrder = e.currentTarget.dataset.index;
				//console.log(this.targetOrder);
				this.stationName = e.currentTarget.dataset.name;
				this.QueryBus();
			},
			// 时间处理
			getMinute: function(travelTime) {
				//console.log(travelTime);
				return parseInt(travelTime / 60);
			},
			// 点击刷新
			btnRefresh_Click: function() {
				this.QueryBus();
			},
			// 点击换向
			btnExchange_Click: function() {
				this.lineID = this.otherlines[0].lineId;
				this.QueryBus();
			}
		}
	}
</script>

<style>
	page {
		background-color: #F2F1F6;
	}

	.container {
		padding-bottom: 200rpx;
	}

	.bus-head {
		background-color: #fbfbfd;
		font-size: 30rpx;
		padding: 20rpx 30rpx;
		line-height: 1.5em;
	}

	.bus-head .time {
		font-size: 20rpx;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.next-time {
		background-color: #fff;
		padding: 50rpx 0 50rpx 0;
		margin: 50rpx 20rpx;
		border-radius: 20rpx;
	}

	.time-block {
		border-bottom: 1px solid #ddd;
		text-align: center;
	}

	.time-block .list {
		text-align: center;
		margin-bottom: 25px;
		display: inline-block;
		border-right: 1px solid #ddd;
		padding: 0 45rpx;
	}

	.time-block .list:last-child {
		border: none;
	}

	.time-block .list .time {
		position: relative;
		display: inline-block;
		width: 120rpx;
		color: #1296db;
		font-size: 30rpx;
	}

	.time-block .list .time .number {
		font-size: 70rpx;
		display: inline-block;
		width: 90rpx;
		text-align: right;
	}

	.time-block .list .time .minute {
		display: inline-block;
	}

	.time-block .list .time image {
		width: 20rpx;
		height: 20rpx;
		position: absolute;
		left: 100rpx;
		top: 10rpx;
	}

	.time-block .list .distance {
		font-size: 25rpx;
		color: #999;
	}

	.next-time .next-bottom {
		color: #666;
		padding: 30rpx 100rpx;
	}

	.next-time .next-bottom .left {
		float: left;
	}

	.next-time .next-bottom .right {
		float: right;
	}

	/*站牌列表*/
	.plate-block {
		position: relative;
		padding-top: 30rpx;
		width: 100%;
		overflow: hidden;
		overflow-x: scroll;
		white-space: nowrap;
		-webkit-overflow-scrolling: touch;
	}

	.plate-block::-webkit-scrollbar {
		display: none;
	}

	/*小汽车*/

	/*未到站的小汽车*/

	.plate-block .plate-list .car {
		position: absolute;
		width: 70rpx;
		height: 70rpx;
		top: -60rpx;
		left: -90rpx;
	}

	/*到站的小汽车*/

	.plate-block .plate-list .car-arrive {
		position: absolute;
		width: 70rpx;
		height: 70rpx;
		top: -60rpx;
		left: -30rpx;
	}

	.plate-block .plate-list {
		position: relative;
		width: 120rpx;
		display: inline-block;
	}

	.plate-list-first,
	.plate-list-last {
		width: 60rpx;
		height: 20rpx;
		display: inline-block;
		background-color: #f08d26;
	}

	.plate-list-first {
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}

	.plate-list-last {
		border-top-right-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}

	.plate-block .plate-list .color,
	.plate-block .plate-list .color-1,
	.plate-block .plate-list .color-2,
	.plate-block .plate-list .color-3,
	.plate-block .plate-list .color-4 {
		height: 20rpx;
		float: left;
	}

	.plate-block .plate-list .color {
		background-color: #1296db;
	}

	.plate-block .plate-list .color-1 {
		background-color: #4fb80d;
	}

	.plate-block .plate-list .color-2 {
		background-color: #f08d26;
	}

	.plate-block .plate-list .color-3 {
		background-color: #e62e25;
	}

	.plate-block .plate-list .color-4 {
		background-color: #b62315;
	}

	/*站牌名称列表*/

	.plate-name {
		display: inline-block;
		width: 120rpx;
		text-align: center;
		vertical-align: top;
		position: relative;
		top: -42rpx;
	}

	.plate-name image {
		width: 20rpx;
		height: 20rpx;
	}

	.plate-name .number {
		font-size: 20rpx;
	}

	.plate-name .name {
		display: inline-block;
		width: 45rpx;
		white-space: normal;
		writing-mode: vertical-rl;
	}

	.plate-name-block .selected {
		font-size: 40rpx;
		color: #f08d26;
	}

	.plate-name-block .selected image {
		background-color: #f08d26;
		border-radius: 20rpx;
		padding: 10rpx;
	}

	.plate-name-block .selected .number {
		position: relative;
		top: -10rpx;
		font-size: 25rpx;
	}

	.plate-name-block .selected .name {
		position: relative;
		top: -13rpx;
		left: 5rpx;
	}

	/*底部按钮*/

	.bus-bottom {
		position: fixed;
		bottom: 0;
		background-color: #fff;
		height: 100rpx;
		width: 100%;
		text-align: center;
		padding: 10rpx 0;
	}

	.bus-bottom image {
		width: 50rpx;
		height: 50rpx;
	}

	.bus-bottom .bottom-btn {
		display: inline-block;
		width: 30%;
		color: #707070;
		font-size: 30rpx;
	}

	/* 遮罩层 */

	.masklayer {
		display: none;
		z-index: 100;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
	}

	/* 收藏列表 */

	.collection {
		display: none;
		z-index: 101;
		position: fixed;
		bottom: 0;
		background-color: #fff;
		width: 100%;
		color: #666;
	}

	.show {
		display: block;
	}

	.collection .head {
		background-color: #f6f6f6;
		font-size: 35rpx;
		height: 90rpx;
		line-height: 90rpx;
	}

	.collection .head .btn {
		float: left;
		margin-left: 12px;
	}

	.collection .head .title {
		margin-left: -30rpx;
	}

	.collection .list {
		min-height: 400rpx;
		text-align: left;
	}

	.collection .list .btn {
		display: inline-block;
		background-color: #f6f6f6;
		border-radius: 40rpx;
		width: 190rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		margin: 20rpx 30rpx;
	}
</style>
