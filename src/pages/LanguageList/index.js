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
    0: "id",
    1: "valueVN",
    2: "valueEN"
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
              key: "0"
            },
            {
              title: "VN",
              dataIndex: "valueVN",
              key: "1",
              render: (text, record) => <InputLanguageInlineGrid text={text} endpoint={endpoint.language} id={record.id} name="vn" />
            },
            {
              title: "EN",
              dataIndex: "valueEN",
              key: "2",
              render: (text, record) => <InputLanguageInlineGrid text={text} endpoint={endpoint.language} id={record.id} name="en" />
            }
          ]}
        />
      )}
    </Fragment>
  );
};
