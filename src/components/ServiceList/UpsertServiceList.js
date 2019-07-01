import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { upsertDataEffect } from "../../actions/upsertDataEffect";
import { endpoint } from "../../constants/endpoint";
import { Row, Col, Form, Typography } from "antd";
import { InputText, TextArea, InputNum, DatePicker } from "../common/Input";
import { DropdownWithDataIdName } from "../common/DropDown/DropDown";
import { LoadingPanel } from "../common/CommonComponents/CommonComponents";
import { fetchDataEffect } from "../../actions/fetchDataEffect";
import { PropertyMultiSelect, ServiceMultiSelect } from "../common/MultipleSelect/MultipleSelect";
import * as moment from 'moment';
import { constants } from "../../constants/constants";
import './ServiceList.less';

export const UpsertServiceList = ({id, isSubmitButtonClick, isClearButtonClick, callbackSubmitted, callbackCleared, langPrefix}) => {
    const {t} = useTranslation();
    const {Text} = Typography;

    const queryServiceParams = {excludeIds: id};
    const {data: categoryData} = fetchDataEffect(endpoint.serviceCategory);
    const [reloadServiceItemFlag, setReloadServiceItemFlag] = useState({
        reload: false,
        callback: newState => setReloadServiceItemFlag(newState)
    });

    const validateRule = {
        requireds: ['categoryId', 'name', 'unit', 'price', 'propertyIds'],
        validate: [
            {
                field: 'price',
                func: (val, vals) => {
                    val = parseFloat(val);
                    if (val < 0)
                        return t(`${langPrefix}.upsertPopup.errorPriceInValid`);
                }
            },
            {
                field: 'minPrice',
                func: (val, vals) => {
                    val = parseFloat(val);
                    if (val < 0)
                        return t(`${langPrefix}.upsertPopup.errorMinPriceInValid`);
                    else if (val > parseFloat(vals['price']))
                        return t(`${langPrefix}.upsertPopup.errorMinPriceRetailPrice`);
                }
            },
        ]
    };

    const {formValues, formErrors, isLoading, handleChangeVal, handleSubmit, handleClear} = upsertDataEffect(endpoint.service, id, onFormSubmitted, callbackCleared, validateRule, {priceExpired: moment().format(constants.DateFormatFromDB)});

    function onFormSubmitted(isSuccess) {
        isSuccess && handleClear(true);
        callbackSubmitted && callbackSubmitted(isSuccess);
        isSuccess && setReloadServiceItemFlag({...reloadServiceItemFlag, reload: true});
    }

    useEffect(() => {
        if (isClearButtonClick) {
            handleClear();
        }
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
            <Form onSubmit={handleSubmitFrm} className="upsert-service-list" layout="horizontal">
                <Row gutter={48}>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.category`)}</Text>
                    </Col>
                    <Col span={20}>
                        <DropdownWithDataIdName data={categoryData} placeholder="Choose category"
                                                name="categoryId" value={formValues.categoryId} error={formErrors.categoryId}
                                                onChange={handleChangeVal}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.name`)}</Text>
                    </Col>
                    <Col span={20}>
                        <InputText focus name="name" value={formValues.name} error={formErrors.name}
                                   onChange={handleChangeVal} onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.description`)}</Text>
                    </Col>
                    <Col span={20}>
                        <TextArea rows={3} name="description" value={formValues.description} error={formErrors.description}
                                  onChange={handleChangeVal}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.validOn`)}</Text>
                    </Col>
                    <Col span={20}>
                        <PropertyMultiSelect name="propertyIds" value={formValues.propertyIds} error={formErrors.propertyIds}
                                             onChange={handleChangeVal}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.serviceList`)}</Text>
                    </Col>
                    <Col span={20}>
                        <ServiceMultiSelect reloadFlag={reloadServiceItemFlag}
                                            name="childServiceIds" value={formValues.childServiceIds} error={formErrors.childServiceIds}
                                            onChange={handleChangeVal} queryParams={queryServiceParams}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.retailPrice`)}</Text>
                    </Col>
                    <Col span={8}>
                        <InputNum name="price" value={formValues.price} error={formErrors.price}
                                  onChange={handleChangeVal}/>
                    </Col>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.unit`)}</Text>
                    </Col>
                    <Col span={8}>
                        <InputText name="unit" value={formValues.unit} error={formErrors.unit}
                                   onChange={handleChangeVal} onSubmit={handleSubmit}/>
                    </Col>
                </Row>
                <Row gutter={48}>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.taPrice`)}</Text>
                    </Col>
                    <Col span={8}>
                        <InputNum name="minPrice" value={formValues.minPrice} error={formErrors.minPrice}
                                  onChange={handleChangeVal} onSubmit={handleSubmit}/>
                    </Col>
                    <Col span={4} className="form-title">
                        <Text strong>{t(`${langPrefix}.upsertPopup.expired`)}</Text>
                    </Col>
                    <Col span={8}>
                        <DatePicker className="service-list-date-picker" name="priceExpired" value={formValues.priceExpired} error={formErrors.priceExpired}
                                    onChange={handleChangeVal} allowClear={false}/>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    );
};