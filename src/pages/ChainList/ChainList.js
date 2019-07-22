import React, { Fragment } from 'react';
import { useTranslation } from "react-i18next";
import { endpoint } from "../../commons/constants/endpoint";
import { validPermission, formatUTCDateTime } from "../../commons/utils/function";
import { constants } from "../../commons/constants/constants";
import GridDataPage from '../../commons/components/GridDataPage/GridDataPage';
import { UpsertChainList } from './UpsertChainList';
import { WrapText } from "../../commons/components/CustomComponents/CustomComponents";


export const ChainList = () => {
    const currentRoutePath = 'chain-list';
    const langPrefix = 'chainList';
    const {t} = useTranslation();

    const actionInGrid = {
        searchHelpText: "Support search name",
        allowInsert: validPermission(constants.Permissions.create, currentRoutePath),
        allowUpdate: validPermission(constants.Permissions.update, currentRoutePath),
        allowDelete: validPermission(constants.Permissions.delete, currentRoutePath),
    };

    const sortColumnMapping = {
        name: 'Name',
        createdDate: 'CreatedDate'
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
                    },
                    {
                        title: 'Created Date',
                        align: 'center',
                        width: '150px',
                        dataIndex: 'createdDate',
                        render: text => <WrapText text={formatUTCDateTime(text)}/>,
                    },
                ]}
            />
            }
        </Fragment>
    );
};