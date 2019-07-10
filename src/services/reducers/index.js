import { combineReducers } from "redux";
import { reducerAuth } from './reducerAuth';
import { reducerMenu } from './reducerMenu'

export default combineReducers({
    reducerAuth,
    reducerMenu,
});