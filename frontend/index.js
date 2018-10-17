
import once from 'lodash/once';

(async function () {

    let service = await import('./asyncModuleTest').default;
    once(() => {});
    console.log(service);

    document.body.innerHTML = '444444';

})();
