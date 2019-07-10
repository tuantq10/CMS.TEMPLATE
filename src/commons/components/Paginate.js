import React, { useState, useEffect, Fragment } from 'react';
import { Pagination } from "antd";
import parse from 'html-react-parser';

export const Paginate = ({currentPage, totalPage, totalItems, onHandleClick, onHandleChangePageSize}) => {
    const pageSizeOptions = ['10', '20', '50'];
    const [pageSize, setPageSize] = useState(parseInt(pageSizeOptions[0]));
    const [total, setTotal] = useState(0);
    const [currentPageNumber, setCurrentPageNumber] = useState(currentPage);

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
        return total > 0 ? parse(`Founded <strong>${total}</strong> item(s). Showing <strong>${range[0]}-${range[1]}</strong> of ${total} items.`) : '';
    };

    return (
        <Fragment>
            <Pagination showSizeChanger showQuickJumper onShowSizeChange={onShowSizeChange} defaultCurrent={1} total={total}
                        pageSizeOptions={pageSizeOptions} pageSize={pageSize} onChange={onHandleChange} showTotal={showTotal}
                        current={currentPageNumber} showTitle/>
        </Fragment>
    );
};