import React, { Fragment, useEffect } from 'react';
import { LoadingPanel, SwitchCustom, UpsertXBy } from "../../commons/components/CustomComponents/CustomComponents";
import { Col, Form, Row } from "antd";
import { InputNumOnly, InputPassword, InputText } from "../../commons/components/Input";
import { upsertDataEffect } from "../../services/actions/upsertDataEffect";
import { endpoint } from "../../commons/constants/endpoint";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { DropdownWithDataIdName } from "../../commons/components/DropDown/DropDown";
import { fetchDataEffect } from "../../services/actions/fetchDataEffect";
import { constants } from "../../commons/constants/constants";
import { isValidComplexity } from "../../commons/utils/function";
import isEmail from 'validator/lib/isEmail';

export const UpsertUsers = ({id, isSubmitButtonClick, isClearButtonClick, callbackSubmitted, callbackCleared, langPrefix}) => {
    const {Text} = Typography;
    const {t} = useTranslation();
    const validateRule = {
        requireds: id === '' ? ['firstName', 'lastName', 'username', 'password', 'phoneNumber', 'roleId'] :
            ['firstName', 'lastName', 'username', 'phoneNumber', 'roleId'],
        validate: [
            {
                field: 'username',
                func: (val, vals) => {
                    if (val && val.length > 0 && !isEmail(val))
                        return t('general.errorEmail');
                }
            },
            {
                field: 'password',
                func: (val, vals) => {
                    if (val && val.length > 0 && !isValidComplexity(val))
                        return t('profile.errorPasswordLength');
                }
            },
            {
                field: 'phoneNumber',
                func: (val, vals) => {
                    if (val && (val.length < 10 || val.length > 11))
                        return t('profile.errorPhoneNumber');
                }
            },
        ]
    };
    const {data: roleData} = fetchDataEffect(endpoint.role + constants.Slash + 'all');
    const {formValues, formErrors, isLoading, handleSubmit, handleClear, handleChangeVal} = upsertDataEffect(endpoint.user, id, onFormSubmitted, callbackCleared, validateRule
        , {deactivated: false});

    useEffect(() => {
        isClearButtonClick && handleClear();
    }, [isClearButtonClick]);

    useEffect(() => {
        isSubmitButtonClick && handleSubmit();
    }, [isSubmitButtonClick]);

    function onFormSubmitted(isSuccess) {
        callbackSubmitted && callbackSubmitted(isSuccess);
    }

    return (
        <Fragment>
            {isLoading && <LoadingPanel/>}
            <Form layout="horizontal">
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.firstName`)}</Text>
                    </Col>
                    <Col span={18}>
                        <InputText focus={true} value={formValues.firstName} onChange={handleChangeVal} error={formErrors.firstName}
                                   name="firstName" onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.lastName`)}</Text>
                    </Col>
                    <Col span={18}>
                        <InputText value={formValues.lastName} onChange={handleChangeVal} error={formErrors.lastName}
                                   name="lastName" onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.userName`)}</Text>
                    </Col>
                    <Col span={18}>
                        <InputText type="email" value={formValues.username} onChange={handleChangeVal} error={formErrors.username}
                                   name="username" onSubmit={handleSubmit} disabled={id}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.passWord`)}</Text>
                    </Col>
                    <Col span={18}>
                        <InputPassword value={formValues.password} onChange={handleChangeVal} error={formErrors.password}
                                       name="password" onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.phone`)}</Text>
                    </Col>
                    <Col span={18}>
                        <InputNumOnly value={formValues.phoneNumber} onChange={handleChangeVal} error={formErrors.phoneNumber}
                                      name="phoneNumber" onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.role`)}</Text>
                    </Col>
                    <Col span={18}>
                        <DropdownWithDataIdName data={roleData} placeholder="Choose role"
                                                name="roleId" value={formValues.roleId} error={formErrors.roleId}
                                                onChange={handleChangeVal}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={6} className="form-title">
                        <Text strong>{t(`${langPrefix}.deactivated`)}</Text>
                    </Col>
                    <Col span={6}>
                        <SwitchCustom name="deactivated" value={formValues.deactivated} onChange={handleChangeVal}/>
                    </Col>
                    {id !== '' &&
                    <Fragment>
                        <Col span={6} className="form-title">
                            <Text strong>{t(`${langPrefix}.isLocked`)}</Text>
                        </Col>
                        <Col span={6}>
                            <SwitchCustom name="isLocked" value={formValues.isLocked} onChange={handleChangeVal}/>
                        </Col>
                    </Fragment>
                    }
                </Row>
                <UpsertXBy formValues={formValues} langPrefix={langPrefix}/>
            </Form>
        </Fragment>
    );
};