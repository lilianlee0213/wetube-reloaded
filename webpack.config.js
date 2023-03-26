const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BASE_JS = './src/client/js/';

module.exports = {
	entry: {
		main: BASE_JS + 'main.js',
		recorder: BASE_JS + 'recorder.js',
		videoPlayer: BASE_JS + 'videoPlayer.js',
		watchVideo: BASE_JS + 'watchVideo.js',
		commentSection: BASE_JS + 'commentSection.js',
		profile: BASE_JS + 'profile.js',
		form: BASE_JS + 'form.js',
	},
	plugins: [new MiniCssExtractPlugin({filename: 'css/styles.css'})],
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'assets'),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', {targets: 'defaults'}]],
					},
				},
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
};
