import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { ContainerIndex } from "./ContainerIndex/ContainerIndex";

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => {
        const {authentication} = rest;
        return authentication.logged
            ?
            <ContainerIndex>
                <Component {...props} />
            </ContainerIndex>
            :
            <Redirect to={{pathname: '/login', state: {from: rest.location}}}/>
    }}/>
);

const mapStateToProps = state => ({
    authentication: state.reducerAuth,
});

export default connect(mapStateToProps)(PrivateRoute)
