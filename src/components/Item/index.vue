<template>
	<div id="item-index">
		<div class="title">
			<h3>实验室现有资产列表</h3>
			<el-button type="primary" @click="goToAdd()" v-show="(user_privilege == 2)">添加物件</el-button>
		</div>
		<div class="filter">
			<searchBar :keyword="keyword" v-on:change-search="queryItem"></searchBar>
			<div class="selector">
				<span>按分类筛选:</span>
				<selector :options="allClassification" :selectID="selectID" v-on:select-item="selectItem"></selector>
			</div>
		</div>
		<div class="item-list">
			<el-table class="allItem" :data="allItem" border style="width: 100%">
				<el-table-column label="物件名" width="100"><template scope="scope"><span class="item_name" @click="goToDetail(scope.row.name)">{{ scope.row.name }}</span></template></el-table-column>
				<el-table-column prop="object_classification_name" label="所属分类" width="120"></el-table-column>
				<el-table-column prop="abstract" label="物件简介"></el-table-column>
				<el-table-column prop="usable" label="可用数" width="80"></el-table-column>
				<el-table-column prop="lend" label="出借数" width="80"></el-table-column>
				<el-table-column prop="repair" label="送修数"width="80"></el-table-column>
			</el-table>
		
		</div>
	</div>
</template>

<style>
	#item-index{
		width:85%;
		margin:0 auto;
	}
	#item-index .title{
		border-bottom: 2px solid #ccc;
		margin-bottom: 10px;
	}
	#item-index .title:after{
		content:'';
		height:0;
		display: block;
		zoom:1;
		clear:both;
	}
	#item-index .title h3{
		float: left;
	}
	#item-index .title .el-button{
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
	#item-index .filter:after{
		content:'';
		height:0;
		display:block;
		zoom:1;
		clear:both;
	}
	#item-index .filter .searchBar{
    	float: left;
	}
	#item-index .filter .selector{
		float: left;
		margin-left: 30px;
		font-size: 15px;
	}
	#item-index .item-list{
		margin:20px auto;
	}
	
	.el-table .cell .item_name{
		color:#20a0ff;
	}
	.el-table .cell .item_name:hover{
		cursor: pointer;
		text-decoration: underline;
	}
</style>

<script>
	import searchBar from '../public/searchbar.vue';
	import selector from '../public/selector.vue';
	import { mapState } from 'vuex';

	export default{
		name:'item-list',
		data(){
			return{
				allItem:[],	
				anotherAllItem:[],
				keyword:'',	//搜索关键字
				allClassification:[],
				selectID:'',
			}
		},
		computed: mapState({
		    // es6 箭头函数更加简洁
		    user_id: state => state.user_id,
		    user_privilege: state => state.user_privilege,
		}),
		created(){
			this.getAllItem();
			this.getAllClassification();
		},
		components:{
			searchBar,
			selector,
		},

		methods:{
			/*获取所有物件项信息*/
		    getAllItem () {
				this.$http.get('http://127.0.0.1:3000/home/c/getAllItem').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allItem', response.body);
					this.$set(this,'anotherAllItem', response.body);
				}, (response) => {
					this.$message({
			          message: 'fail in getting items!',
			          type: 'error'
			        });
				});
		    },

		    /*搜索物件项*/
		    queryItem(keyword){
				if(keyword !== ''){
					var allItem = this.anotherAllItem;
					var filterItem = _.filter(allItem, function(item) {
						// console.log(item.id === keyword);
					   return item.name.indexOf(keyword) >= 0 || item.abstract.indexOf(keyword) >= 0;
					});

					this.allItem = filterItem;
				}else{
					this.allItem = this.anotherAllItem;
				}
				
		    },

		    /*获取所有物件项分类*/
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
		    
		    /*按分类筛选物件项*/
		    selectItem(selectID) {
				if(selectID !== ''){
					var allItem = this.anotherAllItem;
					var filterItem = _.filter(allItem, function(item) {
					   return item.object_classification_id === selectID;
					});

					this.allItem = filterItem;
				}else{
					this.allItem = this.anotherAllItem;
				}
			},

			/*跳转到物件详情页*/
			goToDetail(name){
				var routeName = 'detail/'+name;
				this.$router.push({ path: routeName });
			},

		    goToAdd(){
		    	this.$router.push({ path: 'add' });
		    },
		},
	}
</script>