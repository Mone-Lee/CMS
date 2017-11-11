<template>
	<div id="object-add">
		<div class="title">
			<h3>新增资产</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<!-- {{portData}} -->
		<el-form ref="object" :rules="rules" :model="form" label-width="100px">
			<el-form-item label="物件ID" prop="object_id">
			    <el-input v-model="form.object_id"></el-input>
			</el-form-item>
			<el-form-item label="物件名称" prop="selectedItemID">
				<el-select v-model="form.selectedItemID" placeholder="请选择物件名" @change="getItemMsg()">
				  <el-option v-for="option in itemList" :label="option.name" :value="option.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="物件简介">
			    <el-input type="textarea" v-model="item.abstract" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="物件详情">
			    <el-input type="textarea" v-model="item.content" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="物件所属分类">
			    <el-input v-model="item.object_classification_name" :disabled="true"></el-input>
			</el-form-item>
			<!-- ... 显示物件信息 ... -->

			<el-form-item>
			<el-button type="primary" @click="addObject()">确定</el-button>
			<el-button @click="goback()">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style>
	#object-add{
		width:85%;
		margin:20px auto;
	}
	#object-add .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#object-add .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#object-add .title h3{
		float: left;
	}
	#object-add .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default{
		name:'object-add',
		data(){
			return {
				itemList:[],
				// object_id:'',
				// selectedItemID:'',
				item:{
					name:'',
					abstract:'',
					content:'',
					object_classification_name:'',
				},
				form:{
					object_id:'',
					selectedItemID:'',
				},
				rules: {
			        object_id: [
			            { required: true, message: '请输入资产id', trigger: 'blur' },
			        ],
			        selectedItemID: [
			            { type:'number',required: true, message: '请选择物件名', trigger: 'change' },
			        ],  
			    },
			}
		},
		created(){
			this.getItemList();
			// socket.on('message',function(data){
			// 	var int8 = new Int8Array(data);
			// 	console.log(int8);
			// 	var newPortData = '',
			// 		oldPortData ='';
			// 	for(var i = 0 ;i<int8.length;i++){
			// 		newPortData += (int8[i]).toString(2);
					
			// 	}
			// 	console.log(newPortData);
			// 	if(!oldPortData || oldPortData !== newPortData){
			// 		this.object_id = newPortData;
			// 		oldPortData = newPortData;
			// 	}
			// });
	
				// });
			// });
				
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
				this.form.object_id = newPortData;
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
					this.form.object_id = newPortData;
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
			getItemList(){
	    		this.$http.get('http://127.0.0.1:3000/home/c/getItemList').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'itemList',response.body);
					
				}, (response) => {
					this.$message({
			          message: 'fail in getting item!',
			          type: 'error'
			        });
				});
	    	},
	    	getItemMsg(){
		    	for(var i=0;i<this.itemList.length;i++){
		    		if(this.itemList[i].id === this.form.selectedItemID){
				      	this.item.abstract= this.itemList[i].abstract;
				      	this.item.content=this. itemList[i].content;
				      	this.item.object_classification_name= this.itemList[i].object_classification_name;
		    		}
		    	}
		    },
	    	addObject(){
	    		this.$refs['object'].validate((valid) => {
		          if (valid) {
			        this.$http.post('http://127.0.0.1:3000/admin/c/addObject',{id:this.form.object_id,item_id:this.form.selectedItemID}).then((response) => {
						// 响应成功回调
						console.log(response.body);
						this.$message({
				          message: '添加成功',
				          type: 'success',
				          duration:1000
				        });
						this.goback();
					}, (response) => {
						this.$message({
				          message: '添加失败',
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
	    	goback(){
		    	this.$router.go(-1);
		    },
		},
	}
</script>