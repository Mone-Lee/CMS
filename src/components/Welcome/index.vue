<template>
	<div id="welcome">
		<div class="welcome-content">
			<p>欢迎使用 实验室资产管理系统</p>
		</div>
	</div>
</template>
<style>
	#welcome .welcome-content{
		width:50%;
		height:200px;
		background: #d8d8d8;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		margin:100px auto;
	}
	#welcome .welcome-content p{
		text-align: center;
		font-size: 30px;
		line-height: 200px;
	}

</style>
<script>
	export default{
		name:'welcome',
		created(){
			console.log('user_id:'+this.$store.state.user_id);
			this.updateAllLendingMsg();
		},
		methods:{
			//逾期项管理
		    updateAllLendingMsg(){
		    	this.$http.get('http://127.0.0.1:3000/admin/c/updateAllLendingMsg').then((response)=>{
		    		// this.$set(this,'allOverdueObject',response.body);
		    		console.log('逾期项列表更新成功');
		    	},(response)=>{
		    		alert('逾期项列表更新失败');
		    	})
		    }
		}
		
	}
</script>