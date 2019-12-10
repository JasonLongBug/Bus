<template>
	<view>
		<SortPickerList ref="sortPickerList" @clickData="clickData"></SortPickerList>
	</view>
</template>

<script>
	import SortPickerList from "@/components/nickro-sortPickerList/nickro-sortPickerList.vue"

	export default {
		name: "contury",
		components: {
			SortPickerList
		},
		data() {
			return {
				dataArr: [
					// {
					// 	name: '中国',
					// 	value: 'China'
					// },
					// {
					// 	name: '俄罗斯',
					// 	value: 'Russia'
					// }
				]
			}
		},
		onLoad() {
			this.GetCityList();
		},
		methods: {
			clickData(data) {
				console.log('获取名：' + data.label)
				console.log('获取值：' + data.value)
				this.$city.name = data.label;
				this.$city.id = data.value;
				uni.navigateBack();
			},
			GetCityList: function() {
				var that = this;

				uni.request({
					url: this.$CityServerUrl,
					method: 'GET',
					data: {
						type: "allRealtimeCity",
						s: this.$s,
						v: this.$v,
						userId: this.$userId
					},
					success: res => {
						var allRealtimeCity = res.data.data.allRealtimeCity;
						console.log(allRealtimeCity.length);
						var addrList = [];
						for (var i = 0; i < allRealtimeCity.length; i++) {
							var addr = {};
							addr.name = allRealtimeCity[i].cityName;
							addr.value = allRealtimeCity[i].cityId;
							addrList.push(addr);
						}

						that.$refs["sortPickerList"].initPage(addrList);
						console.log(addrList);
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>

</style>
