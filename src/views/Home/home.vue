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
		name:'Welcome',
	}
</script>