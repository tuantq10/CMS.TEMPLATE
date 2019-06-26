import React from 'react';
import { Button, Tooltip, Icon } from "antd";

export const AddButton = ({onClick, title, disabled}) => {
    return (
        <IButtonX {...{onClick, title, disabled}} icon={<Icon type="plus"/>}/>
    );
};

export const IButtonX = ({onClick, title, icon, loading, disabled}) => {
    return (
        <Tooltip title={title}>
            <Button type="primary" shape="circle" onClick={onClick} loading={!!loading} disabled={!!disabled} className={!!disabled ? 'disable-button' : ''}>
                {!loading && icon}
            </Button>
        </Tooltip>
    );
};

export const IconButtonX = ({ico, txt, onClick, skin, disabled}) => {
    return (
        <Tooltip title={txt}>
            <Button onClick={onClick} icon={ico || ''} type={skin || 'dashed'} shape="circle" disabled={!!disabled}/>
        </Tooltip>
    );
};