import { DatePicker as AntDatePicker, Form, Input, Tooltip, Icon } from 'antd';
import * as moment from 'moment';
import React, { useState, forwardRef } from 'react';
import { constants } from "../../constants/constants";
import NumberFormat from 'react-number-format';
import { useTranslation } from "react-i18next";

export const InputText = ({label, name, value, error, onChange, maxLength, disabled, className, placeholder, focus, type}) => {
    const handleChange = (evt) => {
        onChange && onChange(name, evt.target.value);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} className={className || ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Input placeholder={placeholder || ''} type={type || 'text'}
                       name={name} value={value || ''} onChange={handleChange}
                       disabled={!!disabled} autoFocus={!!focus}
                       maxLength={maxLength || 500} autoComplete="off"/>
            </Tooltip>
        </Form.Item>
    );
};

export const InputNumOnly = ({label, name, value, error, onChange, maxLength, disabled, className, placeholder, focus}) => {
    const handleChange = (evt) => {
        const value = evt.target.value;
        if (value !== '') {
            const re = /^[0-9\b]+$/;
            if (!re.test(value)) {
                return;
            }
        }
        onChange && onChange(name, value);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} className={className || ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Input placeholder={placeholder || ''}
                       name={name} value={value || ''} onChange={handleChange}
                       disabled={!!disabled} autoFocus={!!focus}
                       maxLength={maxLength || 500} autoComplete="off"/>
            </Tooltip>
        </Form.Item>
    );
};

export const TextArea = ({label, name, value, error, onChange, maxLength, disabled, className, placeholder, focus, rows}) => {
    const handleChange = (evt) => {
        onChange && onChange(name, evt.target.value);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} className={className || ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Input.TextArea placeholder={placeholder || ''}
                                name={name} value={value || ''} onChange={handleChange}
                                disabled={!!disabled} autoFocus={!!focus} rows={rows || 3}
                                maxLength={maxLength || 500} autoComplete="off"/>
            </Tooltip>
        </Form.Item>
    );
};

export const AntDateTimeRangePicker = ({onChange, startOnToDate, dateFormat, fromDate, toDate, diffDate = 7, emptyAtBegin = false, allowClear = true}) => {
    const {RangePicker} = AntDatePicker;
    const startOnToDateValue = [moment(), moment().add(diffDate, 'days')];
    const NotStartOnToDateValue = [moment().add(-diffDate, 'days'), moment()];
    const initValue = fromDate && toDate ? ([moment(fromDate), moment(toDate)]) :
        (startOnToDate ? startOnToDateValue : NotStartOnToDateValue);
    const [cVal, setCVal] = useState(initValue);

    const onChangeVal = dates => {
        let fDates = [];
        if (dates.length > 0) {
            fDates = dates.map(val => {
                return val.format(constants.DateTimeFormatFromDB)
            });
        } else {
            const minDate = moment(constants.MinDateDefault).format(constants.DateTimeFormatFromDB);
            fDates = [minDate, minDate];
        }
        onChange(fDates);
    };

    return (
        <div className="div-ant-range-picker">
            <RangePicker defaultValue={!emptyAtBegin ? cVal : []} format={dateFormat || constants.DatePickerFormat} onChange={onChangeVal}
                         allowClear={allowClear}/>
        </div>
    );
};

export const InputNum = forwardRef((props, ref) => {
    const {label, name, value, error, onChange, disabled, placeholder, isWarning, focus, type, decimalScale = 2, sep = true, max = 0} = props;

    const handleChange = (val) => {
        if (max > 0 && val && val.floatValue > max)
            val = {...val, floatValue: max};
        onChange && onChange(name, val.floatValue)
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : (!!isWarning ? 'warning' : '')} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <NumberFormat
                    ref={ref} className="ant-input"
                    placeholder={placeholder || ''} displayType={type || 'input'}
                    name={name} value={value || ''} onValueChange={handleChange}
                    focus={(!!focus).toString()} disabled={!!disabled}
                    maxLength={20} thousandSeparator={sep} allowNegative={false}
                    decimalScale={decimalScale}
                />
            </Tooltip>
        </Form.Item>
    );
});

export const TableSearch = ({onSearch}) => {
    const {t} = useTranslation();
    const [keySearchParam, setKeySearchParams] = useState('');

    const onHandleSearch = () => {
        onSearch(keySearchParam);
    };

    return (
        <Form onSubmit={evt => onSearch(keySearchParam, evt)}>
            <Input placeholder={t('general.search')} onChange={evt => setKeySearchParams(evt.target.value)}
                   onPressEnter={onHandleSearch} allowClear={true}
                   prefix={<Icon type="search"/>}
            />
        </Form>
    );
};