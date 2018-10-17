const buildAsyncModule = (module) =>
    `export default import(/* webpackChunkName: "${module}" */'${module}'));`;

let c = 10;

module.exports = function (input) {
    const { path } = JSON.parse(input);
    // const bundleName = basename(this.resource, '.async');

    return buildAsyncModule(c--, path);
};
