import React, { useState, useEffect, Fragment } from 'react';
import { Pagination, LocaleProvider } from "antd";
import parse from 'html-react-parser';
import { useTranslation } from "react-i18next";
import { useSelector, useStore } from "react-redux";
import vn from 'antd/es/locale-provider/vi_VN';
import en from 'antd/es/locale-provider/en_US';

export const Paginate = ({currentPage, totalPage, totalItems, onHandleClick, onHandleChangePageSize}) => {
    const pageSizeOptions = ['10', '20', '50'];
    const [pageSize, setPageSize] = useState(parseInt(pageSizeOptions[0]));
    const [total, setTotal] = useState(0);
    const [currentPageNumber, setCurrentPageNumber] = useState(currentPage);
    const {t} = useTranslation();
    const {lang} = useSelector(state => state.reducerLang);
    useEffect(() => {
        setCurrentPageNumber(currentPage)
    }, [currentPage]);

    useEffect(() => {
        setTotal(totalItems);
    }, [totalItems]);

    const onShowSizeChange = (current, size) => {
        setPageSize(size);
        onHandleChangePageSize(size);
    };

    const onHandleChange = (pageNumber) => {
        onHandleClick(pageNumber);
    };

    const showTotal = (total, range) => {
        return total > 0 ? parse(t("general.pagingFoundDetails").replace("{0}", total)
            .replace("{1}", range[0] + '-' + range[1]).replace("{2}", total)) : '';
    };

    return (
        <Fragment>
            <LocaleProvider locale={lang === 'vn' ? vn : en}>
                <Pagination showSizeChanger showQuickJumper onShowSizeChange={onShowSizeChange} defaultCurrent={1} total={total}
                            pageSizeOptions={pageSizeOptions} pageSize={pageSize} onChange={onHandleChange} showTotal={showTotal}
                            current={currentPageNumber} showTitle/>
            </LocaleProvider>
        </Fragment>
    );
};