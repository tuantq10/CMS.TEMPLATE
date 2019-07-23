import React, { Fragment, useState } from 'react';
import GridDataPage from "../GridDataPage/GridDataPage";
import { endpoint } from "../../constants/endpoint";
import { formatUTCDateTime } from "../../utils/function";
import { AuditDetails } from "./AuditDetails";
import './Audits.less';
import { useTranslation } from "react-i18next";

export const Audits = ({id, tableName, columnName}) => {
    const {t} = useTranslation();
    const langPrefix = 'audits';
    const filterParams = {id: id, tableName: tableName, columnName: columnName};
    const actionInGrid = {allowSearch: false, showTableHeader: false};

    return (
        <Fragment>
            <GridDataPage
                className="grid-expanded"
                fetchEndpoint={endpoint.audit}
                langPrefix={langPrefix}
                filterParams={filterParams}
                actionInGrid={actionInGrid}
                ExpandedRowComponent={AuditDetails}
                tableColumns={[
                    {
                        key: '0',
                        render: record => t(`${langPrefix}.${record.action.toLowerCase()}`) + t(`${langPrefix}.by`) + record.creator + t(`${langPrefix}.at`) + formatUTCDateTime(record.createdDate),
                    }
                ]}

            />
        </Fragment>
    );
};