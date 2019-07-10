import React, { Fragment } from 'react';
import GridDataPage from '../../commons/components/GridDataPage/GridDataPage';
import { useTranslation } from "react-i18next";
import { formatUTCDateTime, validPermission } from "../../commons/utils/function";
import { constants } from "../../commons/constants/constants";
import { endpoint } from "../../commons/constants/endpoint";
import { UpsertRoles } from "./UpsertRoles";
import { WrapText } from "../../commons/components/CustomComponents/CustomComponents";

export const Roles = () => {
    const currentRoutePath = 'roles';
    const langPrefix = 'roles';

    const {t} = useTranslation();

    const actionInGrid = {
        searchHelpText: "Support search name",
        allowInsert: validPermission(constants.Permissions.create, currentRoutePath),
        allowUpdate: validPermission(constants.Permissions.update, currentRoutePath),
        allowDelete: validPermission(constants.Permissions.delete, currentRoutePath),
    };

    const sortColumnMapping = {
        0: 'Name',
        1: 'CreatedDate'
    };

    return (
        <Fragment>
            {validPermission(constants.Permissions.view, currentRoutePath) &&
            <GridDataPage
                fetchEndpoint={endpoint.role}
                actionInGrid={actionInGrid}
                langPrefix={langPrefix}
                sortColumnMapping={sortColumnMapping}
                UpsertPopup={UpsertRoles}
                upsertPopupWidth={800}
                tableColumns={[
                    {
                        title: 'Name',
                        isEditableField: 'name',
                        dataIndex: 'name',
                        key: '0',
                        width: 800,
                    },
                    {
                        title: 'Created Date',
                        dataIndex: 'createdDate',
                        key: '1',
                        render: text => <WrapText text={formatUTCDateTime(text)}/>,
                    }
                ]}
            />}
        </Fragment>
    );

};