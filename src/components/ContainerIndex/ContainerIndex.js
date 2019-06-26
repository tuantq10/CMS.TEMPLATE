import React, { Component, Fragment } from 'react';
import { generateTitle } from '../../utils/function';
import { Navigation } from "../common/Navigation/Navigation";
import { SelectLang } from "../common/Header/SelectLang/SelectLang";
import { BreadcrumbGenerated } from "../common/BreadcrumbGenerated/BreadcrumbGenerated";
import { SignOut } from "../common/Header/SignOut";
import { AccountInfo } from "../common/Header/AccountInfo/AccountInfo";
import { constants } from "../../constants/constants";
import { Layout, PageHeader } from 'antd';
import './ContainerIndex.scss';
import { withTranslation } from 'react-i18next';

const {Header, Content, Footer} = Layout;

class ContainerIndex extends Component {
    render() {
        let purePath = "";
        const pathName = this.props.children.props.location.pathname;
        const arrSplitPathName = pathName.split(constants.Slash);
        if (arrSplitPathName && arrSplitPathName.length > 0) {
            purePath = constants.Slash + arrSplitPathName[1];
        }
        return (
            <Fragment>
                <Layout className="layout-container">
                    <Navigation/>
                    <Layout>
                        <Header className="header-container">
                            <PageHeader className="page-header" title={generateTitle(purePath, true, arrSplitPathName && arrSplitPathName.length === 3)}
                                        extra={[<AccountInfo key="account-info"/>, <SelectLang key="select-language"/>, <SignOut key="signOut"/>]}/>,
                        </Header>
                        <Content className="content-container">
                            <BreadcrumbGenerated/>
                            <div className="content-child-container">{this.props.children}</div>
                        </Content>
                        <Footer className="footer-container">HMS Company © {new Date().getFullYear()}</Footer>
                    </Layout>
                </Layout>

            </Fragment>
        );
    }
}

export default withTranslation()(ContainerIndex);