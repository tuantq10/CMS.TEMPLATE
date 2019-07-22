import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { Table, Button, Modal, Card, Form, Row, Col, Collapse, Icon } from 'antd';
import { fetchGridDataEffect } from "../../../services/actions/fetchGridDataEffect";
import { constants } from '../../constants/constants';
import { buildMultipleQueryParams } from "../../utils/function";
import { WrapText, WrapLink } from '../CustomComponents/CustomComponents';
import { AddButton, IconButtonX } from "../Button";
import { Paginate } from '../Paginate';
import './GridDataPage.less'
import { TableSearch } from "../Input";


const GridDataPage = ({fetchEndpoint, deleteEndpoint, sortColumnMapping, tableColumns, UpsertPopup, upsertExtraParams, langPrefix, upsertPopupWidth, filterParams, defaultSortBy, actionInGrid, toolbarBtns, filterComponents, reloadGridFlag, reloadPageIndex, onGridActionDone, className, history}) => {
    const {t} = useTranslation();
    const {confirm} = Modal;
    const initialUpsertPopupState = {id: '', open: false, submit: false, clear: false};
    
    actionInGrid = {
        allowInsert: false, allowUpdate: false, allowDelete: false, upsertRoute: '', allowSearch: true, addBtnOnHeader: false,
        selectionRender: null, actions: [], disablePaging: false, isReadOnly: false, showAdvanceSearch: true, ...(actionInGrid || {})
    };

    const [sortByParam, setSortByParams] = useState(defaultSortBy || {});
    const [ddlFilterParams, setDDLFilterParams] = useState({});
    const [upsertPopupState, setUpsertPopupState] = useState(initialUpsertPopupState);
    const [tableCxt, setTableCxt] = useState(null);

    const {data, isLoading, isDeleting, reloadGrid, changePageIndex, changeSortBy, changeKeySearch, changeFilterParams, setRemoveId, changePageSize} = fetchGridDataEffect(fetchEndpoint, deleteEndpoint || fetchEndpoint, sortColumnMapping, undefined, filterParams, undefined, onGridActionDone);

     


    if (!!actionInGrid) {
        useEffect(() => {
            isLoading && tableCxt && setTableCxt(null);
        }, [isLoading]);

        useEffect(() => {
            reloadGridFlag > 0 && reloadGrid(true);
        }, [reloadGridFlag]);

        useEffect(() => {
            reloadPageIndex > 0 && changePageIndex(1);
        }, [reloadPageIndex]);
    }

    const buildTableColumns = (cols) => {
        let result = [];
        if (cols && cols.length > 0) {
            result = cols.map((item, idx) => {
                if (sortColumnMapping && sortColumnMapping[[idx]]) {
                    item['defaultSortOrder'] = 'descend';
                    item['sorter'] = (a, b) => a.dataIndex - b.dataIndex;
                }
                if (item.isEditableField) {
                    item.render = (text, record) => actionInGrid.allowUpdate && !record.isTotalRow && !record.editable
                        ? <WrapLink onClick={() => handleEditClick(record.id)} text={text}/>
                        : <WrapText text={record.isTotalRow ? <span>{t('general.total')}</span> : text}/>
                } else {
                    if (item.isBeginTotal) {
                        item.render = (text, record, index) => (record.isTotalRow ? <span>{t('general.total')}</span> : {
                            children: <WrapText text={text}/>,
                            props: {colSpan: cols.length},
                        })
                    }
                }

                return item;
            });
        }
        if (actionInGrid.allowUpdate || actionInGrid.allowDelete || actionInGrid.actions.length > 0) {
            let cellItemCount = actionInGrid.actions.length + (actionInGrid.allowUpdate ? 1 : 0) + (actionInGrid.allowDelete ? 1 : 0);
            result.push({
                title: actionInGrid.allowInsert && actionInGrid.addBtnOnHeader ? <AddButton onClick={handleAddClick}/> : <span></span>,
                width: `${cellItemCount * constants.ActionGridItemWidth}px`,
                align: 'end',
                render: (record) => (
                    <div className="nk-grid-cell-actions">
                        {!record.isTotalRow && actionInGrid.actions.length > 0 && actionInGrid.actions.map((x, idx) => {
                            return (!x.checkShow || x.checkShow(record)) ?
                                <IconButtonX txt={x.txt} ico={x.ico} disabled={!!x.disabled} onClick={() => x.onClick(record)} skin={x.skin || "dashed"} key={idx}/> : null
                        })}
                        {!record.isTotalRow && actionInGrid.allowUpdate && !record.editable &&
                        <IconButtonX txt={actionInGrid.actionEditTitle || t('general.titlePopUpEdit')} ico={actionInGrid.actionEditIcon || "edit"} onClick={() => handleEditClick(record.id)}
                                     skin={actionInGrid.actionEditSkin || "dashed"}/>
                        }
                        {!record.isTotalRow && actionInGrid.allowDelete && !record.editable &&
                        <IconButtonX txt={t('general.titlePopUpDelete')} ico={"delete"} onClick={() => handleDeleteClick(record.id)} skin="dashed"/>
                        }
                    </div>
                )
            });
        }
        return result;
    };

    const handleSortClick = (colNum) => {
        const isDesc = !sortByParam[colNum];
        setSortByParams({[colNum]: isDesc});
        changeSortBy(colNum, isDesc);
    };

    const handleAddClick = () => {
        if (actionInGrid.upsertRoute) {
            history.push(actionInGrid.upsertRoute);
        } else {
            setUpsertPopupState({...initialUpsertPopupState, open: true});
        }
    };

    const handleEditClick = (id) => {
        if (actionInGrid.upsertRoute) {
            history.push(`${actionInGrid.upsertRoute}/${id}`);
        } else {
            setUpsertPopupState({...initialUpsertPopupState, id: id, open: true});
        }
    };

    const handleDeleteClick = (id) => {
        actionInGrid.allowDelete && showConfirmDeleteRecord(id)

    };

    const handleFilter = (name, value, removeKeys) => {
        if (removeKeys && removeKeys.length > 0) {
            let previousDdlFilterParams = ddlFilterParams;
            removeKeys.map(removeKey => {
                if (Array.isArray(previousDdlFilterParams)) {
                    previousDdlFilterParams.map((filterValue, index) => {
                        delete filterValue[removeKey]
                    })
                } else {
                    delete previousDdlFilterParams[removeKey]
                }
            });
            setDDLFilterParams(previousDdlFilterParams);
        }
        if (Array.isArray(value)) {
            setDDLFilterParams(buildMultipleQueryParams(value, name, ddlFilterParams));
            changeFilterParams(buildMultipleQueryParams(value, name, ddlFilterParams));
        } else {
            setDDLFilterParams({[name]: value});
            changeFilterParams({[name]: value});
        }
    };

    const onHandleChange = (pagination, filters, sorter) => {
        handleSortClick(sorter.columnKey)
    };

    const onUpsertPopupClose = () => {
        setUpsertPopupState(initialUpsertPopupState);
    };

    const onUpsertPopupClear = () => {
        setUpsertPopupState({...upsertPopupState, clear: true});
    };

    const onUpsertPopupSubmit = () => {
        setUpsertPopupState({...upsertPopupState, submit: true});
    };

    const onUpsertPopupCleared = () => {
        setUpsertPopupState({...upsertPopupState, submit: false, clear: false});//allow re-clear
    };

    const onUpsertPopupSubmitted = (isSuccess) => {
        if (isSuccess) {
            setUpsertPopupState(initialUpsertPopupState);
            reloadGrid(upsertPopupState.id !== '' && upsertPopupState.id.length === 36);
        } else {
            setUpsertPopupState({...upsertPopupState, submit: false, clear: false});//allow re-submit
        }
    };

    function showConfirmDeleteRecord(id) {
        confirm({
            title: t('general.deletePopUpTitle'),
            content: t('general.deletePopUpBody'),
            onOk() {
                setRemoveId(id);
            },
            onCancel() {
            },
            okType: 'danger',
        });
    }

    const countIgnoreEmptyId = (selectedRowKeys) => {
        const filteredSelectedId = selectedRowKeys.filter(x => x !== '' && x.id !== constants.EmptyGuidId);
        setTableCxt(filteredSelectedId);
    };
    
    const rowSelection = {
        selectedRowKeys: tableCxt,
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys) {
                countIgnoreEmptyId(selectedRowKeys)
            }
        },
    };
    
    const {Panel} = Collapse;
    const renderMainToolbar = () => {
        let colNum = 24;
        if (actionInGrid.allowInsert || toolbarBtns)
        {
            colNum = 22;
        }
        return (
            <Fragment>
                <Col span={colNum}>
                    <Row gutter={26} type="flex" justify="end">
                        {
                            (filterComponents || []).map((x, k) => {
                                if (!actionInGrid.showAdvanceSearch || (actionInGrid.showAdvanceSearch && filterComponents.length > 3 && k <= 2)) {
                                    return (
                                        <Col span={6} key={k}>
                                            <Form.Item key={k}>
                                                {x.render(handleFilter, ddlFilterParams)}
                                            </Form.Item>
                                        </Col>
                                    );
                                }
                            })
                        }
                        <Col span={6} key="search-form">
                            <Form.Item key="search-form">
                                {actionInGrid.allowSearch && <TableSearch onSearch={changeKeySearch} helpText={actionInGrid.searchHelpText}/>}
                            </Form.Item>
                        </Col>
                    </Row>
                    {actionInGrid.showAdvanceSearch && filterComponents && filterComponents.length > 3 && <Collapse bordered={false}>
                        <Panel header="Advance Search" key="1" className="filter-panel" extra={<Icon type="search"/>}>
                            <Row gutter={28} type="flex" justify="start">
                                {
                                    (filterComponents || []).map((x, k) => {
                                        if (filterComponents.length > 3 && k >= 3) {
                                            return (
                                                <Col span={6} key={k}>
                                                    <Form.Item key={k}>
                                                        {x.render(handleFilter, ddlFilterParams)}
                                                    </Form.Item>
                                                </Col>
                                            );
                                        }
                                    })
                                }
                            </Row>
                        </Panel>
                    </Collapse>}
                </Col>
                {(actionInGrid.allowInsert || toolbarBtns) &&
                <Col span={2}>
                    <Row type="flex" justify="center">
                        <Form.Item key="add-button">
                            {actionInGrid.allowInsert && <AddButton onClick={handleAddClick}/>}
                        </Form.Item>
                        {toolbarBtns}
                    </Row>
                </Col>}
            </Fragment>
        );
    };

    const renderMainBulkToolbar = () => {
        return (
            <Fragment>
                <Col span={24}>
                    <Row type="flex" justify="end">
                        {actionInGrid.selectionRender && actionInGrid.selectionRender(tableCxt)}
                    </Row>
                </Col>
            </Fragment>
        );
    };

    return (
        <Fragment>
            {(actionInGrid.allowInsert || actionInGrid.allowUpdate) && !actionInGrid.upsertRoute &&
            <Modal width={upsertPopupWidth || 550} centered
                   destroyOnClose={true}
                   visible={upsertPopupState.open}
                   title={upsertPopupState.id === '' ? `${t('general.titlePopUpAdd')}` : (`${actionInGrid.actionEditTitle || t('general.titlePopUpEdit')}`)}
                   onCancel={onUpsertPopupClose}
                   footer={[
                       <Button key="back" onClick={() => upsertPopupState.id === '' ? onUpsertPopupClear() : onUpsertPopupClose()}>
                           {upsertPopupState.id === '' ? `${t('general.btnClear')}` : `${t('general.btnClose')}`}
                       </Button>,
                       <Button key="submit" type="primary" disabled={upsertPopupState.submit || actionInGrid.isReadOnly} onClick={onUpsertPopupSubmit}>
                           {t('general.btnSave')}
                       </Button>
                   ]}
                   confirmLoading={upsertPopupState.submit || actionInGrid.isReadOnly}
                   okButtonProps={{disabled: upsertPopupState.submit || actionInGrid.isReadOnly}}
            >
                <div className="modal-body">
                    <UpsertPopup id={upsertPopupState.id} {...upsertExtraParams || {}}
                                 isSubmitButtonClick={upsertPopupState.submit}
                                 isClearButtonClick={upsertPopupState.clear}
                                 callbackSubmitted={onUpsertPopupSubmitted}
                                 callbackCleared={onUpsertPopupCleared}
                                 onUpserted={onGridActionDone}
                                 langPrefix={langPrefix}
                                 isReadOnly={actionInGrid.isReadOnly}/>

                </div>
            </Modal>
            }
            <div
                className={`div_nk_grid ${actionInGrid.addBtnOnHeader ? `div_nk_grid_no_head` : ''} ${!actionInGrid.allowInsert && !actionInGrid.allowUpdate && !actionInGrid.allowDelete ? `padding_latest_col` : ''} ${!!actionInGrid.selectionRender ? `first_col_is_checkbox` : ''} ${className || ""}`}>
                <Card bordered={false}>
                    <Form className="filter-search-form">
                        <Row gutter={8}>
                            {!actionInGrid.addBtnOnHeader && !actionInGrid.selectionRender ? renderMainToolbar() : !!actionInGrid.selectionRender
                            && tableCxt && tableCxt.length > 0 ? renderMainBulkToolbar() : renderMainToolbar()
                            }
                        </Row>
                    </Form>
                </Card>
                <Table rowSelection={!!actionInGrid.selectionRender ? rowSelection : null}
                       pagination={false}
                       rowKey={record => record.id}
                       dataSource={data.data}
                       columns={buildTableColumns(tableColumns)}
                       loading={isLoading}
                       rowClassName={record => record.isTotalRow ? "grid-total-row" : null}
                       onChange={onHandleChange}
                />
                {!actionInGrid.disablePaging &&
                <div className="grid-paginate">
                    <Paginate currentPage={data.paging ? data.paging.pageIndex : 1} totalPage={data.paging ? data.paging.totalPages : 0} totalItems={data.paging ? data.paging.totalCount : 0}
                              onHandleClick={changePageIndex} onHandleChangePageSize={changePageSize}/>
                </div>}
            </div>
        </Fragment>
    );
};

export default withRouter(GridDataPage);