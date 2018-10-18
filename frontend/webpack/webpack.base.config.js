const { resolve, join, parse } = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { useBabelLoader } = require('./utils');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AsyncChunkNames = require('webpack-async-chunk-names-plugin');

module.exports = {
    mode: 'development',
    entry: [
        '@babel/polyfill',
        'whatwg-fetch',
        join(__dirname, '../index.js'),
    ],
    devtool: 'source-map',
    output: {
        path: resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            src: resolve(__dirname, '../'),
        },
    },
    resolveLoader: {
        modules: ['node_modules', resolve(__dirname, 'loaders')],
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
                use: [useBabelLoader],
            },

            {
                test: /\.async$/,
                use: [
                    useBabelLoader,
                    { loader: 'async-loader' },
                ],
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
        // new AsyncChunkNames(), // issue with index.js
        new BundleAnalyzerPlugin({
            defaultSizes: 'gzip',
            analyzerPort: 7777,
            openAnalyzer: false,
            statsOptions: {
                source: false,
                showPublicPath: true,
            },
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    name: 'vendor',
                    test: /node_modules/,
                    priority: 20,
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'async',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true,
                }
            },
        },
    },

};
