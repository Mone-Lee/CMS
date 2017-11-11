/**
*   headbar
*   描述：顶部栏
*/
<template>
	<div id="headbar">
		<span class="logo">CMS</span>
		<span class="name">实验室资产管理系统</span>
		<div class="user">
			<span>用户：</span>
			<span v-show="(user_id == undefined)">未登录</span>
			<span v-show="(user_id !== undefined)">{{user_id}}</span>
			<el-button type="primary" :disabled="(user_id !== undefined)" @click="login">登录</el-button>
		</div>
	</div>
</template>

<style>
	#headbar{
		background: #222c3c;
    	color:#fff;
	    line-height: 40px;
	    font-size: 22px;
	    padding:10px 10px 10px 34px;
	}
   	#headbar .name{
   		display: inline-block;
   		padding-left: 10px;
   		font-size: 16px;
   	}
   	#headbar .user{
   		display: inline-block;
	    float: right;
	    margin-right: 40px;
	    font-size: 16px;
   	}
   	#headbar .user button{
   		margin-left: 20px;
   	}
</style>

<script>
	import { mapState } from 'vuex';

	export default{
		name:'headbar',

		data(){
			return {
			}
		},
		created(){
		},
		computed: mapState({
		    // es6 箭头函数更加简洁
		    user_id: function(state) {
		    	if(state.user_id == ''){
		    		this.$store.dispatch('FlASH_USER');
		    	}
                return state.user_id;
            }
		}),
		methods:{
			login(){
				this.$router.push({path:'/home/login'});
			},
		}
		
	};
</script>