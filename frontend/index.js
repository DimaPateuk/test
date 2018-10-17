
import { once } from 'lodash';
import { T } from 'ramda';

(async function () {

    await Promise.resolve();
    console.log(once);
    console.log(T);

    document.body.innerHTML = '444444';
})();
