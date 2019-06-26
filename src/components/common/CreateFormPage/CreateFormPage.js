import React, { forwardRef, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { Button } from "antd";
import Card from "wix-style-react/Card";
import { MessageBoxFunctionalLayout } from "wix-style-react/dist/src/MessageBox";
import Modal from 'wix-style-react/Modal';
import { constants } from "../../../constants/constants";
import { getIdFromPath, pushUrlWithClearClass, validPermission } from "../../../utils/function";
import { LoadingPanel } from '../CommonComponents/CommonComponents';


const CreateFormPageX = ({ currentRoutePath, UpsertPopup, langPrefix, upsertExtraParams, isDetailPage, hideClearBtn, onDelete, forwardCallback, callbackIsReadOnlyForm, className, history, forwardRef }) => {
    const { t } = useTranslation();
    const initialUpsertPopupState = { id: '', submit: false, clear: false, delete: false, hideClearBtn: !!hideClearBtn, };

    const [removePopupState, setRemovePopupState] = useState({ submiting: false, isOpen: false });
    const [upsertPopupState, setUpsertPopupState] = useState(initialUpsertPopupState);
    const [hideSubmitBtn, setHideSubmitBtn] = useState(!!(upsertExtraParams && upsertExtraParams.isReadOnly));

    const idFromUrl = getIdFromPath(history);
    useEffect(() => {
        if (!idFromUrl) {
            onUpsertPopupClear()
        }
    }, [idFromUrl]);

    useEffect(() => {
        setHideSubmitBtn(upsertExtraParams && upsertExtraParams.isReadOnly)
    }, [upsertExtraParams && upsertExtraParams.isReadOnly]);

    const handleIsReadOnlyForm = (isReadOnly) => {
        callbackIsReadOnlyForm && callbackIsReadOnlyForm(isReadOnly);
        setHideSubmitBtn(isReadOnly);
    };

    const onUpsertPopupClear = () => {
        setUpsertPopupState({ ...upsertPopupState, clear: true });
    };

    const onUpsertPopupSubmit = () => {
        setUpsertPopupState({ ...upsertPopupState, submit: true });
    };

    const onUpsertPopupCleared = () => {
        if (!!isDetailPage) {
            let oldUrlId = getIdFromPath(history);
            if (oldUrlId) { pushUrlWithClearClass(history, history.location.pathname.replace(oldUrlId, '')); }
        }
        setUpsertPopupState({ ...upsertPopupState, submit: false, clear: false });//allow re-clear
    };

    const onUpsertPopupSubmitted = (isSuccess, dataId) => {
        if (isSuccess) {
            if (!!isDetailPage && dataId) {
                let oldUrlId = getIdFromPath(history);
                if (oldUrlId !== dataId)
                    pushUrlWithClearClass(history, `${history.location.pathname}/${dataId}`);
            }
        }
        setUpsertPopupState(initialUpsertPopupState);
    };

    const handleConfirmDelete = () => {
        setRemovePopupState({ submiting: false, isOpen: true });
    };

    const handleCloseDelete = () => {
        setRemovePopupState({ submiting: false, isOpen: false });
    };

    const handleDelete = () => {
        setRemovePopupState({ submiting: true, isOpen: true });
        onDelete(upsertExtraParams.id);
    };

    return (
        <Fragment>
            {!!onDelete &&
            <Modal
                isOpen={removePopupState.isOpen}
                onRequestClose={handleCloseDelete}
            >
                <MessageBoxFunctionalLayout
                    onCancel={handleCloseDelete}
                    onOk={handleDelete}
                    confirmText={t('general.btnConfirmPopUpDeleteOK')}
                    cancelText={t('general.btnConfirmPopUpDeleteCancel')}
                    title={t('general.deletePopUpTitle')}
                    theme="red" buttonsHeight="medium"
                >
                    {removePopupState.submiting && <LoadingPanel />}
                    {t('general.deletePopUpBody')}
                </MessageBoxFunctionalLayout>
            </Modal>
            }
            {validPermission(constants.Permissions.Insert, currentRoutePath) &&
            <div className={`${gcss.div_nk_form} ${className || ''}`}>
                <Card>
                    <Card.Content>
                        <UpsertPopup
                            id={upsertPopupState.id}
                            isSubmitButtonClick={upsertPopupState.submit}
                            isClearButtonClick={upsertPopupState.clear}
                            callbackSubmitted={onUpsertPopupSubmitted}
                            callbackCleared={onUpsertPopupCleared}
                            callbackIsReadOnlyForm={handleIsReadOnlyForm}
                            forwardCallback={forwardCallback}
                            langPrefix={langPrefix}
                            {...upsertExtraParams || {}}
                            ref={forwardRef}
                        />
                    </Card.Content>
                    {(!upsertPopupState.hideClearBtn || !hideSubmitBtn || !!onDelete) &&
                    <Fragment>
                        <Card.Divider />
                        <Card.Content>
                            <div className={gcss.div_nk_form_button_area}>
                                {!!onDelete &&
                                <Button onClick={handleConfirmDelete} skin="destructive" size="medium">{t('general.btnDelete')}</Button>
                                }
                                {!upsertPopupState.hideClearBtn &&
                                <Button onClick={onUpsertPopupClear} priority="secondary" size="medium">{t(`general.${isDetailPage ? 'btnClearAndCreateNew' : 'btnClear'}`)}</Button>
                                }
                                {!hideSubmitBtn &&
                                <Button onClick={onUpsertPopupSubmit} size="medium">{t('general.btnSave')}</Button>
                                }
                            </div>
                        </Card.Content>
                    </Fragment>
                    }
                </Card>
            </div>
            }
        </Fragment>
    );
};
const CreateFormPage = withRouter(CreateFormPageX, { withRef: true });
export default forwardRef((props, ref) => {
    return <CreateFormPage {...props} forwardRef={ref} />;
});