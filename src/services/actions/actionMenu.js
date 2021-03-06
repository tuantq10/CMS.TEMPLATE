import * as Types from '../../commons/constants/types';
import { endpoint } from "../../commons/constants/endpoint";
import { callAuthApi } from "../../commons/utils/apiCaller";
import { validErrorCode, buildMenuFromSimpleToComplex } from "../../commons/utils/function";
import { constants } from "../../commons/constants/constants";
import { routes } from "../../commons/route/route";

export function loadMenuRequest() {
    return (dispatch) => {
        return callAuthApi(endpoint.profile).then(res => {
            validErrorCode(res.status);
            if (res.status === 200 && res.data.data) {
                const menusAfterFormat = buildMenuFromSimpleToComplex(routes, res.data.data.permissions);
                let {menus, menusWithPermission} = getMenu(menusAfterFormat);
                dispatch(loadMenu(menus, menusWithPermission));
            }
        });
    }
}

function loadMenu(menus, menusWithPermission) {
    return {
        type: Types.MENU_LIST_ACTION,
        menus,
        menusWithPermission
    }
}

function generateEachMenu(title, path, exact = true, main = "") {
    let result = {};
    if (title && path) {
        result = {
            'title': title,
            'path': path,
            'exact': exact,
        }
    }
    return result;
}

function parseMenuString(listObjectMenu) {
    let returnListString = [];
    if (listObjectMenu && listObjectMenu.length > 0) {
        listObjectMenu.map((value, index) => {
            let combineString = '';
            if (value && value.route) {
                combineString += value.route + ",";
                if (value.routes) {
                    const listRoutes = value.routes;
                    listRoutes.map((value, index) => {
                        if (value && 'route' in value) {
                            combineString += value.route + ",";
                        }
                    })
                }
            }
            if (combineString && combineString !== '') {
                returnListString.push(combineString.endsWith(',') ? combineString.substr(0, combineString.length - 1) : combineString);
            }
        })
    }
    return returnListString;
}

function getMenu(menus) {
    let result = [];
    const listMenu = parseMenuString(menus);
    if (listMenu) {
        listMenu.map((i, k) => {
            if (i) {
                let arr = i.split(",");
                if (arr && arr.length > 0) {
                    let arr_sub = [];
                    let menu_object = generateEachMenu(constants.Slash + arr[0], constants.Slash + arr[0]);
                    if (arr.length > 1) {
                        arr.map((str, index) => {
                            if (index > 0) {
                                arr_sub.push(generateEachMenu(constants.Slash + arr[index], constants.Slash + arr[index]));
                            }
                        });
                        if (arr_sub && arr_sub.length > 0) {
                            menu_object['sub'] = arr_sub;
                        }
                    }
                    result.push(menu_object);
                }
            }
        });
    }
    return {menus: result, menusWithPermission: menus};
}

export function actGetAllMenuRequest() {
    return dispatch => {
        // return callAuthApi(endpoint.allMenu).then(res => {
        //     validErrorCode(res.status);
        //     if (res.status === 200 && res.data && res.data.data) {
        //         const listMenu = parseMenuString(res.data.data);
        //         return dispatch(actGetAllMenuResponse(listMenu));
        //     }
        // });
        return dispatch(actGetAllMenuResponse(routes));
    }
}

function actGetAllMenuResponse(allMenus) {
    return {
        type: Types.MENU_ALL,
        allMenus
    }
}