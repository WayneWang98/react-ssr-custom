const path = require('path')
const merge = require('webpack-merge')
const config = require('./webpack.base.js')
const nodeExternals = require('webpack-node-externals')

const serverConfig = {
	target: 'node', // 打包的是node服务器端的文件，浏览器端不需要这个配置
	mode: 'development',
	entry: './src/server/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build')
	},
	externals: [nodeExternals()]
}

module.exports = merge(config, serverConfig)