"use strict";

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

function _path(p) {
    return path.join(__dirname, p);
}

module.exports = function(env) {
    env = env || {};
    var envDev = env.dev === true;
    var minimize = env.minimize === true;
    var analyze = env.analyze === true;
    var plugins = [];
    var devtool = null;
    var appVersion = process.env.npm_package_version;

    plugins.push(new webpack.DefinePlugin({__VERSION__: JSON.stringify(appVersion)}));

    if (envDev) {
        devtool = "eval-source-map";
    } else {
        devtool = "cheap-module-source-map";
        plugins.push(new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}));
        plugins.push(new webpack.optimize.AggressiveMergingPlugin());
    }

    var entries = {
      'bundle': ['./src/index.js']
    };

    plugins.push(new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      filename: 'index.html',
      title: 'Deepstream.js',
      template: 'src/index.template.ejs',
      chunks: ['bundle']
    }));

    plugins.push(new HtmlWebpackHarddiskPlugin({
        outputPath: path.resolve(__dirname, 'src')
    }));


    return {
        entry: entries,
        output: {
            path: __dirname + '/dist',
            publicPath: 'assets/',
            filename: '[name].js',
            sourceMapFilename: "[name].js.map"
        },
        plugins: plugins,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [/node_modules/],
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                "presets": [
                                    [
                                        "es2016"
                                    ]
                                ]
                            }
                        }
                    ]
                },
                {
                  test: /\.ejs$/,
                  exclude: [/node_modules/],
                  use: [
                      {
                        loader: 'ejs-loader'
                      }
                  ]
                }
            ]
        },
        devtool: devtool,
        devServer: {
            contentBase: './src/',
            hot: false,
            inline: true,
            host: '0.0.0.0',
            port: 8081,
            historyApiFallback: true
        },
        resolve: {
            modules: [
                path.join(__dirname, "src"),
                "node_modules"
            ],
            extensions: ['.js'],
            alias: {
            }
        }
    };

};
