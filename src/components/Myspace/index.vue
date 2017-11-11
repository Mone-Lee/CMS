<template>
	<div id="myspace-index">
		<div class="title">
			<h3>个人空间</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<!-- 用户基本信息 -->
		<el-form ref="myspace" :rules="rules" :model="form" label-width="100px">
		  	<el-form-item label="用户ID">
		    	<!-- <el-input v-model="form.user_id" :disable=""></el-input> -->
		    	<span>{{form.id}}</span>
		  	</el-form-item>
		  	<el-form-item label="用户名">
		  		<span>{{form.name}}</span>
		  	</el-form-item>
		  	<el-form-item label="用户密码" prop="password">
		    	<el-input v-model="form.password" :disabled="!edit"></el-input>
		  	</el-form-item>
		  	<el-form-item label="邮箱">
		    	<el-input v-model="form.email" :disabled="!edit"></el-input>
		  	</el-form-item>
		  	<el-form-item label="联系方式">
		    	<el-input v-model="form.phone_number" :disabled="!edit"></el-input>
		  	</el-form-item>
		    <el-button type="primary" @click="toggleEdit" v-show="!edit">编辑</el-button>
		    <el-button type="primary" @click="editUser" v-show="edit">保存</el-button>
		    <el-button v-show="edit" @click="toggleEdit">取消</el-button>
		  </el-form-item>
		</el-form>
		
		<!-- 用户借还信息 -->
		<p><strong>用户借还信息</strong></p>
		<el-table :data="lendingMsg" border style="width: 100%">
		    <el-table-column prop="object_id" label="物件ID" width="120"></el-table-column>
		    <el-table-column prop="name" label="物件名" ></el-table-column>
		    <el-table-column prop="return_time" label="应当归还日期" width="180"></el-table-column>
		    <el-table-column prop="renew" label="续借次数" width="100"></el-table-column>
		    <el-table-column label="状态" width="120">
		    	<template scope="scope">
			        <span v-if="scope.row.status == 0">有效期中</span>
			        <span v-else-if="scope.row.status == 1">逾期未还</span>
			        <span v-else="scope.row.status == 2">已归还</span>
			    </template>
		    </el-table-column>
		    <el-table-column label="操作" width="130">
		    	<template scope="scope">
		    		<el-button type="primary" size="small" :disabled="!(scope.row.status == 0 && scope.row.renew == 0)" @click="renew(scope.row.object_id)">续借</el-button>
		    	</template>
		    </el-table-column>
		  </el-table>

	</div>
</template>

<style>
	#myspace-index{
		width:85%;
		margin:0 auto;
	}
	#myspace-index .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#myspace-index .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#myspace-index .title h3{
		float: left;
	}
	#myspace-index .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
	#myspace-index .el-form{
		margin-bottom: 15px;
	}
</style>

<script>
	export default{
		name:'myspace-index',
		data(){
			return {
				user_id:'',
				edit:false,
				form:{
					id:'',
					name:'',
					email:'',
					phone_number:'',
				},
				lendingMsg:[],
				rules: {
			        password: [
			            { required: true, message: '请设置密码', trigger: 'blur' },
			        ],
			    },
			}
		},
		created(){
			this.getUserId();
			this.getUserMsg();
			this.getLendingMsg();
		},
		methods:{
			getUserId(){
				this.user_id = this.$route.params.id;
			},
			getUserMsg(){
				this.$http.get('http://127.0.0.1:3000/admin/c/getUserMsg/'+this.user_id).then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.form.id = response.body[0].id;
					this.form.name = response.body[0].name;
					this.form.password = response.body[0].password;
					this.form.email = response.body[0].email;
					this.form.phone_number = response.body[0].phone_number;
					
				}, (response) => {
					this.$message({
			          message: 'fail in getting user msg!',
			          type: 'error'
			        });
				});
			},
			getLendingMsg(){
				this.$http.get('http://127.0.0.1:3000/admin/c/getLendingMsg/'+this.user_id).then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'lendingMsg',response.body);
					for(var i=0;i<this.lendingMsg.length;i++){
						if(this.lendingMsg[i].return_time !== null){
							var o_return_time = this.lendingMsg[i].return_time;
							var new_return_time = window.moment(o_return_time).format("YYYY-MM-DD HH:mm:ss");
							this.lendingMsg[i].return_time = new_return_time;
						}					
					}
					
				}, (response) => {
					this.$message({
			          message: 'fail in getting lenging msg!',
			          type: 'error'
			        });
				});
			},
			goback(){
		    	this.$router.go(-1);
		    },
		    toggleEdit(){
		    	this.edit = !this.edit;
		    },
		    editUser(){
		    	this.$refs['myspace'].validate((valid) => {
		          if (valid) {
			        this.$http.post('http://127.0.0.1:3000/admin/c/updateUserMsg',{id:this.form.id,name:this.form.name,password:this.form.password,email:this.form.email,phone_number:this.form.phone_number}).then((response) => {
						this.$message({
				          message: response.body.msg,
				          type: 'success'
				        });
					}, (response) => {
						this.$message({
				          message:'fail in updating user msg!',
				          type: 'error'
				        });
					});
		          } else {
		            this.$message({
			          message:'请按规则填写',
			          type: 'warning'
			        });
		            return false;
		          }
		        });
		    	
		    },
		    //续借物件
		    renew(id){
		    	this.$http.post('http://127.0.0.1:3000/admin/c/renew',{id:id}).then((response)=>{
		    		this.$message({
			          message:response.body.msg,
			          type: 'error'
			        });
		    		this.getLendingMsg()
		    	},(response)=>{
		    		alert('fail in renewing!');
		    		this.$message({
			          message:'fail in renewing!',
			          type: 'error'
			        });
		    	})
		    },
		    
		}
	}

</script>