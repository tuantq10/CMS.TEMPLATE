import React, { Fragment } from 'react';
import { useTranslation } from "react-i18next";
import { endpoint } from "../../constants/endpoint";
import { validPermission, formatUTCDateTime } from "../../utils/function";
import { constants } from "../../constants/constants";
import GridDataPage from '../common/GridDataPage/GridDataPage';
// import CreateFormPage from '../../components/common/CreateFormPage';
import { UpsertChainList } from './UpsertChainList';
import { WrapText } from "../common/CommonComponents/CommonComponents";


export default function () {
    const currentRoutePath = 'chain-list';
    const langPrefix = 'chainList';
    const {t} = useTranslation();

    const actionInGrid = {
        allowInsert: validPermission(constants.Permissions.Insert, currentRoutePath),
        allowUpdate: validPermission(constants.Permissions.Update, currentRoutePath),
        allowDelete: validPermission(constants.Permissions.Delete, currentRoutePath),
    };

    const sortColumnMapping = {
        0: 'Name',
        1: 'CreatedDate'
    };

    return (
        <Fragment>
            {validPermission(constants.Permissions.View, currentRoutePath) &&
            <GridDataPage
                fetchEndpoint={endpoint.chainsNewType}
                actionInGrid={actionInGrid}
                langPrefix={langPrefix}
                sortColumnMapping={sortColumnMapping}
                UpsertPopup={UpsertChainList}
                tableColumns={[
                    {
                        title: 'Name',
                        isEditableField: 'name',
                        dataIndex: 'name',
                        key: '0'
                    },
                    {
                        title: 'Created Date',
                        align: 'center',
                        width: '150px',
                        dataIndex: 'createdDate',
                        render: text => <WrapText text={formatUTCDateTime(text)}/>,
                        key: '1'
                    },
                ]}
            />
            }

            {/*{!validPermission(constants.Permissions.View, currentRoutePath) && validPermission(constants.Permissions.Insert, currentRoutePath) &&*/}
            {/*<CreateFormPage*/}
            {/*    currentRoutePath={currentRoutePath}*/}
            {/*    langPrefix={langPrefix}*/}
            {/*    UpsertPopup={UpsertChainList}*/}
            {/*/>*/}
            {/*}*/}
        </Fragment>
    );
}