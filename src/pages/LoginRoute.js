import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Login } from "./Login/Login";

const LoginRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => {
        const {authentication} = rest;
        return !authentication.logged
            ? <Login>
                <Component {...props} />
            </Login>
            :
            <Redirect to={{pathname: '/', state: {from: rest.location}}}/>
    }}/>
);
const mapStateToProps = state => ({
    authentication: state.reducerAuth,
});

export default connect(mapStateToProps)(LoginRoute)
