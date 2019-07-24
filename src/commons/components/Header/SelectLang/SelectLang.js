import React, { useState } from 'react';
import i18n from "../../../localization/i18n";
import { Icon, Menu, Dropdown } from 'antd';
import './SelectLang.less'
import * as Types from "../../../constants/types";
import { useDispatch } from "react-redux";

export const SelectLang = () => {
    const locales = ['vn', 'en'];
    const languageLabels = {
        'vn': 'Tiếng Việt',
        'en': 'English'
    };
    const [lng, setLng] = useState(i18n.language || window.localStorage.i18nextLng || process.env.REACT_APP_DEFAULT_LANGUAGE);
    const dispatch = useDispatch();

    const onChangeLang = (value) => {
        const langKey = value.key;
        i18n.changeLanguage(langKey);
        setLng(langKey);
        if (langKey === 'vn')
            dispatch({type: Types.VI_LANGUAGE, lang: langKey});
        else
            dispatch({type: Types.EN_LANGUAGE, lang: langKey});
    };

    const langMenu = (
        <Menu selectedKeys={[lng]} onClick={onChangeLang}>
            {locales.map(locale => (
                <Menu.Item key={locale}>
                    {languageLabels[locale]}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={langMenu} placement="bottomRight">
            <span className="select-lang-action">
                <Icon type="global"/>
            </span>
        </Dropdown>
    );
};