import axios from 'axios';
import { constants } from "../constants/constants";
import { validErrorCode } from "./function";
import { alertMessage } from "./function";
import i18n from '../localization/i18n';
import * as moment from 'moment';
import { endpoint as urlEndpoint } from "../constants/endpoint";

export const callApi = (endpoint, token = null, body = {}, method = 'GET', cancelToken = null, isDownLoadFile = false) => {
    if (endpoint !== urlEndpoint.refreshToken)
        setLastedTimeCallAPI();
    return axios({
        method: method,
        data: body,
        url: `${process.env.REACT_APP_API_URL}${endpoint}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: {
                toString() {
                    return `Bearer ${token}`
                }
            }
        },
        responseType: isDownLoadFile ? 'blob' : '', // important
        ...(cancelToken ? { cancelToken: cancelToken } : {})
    }).catch(err => {
        if (!err.response && (!err.message || err.message !== 'canceled') && endpoint !== urlEndpoint.refreshToken) {
            alertMessage(`${i18n.t('general.error')}`, `${i18n.t('general.connectionError')}`, true);
        } else {
            validErrorCode(err.response && err.response.status);
        }
        return err.response;
    });
};

export const callAuthApi = (endpoint, body = {}, method = 'GET') => {
    const token = localStorage.getItem(constants.AuthenKey);
    return callApi(endpoint, token, body, method);
};

export const authApi = ({ url, body, method, cancelToken }) => {
    const token = localStorage.getItem(constants.AuthenKey);
    return callApi(url, token, body || {}, method || 'GET', cancelToken);
};

export const callAuthApiWithPaging = (endpoint, pagging = {}, body = {}, method = 'GET', isDownLoadFile = false) => {
    const token = localStorage.getItem(constants.AuthenKey);
    endpoint = (endpoint.endsWith(constants.Slash) ? endpoint : endpoint + constants.Slash) + '?rdk=1';
    endpoint += pagging.pageIndex !== undefined && pagging.pageIndex !== '' ? constants.AndSymbol + constants.PageIndexEndPoint + pagging.pageIndex : '';
    endpoint += pagging.pageSize !== undefined && pagging.pageSize !== '' ? constants.PageSizeEndPoint + pagging.pageSize : '';
    endpoint += pagging.searchTerm !== undefined && pagging.searchTerm !== '' ? constants.SearchEndPoint + pagging.searchTerm : '';
    if (pagging.sortData !== undefined) {
        const key = Object.keys(pagging.sortData)[0];
        const value = pagging.sortData[key] ? 'DESC' : 'ASC';
        endpoint += pagging.sort ? constants.SortBy + key + " " + value : '';
    }
    if (pagging.customQueryParams !== undefined && pagging.customQueryParams !== '') {
        endpoint += pagging.customQueryParams.startsWith(constants.AndSymbol) ? pagging.customQueryParams : constants.AndSymbol + pagging.customQueryParams

    }
    return callApi(endpoint, token, body, method, null, isDownLoadFile);
};

const setLastedTimeCallAPI = () => {
    localStorage.setItem(constants.LastTimeAPICalled, moment().format(constants.DateTimeFormatFromDB));
};