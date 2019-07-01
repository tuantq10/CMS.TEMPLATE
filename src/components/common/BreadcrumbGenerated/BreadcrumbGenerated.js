import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { useSelector } from "react-redux";
import './BreadcrumbGenerated.less'
import useReactRouter from 'use-react-router';
import { generateTitle } from "../../../utils/function";


export const BreadcrumbGenerated = () => {
    const menusState = useSelector(state => state.reducerMenu);
    const [item, setItem] = useState([]);
    const {location} = useReactRouter();

    useEffect(() => {
        if (menusState !== null && menusState && menusState.menus && menusState.menus.length > 0) {
            buildBreadCrumb(menusState.menus);
        }
    }, [menusState, location.pathname]);

    const buildBreadCrumb = (menus) => {
        if (menus && menus.length > 0) {
            let parentMenu = '';
            const currentMenu = location.pathname;
            menus.map((route, index) => {
                if (route && route.sub && parentMenu === '') {
                    route.sub.map((i, k) => {
                        if (i.path === currentMenu) {
                            parentMenu = route.title;
                        }
                    });
                }
            });
            setItem([parentMenu, currentMenu]);
        }
    };

    return (
        <Breadcrumb className="breadCrumb-container" separator=">">
            {item && item.map((v, i) => {
                return (<Breadcrumb.Item key={i}>{generateTitle(v)}</Breadcrumb.Item>)
            })}
        </Breadcrumb>
    );
};