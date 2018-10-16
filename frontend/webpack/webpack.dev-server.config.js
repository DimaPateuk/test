const path = require('path');

module.exports = {
    devServer: {
        hot: true,
        inline: true,
        port: 9000,
        contentBase: path.join(__dirname, 'dist'),
        publicPath: '/',
        open: true,
        openPage: 'index.html',
    },
};
