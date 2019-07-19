import { DatePicker as AntDatePicker, Form, Input, Tooltip, Icon, Checkbox } from 'antd';
import * as moment from 'moment';
import React, { useState, forwardRef } from 'react';
import { constants } from "../constants/constants";
import NumberFormat from 'react-number-format';
import { useTranslation } from "react-i18next";
import debounce from 'lodash/debounce';

export const InputInlineGrid = ({name, id ,text , handleChangeInput}) => {
    const [value, setValue] = useState(text);
    const handleChange =  (evt) => {
        setValue(evt.target.value);  
    };
    const handleSubmit =  (evt) => {
        handleChangeInput &&  handleChangeInput(evt);  
    };
    return (
        <Input type="text" value={value} id={id} name={name} onChange={handleChange} onBlur={handleSubmit} onPressEnter={handleSubmit}/>
    );
};

export const InputText = ({label, name, value, error, onChange, maxLength, disabled, className, placeholder, focus, type, onSubmit}) => {
    const handleChange = (evt) => {
        onChange && onChange(name, evt.target.value);
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        onSubmit && onSubmit();
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} className={className || ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Input placeholder={placeholder || ''} type={type || 'text'}
                       name={name} value={value || ''} onChange={handleChange}
                       disabled={!!disabled} autoFocus={!!focus}
                       maxLength={maxLength || 500} autoComplete="off" onPressEnter={handleSubmit}/>
            </Tooltip>
        </Form.Item>
    );
};

export const InputNumOnly = ({label, name, value, error, onChange, maxLength, disabled, className, placeholder, focus, onSubmit}) => {
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

    const handleSubmit = (evt) => {
        evt.preventDefault();
        onSubmit && onSubmit();
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} className={className || ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Input placeholder={placeholder || ''} onPressEnter={handleSubmit}
                       name={name} value={value || ''} onChange={handleChange}
                       disabled={!!disabled} autoFocus={!!focus}
                       maxLength={maxLength || 500} autoComplete="off"/>
            </Tooltip>
        </Form.Item>
    );
};

export const TextArea = ({label, name, value, error, onChange, maxLength, disabled, className, placeholder, focus, rows, autosize}) => {
    const handleChange = (evt) => {
        onChange && onChange(name, evt.target.value);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} className={className || ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Input.TextArea placeholder={placeholder || ''} autosize={autosize}
                                name={name} value={value || ''} onChange={handleChange}
                                disabled={!!disabled} autoFocus={!!focus} rows={rows || 3}
                                maxLength={maxLength || 500} autoComplete="off"/>
            </Tooltip>
        </Form.Item>
    );
};

export const InputPassword = ({label, name, value, error, onChange, maxLength, disabled, className, placeholder, focus, onSubmit}) => {
    const handleChange = (evt) => {
        onChange && onChange(name, evt.target.value);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} className={className || ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <Input.Password placeholder={placeholder || ''} onPressEnter={onSubmit}
                                name={name} value={value || ''} onChange={handleChange}
                                disabled={!!disabled} autoFocus={!!focus}
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

export const DatePicker = ({label, name, value, error, onChange, placeHolder, disabled, className, allowClear = true}) => {
    const {t} = useTranslation();

    const handleChange = date => {
        onChange(name, date ? date.format(constants.DateFormatFromDB) : null);
    };

    return (
        <Form.Item label={label} validateStatus={!!error ? 'error' : ''} hasFeedback>
            <Tooltip placement="topRight" title={error || ''}>
                <AntDatePicker
                    name={name} className={className || ''}
                    value={moment(value).isValid() ? moment(value) : null}
                    onChange={handleChange}
                    disabled={!!disabled}
                    format={constants.DatePickerFormat}
                    placeholder={placeHolder || t('general.selectDatePlaceHolder')}
                    allowClear={allowClear}/>
            </Tooltip>
        </Form.Item>
    );
};

export const InputNum = forwardRef((props, ref) => {
    const {label, name, value, error, onChange, disabled, placeholder, isWarning, focus, type, onSubmit, decimalScale = 2, sep = true, max = 0} = props;

    const handleChange = (val) => {
        if (max > 0 && val && val.floatValue > max)
            val = {...val, floatValue: max};
        onChange && onChange(name, val.floatValue)
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        onSubmit && onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Form.Item label={label} validateStatus={!!error ? 'error' : (!!isWarning ? 'warning' : '')} hasFeedback>
                <Tooltip placement="topRight" title={error || ''}>
                    <NumberFormat autoComplete="off"
                                  ref={ref} className="ant-input"
                                  placeholder={placeholder || ''} displayType={type || 'input'}
                                  name={name} value={value || ''} onValueChange={handleChange}
                                  focus={(!!focus).toString()} disabled={!!disabled}
                                  maxLength={20} thousandSeparator={sep} allowNegative={false}
                                  decimalScale={decimalScale}
                    />
                </Tooltip>
            </Form.Item>
        </form>
    );
});

export const TableSearch = ({onSearch, helpText, placeholder}) => {
    const {t} = useTranslation();
    const [keySearchParam, setKeySearchParams] = useState('');

    const onHandleSearch = () => {
        onSearch(keySearchParam);
    };

    const handleChange = (evt) => {
        const value = evt.target.value;
        if (value === '')
            searchOnClear('');
        else
            searchOnClear(evt.target.value)
    };

    const searchOnClear = debounce((keySearch) => {
        onSearch(keySearch);
    }, 1000);

    return (
        <Input placeholder={placeholder || t('general.search')} onChange={handleChange}
               onPressEnter={onHandleSearch} allowClear={true}
               prefix={<Icon type="search"/>}
               suffix={
                   helpText && <Tooltip title={helpText}>
                       <Icon type="info-circle"/>
                   </Tooltip>
               }
        />
    );
};

export const CheckBoxCustom = ({label, name, value, error, onChange, disabled, className}) => {
    const handleChange = (evt) => {
        onChange && onChange(name, evt.target.checked);
    };

    return (
        <Form.Item label={label} hasFeedback>
            <Checkbox name={name} checked={value || false} onChange={handleChange} disabled={!!disabled}/>
        </Form.Item>
    );
};