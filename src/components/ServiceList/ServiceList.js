import React, { useState } from 'react';
import { validPermission } from "../../utils/function";
import { constants } from "../../constants/constants";
import { endpoint } from "../../constants/endpoint";
import { formatNum, formatDate } from "../../utils/function";
import GridDataPage from '../common/GridDataPage/GridDataPage';
import { WrapText } from "../common/CommonComponents/CommonComponents";

export const ServiceList = () => {
    const currentRoutePath = 'service-list';
    const langPrefix = 'serviceList';

    const [reloadGridFlag, setReloadGridFlag] = useState(0);
    const [filterParams, setFilterParams] = useState({});

    const actionInGrid = {
        allowInsert: validPermission(constants.Permissions.Insert, currentRoutePath),
        allowUpdate: validPermission(constants.Permissions.Update, currentRoutePath),
        allowDelete: validPermission(constants.Permissions.Delete, currentRoutePath),
    };

    const sortColumnMapping = {
        0: 'Name',
        1: 'CategoryName',
        2: 'Price',
        3: 'MinPrice',
        4: 'PriceExpired'
    };

    return (
        <GridDataPage
            reloadGridFlag={reloadGridFlag}
            fetchEndpoint={endpoint.service}
            actionInGrid={actionInGrid}
            langPrefix={langPrefix}
            sortColumnMapping={sortColumnMapping}
            // UpsertPopup={UpsertServiceList} upsertPopupWidth="900px"
            filterParams={filterParams}
            tableColumns={[
                {
                    title: 'Name',
                    dataIndex: 'name',
                    isEditableField: 'name',
                    key: '0',
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