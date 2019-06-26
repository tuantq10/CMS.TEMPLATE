import React, { useState } from 'react';
import { Dropdown, Icon, Menu } from "antd";
import { constants } from "../../../../constants/constants";
import { actLogoutRequest } from "../../../../actions/actionAuth";
import { useDispatch } from "react-redux";
import { buildReturnUrl } from "../../../../utils/function";
import useReactRouter from 'use-react-router';
import './AccountInfo.scss'

export const AccountInfo = () => {
    const dispatch = useDispatch();
    const {history} = useReactRouter();
    const [userName, setUserName] = useState(localStorage.getItem(constants.CurrentUserName));

    const onMenuClick = (event) => {
        const {key} = event;
        if (key === 'logout') {
            dispatch(actLogoutRequest());
            buildReturnUrl(history);
        }
    };

    const menuHeaderDropdown = (
        <Menu selectedKeys={[]} onClick={onMenuClick}>
            <Menu.Item key="center">
                <Icon type="user"/>
                <span>Account Info</span>
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="logout">
                <Icon type="logout"/>
                <span>LogOut</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menuHeaderDropdown} placement="bottomRight">
            <span className="account-info-action">{userName}</span>
        </Dropdown>
    );
};