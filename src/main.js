import Vue from "vue";
import router from './router/routes'; //引入路由配置
import App from "./app";
import moment from 'moment';
import ElementUI from 'element-ui';
import Lockr from 'lockr';
import _ from 'lodash';
import 'element-ui/lib/theme-default/index.css';
import VueRouter from "vue-router";
import store from './vuex/store'
import VueResource from 'vue-resource';

Vue.config.debug = true; //开启错误提示

router.beforeEach((to, from, next) => {
	if (to.path === '/home/welcome') {
		store.dispatch('USER_LOGOUT');
	}
	document.title = to.meta.title
		// NProgress.start()
	next()
})

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueResource);

window.moment = moment;
window._ = _;
window.Lockr = Lockr;

const app = new Vue({
	el: '#app',
	store,
	router, //添加路由配置
	render: h => h(App)
});