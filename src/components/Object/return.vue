<template>
	<div id="object-return">
		<div class="title">
			<h3>归还信息填写</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<el-form ref="return" :rules="rules" :model="form" label-width="80px">
			<el-form-item label="物件ID" prop="id">
			    <el-input  type="textarea" v-model="form.ids"></el-input>
			</el-form-item>
			
		  <!-- ... 显示物件信息 ... -->
		  	<el-form-item>
		    	<el-button type="primary" @click="returnObject()">确定归还</el-button>
		    	<el-button @click="goback">取消</el-button>
		  	</el-form-item>
		</el-form>
	</div>
</template>

<style>
	#object-return{
		width:85%;
		margin:0 auto;
	}
	#object-return .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#object-return .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#object-return .title h3{
		float: left;
	}
	#object-return .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default{
		name:'object-return',
		data(){
			return {
				form:{
					ids:'',
				},
				returnIds:[],
				rules: {
			        id: [
			            { required: true, message: '请输入至少一个物件id', trigger: 'blur' },
			        ],
			    },
			}
		},
		created(){
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
			goback(){
		    	this.$router.go(-1);
		    },
		    getReturnIds(){
		    	this.returnIds = this.form.ids.trim().split(' ');
		    	console.log(this.returnIds);
		    },
		    returnObject(){
		    	this.$refs['return'].validate((valid) => {
		          if (valid) {
			        this.getReturnIds();
			    	this.$http.post('http://127.0.0.1:3000/admin/c/returnObject',{returnIds:this.returnIds}).then((response)=>{
			    		console.log(response.body);	
			    		this.goback();
			    	}, (response) => {
						this.$message({
				          message: 'fail in return objects!',
				          type: 'error'
				        });
					})
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