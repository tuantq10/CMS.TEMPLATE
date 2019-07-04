import { callApi, callAuthApi } from "../utils/apiCaller";
import { endpoint } from "../constants/endpoint";
import { validErrorCode, setLoginLocalStorage } from "../utils/function";
import { constants } from "../constants/constants";
import * as Types from '../constants/types';
import * as moment from 'moment';

export const actLoginRequest = (login) => {
    return dispatch => {
        if (login) {
            let redirectRoute = '';
            const data = {
                "Username": login.email,
                "Password": login.password,
                // "gRecaptchaResponse": login.capChaValue,
            };
            callApi(endpoint.auth, null, data, 'POST').then(res => {
                validErrorCode(res.status);
                login.isSuccess = res.status === 200;
                let token = '';
                if (login.isSuccess) {
                    localStorage.setItem(constants.AuthenKey, res.data.token);
                    callAuthApi(endpoint.profile).then(res => {
                        if (res.status === 200) {
                            const data = res.data.data;
                            setLoginLocalStorage({
                                [`${constants.Email}`]: login.email,
                                [`${constants.CurrentUserId}`]: data.id,
                                [`${constants.CurrentUserName}`]: data.username,
                                // [`${constants.AccessibleProperties}`]: JSON.stringify(res.data.data.accessibleProperties),
                                // [`${constants.TokenExpiration}`]: moment.utc(res.data.data.expiration).local().format(constants.DateTimeFormatFromDB),
                                // [`${constants.ValidTo}`]: res.data.data.validTo,
                                // [`${constants.IsRoleAllowChangeSIC}`]: res.data.data.isRoleAllowChangeSIC
                            });
                            if (constants.routes) {
                                const firstRoute = constants.routes[0];
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
                } else {
                    login.errorMessage = res.data.errors;
                    dispatch(actLogin(login));
                }
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