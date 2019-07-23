import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Button, Typography, Tooltip } from 'antd';
import { InputText, InputPassword } from "../../commons/components/Input";
import { useSelector, useDispatch } from 'react-redux';
import { actLoginRequest, actLoginVerifyOTPRequest } from "../../services/actions/actionAuth";
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
    const [enableTwoFactorAuthenticator, setEnableTwoFactorAuthenticator] = useState(JSON.parse(process.env.REACT_APP_WITH_TWO_FACTOR_AUTHENTICATOR));
    const [capChaValue, setCapChaValue] = useState('');
    const [formValues, setFormValues] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [disableLogin, setDisableLogin] = useState(true);
    const dispatch = useDispatch();
    const login = useSelector(state => state.reducerAuth);
    const [showVerifyCode, setShowVerifyCode] = useState(false);
    const langPrefix = "login";
    const [isLoadingVerifyCode, setIsLoadingVerifyCode] = useState(false);
    const [disableVerifyCode, setDisableVerifyCode] = useState(true);

    const onHandleSubmit = (evt) => {
        evt && evt.preventDefault();
        setIsLoading(true);
        dispatch(actLoginRequest({...formValues, capChaValue: capChaValue}));
    };

    const handleSubmitVerifyCode = (evt) => {
        evt && evt.preventDefault();
        setIsLoadingVerifyCode(true);
        if (!disableVerifyCode)
            dispatch(actLoginVerifyOTPRequest({...formValues}));
    };

    const onHandleChange = (name, value) => {
        setFormValues({...formValues, [name]: value});
    };

    const onCapChaHandleChange = (value) => {
        setCapChaValue(value === null ? '' : value);
    };

    const resetCapCha = () => {
        captcha && captcha.reset();
        setCapChaValue('');
        setDisableLogin(true)
    };

    const reDirect = (defaultPath) => {
        history.go(defaultPath);
    };

    const handleSignInWithAnotherAccount = (evt) => {
        evt && evt.preventDefault();
        setShowVerifyCode(false);
        setIsLoading(false);
        setDisableLogin(true);
        setFormValues({...formValues, verifyCode: '', verifyCodeId: constants.EmptyGuidId, username: '', password: ''});
    };

    useEffect(() => {
        if (formValues && formValues.username && formValues.password && capChaValue)
            setDisableLogin(false);
    }, [formValues.username, formValues.password, capChaValue]);

    useEffect(() => {
        if (formValues && formValues.verifyCode)
            setDisableVerifyCode(false);
        else
            setDisableVerifyCode(true);
    }, [formValues.verifyCode]);

    useEffect(() => {
        const defaultPath = login.isSuccess ? localStorage.getItem(constants.DefaultPathName) : '';
        if (login && !login.isSuccess) {
            setIsLoading(false);
            setDisableLogin(false);
            setIsLoadingVerifyCode(false);
            if (login.errorMessage)
                alertMessage(`${t('general.error')}`, login.errorMessage, true);
            resetCapCha();
        } else if (login && login.isSuccess) {
            if (enableTwoFactorAuthenticator === true && (defaultPath === undefined || defaultPath === null)) {
                setShowVerifyCode(true);
                setFormValues({...formValues, verifyCodeId: login.verifyCodeId})
            } else if ((enableTwoFactorAuthenticator === false && defaultPath) || (enableTwoFactorAuthenticator === true && defaultPath)) {
                reDirect(defaultPath);
            }
        }
    }, [login]);

    return (
        <div className={`login-box ${siteKey === '' ? `login-box-without-capcha` : ``}`}>
            <div className="text-center">
                <Title level={2}>{t(`${langPrefix}.login_form_title`)}</Title>
                <img src={logo} alt="logo"/>
            </div>
            {!showVerifyCode ?
                <Form onSubmit={onHandleSubmit} className="login-form">
                    <InputText focus name="username" onChange={onHandleChange} value={formValues.username} placeholder={t(`${langPrefix}.email`)}/>
                    <InputPassword name="password" type="password" onChange={onHandleChange} value={formValues.password} placeholder={t(`${langPrefix}.password`)}/>
                    <Form.Item>
                        {siteKey !== '' && <ReCAPTCHA onChange={onCapChaHandleChange} sitekey={siteKey} ref={el => {
                            captcha = el;
                        }}/>}
                    </Form.Item>
                    <Form.Item>
                        <Button loading={isLoading} disabled={disableLogin} type="primary" htmlType="submit" className="login-form-button">
                            {t(`${langPrefix}.login_button_title`)}
                        </Button>
                    </Form.Item>
                </Form> :
                <Form onSubmit={handleSubmitVerifyCode} className="login-form-verify">
                    <Form.Item className="verify-code-back-btn">
                        <Tooltip title={t(`${langPrefix}.back_from_verify_code`)}>
                            <Button onClick={handleSignInWithAnotherAccount} shape="circle" icon="arrow-left" type="dashed"/>
                        </Tooltip>
                    </Form.Item>
                    <Form.Item className="verify-code">
                        <InputText onSubmit={handleSubmitVerifyCode} focus name="verifyCode" onChange={onHandleChange} value={formValues.verifyCode} placeholder="OTP Code"/>
                    </Form.Item>
                    <Form.Item>
                        <Button loading={isLoadingVerifyCode} disabled={disableVerifyCode} type="primary" htmlType="submit" className="login-form-button">
                            {t(`${langPrefix}.btn_verify_otp`)}
                        </Button>
                    </Form.Item>
                </Form>
            }
        </div>
    );
};