const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { useBabelLoader } = require('./utils');


module.exports = {
    mode: 'development',
    entry: [
        'webpack-dev-server/client?http://localhost:9000/',
        'webpack/hot/dev-server',
        join(__dirname, '../index.js'),
    ],
    devtool: 'source-map',
    output: {
        path: resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'eslint-loader',
                include: resolve(__dirname, '../index.js'),
                enforce: 'pre',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [useBabelLoader]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin(),
    ],
};
