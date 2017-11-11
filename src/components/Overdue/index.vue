<template>
	<div id="overdue-index">
		<div class="title">
			<h3>逾期项列表</h3>
			<el-button type="success" @click="goback()">返回</el-button>
		</div>
		<el-table :data="allOverdue" border style="width: 100%;margin-bottom: 10px;" @selection-change="handleSelectionChange" :default-sort = "{prop: 'return_time', order: 'ascending'}">
			<el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="id" label="用户id" width="100"></el-table-column>
		    <el-table-column prop="name" label="用户名" width="100"></el-table-column>
		    <el-table-column prop="object_id" label="物件id" width="120"></el-table-column>
		    <el-table-column prop="object_name" label="物件名"></el-table-column>
		    <el-table-column prop="return_time" label="应当归还时间" width="180" sortable></el-table-column>
		    <!-- ... -->
		  </el-table>
	  	<!-- <hr/> -->

	  	<el-button type="primary" @click="showEmail">发送提醒邮件</el-button>
		<el-form ref="email" :rules="rules" :model="form" label-width="100px" v-show="email" class="email">
			<el-form-item label="邮件主题" prop="title">
				<el-input v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item label="邮件主题" prop="content">
				<el-input type="textarea" v-model="form.content"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="sendEmail">发送</el-button>
				<el-button @click="hideEmail">取消</el-button>
			</el-form-item>
		</el-form>
		
	</div>
</template>

<style>
	#overdue-index{
		width:85%;
		margin:0 auto;
	}
	#overdue-index .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#overdue-index .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#overdue-index .title h3{
		float: left;
	}
	#overdue-index .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
	#overdue-index .email{
		margin-top: 10px;
	}

</style>

<script>
	export default{
		name:'overdue-index',
		data(){
			return{
				allOverdue:[],
				selectedUser:[],
				userMails:[],
				email:false,
				form:{
					title:'',
					content:'',
				},
				rules: {
			        title: [
			            { required: true, message: '请输入邮件主题', trigger: 'blur' },
			        ],
			        content: [
			            { required: true, message: '请输入邮件内容', trigger: 'blur' },
			        ],
			    },
			}
		},
		created(){
			this.getAllOverdue();
		},
		methods:{
			getAllOverdue () {
				this.$http.get('http://127.0.0.1:3000/admin/c/getAllOverdue').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allOverdue', response.body);
					for(var i=0;i<this.allOverdue.length;i++){
						if(this.allOverdue[i].return_time !== null){
							var o_return_time = this.allOverdue[i].return_time;
							var new_return_time = window.moment(o_return_time).format("YYYY-MM-DD HH:mm:ss");
							this.allOverdue[i].return_time = new_return_time;
						}					
					}
				}, (response) => {
					this.$message({
			          message: 'fail in getting overdue!',
			          type: 'error'
			        });
				});
		    },
			goback(){
		    	this.$router.go(-1);
		    },
		    handleSelectionChange(val){
		    	this.selectedUser = val;
		    	for(var i=0;i<this.selectedUser.length;i++){
		    		this.userMails.push(this.selectedUser[i].email);
		    	}
		    	console.log(this.userMails);
		    },
		    showEmail(){
		    	this.email = true;
		    },
		    hideEmail(){
		    	this.email = false;
		    },
		    sendEmail(){
		    	this.$refs['email'].validate((valid) => {
		          if (valid) {
			        this.$http.post('http://127.0.0.1:3000/admin/c/sendMail',{receivers:this.userMails,subject:this.form.title,html:this.form.content}).then((response) => {
						this.$message({
				          message: response.body.msg,
				          type: 'success'
				        });
					}, (response) => {
						this.$message({
				          message: 'fail in sending email!',
				          type: 'error'
				        });
					});
		          } else {
		          	this.$message({
			          message: '请按规则填写',
			          type: 'warning'
			        });
		            return false;
		          }
		        });
		    	
		    },
		}
	}
</script>