import React from 'react';

// const HomeComponent = (props) => {
//     console.log(props);
//     return (
//         <h1>Home Component! </h1>
//     );
// }

class HomeComponent extends React.Component {
    constructor (...args) {
        super();
        console.log(args);
    }

    render () {
        return (
            <h1>Home Component! </h1>
        );
    }
}

export default HomeComponent;
