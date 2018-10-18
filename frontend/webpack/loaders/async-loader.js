const { basename } = require('path');

const buildAsyncModule = (bundleName, path) =>
    `export default () => import(/* webpackChunkName: "${bundleName}" */'${path}');`;


module.exports = function (input) {
    const { path } = JSON.parse(input);
    const bundleName = basename(this.resource, '.async');

    return buildAsyncModule(bundleName, path);
};
