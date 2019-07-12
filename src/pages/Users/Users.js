import React, { Fragment } from 'react';
import { useTranslation } from "react-i18next";
import { constants } from "../../commons/constants/constants";
import GridDataPage from '../../commons/components/GridDataPage/GridDataPage';
import { validPermission } from "../../commons/utils/function";
import { endpoint } from "../../commons/constants/endpoint";
import { WrapText } from "../../commons/components/CustomComponents/CustomComponents";
import { CheckBoxCustom } from "../../commons/components/Input";
import { UpsertUsers } from "./UpsertUsers";

export const Users = () => {
    const currentRoutePath = 'users';
    const langPrefix = 'users';

    const {t} = useTranslation();

    const actionInGrid = {
        searchHelpText: "Support search First Name/ Last Name/ UserName/ PhoneNumber/ Role Name",
        allowInsert: validPermission(constants.Permissions.create, currentRoutePath),
        allowUpdate: validPermission(constants.Permissions.update, currentRoutePath),
        allowDelete: validPermission(constants.Permissions.delete, currentRoutePath),
    };

    const sortColumnMapping = {
        0: 'FullName',
        1: 'UserName'
    };

    return (
        <Fragment>
            {validPermission(constants.Permissions.view, currentRoutePath) &&
            <GridDataPage
                fetchEndpoint={endpoint.user}
                actionInGrid={actionInGrid}
                langPrefix={langPrefix}
                sortColumnMapping={sortColumnMapping}
                UpsertPopup={UpsertUsers}
                tableColumns={[
                    {
                        title: 'Full Name',
                        isEditableField: 'fullName',
                        dataIndex: 'fullName',
                        key: '0',
                    },
                    {
                        title: 'User Name',
                        dataIndex: 'username',
                        key: '1',
                        render: text => <WrapText text={text}/>,
                    },
                    {
                        title: 'Phone Number',
                        dataIndex: 'phoneNumber',
                        key: '2',
                    },
                    {
                        title: 'Role Name',
                        dataIndex: 'roleName',
                        key: '3',
                        render: text => <WrapText text={text}/>,
                    },
                    {
                        title: 'Active',
                        dataIndex: 'deactivated',
                        key: '4',
                        render: text => <CheckBoxCustom value={!text} disabled={true}/>,
                        align: 'center',
                        width: 30
                    },
                    {
                        title: 'Locked',
                        dataIndex: 'isLocked',
                        key: '5',
                        render: text => <CheckBoxCustom value={text} disabled={true}/>,
                        align: 'center',
                        width: 30
                    },
                ]}
            />}
        </Fragment>
    );
};