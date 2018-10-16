const webpackMerge = require('webpack-merge');

const base = require('./webpack.base.config.js');
const devServer = require('./webpack.dev-server.config.js');

module.exports = webpackMerge(base, devServer);
