<template>
	<div id="object-repair">
		<div class="title">
			<h3>送修信息填写</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<el-form ref="repair" :rules="rules" :model="form" label-width="100px">
			<el-form-item label="用户ID" prop="id">
			    <el-input v-model="form.user_id" v-on:blur="getUserId"></el-input>
			</el-form-item>
			<el-form-item label="用户名">
			    <el-input v-model="form.user_name" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="物件ID" prop="ids">
			    <el-input v-model="form.ids"></el-input>
			</el-form-item>
			<el-form-item>
			    <el-button type="primary" @click="repairObject">确定送修</el-button>
			    <el-button @click="goback">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style>
	#object-repair{
		width:85%;
		margin:0 auto;
	}
	#object-repair .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#object-repair .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#object-repair .title h3{
		float: left;
	}
	#object-repair .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default{
		name:'object-repair',
		data(){
			return{
				allAdminUserMsg:[],
				form:{
					user_id:'',
					user_name:'',
					ids:'',
				},
				repairIds:[],
				rules: {
			        id: [
			            { required: true, message: '请输入送修人的id', trigger: 'blur' },
			        ],
			        ids: [
			            { required: true, message: '请输入至少一个物件id', trigger: 'blur' },
			        ],
			    },
			}
		},
		created(){
			this.getAllAdminUserMsg();
		},
		methods:{
			getAllAdminUserMsg(){
				this.$http.get('http://127.0.0.1:3000/admin/c/getAllAdminUserMsg').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allAdminUserMsg', response.body);
				}, (response) => {
					this.$message({
			          message: 'fail in getting user msg!',
			          type: 'error'
			        });
				});
			},
			goback(){
		    	this.$router.go(-1);
		    },
		    getUserId(){
		    	var user_id = this.form.user_id;
		    	var selectedUser =(_.filter(this.allAdminUserMsg, function(item) {
				   return item.id === user_id;
				}));
				if(selectedUser == ''){
					this.$message({
			          message: '不存在该用户，请先注册',
			          type: 'warning'
			        });
				}else if(selectedUser[0].active == 1){
					this.$message({
			          message: '不存在该用户，请先注册',
			          type: 'warning'
			        });
				}else{
					this.form.user_name=selectedUser[0].name;
				}
		    },
		    getRepairIds(){
		    	this.repairIds = this.form.ids.trim().split(' ');
		    	console.log(this.repairIds);
		    },
		    repairObject(){
		    	this.$refs['repair'].validate((valid) => {
		          if (valid) {
			        this.getRepairIds();
			    	this.$http.post('http://127.0.0.1:3000/admin/c/repairObject',{
			    		user_id:this.form.user_id,user_name:this.form.user_name,repairIds:this.repairIds
			    	}).then((response) => {
						// 响应成功回调
						console.log(response.body);
						this.$message({
				          message: '送修成功',
				          type: 'success'
				        });
					}, (response) => {
						this.$message({
				          message: 'fail in repairing objects!',
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
		},
	}

</script>