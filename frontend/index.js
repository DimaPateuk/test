
import once from 'lodash/once';
import asyncModuleTest from './asyncModuleTest/asyncModuleTest.async';


(async function () {

    once(() => {});

    document.addEventListener('click', async () => {
        await asyncModuleTest();
    });

    document.body.innerHTML = '444444';

})();
