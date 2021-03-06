import React, { Fragment } from 'react';
import { useTranslation } from "react-i18next";
import { constants } from "../../commons/constants/constants";
import { validPermission } from "../../commons/utils/function";
import CreateFormPage from '../../commons/components/CreateFormPage/CreateFormPage';
import { UpsertServiceList } from './UpsertServiceList';


export const CreateServiceItem = () => {
    const currentRoutePath = 'create-service';
    const langPrefix = 'serviceList';
    const {t} = useTranslation();

    return (
        <Fragment>
            {validPermission(constants.Permissions.Insert, currentRoutePath) &&
            <CreateFormPage
                currentRoutePath={currentRoutePath}
                langPrefix={langPrefix}
                UpsertPopup={UpsertServiceList}
            />
            }
        </Fragment>
    );
};