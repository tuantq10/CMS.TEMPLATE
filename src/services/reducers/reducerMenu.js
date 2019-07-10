import * as Types from '../../commons/constants/types';

let defaultState = {
    menus: [],
    menusWithPermission: [],
    allMenus: []
};

export const reducerMenu = (state = defaultState, action) => {
    switch (action.type) {
        case Types.MENU_LIST_ACTION:
            return {...state, menus: action.menus, menusWithPermission: action.menusWithPermission};
        case Types.MENU_ALL:
            if (action.allMenus) {
                state.allMenus = action.allMenus;
            }
            return {...state};
        default:
            return {...state};
    }
};