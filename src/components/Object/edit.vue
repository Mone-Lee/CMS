<template>
	<div id="object-edit">
		<div class="title">
			<h3>编辑资产</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
		</div>
		<!-- {{objectId}} -->
		<el-form ref="object" :model="object" label-width="80px">
			<el-form-item label="物件ID">
			    <el-input v-model="object.id" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="物件名称">
				<span>当前所属物件名为：</span><el-tag type="gray">{{oldObjectName}}</el-tag>
				<el-select v-model="selectedItemID" placeholder="请选择物件名" @change="getItemMsg()">
				  <el-option v-for="option in itemList" :label="option.name" :value="option.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="物件简介">
			    <el-input type="textarea" v-model="object.abstract" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="物件详情">
			    <el-input type="textarea" v-model="object.content" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="物件所属分类">
			    <el-input v-model="object.object_classification_name" :disabled="true"></el-input>
			</el-form-item>
			<!-- ... 显示物件信息 ... -->

			<el-form-item>
			<el-button type="primary" @click="editObject()">保存</el-button>
			<el-button @click="goback()">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style>
	#object-edit{
		width:85%;
		margin:20px auto;
	}
	#object-edit .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#object-edit .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#object-edit .title h3{
		float: left;
	}
	#object-edit .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>

<script>
	export default{
		name:'object-edit',
		data(){
			return {
				objectId:'',
				itemList:[],
				oldObjectName:'',
				object:{
					id:'',
					name:'',
					classId:'',
					className:'',
					abstract:'',
					content:'',
					status:'',
					object_classification_name:'',
				},
				selectedItemID:'',	//选择的新的item_id
			}
		},
		created(){
			this.getObjectId();
			this.getItemList();
			this.getObjectMsg();
		},
		methods:{
			getObjectId(){
				this.objectId = this.$route.params.id;
			},
			getItemList(){
	    		this.$http.get('http://127.0.0.1:3000/home/c/getItemList').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'itemList',response.body);
					
				}, (response) => {
					this.$message({
			          message: 'fail in getting item!',
			          type: 'warning'
			        });
				});
	    	},
			getObjectMsg(){
				this.$http.get('http://127.0.0.1:3000/admin/c/getObjectMsg/'+this.objectId).then((response)=>{
		    		// console.log(response.body);
		    		this.object.id = response.body[0].id;
					this.object.name = response.body[0].name;
					this.object.classId = response.body[0].classId;
					this.object.className = response.body[0].className;
					this.object.abstract = response.body[0].abstract;
					this.object.content = response.body[0].content;
					this.object.status = response.body[0].status;
					this.object.object_classification_name = response.body[0].object_classification_name;

					this.oldObjectName = response.body[0].name;
					
		    	}, (response) => {
					this.$message({
			          message: 'fail in getting object msg!',
			          type: 'warning'
			        });
				})
			},
			getItemMsg(){
		    	for(var i=0;i<this.itemList.length;i++){
		    		if(this.itemList[i].id === this.selectedItemID){
				      	this.object.abstract= this.itemList[i].abstract;
				      	this.object.content=this. itemList[i].content;
				      	this.object.object_classification_name= this.itemList[i].object_classification_name;
		    		}
		    	}
		    },
			editObject(){
				this.$http.post('http://127.0.0.1:3000/admin/c/editObject/'+this.objectId,{item_id:this.selectedItemID}).then((response)=>{
		    		console.log(response.body);	
		    		this.goback();
		    	}, (response) => {
					this.$message({
			          message: 'fail in editing object!',
			          type: 'warning'
			        });
				})
			},

			goback(){
		    	this.$router.go(-1);
		    },
		},
	}

</script>