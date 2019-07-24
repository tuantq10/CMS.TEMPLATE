import { combineReducers } from "redux";
import { reducerAuth } from './reducerAuth';
import { reducerMenu } from './reducerMenu';
import { reducerLang } from "./reducerLang";

export default combineReducers({
    reducerAuth,
    reducerMenu,
    reducerLang,
});