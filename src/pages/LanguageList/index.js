import React, { Fragment, useState } from "react";
import { constants } from "../../commons/constants/constants";
import GridDataPage from "../../commons/components/GridDataPage/GridDataPage";
import { validPermission } from "../../commons/utils/function";
import { endpoint } from "../../commons/constants/endpoint";
import { InputLanguageInlineGrid } from "../../commons/components/Input";
export const LanguageList = () => {
  const currentRoutePath = "languages";
  const langPrefix = "languages";

  const sortColumnMapping = {
    id: "id",
    valueVN: "valueVN",
    valueEN: "valueEN"
  };

  return (
    <Fragment>
      {validPermission(constants.Permissions.view, currentRoutePath) && (
        <GridDataPage
          fetchEndpoint={endpoint.language}
          langPrefix={langPrefix}
          sortColumnMapping={sortColumnMapping}
          tableColumns={[
            {
              title: "Id",
              isEditableField: "id",
              dataIndex: "id",
            },
            {
              title: "VN",
              dataIndex: "valueVN",
              render: (text, record) => <InputLanguageInlineGrid text={text} endpoint={endpoint.language} id={record.id} name="vn" />
            },
            {
              title: "EN",
              dataIndex: "valueEN",
              render: (text, record) => <InputLanguageInlineGrid text={text} endpoint={endpoint.language} id={record.id} name="en" />
            }
          ]}
        />
      )}
    </Fragment>
  );
};
