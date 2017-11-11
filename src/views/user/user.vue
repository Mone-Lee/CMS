<template>
	<div>
		<div>this user page</div>
		<!-- <hr/>
		<div>{{user[0]}}</div>
		<hr/>
		<div>{{item[0]}}</div>
		<hr/>
		<div>{{query}}</div>
		<hr/> -->
		<!-- <button @click="deleteUser()">delete user</button> -->
	</div>
</template>


<script>
	export default {
	  data () {
	    // return {
	    //   user:[],
	    //   item:[],
	    //   query:[],
	    // }
	  },
	  created () {
	    // 组件创建完后获取数据，
	    // 此时 data 已经被 observed 了
	    // this.getUserInfo();
	    // this.getAllItem();
	    // this.queryUser();
	  },
	  // watch: {
	  //   // 如果路由有变化，会再次执行该方法
	  //   '$route': 'fetchData'
	  // },
	  methods: {
	    //获取所有用户信息
	  //   getUserInfo () {
			// this.$http.get('http://127.0.0.1:3000/users/queryAll').then((response) => {
			// 	// 响应成功回调
			// 	console.log(response.body);
			// 	this.$set(this,'user', response.body);
				
			// }, (response) => {
			// 	// 响应错误回调
			// 	alert('fail in getting item!');
			// });
	  //   },
	  //   //获取所有资产信息
	  //   getAllItem () {
			// this.$http.get('http://127.0.0.1:3000/home/c/getAllItem').then((response) => {
			// 	// 响应成功回调
			// 	console.log(response.body);
			// 	this.$set(this,'item', response.body);
				
			// }, (response) => {
			// 	// 响应错误回调
			// 	alert('fail in getting userInfo!');
			// });
	  //   },
	  //   //按id查询用户
	  //   queryUser(){
	  //   	// var id = '123323';
	  //   	this.$http.get('http://127.0.0.1:3000/users/query',{params:{id:1}}).then((response)=>{
	  //   		console.log(response.body);
	  //   		this.$set(this,'query', response.body);
	  //   	},(response)=>{
	  //   		alert('fail in query user!');
	  //   	});
	  //   },
	  }
	}

</script>

