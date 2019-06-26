import React from 'react';
import { Tooltip, Spin, Button } from "antd";
import { useTranslation } from "react-i18next";
import { formatUTCDateTime } from "../../../utils/function";
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

export const UpsertXBy = ({formValues}) => {
    const {t} = useTranslation();

    function getStr(label, val, isDate) {
        val = isDate && val ? formatUTCDateTime(val) : val;
        return val ? `${t('general.' + label)}${val}` : '';
    }

    let creator = getStr('createModifiedBy', formValues['creator']);
    let createdDate = getStr('createModifiedAt', formValues['createdDate'], true);
    let modifier = getStr('createModifiedBy', formValues['latestModifier']);
    let modifiedDate = getStr('createModifiedAt', formValues['modifiedDate'], true);

    creator = creator || createdDate ? `${t('general.createdBy')}${creator}${createdDate}` : '';
    modifier = modifier || modifiedDate ? `${t('general.modifiedBy')}${modifier}${modifiedDate}` : '';

    return (
        <div className="creator-modifier-dv">
            {[creator, modifier].filter(Boolean).join(' | ')}
        </div>
    );
};