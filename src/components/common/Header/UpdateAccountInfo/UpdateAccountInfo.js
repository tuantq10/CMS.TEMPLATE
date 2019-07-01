import React, { Fragment, useEffect, useState } from 'react';
import { LoadingPanel } from "../../CommonComponents/CommonComponents";
import { Col, Collapse, Form, Icon, Row, Typography } from "antd";
import { endpoint } from "../../../../constants/endpoint";
import './UpdateAccountInfo.less';
import { InputText, InputPassword } from "../../Input";
import { callAuthApi } from "../../../../utils/apiCaller";
import { alertMessage, detectReturnMessage, isValidComplexity } from "../../../../utils/function";
import { useTranslation } from "react-i18next";

export const UpdateAccountInfo = ({isSubmitButtonClick, callbackSubmitted}) => {
    const {t} = useTranslation();
    const {Text} = Typography;
    const {Panel} = Collapse;
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
        if (Object.keys(formErrors).length === 0 && isSubmitting)
            saveData();
        else
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

    const validate = (values) => {
        let errors = {};

        (validateRule['requireds'] || []).map(x => {
            if (!values[x] || values[x].length === 0) {
                errors[x] = 'Is required';
            }
        });

        (validateRule['validate'] || []).map(x => {
            if (!errors[x.field]) {
                var error = x.func(values[x.field], values);
                if (error)
                    errors[x.field] = error;
            }
        });

        return errors;
    };

    const saveData = async () => {
        setIsLoading(true);
        let isSuccess = false;
        let msg = '';
        try {
            const result = await callAuthApi(endpoint.profile, formValues, 'PUT');
            if (result.status === 200) {
                isSuccess = true;
                callbackSubmitted && callbackSubmitted(true);
            } else {
                msg = detectReturnMessage(result.data.errors);
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
        setFormErrors(validate(formValues));
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
                                <InputPassword value={formValues.currentPassword} onChange={handleChangeVal} error={formErrors.fullNacurrentPasswordme} name="currentPassword" onSubmit={handleSubmit}/>
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