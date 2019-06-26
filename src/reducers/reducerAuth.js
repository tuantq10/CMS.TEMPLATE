import * as Types from '../constants/types';
import {constants} from "../constants/constants";

const defaultSate = {
    logged: !!(localStorage.getItem(constants.AuthenKey)),
    profile: {},
    isSuccess: false,
    email: localStorage.getItem(constants.Email),
    errorMessage: ''
};

export const reducerAuth = (state = defaultSate, action) => {
    switch (action.type) {
        case Types.LOGIN_AUTH:
            const {login} = action;
            if (login) {
                state.isSuccess = login.isSuccess;
                state.errorMessage = login.errorMessage;
            }
            return {...state};
        default:
            return {...state};
    }
};