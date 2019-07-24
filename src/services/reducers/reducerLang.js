import * as Types from "../../commons/constants/types";
import i18n from "../../commons/localization/i18n";

const initParam = {lang: i18n.language || window.localStorage.i18nextLng || process.env.REACT_APP_DEFAULT_LANGUAGE};

export const reducerLang = (state = initParam, action) => {
    switch (action.type) {
        case Types.VI_LANGUAGE:
            return {...state, lang: action.lang};
        case Types.EN_LANGUAGE:
            return {...state, lang: action.lang};
        default:
            return {...state};
    }
};