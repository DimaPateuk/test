import once from 'lodash/once';
import asyncModuleTest1 from '../asyncModuleTest1/asyncModuleTest1.async';
once(() => {});



console.log('async module test pass');

(async function () {

    await Promise.resolve();
    document.addEventListener('click', async () => {
        await asyncModuleTest1();
    });
    document.body.innerHTML = 'async module test pass';
})();

export default {
    value: 1,
};
