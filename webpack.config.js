const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: {
        polyfill: 'babel-polyfill',
        app: path.join(__dirname, 'src', 'index.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    // resolve: {
    //     extensions: ['.js', '.jsx']
    // },
    module: {
		loaders: [
            {
	            test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
                options: {
                    //cacheDirectory: true,
                    presets: ['es2015', 'react', 'stage-2']
                }
			},
            {
				test: /\.less$/,
				loaders: ["style-loader", "css-loader", "less-loader?strictMath=on"]
			},
            { //jquery visible in console
                test: require.resolve('jquery'),
                loader: 'expose-loader?jQuery!expose-loader?$'
            },
            { // files included in vendor css
                test: /\.(gif|png|jpe?g|svg|ttf|woff|woff2|eot|ico)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
                loader: 'url-loader?limit=100000'
            }
		]
	},
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.LoaderOptionsPlugin({
          test: /\.(less|css)$/i,
          options: {
            postcss: {
              plugins: [autoprefixer]
            }
          }
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true
    }
};
