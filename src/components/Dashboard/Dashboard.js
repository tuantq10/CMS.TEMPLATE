import React, { Fragment } from 'react';
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import useReactRouter from 'use-react-router';

export const Dashboard = () => {
    const {t} = useTranslation();
    const {history} = useReactRouter();

    const onHandleClick = (url) => {
        history.push(url);
    };

    return (
        <Fragment>
            <div>...
                <br/>
                <br/>
                <Button type="primary" onClick={(e) => onHandleClick('/report-mice-booking-by-status')}>Push To Report by Status</Button>
                <br/>
                <br/>
                <Button type="primary" onClick={(e) => onHandleClick('/chain-list')}>Push To Chain List</Button>
                <br/>
                <br/>
                {t('general.errorMessageIsUse')}
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                long
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                ...
                <br/>
                content
            </div>
        </Fragment>
    );
};