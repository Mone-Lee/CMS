var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 引入基本配置
var config = require('./webpack.base.conf');

config.output.publicPath = '/';

config.plugins = [

	// 添加三个插件
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin(),

	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: path.resolve(__dirname, '../index.html'),
		inject: true
	})
];

var hotClient = './build/hot-client';
Object.keys(config.entry).forEach(function(name) {
	var extras = [hotClient];
	config.entry[name] = extras.concat(config.entry[name]);
});

module.exports = config;