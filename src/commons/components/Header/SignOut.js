import React from 'react';
import { Button, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { buildReturnUrl } from "../../utils/function";
import { actLogoutRequest } from "../../../services/actions/actionAuth";
import useReactRouter from 'use-react-router';

export const SignOut = () => {
    const dispatch = useDispatch();
    const {history} = useReactRouter();

    const onHandleSignOut = () => {
        dispatch(actLogoutRequest());
        buildReturnUrl(history);
    };

    return (
        <Tooltip title="LogOut">
            <Button type="primary" icon="logout" shape="circle" onClick={onHandleSignOut}/>
        </Tooltip>
    );
};