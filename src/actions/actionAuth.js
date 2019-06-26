import { callApi, callAuthApi } from "../utils/apiCaller";
import { endpoint } from "../constants/endpoint";
import { validErrorCode } from "../utils/function";
import { constants } from "../constants/constants";
import * as Types from '../constants/types';
import * as moment from 'moment';

export const actLoginRequest = (login) => {
    return dispatch => {
        if (login) {
            const data = {
                "Email": login.email,
                "Password": login.password,
                "gRecaptchaResponse": login.capChaValue,
            };
            return callApi(endpoint.auth, null, data, 'POST').then(res => {
                validErrorCode(res.status);
                login.isSuccess = res.status === 200;
                if (login.isSuccess) {
                    localStorage.setItem(constants.AuthenKey, res.data.data.token);
                    localStorage.setItem(constants.Email, login.email);
                    localStorage.setItem(constants.CurrentUserId, res.data.data.userId);
                    localStorage.setItem(constants.CurrentUserName, res.data.data.fullName);
                    localStorage.setItem(constants.AccessibleProperties, JSON.stringify(res.data.data.accessibleProperties));
                    localStorage.setItem(constants.TokenExpiration, moment.utc(res.data.data.expiration).local().format(constants.DateTimeFormatFromDB));
                    localStorage.setItem(constants.ValidTo, res.data.data.validTo);
                    localStorage.setItem(constants.IsRoleAllowChangeSIC, res.data.data.isRoleAllowChangeSIC);
                    callAuthApi(endpoint.accessibleMenu).then(res => {
                        if (res.status === 200) {
                            const data = res.data.data;
                            if (data && data[0]) {
                                const firstRoute = data[0];
                                if (firstRoute) {
                                    const route = firstRoute.permissions && firstRoute.permissions.length > 0 ? firstRoute : firstRoute.routes[0];
                                    if (route) {
                                        localStorage.setItem(constants.DefaultPathName, constants.Slash + route.route);
                                        window.location.pathname = constants.Slash + route.route
                                    }
                                }
                            }
                        }
                    });
                } else {
                    login.errorMessage = res.data.errors;
                }
                dispatch(actLogin(login));
            });
        }
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
        callAuthApi(endpoint.logout, {}, "DELETE").then(res => {
        });
    }
};