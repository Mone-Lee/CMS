<template>
	<div id="home">
		<headBar></headBar>
		<div class="content-wrapper">
			<sideBar></sideBar>
			<div class="content">
				<!-- <keep-alive> -->
					<router-view></router-view>
				<!-- </keep-alive> -->
			</div>
		</div>
	</div>
</template>
<style>
	html,body,#app,#home,.content-wrapper{
		height:100%;
	}
	.content-wrapper{
		display:-webkit-flex;
		display:flex;
		overflow: hidden;
	}
	#sidebar{
		-webkit-flex:1;
		flex:1;
		margin-top: 20px;
		margin-left: 10px;
	}
	.content{
		-webkit-flex:7;
		flex:7;
		background:#f1f1f1;
		margin: 20px;
		margin-bottom: 0;
	}

</style>
<script>
	import headBar from './components/public/headBar.vue';
	import sideBar from './components/public/sideBar.vue';

	export default{
		name:'Home',

		components:{
			headBar,
			sideBar,
		}
	}
</script>