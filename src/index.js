import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainCheck from './pages/MainCheck';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './commons/localization/i18n';
import { Provider } from 'react-redux';
import store from './services/store/index';
//lib
import 'toastr/toastr';
//css
import 'toastr/toastr.scss';
import 'antd/dist/antd.less';


ReactDOM.render(
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
            <Router>
                <MainCheck/>
            </Router>
        </I18nextProvider>
    </Provider>
    , document.getElementById('root'));
