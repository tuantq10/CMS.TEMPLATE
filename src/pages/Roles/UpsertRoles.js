import React, { Fragment, useEffect, useState } from 'react';
import { Col, Form, Row, Typography } from "antd";
import { InputText } from "../../commons/components/Input";
import { LoadingPanel, UpsertXBy } from "../../commons/components/CustomComponents/CustomComponents";
import { useTranslation } from "react-i18next";
import { upsertDataEffect } from "../../services/actions/upsertDataEffect";
import { endpoint } from "../../commons/constants/endpoint";
import { alertMessage } from "../../commons/utils/function";
import { useDispatch, useSelector } from "react-redux";
import { actGetAllMenuRequest } from "../../services/actions/actionMenu";
import { RolesPermissions } from "./RolesPermissions";
import './Roles.less';

export const UpsertRoles = ({id, isSubmitButtonClick, isClearButtonClick, callbackSubmitted, callbackCleared, langPrefix}) => {
    const {t} = useTranslation();
    const {Text} = Typography;
    const dispatch = useDispatch();
    const [allMenus, setAllMenus] = useState([]);
    const [permissionRoles, setPermissionRoles] = useState([]);
    const menusState = useSelector(state => state.reducerMenu);

    const validateRule = {
        requireds: ['name'],
    };

    const {formValues, formErrors, isLoading, handleChange, handleSubmit, handleClear, handleChangeVal, setFormValues} = upsertDataEffect(endpoint.role, id, onFormSubmitted, callbackCleared, validateRule);

    const handleSubmitFrm = (evt) => {
        evt && evt.preventDefault();
        if (permissionRoles && permissionRoles.length > 0) {
            setFormValues({...formValues, permissions: permissionRoles});
            return handleSubmit(evt);
        } else {
            alertMessage(t('general.failed'), t(`${langPrefix}.errorMessageRole`), true);
        }
    };

    function onFormSubmitted(isSuccess) {
        callbackSubmitted && callbackSubmitted(isSuccess);
    }

    useEffect(() => {
        isClearButtonClick && handleClear();
    }, [isClearButtonClick]);

    useEffect(() => {
        isSubmitButtonClick && handleSubmitFrm();
    }, [isSubmitButtonClick]);

    useEffect(() => {
        dispatch(actGetAllMenuRequest());
    }, []);

    useEffect(() => {
        if (menusState !== null && menusState && menusState.allMenus && menusState.allMenus.length > 0) {
            setAllMenus(menusState.allMenus);
        }
    }, [menusState]);

    return (
        <Fragment>
            {isLoading && <LoadingPanel/>}
            <Form onSubmit={handleSubmitFrm} layout="horizontal">
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.txtRoleName`)}</Text>
                    </Col>
                    <Col span={18}>
                        <InputText focus={true} value={formValues.name} onChange={handleChangeVal} error={formErrors.name} name="name"
                                   onSubmit={handleSubmitFrm}/>
                    </Col>
                </Row>
                {allMenus.length > 0 && <RolesPermissions data={formValues.permissions} menus={allMenus} isClear={isClearButtonClick}
                                                          setPermissionToRole={setPermissionRoles}/>}
                <UpsertXBy formValues={formValues} langPrefix={langPrefix}/>
            </Form>
        </Fragment>
    );
};