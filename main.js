import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// 查询城市服务地址
Vue.prototype.$CityServerUrl = "https://web.chelaile.net.cn/cdatasource/citylist";
// 查询公交
Vue.prototype.$BusServerUrl = "https://web.chelaile.net.cn/ddatasource/";

// 客户端标识
Vue.prototype.$s = "h5";
// 版本号
Vue.prototype.$v = "2.2.15";
// 运行环境
Vue.prototype.$src = "webapp_default";
// 用户ID
Vue.prototype.$userId = "browser_" + (new Date()).getTime();
// 用户签名
Vue.prototype.$sign = 1;
// 城市信息
Vue.prototype.$city = {
	"name": "",
	"id": ""
};

// 微信账户头像
Vue.prototype.$wxAvatarUrl = uni.getStorageSync("wxAvatarUrl") || "";
console.log(Vue.prototype.$wxAvatarUrl);

// 去掉接口返回值的前后多余的字符
Vue.prototype.$JsonSubString=function(jsonStr){
	return jsonStr.substring(6, jsonStr.length - 6);
}

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
