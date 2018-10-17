const { resolve } = require('path');
const fs = require('fs');
const useBabelLoader = {
    loader: 'babel-loader',
    options: JSON.parse(fs.readFileSync(resolve(__dirname, '../../.babelrc'))),
};

module.exports = {
    useBabelLoader,
};
