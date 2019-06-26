import React, { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from "../common/Input";
import { upsertDataEffect } from "../../actions/upsertDataEffect";
import { endpoint } from "../../constants/endpoint";
import { Form } from "antd";
import { LoadingPanel, UpsertXBy } from "../common/CommonComponents/CommonComponents";


export const UpsertChainList = ({id, isSubmitButtonClick, isClearButtonClick, callbackSubmitted, callbackCleared, langPrefix}) => {
    const {t} = useTranslation();

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
            <Form onSubmit={handleSubmitFrm}>
                <InputText focus={true} label="Name" value={formValues.name} onChange={handleChangeVal} error={formErrors.name}
                           name="name"/>
                <UpsertXBy formValues={formValues} langPrefix={langPrefix}/>
            </Form>
        </Fragment>
    );
};