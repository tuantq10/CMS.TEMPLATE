import React, { Fragment, useState } from 'react';
import GridDataPage from "../GridDataPage/GridDataPage";
import { endpoint } from "../../constants/endpoint";
import { constants } from "../../constants/constants";
import { WrapText } from "../CustomComponents/CustomComponents";

export const AuditDetails = ({id}) => {
    const langPrefix = "auditLogDetails";
    const actionInGrid = {allowSearch: false, disablePaging: true, gridBordered: true};
    const [endPointWithId, setEndPointWithId] = useState(endpoint.audit + constants.Slash + id);
    const filterParams = { pageSize: 100 };
    return (
        <Fragment>
            <GridDataPage
                className="grid-expanded-details"
                fetchEndpoint={endPointWithId}
                langPrefix={langPrefix}
                actionInGrid={actionInGrid}
                filterParams={filterParams}
                tableColumns={[
                    {
                        title: 'Field Name',
                        dataIndex: 'fieldName',
                        key: '0',
                        width: 250,
                        render: text => <WrapText text={text}/>
                    },
                    {
                        title: 'Old Value',
                        dataIndex: 'oldValue',
                        key: '1',
                        width: 250,
                        render: text => <WrapText text={text}/>
                    },
                    {
                        title: 'New Value',
                        dataIndex: 'newValue',
                        key: '2',
                        width: 250,
                        render: text => <WrapText text={text}/>
                    },
                ]}
            />
        </Fragment>
    );
};