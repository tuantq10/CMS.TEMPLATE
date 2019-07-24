import React, { useEffect, useState, Fragment, memo } from 'react';
import { CheckBoxCustom } from "../../commons/components/Input";
import { Row, Col, Typography } from "antd";
import { generateTitle, buildMenuFromSimpleToComplex } from "../../commons/utils/function";
import { constants } from "../../commons/constants/constants";
import { Divider } from "antd";
import { routes } from "../../commons/route/route";
import './Roles.less';
import { useTranslation } from "react-i18next";

export const RolesPermissions = memo(function RolesPermissions(props) {
    const {data, menus, isClear, setPermissionToRole} = props;
    const {t} = useTranslation();
    const {Text} = Typography;
    const [formValuesRoles, setFormValuesRoles] = useState({});
    const [formValuesParent, setFormValuesParent] = useState({});
    const [allMenus, setAllMenus] = useState(menus || []);
    const objAction = {1: 'view', 2: 'create', 3: 'update', 4: 'delete'};

    useEffect(() => {
        if (data && data.length > 0 && Object.keys(formValuesRoles).length === 0) {
            buildCheckBoxStatus(buildMenuFromSimpleToComplex(routes, data, false));
        }
    }, [data]);

    useEffect(() => {
        if (isClear) {
            setFormValuesRoles({});
            setFormValuesParent({});
        }
    }, [isClear]);

    //------------------------build check permission data --------------------------

    const buildCheckBoxStatus = (data) => {
        let oldFormValuesParent = {};
        let oldFormValuesChild = {};
        data.map((returnDataValue, index) => {
            const routeName = returnDataValue.route;
            const permissions = returnDataValue.permissions;
            permissions.map((v, i) => {
                const chkName = objAction[v];
                if (allMenus.filter(x => x.route === routeName).length === 0)
                    oldFormValuesChild = {...oldFormValuesChild, [`${routeName}_${chkName}`]: true}
            });
        });
        allMenus.map((route, index) => {
            let totalPermissionPerRoute = 0;
            let totalPermissionCheck = 0;
            if (route) {
                const loopChildMenu = route.routes && route.routes.length > 0 ? route.routes : [];
                const parent = route.route;
                loopChildMenu.map((childRoutesValue, index) => {
                    const childPermission = childRoutesValue.permissions;
                    const childRouteName = childRoutesValue.route;
                    if (childRoutesValue && childPermission && childPermission.length > 0) {
                        totalPermissionPerRoute += childPermission.length;
                    }
                    childPermission.map((eachPermissions, i) => {
                        const chkName = objAction[eachPermissions];
                        totalPermissionCheck += oldFormValuesChild[`${childRouteName}_${chkName}`] === true ? 1 : 0;
                    });

                });
                oldFormValuesParent = {...oldFormValuesParent, [`${parent}_${objAction[1]}`]: data.filter(x => x.route === parent).length > 0 && totalPermissionCheck === totalPermissionPerRoute};
            }
        });
        const currentChildRoles = {...formValuesRoles, ...oldFormValuesChild};
        const currentParentRoles = {...formValuesParent, ...oldFormValuesParent};
        setFormValuesRoles(currentChildRoles);
        setFormValuesParent(currentParentRoles);
        buildObjectRequestAddRole(currentChildRoles, currentParentRoles);
    };

    //------------------------------------------------------------------------------

    //------------------------action for parent checkbox----------------------------

    const handleCheckForChild = (name, value) => {
        const currentFormValues = {...formValuesRoles, [name]: value};
        setFormValuesRoles({...currentFormValues});
        let routeName = '';
        if (name && name.split('_') && name.split('_').length > 1)
            routeName = name.split('_')[0];
        checkChangeParent(routeName, currentFormValues);
    };

    const checkChangeParent = (role, currentFormValues) => {
        if (role) {
            let menuByRole = [];
            let totalPermissionPerRoute = 0;
            let parentRoleName = '';
            allMenus && allMenus.map((route, i) => {
                if (route) {
                    const arrRoute = route.routes && route.routes.length > 0 ? route.routes : [];
                    const routeName = route.route;
                    arrRoute.map((eachRoute, index) => {
                        if (eachRoute && eachRoute.route === role) {
                            parentRoleName = routeName;
                            menuByRole = arrRoute;
                            return false;
                        }
                    });
                }
            });
            if (menuByRole.length > 0) {
                menuByRole.map((childRoutesValue, index) => {
                    if (childRoutesValue && childRoutesValue.permissions && childRoutesValue.permissions.length > 0) {
                        totalPermissionPerRoute += childRoutesValue.permissions.length;
                    }
                });
                const arrChildMenu = menuByRole;
                if (arrChildMenu.length > 0) {
                    let allRoleKeys = [];
                    arrChildMenu.map((value, index) => {
                        const routeChildName = value.route;
                        allRoleKeys.push(Object.keys(currentFormValues).filter(function (k) {
                            return k.startsWith(routeChildName);
                        }).reduce((result, key) => ({...result, [key]: currentFormValues[key]}), {}));
                    });
                    if (allRoleKeys.length > 0) {
                        let newFormValuesParent = {};
                        if (allRoleKeys.length === arrChildMenu.length) {
                            let isCheckParent = false;
                            let totalPermission = 0;
                            Object.entries(allRoleKeys).map((value, index) => {
                                if (value && value.length === 2) {
                                    const childPermissions = Object.entries(value[1]);
                                    if (childPermissions && childPermissions.length > 0) {
                                        childPermissions.map((value, index) => {
                                            value.map((childValue, index) => {
                                                if (childValue === true) {
                                                    totalPermission += 1
                                                }
                                            })
                                        });
                                    }
                                }
                            });
                            isCheckParent = totalPermission === totalPermissionPerRoute;
                            newFormValuesParent = {...formValuesParent, [`${parentRoleName}_${objAction[1]}`]: isCheckParent};
                            setFormValuesParent(newFormValuesParent);
                            buildObjectRequestAddRole(currentFormValues, newFormValuesParent);
                        } else {
                            newFormValuesParent = {...formValuesParent, [`${parentRoleName}_${objAction[1]}`]: false};
                            setFormValuesParent(newFormValuesParent);
                            buildObjectRequestAddRole(currentFormValues, newFormValuesParent);
                        }
                    }
                }
            }
        }
    };

    //-------------------------------------------------------------------------------

    //------------------------action for parent checkbox-----------------------------

    const handleCheckForParent = (name, value) => {
        const newParentFormValues = {...formValuesParent, [name]: value};
        setFormValuesParent(newParentFormValues);
        let routeName = '';
        if (name && name.split('_') && name.split('_').length > 1)
            routeName = name.split('_')[0];
        changeAll(routeName, value, newParentFormValues);
    };

    const changeAll = (name, value, parentFormValues) => {
        let listRoute = [];
        allMenus.map((route, i) => {
            if (route && route.route) {
                const arrRoute = route.routes;
                if (route.route === name && arrRoute && arrRoute.length > 0)
                    listRoute = arrRoute;
            }
        });
        if (listRoute) {
            let objChkPermission = {};
            listRoute.map((valueRoute, index) => {
                if (valueRoute) {
                    const childRouteName = valueRoute.route;
                    const permissions = valueRoute.permissions;
                    permissions.map((p, i) => {
                        objChkPermission = {...objChkPermission, [`${childRouteName}_${objAction[p]}`]: value};
                    });
                }
            });
            const newFormValues = {...formValuesRoles, ...objChkPermission};
            setFormValuesRoles(newFormValues);
            buildObjectRequestAddRole(newFormValues, parentFormValues);
        }
    };

    //--------------------------------------------------------------------------------

    //------------------build object request add role---------------------------------

    const buildCheckChangeMenu = (arr, roles) => {
        let result = arr;
        if (roles) {
            Object.entries(roles).map((value, index) => {
                if (value && value.length === 2 && value[1] === true) {
                    const menu = value[0].replace('_', '.');
                    if (menu && !result.includes(menu))
                        result.push(value[0].replace('_', '.'))
                }
            });
        }
        return result;
    };

    const buildObjectRequestAddRole = (childRoles, parentRoles) => {
        let result = [];
        // buildChildRoles
        result = buildCheckChangeMenu(result, childRoles);
        // buildParentsRoles
        result = buildCheckChangeMenu(result, parentRoles);
        if (result && result.length > 0)
            setPermissionToRole(result);
    };

    //--------------------------------------------------------------------------------

    return (
        allMenus && allMenus.map((route, i) => {
            if (route) {
                const arrRoute = route.routes;
                const routeName = route.route;
                return (
                    <Fragment key={i}>
                        {/*Parent node*/}
                        <Row gutter={48} key={route}>
                            <Col span={1}>
                                <CheckBoxCustom name={`${routeName}_${objAction[1]}`} value={formValuesParent[`${routeName}_${objAction[1]}`]} onChange={handleCheckForParent}/>
                            </Col>
                            <Col span={20} className="form-title-parent">
                                <Text strong>{generateTitle(t, `${constants.Slash + routeName}`)}</Text>
                            </Col>
                        </Row>
                        <Divider className="parent-divider"/>
                        {/*Child node*/}
                        {
                            arrRoute && arrRoute.map((childRoute, index) => {
                                const childRouteName = childRoute.route;
                                const permissions = childRoute.permissions;
                                return (
                                    <Fragment key={childRouteName + i.toString()}>
                                        <Row gutter={48} key={childRouteName} justify="end">
                                            <Col span={1}/>
                                            <Col span={8} className="form-title">
                                                <Text strong>{generateTitle(t, `${constants.Slash + childRouteName}`)}</Text>
                                            </Col>
                                            {permissions && permissions.map((permission, index) => {
                                                const chkName = objAction[permission];
                                                return (
                                                    <Fragment key={childRouteName + i.toString() + chkName}>
                                                        <Col span={1}>
                                                            <CheckBoxCustom name={`${childRouteName}_${chkName}`} value={formValuesRoles[`${childRouteName}_${chkName}`]}
                                                                            onChange={handleCheckForChild}/>
                                                        </Col>
                                                        <Col span={3} className="form-title-permission">
                                                            {chkName}
                                                        </Col>
                                                    </Fragment>
                                                )
                                            })}
                                        </Row>
                                        <Divider dashed className="child-divider"/>
                                    </Fragment>
                                )
                            })
                        }
                    </Fragment>
                );
            }
        })
    );
});