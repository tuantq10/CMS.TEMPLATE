import React, { Fragment, useEffect, useState } from 'react';
import { Col, Form, Row, Typography } from "antd";
import { InputText } from "../../commons/components/Input";
import { LoadingPanel, UpsertXBy } from "../../commons/components/CustomComponents/CustomComponents";
import { useTranslation } from "react-i18next";
import { upsertDataEffect } from "../../services/actions/upsertDataEffect";
import { endpoint } from "../../commons/constants/endpoint";
import { alertMessage } from "../../commons/utils/function";
import { RolesPermissions } from "./RolesPermissions";
import './Roles.less';

export const UpsertRoles = ({id, isSubmitButtonClick, isClearButtonClick, callbackSubmitted, callbackCleared, langPrefix, allMenusComponents}) => {
    const {t} = useTranslation();
    const {Text} = Typography;
    const [permissionRoles, setPermissionRoles] = useState([]);

    const validateRule = {
        requireds: ['name'],
    };

    const {formValues, formErrors, isLoading, handleSubmit, handleClear, handleChangeVal, setFormValues} = upsertDataEffect(endpoint.role, id, onFormSubmitted, callbackCleared, validateRule);

    const handleSubmitFrm = (evt) => {
        evt && evt.preventDefault();
        if (permissionRoles && permissionRoles.length > 0) {
            setFormValues({...formValues, permissions: permissionRoles});
            return handleSubmit(evt);
        } else {
            alertMessage(t('general.failed'), t(`${langPrefix}.errorMessageRole`), true);
            callbackSubmitted && callbackSubmitted(false);
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

    return (
        <Fragment>
            {isLoading && <LoadingPanel/>}
            <Form layout="horizontal">
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.txtRoleName`)}</Text>
                    </Col>
                    <Col span={18}>
                        <InputText focus={true} value={formValues.name} onChange={handleChangeVal} error={formErrors.name} name="name"
                                   onSubmit={handleSubmitFrm}/>
                    </Col>
                </Row>
                <RolesPermissions data={formValues.permissions} menus={allMenusComponents} isClear={isClearButtonClick} setPermissionToRole={setPermissionRoles}/>
                <UpsertXBy formValues={formValues} langPrefix={langPrefix}/>
            </Form>
        </Fragment>
    );
};