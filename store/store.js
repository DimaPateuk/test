const { createStore } = require('redux');

const { normalize, schema }  = require('normalizr');
const deepmerge  = require('deepmerge');

const user = new schema.Entity('users');
const comment = new schema.Entity('comments', {
  ownerId: user,
});

const subscription = new schema.Entity('subscriptions', {
    ownerIds: [user],
});


var commentNormalize = normalize(
    {
        "id": "2",
        message: 'user comment',
        "ownerId": "1",
    },
    comment
);
var userNormalize = normalize(
    {
        "id": "1",
        name: 'user name first',
    },
    user
);
var subscriptionNormalize = normalize(
    {
        "id": "1",
        name: 'subscription',
        ownerIds: ["1", "2"],
    },
    subscription
);

console.log(
    deepmerge(
        {...commentNormalize},
        {...userNormalize},
        {...subscriptionNormalize}
    )
);
// //
// function reducer (state, action) {
//     switch (action.type) {
//         case 'ADD': {
//             return state;
//         }

//         default: {
//              return state;
//         }
//     }
// }

// function add (data) {
//     return {
//         type: 'ADD',
//         payload: data,
//     }
// }

// const store = createStore(reducer, normalizedData);



// var print = () => {
//     console.log('------------------');
//     console.log(JSON.stringify(store.getState(),null,2));
// }
// store.subscribe(print);
// print();

// store.dispatch(add(normalize({
//     id: 'new coment id',
//     message: 'new coment message',
//     "commenter": {
//         "id": "2",
//         "name": "Nicole"
//     }

// }, comment)));
