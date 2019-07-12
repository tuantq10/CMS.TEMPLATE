import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Button, Typography } from 'antd';
import { InputText, InputPassword } from "../../commons/components/Input";
import { useSelector, useDispatch } from 'react-redux';
import { actLoginRequest } from "../../services/actions/actionAuth";
import { useTranslation } from "react-i18next";
import { alertMessage } from "../../commons/utils/function";
import logo from '../../assets/images/img-logo.jpg';
import { constants } from "../../commons/constants/constants";
import useReactRouter from 'use-react-router';
import './Login.less';

export const Login = () => {
    let captcha;
    const {t} = useTranslation();
    const {history} = useReactRouter();
    const {Title} = Typography;
    const [siteKey, setSiteKey] = useState(process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY);
    const [capChaValue, setCapChaValue] = useState('');
    const [formValues, setFormValues] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [disableLogin, setDisableLogin] = useState(true);
    const dispatch = useDispatch();
    const login = useSelector(state => state.reducerAuth);

    const onHandleSubmit = (evt) => {
        evt.preventDefault();
        setIsLoading(true);
        dispatch(actLoginRequest({...formValues, capChaValue: capChaValue}));
    };

    const onHandleChange = (name, value) => {
        setFormValues({...formValues, [name]: value});
    };

    const onCapChaHandleChange = (value) => {
        setCapChaValue(value === null ? '' : value);
    };

    const resetCapCha = () => {
        captcha.reset();
        setCapChaValue('');
        setDisableLogin(true)
    };

    const reDirect = (defaultPath) => {
        history.go(defaultPath);
    };

    useEffect(() => {
        if (formValues && formValues.username && formValues.password && capChaValue)
            setDisableLogin(false);
    }, [formValues.username, formValues.password, capChaValue]);

    useEffect(() => {
        const defaultPath = login.isSuccess ? localStorage.getItem(constants.DefaultPathName) : '';
        if (login && !login.isSuccess) {
            setIsLoading(false);
            setDisableLogin(false);
            if (login.errorMessage)
                alertMessage(`${t('general.error')}`, login.errorMessage, true);
            resetCapCha();
        } else if (login && login.isSuccess && defaultPath) {
            reDirect(defaultPath);
        }
    }, [login]);

    return (
        <div className={`login-box ${siteKey === '' ? `login-box-without-capcha` : ``}`}>
            <div className="text-center">
                <Title level={2}>Login</Title>
                <img src={logo} alt="logo"/>
            </div>
            <Form onSubmit={onHandleSubmit} className="login-form">
                <InputText focus name="username" onChange={onHandleChange} value={formValues.username} placeholder="Email"/>
                <InputPassword name="password" type="password" onChange={onHandleChange} value={formValues.password} placeholder="Password"/>
                <Form.Item>
                    {siteKey !== '' && <ReCAPTCHA onChange={onCapChaHandleChange} sitekey={siteKey} ref={el => {
                        captcha = el;
                    }}/>}
                </Form.Item>
                <Form.Item>
                    <Button loading={isLoading} disabled={disableLogin} type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};