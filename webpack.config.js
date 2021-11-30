const path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: {
		'randomizer': path.resolve(__dirname, 'src/index.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].js',
		module: true,
		library: {
			"type": 'module'
		},
	},
	experiments: {
		outputModule: true,
	},
}