import React, { Fragment, useEffect, useState } from 'react';
import GridDataPage from '../../commons/components/GridDataPage/GridDataPage';
import { useTranslation } from "react-i18next";
import { formatUTCDateTime, validPermission } from "../../commons/utils/function";
import { constants } from "../../commons/constants/constants";
import { endpoint } from "../../commons/constants/endpoint";
import { UpsertRoles } from "./UpsertRoles";
import { WrapText } from "../../commons/components/CustomComponents/CustomComponents";
import { actGetAllMenuRequest } from "../../services/actions/actionMenu";
import { useDispatch, useSelector } from "react-redux";

export const Roles = () => {
    const currentRoutePath = 'roles';
    const langPrefix = 'roles';
    const dispatch = useDispatch();
    const menusState = useSelector(state => state.reducerMenu);
    const [allMenus, setAllMenus] = useState([]);

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

    useEffect(() => {
        dispatch(actGetAllMenuRequest());
    }, []);


    useEffect(() => {
        if (menusState !== null && menusState && menusState.allMenus && menusState.allMenus.length > 0) {
            setAllMenus(menusState.allMenus);
        }
    }, [menusState]);

    return (
        <Fragment>
            {validPermission(constants.Permissions.view, currentRoutePath) &&
            <GridDataPage
                fetchEndpoint={endpoint.role}
                actionInGrid={actionInGrid}
                langPrefix={langPrefix}
                sortColumnMapping={sortColumnMapping}
                UpsertPopup={UpsertRoles}
                upsertPopupWidth={850}
                upsertExtraParams={{allMenusComponents: allMenus}}
                wrapModalClassName="role-upsert-modal-container"
                tableColumns={[
                    {
                        title: t(`${langPrefix}.txtRoleName`),
                        isEditableField: 'name',
                        dataIndex: 'name',
                    },
                    {
                        title: 'Created Date',
                        dataIndex: 'createdDate',
                        render: text => <WrapText text={formatUTCDateTime(text)}/>,
                        width: 150,
                    }
                ]}
            />}
        </Fragment>
    );

};