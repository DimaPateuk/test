import once from 'lodash/once';
once(() => {});



console.log('async module test pass');

(async function () {

    await Promise.resolve();

    document.body.innerHTML = 'async module test pass 111111111111';
})();

export default {
    value: 1,
};
