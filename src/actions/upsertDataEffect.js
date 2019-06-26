import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { callAuthApi } from '../utils/apiCaller';
import { alertMessage, detectReturnMessage } from '../utils/function';

export const upsertDataEffect = (url, editId, callbackSubmitted, callbackCleared, validateRule, initialFormValues, rebaseFormValues, ignore404, isWarningResult) => {
    const { t } = useTranslation();

    const [formValues, setFormValues] = useState(initialFormValues || {});
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFetch404, setIsFetch404] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        editId && editId.length === 36 && fetchData();
    }, []);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
            saveData();
        } else
            callbackSubmitted && callbackSubmitted(false);
    }, [formErrors]);

    const handleClear = (ignoreCallbackClear) => {
        setIsSubmitting(false);
        setFormValues(initialFormValues || {});
        setFormErrors({});
        !ignoreCallbackClear && callbackCleared && callbackCleared();
    };

    const handleSubmit = (evt) => {
        setFormErrors(validate(formValues));
        setIsSubmitting(true);
        evt && evt.preventDefault();
    };

    const handleSubmitWithFormValues = (fValues) => {
        setFormValues(fValues);
        setFormErrors(validate(fValues));
        setIsSubmitting(true);
    };

    const handleChange = (evt) => {
        evt.persist();
        let newFormValues = { ...formValues, [evt.target.name]: evt.target.value };
        setFormValues(newFormValues);
        //setFormErrors(validateField(newFormValues, formErrors, evt.target.name));
    };

    const handleChangeVal = (name, value) => {
        let newFormValues = { ...formValues, [name]: value };
        setFormValues(newFormValues);
        //setFormErrors(validateField(newFormValues, formErrors, name));
    };

    const validate = (values) => {
        let errors = {};

        (validateRule['requireds'] || []).map(x => {
            if (!values[x] || values[x].length === 0) {
                errors[x] = 'Is required';
            }
        });

        (validateRule['validate'] || []).map(x => {
            if (!errors[x.field]) {
                var error = x.func(values[x.field], values);
                if (error)
                    errors[x.field] = error;
            }
        });

        if (errors && Object.keys(errors).length > 0)
            alertMessage(t('general.failed'), t('general.fillUpErrorField'), true);

        return errors;
    };

    const validateField = (values, errors, name) => {
        delete errors[name];

        (validateRule['requireds'] || []).filter(x => x === name).map(x => {
            if (!values[x] || values[x].length === 0) {
                errors[x] = 'Is required';
            }
        });

        (validateRule['validate'] || []).filter(x => x.field === name).map(x => {
            if (!errors[x.field]) {
                var error = x.func(values[x.field], values);
                if (error)
                    errors[x.field] = error;
            }
        });

        return errors;
    };

    const fetchData = async () => {
        setIsLoading(true);
        setIsFetch404(false);
        try {
            const apiUrl = `${url}/${editId}`;
            const result = await callAuthApi(apiUrl);

            setFormValues(result && result.data && result.data.data ? result.data.data : initialFormValues);
            setIsFetch404(result.status === 404);
            if (!ignore404 && result.status === 404) {
                alertMessage(t('general.failed'), t('general.errorItemNotFoundOrNotHadPermission'), true);
            }
        } catch (error) { }

        setIsLoading(false);
    };

    const saveData = async () => {
        setIsLoading(true);
        let isSuccess = false;
        let id = '';
        let msg = '';
        try {
            const isUpdate = editId && editId.length === 36;
            const apiUrl = `${url}/${editId}`;

            const result = await callAuthApi(apiUrl, formValues, isUpdate ? 'PUT' : 'POST');

            if (result.status === 200) {
                if (rebaseFormValues) {
                    isSuccess = result && result.data && result.data.data.id && result.data.data.id.length === 36;
                    if (isSuccess) {
                        id = result.data.data.id;
                        setFormValues(result.data.data);
                    }
                } else {
                    isSuccess = result && result.data && ((result.data.data && typeof result.data.data === "boolean" && result.data.data === true) || (isUpdate ? (result.data.data === true || (result.data.data.id && result.data.data.id.length === 36)) : (result.data.data.id && result.data.data.id.length === 36)));
                    if (isSuccess) {
                        id = isUpdate ? editId : result.data.data.id;

                        if (isWarningResult && result.data.data.status > 0) {
                            result.data.data.status === 1 && alertMessage(t('general.warning'), t('general.warningVenueProspect'), true, true);
                        }
                    }
                }
            } else {
                msg = detectReturnMessage(result.data.errors);
            }
        } catch (error) { }

        setIsLoading(false);
        callbackSubmitted && callbackSubmitted(isSuccess, id);
        alertMessage(`${t(isSuccess ? 'general.success' : 'general.failed')}`, msg || t(isSuccess ? 'general.messageSuccess' : 'general.errorGeneral'), !isSuccess);
    };

    return {
        formValues,
        formErrors,
        isLoading,
        isFetch404,
        setFormValues,
        handleChange,
        handleChangeVal,
        handleClear,
        handleSubmit,
        handleSubmitWithFormValues,
    };
};