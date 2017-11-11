<template>
	<div id="class-index">
		<!-- 物件分类列表 -->
		<div class="title">
			<h3>物件分类列表</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<el-table :data="allClassification" border style="width: 100%">
		    <el-table-column prop="name" label="分类名" ></el-table-column>
		    <el-table-column prop="name" label="操作" width="250">
		    	<template scope="scope">
		    		<el-button size="small" @click="showEditClass(scope.row.id,scope.row.name)" >编辑</el-button>
		    		<el-button size="small" type="danger" @click="deleteClass(scope.row.id)">删除</el-button>
		    	</template>
		    </el-table-column>
		 </el-table>
	  	<hr/>

	  	<div v-show="edit" class="edit">
			<p><strong>编辑分类：</strong></p>
			<span>要编辑的分类为：</span><el-tag type="gray">{{editClassName}}</el-tag>
			<el-input v-model="editValue" placeholder="请输入新分类"></el-input>
			<el-button @click="hideEditClass">取消</el-button>
			<el-button type="primary" @click="editClass">确定</el-button>

			<hr/>
		</div>
		
	  	<!-- 添加物件分类操作 -->
		<el-button type="primary" @click="toggleAddPane" v-show="!add">添加物件分类</el-button>
		
		<div v-show="add" class="add">
			<p><strong>添加分类：</strong></p>
			<el-input v-model="addValue" placeholder="请输入新分类"></el-input>
			<el-button @click="toggleAddPane" v-show="add">取消</el-button>
			<el-button type="primary" @click="addClass" v-show="add">确定</el-button>
		</div>
	</div>
</template>

<style>
	#class-index{
		width:85%;
		margin:0 auto;
	}
	#class-index .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#class-index .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#class-index .title h3{
		float: left;
	}
	#class-index .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
	#class-index .edit input[type='text'],#class-index .add input[type='text']{
		margin-bottom: 10px;
	}
</style>

<script>
	export default{
		name:'class-index',
		data(){
			return {
				allClassification:[],
				add:false,
				addValue:'',
				edit:false,
				editClassId:'',		//要编辑的分类id
				editClassName:'',	//要编辑的分类名
				editValue:'',	//要编辑的分类名的新值
			}
		},
		created(){
			this.getAllClassification();
		},
		methods:{
			/*获取所有物件项分类*/
		    getAllClassification () {
				this.$http.get('http://127.0.0.1:3000/home/c/getAllClassification').then((response) => {
					this.$set(this,'allClassification', response.body);
				}, (response) => {
					this.$message({
			          message: 'fail in getting item classification',
			          type: 'error'
			        });
				});
		    },

		    toggleAddPane(){
		    	this.add = !this.add;
		    },

		    addClass(){
		    	this.$http.post('http://127.0.0.1:3000/admin/c/addClassification',{name:this.addValue}).then((response) => {
					if(response.body.code == -1){
						// alert(response.body.msg)
						this.$message({
				          message:response.body.msg,
				          type: 'warning'
				        });
					}else{
						var newClass = {};
						newClass.id = response.body.insertId;
						newClass.name = this.addValue;
						this.allClassification.push(newClass);
						this.addValue = '';
						this.$message({
				          message:'添加成功',
				          type: 'success'
				        });
					}
				}, (response) => {
					this.$message({
			          message:'fail in adding classification!',
			          type: 'error'
			        });
				});
		    },
		    deleteClass(id){
		    	this.$http.post('http://127.0.0.1:3000/admin/c/deleteClassification/'+id).then((response) => {
					if(response.body.code == -1){
						this.$message({
				          message:response.body.msg,
				          type: 'warning'
				        });
					}else{
						this.$message({
				          message:'删除成功！',
				          type: 'success'
				        });
						this.getAllClassification();
					}
					
				}, (response) => {
					this.$message({
			          message:'fail in deleting classification!',
			          type: 'error'
			        });
				});
		    },
		    showEditClass(id,name){
		    	this.edit = true;
		    	this.editClassId = id;
		    	this.editClassName = name;
		    },
		    hideEditClass(){
		    	this.editValue='';
		    	this.edit = false;
		    },
		    editClass(){
		    	this.$http.post('http://127.0.0.1:3000/admin/c/updateClassification/'+this.editClassId,{name:this.editValue}).then((response) => {
					console.log(response.body);
					this.getAllClassification();
				}, (response) => {
					this.$message({
			          message:'fail in editing classification!',
			          type: 'error'
			        });
				});
		    },
		    goback(){
		    	this.$router.go(-1);
		    },
		},
	}
</script>