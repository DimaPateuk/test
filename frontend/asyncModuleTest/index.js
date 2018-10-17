import once from 'lodash/once';
once(() => {});



console.log('async module test pass');

(async function () {

    await Promise.resolve();
    document.addEventListener('click', async () => {
        await import('../asyncModuleTest1');
    });
    document.body.innerHTML = 'async module test pass';
})();

export default {
    value: 1,
};
