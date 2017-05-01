const path = require('path');
const config = require('./config/server');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	devtool: config.DEBUG ? undefined : 'inline-source-map',
	entry: {
		admin: './src/admin/index.js',
		web: config.DEBUG ?
			[ 'react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server', './src/web/client.jsx' ]
			: './src/web/client.jsx'
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].bundle.js',
		publicPath: '/'
	},
	resolve: {
		modules: ["node_modules"],
		extensions: ['.js', '.jsx']
	},
	module: {
		loaders: [
			// JS
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: [["es2015", { modules: false }], "stage-1"],
					plugins: ["react-hot-loader/babel"/*, "external-helpers"*/],
					compact: true
				}
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: [["es2015", { modules: false }], "react", "stage-1"],
					plugins: ["transform-decorators-legacy", "react-hot-loader/babel"/*, "external-helpers"*/],
					compact: true
				}
			},
			// STYLES
			{
				test: /\.css$/,
				use: config.DEBUG ? (
					['style-loader', 'css-loader']
				) : (
						ExtractTextPlugin.extract({
							fallback: "style-loader",
							use: [
								"css-loader",
								{
									loader: 'postcss-loader',
									options: {
										plugins: function () {
											return [autoprefixer];
										}
									}
								}
							],
							publicPath: "/"
						})
					)
			},
			{
				test: /\.less$/,
				loader: config.DEBUG ? (
					['style-loader', 'css-loader', 'less-loader']
				) : (
						ExtractTextPlugin.extract({
							fallback: "style-loader",
							use: [
								'css-loader',
								{
									loader: 'postcss-loader',
									options: {
										plugins: function () {
											return [autoprefixer];
										}
									}
								},
								'less-loader'
							]
						})
					)
			},


			// MARKUP
			{
				test: /\.html$/,
				use: "html-loader"
			},

			// MEDIA
			{
				test: /\.(jpe?g|png|gif|svg|jpg)$/i,
				use: [
					'url-loader?limit=10000',
					'img-loader'
				]
			},
			{
				test: /\.(woff|woff2)$/,
				use: ["url-loader?prefix=fonts/&limit=10000"]
			},
			{
				test: /\.ttf$/,
				use: ["url-loader?prefix=fonts/&limit=10000"]
			},
			{
				test: /\.eot$/,
				use: ["url-loader?prefix=fonts/&limit=10000"]
			},
			{
				test: /\.json$/,
				use: "json-loader"
			}
		]
	}
};

if (config.DEBUG) {
	console.log("Debug Webpack settings");
	module.exports.plugins = [
		new webpack.DefinePlugin({
			'global.WEBPACK': JSON.stringify(true),
			'config.DEBUG': JSON.stringify(true)
		}),
		new webpack.IgnorePlugin(/\.\/locale$/),
		new webpack.HotModuleReplacementPlugin(), // enable HMR globally
		new webpack.NamedModulesPlugin()
	];
	module.exports.devServer = {
		hot: true,
		proxy: {
			'*': 'http://localhost:' + config.HTTP_PORT
		},
		host: 'localhost'
	};
}
else { // PROD
	console.log("Production Webpack settings");

	module.exports.plugins = [
		new webpack.DefinePlugin({
			'global.WEBPACK': JSON.stringify(true),
			'process.env.NODE_ENV': '"production"',
			'NODE_ENV': '"production"',
			'config.DEBUG': JSON.stringify(false)
		}),
		new webpack.IgnorePlugin(/\.\/locale$/),
		new ExtractTextPlugin("[name].min.css"),
		new webpack.optimize.UglifyJsPlugin({
			//   compress: {
			//     warnings: false
			//   },
			//   output: {
			//     comments: false
			//   }
		})
	];
}
