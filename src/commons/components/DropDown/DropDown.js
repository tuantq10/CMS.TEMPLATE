import React, { useEffect, useState } from 'react';
import Picky from "react-picky";
import { fetchDataEffect } from "../../../services/actions/fetchDataEffect";
import { buildMultipleQueryParams, removeAccent } from "../../utils/function";
import { useTranslation } from "react-i18next";
import { endpoint } from "../../constants/endpoint";
import 'react-picky/dist/picky.css';
import './DropDown.less';
import { Form, Select, Tooltip } from "antd";
import CountryRegionData from "country-region-data/data.json";

export const PropertyDropdownMultipleSelectWithSearch = ({name, value, onChange, isReset, fetchEndpoint, getAllId, queryKey, queryParams, initSelectedId, numberOfWidth, initParams}) => {
    return (
        <MultipleSelectDropdownWithSearchY fetchEndpoint={fetchEndpoint || endpoint.propertiesDdl} name={name}
                                           value={value} onChange={onChange} langPrefix="property"
                                           isReset={isReset || true} queryKey={queryKey} getAllId={getAllId}
                                           queryParams={queryParams} initSelectedId={initSelectedId} numberOfWidth={numberOfWidth}
                                           initParams={initParams}
        />
    );
};

export const ChainDropdownMultipleSelectWithSearch = ({name, value, onChange, isReset, fetchEndpoint, getAllId, queryKey, queryParams, initSelectedId, numberOfWidth, initParams}) => {
    return (
        <MultipleSelectDropdownWithSearchY fetchEndpoint={fetchEndpoint || endpoint.chainsDll} name={name} value={value}
                                           onChange={onChange} langPrefix="chain" isReset={isReset || true} queryKey={queryKey}
                                           getAllId={getAllId} queryParams={queryParams} initSelectedId={initSelectedId}
                                           numberOfWidth={numberOfWidth} initParams={initParams}
        />
    );
};

export const AreaDropdownMultipleSelectWithSearch = ({name, value, onChange, isReset, fetchEndpoint, getAllId, queryKey, queryParams, initSelectedId, numberOfWidth, initParams}) => {
    return (
        <MultipleSelectDropdownWithSearchY fetchEndpoint={fetchEndpoint || endpoint.locationsDdl} name={name}
                                           value={value} langPrefix="area" onChange={onChange}
                                           isReset={isReset || true} queryKey={queryKey} getAllId={getAllId}
                                           queryParams={queryParams} initSelectedId={initSelectedId} numberOfWidth={numberOfWidth}
                                           initParams={initParams}
        />
    );
};

export const CategoryDropdownMultipleSelectWithSearch = ({name, value, onChange, isReset, fetchEndpoint, getAllId, queryKey, queryParams, initSelectedId, numberOfWidth, initParams}) => {
    return (
        <MultipleSelectDropdownWithSearchY fetchEndpoint={fetchEndpoint || endpoint.serviceCategoryDdl} name={name}
                                           value={value} onChange={onChange} langPrefix="categories"
                                           isReset={isReset || true} queryKey={queryKey} getAllId={getAllId}
                                           queryParams={queryParams} initSelectedId={initSelectedId} numberOfWidth={numberOfWidth}
                                           initParams={initParams}
        />
    );
};

export const MultipleSelectDropdownWithSearchY = ({fetchEndpoint, name, value, onChange, numberOfWidth, isReset, getAllId, queryKey, queryParams, initSelectedId, langPrefix, initParams}) => {
    const {t} = useTranslation();
    const {data, changeQueryParams} = fetchDataEffect(fetchEndpoint);
    const [selectedOptions, setSelectedOptions] = useState(value || []);
    const [fetchData, setFetchData] = useState(false);
    const isGetAllId = getAllId !== undefined ? getAllId : true;

    const selectAllText = t(`general.multipleSelect.${langPrefix}.all`);
    const manyPlaceHolderSelected = t(`general.multipleSelect.${langPrefix}.many`);
    const noPlaceholderSelected = t(`general.multipleSelect.${langPrefix}.no`);
    const [placeHolderText, setPlaceHolderText] = useState(selectAllText);

    const style = {
        width: numberOfWidth || '100%'
    };
    useEffect(() => {
        const builtQuery = buildMultipleQueryParams(queryParams, queryKey);
        if (fetchEndpoint && builtQuery) {
            changeQueryParams(builtQuery);
        }
    }, [queryKey, queryParams]);

    const onSelect = items => {
        setFetchData(true);
        setSelectedOptions(items);
    };

    const onClose = () => {
        if (fetchData) {
            setFetchData(false);
            onChange(name, returnSelectId(selectedOptions));
        }
    };

    const returnSelectId = items => {
        let resultArr = [];
        if ((items.length !== data.length) || (items.length === data.length && isGetAllId)) {
            if (items && items.length > 0)
                items.map(value => {
                    if (!resultArr.includes(value.id))
                        resultArr.push(value.id);
                });
            else
                resultArr = [-9999];
        }
        return resultArr;
    };

    const setAllOptionsFromData = (initSelectedId) => {
        let resultArr = [];
        data.map(value => {
            if (!resultArr.includes(value)) {
                if (initSelectedId !== undefined && initSelectedId.length > 0) {
                    if (initSelectedId.includes(value.id))
                        resultArr.push(value);
                } else {
                    resultArr.push(value);
                }
            }
        });
        return resultArr;
    };

    useEffect(() => {
        if (isReset) {
            setSelectedOptions(setAllOptionsFromData());
        }
    }, [isReset]);

    useEffect(() => {
        if (data && data.length > 0) {
            setPlaceHolderText(noPlaceholderSelected);
            setSelectedOptions(setAllOptionsFromData(initSelectedId));
        } else {
            setSelectedOptions([]);
        }
    }, [data]);

    useEffect(() => {
        if (initParams) {
            changeQueryParams(initParams);
        }
    }, []);

    return (
        <div style={style} className="picky-dropdown">
            <Picky value={selectedOptions} options={data} onChange={onSelect} open={false} valueKey="id"
                   placeholder={placeHolderText}
                   labelKey="value"
                   multiple={true}
                   includeSelectAll={true}
                   includeFilter={true}
                   dropdownHeight={250}
                   selectAllText={selectAllText}
                   allSelectedPlaceholder={selectAllText}
                   manySelectedPlaceholder={selectedOptions.length === data.length ? selectAllText : manyPlaceHolderSelected}
                   onClose={onClose}
                   numberDisplayed={2}
                   renderSelectAll={({filtered, tabIndex, allSelected, toggleSelectAll, multiple,}) => {
                       // Don't show if single select or items have been filtered.
                       if (multiple && !filtered) {
                           return (
                               <div tabIndex={tabIndex} role="option"
                                    className={allSelected ? 'option selected' : 'option'}
                                    onClick={toggleSelectAll} onKeyPress={toggleSelectAll}>
                                   <input type="checkbox" readOnly data-testid="selectall-checkbox" tabIndex={-1} checked={selectedOptions.length === data.length}
                                          aria-label="select all"/>
                                   <span data-testid="select-all-text">{selectAllText}</span>
                               </div>
                           );
                       }
                   }}/>
        </div>
    )
};

export const CountryDropdown = ({label, name, value, error, onChange, disabled}) => {
    const {t} = useTranslation();

    const handleChange = (val) => {
        onChange(name, val);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} hasFeedback>
            <Select showSearch name={name} value={value} onChange={handleChange} disabled={!!disabled}
                    placeholder={t('general.ddlCountryPlaceHolder')} optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {CountryRegionData.map(c => <Option key={c.countryName}>{c.countryName}</Option>)}
            </Select>
        </Form.Item>
    );
};

export const CityDropdown = ({label, name, value, error, onChange, disabled, country}) => {
    const {t} = useTranslation();

    const handleChange = (val) => {
        onChange(name, val);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} hasFeedback>
            <Select showSearch name={name}
                    value={value}
                    onChange={handleChange}
                    disabled={!!disabled}
                    placeholder={t('general.ddlCityPlaceHolder')}
                    optionFilterProp="children"
                    style={{width: '100%'}}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                    country && CountryRegionData.filter(c => c.countryName === country).map(c => c.regions.map(d => <Option key={d.name}>{d.name}</Option>))
                }
            </Select>
        </Form.Item>
    );
};

export const DropdownWithDataIdName = ({label, name, value, error, data, onChange, placeholder, disabled, focus}) => {

    const handleChange = (val, opt) => {
        const item = opt && opt.props && opt.props.item ? opt.props.item : {};
        onChange(name, val, item);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Select name={name} value={data && data.length > 0 && value ? `${value}` : null}
                        onChange={handleChange} disabled={!!disabled} showSearch
                        optionFilterProp="children" placeholder={placeholder} autoFocus={!!focus}
                        filterOption={(input, option) => removeAccent(option.props.children).indexOf(removeAccent(input)) >= 0}>
                    {data.map(d => <Select.Option key={d.id} disabled={!!d.disabled} item={d}>{d.name}</Select.Option>)}
                </Select>
            </Tooltip>
        </Form.Item>
    );
};

export const DropdownWithDataIdValue = ({label, name, value, error, data, onChange, placeholder, disabled, focus}) => {

    const handleChange = (val, opt) => {
        const item = opt && opt.props && opt.props.item ? opt.props.item : {};
        onChange(name, val, item);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Select name={name} value={data && data.length > 0 && value ? `${value}` : null}
                        onChange={handleChange} disabled={!!disabled} showSearch
                        optionFilterProp="children" placeholder={placeholder} autoFocus={!!focus}
                        filterOption={(input, option) => removeAccent(option.props.children).indexOf(removeAccent(input)) >= 0}>
                    {data.map(d => <Select.Option key={d.id} disabled={!!d.disabled} item={d}>{d.value}</Select.Option>)}
                </Select>
            </Tooltip>
        </Form.Item>
    );
};