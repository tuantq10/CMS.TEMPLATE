import React, { Fragment,useState } from 'react';
import { useTranslation } from "react-i18next";
import useReactRouter from 'use-react-router';
import { constants } from "../../commons/constants/constants";
import { callAuthApi } from "../../commons/utils/apiCaller";
import GridDataPage from '../../commons/components/GridDataPage/GridDataPage';
import { validPermission } from "../../commons/utils/function";
import { endpoint } from "../../commons/constants/endpoint";
import { InputInlineGrid } from "../../commons/components/Input";
import debounce from 'lodash/debounce';
import { async } from 'q';
export const LanguageList = () => {
    const currentRoutePath = 'langauges';
    const langPrefix = 'langauges';
    const [realoadPage,setReloadPage] = useState(0);
    const [itemUpdate,setitemUpdate] = useState(null);
    const sortColumnMapping = {
        0: 'Key'
    };
  
    const uploadItem =   async (id,language,value) => {
      var formValuesBody = {
          id:id,
          language:language,
          value:value
      }
      await callAuthApi(endpoint.language, formValuesBody, 'PUT');
    }
    
    const handleChange =  async (evt) => {
        await uploadItem(evt.target.id,evt.target.name,evt.target.value);
    };
    return (
        <Fragment>
                <GridDataPage
                    fetchEndpoint={endpoint.language}
                    langPrefix={langPrefix}
                    isServer={false}
                    isEditInline={true}
                    reloadGridFlag={realoadPage}
                    itemUpdate={itemUpdate}
                    sortColumnMapping={sortColumnMapping}
                    tableColumns={[
                        {
                            title: 'Id',
                            isEditableField: 'id',
                            dataIndex: 'id',
                            key: '0',
                        },
                        {
                            title: 'VN',
                            dataIndex: 'valueVN',
                            key: '1',
                            render: (text, record) => <InputInlineGrid  text={text} id={record.id} name="vn" handleChangeInput={handleChange} />,
                        },
                        {
                            title: 'EN',
                            dataIndex: 'valueEN',
                            key: '2',
                            render: (text, record) => <InputInlineGrid  text={text} id={record.id} name="en" handleChangeInput={handleChange}/>,
                        },
                        
                    ]}
              />
        </Fragment>
    );
};