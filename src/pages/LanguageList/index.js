import React, { Fragment } from 'react';
import { useTranslation } from "react-i18next";
import useReactRouter from 'use-react-router';
export const LanguageList = () => {
    const { t } = useTranslation();
    const { history } = useReactRouter();
   
    return (
        <Fragment>
        </Fragment>
    );
};