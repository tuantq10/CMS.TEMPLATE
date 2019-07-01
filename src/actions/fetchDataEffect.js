import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { authApi } from '../utils/apiCaller';
import { buildQueryStringFetchData } from '../utils/function';


export const fetchDataEffect = (url, initialQueryParams) => {
    const isMounted = useRef(true);
    initialQueryParams = initialQueryParams || {};

    const [queryParams, setQueryParams] = useState(initialQueryParams);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [reloadFlag, setReloadFlag] = useState(0);

    const fetchData = async (abortController) => {
        if (url) {
            const source = axios.CancelToken.source();
            abortController.signal.addEventListener('abort', () => {
                source.cancel('canceled');
            });

            setIsLoading(true);
            setIsLoaded(false);

            try {
                const filterQuery = buildQueryStringFetchData(queryParams);
                const apiUrl = `${url}?rdk=1${filterQuery}`;
                const result = await authApi({url: apiUrl, cancelToken: source.token});

                if (isMounted.current) {
                    setData(result && result.data && result.data.data ? result.data.data : []);
                }
            } catch (error) {
            }

            setIsLoading(false);
            setIsLoaded(true);
        } else if (data && data.length > 0) {
            setData([]);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        let abortController = null;
        (async () => {
            if (abortController) return;
            abortController = new AbortController();
            fetchData(abortController);
        })();
        return () => {
            isMounted.current = false;
            abortController && abortController.abort();
        };
    }, [reloadFlag, url, queryParams]);

    const reloadData = () => {
        setReloadFlag(Math.random());
    };

    return {
        data,
        queryParams,
        isLoading,
        isLoaded,
        changeQueryParams: setQueryParams,
        reloadData,
    };
};