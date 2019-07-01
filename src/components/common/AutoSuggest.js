import React from 'react';
import { Form, Select, Tooltip, Icon } from 'antd';
import debounce from 'lodash/debounce';
import { useTranslation } from "react-i18next";
import { fetchDropdownDataEffect } from '../../actions/fetchDropdownDataEffect';
import { endpoint } from '../../constants/endpoint';


export const SICAutoSuggest = ({label, name, value, error, onChange, disabled}) => {
    const fetchUrl = endpoint.ddl.sic;
    const placeholder = 'ddlSICPlaceHolder';
    return (
        <AutoSuggestX {...{label, name, value, error, onChange, placeholder, disabled, fetchUrl}} />
    );
};

export const AccountAutoSuggest = ({label, name, value, error, onChange, disabled}) => {
    const fetchUrl = endpoint.ddl.accounts;
    const placeholder = 'ddlAccountPlaceHolder';
    return (
        <AutoSuggestX {...{label, name, value, error, onChange, placeholder, disabled, fetchUrl}} />
    );
};

export const ContactAutoSuggest = ({label, name, value, error, onChange, disabled, accountId}) => {
    const fetchUrl = endpoint.ddl.contacts.replace('{accountId}', accountId);
    const placeholder = 'ddlBookerPlaceHolder';
    return (
        <AutoSuggestX {...{label, name, value, error, onChange, placeholder, disabled, fetchUrl}} />
    );
};

const AutoSuggestX = ({label, name, value, error, onChange, placeholder, disabled, fetchUrl}) => {
    const {t} = useTranslation();
    const {isLoading, data, changeFetchUrl} = fetchDropdownDataEffect('');

    const fetchData = debounce((keySearch) => {
        if (keySearch)
            changeFetchUrl(`${fetchUrl}?keySearch=${keySearch}`);
    }, 500);

    const handleChange = (value, opt) => {
        const item = opt && opt.props && opt.props.item ? opt.props.item : {};
        onChange(value || {key: null, label: null}, item);
    };

    return (
        <Form.Item label={label} validateStatus={error ? 'error' : (isLoading ? 'validating' : '')} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Select
                    value={value && name ? {key: value, label: name} : []}
                    onSearch={fetchData} onChange={handleChange}
                    showSearch allowClear labelInValue suffixIcon={<Icon type="search"/>} placeholder={t(`general.${placeholder}`)}
                    filterOption={false} disabled={!!disabled} style={{width: '100%'}} notFoundContent={null}
                >
                    {data.map(d => <Select.Option key={d.id} item={d}>{d.value}</Select.Option>)}
                </Select>
            </Tooltip>
        </Form.Item>
    );
};