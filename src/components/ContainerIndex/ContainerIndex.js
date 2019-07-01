import React, { Component, Fragment, useEffect, useState } from 'react';
import { generateTitle } from '../../utils/function';
import { Navigation } from "../common/Navigation/Navigation";
import { SelectLang } from "../common/Header/SelectLang/SelectLang";
import { BreadcrumbGenerated } from "../common/BreadcrumbGenerated/BreadcrumbGenerated";
import { SignOut } from "../common/Header/SignOut";
import { AccountInfo } from "../common/Header/AccountInfo/AccountInfo";
import { constants } from "../../constants/constants";
import { Layout, PageHeader } from 'antd';
import useReactRouter from 'use-react-router';
import './ContainerIndex.less';

const {Header, Content, Footer} = Layout;

export const ContainerIndex = (props) => {
    const {location} = useReactRouter();
    const [purePath, setPurePath] = useState('');
    const [isEditTitle, setIsEditTitle] = useState(false);

    useEffect(() => {
        const pathName = location.pathname;
        const arrSplitPathName = pathName.split(constants.Slash);
        if (arrSplitPathName && arrSplitPathName.length > 0) {
            setPurePath(constants.Slash + arrSplitPathName[1]);
            setIsEditTitle(arrSplitPathName && arrSplitPathName.length === 3)
        }
    }, []);

    return (
        <Fragment>
            <Layout className="layout-container">
                <Navigation/>
                <Layout>
                    <Header className="header-container">
                        <PageHeader className="page-header" title={generateTitle(purePath, true, isEditTitle)}
                                    extra={[<AccountInfo key="account-info"/>, <SelectLang key="select-language"/>, <SignOut key="signOut"/>]}/>
                    </Header>
                    <Content className="content-container">
                        <BreadcrumbGenerated/>
                        <div className="content-child-container">{props.children}</div>
                    </Content>
                    <Footer className="footer-container">HMS Company © {new Date().getFullYear()}</Footer>
                </Layout>
            </Layout>
        </Fragment>
    );
};