import React, { useState } from 'react';
import { validPermission } from "../../commons/utils/function";
import { constants } from "../../commons/constants/constants";
import { endpoint } from "../../commons/constants/endpoint";
import { formatNum, formatDate } from "../../commons/utils/function";
import GridDataPage from '../../commons/components/GridDataPage/GridDataPage';
import { WrapText } from "../../commons/components/CustomComponents/CustomComponents";
import {
    PropertyDropdownMultipleSelectWithSearch,
    ChainDropdownMultipleSelectWithSearch,
    AreaDropdownMultipleSelectWithSearch,
    CategoryDropdownMultipleSelectWithSearch,
} from "../../commons/components/DropDown/DropDown";
import { Form, Button } from "antd";
import { upsertDataEffect } from "../../services/actions/upsertDataEffect";
import * as moment from 'moment';
import { UpsertServiceList } from "./UpsertServiceList";

export const ServiceList = () => {
    const currentRoutePath = 'service-list';
    const langPrefix = 'serviceList';

    const [priceExpiredChanging, setPriceExpiredChanging] = useState(0);
    const [reloadGridFlag, setReloadGridFlag] = useState(0);
    const [filterParams, setFilterParams] = useState({});
    const [isResetChain, setIsResetChain] = useState(0);
    const [isResetArea, setIsResetArea] = useState(0);
    const [chainQueryParams, setChainQueryParams] = useState([]);
    const [areaQueryParams, setAreaQueryParams] = useState([]);

    const {formValues, formErrors, handleChangeVal, handleSubmitWithFormValues} = upsertDataEffect(`${endpoint.service}/priceExpired`, '', onFormSubmitted, undefined, undefined, {priceExpired: moment().format(constants.DateFormatFromDB)});

    function onFormSubmitted(isSuccess) {
        isSuccess && setReloadGridFlag(Math.random());
        setPriceExpiredChanging(false);
    }

    const actionInGrid = {
        allowInsert: validPermission(constants.Permissions.Insert, currentRoutePath),
        allowUpdate: validPermission(constants.Permissions.Update, currentRoutePath),
        allowDelete: validPermission(constants.Permissions.Delete, currentRoutePath),
        selectionRender: (ids) => {
            const handleSubmit = (e) => {
                e.preventDefault();
                setPriceExpiredChanging(true);
                handleSubmitWithFormValues({...formValues, serviceIds: ids});
            };

            return (
                <div className="filter-items-area">
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={priceExpiredChanging}>Change Expired</Button>
                    </Form.Item>
                </div>
            );
        },
    };

    const sortColumnMapping = {
        0: 'Name',
        1: 'CategoryName',
        2: 'Price',
        3: 'MinPrice',
        4: 'PriceExpired'
    };

    const chainChangeValues = (renderFuc, name, values) => {
        renderFuc(name, values, ["locationIds"]);
        setIsResetArea(Math.random());
        setChainQueryParams(values);
        setAreaQueryParams([]);
        setFilterParams([]);
    };

    const areaChangeValues = (renderFuc, name, values) => {
        renderFuc(name, values, ["chainIds"]);
        setIsResetChain(Math.random());
        setChainQueryParams([]);
        setAreaQueryParams(values);
        setFilterParams([]);
    };

    const filterComponent = [
        {
            render: (func, qparams) => <ChainDropdownMultipleSelectWithSearch name="chainIds" onChange={(name, values) => chainChangeValues(func, name, values)} getAllId={false}
                                                                              isReset={isResetChain}/>
        },
        {
            render: (func, qparams) => <AreaDropdownMultipleSelectWithSearch name="locationIds" onChange={(name, values) => areaChangeValues(func, name, values)} getAllId={false}
                                                                             isReset={isResetArea}/>
        },
        {
            render: (func, qparams) => <PropertyDropdownMultipleSelectWithSearch name="propertyIds" onChange={func} getAllId={false}
                                                                                 fetchEndpoint={endpoint.propertiesDdlByChainOrLocation}
                                                                                 queryParams={chainQueryParams.length > 0 ? chainQueryParams : areaQueryParams}
                                                                                 queryKey={chainQueryParams.length > 0 ? "chainIds" : "locationIds"}/>
        },
        {
            render: (func, qparams) => <CategoryDropdownMultipleSelectWithSearch name="categoriesIds" onChange={func} getAllId={false}/>
        },
    ];


    return (
        <GridDataPage
            reloadGridFlag={reloadGridFlag}
            fetchEndpoint={endpoint.service}
            actionInGrid={actionInGrid}
            langPrefix={langPrefix}
            sortColumnMapping={sortColumnMapping}
            UpsertPopup={UpsertServiceList} upsertPopupWidth={900}
            filterParams={filterParams}
            filterComponents={filterComponent}
            tableColumns={[
                {
                    title: 'Name',
                    dataIndex: 'name',
                    isEditableField: 'name',
                    key: '0',
                    width: 360,
                },
                {
                    title: 'Category',
                    dataIndex: 'categoryName',
                    key: '1',
                    render: text => <WrapText text={text}/>,
                },
                {
                    title: 'Retail Price',
                    width: 130,
                    dataIndex: 'price',
                    key: '2',
                    align: 'right',
                    render: text => <WrapText text={formatNum(text)}/>,
                },
                {
                    title: 'TA Price',
                    width: 130,
                    dataIndex: 'minPrice',
                    key: '3',
                    align: 'right',
                    render: text => <WrapText text={formatNum(text)}/>,
                },
                {
                    title: 'Expired',
                    width: 110,
                    dataIndex: 'priceExpired',
                    key: '4',
                    render: text => <WrapText text={formatDate(text)}/>,
                },
            ]}
        />
    );
};