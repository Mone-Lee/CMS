import VueRouter from "vue-router";

import test from "../views/test/test";

import Home from '../Home.vue';

import Welcome from '../components/Welcome/index.vue';

import login from '../components/Welcome/login.vue';

import itemIndex from '../components/Item/index.vue';
import itemDetail from '../components/Item/detail.vue';
import itemAdd from '../components/Item/add.vue';
import itemEdit from '../components/Item/edit.vue';

import classIndex from '../components/Class/index.vue';

import objectIndex from '../components/Object/index.vue';
import objectEdit from '../components/Object/edit.vue';
import objectAdd from '../components/Object/add.vue';
import objectReturn from '../components/Object/return.vue';
import objectLend from '../components/Object/lend.vue';
import objectRepair from '../components/Object/repair.vue';

import overdueIndex from '../components/Overdue/index.vue';

import userIndex from '../components/User/index.vue';
import userAdd from '../components/User/add.vue';

import myspaceIndex from '../components/Myspace/index.vue';


const routes = [{
	path: '/test',
	component: test
}, {
	path: '/home',
	component: Home,
	children: [{
		path: 'welcome',
		component: Welcome,
		name: 'Welcome',
		meta: {
			module: 'welcome',
			title: '欢迎'
		}
	}, {
		path: 'login',
		component: login,
		name: 'Login',
		meta: {
			module: 'login',
			title: '登录'
		}
	}]

}, {
	/*item*/
	path: '/home',
	component: Home,
	children: [{
		path: '/item/index',
		component: itemIndex,
		name: 'ItemList',
		meta: {
			module: 'item',
			title: '现有物件查询'
		}
	}, {
		path: '/item/detail/:name',
		component: itemDetail,
		name: 'ItemDetail',
		meta: {
			module: 'item',
			title: '物件详情'
		}
	}, {
		path: '/item/add',
		component: itemAdd,
		name: 'ItemAdd',
		meta: {
			module: 'item',
			title: '添加物件'
		}
	}, {
		path: '/item/edit/:id',
		component: itemEdit,
		name: 'ItemEdit',
		meta: {
			module: 'item',
			title: '编辑'
		}
	}, ]
}, {
	/*class*/
	path: '/home',
	component: Home,
	children: [{
		path: '/class/index',
		component: classIndex,
		name: 'ClassList',
		meta: {
			module: 'class',
			title: '物件分类管理'
		}
	}, ]
}, {
	/*object*/
	path: '/home',
	component: Home,
	children: [{
		path: '/object/index',
		component: objectIndex,
		name: 'ObjectList',
		meta: {
			module: 'object',
			title: '资产查询'
		}
	}, {
		path: '/object/add',
		component: objectAdd,
		name: 'ObjectAdd',
		meta: {
			module: 'object',
			title: '添加资产'
		}
	}, {
		path: '/object/edit/:id',
		component: objectEdit,
		name: 'ObjectEdit',
		meta: {
			module: 'object',
			title: '编辑资产'
		}
	}, {
		path: '/object/return',
		component: objectReturn,
		name: 'ObjectReturn',
		meta: {
			module: 'object',
			title: '归还资产'
		}
	}, {
		path: '/object/lend',
		component: objectLend,
		name: 'ObjectLend',
		meta: {
			module: 'object',
			title: '出借资产'
		}
	}, {
		path: '/object/repair',
		component: objectRepair,
		name: 'ObjectRepair',
		meta: {
			module: 'object',
			title: '送修资产'
		}
	}, ]
}, {
	/*overdue*/
	path: '/home',
	component: Home,
	children: [{
		path: '/overdue/index',
		component: overdueIndex,
		name: 'OverduetList',
		meta: {
			module: 'overdue',
			title: '逾期项查询'
		}
	}, ]
}, {
	/*user*/
	path: '/home',
	component: Home,
	children: [{
		path: '/user/index',
		component: userIndex,
		name: 'UserList',
		meta: {
			module: 'user',
			title: '用户管理'
		}
	}, {
		path: '/user/add',
		component: userAdd,
		name: 'UserAdd',
		meta: {
			module: 'user',
			title: '添加用户'
		}
	}, ]
}, {
	/*myspace*/
	path: '/home',
	component: Home,
	children: [{
		path: '/myspace/:id',
		component: myspaceIndex,
		name: 'MySpace',
		meta: {
			module: 'myspace',
			title: '个人空间'
		}
	}]
}, ]

const router = new VueRouter({
	mode: 'history',
	routes
});
module.exports = router;