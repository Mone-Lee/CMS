<template>
	<div id="login">
		<div class="title">
			<h3>登录</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="用户ID">
				<el-input v-model="form.id"></el-input>
			</el-form-item>
			<el-form-item label="用户密码">
				<el-input v-model="form.password"></el-input>
			</el-form-item>
			<el-form-item label="特殊资源">
			    <el-radio-group v-model="form.privilege_id">
			      <el-radio label="1">普通用户</el-radio>
			      <el-radio label="2">管理员</el-radio>
			    </el-radio-group>
			</el-form-item>
			<el-form-item>
			    <el-button type="primary" @click="login">确定</el-button>
			    <el-button @click="goback">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style>
	#login{
		width:85%;
		margin:0 auto;
	}
	#login .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#login .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#login .title h3{
		float: left;
	}
	#login .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default{
		name:'login',
		data(){
			return{
				form:{
					id:'',
					password:'',
					privilege_id:'',
				}
			}
		},
		created(){

		},
		methods:{
			goback(){
		    	this.$router.go(-1);
		    },
		    login(){
			    this.$http.post('http://127.0.0.1:3000/home/login',{id:this.form.id,password:this.form.password,privilege_id:this.form.privilege_id,}).then((response)=>{
		    		// alert(response.body.msg);
		    		this.$message({
			          message: response.body.msg,
			          type: 'success',
			          duration:1000
			        });
		    		if( response.body.code == 200){
		    			let user_info={};
		    			user_info.user_id = this.form.id;
		    			user_info.user_privilege = this.form.privilege_id;
		    			this.$store.dispatch('USER_LOGIN',user_info);
		    			this.$router.push({path:'/item/index'});
		    		}
		    	},(response)=>{
		    		this.$message({
			          message: '登陆失败！',
			          type: 'error'
			        });
		    	})
		    },
		},
	}
</script>