import React, { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from "../../commons/components/Input";
import { upsertDataEffect } from "../../services/actions/upsertDataEffect";
import { endpoint } from "../../commons/constants/endpoint";
import { Col, Form, Row, Typography } from "antd";
import { LoadingPanel, UpsertXBy } from "../../commons/components/CustomComponents/CustomComponents";
import './ChainList.less';


export const UpsertChainList = ({id, isSubmitButtonClick, isClearButtonClick, callbackSubmitted, callbackCleared, langPrefix}) => {
    const {t} = useTranslation();
    const {Text} = Typography;

    const validateRule = {
        requireds: ['name']
    };

    const {formValues, formErrors, isLoading, handleChange, handleSubmit, handleClear, handleChangeVal} = upsertDataEffect(endpoint.chainsNewType, id, onFormSubmitted, callbackCleared, validateRule);

    function onFormSubmitted(isSuccess) {
        callbackSubmitted && callbackSubmitted(isSuccess);
    }

    useEffect(() => {
        isClearButtonClick && handleClear();
    }, [isClearButtonClick]);

    useEffect(() => {
        isSubmitButtonClick && handleSubmit();
    }, [isSubmitButtonClick]);

    const handleSubmitFrm = (evt) => {
        evt && evt.preventDefault();
        return handleSubmit(evt);
    };

    return (
        <Fragment>
            {isLoading && <LoadingPanel/>}
            <Form onSubmit={handleSubmitFrm} layout="horizontal">
                <Row gutter={48}>
                    <Col span={4} className="form-title">
                        <Text strong>Name</Text>
                    </Col>
                    <Col span={20}>
                        <InputText focus={true} value={formValues.name} onChange={handleChangeVal} error={formErrors.name} name="name"
                        onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <UpsertXBy formValues={formValues} langPrefix={langPrefix}/>
            </Form>
        </Fragment>
    );
};