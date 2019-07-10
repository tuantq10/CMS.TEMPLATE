import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { authApi } from '../../commons/utils/apiCaller';


export const fetchDropdownDataEffect = (initialUrl) => {
    const isMounted = useRef(true);

    const [url, setUrl] = useState(initialUrl || '');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (abortController) => {
        if (url) {
            setIsLoading(true);

            const source = axios.CancelToken.source();
            if (!abortController) { abortController = new AbortController(); }
            abortController.signal.addEventListener('abort', () => {
                source.cancel('canceled');
            });

            try {
                const result = await authApi({ url, cancelToken: source.token });
                if (isMounted.current) {
                    setData(result && result.data && result.data.data ? result.data.data : []);
                }
            } catch (error) { }

            setIsLoading(false);
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
    }, [url]);

    return { data, isLoading, changeFetchUrl: setUrl };
};