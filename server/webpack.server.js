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
	externals: [nodeExternals()],
	module: {
		rules: [{
			test: /\.css?$/,
			use: ['isomorphic-style-loader', { // 服务端渲染时，不能使用style-loader，要使用这个支持服务达渲染的loader
				loader: 'css-loader',
				options: {
					importLoaders: 1,
					modules: true,
					localIdentName: '[name]_[local]_[hash:base64:5]'
				}
			}]
		}]
	}
}

module.exports = merge(config, serverConfig)