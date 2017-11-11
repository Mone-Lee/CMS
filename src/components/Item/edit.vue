<template>
	<div id="item-edit">
		<el-form ref="item" :rules="rules" :model="item" label-width="100px">
		  <el-form-item label="物件名称" prop="name">
		    <el-input v-model="item.name"></el-input>
		  </el-form-item>
		  <el-form-item label="物件分类" prop="object_classification_id">
		  	<span>当前所属分类为：</span><el-tag type="gray">{{item.object_classification_name}}</el-tag>
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
		    <el-button type="primary" @click="editItem()">保存</el-button>
		    <el-button @click="goback()">取消</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<style>
	#item-edit{
		width:85%;
		margin:20px auto;
	}
</style>

<script>
	export default{
		name:'item-edit',
		data(){
			return{
				item_id:'',
				item:{
					name:'',
					abstract:'',
					content:'',
					object_classification_id:'',
					object_classification_name:'',
				},
				allClassification:[],
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
			}
		},

		mounted(){
			this.getItemID();
			this.getItemMsg();
			this.getAllClassification();
		},

		methods:{
			getItemID(){
				this.item_id = this.$route.params.id;
			},
			getItemMsg(){
				this.$http.get('http://127.0.0.1:3000/home/c/getItemMsg/'+this.item_id).then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.item.name = response.body[0].name;
					this.item.abstract = response.body[0].abstract;
					this.item.content = response.body[0].content;
					this.item.object_classification_id = response.body[0].object_classification_id;
					this.item.object_classification_name = response.body[0].object_classification_name;
					
				}, (response) => {
					this.$message({
			          message: 'fail in getting item!',
			          type: 'error'
			        });
				});
			},
		    getAllClassification () {
				this.$http.get('http://127.0.0.1:3000/home/c/getAllClassification').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allClassification', response.body);
					
				}, (response) => {
					this.$message({
			          message: 'fail in getting item classification!',
			          type: 'error'
			        });
				});
		    },

		    editItem(){
		    	this.$refs['item'].validate((valid) => {
		          if (valid) {
			        this.$http.post('http://127.0.0.1:3000/home/c/editItem/'+this.item_id,this.item).then((response) => {
						// 响应成功回调
						console.log(response.body);
						
					}, (response) => {
						this.$message({
				          message: 'fail in getting item!',
				          type: 'error'
				        });
					});
					this.goback();
		          } else {
		            alert('error submit!!');
		            this.$message({
			          message: '请按规则填写',
			          type: 'error'
			        });
		            return false;
		          }
		        });
		    },

		    goback(){
		    	this.$router.go(-1);
		    },

		}
	}

</script>