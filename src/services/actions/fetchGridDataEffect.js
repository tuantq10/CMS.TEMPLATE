import axios from 'axios';
import { useEffect, useRef, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { callAuthApi, authApi } from '../../commons/utils/apiCaller';
import { alertMessage, detectReturnMessage, buildQueryStringFetchData } from '../../commons/utils/function';

export const fetchGridDataEffect = (fetchUrl, removeUrl, sortColumnMapping, callbackRemoved, initialQueryParams, initialData, onDeleted) => {
    const {t} = useTranslation();
    const isMounted = useRef(true);

    initialQueryParams = {
        pageIndex: 1,
        pageSize: 10,
        orderBy: '',
        searchTerm: '',
        orderByDesc: false,
        ...(initialQueryParams || {})
    };

    initialData = initialData || {
        data: [],
        paging: {
            pageIndex: 1,
            totalPages: 0
        }
    };

    const [queryParams, setQueryParams] = useState(initialQueryParams);
    const [filterParams, setFilterParams] = useState({});
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [removeId, setRemoveId] = useState('');

    const fetchData = async (abortController) => {
        const source = axios.CancelToken.source();
        if (!abortController) {
            abortController = new AbortController();
        }
        abortController.signal.addEventListener('abort', () => {
            source.cancel('canceled');
        });
        setIsLoading(true);

        try {
            if (fetchUrl) {
                if (!queryParams.orderBy && sortColumnMapping && Object.keys(sortColumnMapping).length > 0)
                    queryParams.orderBy = `${sortColumnMapping[0]}`;

                var filterQuery = buildQueryStringFetchData(filterParams);
                filterQuery += buildQueryStringFetchData(queryParams);

                const apiUrl = `${fetchUrl}?rdk=1${filterQuery}`;
                const result = await authApi({url: apiUrl, cancelToken: source.token});

                if (isMounted.current) {
                    setData(result && result.data ? result.data : initialData);
                }
            }
        } catch (error) {
        }

        setIsLoading(false);
    };

    useEffect(() => {
        let abortController = null;
        (async () => {
            if (abortController) return;
            isMounted.current = true;
            abortController = new AbortController();
            fetchData(abortController);
        })();
        return () => {
            if (abortController) {
                isMounted.current = false;
                abortController.abort();
            }
        };
    }, [queryParams, fetchUrl]);

    const removeData = async () => {
        setIsDeleting(true);
        let isSuccess = false;
        let msg = '';

        try {
            const apiUrl = `${removeUrl}/${removeId}`;
            const result = await callAuthApi(apiUrl, {}, 'DELETE');

            if (result.status === 200) {
                isSuccess = (result && result.data);
                if (isSuccess) {
                    reloadGrid();
                    onDeleted && onDeleted();
                }
            } else {
                msg = detectReturnMessage(result.data.errors);
            }
        } catch (error) {
        }

        setRemoveId('');
        setIsDeleting(false);
        callbackRemoved && callbackRemoved();
        alertMessage(`${t(isSuccess ? 'general.success' : 'general.failed')}`, msg || t(isSuccess ? 'general.messageSuccess' : 'general.errorGeneral'), !isSuccess);
    };

    useEffect(() => {
        removeId && removeId.length === 36 && removeData();
    }, [removeId]);

    const changePageIndex = (pageIndex) => {
        setQueryParams({...queryParams, pageIndex: pageIndex});
    };

    const changePageSize = (pageSize) => {
        queryParams.pageSize !== pageSize && setQueryParams({...queryParams, pageSize: pageSize, pageIndex: 1});
    };

    const changeSortBy = (sortCol, isDesc) => {
        const sortField = sortColumnMapping[sortCol];
        const sortBy = sortField && sortField !== '' ? sortField : '';

        queryParams.sortBy !== sortBy && setQueryParams({...queryParams, orderBy: sortBy, orderByDesc: isDesc, pageIndex: 1});
    };

    const changeKeySearch = (keySearch, evt) => {
        queryParams.searchTerm !== keySearch && setQueryParams({...queryParams, searchTerm: keySearch, pageIndex: 1});
        evt && evt.preventDefault();
    };

    const reloadGrid = (isEdited) => {
        if (isEdited) {
            setQueryParams({...queryParams});
        } else {
            setQueryParams({...queryParams, pageIndex: 1});
        }
    };

    const changeFilterParams = (qParams) => {
        setFilterParams(qParams);
        setQueryParams({...queryParams, pageIndex: 1});
    };

    return {
        data,
        isLoading,
        isDeleting,
        reloadGrid,
        changePageIndex,
        changeSortBy,
        changeKeySearch,
        setRemoveId,
        changeFilterParams,
        changePageSize,
    };
};