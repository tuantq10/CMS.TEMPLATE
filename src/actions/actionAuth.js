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
                "Email": login.email,
                "Password": login.password,
                "gRecaptchaResponse": login.capChaValue,
            };
            return callApi(endpoint.auth, null, data, 'POST').then(res => {
                validErrorCode(res.status);
                login.isSuccess = res.status === 200;
                if (login.isSuccess) {
                    setLoginLocalStorage({
                        [`${constants.AuthenKey}`]: res.data.data.token,
                        [`${constants.Email}`]: login.email,
                        [`${constants.CurrentUserId}`]: res.data.data.userId,
                        [`${constants.CurrentUserName}`]: res.data.data.fullName,
                        [`${constants.AccessibleProperties}`]: JSON.stringify(res.data.data.accessibleProperties),
                        [`${constants.TokenExpiration}`]: moment.utc(res.data.data.expiration).local().format(constants.DateTimeFormatFromDB),
                        [`${constants.ValidTo}`]: res.data.data.validTo,
                        [`${constants.IsRoleAllowChangeSIC}`]: res.data.data.isRoleAllowChangeSIC
                    });
                    callAuthApi(endpoint.accessibleMenu).then(res => {
                        if (res.status === 200) {
                            const data = res.data.data;
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
                    });
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