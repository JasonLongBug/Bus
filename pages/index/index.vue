<template>
	<view>
		<view class="home-head">
			<view class="head-top">
				<navigator url="../city/city">
					<view class="address">{{cityName}}
						<view class='tap'>▼</view>
					</view>
				</navigator>
				<view class="user-info">
					<image class="user-head" :src="headUrl" mode=""></image>
					<!-- <view class="user-name">的即可</view> -->
				</view>
			</view>
			<view class="search" @tap="btnSearch_Click">
				<icon type='search' size='16'></icon>
				<input placeholder="搜索公交线路、车站、地点" disabled="false"></input>
			</view>
		</view>
		<view class="bg-grey">
			<view class="tip-addr" v-if="showTip" @tap="btnTipCity_Click">
				<view>
					您似乎位于{{gpsRealtimeCity.cityName}}，点击此处切换
				</view>
				<view @tap.stop="btnTipClose_Click">
					×
				</view>
			</view>
			<view class='hemo-middle'>
				<view @tap="btnTab_Click" v-for="(item,index) in tabItem" :key="index" :data-id="item._id" class="tab" :class="showid==item._id?'selected':''">{{item.TypeName}}</view>
				<view class='tab'>历史</view>
			</view>
			<!-- <view class='home-list'>
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
			</view> -->
			<view v-if="showLogin" class="login-tip login-showtip">
				<view class="title">Tips</view>
				<view class="content">登录后将拥有更多功能，如：收藏</view>
				<button type="primary" open-type="getUserInfo" @getuserinfo="btnLogin_Click" lang="zh_CN">微信登录</button>
			</view>
			<view v-else class="login-tip login-showtip">
				<view class="title">Tips</view>
				<view class="content">登录成功，收藏功能即将上线</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				tabItem: [ // 标签列表
					{
						_id: 1,
						TypeName: "上班"
					},
					{
						_id: 2,
						TypeName: "下班"
					},
				],
				showid: 1, // 选中标签
				cityName: "", // 城市名称
				showTip: false, // 是否显示提示
				gpsRealtimeCity: [], // 定位城市
				showLogin: true, // 显示登录
				headUrl: "../../static/image/icon-bus.png", // 头像
				busList: [{ // 收藏的线路
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
				}]
			}
		},
		onLoad: function() {},
		onShow: function() {
			this.cityName = this.$city.name;
			if (this.$wxAvatarUrl != "") {
				this.headUrl = this.$wxAvatarUrl;
				this.showLogin = false;
			}
			// 定位
			this.GetNowLocation();
		},
		methods: {
			// 获取定位
			GetNowLocation: function() {
				var that = this;
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						// 根据定位查询所在城市
						uni.request({
							url: this.$CityServerUrl,
							method: 'GET',
							data: {
								type: "gpsRealtimeCity",
								lat: res.latitude,
								lng: res.longitude,
								gpstype: "wgs",
								s: that.$s,
								v: that.$v,
								src: that.$src,
								userId: that.$userId
							},
							success: res => {
								that.gpsRealtimeCity = res.data.data.gpsRealtimeCity;

								// 如果第一次进入，没有城市ID，则按当前定位显示，否则显示提示
								if (that.$city.id == "") {
									this.$city.id = this.gpsRealtimeCity.cityId;
									this.cityName = this.$city.name = this.gpsRealtimeCity.cityName;
								} else {
									if (that.gpsRealtimeCity.cityId != that.$city.id) {
										that.showTip = true;
									}
								}
							},
							fail: () => {},
							complete: () => {}
						});
					},
					fail: () => {},
					complete: () => {}
				});
			},
			// 关闭提示
			btnTipClose_Click: function() {
				this.showTip = false;
			},
			// 点击标签
			btnTab_Click: function() {

			},
			// 点击提示-城市
			btnTipCity_Click: function() {
				this.$city.id = this.gpsRealtimeCity.cityId;
				this.cityName = this.$city.name = this.gpsRealtimeCity.cityName;
				this.showTip = false;
			},
			// 点击搜索
			btnSearch_Click: function() {
				uni.navigateTo({
					url: '../search/search'
				});
			},
			// 点击微信登录
			btnLogin_Click: function(res) {
				console.log(res);
				var userInfo = res.detail.userInfo;
				uni.setStorage({
					key: "wxAvatarUrl",
					data: userInfo.avatarUrl
				})

				this.headUrl = this.$wxAvatarUrl = userInfo.avatarUrl;

				this.showLogin = false;
				uni.showTabBar({
					animation: true
				});
			}
		}
	}
</script>
<style>
	page {
		background-color: #F2F1F6;
	}

	.home-head {
		background-color: #fff;
		height: 250rpx;
		padding: 0 30rpx;
	}

	.home-head .head-top {
		display: flex;
		justify-content: space-between;
	}

	.home-head .head-top .address {
		font-size: 70rpx;
		margin-bottom: 10rpx;
	}

	.home-head .head-top .address .tap {
		display: inline-block;
		font-size: 20rpx;
		position: relative;
		top: -17rpx;
		left: 20rpx;
	}

	.home-head .head-top .user-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.home-head .head-top .user-head {
		width: 70rpx;
		height: 70rpx;
		border: 1px solid #DDDDDD;
		/* border-radius: 70rpx; */
	}

	.home-head .head-top .user-name {
		font-size: 25rpx;
		color: #3F536E;
	}

	.home-head .search {
		width: 88%;
		background-color: #f2f1f6;
		border-radius: 100rpx;
		padding: 20rpx 40rpx;
		margin-top: 20rpx;
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
		padding-top: 5rpx;
	}

	/* 提示 */
	.tip-addr {
		display: flex;
		background: #F08D26;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 10rpx;
		color: #FFFFFF;
		margin: 20rpx 20rpx 0 20rpx;
		padding: 0 20rpx;
		justify-content: space-between;
	}

	/* 遮罩层 */
	.masklayer {
		z-index: 100;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
	}

	/* 微信登录 */
	.login-tip {
		position: fixed;
		z-index: 200;
		top: 40%;
		left: 10%;
		width: 500rpx;
		height: 200rpx;
		background: #FFFFFF;
		padding: 30rpx 50rpx;
		border-radius: 7rpx;
		text-align: center;
	}

	.login-tip .title {
		color: #333333;
		font-weight: bold;
		margin-bottom: 30rpx;
		font-size: 35rpx;
	}

	.login-tip .content {
		color: #C0C0C0;
		font-size: 30rpx;
		margin-bottom: 50rpx;
	}

	.login-showtip {
		background: none;
	}

	/*中间按钮*/
	.hemo-middle {
		padding: 10rpx 30rpx 30rpx 30rpx;
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
