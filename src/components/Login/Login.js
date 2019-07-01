import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Button, Typography } from 'antd';
import { InputText } from "../common/Input";
import { callApi } from "../../utils/apiCaller";
import { endpoint } from "../../constants/endpoint";
import { useSelector, useDispatch } from 'react-redux';
import { actLoginRequest } from "../../actions/actionAuth";
import { useTranslation } from "react-i18next";
import { alertMessage } from "../../utils/function";
import logo from '../../assets/images/img-logo.jpg';
import { constants } from "../../constants/constants";
import useReactRouter from 'use-react-router';
import './Login.less';

export const Login = () => {
    const {t} = useTranslation();
    const {history} = useReactRouter();
    const {Title} = Typography;
    const [siteKey, setSiteKey] = useState('');
    const [capChaValue, setCapChaValue] = useState('');
    const [formValues, setFormValues] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const login = useSelector(state => state.reducerAuth);

    const fetchSiteKeyData = async () => {
        try {
            const returnData = await callApi(endpoint.capCha, null, {}, 'POST');
            if (returnData.status === 200 && returnData.data && returnData.data.data) {
                setSiteKey(returnData.data.data);
            }
        } catch (error) {
        }
    };

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
        window.grecaptcha.reset();
        setFormValues({...formValues, capChaValue: ''});
    };

    const reDirect = (defaultPath) => {
        history.go(defaultPath);
    };

    useEffect(() => {
        fetchSiteKeyData();
    }, []);

    useEffect(() => {
        const defaultPath = localStorage.getItem(constants.DefaultPathName);
        if (login && !login.isSuccess && login.errorMessage) {
            setIsLoading(false);
            const message = typeof login.errorMessage === 'string' && login.errorMessage.toLowerCase().indexOf('lock') > -1 ?
                `${t('login.errorLock')}` : `${t('login.errorLogin')}`;
            alertMessage(`${t('general.error')}`, message, true);
            resetCapCha();
        } else if (login && login.isSuccess && defaultPath) {
            reDirect(defaultPath);
        }
    }, [login]);

    return (
        <div className="login-box">
            <div className="text-center">
                <Title level={2}>Login</Title>
                <img src={logo} alt="logo"/>
            </div>
            <Form onSubmit={onHandleSubmit} className="login-form">
                <InputText focus name="email" type="email" onChange={onHandleChange} value={formValues.email} placeholder="Email"/>
                <InputText name="password" type="password" onChange={onHandleChange} value={formValues.password} placeholder="Password"/>
                <Form.Item>
                    {siteKey !== '' && <ReCAPTCHA onChange={onCapChaHandleChange} sitekey={siteKey}/>}
                </Form.Item>
                <Form.Item>
                    <Button loading={isLoading} disabled={capChaValue === ''} type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};