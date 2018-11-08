
import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Switch, NavLink as Link, Route, Redirect } from 'react-router-dom';
import loadable from 'react-loadable';

import asyncModuleTest from '../asyncModuleTest/asyncModuleTest.async';
asyncModuleTest();
const LoadingComponent = () => <h3>please wait...</h3>;

const AsyncHomeComponent = loadable( {
    loader: () => import( '../home' ),
    loading: LoadingComponent,
} );

const AsyncAboutComponent = loadable( {
    loader: () => import( '../about' ),
    loading: LoadingComponent,
} );

const AsyncContactComponent = loadable( {
    loader: () => import( '../contact' ),
    loading: LoadingComponent,
} );

class App extends React.Component {
    render() {
        return(
            <HashRouter>
                <div className="content">
                    <div className="menu">
                        <Link exact to="/" activeClassName="active">Home</Link>
                        <Link to="/about" activeClassName="active">About</Link>
                        <Link to="/contact" activeClassName="active">Contact</Link>
                    </div>

                    <Switch>
                        <Route exact path="/" component={ AsyncHomeComponent } />
                        <Route path="/about" component={ AsyncAboutComponent } />
                        <Route path="/contact" component={ AsyncContactComponent } />
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}
export default App;
