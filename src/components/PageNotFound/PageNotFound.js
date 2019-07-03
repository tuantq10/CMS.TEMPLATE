import React, { useState } from 'react';
import { Button } from 'antd';
import notFound from '../../assets/images/noFound.svg';
import useReactRouter from 'use-react-router';
import { constants } from "../../constants/constants";
import { clearAllCache } from "../../utils/function";
import './PageNotFound.less';

export const PageNotFound = () => {
    const [defaultPath, setDefaultPath] = useState(localStorage.getItem(constants.DefaultPathName) || '/');
    const {history} = useReactRouter();

    const handleClick = (evt) => {
        evt && evt.preventDefault();
        if (defaultPath === '/login')
            clearAllCache();
        defaultPath === '/' ? history.go(defaultPath) : history.push(defaultPath);
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