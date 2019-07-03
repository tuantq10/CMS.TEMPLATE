import React, { Fragment, useEffect, useState } from 'react';
import { LoadingPanel } from "../../CommonComponents/CommonComponents";
import { Col, Collapse, Form, Icon, Row, Typography } from "antd";
import { endpoint } from "../../../../constants/endpoint";
import './UpdateAccountInfo.less';
import { InputText, InputPassword } from "../../Input";
import { callAuthApi } from "../../../../utils/apiCaller";
import { alertMessage, isValidComplexity, validateFormInput, clearAllCache, buildReturnUrl } from "../../../../utils/function";
import { useTranslation } from "react-i18next";
import useReactRouter from 'use-react-router';

export const UpdateAccountInfo = ({isSubmitButtonClick, callbackSubmitted}) => {
    const {t} = useTranslation();
    const {Text} = Typography;
    const {Panel} = Collapse;
    const {history} = useReactRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        isSubmitButtonClick && handleSubmit();
    }, [isSubmitButtonClick]);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
            saveData();
        } else
            callbackSubmitted && callbackSubmitted(false);
    }, [formErrors]);

    const validateRule = {
        requireds: ['fullName', 'phoneNumber'],
        validate: [
            {
                field: 'phoneNumber',
                func: (val, vals) => {
                    if (val.length > 0 && (val.length < 10 || val.length > 11))
                        return t(`general.errorPhoneNumber`);
                }
            },
            {
                field: 'newPassword',
                func: (val, vals) => {
                    const isInputCurrentPassword = vals && vals['oldPassword'] && vals['oldPassword'].length > 0;
                    if ((!val || val.length <= 0) && isInputCurrentPassword) {
                        return t('general.isRequired');
                    } else if (val && val.length > 0 && isInputCurrentPassword && !isValidComplexity(val))
                        return t('profile.errorPasswordLength');
                }
            },
            {
                field: 'confirmPassword',
                func: (val, vals) => {
                    const isInputCurrentPassword = vals && vals['oldPassword'] && vals['oldPassword'].length > 0;
                    const newPassword = vals && vals['newPassword'];
                    if ((!val || val.length <= 0) && isInputCurrentPassword) {
                        return t('general.isRequired');
                    } else if (val && val.length > 0 && isInputCurrentPassword && val !== newPassword)
                        return t('profile.errorNotMatch');
                }
            }
        ]
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await callAuthApi(endpoint.profile);
            setFormValues(result && result.data && result.data.data ? result.data.data : {});
        } catch (error) {
        }
        setIsLoading(false);
    };

    const saveData = async () => {
        setIsLoading(true);
        let isSuccess = false;
        let msg = '';
        try {
            let formValuesBody = {...formValues};
            if (formValuesBody && formValuesBody.oldPassword === '') {
                const fieldsUpdatePassword = ['oldPassword', 'newPassword', 'confirmPassword'];
                fieldsUpdatePassword.map((v, i) => {
                    delete formValuesBody[v];
                });
            }
            const result = await callAuthApi(endpoint.profile, formValuesBody, 'PUT');
            if (result.status === 200) {
                if (formValuesBody.newPassword) {
                    msg = t('profile.changePasswordSuccess');
                    buildReturnUrl(history, '/login', false, false);
                }
                isSuccess = true;
                callbackSubmitted && callbackSubmitted(true);
            } else {
                msg = result.data.errors;
            }
        } catch (error) {
        }
        setIsLoading(false);
        alertMessage(`${t(isSuccess ? 'general.success' : 'general.failed')}`, msg || t(isSuccess ? 'general.messageSuccess' : 'general.errorGeneral'), !isSuccess);
    };

    const handleChangeVal = (name, value) => {
        let newFormValues = {...formValues, [name]: value};
        setFormValues(newFormValues);
    };

    const handleSubmit = (evt) => {
        setFormErrors(validateFormInput(formValues, validateRule));
        setIsSubmitting(true);
        evt && evt.preventDefault();
    };

    const handleSubmitFrm = (evt) => {
        evt && evt.preventDefault();
        return handleSubmit(evt);
    };

    return (
        <Fragment>
            {isLoading && <LoadingPanel/>}
            <Form onSubmit={handleSubmitFrm} layout="horizontal">
                <Row gutter={48}>
                    <Col span={7} className="form-title">
                        <Text strong>FullName</Text>
                    </Col>
                    <Col span={17}>
                        <InputText focus={true} value={formValues.fullName} onChange={handleChangeVal} error={formErrors.fullName} name="fullName" onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={7} className="form-title">
                        <Text strong>Email</Text>
                    </Col>
                    <Col span={17}>
                        <InputText focus={true} value={formValues.email} disabled={true}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={7} className="form-title">
                        <Text strong>Phone Number</Text>
                    </Col>
                    <Col span={17}>
                        <InputText value={formValues.phoneNumber} onChange={handleChangeVal} error={formErrors.phoneNumber} name="phoneNumber" onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={7} className="form-title">
                        <Text strong>Role Name</Text>
                    </Col>
                    <Col span={17}>
                        <InputText focus={true} value={formValues.roleName} disabled={true}/>
                    </Col>
                </Row>
                <Collapse bordered={false}>
                    <Panel header="Change Password" className="change-password" key="1" extra={<Icon type="key"/>}>
                        <Row gutter={48}>
                            <Col span={7} className="form-title">
                                <Text strong>Current Password</Text>
                            </Col>
                            <Col span={17}>
                                <InputPassword value={formValues.oldPassword} onChange={handleChangeVal} error={formErrors.oldPassword} name="oldPassword" onSubmit={handleSubmit}/>
                            </Col>
                        </Row>
                        <Row gutter={48}>
                            <Col span={7} className="form-title">
                                <Text strong>New Password</Text>
                            </Col>
                            <Col span={17}>
                                <InputPassword value={formValues.newPassword} onChange={handleChangeVal} error={formErrors.newPassword} name="newPassword" onSubmit={handleSubmit}/>
                            </Col>
                        </Row>
                        <Row gutter={48}>
                            <Col span={7} className="form-title">
                                <Text strong>Confirm Password</Text>
                            </Col>
                            <Col span={17}>
                                <InputPassword value={formValues.confirmPassword} onChange={handleChangeVal} error={formErrors.confirmPassword} name="confirmPassword" onSubmit={handleSubmit}/>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>
            </Form>
        </Fragment>
    );
};