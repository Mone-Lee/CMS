<template>
  <el-select placeholder="请选择" v-model="id" @change="selectItem()">
    <el-option
      v-for="item in options"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<style>
</style>

<script>
	export default{
		name:'selector',

		data(){
			return {
				id:this.selectID,
			}
		},
		props:['options','selectID'],

		methods:{
			selectItem(){
				console.log('selectID:'+this.selectID);
				console.log('id:'+this.id);
				this.$emit('select-item',this.id);
			}
		},

	}
</script>
