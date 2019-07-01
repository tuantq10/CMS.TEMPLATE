import React, { useEffect, useState } from 'react';
import { Icon, Layout, Menu } from 'antd';
import { constants } from "../../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { loadMenuRequest } from "../../../actions/actionMenu";
import useReactRouter from 'use-react-router';
import './Navigation.less';
import { Link } from "react-router-dom";
import { generateTitle } from "../../../utils/function";
import logo from '../../../assets/images/img-logo.jpg'

const {Sider} = Layout;
const {SubMenu} = Menu;

export const Navigation = ({isCollapsed, width}) => {
    const {location} = useReactRouter();
    const [collapsed, setCollapsed] = useState(isCollapsed || false);
    const [currentMenu, setCurrentMenu] = useState(null);
    const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
    const [menus, setMenus] = useState([]);
    const dispatch = useDispatch();
    const menusState = useSelector(state => state.reducerMenu);
    const [openKey, setOpenKey] = useState([]);

    const MenuIcon = (path) => {
        switch (path) {
            case '/':
                return <Icon type="appstore"/>;
            case '/sales-management':
                return <Icon type="shopping-cart"/>;
            case '/service-management':
                return <Icon type="share-alt"/>;
            case '/account-management':
                return <Icon type="alert"/>;
            case '/settings':
                return <Icon type="setting"/>;
            case '/user-management':
                return <Icon type="user"/>;
            case '/reports':
                return <Icon type="bar-chart"/>;
            default:
                return <Icon type="appstore"/>;
        }
    };

    useEffect(() => {
        dispatch(loadMenuRequest());
    }, []);

    useEffect(() => {
        if (menusState !== null && menusState && menusState.menus && menusState.menus.length > 0) {
            setSelectedMenu(menusState.menus);
            setMenus(menusState.menus);
        }
    }, [menusState]);

    useEffect(() => {
        setCollapsed(isCollapsed)
    }, [isCollapsed]);

    useEffect(() => {
        if (location.pathname && menusState && menusState.menus && menusState.menus.length > 0) {
            const arrSplitPathName = location.pathname.split(constants.Slash);
            if (arrSplitPathName && arrSplitPathName.length > 0) {
                setSelectedMenu(menusState.menus, constants.Slash + arrSplitPathName[1]);
            }
        }
    }, [location.pathname]);

    const onHandleMenuCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    const setSelectedMenu = (menus, pathName = '') => {
        let parentMenu = [];
        let rootSubMenu = [];
        const currentMenuPathName = pathName === '' ? location.pathname : pathName;
        if (menus && menus.length > 0) {
            menus.map((route, index) => {
                if (route && route.sub && parentMenu.length === 0) {
                    rootSubMenu.push(route.path);
                    route.sub.map((i, k) => {
                        if (i.path === currentMenuPathName) {
                            parentMenu.push(route.title);
                        }
                    });
                }
            });
            if (parentMenu.length > 0) {
                setCurrentMenu({defaultOpenKeys: [...parentMenu], selectedKeys: [currentMenuPathName], openKeys: [...parentMenu]});
                setOpenKey([...parentMenu]);
            } else {
                setCurrentMenu({openKeys: [], defaultSelectedKeys: [currentMenuPathName], selectedKeys: [currentMenuPathName]});
            }
            setRootSubmenuKeys(rootSubMenu);
        }
    };

    const showMenuContent = () => {
        let result = null;
        if (menus && menus.length > 0) {
            result = menus.map((route, index) => {
                if (route.sub) {
                    return (
                        <SubMenu key={route.path} title={
                            <span>
                                {MenuIcon(route.path)}
                                <span>{generateTitle(route.title)}</span>
                                </span>
                        }>
                            {
                                route.sub.map((i, k) => {
                                    return (
                                        <Menu.Item key={i.path}>{generateTitle(i.title)}
                                            <Link to={{pathname: i.path}}/>
                                        </Menu.Item>
                                    );
                                })
                            }
                        </SubMenu>
                    );
                } else {
                    return (
                        <Menu.Item key={route.path}>
                            <Link to={{pathname: route.path}}>
                                {MenuIcon(route.path)}
                                <span>{generateTitle(route.title)}</span>
                            </Link>
                        </Menu.Item>
                    );
                }
            });
        }
        return result
    };

    const onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => openKey && openKey.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setCurrentMenu({openKeys: openKeys.length >= 2 ? [openKeys[openKeys.length - 1]] : [...openKeys]});
            setOpenKey(openKeys.length >= 2 ? [openKeys[openKeys.length - 1]] : [...openKeys]);
        } else {
            setCurrentMenu({openKeys: latestOpenKey ? [latestOpenKey] : []});
            setOpenKey(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const onSelect = (value) => {
        let parentMenu = '';
        menus.map((route, index) => {
            if (route && route.sub && parentMenu === '') {
                route.sub.map((i, k) => {
                    if (i.path === value.key) {
                        parentMenu = route.title
                    }
                });
            }
        });
        if (rootSubmenuKeys.indexOf(parentMenu) === -1) {
            setCurrentMenu({openKeys: [''], selectedKeys: [value.key]});
            setOpenKey([]);
        } else {
            setCurrentMenu({defaultOpenKeys: [...parentMenu], selectedKeys: [value.key]});
            setOpenKey([parentMenu]);
        }
    };

    return (
        <Sider collapsible className="navigation-sider" width={width || 260} collapsed={collapsed} onCollapse={onHandleMenuCollapse}>
            <div className="logo">
                <img src={logo} alt="logo"/>
                <h1 className="logo-text">CMS Template</h1>
            </div>
            {currentMenu && <Menu theme="dark" mode="inline" {...currentMenu} onSelect={onSelect} onOpenChange={onOpenChange}>
                {menus && menus.length > 0 && showMenuContent()}
            </Menu>}
        </Sider>
    );
};