import toastr from 'toastr';
import * as moment from 'moment';
import * as numeral from 'numeral';
import isUUID from 'validator/lib/isUUID';
import i18n from "../localization/i18n";
import { constants } from "../constants/constants";
import history from '../utils/history';
import store from './../store/index';

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
    localStorage.removeItem(constants.AuthenKey);
    localStorage.removeItem(constants.Email);
    localStorage.removeItem(constants.DefaultPathName);
    localStorage.removeItem(constants.CurrentUserId);
    localStorage.removeItem(constants.CurrentUserName);
    localStorage.removeItem(constants.AccessibleProperties);
    localStorage.removeItem(constants.ValidTo);
    localStorage.removeItem(constants.TokenExpiration);
    localStorage.removeItem(constants.LastTimeAPICalled);
    localStorage.removeItem(constants.IsRoleAllowChangeSIC);
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

export const buildReturnUrl = (history, url = '/login', isExpired = false) => {
    let purePath = "";
    const pathName = history.location.pathname;
    const arrSplitPathName = pathName.split(constants.Slash);
    if (arrSplitPathName && arrSplitPathName.length > 0) {
        purePath = constants.Slash + arrSplitPathName[1];
    }
    localStorage.setItem(constants.ReturnUrl, purePath);
    if (arrSplitPathName && arrSplitPathName.length === 3 && isExpired)
        localStorage.setItem(constants.ReturnUrlId, arrSplitPathName[2]);
    clearAllCache();
    history.go(url);
};

export const removeAcent = (str) => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

export const generateTitle = (path, isCustomTitle = false, isEdit = false) => {
    if (path) {
        switch (path) {
            //dashboard
            case '/dashboard':
                return i18n.t('menu.dashboard');
            case '/reports':
                return i18n.t('menu.reports');
            case '/booking-list-management':
                return i18n.t('menu.bookinglistmanagement');

            //report
            case '/report-mice-booking-by-status':
                return i18n.t(`${isCustomTitle ? `dashboard` : `menu`}.reportMiceBookingByStatus`);
            case '/report-mice-revenue-by-component':
                return i18n.t(`${isCustomTitle ? `dashboard` : `menu`}.reportMiceRevenueByComponent`);
            case '/report-booking-and-revenue-by-sales-man':
                return i18n.t(`${isCustomTitle ? `dashboard` : `menu`}.reportBookingAndRevenueBySalesMan`);
            case '/report-booking-and-revenue-by-industry':
                return i18n.t(`${isCustomTitle ? `dashboard` : `menu`}.reportBookingAndRevenueByIndustry`);
            case '/guest-room-type-calendar':
                return i18n.t(`${isCustomTitle ? `dashboard` : `menu`}.guestRoomTypeCalendar`);

            // Sales Management
            case '/sales-management':
                return i18n.t('menu.salesmanagement');
            case '/venue-calendar':
                return i18n.t('menu.venuecalendar');
            case '/create-booking':
                return i18n.t(`menu.${isEdit ? `edit` : `create`}booking`);

            // Service Management
            case '/service-management':
                return i18n.t('menu.servicemanagement');
            case '/service-list':
                return i18n.t('menu.servicelist');
            case '/create-service':
                return i18n.t('menu.createserviceitems');

            // Account
            case '/account-management':
                return i18n.t('menu.accountmanagement');
            case '/account-list':
                return i18n.t('menu.accountlist');
            case '/create-account':
                return i18n.t(`menu.${isEdit ? `edit` : `create`}account`);

            // Setting
            case '/settings':
                return i18n.t('menu.setting');
            case '/property-list':
                return i18n.t('menu.propertylist');
            case '/create-property':
                return i18n.t('menu.createproperty');
            case '/venue-list':
                return i18n.t('menu.venuelist');
            case '/create-venue':
                return i18n.t('menu.createvenue');
            case '/highlight':
                return i18n.t('menu.highlight');
            case '/maintenance':
                return i18n.t('menu.maintenance');
            case '/service-category-list':
                return i18n.t('menu.servicecategorylist');
            case '/industry-list':
                return i18n.t('menu.industrylist');
            case '/area-list':
                return i18n.t('menu.arealist');
            case '/chain-list':
                return i18n.t('menu.chainlist');
            case '/venue-setup-list':
                return i18n.t('menu.venuesetuplist');
            case '/event-type':
                return i18n.t('menu.eventType');
            case '/contact-role':
                return i18n.t('menu.contactRole');
            case '/sales-area':
                return i18n.t('menu.salesArea');
            case '/lead-source':
                return i18n.t('menu.leadSource');

            // User Management
            case '/user-management':
                return i18n.t('menu.usermanagement');
            case '/user-list':
                return i18n.t('menu.userlist');
            case '/create-user':
                return i18n.t('menu.createuser');
            case '/role-list':
                return i18n.t('menu.rolelist');
            default:
                return i18n.t('menu.reports');
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