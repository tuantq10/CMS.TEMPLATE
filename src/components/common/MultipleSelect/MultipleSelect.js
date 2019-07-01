import React, { useEffect, useState } from 'react';
import { Select, Divider, Tooltip, Form } from "antd";
import { endpoint } from "../../../constants/endpoint";
import { useTranslation } from "react-i18next";
import { fetchDataEffect } from "../../../actions/fetchDataEffect";
import './MultipleSelect.less';
import { removeAccent } from "../../../utils/function";

export const PropertyMultiSelect = ({name, value, error, onChange, queryParams}) => {
    const {t} = useTranslation();

    return (
        <MultiSelectX
            fetchEndpoint={endpoint.property} queryParams={queryParams}
            name={name} value={value} error={error} onChange={onChange}
            placeholder={t('general.ddlPropertyPlaceHolder')}
        />
    );
};

export const ServiceMultiSelect = ({name, value, error, onChange, queryParams, reloadFlag}) => {
    const {t} = useTranslation();

    return (
        <MultiSelectX
            fetchEndpoint={endpoint.service} queryParams={queryParams}
            name={name} value={value} error={error} onChange={onChange}
            placeholder={t('general.ddlServicePlaceHolder')} reloadFlag={reloadFlag}
        />
    );
};

const MultiSelectX = ({fetchEndpoint, name, value, error, onChange, placeholder, queryParams, reloadFlag, label}) => {
    const {data, reloadData} = fetchDataEffect(`${fetchEndpoint}/ddl`, queryParams);
    const [tags, setTags] = useState([]);
    const extraItems = [{id: '-88888888', value: 'Select All'}, {id: '-99999999', value: 'Remove All'}];

    useEffect(() => {
        if (reloadFlag && reloadFlag.reload) {
            reloadData();
            reloadFlag.callback && reloadFlag.callback({...reloadFlag, reload: false});
        }
    }, [reloadFlag]);

    useEffect(() => {
        let hasVals = data && data.length > 0 && value && value.length > 0;
        if (hasVals && tags.length === 0) {
            let newTags = data.filter(x => value.indexOf(x.id) > -1);
            newTags = newTags.map(x => idFromOption(x));
            setTags(newTags);
        } else if (tags.length > 0 && !hasVals) {
            setTags([]);
        }
    }, [data, value]);

    const idFromOption = (item) => {
        return item.id;
    };

    const onSelect = (e, item) => {
        let newTags = [];
        if (item.id === "-99999999")
            newTags = [];
        else if (item.id === "-88888888")
            newTags = [...data.map(x => idFromOption(x))];
        else
            newTags = [...tags, item];
        setTags(newTags);
        onChange && onChange(name, newTags);
    };

    const handleOnChange = value => {
        setTags(value);
        onChange && onChange(name, value);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Select mode="tags" defaultValue={value} value={tags} placeholder={placeholder} onChange={handleOnChange}
                        onSelect={onSelect} showSearch
                        filterOption={(input, option) => removeAccent(option.props.children).indexOf(removeAccent(input)) >= 0}
                        optionFilterProp="children"
                        dropdownRender={menu => (
                            <div>
                                {extraItems.map(d =>
                                    <div key={d.id} onClick={(e) => onSelect(e, d)} className="multiple-select-custom-action">
                                        {d.value}
                                    </div>)}
                                <Divider className="multiple-select-divider"/>
                                {menu}
                            </div>
                        )}
                >
                    {data.map(d => <Select.Option key={d.id} disabled={!!d.disabled} item={d}>{d.value}</Select.Option>)}
                </Select>
            </Tooltip>
        </Form.Item>
    );
};