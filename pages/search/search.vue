<template>
	<view>
		<view class="home-head">
			<view class="search">
				<icon type='search' size='16'></icon>
				<input v-model="keyword" placeholder="搜索公交线路" type='number' confirm-type='search' focus="true" @input="btnQuery_Click"
				 confirm="btnQuery_Click"></input>
			</view>
			<view class='btnQuery' @tap='btnQuery_Click'>查询</view>
		</view>
		<view class='list-block' v-if="busList.length>0">
			<view class='list-title'>线路</view>
			<view class='list'>
				<view class='bus' @tap='bus_Click' :data-lineId="item.lineId" v-for="item in busList" :key="item.lineId">
					<image class='icon-bus' src="../../static/image/icon-bus.png"></image>
					<view class='bus-number'>{{item.lineNo}}路</view>
					<view class='bus-route'>{{item.startSn}}-{{item.endSn}}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				keyword: "", // 查询关键词
				busList: [

				]
			}
		},
		methods: {
			// 查询
			btnQuery_Click: function() {
				var that = this;
				uni.request({
					url: this.$BusServerUrl + "favproxy",
					method: 'GET',
					data: {
						returnFavs: 1,
						action: "/bus/query!fuzzy.action",
						key: that.keyword,
						s: that.$s,
						v: that.$v,
						src: that.$src,
						userId: that.$userId,
						cityId: that.$city.id,
						sign: that.$sign
					},
					success: res => {
						var rst = JSON.parse(that.$JsonSubString(res.data));
						that.busList = rst.jsonr.data.lines;
						// console.log(that.busList);
					},
					fail: () => {},
					complete: () => {}
				});
			},
			// 点击列表
			bus_Click: function(e) {
				var lineid = e.currentTarget.dataset.lineid;
				uni.navigateTo({
					url: '../bus/bus?lid=' + lineid,
				});
			}
		}
	}
</script>
<style>
	/*顶部搜索框*/
	.home-head {
		background-color: #fff;
		height: 120rpx;
		padding: 0 30rpx;
		margin-bottom: 20rpx;
	}

	.home-head .btnQuery {
		position: relative;
		top: 15rpx;
		display: inline-block;
		font-size: 30rpx;
		padding: 10rpx 20rpx;
		background-color: #cee4f9;
		color: #1f8bd9;
		border-radius: 30rpx;
	}

	.home-head .search {
		width: 70%;
		background-color: #f2f1f6;
		border-radius: 100rpx;
		padding: 20rpx 40rpx;
		float: left;
		margin-right: 20rpx;
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

	/*列表*/

	.list-block {
		background-color: #fff;
	}

	.list-block .list-title {
		background-color: #fbfbfd;
		color: #aaa;
		font-size: 30rpx;
		padding: 30rpx;
	}

	.list-block .list {
		padding: 0 0 0 35rpx;
	}

	.list-block .list .bus {
		padding: 30rpx 0;
		border-bottom: 1px solid #ddd;
	}

	.list-block .list .bus:last-child {
		border: none;
	}

	.list-block .list .bus image {
		position: relative;
		top: 3rpx;
		width: 85rpx;
		height: 85rpx;
		float: left;
		margin-right: 20rpx;
	}

	.list-block .list .bus .bus-route {
		font-size: 30rpx;
		color: #999;
	}
</style>
