import React from 'react';
import { Button } from 'antd';
import notFound from '../../assets/images/noFound.svg';
import useReactRouter from 'use-react-router';
import './PageNotFound.less';

export const PageNotFound = () => {
    const {history} = useReactRouter();

    const handleClick = (evt) => {
        evt && evt.preventDefault();
        history.push('/');
    };

    return (
        <div className="not-found-container">
            <img src={notFound} alt="404"/>
            <br/>
            <br/>
            <h1>404</h1>
            <p>Sorry, the page you visited does not exist.</p>
            <Button type="primary" onClick={handleClick}>
                Back Home
            </Button>
        </div>
    );
};