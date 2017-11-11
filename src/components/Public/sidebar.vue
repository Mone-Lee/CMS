/**
*   sidebar
*   描述：侧边栏
*/
<template>	
	<div id="sidebar">
		<el-menu class="el-menu-vertical-demo" theme="dark">
			<el-menu-item index="1" :class="{'active': selected == 1}"><router-link to="/item/index">物件管理</router-link></el-menu-item>
			<el-menu-item index="2" :class="{'active': selected == 2}" v-show="(user_privilege == 2)"><router-link to="/class/index">分类管理</router-link></el-menu-item>
			<el-menu-item index="3" :class="{'active': selected == 3}" v-show="(user_privilege== 2)"><router-link to="/object/index">资产管理</router-link></el-menu-item>
			<el-menu-item index="4" :class="{'active': selected == 4}" v-show="(user_privilege== 2)"><router-link to="/overdue/index">逾期管理</router-link></el-menu-item>
			<el-menu-item index="5" :class="{'active': selected == 5}" v-show="(user_privilege== 2)"><router-link to="/user/index">用户管理</router-link></el-menu-item>
			<el-menu-item index="6" :class="{'active': selected == 6}"><router-link :to="user_id == undefined ? '/home/login':{ name: 'MySpace', params: { id: user_id }}">个人空间</router-link></el-menu-item>

		</el-menu>

	</div>
</template>

<style>
	.el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active a{
	    color: #20a0ff;
	}
	.el-menu-item a, .el-submenu__title a{
	    color: #bfcbd9;
	    text-decoration: none;
	}
	#sidebar{
		text-align: center;
	}
	.active{
		color: #20a0ff;
		background: #252527;
	}
</style>

<script>
	import { mapState } from 'vuex';

	export default{
		name:'sidebar',
		data(){
			return{
				menu:'',
				module:'',
				selected:'',
				leftMenus:[],
				user_id:'',
			}
		},
		computed: mapState({
		    // es6 箭头函数更加简洁
		    user_id: state => state.user_id,
		    user_privilege: state => state.user_privilege,
		}),
		created(){
			let menus = ['item','class','object','overdue','user','myspace'];
			this.menu = this.$route.meta.menu;
			this.module = this.$route.meta.module;
			this.leftMenus = menus;
			let count = 0;
			_(menus).forEach((res) => {
				count++;
				if (res == this.module) {
					this.selected = count;
				}
			});

		},
		watch: {
			'$route' (to, from) { // 监听路由改变
				let count = 0;
				_(this.leftMenus).forEach((res) => {
					count++;
					if (res == to.meta.module) {
						this.selected = count;
						to.meta.fromName = from.name
					} 
				})
			}
		},
	};
</script>