import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

import { general_en, general_vn } from './translate/General';
import { login_en, login_vn } from "./translate/Login";
import { menu_en, menu_vn } from "./translate/Menu";
import { dashboard_en, dashboard_vn } from "./translate/Dashboard";
import { serviceList_en, serviceList_vn } from "./translate/ServiceList";
import { profile_en, profile_vn } from "./translate/Profile";
import { roles_en, roles_vn } from "./translate/Roles";
import { error_en, error_vn } from "./translate/Error";
import { user_en, user_vn } from "./translate/Users";
import { audits_en, audits_vn } from "./translate/Audits";

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "general": general_en,
                    "login": login_en,
                    "menu": menu_en,
                    "dashboard": dashboard_en,
                    "serviceList": serviceList_en,
                    "profile": profile_en,
                    "roles": roles_en,
                    "error": error_en,
                    "users": user_en,
                    "audits": audits_en,
                }
            },
            vn: {
                translation: {
                    "general": general_vn,
                    "login": login_vn,
                    "menu": menu_vn,
                    "dashboard": dashboard_vn,
                    "serviceList": serviceList_vn,
                    "roles": roles_vn,
                    "error": error_vn,
                    "users": user_vn,
                    "audits": audits_vn,
                }
            }
        },
        lng: i18n.language || window.localStorage.i18nextLng || process.env.REACT_APP_DEFAULT_LANGUAGE,
        fallbackLng: process.env.REACT_APP_DEFAULT_LANGUAGE,
        interpolation: {
            formatSeparator: ','
        },
        react: {
            wait: true,
            omitBoundRerender: false,
            nsMode: 'default',
        },
    });

export default i18n;