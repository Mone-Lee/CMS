<template>
	<div id="item-add">
		<div class="title">
			<h3>添加物件</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<p><strong>现有物件</strong></p>
		<el-table class="itemList" :data="itemList" border style="width: 100%">
			<el-table-column label="物件名" width="100"><template scope="scope"><span class="item_name" @click="goToDetail(scope.row.name)">{{ scope.row.name }}</span></template></el-table-column>
			<el-table-column prop="object_classification_name" label="所属分类" width="120"></el-table-column>
			<el-table-column prop="abstract" label="物件简介"></el-table-column>
			<el-table-column label="操作"><template scope="scope"><el-button type="danger" size="small" @click="deleteItem(scope.row.id)">删除</el-button></template></el-table-column>
		</el-table>

		

		<!-- <hr/> -->
		<p><strong>添加物件表格</strong></p>
		<el-form ref="item" :rules="rules" :model="item" label-width="100px">
		  <el-form-item label="物件名称" prop="name">
		    <el-input v-model="item.name"></el-input>
		  </el-form-item>
		  <el-form-item label="物件分类" prop="object_classification_id">
		    <el-select v-model="item.object_classification_id" placeholder="请选择物件分类">
		      <el-option v-for="option in allClassification" :label="option.name" :value="option.id"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="物件简介">
		    <el-input type="textarea" v-model="item.abstract"></el-input>
		  </el-form-item>
		  <el-form-item label="物件详情" prop="content">
		    <el-input type="textarea" v-model="item.content"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="addItem()">保存</el-button>
		    <el-button @click="goback()">取消</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<style>
	#item-add{
		width:85%;
		margin:20px auto;
	}
	#item-add .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#item-add .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#item-add .title h3{
		float: left;
	}
	#item-add .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default {
		name:'item-add',
	    data() {
		    return {
		      	itemList:[],
		        item:{
					name:'',
					abstract:'',
					content:'',
					object_classification_id:'',
					object_classification_name:'',
				},
				allClassification:[],
				selectedList:[],
				rules: {
			        name: [
			            { required: true, message: '请输入物件名称', trigger: 'blur' },
			        ],
			        object_classification_id: [
			            { type:'number',required: true, message: '请选择物件分类', trigger: 'change' },
			        ],
			        content: [
			            { required: true, message: '请填写物件介绍', trigger: 'blur' }
			        ]
			    },
			};
	    },
	    mounted(){
	    	this.getItemList();
	    	this.getAllClassification();
	    },
	    methods: {
	    	getItemList(){
	    		this.$http.get('http://127.0.0.1:3000/home/c/getItemList').then((response) => {
					this.$set(this,'itemList',response.body);					
				}, (response) => {
					this.$message({
			          message: 'fail in getting item!',
			          type: 'error'
			        });
				});
	    	},

	    	deleteItem(id){
	    		this.$http.post('http://127.0.0.1:3000/home/c/deleteItem/'+id).then((response) => {
					if(response.body.code == -1){
						this.$message({
				          message: response.body.msg,
				          type: 'warning'
				        });
					}else{
						this.$message({
				          message: '删除成功',
				          type: 'success'
				        });
						this.getItemList();
					}
				}, (response) => {
					this.$message({
			          message: 'fail in deleting item!',
			          type: 'error'
			        });
				});
	    	},


	    	getAllClassification () {
				this.$http.get('http://127.0.0.1:3000/home/c/getAllClassification').then((response) => {
					this.$set(this,'allClassification', response.body);
				}, (response) => {
					this.$message({
			          message: 'fail in getting item classification!',
			          type: 'error'
			        });
				});
		    },

		    addItem(){
		    	this.$refs['item'].validate((valid) => {
		          if (valid) {
			        this.$http.post('http://127.0.0.1:3000/home/c/addItem',this.item).then((response) => {
						this.getItemList();
					}, (response) => {
						this.$message({
				          message: 'fail in adding item!',
				          type: 'error'
				        });
					});
		          } else {
		          	this.$message({
			          message: '请按规则填写',
			          type: 'error'
			        });
		            return false;
		          }
		        });
		    },

		    /*跳转到物件详情页*/
			goToDetail(name){
				var routeName = 'detail/'+name;
				this.$router.push({ path: routeName });
			},
	    	goback(){
		    	this.$router.go(-1);
		    },


	    },
	}

</script>