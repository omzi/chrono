const path = require('path');


module.exports = {
	entry: './src/js/app.js',
	output: {
		filename: 'app.bundle.js',
		path: path.join(__dirname, 'dist/js'),
		publicPath: '/js/'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader']
			}
		]
	},
	plugins: [
		
	],
	devServer: {
		static: path.join(__dirname, 'dist'),
		hot: true,
		port: 2022
	},
	mode: 'development'
};
