import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	user_id: '',
	user_privilege: '',
	hasPermission: false,
}

const mutations = {
	//用户登录
	USER_LOGIN(state, user_info) {
		state.user_id = user_info.user_id;
		state.user_privilege = user_info.user_privilege;
		Lockr.set('user_id', state.user_id);
		Lockr.set('user_privilege', state.user_privilege);

	},

	//页面刷新
	FlASH_USER(state) {
		console.log('old_user_id:' + state.user_id);
		console.log('old_user_privilege:' + state.user_privilege);
		state.user_id = Lockr.get('user_id');
		state.user_privilege = Lockr.get('user_privilege');
		console.log('new_user_id:' + state.user_id);
		console.log('new_user_privilege:' + state.user_privilege);
	},

	USER_LOGOUT(state) {
		state.user_id = '';
		state.user_privilege = '';
		Lockr.rm('user_id');
		Lockr.rm('user_privilege');
	}
}

const actions = {
	USER_LOGIN({
		commit
	}, user_info) {
		commit('USER_LOGIN', user_info)
	},

	FlASH_USER({
		commit
	}) {
		commit('FlASH_USER')
	},

	USER_LOGOUT({
		commit
	}) {
		commit('USER_LOGOUT')
	},
}

export default new Vuex.Store({
	state,
	mutations,
	actions,
})