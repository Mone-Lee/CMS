<template>
	<div id="object-index">
		<div class="title">
			<h3>现有所有资产列表</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>

		<div class="filter">
			<searchBar :keyword="keyword" v-on:change-search="queryObject"></searchBar>
			<div class="selector">
				<span>按分类筛选:</span>
				<selector :options="allClassification" :selectID="selectID" v-on:select-item="selectObject"></selector>
			</div>
		</div>

		<div class="object-list">
			<el-table :data="allObject" border style="width: 100%" @selection-change="handleSelectionChange">
			    <el-table-column type="selection" width="55"></el-table-column>
			    <el-table-column label="ID" width="100">
			      <template scope="scope">{{ scope.row.id }}</template>
			    </el-table-column>
			    <el-table-column prop="object_name" label="资产名" width="100"></el-table-column>
			     <el-table-column prop="abstract" label="简介"></el-table-column>
			    <el-table-column prop="classification_name" label="所属分类"  width="100"></el-table-column>
			    <el-table-column label="状态" width="100">
		    		<template scope="scope"><span v-if="scope.row.status==0">可用</span><span v-else-if="scope.row.status==1">出借中</span><span v-else="scope.row.status==2">送修中</span></template>
		    	</el-table-column>
			    <el-table-column prop="operate" label="操作" width="150">
			    	<template scope="scope">
			    		<el-button size="small" @click="goToEdit(scope.row.id)">编辑</el-button>
			    		<el-button size="small" type="danger" @click="deleteObject(scope.row.id)">删除</el-button>
			    	</template>
			    </el-table-column>
			 </el-table>
		</div>
		<hr/>

		<el-button type="danger" @click="deleteObjectBatch">批量删除</el-button>

		<div class="operate-wrapper" style="margin-top:10px">
			<span class="wrapper">
		    <el-button type="success" @click="goToAdd">添加物件</el-button>
		    <el-button type="warning" @click="goToReturn">归还物件</el-button>
		    <el-button type="info" @click="goToLend">出借物件</el-button>
		    <el-button type="primary" @click="goToRepair">送修物件</el-button>
		  </span>
		</div>

	</div>
</template>

<style>
	#object-index{
		width:85%;
		margin:0 auto;
	}
	#object-index .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#object-index .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#object-index .title h3{
		float: left;
	}
	#object-index .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
	#object-index .filter:after{
		content:'';
		height:0;
		display:block;
		zoom:1;
		clear:both;
	}
	#object-index .filter .searchBar{
    	float: left;
	}
	#object-index .filter .selector{
		float: left;
		margin-left: 30px;
		font-size: 15px;
	}
	#object-index .object-list{
		margin:20px auto;
	}
</style>

<script>
	import searchBar from '../public/searchbar.vue';
	import selector from '../public/selector.vue';

	export default{
		name:'object-index',
		data(){
			return {
				allObject:[],
				anotherAllObject:[],
				keyword:'',	//搜索关键字
				allClassification:[],
				selectID:'',
				deleteBatch:[],
			}
		},
		created(){
			this.getAllObject();
			this.getAllClassification();
		},
		components:{
			searchBar,
			selector,
		},
		methods:{
			getAllObject () {
				this.$http.get('http://127.0.0.1:3000/admin/c/getAllObject').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allObject', response.body);
					this.$set(this,'anotherAllObject',response.body);
				}, (response) => {
					this.$message({
			          message: 'fail in getting objects!',
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
			
			// 搜索框筛选object
			queryObject(keyword){
				if(keyword !== ''){
					var allObject = this.anotherAllObject;
					var filterObject = _.filter(allObject, function(item) {
					   return item.id.indexOf(keyword) >= 0 || item.object_name.indexOf(keyword) >= 0 || item.abstract.indexOf(keyword) >= 0;
					});

					this.allObject = filterObject;
				}else{
					this.allObject = this.anotherAllObject;
				}
			},
			// 按分类筛选object
			selectObject(selectID){
				if(selectID !== ''){
					var allObject = this.anotherAllObject;
					var filterObject = _.filter(allObject, function(item) {
					   return item.object_classification_id === selectID;
					});

					this.allObject = filterObject;
				}else{
					this.allObject = this.anotherAllObject;
				}
			},
			handleSelectionChange(val){
				this.deleteBatch=val;
			},
			
			deleteObject(id){
				this.$http.post('http://127.0.0.1:3000/admin/c/deleteObject/'+id).then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$message({
			          message: '删除成功',
			          type: 'success'
			        });
					this.getAllObject();
				}, (response) => {
					this.$message({
			          message: 'fail in deleting object!',
			          type: 'success'
			        });
				});
			},
			deleteObjectBatch(){
				this.$http.post('http://127.0.0.1:3000/admin/c/deleteObjectBatch',{deleteBatch:this.deleteBatch}).then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$message({
			          message: '删除成功',
			          type: 'success'
			        });
					this.getAllObject();
				}, (response) => {
					this.$message({
			          message: 'fail in deleting object!',
			          type: 'success'
			        });
				});
			},
			goback(){
		    	this.$router.go(-1);
		    },
		    goToEdit(id){
				var routeName = 'edit/'+id;
				this.$router.push({ path: routeName });
			},
		    goToAdd(){
				this.$router.push({ path: 'add' });
			},
			goToLend(){
				this.$router.push({ path: 'lend' });
			},
			goToReturn(){
				this.$router.push({ path: 'return' });
			},
			goToRepair(){
				this.$router.push({ path: 'repair' });
			},
		},
	}
</script>