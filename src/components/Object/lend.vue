<template>
	<div id="object-lend">
		<div class="title">
			<h3>出借信息填写</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<el-form ref="lend" :rules="rules" :model="form" label-width="100px">
			<el-form-item label="用户ID" prop="user_id">
			    <el-input v-model="form.user_id" v-on:blur="getUserId"></el-input>
			</el-form-item>
			<el-form-item label="用户名">
			    <el-input v-model="form.user_name" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="物件ID" prop="ids">
			    <el-input v-model="form.ids"></el-input>
			</el-form-item>
			<el-form-item>
			    <el-button type="primary" @click="lendObject">确定出借</el-button>
			    <el-button @click="goback">取消</el-button>
			</el-form-item>
		</el-form>
		<p style="border:1px solid #ccc;">{{getData}}</p>
	</div>
</template>

<style>
	#object-lend{
		width:85%;
		margin:0 auto;
	}
	#object-lend .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#object-lend .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#object-lend .title h3{
		float: left;
	}
	#object-lend .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default{
		name:'object-lend',
		data(){
			return{
				allNormalUserMsg:[],
				form:{
					user_id:'',
					user_name:'',
					ids:'',
				},
				lendingIds:[],
				rules: {
			        user_id: [
			            { required: true, message: '请输入借入人的id', trigger: 'blur' },
			        ],
			        ids: [
			            { required: true, message: '请输入至少一个物件id', trigger: 'blur' },
			        ],
			    },
			    getData:'',
			}
		},
		created(){
			this.getAllNormalUserMsg();
		},
		mounted(){
			socket.on('new message',function(data){
				console.log(data);
				var int8 = new Int8Array(data);
				var newPortData = '',
					oldPortData ='';
				for(var i = 0 ;i<int8.length;i++){
					newPortData += (int8[i]).toString(2);
				}
				this.form.ids = newPortData;
			})
		},
		computed:{
			portData:function(){
				socket.on('new message',function(data){
					var int8 = new Int8Array(data);
					var newPortData = '',
						oldPortData ='';
					for(var i = 0 ;i<int8.length;i++){
						newPortData += (int8[i]).toString(2);
					}
					// if(!oldPortData && oldPortData !== newPortData){
					// 	console.log(newPortData);
					// 	oldPortData = newPortData;
					// 	return newPortData;
						
					// }
					this.form.ids = newPortData;
					socket.emit('message','get new message')
					return data;
				});
			   	
		// 	   	socket.on('connect', function () {
		// 			socket.on('message', function (data) {
		// 				var int8 = new Int8Array(data);
		// 				alert('add.vue:'+int8);
		// 				alert(data);
		// 				return int8;
		// 			})
		// 		})
			}
		},
		methods:{
			getAllNormalUserMsg(){
				this.$http.get('http://127.0.0.1:3000/admin/c/getAllNormalUserMsg').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allNormalUserMsg', response.body);
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
		    	var selectedUser =(_.filter(this.allNormalUserMsg, function(item) {
				   return item.id === user_id;
				}));
				if(selectedUser == ''){
					this.$message({
			          message: '不存在该用户，请先注册',
			          type: 'warning'
			        });
				}else if(selectedUser[0].active == 1){
					this.$message({
			          message: '该用户有逾期未还物件，请先归还',
			          type: 'warning'
			        });
				}else{
					this.form.user_name=selectedUser[0].name;
				}
		    },
		    getLendingIds(){
		    	this.lendingIds = this.form.ids.trim().split(' ');
		    },
		    lendObject(){
		    	this.$refs['lend'].validate((valid) => {
		          if (valid) {
			        this.getLendingIds();
			    	this.$http.post('http://127.0.0.1:3000/admin/c/lendObject',{
			    		user_id:this.form.user_id,user_name:this.form.user_name,objectIds:this.lendingIds
			    	}).then((response) => {
						// 响应成功回调
						console.log(response.body);
						this.$message({
				          message: '出借成功',
				          type: 'success'
				        });
					}, (response) => {
						this.$message({
				          message: 'fail in lending objects!',
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