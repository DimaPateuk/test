const path = require('path');

const { join } = require('path');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:9000/',
        'webpack/hot/dev-server',
    ],
    devServer: {
        hot: true,
        inline: true,
        port: 9000,
        contentBase: path.join(__dirname, 'dist'),
        publicPath: '/',
        // open: true,
        // openPage: 'index.html',
    },
};
