import React, { Fragment, useState } from 'react';
import { Button, Dropdown, Icon, Menu, Modal } from "antd";
import { constants } from "../../../constants/constants";
import { actLogoutRequest } from "../../../../services/actions/actionAuth";
import { useDispatch } from "react-redux";
import { buildReturnUrl } from "../../../utils/function";
import useReactRouter from 'use-react-router';
import './AccountInfo.less'
import { useTranslation } from "react-i18next";
import { UpdateAccountInfo } from "../UpdateAccountInfo/UpdateAccountInfo";

export const AccountInfo = () => {
    const dispatch = useDispatch();
    const {history} = useReactRouter();
    const {t} = useTranslation();
    const initialUpsertPopupState = {open: false, submit: false};
    const [userName, setUserName] = useState(localStorage.getItem(constants.CurrentUserName));
    const [upsertPopupState, setUpsertPopupState] = useState(initialUpsertPopupState);

    const onMenuClick = (event) => {
        const {key} = event;
        if (key === 'logout') {
            dispatch(actLogoutRequest());
            buildReturnUrl(history);
        } else {
            setUpsertPopupState({...upsertPopupState, open: true});
        }
    };

    const onUpsertPopupClose = () => {
        setUpsertPopupState(initialUpsertPopupState);
    };

    const onUpsertPopupSubmit = () => {
        setUpsertPopupState({...upsertPopupState, submit: true});
    };

    const onUpsertPopupSubmitted = (isSuccess) => {
        if (isSuccess) {
            setUpsertPopupState(initialUpsertPopupState);
        } else {
            setUpsertPopupState({...upsertPopupState, submit: false});//allow re-submit
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
        <Fragment>
            <Modal centered width={580}
                   destroyOnClose={true}
                   visible={upsertPopupState.open}
                   title="Account Information"
                   onCancel={onUpsertPopupClose}
                   onOk={onUpsertPopupSubmit}
                   footer={[
                       <Button key="close" onClick={() => onUpsertPopupClose()}>{`${t('general.btnClose')}`}</Button>,
                       <Button key="submit" type="primary" disabled={upsertPopupState.submit} onClick={onUpsertPopupSubmit}>
                           {t('general.btnSave')}
                       </Button>
                   ]}
                   confirmLoading={upsertPopupState.submit}
                   okButtonProps={{disabled: upsertPopupState.submit}}
            >
                <UpdateAccountInfo isSubmitButtonClick={upsertPopupState.submit}
                                   callbackSubmitted={onUpsertPopupSubmitted}/>
            </Modal>
            <Dropdown overlay={menuHeaderDropdown} placement="bottomRight">
                <span className="account-info-action">{userName}</span>
            </Dropdown>
        </Fragment>
    );
};