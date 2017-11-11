<template>
	<div id="index">
		<el-menu class="el-menu-demo" mode="horizontal" >
		  <el-menu-item index="1"><router-link to="index">现有资产查询</router-link></el-menu-item>
		  <el-menu-item index="2"><router-link to="mypace">个人空间</router-link></el-menu-item>
		</el-menu>

		<div class="item-list">
			<p><strong>实验室现有资产列表</strong></p>
			<searchBar :keyword="keyword" v-on:change-search="queryItem"></searchBar>
			<div class="selecter">
				<span>按分类筛选:</span>
				<selector :options="allClassification" :selectID="selectID" v-on:select-item="selectItem"></selector>
			</div>
			<el-table class="allItem" :data="allItem" border style="width: 100%">
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column prop="name" label="物件名" width="100"></el-table-column>
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
	#index{
		width:85%;
		margin:0 auto;
	}
	#index .item-list{
		margin:20px auto;
	}
	#index .item-list p{
		float: left;
	}

	#index .item-list .searchBar{
		margin-left: 60px;
    	float: left;
	}
	#index .item-list .selecter{
		float: right;
	}
</style>

<script>
	import searchBar from '../../components/public/searchbar.vue';
	import selector from '../../components/public/selector.vue';

	export default{
		name:'item-list',
		data(){
			return{
				allItem:[],	
				keyword:'',	//搜索关键字
				allClassification:[],
				selectID:'',
			}
		},
		mounted(){
			this.getAllItem();
			this.getAllClassification();
		},
		components:{
			searchBar,
			selector,
		},

		methods:{
			//获取所有物件项信息
		    getAllItem () {
				this.$http.get('http://127.0.0.1:3000/home/c/getAllItem').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allItem', response.body);
					
				}, (response) => {
					// 响应错误回调
					alert('fail in getting items!');
				});
		    },

		    //搜索物件项
		    queryItem(keyword){
		    	// alert(keyword);
		    	this.$http.post('http://127.0.0.1:3000/home/c/queryItem',{q:keyword}).then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allItem', response.body);
					
				}, (response) => {
					// 响应错误回调
					alert('fail in quering items!');
				});
		    },

		    //获取所有物件项分类
		    getAllClassification () {
				this.$http.get('http://127.0.0.1:3000/home/c/getAllClassification').then((response) => {
					// 响应成功回调
					console.log(response.body);
					this.$set(this,'allClassification', response.body);
					
				}, (response) => {
					// 响应错误回调
					alert('fail in getting item classification!');
				});
		    },
		    
		    selectItem(selectID) {
				this.$http.get('http://127.0.0.1:3000/home/c/getItemByClassification',{params:{classificationId:selectID}}).then((response)=>{
		    		console.log(response.body);
					this.$set(this,'allItem', response.body);
		    	})
				// alert(selectID);
				// console.log(this.allItem);
				// var selectItem = [];
				// for(var i=0;i<this.allItem.length;i++){
				// 	if(this.allItem[i].object_classification_id === selectID){
				// 		selectItem.push(this.allItem[i]);
				// 	}
				// }

				// this.allItem = selectItem;
			},
		}
	}
</script>