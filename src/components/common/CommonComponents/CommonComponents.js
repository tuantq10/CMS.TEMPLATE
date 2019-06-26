import React from 'react';
import { Tooltip, Spin, Button } from "antd";
import { useTranslation } from "react-i18next";
import './CommonComponents.scss';

export const WrapText = ({text}) => {
    return (
        <Tooltip title={text}>
            <span className="wrap_text">{text}</span>
        </Tooltip>
    );
};

export const WrapLink = ({text, onClick}) => {
    return (
        <Tooltip title={text}>
            <Button className="wrap_link" type="link" onClick={onClick}>{text}</Button>
        </Tooltip>
    );
};

export const LoadingPanel = ({cssClass, text}) => {
    const {t} = useTranslation();
    return (
        <div className={cssClass || `nk_popup_loading`}>
            <Spin size="large" tip={text || ''}/>
        </div>
    );
};