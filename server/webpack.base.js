module.exports = {
  module: {
		rules: [{
			test: /\.js?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			options: { // 额外的配置项
				presets: ['react', 'stage-0', ['env', { // env表示打包时如何根据环境进行适配
					targets: {
						browsers: ['last 2 versions'] // 打包编译的过程中，babel会兼容主流浏览器的最新两个版本
					}
				}]]
			}
		}]
	}
}