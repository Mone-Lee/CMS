<template>
	<div>
		<div>this test page</div>
		<hr/>
		<div>
			<p><strong>普通用户注册</strong></p>
			用户ID：<input type="text" name="id" id="normalid"><br/>
			用户名：<input type="text" name="username" id="normalusername"><br/>
			用户密码：<input type="text" name="password" id="normalpassword"><br/>
			用户邮箱：<input type="email" name="email" id="normalemail"><br/>
			用户联系方式：<input type="text" name="phone_number" id="normalphone_number"><br/>
			<button @click="normalRegister()">普通用户注册</button>
		</div>
		<hr/>
		<div>
			<p><strong>管理员注册</strong></p>
			用户ID：<input type="text" name="id" id="adminid"><br/>
			用户名：<input type="text" name="username" id="adminusername"><br/>
			用户密码：<input type="text" name="password" id="adminpassword"><br/>
			用户邮箱：<input type="email" name="email" id="adminemail"><br/>
			用户联系方式：<input type="text" name="phone_number" id="adminphone_number"><br/>
			<button @click="adminRegister()">管理员注册</button>
		</div>
		<hr/>
		<div>
			<p><strong>用户登录</strong></p>
			用户ID：<input type="text" name="id" id="loginid"><br/>
			用户密码：<input type="text" name="password" id="loginpassword"><br/>
			<input type="radio" name="privilege_id" value="1">普通用户<br/>
			<input type="radio" name="privilege_id" value="2">管理员<br/>
			<button @click="login()">提交</button>
		</div>
		<hr/>
		<!-- 获取所有物件项信息 -->
		<div>
			<p><strong>获取所有物件项信息</strong></p>
			<table class="allItem" border="1">
				<tr><td>物件名</td><td>物件分类</td><td>物件简介</td><td>可用数</td><td>已出借数</td><td>送修数</td></tr>
				<tr v-for="obj in allItem"><td>{{obj.name}}</td><td>{{obj.object_classification_name}}</td><td>{{obj.abstract}}</td><td>{{obj.usable}}</td><td>{{obj.lend}}</td><td>{{obj.repair}}</td></tr>
			</table>
		</div>
		<hr/>
		<!-- 获取所有物件分类 -->
		<div>
			<p><strong>获取所有物件分类</strong></p>
			<table class="AllClassification" border="1">
				<tr><td>分类id</td><td>分类名称</td></tr>
				<tr v-for="obj in allClassification"><td>{{obj.id}}</td><td>{{obj.name}}</td></tr>
			</table>
		</div>
		<hr/>
		<!-- 按分类获取所有物件项信息 -->
		<div>
			<p><strong>按分类获取所有物件项信息</strong></p>
			<ul>
				<li v-for="obj in allItemClassification">
					<button @click="getItemByClassification(obj.id)">{{obj.name}}</button>
				</li>
			</ul>
			<table class="classifiedItem" border="1">
				<tr><td>物件名</td><td>物件分类</td><td>物件简介</td><td>可用数</td><td>已出借数</td><td>送修数</td></tr>
				<tr v-for="obj in classifiedItem"><td>{{obj.name}}</td><td>{{obj.object_classification_name}}</td><td>{{obj.abstract}}</td><td>{{obj.usable}}</td><td>{{obj.lend}}</td><td>{{obj.repair}}</td></tr>
			</table>
		</div>
		<hr/>
		<!-- 搜索物件项 -->
		<div>
			<p><strong>搜索物件项</strong></p>
			<input type="text" name="queryItem" id="queryItem">
			<button @click="getItemBySearch()">查询</button>
			<table class="classifiedItem" border="1">
				<tr><td>物件名</td><td>物件分类</td><td>物件简介</td><td>可用数</td><td>已出借数</td><td>送修数</td></tr>
				<tr v-for="obj in queryItem"><td>{{obj.name}}</td><td>{{obj.object_classification_name}}</td><td>{{obj.abstract}}</td><td>{{obj.usable}}</td><td>{{obj.lend}}</td><td>{{obj.repair}}</td></tr>
			</table>
		</div>
		<hr/>
		<!-- 按物件名获取所有物件 -->
		<div>
			<p><strong>按物件名获取所有物件</strong></p>
			<ul>
				<li v-for="obj in allItem">
					<button @click="getItemDetail(obj.name)">{{obj.name}}</button>
				</li>
			</ul>
			<div>
				<!-- <p>物件名：{{detailItem.item.name}}</p>
				<p>所属分类：{{detailItem.item.object_classification_name}}</p>
				<p>物件详情：{{detailItem.item.content}}</p> -->
				<table class="detailItem" border="1">
					<tr><td>物件ID</td><td>物件名</td><td>当前状态</td><td>应当归还时间</td></tr>
					<tr v-for="obj in detailItem.objects"><td>{{obj.id}}</td><td>{{obj.name}}</td><td v-if="obj.status == 0">可用</td><td v-else-if="obj.status == 1">出借中</td><td v-if="obj.status == 2">送修中</td><td>{{obj.return_time}}</td></tr>
				</table>
			</div>
		</div>
		<hr/>
		<div>
			<div>
				<p><strong>获取用户个人信息 && 获取用户的借还信息</strong></p>
				<button v-for="user in user" @click="getPersonalUserMsg(user.id)">{{user.name}}</button>
			</div>
			<div>
				<p>用户个人信息</p>
				<div>{{userMsg}}</div>
			</div>
			<div>
				<p>用户借还信息</p>
				<!-- <div>{{lendingMsg}}</div> -->
				<table class="lendingMsg" border="1">
					<tr><td>用户ID</td><td>物件ID</td><td>物件名</td><td>状态</td><td>已续借过</td><td>应当归还的时间</td><td>续借</td></tr>
					<tr v-for="obj in lendingMsg"><td>{{obj.user_id}}</td><td>{{obj.object_id}}</td><td>{{obj.name}}</td><td v-if="obj.status == 0">有效期中</td><td v-else-if="obj.status == 1">过期未还</td><td v-if="obj.status == 2">已归还</td><td>{{obj.renew == 0 ? '否':'是'}}</td><td>{{obj.return_time}}</td><td><button @click="renew(obj.object_id)">续借</button></td>
					</tr>
				</table>
			</div>
		</div>
		<hr/>
		<div>
			<p><strong>更改个人信息</strong></p>
			<!-- 用户名：<input type="text" name="username" id="updateusername" v-model="userMsg[0].name"><br/>
			用户密码：<input type="text" name="password" id="updatepassword" v-model="userMsg[0].password"><br/>
			用户邮箱：<input type="email" name="email" id="updateemail" v-model="userMsg[0].email"><br/>
			用户联系方式：<input type="text" name="phone_number" id="updatephone_number" v-model="userMsg[0].phone_number"><br/> -->
			<button @click="updateUserMsg()">更新个人信息</button>
		</div>
		<hr/>
		<div>
			<p><strong>获取所有用户信息</strong></p>
			<!-- {{allUserMsg}} -->
			<table class="allUserMsg" border="1">
				<tr><td>用户ID</td><td>用户名</td><td>email</td><td>phone</td><td>当前状态</td><td>冻结</td><td>解冻</td></tr>
				<tr v-for="obj in allUserMsg"><td>{{obj.id}}</td><td>{{obj.name}}</td><td>{{obj.email}}</td><td>{{obj.phone_number}}</td><td>{{obj.active == 0 ? '正常':'被冻结'}}</td><td><button @click="freeze(obj.id)">冻结</button></td><td><button @click="unfreeze(obj.id)">解冻</button></td>
				</tr>
			</table>
		</div>
		<hr/>
		<div>
			<p><strong>获取所有借还信息并更新过期信息、冻结过期用户</strong></p>
			{{allLendingMsg}}
		</div>
		<hr/>
		<!-- 物件分类管理 -->
		<div>
			<p><strong>物件分类管理</strong></p>
			<table class="allClassification" border="1">
				<tr><td>分类ID</td><td>分类名</td><td>编辑</td><td>删除</td></tr>
				<tr v-for="obj in allClassification"><td>{{obj.id}}</td><td>{{obj.name}}</td><td><button @click="updateClassification(obj.id)">编辑</button></td><td><button @click="deleteClassification(obj.id)">删除</button></td>
				</tr>
			</table>
			<br/>
			<input type="text" name="classification_name" id="add_classification_name">
			<button @click="addClassification()">新增分类</button>
			<br/><br/>
			编辑框：<input type="text" name="classification_name" id="update_classification_name">
		</div>
		<hr/>
		<!-- item管理 -->
		<div>
			<p><strong>item管理</strong></p>
			<table class="allItemForObject" border="1">
					<tr><td>物件ID</td><td>物件名</td><td>物件简介</td><td>物件详情</td><td>分类名</td></tr>
					<tr v-for="obj in allItemForObject"><td>{{obj.id}}</td><td>{{obj.name}}</td><td>{{obj.abstract}}</td><td>{{obj.content}}</td><td>{{obj.object_classification_name}}</td><!-- <td><button @click="deleteObject(obj.id)">删除</button></td> -->
					</tr>
				</table>
			<div class="newItem" v-show="!newItem">
				<span>名称：</span><input type="text" name="newItemName" id="newItemName"><br/><br/>
				<span>简介：</span><input type="text" name="newItemAbstract" id="newItemAbstract"><br/><br/>
				<span>详情:</span><textarea id="newItemContent"></textarea> <br/><br/>
				<span>分类：</span><select v-model="selectedClass">
					<option v-for="obj in allClassification" :value="obj.id">{{obj.name}}</option>
				</select>
				<br/>
				<br/>
				<button @click="addItem()">确定添加item</button>
			</div>
		</div>
		<hr/>
		<div>
			<p><strong>资产管理</strong></p>
			<table class="allObject" border="1">
				<tr><td>物件ID</td><td>物件名</td><td>物件简介</td><td>物件分类</td><td>物件状态</td><td>删除</td><td>出借</td></tr>
				<tr v-for="obj in allObject"><td>{{obj.id}}</td><td>{{obj.object_name}}</td><td>{{obj.abstract}}</td><td>{{obj.classification_name}}</td><td v-if="obj.status == 0">可用</td><td v-else-if="obj.status == 1">出借中</td><td v-if="obj.status == 2">送修中</td><td><button @click="deleteObject(obj.id)">删除</button></td><td><button @click="toggleLendingObject(obj.id)">出借</button></td>
				</tr>
			</table>
			<br/>
			<!-- <button @click="toggleAddObject()" v-show="!addObjectTable">增加物件</button>
			<button @click="toggleAddObject()" v-show="addObjectTable">取消</button> -->
			<div class="addObject" v-show="!addObjectTable">
				<span>物件ID：</span><input type="text" name="object_id" id="object_id"><br/>
				<span>物件名：</span>
				<select v-model="selectedID" @change="getItemMsg()">
					<option v-for="obj in allItemForObject" :value="obj.id">{{obj.name}}</option>
				</select>

				<br/>
				<!-- {{selectedItemMsg}} -->
				<br/>
				<div style="border:1px solid #ccc">
					<p>选择的item信息</p>
					<span>物件简介：</span><input type="text" name="abstract" v-model="selectedItemMsg.abstract"><br/><br/>
					<span>物件详情：</span><input type="text" name="content" v-model="selectedItemMsg.content"><br/><br/>
					<span>物件分类：</span><input type="text" name="object_classification_name" v-model="selectedItemMsg.object_classification_name">
					<br/>
					<br/>
					<button @click="addObject()">确定添加物件</button>
				</div>
				<br/>
				<!-- <div style="border:1px solid #ccc" v-show="!lendingObject">
					<p>出借信息填写表</p>
					<span>申请人ID：</span><input type="text" name="lending_user_id" id="lending_user_id"><br/><br/>
					<span>申请人姓名：</span><input type="text" name="lending_user_name" id="lending_user_name"><br/><br/>
					<span>申请物件ID：</span><input type="text" name="lending_object_id" id="lending_object_id">
					<br/>
					<br/>
					<button @click="addObject()">确定添加物件</button>
				</div>
				<br/> -->
			</div>
			<hr/>
			<!-- <button @click="toggleNewItem()" v-show="!newItem">新增物件信息</button><br/>
			<button @click="toggleNewItem()" v-show="newItem">取消新增物件信息</button><br/> -->
		</div>
		<hr/>
		<div>
			<p><strong>逾期项管理</strong></p>
			<!-- {{allOverdueObject}} -->
			<table  class="allOverdueObject" border="1">
				<tr><td>逾期项ID</td><td>user ID</td><td>user name</td><td>object ID</td><td>obejct name</td><td>应当归还时间</td></tr>
				<tr v-for="obj in allOverdueObject"><td>{{obj.id}}</td><td>{{obj.user_id}}</td><td>{{obj.user_name}}</td><td>{{obj.object_id}}</td><td>{{obj.obejct_name}}</td><td>{{obj.return_time}}</td></tr>
			</table>
		</div>
		<hr/>
		<hr/>
		<hr/>
		<strong style="color:red">还差：批量删除object；修改item的属性；删除item（提示先把Object删除）；object修改所属item；出借object；归还object；送修object；删除逾期项；批量删除逾期项；搜索逾期项；通知相关</strong>
	</div>
</template>


<script>
	export default {
	  data () {
	    return {
	      allItem:[],
	      // allItemClassification:[],
	      classifiedItem:[],
	      queryItem:[],
	      detailItem:[],
	      user:[],
	      userMsg:[],
	      lendingMsg:[],
	      allUserMsg:[],
	      allLendingMsg:[],
	      allClassification:[],
	      allObject:[],

	      addObjectTable:false,
	      allItemForObject:[],
	      selectedID:'',
	      selectedItemMsg:{
	      	id:'',
	      	name:'',
	      	abstract:'',
	      	content:'',
	      	object_classification_id:'',
	      	object_classification_name:'',
	      },
	      selectedClass:'',
	      newItem:false,
	      lendingObject:false,



	      allOverdueObject:[],

	      visible: false
	    }
	  },
	  created () {
	    // 组件创建完后获取数据，
	    // 此时 data 已经被 observed 了
	    
	    this.getAllItem();
	    this.getAllClassification();
	    this.getUserInfo();
	    this.getUserMsg(123321);
	    this.getAllUserMsg();
	    this.updateAllLendingMsg();
	    this.getAllObject();
	    this.getAllItemForObject();
	    this.getAllOverdueObject();
	   
	  },
	  // watch: {
	  //   // 如果路由有变化，会再次执行该方法
	  //   '$route': 'fetchData'
	  // },
	  methods: {
	  	//普通用户注册
	    normalRegister:function(){
	    	var normalUser={};
	    	normalUser.id = document.getElementById('normalid').value;
	    	normalUser.name = document.getElementById('normalusername').value;
	    	normalUser.password = document.getElementById('normalpassword').value;
	    	normalUser.email = document.getElementById('normalemail').value;
	    	normalUser.phone_number = document.getElementById('normalphone_number').value;
	    	this.$http.post('http://127.0.0.1:3000/home/normalRegister',normalUser).then((response)=>{
	    		console.log(response.body.msg);
	    	},(response)=>{
	    		console.log('register unsuccessfully!');
	    	})
	    },
	     //管理员注册
	    adminRegister:function(){
	    	var adminUser={};
	    	adminUser.id = document.getElementById('adminid').value;
	    	adminUser.name = document.getElementById('adminusername').value;
	    	adminUser.password = document.getElementById('adminpassword').value;
	    	adminUser.email = document.getElementById('adminemail').value;
	    	adminUser.phone_number = document.getElementById('adminphone_number').value;
	    	this.$http.post('http://127.0.0.1:3000/home/adminRegister',adminUser).then((response)=>{
	    		console.log(response.body.msg);
	    	},(response)=>{
	    		console.log('register unsuccessfully!');
	    	})
	    },
	    //用户登录
	    login:function(){
	    	var id = document.getElementById('loginid').value;
	    	var password = document.getElementById('loginpassword').value;
	    	var privilege_id;

	    	var obj = document.getElementsByName("privilege_id");
	    	for(let i = 0;i<obj.length;i++){
	    		if(obj[i].checked){
	    			privilege_id = obj[i].value;
	    		}
	    	}
	    	this.$http.post('http://127.0.0.1:3000/home/login',{id:id,password:password,privilege_id:privilege_id,}).then((response)=>{
	    		console.log(response.body.msg);
	    	},(response)=>{
	    		console.log('登陆失败！');
	    	})
	    },
	    

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
	    //获取所有物件分类
	    getAllClassification () {
			this.$http.get('http://127.0.0.1:3000/home/c/getAllClassification').then((response) => {
				// 响应成功回调
				console.log(response.body);
				this.$set(this,'allClassification', response.body);
				
			}, (response) => {
				// 响应错误回调
				alert('fail in getting userInfo!');
			});
	    },
	    //按分类获取所有物件项信息
	    getItemByClassification(id){
	    	this.$http.get('http://127.0.0.1:3000/home/c/getItemByClassification',{params:{classificationId:id}}).then((response)=>{
	    		console.log(response.body);
				this.$set(this,'classifiedItem', response.body);
	    	})
	    },
	    //搜索物件项
	    getItemBySearch(){
	    	var queryItem = document.getElementById('queryItem').value;
	    	this.$http.get('http://127.0.0.1:3000/home/c/queryItem',{params:{q:queryItem}}).then((response)=>{
	    		console.log(response.body);
				this.$set(this,'queryItem', response.body);
	    	})
	    },
	    //按物件名获取所有物件
	    getItemDetail(name){
	    	this.$http.get('http://127.0.0.1:3000/home/c/getItemDetail/'+name).then((response)=>{
	    		console.log(response.body);
				this.$set(this,'detailItem', response.body);
	    	})
	    },
	    //获取所有用户信息
	    getUserInfo () {
			this.$http.get('http://127.0.0.1:3000/users/queryAll').then((response) => {
				// 响应成功回调
				console.log(response.body);
				this.$set(this,'user', response.body);
				
			}, (response) => {
				// 响应错误回调
				alert('fail in getting item!');
			});
	    },
	    //获取用户个人信息
	    getUserMsg(userId){
	    	this.$http.get('http://127.0.0.1:3000/admin/c/getUserMsg/'+userId).then((response)=>{
	    		console.log(response.body);
				this.$set(this,'userMsg', response.body);
	    	},(response)=>{
	    		// 响应错误回调
				alert('fail in getting user message!');
	    	})
	    },
	    //获取用户的借还信息
	    getLendingMsg(userId){
	    	this.$http.get('http://127.0.0.1:3000/admin/c/getLendingMsg/'+userId).then((response)=>{
	    		console.log(response.body);
				this.$set(this,'lendingMsg', response.body);
	    	},(response)=>{
	    		// 响应错误回调
				alert('fail in getting lending message!');
	    	})
	    },
	    getPersonalUserMsg(userId){
	    	this.getUserMsg(userId);
	    	this.getLendingMsg(userId);
	    },
	    //续借物件
	    renew(objectId){
	    	this.$http.post('http://127.0.0.1:3000/admin/c/renew',{objectId:objectId}).then((response)=>{
	    		console.log(response.body.msg);
	    	},(response)=>{
	    		alert('fail in renewing!');
	    	})
	    },
	    //更改个人信息
	    updateUserMsg(){
	    	// alert(this.userMsg.id);
	    	var updateUser={};
	    	updateUser.id = '123321';
	    	updateUser.name = document.getElementById('updateusername').value;
	    	updateUser.password = document.getElementById('updatepassword').value;
	    	updateUser.email = document.getElementById('updateemail').value;
	    	updateUser.phone_number = document.getElementById('updatephone_number').value;
	    	
	    	this.$http.post('http://127.0.0.1:3000/admin/c/updateUserMsg',updateUser).then((response)=>{
	    		console.log(response.body.msg);
	    	},(response)=>{
	    		alert('fail in updating user message!');
	    	})
	    },


	    //获取所有用户信息
	    getAllUserMsg(){
	    	this.$http.get('http://127.0.0.1:3000/admin/c/getAllUserMsg').then((response)=>{
	    		this.$set(this,'allUserMsg',response.body);
	    	},(response)=>{
	    		alert('fail in getting all user message!')
	    	})
	    },
	    //获取所有借还信息并更新过期信息、冻结过期用户(lending,overdue,freeze)
	    updateAllLendingMsg(){
	    	this.$http.get('http://127.0.0.1:3000/admin/c/updateAllLendingMsg').then((response)=>{
	    		this.$set(this,'allLendingMsg',response.body);
	    	},(response)=>{
	    		alert('fail in getting all user message!')
	    	})
	    },


	    //分类管理
	    //新增物件分类
	    addClassification(){
	    	var classification_name = document.getElementById('add_classification_name').value;
	    	this.$http.post('http://127.0.0.1:3000/admin/c/addClassification',{classification_name:classification_name}).then((response)=>{
	    		
	    		var newClassification = {id:response.body.insertId,name:classification_name}
	    		this.allClassification.push(newClassification);
	    	},(response)=>{
	    		alert('fail in adding classification!')
	    	})
	    },
	    //修改分类名称
	    updateClassification(id){
	    	var id = id;
	    	var name = document.getElementById('update_classification_name').value;
	    	this.$http.post('http://127.0.0.1:3000/admin/c/updateClassification',{classification_id:id,classification_name:name}).then((response)=>{
	    		this.$set(this,'addClassification',response.body);
	    	},(response)=>{
	    		alert('fail in adding classification!')
	    	})
	    },
	    //删除物件分类
	    deleteClassification(id){
	    	this.$http.post('http://127.0.0.1:3000/admin/c/deleteClassification/'+id).then((response)=>{
	    		console.log(response.body);
	    	},(response)=>{
	    		alert('fail in deleting classification!')
	    	})
	    },


		//资产管理
		//获取所有物件信息
		getAllObject(){
	    	this.$http.get('http://127.0.0.1:3000/admin/c/getAllObject').then((response)=>{
	    		this.$set(this,'allObject',response.body);
	    	},(response)=>{
	    		alert('fail in geting all object!')
	    	})
	    },
	    //添加物件表格的显示与隐藏
	    toggleAddObject(){
	    	this.addObjectTable = !this.addObjectTable;
	    },
	    getAllItemForObject(){
	    	this.$http.get('http://127.0.0.1:3000/admin/c/getAllItemMsg').then((response)=>{
	    		this.$set(this,'allItemForObject',response.body);
	    	},(response)=>{
	    		alert('fail in geting all Item msg!')
	    	})
	    },
	    //获取选中的物件属性
	    getItemMsg(){
	    	for(var i=0;i<this.allItemForObject.length;i++){
	    		if(this.allItemForObject[i].id === this.selectedID){
	    			this.selectedItemMsg.id = this.allItemForObject[i].id;		
			      	this.selectedItemMsg.name= this.allItemForObject[i].name;
			      	this.selectedItemMsg.abstract= this.allItemForObject[i].abstract;
			      	this.selectedItemMsg.content=this. allItemForObject[i].content;
			      	this.selectedItemMsg.object_classification_id= this.allItemForObject[i].object_classification_id;
	    		}
	    	}
	    	for(var i=0;i<this.allItemClassification.length;i++){
	    		if(this.selectedItemMsg.object_classification_id == this.allItemClassification[i].id){
	    			this.selectedItemMsg.object_classification_name = this.allItemClassification[i].name;
	    		}
	    	}
	    },
	    //添加物件
	    addObject(){
	    	var object_id = document.getElementById('object_id').value;
	    	this.$http.post('http://127.0.0.1:3000/admin/c/addObject',{id:object_id,item_id:this.selectedID}).then((response)=>{
	    		console.log(response.body);
	    		this.allObject.push({id:object_id,object_name:this.selectedItemMsg.name,abstract:this.selectedItemMsg.abstract,classification_name:this.selectedItemMsg.object_classification_name,status:0});
	    	},(response)=>{
	    		alert('fail in adding object!')
	    	})
	    },
	    //删除物件
	    deleteObject(id){
	    	this.$http.post('http://127.0.0.1:3000/admin/c/deleteObject/'+id).then((response)=>{
	    		console.log(response.body);
	    	},(response)=>{
	    		alert('fail in deleting object!')
	    	})
	    },
	    //添加item表格的显示与隐藏
	    toggleNewItem(){
	    	this.newItem = !this.newItem;
	    },
	    //添加item
	    addItem(){
	    	var name = document.getElementById('newItemName').value;
	    	var abstract = document.getElementById('newItemAbstract').value;
	    	var content = document.getElementById('newItemContent').value;
	    	var object_classification_id = this.selectedClass;
	    	this.$http.post('http://127.0.0.1:3000/admin/c/addItem',{name:name,abstract:abstract,content:content,object_classification_id:object_classification_id}).then((response)=>{
	    		// console.log(response.body);
	    		for(var i = 0;i<this.allClassification.length;i++){
	    			if(object_classification_id == this.allClassification[i].id){
	    				var object_classification_name = this.allClassification[i].name;
	    			}
	    		}
	    		this.allItemForObject.push({id:response.body.insertId,name:name,abstract:abstract,content:content,object_classification_id:object_classification_id,object_classification_name:object_classification_name});
	    	},(response)=>{
	    		alert('fail in adding item!')
	    	})
	    },

	    //出借信息填写表的显示与隐藏
	    toggleLendingObject(id){
	    	var object_id = id;
	    	this.lendingObject = true;

	    },




	    //逾期项管理
	    getAllOverdueObject(){
	    	this.$http.get('http://127.0.0.1:3000/admin/c/getAllOverdueObject').then((response)=>{
	    		this.$set(this,'allOverdueObject',response.body);
	    	},(response)=>{
	    		alert('fail in geting all overdue object!')
	    	})
	    }




	  }
	}

</script>

