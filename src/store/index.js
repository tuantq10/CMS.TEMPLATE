import 'regenerator-runtime/runtime'
import {createStore, applyMiddleware} from 'redux';

// const sagaMiddleware = createSagaMiddleware();
// const reduxDevTools =
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
import appReducers from "../reducers/index";
import thunk from 'redux-thunk';

export default createStore(appReducers, applyMiddleware(thunk));