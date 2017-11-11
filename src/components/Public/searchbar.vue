<template>
	<div class="searchBar">
		<i class="el-input__icon el-icon-search is-clickable"  @click="changeSearch"></i>
		<input type="text" class="el-input__inner" placeholder="请输入搜索内容(宁可输少，不要输错)" v-model="query" v-on:keyup.enter="changeSearch">
	</div>
	

</template>

<style>
	.searchBar{
		width:300px;
		position: relative;
		font-size: 15px;
	}
</style>

<script>
	export default{
		name:'searchBar',

		data(){
			return {
				query:this.keyword,
			}
		},

		props:['keyword'],

		methods:{
			changeSearch(){
				console.log('keyword:'+this.keyword);
				console.log('query:'+this.query);
				this.$emit('change-search',this.query);
			}
		},

	}
</script>
