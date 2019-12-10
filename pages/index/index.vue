<template>
	<view>
		<view class="home-head">
			<navigator url="../city/city">
				<view class="address">{{cityName}}
					<view class='tap'>▼</view>
				</view>
			</navigator>
			<navigator class="search" url="../search/search">
				<icon type='search' size='16'></icon>
				<input placeholder="搜索公交线路、车站、地点" disabled="false"></input>
			</navigator>
		</view>
		<view class="bg-grey">
			<view class='hemo-middle'>
				<view @tap="btnTab_Click" v-for="(item,index) in tabItem" :key="index" :data-id="item._id" class="tab" :class="showid==item._id?'selected':''">{{item.TypeName}}</view>
				<view class='tab'>历史</view>
			</view>
			<view class='home-list'>
				<view class='list-block' @tap='busList_Click' v-for='(item,index) in busList' :key='index' :data-lid='item.lineID'
				 :data-torder='item.targetOrder'>
					<view class='bus-plate'>
						<view class='bus-number'>{{item.lineNo}}路</view>
						<view>开往 {{item.endSn}}</view>
						<view>候车站 {{item.stationName}}</view>
					</view>
					<view v-if="item.distance=='999'" class='range'>
						<view class='wait'>
							等待发车
						</view>
					</view>
					<view v-else class='range'>
						<view class='time'>
							<image src="/static/image/icon-wifi.png"></image>
							<view>
								<text class='number'>{{item.travelTime}}</text>
								<text>分</text>
							</view>
						</view>
						<view class='distance'>{{item.order}}站 / {{item.distance}}km</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				tabItem: [], // 标签列表
				cityName: "", // 城市名称
				busList: [{
					lineID: "035180997576", // 线路ID
					lineNo: "804", // 线路
					endSn: "火车站", // 终点
					targetOrder: 1, // 候车站ID
					stationName: "招呼站", // 候车站
					travelTime: 7, // 到达时间（分）
					order: 3, // 还有几站到
					distance: 1.2, // 距离
					state: 0, // -1无车，0正常
				}, {
					lineID: "035180997576", // 线路ID
					lineNo: "804", // 线路
					endSn: "火车站", // 终点
					targetOrder: 1, // 候车站ID
					stationName: "招呼站", // 候车站
					travelTime: 7, // 到达时间（分）
					order: 3, // 还有几站到
					distance: 1.2, // 距离
					state: 0, // -1无车，0正常
				}, {
					lineID: "035180997576", // 线路ID
					lineNo: "804", // 线路
					endSn: "火车站", // 终点
					targetOrder: 1, // 候车站ID
					stationName: "招呼站", // 候车站
					travelTime: 7, // 到达时间（分）
					order: 3, // 还有几站到
					distance: 1.2, // 距离
					state: 0, // -1无车，0正常
				}, {
					lineID: "035180997576", // 线路ID
					lineNo: "804", // 线路
					endSn: "火车站", // 终点
					targetOrder: 1, // 候车站ID
					stationName: "招呼站", // 候车站
					travelTime: 7, // 到达时间（分）
					order: 3, // 还有几站到
					distance: 1.2, // 距离
					state: 0, // -1无车，0正常
				}, {
					lineID: "035180997576", // 线路ID
					lineNo: "804", // 线路
					endSn: "火车站", // 终点
					targetOrder: 1, // 候车站ID
					stationName: "招呼站", // 候车站
					travelTime: 7, // 到达时间（分）
					order: 3, // 还有几站到
					distance: 1.2, // 距离
					state: 0, // -1无车，0正常
				}, {
					lineID: "035180997576", // 线路ID
					lineNo: "804", // 线路
					endSn: "火车站", // 终点
					targetOrder: 1, // 候车站ID
					stationName: "招呼站", // 候车站
					travelTime: 7, // 到达时间（分）
					order: 3, // 还有几站到
					distance: 1.2, // 距离
					state: 0, // -1无车，0正常
				}, {
					lineID: "035180997576", // 线路ID
					lineNo: "804", // 线路
					endSn: "火车站", // 终点
					targetOrder: 1, // 候车站ID
					stationName: "招呼站", // 候车站
					travelTime: 7, // 到达时间（分）
					order: 3, // 还有几站到
					distance: 1.2, // 距离
					state: 0, // -1无车，0正常
				}] // 收藏的线路
			}
		},
		onLoad: function() {

		},
		onShow: function() {
			this.cityName = this.$city.name;
		},
		methods: {

		}
	}
</script>
<style>
	.home-head {
		background-color: #fff;
		height: 300rpx;
		padding: 0 30rpx;
	}

	.home-head .address {
		font-size: 70rpx;
		margin-bottom: 50rpx;
	}

	.home-head .address .tap {
		display: inline-block;
		font-size: 20rpx;
		position: relative;
		top: -17rpx;
		left: 20rpx;
	}

	.home-head .search {
		width: 88%;
		background-color: #f2f1f6;
		border-radius: 100rpx;
		padding: 20rpx 40rpx;
	}

	.home-head .search icon {
		float: left;
		position: relative;
		top: 10rpx;
		margin-right: 20rpx;
	}

	.home-head .search input {
		font-size: 30rpx;
	}

	.bg-grey {
		background-color: #F2F1F6;
	}

	/*中间按钮*/

	.hemo-middle {
		padding: 30rpx 30rpx;
		height: 50rpx;
	}

	.hemo-middle .tab {
		float: left;
		font-size: 30rpx;
		margin-right: 20rpx;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		color: #999;
	}

	.hemo-middle .selected {
		background-color: #cee4f9;
		color: #1f8bd9;
	}

	/*列表*/
	.home-list {
		padding-bottom: 10rpx;
	}

	.home-list .list-block {
		position: relative;
		padding: 15rpx 30rpx 0 30rpx;
		margin: 0 20rpx 20rpx 20rpx;
		height: 180rpx;
		background-color: #FFFFFF;
		border-bottom: 1px solid #ddd;
		border-radius: 15rpx;
	}

	.home-list .list-block:last-child {
		border: none;
	}

	.home-list .list-block .bus-plate {
		float: left;
		width: 450rpx;
		font-size: 30rpx;
	}

	.home-list .list-block .bus-plate view {
		margin-bottom: 15rpx;
	}

	.home-list .list-block .bus-plate .bus-number {
		font-size: 40rpx;
	}

	.home-list .list-block .range {
		position: relative;
		float: right;
		font-size: 30rpx;
		color: #1f8bd9;
		text-align: right;
	}

	.home-list .list-block .wait {
		font-size: 50rpx;
		line-height: 150rpx;
	}

	.home-list .list-block .time image {
		width: 20rpx;
		height: 20rpx;
		position: absolute;
		left: 140rpx;
		top: 10rpx;
	}

	.home-list .list-block .time .number {
		font-size: 80rpx;
		text-align: right;
	}

	.home-list .list-block .time .number text {
		font-size: 30rpx;
	}
</style>
