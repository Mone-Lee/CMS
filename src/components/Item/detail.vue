<template>
	<div id="item-detail">
		<div class="title">
			<h3>{{detailItem.item.name}}</h3>
			<el-button type="primary" @click="goback()">返回</el-button>
			<el-button type="success" @click="goToEdit()">编辑</el-button>
		</div>
		<div>
			<span class="label">物件分类：</span><span>{{detailItem.item.object_classification_name}}</span>
		</div>
		<div>
			<span class="label">物件详情：</span>
			<div style="padding-left:30px;margin:10px 0;color:#757575">{{detailItem.item.content}}</div>
		</div>
		
		<div>
			<span class="label">物件资产详情：</span>
			<el-table :data="detailItem.objects" border style="width: 100%">
				<el-table-column prop="id" label="物件ID" width="130"></el-table-column>
		    	<el-table-column prop="name" label="物件名"></el-table-column>
		    	<el-table-column label="状态" width="130">
		    		<template scope="scope"><span v-if="scope.row.status==0">可用</span><span v-else-if="scope.row.status==1">出借中</span><span v-else="scope.row.status==2">送修中</span></template>
		    	</el-table-column>
		    	<el-table-column prop="return_time" label="应当归还时间" width="190"></el-table-column>
		    	<el-table-column prop="finish_time" label="维修结束时间" width="190"></el-table-column>
		  	</el-table>
		</div>

	</div>
</template>

<style>
	#item-detail{
		width:85%;
		margin:0 auto;
	}
	#item-detail .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#item-detail .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#item-detail h3{
		float: left;
	}
	#item-detail .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
	#item-detail .label{
		font-size: 15px;
		font-weight: bold;
		color: #222c3c;
		line-height: 24px;
	}
	#item-detail .el-table{
		margin-top: 10px;
	}
</style>

<script>
	export default{
		name:'item-detail',

		data(){
			return {
				name:'',
				detailItem:{
					item:{
						id:'',
						name:'',
						object_classification_name:'',
						content:'',
					},
					objects:[],
				},
			}
		},

		mounted(){
			this.getItemName();
			this.getItemDetail();
			
		},

		 watch: {
		    // 如果路由有变化，会再次执行该方法
		    '$route': 'getItemDetail'
		  },

		methods:{
			getItemName(){
				this.name = this.$route.params.name;
			},
			getItemDetail(){
		    	this.$http.get('http://127.0.0.1:3000/home/c/getItemDetail/'+this.name).then((response)=>{
		    		// console.log(response.body);
		    		this.detailItem.item.id = response.body.item.id;
					this.detailItem.item.name = response.body.item.name;
					this.detailItem.item.object_classification_name = response.body.item.object_classification_name;
					this.detailItem.item.content = response.body.item.content;
					this.detailItem.objects = response.body.objects;
					for(var i=0;i<this.detailItem.objects.length;i++){
						if(this.detailItem.objects[i].return_time !== null){
							var o_return_time = this.detailItem.objects[i].return_time;
							var new_return_time = window.moment(o_return_time).format("YYYY-MM-DD HH:mm:ss");
							this.detailItem.objects[i].return_time = new_return_time;
						}
						if(this.detailItem.objects[i].finish_time !== null){
							var o_finish_time = this.detailItem.objects[i].finish_time;
							var new_finish_time = window.moment(o_finish_time).format("YYYY-MM-DD HH:mm:ss");
							this.detailItem.objects[i].finish_time = new_finish_time;
						}						
					}
		    	})
		    },

		    goback(){
		    	this.$router.go(-1);
		    },

		    goToEdit(){
		    	this.$router.push({ path: '/item/edit/'+this.detailItem.item.id})
		    }
		}

	}
</script>