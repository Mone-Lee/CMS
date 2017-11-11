<template>
	<div id="user-index">
		<div class="title">
			<h3>用户列表</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<el-table :data="allNormalUserMsg" border style="width: 100%" @selection-change="handleSelectionChange" :default-sort = "{prop: 'id', order: 'ascending'}">
		    <el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="id" label="用户id" width="100" sortable></el-table-column>
		    <el-table-column prop="name" label="用户名" width="90"></el-table-column>
		    <el-table-column prop="email" label="邮箱"></el-table-column>
		    <el-table-column prop="phone_number" label="联系方式" width="130"></el-table-column>
		    <el-table-column prop="created_at" label="创建时间" width="180" sortable></el-table-column>
		    <el-table-column label="操作" width="100">
		    	<template scope="scope">
		    		<el-button size="small" type="danger" @click="deleteUser(scope.row.id,scope.row.active)">删除</el-button>
		    	</template>
		    </el-table-column>
	  	</el-table>
	  	<hr/>

		<el-button type="warning" @click="deleteUserBatch">批量删除</el-button>
		<el-button type="success" @click="goToAdd">添加用户</el-button>
	</div>
</template>

<style>
	#user-index{
		width:85%;
		margin:0 auto;
	}
	#user-index .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#user-index .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#user-index .title h3{
		float: left;
	}
	#user-index .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default{
		name:'user-index',
		data(){
			return {
				add:false,
				allNormalUserMsg:[],
				deleteBatch:[],
			}
		},
		created(){
			this.getAllNormalUserMsg();
		},
		methods:{
			getAllNormalUserMsg(){
				this.$http.get('http://127.0.0.1:3000/admin/c/getAllNormalUserMsg').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allNormalUserMsg', response.body);
					for(var i=0;i<this.allNormalUserMsg.length;i++){
						var o_created_at = this.allNormalUserMsg[i].created_at;
						var new_created_at = window.moment(o_created_at).format("YYYY-MM-DD HH:mm:ss");
						this.allNormalUserMsg[i].created_at = new_created_at;
					}
				}, (response) => {
					this.$message({
			          message:'fail in getting normal user msg!',
			          type: 'error'
			        });
				});
			},
			//删除用户
			deleteUser(id,active){
				if(active == 1){
					this.$message({
			          message:'该用户还有逾期未还的物件，删除请三思',
			          type: 'warning'
			        });
				}else{
					this.$http.post('http://127.0.0.1:3000/admin/c/deleteUser/'+id).then((response) => {
						// 响应成功回调
						console.log(response.body);
					}, (response) => {
						this.$message({
				          message:'fail in deleting user!',
				          type: 'error'
				        });
					});
				}
			},
			handleSelectionChange(val){
				this.deleteBatch = val;
			},
			deleteUserBatch(){
				var unableUser=[];
				for(var i =0;i<this.deleteBatch.length;i++){
					if(this.deleteBatch[i].active == 1){
						unableUser.push(this.deleteBatch[i]);
					}
				}
				if(unableUser.length > 0){
					for(var i =0;i<unableUser.length;i++){
						var msg ='用户'+this.deleteBatch[i].id +' '+ this.deleteBatch[i].name+'有物件未归还，不能删除，请先通知该用户';
						this.$message({
				          message:msg,
				          type: 'warning'
				        });
					}
				}else{
					this.$http.post('http://127.0.0.1:3000/admin/c/deleteUserBatch',{deleteBatch:this.deleteBatch}).then((response) => {
						console.log(response.body);
						this.$message({
				          message:'删除成功',
				          type: 'success'
				        });
						this.getAllNormalUserMsg();
					}, (response) => {
						this.$message({
				          message:'fail in deleting object!',
				          type: 'error'
				        });
					});
				}
			},
			goback(){
		    	this.$router.go(-1);
		    },
		    goToAdd(){
		    	this.$router.push({ path: 'add' });
		    }
		},
	}
</script>