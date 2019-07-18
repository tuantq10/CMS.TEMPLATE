import * as actionTypes from '../constants/actionTypes';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/dom/ajax';
import endpoint from '../../commons/constants/endpoint';

export function login() {
  return {
    type: actionTypes.LOGIN_AUTH
  };
}

function setAuth(session) {
  return {
    type: actionTypes.SET_AUTH,
    session
  };
}

export const loginEpic = (action$) =>
  action$.ofType(actionTypes.login)
    .mergeMap((action) =>
      Observable.ajax({
          crossDomain: true,
          url: endpoint.login
        })
        .map(({ response }) => setAuth(response))
    );
