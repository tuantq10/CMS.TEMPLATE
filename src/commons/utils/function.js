import toastr from 'toastr';
import * as moment from 'moment';
import * as numeral from 'numeral';
import isUUID from 'validator/lib/isUUID';
import i18n from "../localization/i18n";
import { constants } from "../constants/constants";
import history from './history';
import store from '../../services/store';
import cloneDeep from 'lodash/cloneDeep';

export const alertMessage = (title, messages, error = false, isWarning = false) => {
    toastr.options.closeButton = true;
    toastr.options.preventDuplicates = true;
    let messageError = [];
    if (error) {
        // if (typeof messages === "object") {
        //     Object.keys(messages).map((i) => {
        //         messages[i].map((item) => {
        //             Define.validateProduct(i) !== "" ? messageError.push('<b>' + Define.validateProduct(i) + '</b> : ' + item + '<br />') : messageError.push(item + '<br />')
        //         });
        //     });
        // } else {
        messageError = messages;
        // }
        if (isWarning)
            toastr.warning(messageError, title);
        else
            toastr.error(messageError, title);
    } else {
        toastr.success(messages, title);
    }
};

export const formatUTCDateTime = (date, formatDate = constants.DateTimeFormat) => {
    try {
        return date ? moment.utc(date).local().format(formatDate) : '';
    } catch (ex) {
    }
    return '';
};

export const formatDateTime = (date) => {
    try {
        return date ? moment(date).format(constants.DateTimeFormat) : '';
    } catch (ex) {
    }
    return '';
};

export const formatDate = (date, formatDate = constants.DateFormat) => {
    try {
        return date ? moment(date).format(formatDate) : '';
    } catch (ex) {
    }
    return '';
};

export const formatUTCTime = (date, format = constants.TimeFormat) => {
    try {
        return date ? moment.utc(date).local().format(format) : '';
    } catch (ex) {
    }
    return '';
};

export const formatTime = (date, format = constants.TimeFormat) => {
    try {
        return date ? moment(date).format(format) : '';
    } catch (ex) {
    }
    return '';
};

export const formatTimeRange = (startDate, endDate) => {
    try {
        return `${moment(startDate).format(constants.TimeFormat)} - ${moment(endDate).format(constants.TimeFormat)}`;
    } catch (ex) {
    }
    return '';
};

export const formatNum = (num) => {
    return numeral(num).format(constants.NumFormat);
};

export const getIdFromPath = (history) => {
    if (history && history.location && history.location.pathname) {
        let pathId = history.location.pathname.match(/([^\/]*)\/*$/)[1];
        if (isUUID(pathId))
            return pathId;
    }
    return '';
};

export const detectReturnMessage = (val) => {
    let textReturn = i18n.t('general.errorGeneral');
    if (typeof val === 'string') {
        const lowerString = val.toLowerCase();
        if (val.indexOf(constants.ErrorDefinedPrefix) > -1) {
            textReturn = val.replace(constants.ErrorDefinedPrefix, '');
        } else if (lowerString.indexOf(constants.ForeignKey) > -1) {
            textReturn = i18n.t('general.errorMessageIsUse');
        } else if (lowerString.indexOf(constants.EmailExsits) > -1) {
            textReturn = i18n.t('general.errorEmailExist');
        } else if (lowerString.indexOf(constants.DuplicateEntry) > -1) {
            const duplicateFiled = val.substr(val.lastIndexOf("_") + 1);
            textReturn = (duplicateFiled.endsWith('\'') ? duplicateFiled.slice(0, -1) : duplicateFiled) + i18n.t('general.errorDuplicateEntry');
        }
    }
    return textReturn;
};

export const formatComma = (val) => {
    let resultData = val;
    if (val) {
        resultData = val.toLocaleString();
    }
    return resultData
};

export const buildQueryStringFetchData = (queryParams) => {
    let filterQuery = '';
    if (queryParams.constructor.name === "Object") {
        for (const key in queryParams) {
            let value = queryParams[key];
            if (value && (typeof (value) != 'string' || value.length > 0))
                filterQuery += `&${key}=${value}`;
        }
    } else if (queryParams.constructor.name === "Array") {
        queryParams.map((value, index) => {
            const queryParamsKey = Object.keys(value)[0];
            const queryParamsValue = value[Object.keys(value)[0]];
            if (value && queryParamsKey && queryParamsValue)
                filterQuery += `&${queryParamsKey}=${queryParamsValue}`;
        });
    }
    return filterQuery;
};

export const clearAllCache = () => {
    localStorage.clear();
};

export const validErrorCode = (code) => {
    switch (code) {
        case 401:
            clearAllCache();
            history.go(constants.Slash + 'login');
            return false;
        case 403:
            alertMessage(i18n.t('general.failed'), i18n.t('general.permissionError'), true);
            return false;
        default:
            return true;
    }
};

export const buildReturnUrl = (history, url = '/login', isExpired = false, withPush = true) => {
    let purePath = "";
    const pathName = history.location.pathname;
    const arrSplitPathName = pathName.split(constants.Slash);
    if (arrSplitPathName && arrSplitPathName.length > 0) {
        purePath = constants.Slash + arrSplitPathName[1];
    }
    clearAllCache();
    localStorage.setItem(constants.ReturnUrl, purePath);
    if (arrSplitPathName && arrSplitPathName.length === 3 && isExpired)
        localStorage.setItem(constants.ReturnUrlId, arrSplitPathName[2]);
    if (withPush)
        history.go(url);
};

export const removeAccent = (str) => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

export const generateTitle = (t, path, isCustomTitle = false, isEdit = false) => {
    if (path) {
        switch (path) {
            //dashboard
            case '/dashboard':
                return t('menu.dashboard');
            case '/reports':
                return t('menu.reports');
            case '/booking-list-management':
                return t('menu.bookinglistmanagement');

            //report
            case '/report-mice-booking-by-status':
                return t(`${isCustomTitle ? `dashboard` : `menu`}.reportMiceBookingByStatus`);
            case '/report-mice-revenue-by-component':
                return t(`${isCustomTitle ? `dashboard` : `menu`}.reportMiceRevenueByComponent`);
            case '/report-booking-and-revenue-by-sales-man':
                return t(`${isCustomTitle ? `dashboard` : `menu`}.reportBookingAndRevenueBySalesMan`);
            case '/report-booking-and-revenue-by-industry':
                return t(`${isCustomTitle ? `dashboard` : `menu`}.reportBookingAndRevenueByIndustry`);
            case '/guest-room-type-calendar':
                return t(`${isCustomTitle ? `dashboard` : `menu`}.guestRoomTypeCalendar`);

            // Sales Management
            case '/sales-management':
                return t('menu.salesmanagement');
            case '/venue-calendar':
                return t('menu.venuecalendar');
            case '/create-booking':
                return t(`menu.${isEdit ? `edit` : `create`}booking`);

            // Service Management
            case '/service-management':
                return t('menu.servicemanagement');
            case '/service-list':
                return t('menu.servicelist');
            case '/create-service':
                return t('menu.createserviceitems');

            // Account
            case '/account-management':
                return t('menu.accountmanagement');
            case '/account-list':
                return t('menu.accountlist');
            case '/create-account':
                return t(`menu.${isEdit ? `edit` : `create`}account`);

            // Setting
            case '/settings':
                return t('menu.setting');
            case '/property-list':
                return t('menu.propertylist');
            case '/create-property':
                return t('menu.createproperty');
            case '/venue-list':
                return t('menu.venuelist');
            case '/create-venue':
                return t('menu.createvenue');
            case '/highlight':
                return t('menu.highlight');
            case '/maintenance':
                return t('menu.maintenance');
            case '/service-category-list':
                return t('menu.servicecategorylist');
            case '/industry-list':
                return t('menu.industrylist');
            case '/area-list':
                return t('menu.arealist');
            case '/chain-list':
                return t('menu.chainlist');
            case '/venue-setup-list':
                return t('menu.venuesetuplist');
            case '/event-type':
                return t('menu.eventType');
            case '/contact-role':
                return t('menu.contactRole');
            case '/sales-area':
                return t('menu.salesArea');
            case '/lead-source':
                return t('menu.leadSource');
            case '/languages':
                return t('menu.languages');
            // User Management
            case '/user-management':
                return t('menu.usermanagement');
            case '/users':
                return t('menu.userlist');
            case '/create-user':
                return t('menu.createuser');
            case '/roles':
                return t('menu.roles');
            default:
                return t('menu.reports');
        }
    }
};

export const validPermission = (typeOfComponent, route) => {
    const listMenus = store.getState().reducerMenu.menusWithPermission;
    let result = false;
    if (listMenus && listMenus.length > 0 && typeOfComponent && route) {
        listMenus.map((value, index) => {
            if (value && value.route) {
                if (value.route === route && value.permissions.includes(typeOfComponent)) {
                    result = true;
                    return result;
                }
                if (value.routes) {
                    const listRoutes = value.routes;
                    listRoutes.map((value, index) => {
                        if (value && value.route) {
                            if (value.route === route && value.permissions.includes(typeOfComponent)) {
                                result = true;
                                return result;
                            }
                        }
                    })
                }
            }
        })
    }
    return result;
};

store.subscribe(validPermission);

export const buildMultipleQueryParams = (arrData, prefix, exQueryParams = []) => {
    let result = [];
    if (arrData && arrData.length > 0 && prefix) {
        arrData.map((value, index) => {
            result.push({[prefix]: value})
        });
    }
    if (exQueryParams !== undefined && Array.isArray(exQueryParams)) {
        exQueryParams.map((value, index) => {
            if ((arrData && arrData.length <= 0) || (arrData && arrData.length > 0)) {
                delete value[prefix]
            }
        });
        result = [...result, ...exQueryParams]
    }
    return result;
};

export const isValidComplexity = (str) => {
    let result = false;
    const re = new RegExp("^(?=(.*\\d){1})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\\d]).{8,100}$");
    if (re.test(str)) {
        result = true;
    }
    return result;
};

export const setLoginLocalStorage = (obj) => {
    if (obj[constants.AuthenKey])
        localStorage.setItem(constants.AuthenKey, obj[constants.AuthenKey]);
    if (obj[constants.RefreshToken])
        localStorage.setItem(constants.RefreshToken, obj[constants.RefreshToken]);
    if (obj[constants.Email])
        localStorage.setItem(constants.Email, obj[constants.Email]);
    if (obj[constants.CurrentUserId])
        localStorage.setItem(constants.CurrentUserId, obj[constants.CurrentUserId]);
    if (obj[constants.TokenExpiration])
        localStorage.setItem(constants.TokenExpiration, obj[constants.TokenExpiration]);
};

export const setProfileLocalStorage = (obj) => {
    if (obj[constants.CurrentUserName])
        localStorage.setItem(constants.CurrentUserName, obj[constants.CurrentUserName]);
    if (obj[constants.FullName])
        localStorage.setItem(constants.FullName, obj[constants.FullName]);
};

export const validateFormInput = (values, validateRule) => {
    let errors = {};

    (validateRule['requireds'] || []).map(x => {
        if (!values[x] || values[x].length === 0) {
            errors[x] = 'Is required';
        }
    });

    (validateRule['validate'] || []).map(x => {
        if (!errors[x.field]) {
            let error = x.func(values[x.field], values);
            if (error)
                errors[x.field] = error;
        }
    });

    return errors;
};

const detectPermissionBaseName = (str) => {
    if (str) {
        switch (str) {
            case constants.NoPermissions.view:
                return 1;
            case constants.NoPermissions.create:
                return 2;
            case constants.NoPermissions.update:
                return 3;
            case constants.NoPermissions.delete:
                return 4;
            default:
                return 0
        }
    }
};

const buildPermissionsStringToInt = (simpleRoute, routeName) => {
    let buildPermissionByNumber = [];
    simpleRoute.map((eachSimpleRoute, index) => {
        const eachPermissionName = eachSimpleRoute.split('.');
        if (eachPermissionName && eachPermissionName.length > 0 && eachPermissionName[0] === routeName) {
            buildPermissionByNumber.push(detectPermissionBaseName(eachPermissionName[1].toLowerCase()));
        }
    });
    return buildPermissionByNumber.length > 0 ? buildPermissionByNumber.sort() : buildPermissionByNumber;
};

export const buildMenuFromSimpleToComplex = (routes, simpleRoute, buildWithParentChild = true) => {
    let result = [];
    const routesDefined = cloneDeep(routes);
    const allMenuName = [...new Set(simpleRoute.map(obj => obj.split('.').length > 0 && obj.split('.')[0]))];
    routesDefined.map((eachRoute, index) => {
        if (eachRoute) {
            const parentName = eachRoute.route;
            const childMenus = eachRoute.routes;
            if (!allMenuName.includes(parentName)) {
                if (childMenus && childMenus.length > 0) {
                    childMenus.map((eachChildMenu, index) => {
                        const childRouteName = eachChildMenu.route;
                        if (allMenuName.includes(childRouteName)) {
                            const buildPermissionByNumber = buildPermissionsStringToInt(simpleRoute, childRouteName);
                            if (eachChildMenu['permissions'].length === 0)
                                delete childMenus[index];
                            else
                                eachChildMenu['permissions'] = buildPermissionByNumber;
                        } else {
                            delete childMenus[index];
                        }
                    });
                } else {
                    const buildPermissionByNumber = buildPermissionsStringToInt(simpleRoute, parentName);
                    if (buildPermissionByNumber.length === 0)
                        delete routesDefined[index];
                    else
                        eachRoute['permissions'] = buildPermissionByNumber;
                }
            } else {
                if (allMenuName.includes(parentName)) {
                    const buildPermissionByNumber = buildPermissionsStringToInt(simpleRoute, parentName);
                    if (buildPermissionByNumber.length === 0)
                        delete routesDefined[index];
                    else
                        eachRoute['permissions'] = buildPermissionByNumber;
                } else {
                    delete routesDefined[index];
                }
            }
        }
    });

    routesDefined.map((eachParentValue, index) => {
        const childMenu = eachParentValue.routes;
        const parentPermissions = eachParentValue.permissions;
        let totalChildHasValue = 0;
        if (childMenu && childMenu.length > 0) {
            childMenu.map((eachChild, index) => {
                if (eachChild)
                    totalChildHasValue += 1;
                else
                    childMenu.splice(index, 1);
            });
        }
        if (totalChildHasValue === 0 && childMenu)
            delete routesDefined[index];
    });
    if (buildWithParentChild) {
        result = routesDefined.filter(x => x != null);
    } else {
        routesDefined.map((parentMenu, index) => {
            const childMenu = parentMenu.routes;
            result.push({
                "route": parentMenu.route,
                "permissions": parentMenu.permissions.length === 0 ? [constants.Permissions.view] : parentMenu.permissions
            });
            if (childMenu && childMenu.length > 0) {
                childMenu.map((childMenu, index) => {
                    result.push(childMenu);
                });
            }
        });
    }
    return result;
};

export const getErrorMessage = (req) => {
    let msg = '';
    if (req && req.data && req.data.errors && req.data.errors.length > 0 && req.data.errors[0]['code']) {
        msg = i18n.t(`error.${req.data.errors[0]['code']}`);
    }
    return msg;
};