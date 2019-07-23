import { callApi, callAuthApi } from "../../commons/utils/apiCaller";
import { endpoint } from "../../commons/constants/endpoint";
import { validErrorCode, setLoginLocalStorage, setProfileLocalStorage, buildMenuFromSimpleToComplex, getErrorMessage } from "../../commons/utils/function";
import { constants } from "../../commons/constants/constants";
import * as Types from '../../commons/constants/types';
import * as moment from 'moment';
import { routes } from "../../commons/route/route";

export const actLoginRequest = (login) => {
    return dispatch => {
        if (login) {
            const loginWithTwoFactor = JSON.parse(process.env.REACT_APP_WITH_TWO_FACTOR_AUTHENTICATOR);
            const data = {
                "UserName": login.username,
                "Password": login.password,
                "GoogleCaptchaResponse": login.capChaValue,
            };
            if (loginWithTwoFactor === true) {
                callApi(endpoint.auth2Factor, null, data, 'POST').then(res => {
                    login.isSuccess = res && res.status === 200;
                    if (login.isSuccess && res.data && res.data.data && res.data.data.length === 36) {
                        login.verifyCodeId = res.data.data;
                        dispatch(actLoginWithVerifyCode(login));
                    } else {
                        login.errorMessage = getErrorMessage(res);
                        dispatch(actLogin(login));
                    }
                });
            } else {
                callApi(endpoint.auth, null, data, 'POST').then(res => {
                    login.isSuccess = res && res.status === 200;
                    if (login.isSuccess) {
                        dispatch(setLocalStorageAndGetRoute(res, login));
                    } else {
                        login.errorMessage = getErrorMessage(res);
                        dispatch(actLogin(login));
                    }
                });
            }
        }
    }
};

export const actLoginVerifyOTPRequest = (login) => {
    return dispatch => {
        if (login) {
            const data = {
                "verifyCodeId": login.verifyCodeId,
                "verifyCode": login.verifyCode,
            };
            callApi(endpoint.verifyCode, null, data, 'POST').then(res => {
                login.isSuccess = res && res.status === 200;
                if (login.isSuccess) {
                    dispatch(setLocalStorageAndGetRoute(res, login));
                } else {
                    login.errorMessage = getErrorMessage(res);
                    dispatch(actLogin(login));
                }
            });
        }
    }
};

const setLocalStorageAndGetRoute = (res, login) => {
    return dispatch => {
        let redirectRoute = '';
        setLoginLocalStorage({
            [`${constants.AuthenKey}`]: res.data.accessToken,
            [`${constants.RefreshToken}`]: res.data.refreshToken,
            [`${constants.Email}`]: login.email,
            [`${constants.CurrentUserId}`]: res.data.userId,
            [`${constants.TokenExpiration}`]: moment.utc(res.data.expires).local().format(constants.DateTimeFormatFromDB),
        });
        callAuthApi(endpoint.profile).then(res => {
            if (res.status === 200) {
                const resData = res.data.data;
                const userPermissions = resData.permissions;
                setProfileLocalStorage({
                    [`${constants.CurrentUserName}`]: resData.username,
                    [`${constants.FullName}`]: resData.fullName,
                });
                const data = buildMenuFromSimpleToComplex(routes, userPermissions);
                if (data && data[0]) {
                    const firstRoute = data[0];
                    if (firstRoute) {
                        const route = firstRoute.permissions && firstRoute.permissions.length > 0 ? firstRoute : firstRoute.routes[0];
                        if (route) {
                            redirectRoute = constants.Slash + route.route;
                            localStorage.setItem(constants.DefaultPathName, redirectRoute);
                        }
                    }
                }
            }
        }).then(() => {
            dispatch(actLogin(login));
        })
    }
};

const actLoginWithVerifyCode = (login) => {
    return {
        type: Types.LOGIN_WITH_VERIFY_CODE,
        login
    }
};

// action Response
const actLogin = (login) => {
    return {
        type: Types.LOGIN_AUTH,
        login
    }
};

export const actLogoutRequest = () => {
    return dispatch => {
        callAuthApi(endpoint.logout, {}, "GET").then(res => {
        });
    }
};