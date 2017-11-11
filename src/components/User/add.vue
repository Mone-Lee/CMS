<template>
	<div id="user-add">
		<div class="title">
			<h3>添加用户</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<el-form ref="user" :rules="rules" :model="form" label-width="80px">
			<el-form-item label="用户ID" prop="id">
			    <el-input v-model="form.user_id"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="name">
			    <el-input v-model="form.user_name"></el-input>
			</el-form-item>
			<el-form-item>
			    <el-button type="info" @click="registerUser">确定</el-button>
			    <el-button @click="goback">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style>
	#user-add{
		width:85%;
		margin:0 auto;
	}
	#user-add .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#user-add .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#user-add .title h3{
		float: left;
	}
	#user-add .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default{
		name:'user-add',
		data(){
			return {
				form:{
					user_id:'',
					user_name:'',
				},
				rules: {
			        id: [
			            { required: true, message: '请输入用户id', trigger: 'blur' },
			        ],
			        name: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
			    },
			}
		},
		created(){

		},
		methods:{
			goback(){
		    	this.$router.go(-1);
		    },
		    registerUser(){
		    	this.$refs['user'].validate((valid) => {
		          if (valid) {
			        this.$http.post('http://127.0.0.1:3000/home/normalRegister',{id:this.form.user_id,name:this.form.user_name}).then((response)=>{
			    		this.$message({
				          message: response.body.msg,
				          type: 'success'
				        });
			    	},(response)=>{
			    		this.$message({
				          message:'register unsuccessfully!',
				          type: 'error'
				        });
			    	})
		          } else {
		            this.$message({
			          message:'请按规则填写',
			          type: 'warning'
			        });
		            return false;
		          }
		        });
		    	
			},
		},
	}
	
</script>