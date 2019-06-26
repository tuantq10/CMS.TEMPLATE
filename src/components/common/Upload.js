import React, { useState } from 'react';
import { Icon, Modal, Upload } from 'antd';
import { alertMessage } from "../../utils/function";
import { useTranslation } from "react-i18next";
import notFoundImage from '../../assets/images/not-available.png';
import { fetchDataEffect } from "../../actions/fetchDataEffect";
import { constants } from '../../constants/constants';
import { authApi } from '../../utils/apiCaller';

export const UploadWithPreview = ({name, value, onChange, uploadEndpoint, maxItem, disabled, newState = false, accept = constants.ImageFileAccept}) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem(constants.AuthenKey)}`
    };

    const {t} = useTranslation();
    const [previewImg, setPreviewImg] = useState({visible: false, name: '', url: ''});
    const [fileList, setFileList] = useState(value || []);

    const handleCancel = () => setPreviewImg({...previewImg, visible: false});

    const handlePreview = (file) => setPreviewImg({visible: true, name: file.name, url: file.url || file.thumbUrl});

    const handleRemove = async (file) => {
        if (!!disabled) {
            return false;
        }

        let fileName = file.percent === 100 && file.response && file.response.data && file.response.data.fileName ? file.response.data.fileName : file.fileName;
        if (fileName !== '') {
            authApi({url: uploadEndpoint, body: {fileName: fileName}, method: 'DELETE'});
        }
        return true;
    };

    const handleChange = ({file, fileList}) => {
        const status = file.status;
        if (status === 'error') {
            alertMessage(t('general.error'), t('general.errorImageUpload'), true);
        }
        if (!maxItem || fileList.length <= maxItem) {
            if (newState) {
                setFileList([...fileList]);
                onChange(name, fileList.map(x => x.percent === 100 && x.response && x.response.data));
            } else {
                onChange(name, fileList.map(x => {
                    if (x.percent === 100 && x.response && x.response.data) {
                        x = {...x, ...x.response.data};
                    }
                    return x;
                }));
            }
        }
    };

    const handleBeforeUpload = ({fileList}) => {
        if (maxItem && fileList && fileList.length > maxItem) {
            alertMessage(t('general.error'), t('general.errorFileOverLimit').replace('{0}', maxItem), true);
            return false;
        }
    };

    const uploadButton = (
        <div>
            <Icon type="plus"/>
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    return (
        <div className={`clearfix ${maxItem && maxItem === 1 ? 'ant-upload-1-img' : ''}`}>
            <Upload
                headers={headers}
                action={`${process.env.REACT_APP_API_URL}${uploadEndpoint}`}
                listType="picture-card"
                fileList={newState ? fileList : value}
                onPreview={handlePreview}
                onChange={handleChange}
                // onRemove={handleRemove}
                beforeUpload={handleBeforeUpload}
                multiple={maxItem && maxItem > 1}
                disabled={!!disabled}
                accept={accept}
            >
                {maxItem && (newState ? fileList : value).length >= maxItem ? null : uploadButton}
            </Upload>
            <Modal visible={previewImg.visible} footer={null} onCancel={handleCancel}>
                <img alt={previewImg.name} style={{width: '100%'}} src={previewImg.url}/>
            </Modal>
        </div>
    );
};