import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './Main';
import LoginRoute from './LoginRoute';
import PrivateRoute from './PrivateRoute';
import { clearAllCache, alertMessage, buildReturnUrl, setLoginLocalStorage } from "../commons/utils/function";
import { constants } from "../commons/constants/constants";
import * as moment from 'moment';
import i18n from '../commons/localization/i18n';
import { endpoint } from "../commons/constants/endpoint";
import { callAuthApi } from "../commons/utils/apiCaller";
import { withRouter } from "react-router-dom";

class MainCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshTokenFailedTime: 0,
            timeOutId: null,
            defaultPath: '',
        };
    }

    onCallReFreshToken = async () => {
        const {refreshTokenFailedTime, timeOutId} = this.state;
        let interValTime = constants.ErrorTimeRefreshToken;
        try {
            const validTo = localStorage.getItem(constants.ValidTo);
            const lastedTimeCallAPI = localStorage.getItem(constants.LastTimeAPICalled);
            const currentDateTime = moment().format(constants.DateTimeFormatFromDB);
            // if ((lastedTimeCallAPI !== undefined || lastedTimeCallAPI !== null || lastedTimeCallAPI !== '') && refreshTokenFailedTime < 5 && timeOutId !== null && (moment(currentDateTime) - moment(lastedTimeCallAPI)).valueOf() <= parseInt(validTo)) {
            if ((lastedTimeCallAPI !== undefined || lastedTimeCallAPI !== null || lastedTimeCallAPI !== '') && refreshTokenFailedTime < 5 && timeOutId !== null) {
                const returnData = await callAuthApi(endpoint.refreshToken, {"refreshToken": localStorage.getItem(constants.RefreshToken)}, 'POST');
                const isSuccess = returnData && returnData.status === 200 && returnData.data && returnData.data;
                if (isSuccess) {
                    const expirationDate = moment.utc(returnData.data.expires).local().format(constants.DateTimeFormatFromDB);
                    setLoginLocalStorage({
                        [`${constants.AuthenKey}`]: returnData.data.accessToken,
                        [`${constants.RefreshToken}`]: returnData.data.refreshToken,
                        [`${constants.TokenExpiration}`]: moment.utc(returnData.data.expires).local().format(constants.DateTimeFormatFromDB),
                    });
                    const currentDateTime = moment().add(3, 'minutes').format(constants.DateTimeFormatFromDB);
                    interValTime = (moment(expirationDate) - moment(currentDateTime)).valueOf();
                }
                this.createNewTimeOutAction(interValTime, isSuccess ? 0 : refreshTokenFailedTime);
            } else
                this.actionClearAndRedirectLogin();
        } catch (e) {
            this.createNewTimeOutAction(interValTime, refreshTokenFailedTime);
        }
    };

    createNewTimeOutAction(time, errorTime = 0) {
        const {timeOutId} = this.state;
        if (timeOutId)
            clearTimeout(timeOutId);
        const newTimeOutId = setTimeout(() => this.onCallReFreshToken(), time);
        this.setState({timeOutId: newTimeOutId, refreshTokenFailedTime: errorTime + 1});
    }

    actionClearAndRedirectLogin = () => {
        const {history} = this.props;
        const {timeOutId} = this.state;
        if (timeOutId) {
            clearTimeout(timeOutId);
            clearAllCache();
            this.setState({
                timeOutId: null,
                refreshTokenFailedTime: 0,
            });
            alertMessage(i18n.t("general.failed"), i18n.t("general.errorTokenExpired"), true);
            setTimeout(() => buildReturnUrl(history, '/login', true), constants.TimeToDirectToLoginPage);
        }
    };

    setTimeOutToCallRefreshToken = () => {
        let result = 0;
        const expirationDate = localStorage.getItem(constants.TokenExpiration);
        const currentDateTime = moment().add(3, 'minutes').format(constants.DateTimeFormatFromDB);
        if (expirationDate === undefined || expirationDate === null || expirationDate === '') {
            this.actionClearAndRedirectLogin()
        } else {
            result = (moment(expirationDate) - moment(currentDateTime)).valueOf();
        }
        return result;
    };

    getDefaultPath = () => {
        let result = localStorage.getItem(constants.ReturnUrl);
        if (result === null || result === '')
            result = localStorage.getItem(constants.DefaultPathName);
        if (result === null || result === '') {
            result = '/login';
            clearAllCache();
        }
        return result
    };

    getPathParam = () => {
        let result = '';
        const id = localStorage.getItem(constants.ReturnUrlId);
        if (id !== null && id !== '')
            result = constants.Slash + id;
        return result;
    };

    componentDidMount() {
        const {history} = this.props;
        const {timeOutId} = this.state;
        const timeToStart = this.setTimeOutToCallRefreshToken();
        const isLoginPage = history.location.pathname === '/login';
        const defaultPath = (history.location.pathname === constants.Slash || history.actions === "REPLACE") ? this.getDefaultPath() + this.getPathParam() : '';
        if (defaultPath) {
            this.setState({defaultPath: defaultPath});
            history.push(defaultPath);
        }
        if (!isNaN(timeToStart) && timeToStart > 0 && timeOutId === null && !isLoginPage) {
            this.createNewTimeOutAction(timeToStart);
        }
        if (!isLoginPage) {
            localStorage.removeItem(constants.ReturnUrl);
            localStorage.removeItem(constants.ReturnUrlId);
        }
    }

    generateRoute = (path) => {
        if (path) {
            switch (path) {
                //dashboard
                case '/login':
                    return Layout.Login;
                case '/dashboard':
                    return Layout.Dashboard;

                //reports
                case '/report-mice-booking-by-status':
                    return Layout.ANoOfMiceBookingStatus;
                case '/report-mice-revenue-by-component':
                    return Layout.BMiceRevenueByComponents;
                case '/report-booking-and-revenue-by-sales-man':
                    return Layout.CMiceBookingsRevenueBySalesMan;
                case '/report-booking-and-revenue-by-industry':
                    return Layout.DMiceBookingsRevenueByIndustry;
                case '/guest-room-type-calendar':
                    return Layout.FGuestRoomTypeCalendar;

                // Sales Management
                case '/venue-calendar':
                    return Layout.VenueCalendar;
                case '/create-booking':
                    return Layout.CreateBooking;
                case '/booking-list-management':
                    return Layout.BookingListManagement;

                // Service Management
                case '/service-list':
                    return Layout.ServiceList;
                case '/create-service':
                    return Layout.CreateServiceItem;

                // Account
                case '/account-list':
                    return Layout.AccountList;
                case '/create-account':
                    return Layout.CreateAccountList;

                // Setting
                case '/property-list':
                    return Layout.PropertyList;
                case '/create-property':
                    return Layout.CreateProperty;
                case '/venue-list':
                    return Layout.VenueList;
                case '/create-venue':
                    return Layout.CreateVenue;
                case '/highlight':
                    return Layout.HighLight;
                case '/maintenance':
                    return Layout.Maintenance;
                case '/service-category-list':
                    return Layout.ServiceCategoryList;
                case '/industry-list':
                    return Layout.IndustryList;
                case '/area-list':
                    return Layout.AreaList;
                case '/chain-list':
                    return Layout.ChainList;
                case '/venue-setup-list':
                    return Layout.VenueSetUpList;
                case '/event-type':
                    return Layout.EventTypeList;
                case '/contact-role':
                    return Layout.ContactRole;
                case '/sales-area':
                    return Layout.SalesArea;
                case '/lead-source':
                    return Layout.LeadSource;

                // User Management
                case '/users':
                    return Layout.Users;
                case '/create-user':
                    return Layout.CreateUser;
                case '/roles':
                    return Layout.Roles;
                default:
                    return Layout.Login;
            }
        }
    };

    render() {
        const {defaultPath} = this.state;
        const slashRoute = this.generateRoute(defaultPath);
        return (
            <Route>
                <Switch>
                    <LoginRoute path="/login" component={Layout.Login}/>
                    {defaultPath && <PrivateRoute path="/" exact component={slashRoute}/>}
                    <PrivateRoute path="/demo" component={Layout.Demo}/>
                    {/*User Management*/}
                    <PrivateRoute path="/roles" component={Layout.Roles}/>
                    <PrivateRoute path="/create-user" component={Layout.CreateUser}/>
                    <PrivateRoute path="/users" component={Layout.Users}/>
                    {/*Setting*/}
                    <PrivateRoute path="/area-list" component={Layout.AreaList}/>
                    <PrivateRoute path="/chain-list" component={Layout.ChainList}/>
                    <PrivateRoute path="/property-list" component={Layout.PropertyList}/>
                    <PrivateRoute path="/create-property" component={Layout.CreateProperty}/>
                    <PrivateRoute path="/venue-setup-list" component={Layout.VenueSetUpList}/>
                    <PrivateRoute path="/venue-list" component={Layout.VenueList}/>
                    <PrivateRoute path="/create-venue" component={Layout.CreateVenue}/>
                    <PrivateRoute path="/service-category-list" component={Layout.ServiceCategoryList}/>
                    <PrivateRoute path="/industry-list" component={Layout.IndustryList}/>
                    <PrivateRoute path="/service-list" component={Layout.ServiceList}/>
                    <PrivateRoute path="/create-service" component={Layout.CreateServiceItem}/>
                    <PrivateRoute path="/account-list" component={Layout.AccountList}/>
                    <PrivateRoute path="/create-account" component={Layout.CreateAccountList}/>
                    <PrivateRoute path="/highlight" component={Layout.HighLight}/>
                    <PrivateRoute path="/maintenance" component={Layout.Maintenance}/>
                    <PrivateRoute path="/venue-calendar" component={Layout.VenueCalendar}/>
                    <PrivateRoute path="/reports" component={Layout.Reports}/>
                    <PrivateRoute path="/booking-list-management" component={Layout.BookingListManagement}/>
                    <PrivateRoute path="/contact-role" component={Layout.ContactRole}/>
                    <PrivateRoute path="/sales-area" component={Layout.SalesArea}/>
                    <PrivateRoute path="/lead-source" component={Layout.LeadSource}/>
                    {/*report*/}
                    <PrivateRoute path="/dashboard" component={Layout.Dashboard}/>
                    <PrivateRoute path="/report-mice-booking-by-status" component={Layout.ANoOfMiceBookingStatus}/>
                    <PrivateRoute path="/report-mice-revenue-by-component" component={Layout.BMiceRevenueByComponents}/>
                    <PrivateRoute path="/report-booking-and-revenue-by-sales-man" component={Layout.CMiceBookingsRevenueBySalesMan}/>
                    <PrivateRoute path="/report-booking-and-revenue-by-industry" component={Layout.DMiceBookingsRevenueByIndustry}/>
                    <PrivateRoute path="/guest-room-type-calendar" component={Layout.FGuestRoomTypeCalendar}/>
                    <PrivateRoute path="/create-booking" component={Layout.CreateBooking}/>
                    <PrivateRoute path="/event-type" component={Layout.EventTypeList}/>
                    <Route path='' exact={false} component={Layout.PageNotFound}/>
                </Switch>
            </Route>
        );
    }
}

export default withRouter(MainCheck);

