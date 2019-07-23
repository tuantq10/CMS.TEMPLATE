import * as Types from '../../commons/constants/types';
import { constants } from "../../commons/constants/constants";

const defaultSate = {
    logged: !!(localStorage.getItem(constants.AuthenKey)),
    profile: {},
    isSuccess: false,
    email: localStorage.getItem(constants.Email),
    errorMessage: '',
    verifyCodeId: constants.EmptyGuidId,
};

export const reducerAuth = (state = defaultSate, action) => {
    const {login} = action;
    switch (action.type) {
        case Types.LOGIN_AUTH:
            if (login) {
                state.isSuccess = login.isSuccess;
                state.errorMessage = login.errorMessage;
            }
            return {...state};
        case Types.LOGIN_WITH_VERIFY_CODE:
            if (login) {
                state.isSuccess = login.isSuccess;
                state.verifyCodeId = login.verifyCodeId;
            }
            return {...state};
        default:
            return {...state};
    }
};